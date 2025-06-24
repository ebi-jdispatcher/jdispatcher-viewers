import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(await fs.readFile('package.json'));

export default {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: `jd_viewers_${packageJson.version}.bundle.min.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
};
