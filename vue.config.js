/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-12 15:30:09
 */
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin');

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
module.exports = {
  // publicPath: '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/operation/' : '/',
  productionSourceMap: false,
  devServer: {
    open: true
  },
  chainWebpack(config) {
    // set svg-sprite-loader 参考练级：https://blog.csdn.net/weixin_42120767/article/details/107175001
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');// formmaking中template编译
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  },
  configureWebpack: config => {
    // 生产环境相关配置
    if (isProduction) {
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css'];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      );

      config.optimization = {
        // 代码压缩
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ],
        // 公共代码抽离
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      };
    }
  }

};

