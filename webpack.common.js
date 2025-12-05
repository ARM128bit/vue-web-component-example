import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { VueLoaderPlugin } from "vue-loader";
import webpack from "webpack";
import DotenvWebpackPlugin from "dotenv-webpack";

const __dirname = import.meta.dirname;
const __src = path.resolve(__dirname, "src");

export default {
  entry: path.resolve(__src, "main.ts"),

  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  module: {
    rules: [
      // Using vue-loader plugin for *.vue files
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          
          {
            loader: "babel-loader",
            options: {
              targets: "defaults",
              presets: [["@babel/preset-env"]],
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new DotenvWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }),
    new HtmlWebpackPlugin({
      title: "Weather Widget",
      favicon: path.resolve(__dirname, "public", "favicon.ico"),
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],
};
