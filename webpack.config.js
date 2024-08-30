var path = require("path");
var dotenv = require("dotenv");
const webpack = require("webpack");

var libraryName = "App";
var compiledCount = 1;

const env = dotenv.config({ path: "./.env" }).parsed;
// const envKeys = Object.keys(env || {}).reduce((prev, next) => {
//   prev[`process.env.${next}`] = JSON.stringify(env[next]);
//   return prev;
// }, {});

module.exports = function () {
  var buildOptions = {
    target: "web",
    entry: "./src/App.ts",
    mode: "development",
    devtool: "source-map",
    watch: false,
    stats: "errors-only",
    performance: {
      maxEntrypointSize: 300000,
      maxAssetSize: 300000,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    output: {
      library: libraryName,
      libraryExport: libraryName,
      libraryTarget: "this",
      filename: libraryName + ".js",
      path: path.resolve(__dirname, "dist"),
      sourceMapFilename: "[file].map",
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["source-map-loader"],
          enforce: "pre",
        },
        {
          test: /\.(mp3|png|jp(e*)g|svg)$/,
          loader: "url-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.PUBLIC_ENCRYPTION_KEY": JSON.stringify(
          process.env.PUBLIC_ENCRYPTION_KEY,
        ),
        "process.env.DEVICE_KEY_IDENTIFIER": JSON.stringify(
          process.env.DEVICE_KEY_IDENTIFIER,
        ),
        "process.env.BASE_URL": JSON.stringify(process.env.BASE_URL),
        "process.env.FV_BASE_URL": JSON.stringify(process.env.FV_BASE_URL),
        "process.env.EXPIRYDATE": JSON.stringify(process.env.EXPIRYDATE),
        "process.env.KEY": JSON.stringify(process.env.KEY),
        "process.env.CLOUD_CONVERT_BASE_URL": JSON.stringify(
          process.env.CLOUD_CONVERT_BASE_URL,
        ),
        "process.env.CLOUD_CONVERT_API_KEY": JSON.stringify(
          process.env.CLOUD_CONVERT_API_KEY,
        ),
        "process.env.IP_BASE_URL": JSON.stringify(process.env.IP_BASE_URL),
      }),
      {
        apply: compiler => {
          compiler.hooks.done.tapAsync("done", function (stats, callback) {
            if (
              !stats.compilation.errors ||
              stats.compilation.errors.length === 0
            ) {
              // Clear the console on successful emit
              console.log("\u001b[2J\u001b[0;0H");
              console.log(
                `Build: ${compiledCount} ${buildOptions.output.filename} Completed.`,
              );
              compiledCount += 1;
            }

            callback();
          });
        },
      },
    ],
  };
  console.log(`🚀 Creating FaceTec Biometrics: ${libraryName} build`);

  if (process.argv.indexOf("nowatch") > -1) {
    buildOptions.watch = false;
  }

  return buildOptions;
};
