###################
jdispatcher-viewers
###################

Job Dispatcher viewers is a TypeScript module that uses `Fabric.js`_ 
(based on a HTML canvas) to implement interactive visualisations, 
Visual Output and SSS Functional Predictions. A `Node.js`_ CLI application 
is also provided to generate static figures in SVG and PNG formats.


.. contents:: **Table of Contents**
   :depth: 3


Dependencies and Installation
=============================

Building the applications requires `Node.js`_ (tested with 12.16.1 LTS). Additional requirements, are
downloaded and installed automatically with `npm`_ CLI. See full list of dependencies in `package.json`_

Development Server
------------------

During development, you can simply clone this repository and install all the dependencies 
required to run the webpack and webpack-dev-server:

.. code-block:: bash

  npm install

To play with the development server (watches for file changes), run:

.. code-block:: bash

  npm run dev


Building the Application
------------------------

To compile the application for production, run:

.. code-block:: bash

  npm run build


Developing the CLI
------------------

To compile the CLI during development (watches for file changes), run:

.. code-block:: bash

  npm run dev:cli


Building the CLI
----------------

To compile the CLI for production, run:

.. code-block:: bash

  npm run build:cli


Running the CLI
---------------

Test the CLI by simply running (or passing the options `-h` or `--help`):

.. code-block:: bash

  node bin/jd-viewers-cli.js


Testing the CLI using a `mock` jobId, which loads data from files under `./src/testdata`.

.. code-block:: bash

  node bin/jd-viewers-cli.js vo -i mock_jobid-I20200317-103136-0485-5599422-np2 -o test.png -of png -v


Passing the same local files:

.. code-block:: bash

  node bin/jd-viewers-cli.js fp -i ./src/testdata/ncbiblast.json -ix ./src/testdata/iprmc.xml -o test.svg -of svg -v


Passing a valid JobId (replace with a current JobId, as this one might have expired), where the 
data will be fetched and stored locally:

.. code-block:: bash

  node bin/jd-viewers-cli.js fp -i ncbiblast-R20200602-114955-0302-11398737-np2 -o test.svg -of svg -v


Some rendering options can be optionally passed to the CLI, including: `-hits`, number of hits; 
`-hsps`, number of HSPs; and `-color`, color scheme. For example:

.. code-block:: bash

  node bin/jd-viewers-cli.js fp -i ncbiblast-R20200602-114955-0302-11398737-np2 -o test.svg -of svg -color 'ncbiblast' -hits 50 -v


Bug Tracking
============

If you find any bugs or issues please log them in the `issue tracker`_.

Changelog
=========

See `changelog.md`_

Credits
=======

* Fábio Madeira <fmadeira@ebi.ac.uk>

Licensing
=========

Apache License 2.0. See `license`_ for details.

.. links
.. _Fabric.js: http://fabricjs.com/
.. _Node.js: https://nodejs.org/
.. _npm: https://www.npmjs.com/
.. _package.json: ./package.json
.. _issue tracker: ../../issues
.. _license: LICENSE
.. _changelog.md: CHANGELOG.md
