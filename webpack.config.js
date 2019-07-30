const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: {
        popup: path.join(__dirname, "src", "popup", "index.js"),
        options: path.join(__dirname, "src", "content", "index.js"),
        background: path.join(__dirname, "src", "background", "index.js")
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }],
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"]
        }),
        new CopyWebpackPlugin([{
            from: "src/manifest.json",
            transform: function (content, path) {
                return Buffer.from(JSON.stringify({
                    ...JSON.parse(content.toString()),
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version,
                    name: process.env.npm_package_name.charAt(0).toUpperCase() + process.env.npm_package_name.slice(1).replace(/\-(\w)/g, (a,x) => a.replace(a,' ' + x.toUpperCase())),
                }))
            }
        }, {
            from: "src/icon16.png",
        }, {
            from: "src/icon48.png",
        }, {
            from: "src/icon128.png",
        }]),
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        modules: [
            path.resolve('./node_modules'),
        ],
    },
    optimization: {
        minimize: false,
    },
};
