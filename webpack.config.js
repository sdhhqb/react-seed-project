var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
	entry: {
		"vendor1": ["react", "react-dom", "react-router", "react-router-redux", "react-redux", "redux"],
		"app": "./app/js/index.js"
	},
	
	output: {
		path: './build/',
		filename: 'js/[name].js',
		publicPath: '/build/',
		chunkFilename: "js/[id].bundle.js"
	},

	module: {
		loaders: [
			{
				test: /\.js$/, 
				include: [
					path.resolve(__dirname, "app/js")
				],
				exclude: [
					path.resolve(__dirname, "build"),
					path.resolve(__dirname, "node_modules")
				],
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react'],
					plugins: ['transform-object-assign']
				}
			},

			{
				test: /\.css$/,
				loaders: ["style", "css?-minimize"]
			},

			{
				test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url?limit=512&&name=[path][name].[ext]?[hash]'
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor1"],
			minChunks: Infinity
		})
	],
	
	resolve: {
		modulesDirectories: [
			'node_modules'
		]
	}
};

var env = process.env.NODE_ENV;
console.log("node env: \x1b[32m" + env + "\x1b[0m");
if (env === 'production') {
	// 将代码中的process.env.NODE_ENV替换为production，方便webpack压缩代码
	config.plugins.push(
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		})
	);
	// build时，js文件会添加hash。每次build时，需要用template模板重新生成index.html文件。
	config.plugins.push(
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'app/template.html',
			inject: 'body'
		})
	)
	// 压缩代码
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin()
	);
	// 开启sourcemap
	config.devtool = "source-map";
	// publicPath改为服务器路径
	// config.output.publicPath = "/muc/";
	// 开启文件hash	//暂不使用，即将上线时再开启
	config.output.filename = "js/[hash].[name].js";
	config.output.chunkFilename = "js/[id].[hash].bundle.js";
}
module.exports = config;