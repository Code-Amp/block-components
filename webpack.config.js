'use strict';
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const webpack = require( 'webpack' );
const path = require( 'path' );
// const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const config = {
	entry: './index.js',
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "commonjs",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|tsx|ts)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env', '@babel/preset-react' ],
						plugins: [
							'@babel/plugin-syntax-dynamic-import',
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-private-methods',
						],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [
					// Creates `style` nodes from JS strings
					// MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new DependencyExtractionWebpackPlugin(),
		/* new MiniCssExtractPlugin( {
			filename: 'css/admin/[name].css',
		} ), */
	],
	resolve: {
		extensions: [".js", ".jsx"],
	},
	target: [ 'web', 'es5' ],
};

module.exports = config;
