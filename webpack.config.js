var webpack = require('webpack');

module.exports = {
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/,query: {
				cacheDirectory: true,
				presets: ['es2015','stage-0']
			} }
		]
	},
	externals:{
	},
	output: {
		library: 'ExpressionParser',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js']
	}
};
