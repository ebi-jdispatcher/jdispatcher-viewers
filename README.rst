###################
jdispatcher-viewers
###################

Job Dispatcher viewers is a TypeScript application that uses `Fabric.js`_ (based on a HTML canvas) to implement interactive 
visualisations that we currently provide (i.e. SSS Visual Output and SSS Functional Predictions).

More information coming soon.


.. contents:: **Table of Contents**
   :depth: 3


Dependencies and Installation
=============================

Installation requires `Node.js`_ (tested with 12.16.1 LTS). Additional requirements, are
downloaded and installed automatically with `npm`_ CLI. See full list of dependencies in `package.json`_

Development Server
------------------

During development, you can simply clone this repository and install all the dependencies 
required to run the webpack and webpack-dev-server:

.. code-block:: bash

  npm install

To play with the development server, run:

.. code-block:: bash

  npm run dev


Production Application
----------------------

To compile the application for deployment, run:

.. code-block:: bash

  npm run build


.. links
.. _Fabric.js: http://fabricjs.com/
.. _Node.js: https://nodejs.org/
.. _npm: https://www.npmjs.com/


Bug Tracking
============

If you find any bugs or issues please log them in the `issue tracker`_.

Changelog
=========

**0.0.2**

- Improved load times with basic in-memory caching
- Save Visualisation as PNG and SVG

**0.0.1-alpha**

- Build with webpack
- Development with webpack-dev-server
- Visual Output Visualisation
- Functional Predictions Visualisation
- Loads SSSResultModel from the SSS JSON
- Converts Dbfetch IPRMC XML output into a flat JSON
- E-value (dynamic and fixed) scale colouring
- NCBI BLAST+ bit-score colouring
- Domain tooltip information (e-value/bit-score, start and end)
- Sequence tooltip information (description and resource URL)
- Webcomponent and plugin support for both visualisations

Credits
=======

* Fábio Madeira <fmadeira@ebi.ac.uk>

Licensing
=========

Apache License 2.0. See `license`_ for details.

.. links
.. _package.json: ./package.json
.. _issue tracker: ../../issues
.. _license: LICENSE