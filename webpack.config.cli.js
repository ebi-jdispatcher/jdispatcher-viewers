import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cleanPlugin from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './src/jd-viewers-cli.ts',
  output: {
    filename: `jd-viewers-cli.js`,
    path: path.resolve(__dirname, 'bin'),
    library: {
      type: 'module',
    },
    libraryTarget: 'module',
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
        options: {
          configFile: 'tsconfig.cli.json',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // plugins: [new cleanPlugin.CleanWebpackPlugin()],
  node: false,
  externals: [nodeExternals()],
};
