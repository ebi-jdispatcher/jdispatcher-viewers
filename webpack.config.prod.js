const path = require("path");
const cleanPlugin = require("clean-webpack-plugin");
const packageJson = require(path.join(process.cwd(), "package.json"));

module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    output: {
        // filename: "jd_viewers_bundle_[hash].js",
        filename: `jd_viewers_bundle_${packageJson.version}.js`,
        path: path.resolve(__dirname, "dist")
    },
    devtool: "none",
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
        extensions: [".ts", ".js"]
    },
    plugins: [new cleanPlugin.CleanWebpackPlugin()]
};
