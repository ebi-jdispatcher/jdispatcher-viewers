import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";

// plugin support
(window as any).VisualOutput = VisualOutput;
(window as any).FunctionalPredictions = FunctionalPredictions;

// web-component support
import "./visual-output-webcomponent.ts";
import "./functional-predictions-webcomponent.ts";

// demo index page with JobId input form
import "./visual-output-index.ts";
import "./functional-predictions-index.ts";
