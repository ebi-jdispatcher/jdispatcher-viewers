import chalk from 'chalk';
import figlet from 'figlet';
import fetch from 'node-fetch';
import { Command } from 'commander';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { VisualOutput } from './visual-output-app';
import { FunctionalPredictions } from './functional-predictions-app';
import { dataAsType, validateSubmittedJobIdInput, validateSubmittedDbfetchInput, getIPRMCDataModelFlatFromXML, } from './other-utilities';
async function fetchDataToFile(url, outfile) {
    const writeFilePromise = promisify(fs.writeFile);
    return fetch(url)
        .then(x => x.arrayBuffer())
        .then(x => writeFilePromise(outfile, Buffer.from(x)))
        .catch(error => {
        console.log(error);
        process.exit();
    });
}
function loadDataFromFile(file, format) {
    if (format === 'json') {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
        catch {
            console.log(`Unable to load the JSON file\n${file}\n` +
                "The jobId might be 'not found' " +
                '(jobs data are only available for 7 days)!');
        }
    }
    else {
        return fs.readFileSync(file, 'utf8');
    }
}
async function cliHandler() {
    if (!process.argv.slice(2).length) {
        console.log(chalk.green(figlet.textSync('jd-viewers-cli', {
            horizontalLayout: 'default',
        })));
        console.log('');
        program.outputHelp();
    }
    else {
        const programopts = program.opts();
        if (programopts.verbose) {
            console.log('Running jdispatcher-viewers-cli...');
            console.log('Your options were:');
            console.log(process.argv);
        }
        let cmd = '';
        let cmdIndx = 0;
        if (program.args[0] === 'vo' || program.args[0] === 'visual-output') {
            cmd = 'vo';
        }
        else if (program.args[0] === 'fp' || program.args[0] === 'functional-predictions') {
            cmd = 'fp';
            cmdIndx = 1;
        }
        let command = program.commands[cmdIndx].opts();
        // Process input JobID
        let jsonFile;
        let sssJsonResponse;
        let sssDataObj;
        if (command.in === 'mock_jobid-I20200317-103136-0485-5599422-np2') {
            // local file
            jsonFile = path.join(process.cwd(), './src/testdata/ncbiblast.json');
        }
        else {
            // validate input as a valid JobID, as a file path or URL
            // if JobID, full service URL is returned
            const sssJsonData = validateSubmittedJobIdInput(command.in);
            if (sssJsonData.startsWith('http')) {
                // download the JSON file
                jsonFile = path.join(process.cwd(), `${command.in}.json`);
                await fetchDataToFile(sssJsonData, jsonFile);
                console.log(sssJsonData);
                console.log(jsonFile);
            }
            else {
                // assumes is a valid file
                if (!path.isAbsolute(command.in)) {
                    jsonFile = path.join(process.cwd(), command.in);
                }
                else {
                    jsonFile = command.in;
                }
            }
        }
        if (fs.existsSync(jsonFile)) {
            sssJsonResponse = loadDataFromFile(jsonFile, 'json');
            sssDataObj = dataAsType(sssJsonResponse, 'SSSResultModel');
        }
        else {
            console.log('JobID provided is not valid, or file not readable!');
            process.exit();
        }
        if (sssDataObj === undefined) {
            console.log('Failed to get the SSS JSON data!');
            process.exit();
        }
        let fabricjs;
        if (cmd === 'vo') {
            if (command.verbose)
                console.log('Generating Visual Output...');
            // Render Options
            let options = {
                colorScheme: command.colorscheme,
                numberHits: command.numbhits,
                numberHsps: command.numbhsps,
                logSkippedHsps: true,
                canvasWrapperStroke: true,
                staticCanvas: true,
            };
            // Call render method to display the viz
            fabricjs = new VisualOutput('canvas', sssDataObj, options);
            fabricjs.render();
        }
        else if (cmd === 'fp') {
            if (command.verbose)
                console.log('Generating Functional Predictions...');
            let iprmcXmlFile;
            let iprmcXmlResponse;
            let iprmcJSONResponse;
            let iprmcDataObj;
            if (command.in === 'mock_jobid-I20200317-103136-0485-5599422-np2') {
                iprmcXmlFile = path.join(process.cwd(), './src/testdata/iprmc.xml');
            }
            else {
                if (command.inx) {
                    // assumes is a valid file
                    if (!path.isAbsolute(command.in)) {
                        iprmcXmlFile = path.join(process.cwd(), command.inx);
                    }
                    else {
                        iprmcXmlFile = command.inx;
                    }
                }
                else {
                    const iprmcXmlData = validateSubmittedDbfetchInput(sssDataObj);
                    // download the JSON file
                    iprmcXmlFile = path.join(process.cwd(), `${command.in}.xml`);
                    console.log(iprmcXmlData);
                    await fetchDataToFile(iprmcXmlData, iprmcXmlFile);
                }
            }
            if (fs.existsSync(jsonFile)) {
                iprmcXmlResponse = loadDataFromFile(iprmcXmlFile, 'xml');
                // convert XML into Flattened JSON
                iprmcJSONResponse = getIPRMCDataModelFlatFromXML(iprmcXmlResponse);
                iprmcDataObj = dataAsType(iprmcJSONResponse, 'IPRMCResultModelFlat');
            }
            else {
                console.log('XML file not readable!');
                process.exit();
            }
            if (sssDataObj === undefined) {
                console.log('Failed to get the Dbfetch XML data!');
                process.exit();
            }
            // Render Options
            let options = {
                colorScheme: command.colorscheme,
                numberHits: command.numbhits,
                canvasWrapperStroke: true,
                staticCanvas: true,
            };
            // Call render method to display the viz
            fabricjs = new FunctionalPredictions('canvas', sssDataObj, iprmcDataObj, options);
            fabricjs.render();
        }
        // Save figure to file
        if (command.verbose)
            console.log(`Generating ${command.outformat.toUpperCase()} output...`);
        let output;
        if (!path.isAbsolute(command.out)) {
            output = path.join(process.cwd(), command.out);
        }
        else {
            output = command.out;
        }
        if (command.outformat.toString().toLowerCase() === 'png') {
            fs.writeFileSync(output, fabricjs.canvas.toDataURL().replace('data:image/png;base64,', ''), 'base64');
        }
        else if (command.outformat.toString().toLowerCase() === 'svg') {
            fs.writeFileSync(output, fabricjs.canvas.toSVG().toString());
        }
        if (command.verbose)
            console.log(`Generated...\n${output}`);
    }
}
function makeCommand(cmd, description, alias) {
    const command = new Command(cmd);
    // inputs & outputs
    command
        .description(description)
        .alias(alias)
        .requiredOption('-i, --in <data>', 'JobID or URL/URI path to JSON (for VO and FP)');
    if (cmd === 'fp')
        command.option('-ix, --inx <xml>', 'URL/URI path to XML (for FP)');
    command
        .requiredOption('-o, --out <file>', 'File name used for output')
        .requiredOption('-of, --outformat <format>', 'Output format [png]');
    // render Options
    command.option('-color, --colorscheme [scheme]', 'Color scheme to use [dynamic]');
    if (cmd === 'vo')
        command
            .option('-hits, --numbhits [hits]', 'Number of hits to display [100]')
            .option('-hsps, --numbhsps [hsps]', 'Number of HSPs to display [10]');
    else if (cmd === 'fp')
        command.option('-hits, --numbhits [hits]', 'Number of Hits to display [30]');
    command;
    // finally
    command.option('-v, --verbose', 'Verbose [false]').action(cliHandler);
    return command;
}
const program = new Command();
program
    .version('0.0.5')
    .description('Generate Static Figures with jdispatcher-viewers')
    .addCommand(makeCommand('vo', 'Generate Visual Output', 'visual-output'))
    .addCommand(makeCommand('fp', 'Generate Functional Predictions', 'functional-predictions'))
    .parseAsync(process.argv);
