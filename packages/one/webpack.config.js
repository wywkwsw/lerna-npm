const path = require('path');

module.exports = {
    entry:'./index.js',
    output:{
        filename:'webpack-build.js',
        path: path.resolve(__dirname, 'dist-webpack'),
        library:'vueApp',
        libraryTarget:'umd'
    },
    mode: 'production',
}