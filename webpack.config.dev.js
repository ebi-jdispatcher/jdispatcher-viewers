const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/visual-output-index.ts",
    // entry: "./src/functional-predictions-index.ts",
    output: {
        filename: "jd_viewers_bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist"
    },
    devtool: "inline-source-map",
    devServer: {
        port: 8080,
        compress: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    }
};
