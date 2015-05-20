var webpack = require('webpack');
var resolvers = require('./build_helpers/resolvers');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageJSON = require('./package.json');

var banner = (
'/**\n' +
' * ReactDropdownInput v' + packageJSON.version + ' \n' +
' *\n' +
' * Copyright (c) 2015, Facebook, Inc.\n' +
' * All rights reserved.\n' +
' *\n' +
' * This source code is licensed under the BSD-style license found in the\n' +
' * LICENSE file in the root directory of this source tree. An additional grant\n' +
' * of patent rights can be found in the PATENTS file in the same directory.\n' +
' */\n'
);

var plugins = [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
        '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production')
    }),
    resolvers.resolveHasteDefines
];

var entry = {};
var entryPoints = [];
entryPoints.push('./src/DropdownInput.js');

if (process.env.COMPRESS) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            },
            output: {comments: false}
        })
    );
    entry['react-dropdown-input.min'] = entryPoints;
} else {
    entry['react-dropdown-input'] = entryPoints;
}

plugins.push(
    new webpack.BannerPlugin(banner, {raw: true})
);

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

    entry: entry,

    output: {
        library: 'ReactDropdownInput',
        libraryTarget: 'umd',
        path: 'lib',
        filename: '[name].js'
    },

    externals: {
        react: {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react'
        }
    },

    node: {
        Buffer: false
    },

    plugins: plugins
};
