import svgToMiniDataURI from 'mini-svg-data-uri';
import { isBrowser, isNode } from 'browser-or-node';
import { VisualOutput } from './visual-output-app';
import { FunctionalPredictions } from './functional-predictions-app';
import { validateJobId, fetchData, dataAsType, getJdispatcherJsonURL, validateSubmittedJobIdInput, validateSubmittedDbfetchInput, getIPRMCDataModelFlatFromXML, } from './other-utilities';
import { ColorSchemeEnum } from './custom-types';
// plugin support & module support
// if (typeof window === "undefined") {
if (isBrowser) {
    window.VisualOutput = VisualOutput;
    window.FunctionalPredictions = FunctionalPredictions;
    window.validateJobId = validateJobId;
    window.svgToMiniDataURI = svgToMiniDataURI;
    window.fetchData = fetchData;
    window.dataAsType = dataAsType;
    window.getJdispatcherJsonURL = getJdispatcherJsonURL;
    window.validateSubmittedJobIdInput = validateSubmittedJobIdInput;
    window.validateSubmittedDbfetchInput = validateSubmittedDbfetchInput;
    window.getIPRMCDataModelFlatFromXML = getIPRMCDataModelFlatFromXML;
    window.ColorSchemeEnum = ColorSchemeEnum;
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
import './visual-output-webcomponent.ts';
import './functional-predictions-webcomponent.ts';
// demo index page with JobId input form (implemented in TypeScript)
import './index.ts';
