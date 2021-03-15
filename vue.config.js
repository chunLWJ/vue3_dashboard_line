const path = require("path");

module.exports = {

    publicPath: process.env.NODE_ENV === 'production'
        ? '/resDashboardLine/'
        : '/',

    chainWebpack: config => {
        // config.devtool ='source-map'; // 源码
        config
            .plugin('html')
            .tap(args => {
                args[0].title= 'ITDMS数字化运营平台'
                return args
            })

        // svg
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();
        svgRule
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            })
            .end();
    },

    devServer: {
        proxy: {
            '/api': {
                //这里最好有一个 /
                target: 'http://192.168.3.51:8080', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
            },
        },
    }

}
