import chalk from "chalk";
import figlet from "figlet";
import { program } from "commander";
import fetch from "node-fetch";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";
import { ColorSchemeEnum } from "./custom-types";
import {
    dataAsType,
    validateSubmittedJobIdInput,
    validateSubmittedDbfetchInput,
    getIPRMCDataModelFlatFromXML,
} from "./other-utilities";

async function fetchDataToFile(url: string, outfile: string) {
    const writeFilePromise = promisify(fs.writeFile);
    return fetch(url)
        .then((x) => x.arrayBuffer())
        .then((x) => writeFilePromise(outfile, Buffer.from(x)))
        .catch((error) => {
            console.log(error);
            process.exit();
        });
}

function loadDataFromFile(file: string, format: string) {
    if (format === "json") {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } else {
        return fs.readFileSync(file, "utf8");
    }
}

async function cliHandler() {
    if (!process.argv.slice(2).length) {
        console.log(
            chalk.green(
                figlet.textSync("jd-viewers-cli", {
                    horizontalLayout: "default",
                })
            )
        );
        console.log("");
        program.outputHelp();
    } else {
        if (program.verbose) {
            console.log("Running jdispatcher-viewers-cli...");
            console.log("Your options were:");
            console.log(process.argv);
        }

        if (!program.visout && !program.funcpred) {
            console.log("'--funcpred' or '--visout' is required!");
            process.exit();
        }

        if (program.visout || program.funcpred) {
            if (!program.in) {
                console.log("Input data required!");
                process.exit();
            }
            if (!program.out) {
                console.log("Output file required!");
                process.exit();
            }
        }

        // Process input JobID
        let jsonFile: string;
        let sssJsonResponse;
        let sssDataObj;
        if (program.in === "mock_jobid-I20200317-103136-0485-5599422-np2") {
            // local file
            jsonFile = path.join(
                process.cwd(),
                "./src/testdata/ncbiblast.json"
            );
        } else {
            // validate input as a valid JobID, as a file path or URL
            // if JobID, full service URL is returned
            const sssJsonData = validateSubmittedJobIdInput(program.in);
            if (sssJsonData.startsWith("http")) {
                // download the JSON file
                jsonFile = path.join(process.cwd(), `${program.in}.json`);
                await fetchDataToFile(sssJsonData, jsonFile);
                console.log(sssJsonData);
                console.log(jsonFile);
            } else {
                // assumes is a valid file
                if (!path.isAbsolute(program.in)) {
                    jsonFile = path.join(process.cwd(), program.in);
                } else {
                    jsonFile = program.in;
                }
            }
        }
        if (fs.existsSync(jsonFile)) {
            sssJsonResponse = loadDataFromFile(jsonFile, "json");
            sssDataObj = dataAsType(sssJsonResponse, "SSSResultModel");
        } else {
            console.log("JobID provided is not valid, or file not readable!");
            process.exit();
        }
        if (sssDataObj === undefined) {
            console.log("Failed to get the SSS JSON data!");
            process.exit();
        }

        let fabricjs: VisualOutput | FunctionalPredictions;
        if (program.visout) {
            if (program.verbose) console.log("Generating Visual Output...");

            // Render Options
            let options = {
                // colorScheme: "dynamic",
                colorScheme: ColorSchemeEnum.dynamic,
                numberHits: 100,
                numberHsps: 10,
                logSkippedHsps: true,
                canvasWrapperStroke: true,
                staticCanvas: true,
            };
            // Call render method to display the viz
            fabricjs = new VisualOutput("canvas", sssDataObj, options);
            fabricjs.render();
        } else if (program.funcpred) {
            if (program.verbose)
                console.log("Generating Functional Predictions...");

            let iprmcXmlFile;
            let iprmcXmlResponse;
            let iprmcJSONResponse;
            let iprmcDataObj;
            if (program.in === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                iprmcXmlFile = path.join(
                    process.cwd(),
                    "./src/testdata/iprmc.xml"
                );
            } else {
                if (program.inx) {
                    // assumes is a valid file
                    if (!path.isAbsolute(program.in)) {
                        iprmcXmlFile = path.join(process.cwd(), program.inx);
                    } else {
                        iprmcXmlFile = program.inx;
                    }
                } else {
                    const iprmcXmlData = validateSubmittedDbfetchInput(
                        sssDataObj
                    );
                    // download the JSON file
                    iprmcXmlFile = path.join(
                        process.cwd(),
                        `${program.in}.xml`
                    );
                    await fetchDataToFile(iprmcXmlData, iprmcXmlFile);
                }
            }
            if (fs.existsSync(jsonFile)) {
                iprmcXmlResponse = loadDataFromFile(iprmcXmlFile, "xml");
                // convert XML into Flattened JSON
                iprmcJSONResponse = getIPRMCDataModelFlatFromXML(
                    iprmcXmlResponse
                );
                iprmcDataObj = dataAsType(
                    iprmcJSONResponse,
                    "IPRMCResultModelFlat"
                );
            } else {
                console.log("XML file not readable!");
                process.exit();
            }
            if (sssDataObj === undefined) {
                console.log("Failed to get the Dbfetch XML data!");
                process.exit();
            }

            // Render Options
            let options = {
                // colorScheme: "dynamic",
                colorScheme: ColorSchemeEnum.dynamic,
                numberHits: 30,
                canvasWrapperStroke: true,
                staticCanvas: true,
            };
            // Call render method to display the viz
            fabricjs = new FunctionalPredictions(
                "canvas",
                sssDataObj,
                iprmcDataObj,
                options
            );
            fabricjs.render();
        }

        // Save figure to file
        if (program.verbose)
            console.log(
                `Generating ${program.outformat.toUpperCase()} output...`
            );
        let output;
        if (!path.isAbsolute(program.out)) {
            output = path.join(process.cwd(), program.out);
        } else {
            output = program.out;
        }
        if (program.outformat.toString().toLowerCase() === "png") {
            fs.writeFileSync(
                output,
                fabricjs!.canvas
                    .toDataURL()
                    .replace("data:image/png;base64,", ""),
                "base64"
            );
        } else if (program.outformat.toString().toLowerCase() === "svg") {
            fs.writeFileSync(output, fabricjs!.canvas.toSVG().toString());
        }
    }
}

// TODO: add options for renderering
// TODO: add sub-commands for VO and FP
// TODO: add notice for expired JobIDs
program
    .version("0.0.1")
    .description("Generate Static Images with jdispatcher-viewers-cli")
    .option("-vo, --visout", "generate Visual Output")
    .option("-fp, --funcpred", "generate Functional Predictions")
    .option("-i, --in <data>", "jobID or URL/URI path to JSON (for VO and FP)")
    .option("-ix, --inx <xml>", "URL/URI path to XML (for FP)")
    .option("-o, --out <file>", "file name used for output")
    .option("-of, --outformat <format>", "output format [png]")
    .option("-v, --verbose", "Verbose [false]")
    .action(cliHandler)
    .parseAsync(process.argv);
