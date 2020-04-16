import { xml2json } from "xml-js";
import { SSSResultModel, IPRMCResultModel } from "./data-model";
import { JobIdValitable } from "./custom-types";

function countDecimals(n: number) {
    if (Math.floor(n) === n) return 0;
    return n.toString().split(".")[1].length || 0;
}

export function numberToString(n: number) {
    let stringNumber = "";
    if (Number.isInteger(n)) {
        return (stringNumber = n + ".0");
    } else if (n < 0.0001 || n > 10000) {
        return (stringNumber = n.toExponential(2));
    } else if (countDecimals(n) > 3) {
        return (stringNumber = n.toFixed(3).toString());
    } else {
        return (stringNumber = n.toString());
    }
}

export async function getDataFromURLorFile(
    dataLoc: string
): Promise<SSSResultModel> {
    const request = new Request(dataLoc);
    try {
        return fetch(request).then(response => {
            if (!response.ok) {
                throw new Error(`Could not retrieve data from ${dataLoc}`);
            }
            try {
                return response.json();
            } catch (error) {
                throw new Error(`Could not decode JSON data from ${dataLoc}`);
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

export function getServiceURLfromJobId(jobId: string) {
    const toolName = jobId.split("-")[0];
    return `https://wwwdev.ebi.ac.uk/Tools/services/rest/${toolName}/result/${jobId}/jdp?format=json`;
}

export function validateJobId(jobIdObj: JobIdValitable, verbose: boolean = false) {
    let isValid = true;
    if (jobIdObj.required) {
        isValid = isValid && jobIdObj.value.trim().length !== 0;
    }
    if (jobIdObj.minLength) {
        isValid = isValid && jobIdObj.value.trim().length >= jobIdObj.minLength;
    }
    if (jobIdObj.maxLength) {
        isValid = isValid && jobIdObj.value.trim().length <= jobIdObj.maxLength;
    }
    if (jobIdObj.pattern) {
        isValid = isValid && jobIdObj.pattern.test(jobIdObj.value.trim());
    }
    if (verbose){
        if (isValid) {
            console.log(`JobId "${jobIdObj.value}" is valid!`);
        } else {
            console.log(`JobId "${jobIdObj.value}" is not valid!`);
        }
    }
    return isValid;
}

// InterPro Match Complete XML data (via Dbfetch)
export function getIPRMCDbfetchURL(accessions: string) {
    return `https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=${accessions};format=iprmcxml;style=raw`;
}

export async function getXMLDataFromURL(
    dataLoc: string
): Promise<string> {
    const request = new Request(dataLoc);
    try {
        return fetch(request).then(response => {
            if (!response.ok) {
                throw new Error(`Could not retrieve data from ${dataLoc}`);
            }
            try {
                return response.text();
            } catch (error) {
                throw new Error(`Could not decode JSON data from ${dataLoc}`);
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

export function parseXMLData(data: string): IPRMCResultModel {
    return JSON.parse(xml2json(data, { compact: true, spaces: 2 }));
};
