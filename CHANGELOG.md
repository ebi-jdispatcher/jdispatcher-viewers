# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.7](https://github.com/ebi-jdispatcher/jdispatcher-viewers/compare/v0.0.6...v0.0.7) (2022-08-11)

### 0.0.6 (2022-08-10)


### Features

* Some improvements to how jobs json and the mock_jobid example ([866311a](https://github.com/ebi-jdispatcher/jdispatcher-viewers/commit/866311aeb0e8cb85c9e67bd2868d163aaa4e81f8))
* Some improvements to the cli ([a1e3da0](https://github.com/ebi-jdispatcher/jdispatcher-viewers/commit/a1e3da07132f7d21a27395e1a7f598b303dfb9e9))

### 0.0.5 (08.06.2020)


### Features

- jdispatcher-viewers CLI takes two main commands: `vo` and `fp`
- Added selected rendering options to the CLI

### 0.0.4 (05.06.2020)


### Features

- Building as node CLI application (via [node-canvas](https://github.com/Automattic/node-canvas))
- CLI implemented with [commander.js](https://github.com/tj/commander.js/)
- Update IPRMCResultModel arrays are used by default even when one object is present

### 0.0.3 (04.06.2020)


### Features

- Added option to generate static visualisations
- Data fetching and loading was extracted from the visualisation classes
- Added PNG and SVG download buttons to `index.html`

### 0.0.2 (29.05.2020)


### Features

- Improved load times with basic in-memory caching
- Save Visualisation as PNG and SVG

### 0.0.1 (project started 12.03.2020)


### Features

- Build with [webpack](https://webpack.js.org/)
- Development with webpack-dev-server
- Canvas-based visualisations with [Fabric.js](http://fabricjs.com/)
- Visual Output Visualisation
- Functional Predictions Visualisation
- Loads SSSResultModel from the SSS JSON
- Converts Dbfetch IPRMC XML output into a flat JSON
- E-value (dynamic and fixed) scale colouring
- NCBI BLAST+ bit-score colouring
- Domain tooltip information (e-value/bit-score, start and end)
- Sequence tooltip information (description and resource URL)
- Webcomponent and plugin support for both visualisations
