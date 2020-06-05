import svgToMiniDataURI from "mini-svg-data-uri";
import { isBrowser, isNode } from "browser-or-node";
import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";
import {
    validateJobId,
    fetchData,
    dataAsType,
    getJdispatcherJsonURL,
    validateSubmittedJobIdInput,
    validateSubmittedDbfetchInput,
    getIPRMCDataModelFlatFromXML,
} from "./other-utilities";
import { ColorSchemeEnum } from "./custom-types";

// plugin support & module support
// if (typeof window === "undefined") {
if (isBrowser) {
    (window as any).VisualOutput = VisualOutput;
    (window as any).FunctionalPredictions = FunctionalPredictions;
    (window as any).validateJobId = validateJobId;
    (window as any).svgToMiniDataURI = svgToMiniDataURI;
    (window as any).fetchData = fetchData;
    (window as any).dataAsType = dataAsType;
    (window as any).getJdispatcherJsonURL = getJdispatcherJsonURL;
    (window as any).validateSubmittedJobIdInput = validateSubmittedJobIdInput;
    (window as any).validateSubmittedDbfetchInput = validateSubmittedDbfetchInput;
    (window as any).getIPRMCDataModelFlatFromXML = getIPRMCDataModelFlatFromXML;
    (window as any).ColorSchemeEnum = ColorSchemeEnum;
}
if (isNode) {
    module.exports = {
        VisualOutput: VisualOutput,
        FunctionalPredictions: FunctionalPredictions,
        validateJobId: validateJobId,
        svgToMiniDataURI: svgToMiniDataURI,
        fetchData: fetchData,
        dataAsType: dataAsType,
        getJdispatcherJsonURL: getJdispatcherJsonURL,
        validateSubmittedJobIdInput: validateSubmittedJobIdInput,
        validateSubmittedDbfetchInput: validateSubmittedDbfetchInput,
        getIPRMCDataModelFlatFromXML: getIPRMCDataModelFlatFromXML,
        ColorSchemeEnum: ColorSchemeEnum,
    };
}

// web-component support
import "./visual-output-webcomponent.ts";
import "./functional-predictions-webcomponent.ts";

// demo index page with JobId input form (implemented in TypeScript)
import "./index.ts";
