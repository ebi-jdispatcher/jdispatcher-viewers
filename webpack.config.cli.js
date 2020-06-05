const path = require("path");
const cleanPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: "./src/jd-viewers-cli.ts",
    output: {
        filename: `jd-viewers-cli.js`,
        path: path.resolve(__dirname, "bin"),
    },
    devtool: "none",
    target: "node",
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                loader: "ts-loader",
                exclude: [/node_modules/],
                options: {
                    configFile: "tsconfig.cli.json",
                },
            },
            {
                test: /\.node$/,
                use: "node-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [new cleanPlugin.CleanWebpackPlugin()],
    node: {
        fs: "empty",
        child_process: "empty",
    },
    externals: [nodeExternals()],
};
