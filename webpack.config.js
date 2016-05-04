var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

function extsToRegExp(exts) {
  return new RegExp("\\.(" + exts.map(function(ext) {
    return ext.replace(/\./g, "\\.");
  }).join("|") + ")(\\?.*)?$");
}

function loadersByExtension(obj) {
  var loaders = [];
  Object.keys(obj).forEach(function(key) {
    var exts = key.split("|");
    var value = obj[key];
    var entry = {
      extensions: exts,
      test: extsToRegExp(exts)
    };
    if(Array.isArray(value)) {
      entry.loaders = value;
    } else if(typeof value === "string") {
      entry.loader = value;
    } else {
      Object.keys(value).forEach(function(valueKey) {
        entry[valueKey] = value[valueKey];
      });
    }
    loaders.push(entry);
  });
  return loaders;
};

module.exports = function(options) {
  var entry = {
    app: ["./client/index.jsx"],
    sass: ["./client/sass/main.scss"],
    vendor: ["lodash", "react", "react-router"]
  };

  var devtool = options.production ? "source-map" : "cheap-module-eval-source-map";

  var loaders = {
    "jsx": {
      loader: "babel",
      exclude: path.join(__dirname, "node_modules")
    },
    "js": {
      loader: "babel",
      include: path.join(__dirname, "client")
    },
    "json": "json-loader",
    "png|jpg|jpeg|gif|svg": "url-loader?limit=10000"
  };

  var cssLoader = options.cssModules ?
    "css?modules&importLoaders=1" + (options.production ? "" : "&localIdentName=[local]---[hash:base64:5]") :
    "css";

  var sassLoader = "sass?includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib");

  var stylesheetLoaders = {
    "css": [cssLoader, "postcss"],
    "scss|sass": [cssLoader, "postcss", sassLoader]
  };

  var additionalLoaders = [];

  var alias = {};

  var aliasLoader = {};

  var externals = [];

  var modulesDirectories = [
    "node_modules"
  ];

  var extensions = [
    "",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".scss"
  ];

  var root = path.join(__dirname, "client");

  var publicPath = options.devServer ?
    "http://localhost:3000/static/js/" :
    "/static/js/";

  var output = {
    path: path.join(__dirname, "server", "static", "js"),
    publicPath: publicPath,
    filename: "[name]-[hash].js"
  };

  var plugins = [
    new webpack.NoErrorsPlugin(),
    new BundleTracker({ filename: options.production ? "./webpack-stats-prod.json" : "./webpack-stats.json" }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor-[hash].js"),
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(options.production ? "production" : "development") }
    })
  ]

  Object.keys(stylesheetLoaders).forEach(function(ext) {
    var stylesheetLoader = stylesheetLoaders[ext];

    if (Array.isArray(stylesheetLoader))
      stylesheetLoader = stylesheetLoader.join("!");

    if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract("style", stylesheetLoader);
    } else {
      stylesheetLoaders[ext] = "style!" + stylesheetLoader;
    }
  });

  if (options.separateStylesheet) {
    plugins.push(
      new ExtractTextPlugin("[name]-[hash].css")
    );
  }

  if (options.production) {
    plugins.push(
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    );
  }

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false,
        compressor: { warnings: false }
      })
    );
  }

  return {
    context: __dirname,
    devtool: devtool,
    entry: entry,
    output: output,
    module: {
      loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
    },
    postcss: function (webpack) {
      return [
        require("postcss-import")({
          addDependencyTo: webpack
        }),
        require("postcss-url")(),
        require("postcss-cssnext")(),
        require("postcss-browser-reporter")(),
        require("postcss-reporter")(),
      ]
    },
    externals: externals,
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: plugins
  };
};