# jdispatcher-viewers
<p>
    <a href="https://www.npmjs.com/package/@ebi-jdispatcher/jdispatcher-viewers" alt="NPM">
        <img src="https://img.shields.io/badge/npm-%40ebi--jdispatcher%2Fjdispatcher--viewers-blue" /></a>
    <a href="https://nodejs.org/en/download/releases/" alt="Node">
        <img src="https://img.shields.io/badge/node-18.20-blue" /></a>
    <a href="https://doi.org/10.1093/bioadv/vbaf122" alt="Bioinformatics Advances: 10.1093/bioadv/vbaf122">
        <img src="https://img.shields.io/badge/Bioinformatics_Advances-10.1093%2Fbioadv%2Fvbaf122-brightgreen"></a>
</p>

Job Dispatcher viewers is a TypeScript module that uses [Fabric.js](http://fabricjs.com/)
(based on a HTML canvas) to implement interactive visualisations,
Visual Output and Functional Predictions. The app is provided as an ES module, can be used as plugin and 
also as [Web Components](https://www.webcomponents.org/). A [Node.js](https://nodejs.org/) CLI application
is also provided to generate static figures in SVG and PNG formats.
 
[Live Demo](https://ebi-jdispatcher.github.io/jdispatcher-viewers/demo/)

## Visual Output

Visual Output is a diagram visualisation for the hit sequences of sequence similarity tools (e.g. 
[NCBI BLAST+](https://www.ebi.ac.uk/Tools/sss/ncbiblast/) and 
[FASTA](https://www.ebi.ac.uk/Tools/sss/ncbiblast/), that highlights the region of the sequences that
is matching the query sequence and provides corresponding E-values. 
This currently works only with Job Dispatcher Job IDs, as it depends on the JSON output provided by the service.

![home page](https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/assets/VO.gif)

## Functional Predictions

Functional Predictions is a diagram of the domain ranges that compose hit sequences of sequence 
similarity tools (e.g.
[NCBI BLAST+](https://www.ebi.ac.uk/Tools/sss/ncbiblast/) and
[FASTA](https://www.ebi.ac.uk/Tools/sss/ncbiblast/). This visualisation gives a good overview of domain
location vs hit/query sequence matching. Predictions are obtained from 
[InterPro](https://www.ebi.ac.uk/interpro/) and cover several domain databases/resources, including:
Pfam, SUPERFAMILY, SMART, CATH-Gene3D, CDD, etc.

![home page](https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/assets/FP.gif)

## Colouring and selection of scores
Six colouring schemes can be selected along side scale type and score. The scale types are either `dynamic`,
i.e. the scale ranges from the 'local' minimum to maximum score found in the results, or `fixed`, where the range is pre-defined based on the score being used. There is a selection of scores that can be selected, `E-value` being the default. Besides E-value, sequence `identity` and `similarity`, as well as, `bit score` can selected.
The colouring schemes currently provided are:
- `Heatmap`: from red to blue (multiple hues)
- `Greyscale`: a grey scale (single hue)
- `Sequential`: a blue scale (single hue)
- `Divergent`: red to yellow to green  (multiple) hues)
- `Qualitative`: categorical colouring (multiple hues)
- `NCBI BLAST+`: NCBI BLAST+ based categorical colouring (multiple hues)

## User and developer documentation

Jdispatcher-viewers documentation can be found [here](https://ebi-jdispatcher.github.io/jdispatcher-viewers/). An example [demo](https://ebi-jdispatcher.github.io/jdispatcher-viewers/demo/) and [API docs](https://ebi-jdispatcher.github.io/jdispatcher-viewers/api/modules.html) are available.

## Dependencies and Installation

Building the applications requires [Node.js](https://nodejs.org/) (tested with v16.16.0 and v18.7.0). 
Additional requirements, are
downloaded and installed automatically with [npm](https://www.npmjs.com/) CLI. 
See full list of dependencies in [package.json](package.json)

### Development server

During development, you can simply clone this repository and install all the dependencies
required to run the webpack and webpack-dev-server:

```bash
npm install
```

To play with the development server (watches for file changes), in two terminal windows in parallel, run:

```bash
# runs a server at localhost:8080
npm run dev
```

```bash
# builds the package and copies index.html over to ./dist
npm run dev2
```

### Building the application

To compile the application for production, run:

```bash
npm run build
```

### Documentation development and build

To develop and/or build the documentation, please refer to [docs/README.md](docs/README.md)

### Developing the CLI

To compile the CLI during development (watches for file changes), run:

```bash
npm run dev:cli
```

### Building the CLI

To compile the CLI for production, run:

```bash
npm run build:cli
```

### Running the CLI

Test the CLI by simply running (or passing the options `-h` or `--help`):

```bash
node --es-module-specifier-resolution=node bin/jd-viewers-cli.js
```

Testing the CLI using a `mock` jobId, which loads data from files under `./src/testdata`.

```bash
node --es-module-specifier-resolution=node bin/jd-viewers-cli.js vo -i mock_jobid-I20200317-103136-0485-5599422-np2 -o test.png -of png -v
```

Passing the same local files:

```bash
node --es-module-specifier-resolution=node bin/jd-viewers-cli.js fp -i ./src/testdata/ncbiblast.json -ix ./src/testdata/iprmc.xml -o test.svg -of svg -v
```

Passing a valid JobId (replace with a current JobId, as this one might have expired), where the
data will be fetched and stored locally:

```bash
node --es-module-specifier-resolution=node bin/jd-viewers-cli.js fp -i ncbiblast-R20200602-114955-0302-11398737-np2 -o test.svg -of svg -v
```

Some rendering options can be optionally passed to the CLI, including: `-hits`, number of hits;
`-hsps`, number of HSPs; and `-color`, color scheme. For example:

```bash
node --es-module-specifier-resolution=nodebin/jd-viewers-cli.js fp -i ncbiblast-R20200602-114955-0302-11398737-np2 -o test.svg -of svg -color 'ncbiblast' -hits 50 -v
```

### Publishing NPM package

This package has been published to NPM at 
[@ebi-jdispatcher/jdispatcher-viewers](https://www.npmjs.com/package/@ebi-jdispatcher/jdispatcher-viewers).

```bash
# npm package under ebi-jdispatcher org
npm init --scope=@ebi-jdispatcher
# testing building the package
npm install
# publish to npm
npm publish --access public
```

## Bug Tracking

If you find any bugs or issues please log them in the
[issue tracker](https://github.com/ebi-jdispatcher/jdispatcher-viewers/issues).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).


## Citation

If you use `jdispatcher-viewers` in your work, please cite:

> Madeira et al., (2025). jdispatcher-viewers: interactive visualizations of sequence similarity search results and domain predictions. 
> *Bioinformatics Advances*, 5 (1), doi: [10.1093/bioadv/vbaf122](https://doi.org/10.1093/bioadv/vbaf122)



## Licensing

The European Bioinformatics Institute - [EMBL-EBI](https://www.ebi.ac.uk/), is an Intergovernmental Organization which, as part of the European Molecular Biology Laboratory family, focuses on research and services in bioinformatics.

Apache License 2.0. See [LICENSE](LICENSE) for details.
