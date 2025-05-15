
module.exports = (api) => {
  // Use api.env() which returns true if the env matches
  const isDevelopment = api.env() === 'development'; 

  api.cache(false);
  
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ]
  };
};   