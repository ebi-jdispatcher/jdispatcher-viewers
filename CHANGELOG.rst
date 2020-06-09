0.0.5 (08.06.2020)
------------------

- jdispatcher-viewers CLI takes two main commands: `vo` and `fp`
- Added selected rendering options to the CLI

0.0.4 (05.06.2020)
------------------

- Building as node CLI application (via `node-canvas`_)
- CLI implemented with `commander.js`_
- Update IPRMCResultModel arrays are used by default even when one object is present

0.0.3 (04.06.2020)
------------------

- Added option to generate static visualisations
- Data fetching and loading was extracted from the visualisation classes
- Added PNG and SVG download buttons to `index.html`

0.0.2 (29.05.2020)
------------------

- Improved load times with basic in-memory caching
- Save Visualisation as PNG and SVG

0.0.1 (project started 12.03.2020)
----------------------------------

- Build with `webpack`_
- Development with webpack-dev-server
- Canvas-based visualisations with `Fabric.js`_
- Visual Output Visualisation
- Functional Predictions Visualisation
- Loads SSSResultModel from the SSS JSON
- Converts Dbfetch IPRMC XML output into a flat JSON
- E-value (dynamic and fixed) scale colouring
- NCBI BLAST+ bit-score colouring
- Domain tooltip information (e-value/bit-score, start and end)
- Sequence tooltip information (description and resource URL)
- Webcomponent and plugin support for both visualisations


.. links
.. _Fabric.js: http://fabricjs.com/
.. _webpack: https://webpack.js.org/
.. _node-canvas: https://github.com/Automattic/node-canvas
.. _commander.js: https://github.com/tj/commander.js/
