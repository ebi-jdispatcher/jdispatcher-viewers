import { xml2json } from "xml-js";
import {
    SSSResultModel,
    IPRMCResultModel,
    IPRMCResultModelFlat,
    IprMatchesFlat,
    IprMatchFlat,
} from "./data-model";
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

export function domainDatabaseNameToString(domainName: string): string {
    domainName = domainName.toUpperCase();
    let domainNameEnum = "Unclassified";
    if (domainName === "IPR" || domainName === "INTERPRO") {
        domainNameEnum = "InterPro";
    } else if (
        domainName === "CATHGENE3D" ||
        domainName === "CATH-GENE3D" ||
        domainName === "GENE3D"
    ) {
        domainNameEnum = "CATH-Gene3D";
    } else if (domainName === "CDD") {
        domainNameEnum = "CDD";
    } else if (domainName === "PANTHER") {
        domainNameEnum = "PANTHER";
    } else if (domainName === "HAMAP") {
        domainNameEnum = "HAMAP";
    } else if (domainName === "PFAM") {
        domainNameEnum = "Pfam";
    } else if (domainName === "PIRSF") {
        domainNameEnum = "PIRSF";
    } else if (domainName === "PRINTS") {
        domainNameEnum = "PRINTS";
    } else if (
        domainName === "PROSITE PROFILES" ||
        domainName === "PROSITE_PROFILES" ||
        domainName === "PROFILE"
    ) {
        domainNameEnum = "PROSITE profiles";
    } else if (
        domainName === "PROSITE PATTERNS" ||
        domainName === "PROSITE_PATTERNS" ||
        domainName === "PROSITE"
    ) {
        domainNameEnum = "PROSITE patterns";
    } else if (domainName === "SFLD") {
        domainNameEnum = "SFLD";
    } else if (domainName === "SMART") {
        domainNameEnum = "SMART";
    } else if (domainName === "SUPERFAMILY" || domainName === "SSF") {
        domainNameEnum = "SUPERFAMILY";
    } else if (domainName === "TIGERFAMS") {
        domainNameEnum = "TIGRFAMs";
    } else if (domainName === "PRODOM") {
        domainNameEnum = "PRODOM";
    }
    return domainNameEnum;
}

export function getUniqueIPRMCDomainDatabases(dataObj: IPRMCResultModel) {
    const domainPredictions: string[] = [];
    for (const protein of dataObj["interpromatch"]["protein"]) {
        for (const match of protein["match"]) {
            domainPredictions.push(
                domainDatabaseNameToString(match._attributes["dbname"])
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
                    const iprdomain = `${domainDatabaseNameToString(
                        match._attributes.dbname
                    )}_${match.ipr._attributes.id}`;
                    if (!matches.includes(iprdomain)) {
                        matches.push(iprdomain);
                    }
                    if (!(iprdomain in matchObjs)) {
                        matchObjs[iprdomain] = [];
                    }
                    matchObj = {
                        id: match.ipr._attributes.id,
                        name: match.ipr._attributes.name,
                        dbname: domainDatabaseNameToString(
                            match._attributes.dbname
                        ),
                        type: match.ipr._attributes.type,
                        altid: match._attributes.id,
                        altname: match._attributes.name,
                        // altdbname: "InterPro",
                        status: match._attributes.status,
                        model: match._attributes.model,
                        evd: match._attributes.evd,
                        start: Number(match.lcn._attributes.start),
                        end: Number(match.lcn._attributes.end),
                        fragments: match.lcn._attributes.fragments,
                        score: match.lcn._attributes.fragments,
                    };
                    matchObjs[iprdomain].push(matchObj);
                } else {
                    const iprdomain = `${domainDatabaseNameToString(
                        match._attributes.dbname
                    )}_${match._attributes.id}`;
                    if (!matches.includes(iprdomain)) {
                        matches.push(iprdomain);
                    }
                    if (!(iprdomain in matchObjs)) {
                        matchObjs[iprdomain] = [];
                    }
                    matchObj = {
                        id: match._attributes.id,
                        name: match._attributes.name,
                        dbname: domainDatabaseNameToString(
                            match._attributes.dbname
                        ),
                        status: match._attributes.status,
                        model: match._attributes.model,
                        evd: match._attributes.evd,
                        type: "Unclassified",
                        start: Number(match.lcn._attributes.start),
                        end: Number(match.lcn._attributes.end),
                        fragments: match.lcn._attributes.fragments,
                        score: match.lcn._attributes.fragments,
                    };
                    matchObjs[iprdomain].push(matchObj);
                }
            }
            iprmcDataFlatObj[protein._attributes.id] = {
                id: protein._attributes.id,
                name: protein._attributes.name,
                length: Number(protein._attributes.length),
                matches: matches.sort(),
                match: matchObjs,
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

export function getDomainURLbyDatabase(domainID: string, domainName: string) {
    let domainURL = "";
    if (domainID.startsWith("IPR")) {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/InterPro/${domainID}`;
    } else if (domainName === "CATH-Gene3D") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/cathgene3d/${domainID}`;
        // domainURL = `http://www.cathdb.info/version/latest/superfamily/${domainID}`;
    } else if (domainName === "CDD") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/cdd/${domainID}`;
        // domainURL = `https://www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid=${domainID}`;
    } else if (domainName === "PANTHER") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/panther/${domainID}`;
        // domainURL = `http://www.pantherdb.org/panther/family.do?clsAccession=${domainID}`;
    } else if (domainName === "HAMAP") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/hamap/${domainID}`;
        // domainURL = `https://hamap.expasy.org/signature/${domainID}`;
    } else if (domainName === "Pfam") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/pfam/${domainID}`;
        // domainURL = `https://pfam.xfam.org/family/${domainID}`;
    } else if (domainName === "PIRSF") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/pirsf/${domainID}`;
        // domainURL = `https://pir.georgetown.edu/cgi-bin/ipcSF?id=${domainID}`;
    } else if (domainName === "PRINTS") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/prints/${domainID}`;
        // domainURL = `http://www.bioinf.manchester.ac.uk/cgi-bin/dbbrowser/sprint/searchprintss.cgi?prints_accn=${domainID}&display_opts=Prints&category=None&queryform=false&regexpr=off`;
    } else if (domainName === "PROSITE profiles") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/profile/${domainID}`;
        // domainURL = `https://www.expasy.org/prosite/${domainID}`;
    } else if (domainName === "PROSITE patterns") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/prosite/${domainID}`;
        // domainURL = `https://www.expasy.org/prosite/${domainID}`;
    } else if (domainName === "SFLD") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/sfld/${domainID}`;
        // domainURL = `http://sfld.rbvi.ucsf.edu/django/family/${domainID}`;
    } else if (domainName === "SMART") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/smart/${domainID}`;
        // domainURL = `https://smart.embl-heidelberg.de/smart/do_annotation.pl?BLAST=DUMMY&amp;ACC=${domainID}`;
    } else if (domainName === "SUPERFAMILY") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/ssf/${domainID}`;
        // domainURL = `https://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid=${domainID}`;
    } else if (domainName === "TIGRFAMs") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/tigrfams/${domainID}`;
        // domainURL = `https://cmr.tigr.org/tigr-scripts/CMR/HmmReport.cgi?hmm_acc=${domainID}`;
    } else if (domainName === "PRODOM") {
        domainURL = `https://www.ebi.ac.uk/interpro/entry/prodom/${domainID}`;
        // domainURL = `https://prodom.prabi.fr/prodom/current/cgi-bin/request.pl?SSID=1289309949_1085&amp;db_ent1=${domainID}`;
    }
    return domainURL;
}
