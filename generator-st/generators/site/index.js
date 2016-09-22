'use strict';

var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
require('shelljs/global');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    initializing: function () {
        this.npm = which('cnpm') ? 'cnpm' : 'npm';
        this.buildPkg = require('../../package.json');
        this.sourceCommonTemplate = path.resolve(this.sourceRoot(), '../../../', 'templates');
    },
    prompting: function () {
        var done = this.async();

        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'name:',
                default: this.appname
            },
            {
                type: 'input',
                name: 'version',
                message: 'version:',
                default: '1.0.0'
            },
            {
                type: 'input',
                name: 'desc',
                message: 'description:',
                default: function (answers) {
                    return answers.name;
                }
            },
            {
                type: 'input',
                name: 'author',
                message: 'author(@stnts.com):',
                default: 'xxx',
                filter: function (input) {
                    return input + '@stnts.com';
                }
            },
            {
                type: 'list',
                name: 'jqVersion',
                message: 'jquery version:',
                choices: [
                    {
                        name: 'jquery-1.9.1',
                        value: 1
                    },
                    {
                        name: 'jquery-2.2.4',
                        value: 2
                    }
                    //,{
                    //    name: 'zepto-1.1.6',
                    //    value: 3
                    //}
                ],
                default: 0
            },
            {
                type: 'checkbox',
                name: 'features',
                message: 'features:',
                choices: [
                    {
                        name: 'Sprite',
                        value: 'sprite',
                        checked: true
                    },
                    {
                        name: 'Less',
                        value: 'less',
                        checked: true
                    }
                ]
            },
            {
                type: 'confirm',
                name: 'skipInstall',
                message: 'install devDependencies? ( or you can run \'' + this.npm + ' install --only=dev\' later)',
                default: false
            }
        ];

        this.prompt(prompts, function (answers) {
            var features = answers.features, jqPath;

            function hasFeature(feat) {
                return features && features.indexOf(feat) !== -1;
            }

            switch (answers.jqVersion) {
                case 2:
                    jqPath = 'jquery/2.2.4/jquery.js';
                    break;
                case 3:
                    jqPath = 'zepto/1.1.6/zepto.js';
                    break;
                default :
                    jqPath = 'jquery/1.9.1/jquery.js';
                    break;
            }

            this.pkg = {
                name: answers.name,
                desc: answers.desc,
                author: answers.author,
                jqVersion: answers.jqVersion,
                jqPath: jqPath,
                includeSprite: hasFeature('sprite'),
                includeLess: hasFeature('less'),
                empty: 'empty'
            };

            done();
        }.bind(this));
    },
    writing: {
        readme: function () {
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath('README.md'),
                {
                    pkg: this.pkg
                }
            );
        },
        fisConf: function () {
            this.fs.copyTpl(
                this.templatePath('fis-conf.js'),
                this.destinationPath('fis-conf.js'),
                {
                    pkg: this.pkg
                }
            );
        },
        packageJson: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                {
                    pkg: this.pkg
                }
            );
        },
        license: function () {
            this.fs.copyTpl(
                this.templatePath('LICENSE'),
                this.destinationPath('LICENSE'),
                {
                    pkg: this.pkg
                }
            );
        },
        editorConfig: function () {
            this.fs.copyTpl(
                this.templatePath('.editorConfig'),
                this.destinationPath('.editorConfig'),
                {
                    pkg: this.pkg
                }
            );
        },
        gitIgnore: function () {
            this.fs.copyTpl(
                this.templatePath('.gitignore'),
                this.destinationPath('.gitignore'),
                {
                    pkg: this.pkg
                }
            );
        },
        map: function () {
            this.fs.copy(
                this.templatePath('map'),
                this.destinationPath('map')
            );
        },
        mock: function () {
            this.fs.copy(
                this.templatePath('mock'),
                this.destinationPath('mock')
            );
        },
        htmls: function () {
            this.fs.copy(
                this.templatePath('htmls'),
                this.destinationPath('htmls')
            );
        },
        partials: function () {
            this.fs.copyTpl(
                this.templatePath('partials'),
                this.destinationPath('partials'),
                {
                    pkg: this.pkg
                }
            );
        },
        resource: function () {
            this.fs.copy(
                this.templatePath('resource'),
                this.destinationPath('resource')
            );
        },
        jquery: function () {
            var _path = path.join(this.sourceCommonTemplate, 'libs/' + this.pkg.jqPath);
            this.fs.copy(
                _path,
                this.destinationPath('resource/js/' + this.pkg.jqPath)
            );
        }
    },
    install: function () {
        if (!this.pkg.skipInstall) {
            return;
        }
        this.log('\nstart to install...');
        var done = this.async();
        var ls = this.spawnCommand(this.npm, ['install', '--only=dev']);
        ls.on('exit', function (code) {
            done();
        });
    },
    end: function () {
        this.log(chalk.green.bold('\nall done.'));
    }
});