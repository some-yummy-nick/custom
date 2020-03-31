const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	entry: {
		script: "./src/js/script.js",
	},
	mode: "development",
	devtool: "source-map",
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "build/js"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				},
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				terserOptions: {
					extractComments: "all",
					output: {
						comments: false,
					},
					// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
				},
			}),
		],
	},
};
