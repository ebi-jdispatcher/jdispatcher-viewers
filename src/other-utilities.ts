import { xml2json } from "xml-js";
import {
    SSSResultModel,
    IPRMCResultModel,
    IPRMCResultModelFlat,
    IprMatchesFlat,
    IprMatchFlat,
} from "./data-model";
import { JobIdValitable, DomainDatabaseEnum } from "./custom-types";

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
): Promise<SSSResultModel | IPRMCResultModel> {
    const request = new Request(dataLoc);
    try {
        return fetch(request).then((response) => {
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

export function validateJobId(
    jobIdObj: JobIdValitable,
    verbose: boolean = false
) {
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
    if (verbose) {
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

export async function getXMLDataFromURL(dataLoc: string): Promise<string> {
    const request = new Request(dataLoc);
    try {
        return fetch(request).then((response) => {
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
}

export function domainDatabaseNameToEnum(
    domainName: string
): DomainDatabaseEnum {
    domainName = domainName.toUpperCase();
    let domainNameEnum = DomainDatabaseEnum.UNCLASSIFIED;
    if (domainName === "IPR" || domainName === "INTERPRO") {
        domainNameEnum = DomainDatabaseEnum.INTERPRO;
    } else if (
        domainName === "CATHGENE3D" ||
        domainName === "CATH-GENE3D" ||
        domainName === "GENE3D"
    ) {
        domainNameEnum = DomainDatabaseEnum.CATHGENE3D;
    } else if (domainName === "CDD") {
        domainNameEnum = DomainDatabaseEnum.CDD;
    } else if (domainName === "PANTHER") {
        domainNameEnum = DomainDatabaseEnum.PANTHER;
    } else if (domainName === "HAMAP") {
        domainNameEnum = DomainDatabaseEnum.HAMAP;
    } else if (domainName === "PFAM") {
        domainNameEnum = DomainDatabaseEnum.PFAM;
    } else if (domainName === "PIRSF") {
        domainNameEnum = DomainDatabaseEnum.PIRSF;
    } else if (domainName === "PRINTS") {
        domainNameEnum = DomainDatabaseEnum.PRINTS;
    } else if (domainName === "PROSITE PROFILES") {
        domainNameEnum = DomainDatabaseEnum.PROSITE_PROFILES;
    } else if (domainName === "PROSITE PATTERNS") {
        domainNameEnum = DomainDatabaseEnum.PROSITE_PATTERNS;
    } else if (domainName === "SFLD") {
        domainNameEnum = DomainDatabaseEnum.SFLD;
    } else if (domainName === "SMART") {
        domainNameEnum = DomainDatabaseEnum.SMART;
    } else if (domainName === "SUPERFAMILY" || domainName === "SSF") {
        domainNameEnum = DomainDatabaseEnum.SUPERFAMILY;
    } else if (domainName === "TIGERFAMS") {
        domainNameEnum = DomainDatabaseEnum.TIGERFAMS;
    }
    return domainNameEnum;
}

export function getUniqueIPRMCDomainDatabases(dataObj: IPRMCResultModel) {
    const domainPredictions: DomainDatabaseEnum[] = [];
    for (const protein of dataObj["interpromatch"]["protein"]) {
        for (const match of protein["match"]) {
            if (match.ipr != undefined) {
                domainPredictions.push(DomainDatabaseEnum.INTERPRO);
            } 
            domainPredictions.push(
                domainDatabaseNameToEnum(
                    match._attributes["dbname"].toString()
                )
            );
        }
    }
    return domainPredictions.filter((v, i, x) => x.indexOf(v) === i);
}

export function getFlattenIPRMCDataModel(
    dataObj: IPRMCResultModel,
    numberHits: number
): IPRMCResultModelFlat {
    let tmpNumberHits = 0;
    let iprmcDataFlatObj: IPRMCResultModelFlat = {};
    for (const protein of dataObj["interpromatch"]["protein"]) {
        tmpNumberHits++;
        if (tmpNumberHits <= numberHits) {
            let matches: string[] = [];
            let matchObjs: IprMatchesFlat = {};
            for (const match of protein["match"]) {
                let matchObj: IprMatchFlat = {};
                if (match.ipr !== undefined) {
                    if (!matches.includes(match.ipr._attributes.id)) {
                        matches.push(match.ipr._attributes.id);
                    }
                    if (!(match.ipr._attributes.id in matchObjs)) {
                        matchObjs[match.ipr._attributes.id] = [];
                    }
                    matchObj = {
                        id: match.ipr._attributes.id,
                        name: match.ipr._attributes.name,
                        dbname: "InterPro",
                        type: match.ipr._attributes.type,
                        altid: match._attributes.id,
                        altname: match._attributes.name,
                        altdbname: match._attributes.dbname,
                        status: match._attributes.status,
                        model: match._attributes.model,
                        evd: match._attributes.evd,
                        start: match.lcn._attributes.start,
                        end: match.lcn._attributes.end,
                        fragments: match.lcn._attributes.fragments,
                        score: match.lcn._attributes.fragments,
                    };
                    matchObjs[match.ipr._attributes.id].push(matchObj);
                } else {
                    if (!matches.includes(match._attributes.id)) {
                        matches.push(match._attributes.id);
                    }
                    if (!(match._attributes.id in matchObjs)) {
                        matchObjs[match._attributes.id] = [];
                    }
                    matchObj = {
                        id: match._attributes.id,
                        name: match._attributes.name,
                        dbname: match._attributes.dbname,
                        status: match._attributes.status,
                        model: match._attributes.model,
                        evd: match._attributes.evd,
                        type: "Unclassified",
                        start: match.lcn._attributes.start,
                        end: match.lcn._attributes.end,
                        fragments: match.lcn._attributes.fragments,
                        score: match.lcn._attributes.fragments,
                    };
                    matchObjs[match._attributes.id].push(matchObj);
                }
            }
            iprmcDataFlatObj[protein._attributes.id] = {
                id: protein._attributes.id,
                name: protein._attributes.name,
                length: protein._attributes.length,
                match: matchObjs,
                matches: matches.sort(),
            };
        } 
        // else {
        //     console.log(
        //         `Skipping protein as number of hits has reached ${numberHits}`
        //     );
        // }
    }
    return iprmcDataFlatObj;
}
