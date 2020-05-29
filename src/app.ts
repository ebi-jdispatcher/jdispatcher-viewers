import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";
import svgToMiniDataURI from "mini-svg-data-uri";

// plugin support
(window as any).VisualOutput = VisualOutput;
(window as any).FunctionalPredictions = FunctionalPredictions;
(window as any).svgToMiniDataURI = svgToMiniDataURI;

// web-component support
import "./visual-output-webcomponent.ts";
import "./functional-predictions-webcomponent.ts";

// demo index page with JobId input form
import "./index.ts";
