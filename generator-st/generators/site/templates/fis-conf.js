var pkg = fis.util.readJSON(fis.project.getProjectPath('package.json'));
var matchCss = '<%=pkg.includeLess?'*{.css,.less}':'*.css'%>';

//设置项目处理文件
fis.set('files', [
    '/htmls/**.html'
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

/**
 * 项目开发
 */

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

//分析html页面
fis.match('::packager', {
    postpackager: fis.plugin('loader')
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

// png压缩
fis.media('prod').match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});

// 图片指纹
fis.media('prod').match('::image', {
    useHash: true
});

// css压缩、合并、指纹
fis.media('prod').match(matchCss, {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css'),
    packTo: '/resource/css/' + pkg.name + '-aio.css',
    useHash: true
});

// js压缩、合并、指纹
fis.media('prod').match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js'),
    packTo:'/resource/js/' + pkg.name + '-aio.js',
    useHash: true
});

// 设置输出资源文件url，
fis.media('prod').match('**', {
    url: '$0'//如：'Public$0'
});

// 不输出测试数据
fis.media('prod').match('/{mock,partials}/**', {
    release: false
});
