"use strict";
const path = require("path");
const { HashedModuleIdsPlugin } = require("webpack");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const resolve = dir => path.join(__dirname, dir);
// page title
const name = "vue mobile template";
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

// externals
const externals = {
  AMap: "window.AMap",
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios"
  // 'vue-ydui': 'ydui',
  // 'mint-ui': 'MINT'
};

// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    // '/static/app/mint-ui.css', '/static/app/ydui.px.css',
    css: ["/static/app/ydui.base.css", "/static/app/swiper.min.css"],
    js: [
      // '/static/app/TcPlayer-2.3.2.js',
      // 'https://player.polyv.net/livesdk/polyv-live.min.js',
      // 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js',
      "/static/app/wxLogin.js",
      "/static/app/app-min.js", //录音
      "/static/app/recorder-core.js",
      "/static/app/gov_province_city_area_id.js",
      "/static/app/swiper.min.js",
      // "/static/app/vue.js",
      "/static/app/vue.min-2.6.14.js",
      "/static/app/vue-awesome-swiper.js",
      // '/static/app/vue-router.min.js',
      "/static/app/vuex.min.js",
      "/static/app/axios.min.js",
      // '/static/app/ydui.px.js',
      // '/static/app/mint-ui.js', 去掉mint
      "https://webapi.amap.com/maps?v=1.4.15&key=96d1b767d5bff43c60455ccc7dec7465&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.Geocoder",
      "/static/app/YdbOnline.js",
      "/static/app/apps.js",
      "/static/app/fixifmheight.js",
      // "/static/app/jweixin-1.6.0.js",
      // "/static/app/jwxwork-1.0.0.js",
      "/static/app/decode_common.js"
      // '/static/app/core.js',
      // '/static/app/enc-base64.js',
      // '/static/app/cipher-core.js',
      // '/static/app/aes.js',
      // '/static/app/md5.js',
      // '/static/app/tinymce4.7.5/tinymce.min.js'
    ]
  },
  // 生产环境
  build: {
    // './static/app/mint-ui.css','./static/app/ydui.px.css',
    css: ["./static/app/ydui.base.css", "./static/app/swiper.min.css"],
    js: [
      // './static/app/TcPlayer-2.3.2.js',
      // 'https://player.polyv.net/livesdk/polyv-live.min.js',
      // 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js',
      "./static/app/wxLogin.js",
      "./static/app/app-min.js", //录音
      "./static/app/recorder-core.js",
      "./static/gov_province_city_area_id.js",
      "./static/app/swiper.min.js",
      "./static/app/vue.min-2.6.14.js",
      "./static/app/vue-awesome-swiper.js",
      "./static/app/vue-router.min.js",
      "./static/app/vuex.min.js",
      "./static/app/axios.min.js",
      // './static/app/ydui.px.js',
      // './static/app/mint-ui.js',
      "https://webapi.amap.com/maps?v=1.4.15&key=96d1b767d5bff43c60455ccc7dec7465&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.Geocoder",
      "./static/app/YdbOnline.js",
      "./static/app/apps.js",
      "./static/app/fixifmheight.js",
      // "./static/app/jweixin-1.6.0.js",
      // "./static/app/jwxwork-1.0.0.js",
      "./static/app/decode_common.js"
      // './static/app/core.js',
      // './static/app/enc-base64.js',
      // './static/app/cipher-core.js',
      // './static/app/aes.js',
      // './static/app/md5.js',
      // './static/app/tinymce4.7.5/tinymce.min.js'
    ]
  }
};

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/addons/yun_shop/" : "/", // 署应用包时的基本 URL。 vue-router hash 模式使用
  //  publicPath: '/app/', //署应用包时的基本 URL。  vue-router history模式使用
  outputDir: "../yz-front-dist", //  生产环境构建文件的目录
  assetsDir: process.env.NODE_ENV === "production" ? "./static/app" : "static", //  outputDir的静态资源(js、css、img、fonts)目录
  // lintOnSave: !IS_PROD,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    host: "0.0.0.0",
    port: 8081, // 端口
    open: false, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    },
    proxy: {
      "/addons/yun_shop/api.php": {
        target: "https://hd-hs.iyeecare.com/", //目标接口域名
        changeOrigin: true, //是否跨域
        secure: false
        // pathRewrite: {
        //   '^/api': '/'   //重写接口
        // }
      }
    }
  },
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        // prependData: `
        //   // $cdn: "${defaultSettings.$cdn}";
        //   `
      }
    }
  },
  transpileDependencies: IS_PROD ? ["*"] : [],
  configureWebpack: config => {
    const plugins = [];
    config.name = name;
    // 为生产环境修改配置...
    if (IS_PROD) {
      // externals
      config.externals = externals;
      config.entry.app = ["babel-polyfill", "./src/main.js"];
      plugins.push(new HashedModuleIdsPlugin());
    } else {
      delete externals["vue-router"];
      config.externals = externals;
    }
    return { plugins };
  },

  chainWebpack: config => {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");

    // 别名 alias
    config.resolve.alias
      .set("@", resolve("src"))
      .set("src", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("views", resolve("./src/views"))
      .set("components", resolve("src/components"))
      .set("utils", resolve("./src/utils"));

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    config.plugin("html").tap(args => {
      if (IS_PROD) {
        args[0].cdn = cdn.build;
      } else {
        args[0].cdn = cdn.dev;
      }
      return args;
    });

    /**
     * 设置保留空格
     */
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    /**
     * 打包分析
     */
    // if (IS_PROD) {
    //   config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
    //     {
    //       analyzerMode: 'static'
    //     }
    //   ])
    // }
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(!IS_PROD, config => config.devtool("cheap-source-map"));

    config.when(IS_PROD, config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: "chunk-libs",
            chunks: "initial", // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true
          },
          vantUI: {
            name: "chunk-vantUI", // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
