'use strict';
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const path = require( 'path' );


module.exports = async( env ) => {

	return {
		entry: './index.js',
		mode: 'production',
		output: {
			filename: "index.js",
			path: path.resolve(__dirname, "dist"),
			libraryTarget: "commonjs",
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [ '@babel/preset-env', '@babel/preset-react' ],
						}
					},
				},
				{
					test: /\.scss$/,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									// TODO - remove when @wordpress/base-styles is updated
									// to use modern sass.
									silenceDeprecations: ['import'],
								},
							},
						}
					],
				},
			],
		},
		resolve: {
			extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ],
		},
		plugins: [
			new DependencyExtractionWebpackPlugin( {} ),
		].filter(Boolean),
	};
}
