
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://webservice.recruit.co.jp/hotpepper',
        target: 'https://api.gnavi.co.jp',
        pathRewrite: { '^/api': '' } 
      }
    }
  }
};