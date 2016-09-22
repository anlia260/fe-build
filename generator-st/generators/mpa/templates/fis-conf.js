var pkg = fis.util.readJSON(fis.project.getProjectPath('package.json'));
var matchCss = '<%=pkg.includeLess?'*{.css,.less}':'*.css'%>';
var matchModFiles = '{.es6,.ts,.js,-tpl.html,tpl/*.html}';
var matchTplFiles = '{*-tpl,tpl/*}.html';

//设置项目处理文件
fis.set('files', [
    '/page/**.html',
    '/modules/{**,!tpl/*}.html'
]);

//设置项目忽略目录
fis.set('project.ignore', [
    '/{*.*,LICENSE}',
    '/www/**',
    '/output/**',
    '/build/**',
    '/node_modules/**'
]);

//生成资源映射表
fis.match('/map/manifest.json',{
    release: '/manifest.json'
});

<% if(pkg.includeLess) {%>// 启用 fis-spriter-less-2.x 插件
fis.match('*.less', {
    parser: fis.plugin('less-2.x', {
        // options
    }),
    rExt: '.css' // from .less to .css
});<%}%>

<% if(pkg.includeSprite) { %>// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});
fis.match(matchCss, {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});<%}%>

//预编译js模板
fis.match(matchTplFiles, {
    parser: fis.plugin('tpl-precompile'),
    rExt: '.js'
});

<% if(pkg.includeBabel) {%>// 启用 fis-parser-es6-babel 插件，解析 .es6 后缀为 .js
fis.match('*.es6', {
    parser: fis.plugin('es6-babel'),
    rExt: '.js'
});<%}%>

<% if(pkg.includeTypeScript) {%>// 启用 fis3-parser-typescript 插件，解析 .ts 后缀为 .js
fis.match('*.ts', {
    parser: fis.plugin('typescript', {
        // options
    }),
    rExt: '.js'
});<%}%>

//标记模块文件
fis.match('/modules/**'+ matchModFiles, {
    isMod: true
});

//模块化配置
fis.hook('commonjs', {
    paths: { <% if(pkg.jqVersion == 1) {%>
    'jquery': '/modules/lib/jquery/1.9.1/jquery.js'<%}else if(pkg.jqVersion == 2) {%>
    'jquery': '/modules/lib/jquery/2.2.4/jquery.js' <%}else if(pkg.jqVersion == 3) {%>
    'jquery':'/modules/lib/zepto/1.1.6/zepto.js' <%}%>
    ,'underscore': '/modules/lib/underscore/1.8.3/underscore.js'
    ,'backbone': '/modules/lib/backbone/1.3.3/backbone.js'
}
});

//模块化映射表
fis.match('::packager', {
    postpackager: fis.plugin('loader', {
        resoucemap: 'resource/js/conf/mod-conf.js'
        //,useInlineMap: true
        , include: ['/modules/**']
    })
});
// 合并css
fis.match(matchCss, {
    packTo: '/resource/css/' + pkg.name + '.css'
});

/**
 * 项目调试
 */

//mock数据
//自动生成规则，如:api_xxx.json 对应 /api/xxx
fis.media('dev').match('/mock/server.conf', {
    parser: fis.plugin('mock-rewrite')
});

fis.media('dev').match('/mock/**', {
    release: '$0'
});

fis.media('dev').match('/mock/server.conf', {
    release: '/config/server.conf'
});

/**
 * 项目部署
 */

//合并单个模块文件
fis.media('prod').match('/modules/(*)/**' + matchModFiles, {
    packTo: '/modules/pkg/mod-$1.js'
});

//压缩js
fis.media('prod').match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js'),
    useHash: true
});

//压缩js模板
fis.media('prod').match(matchTplFiles, {
    optimizer: fis.plugin('uglify-js'),
    useHash: true
});

//压缩css
fis.media('prod').match(matchCss, {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css'),
    useHash: true
});

//压缩png
fis.media('prod').match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});

//为图片文件添加hash
fis.media('prod').match('::image', {
    useHash: true
});

//设置输出资源文件url
fis.media('prod').match('**', {
    url: '$0'//如：'Public$0'
});

//不输出测试数据
fis.media('prod').match('/{mock,partials}/**', {
    release: false
});
