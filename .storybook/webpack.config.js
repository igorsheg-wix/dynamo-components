const path = require("path");

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader")
      }
    ]
  });

  config.resolve.extensions.push(".ts", ".tsx");
   config.resolve.modules.push(path.resolve(__dirname, "../src"));
  return config;
};
