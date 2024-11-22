module.exports = function override(config, env) {
    // allowedHosts 수정
    config.devServer.allowedHosts = ['.localhost', 'mywebsite.com'];
  
    return config;
  };
  