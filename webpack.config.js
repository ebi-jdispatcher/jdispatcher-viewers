import path from 'node:path';
import {fileURLToPath} from 'node:url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: "development",
    entry: "./src/app.ts",
    output: {
        filename: "jd_viewers.bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: "inline-source-map",
    devServer: {
        port: 8080,
        compress: false,
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, 'docs', "style.css"),
                    to: path.join(__dirname, 'dist', "style.css")},
                { from: path.join(__dirname, 'src', "testdata"),
                    to: path.join(__dirname, 'dist', "testdata")},
            ],
        })
    ]
};
