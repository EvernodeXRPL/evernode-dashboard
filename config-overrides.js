
const webpack = require('webpack');
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "buffer": require.resolve("buffer/"),
        "url": require.resolve("url/"),
        "path": false,
        "fs": false,
        "os": require.resolve("os-browserify/browser"),
        "tty": require.resolve("tty-browserify"),
        "zlib": require.resolve("browserify-zlib")

    })
    config.resolve.fallback = fallback;
    config.externals = {
        "node:crypto": "crypto"
    }
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            fs: "empty"
        })
    ]);
    config.ignoreWarnings = [/Failed to parse source map/];
    config.experiments = ({ topLevelAwait: true });
    return config;
}
