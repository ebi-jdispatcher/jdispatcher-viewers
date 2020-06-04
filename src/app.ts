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
import svgToMiniDataURI from "mini-svg-data-uri";

// plugin support
(window as any).VisualOutput = VisualOutput;
(window as any).FunctionalPredictions = FunctionalPredictions;
(window as any).validateJobId = validateJobId;
(window as any).svgToMiniDataURI = svgToMiniDataURI;
(window as any).fetchData = fetchData;
(window as any).dataAsType = dataAsType;
(window as any).validateSubmittedJobIdInput = validateSubmittedJobIdInput;
(window as any).validateSubmittedDbfetchInput = validateSubmittedDbfetchInput;
(window as any).getIPRMCDataModelFlatFromXML = getIPRMCDataModelFlatFromXML;
(window as any).getJdispatcherJsonURL = getJdispatcherJsonURL;

// web-component support
import "./visual-output-webcomponent.ts";
import "./functional-predictions-webcomponent.ts";

// demo index page with JobId input form
import "./index.ts";
