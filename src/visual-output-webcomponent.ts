import {LitElement, html} from "lit-element/lit-element.js";
import {property, customElement} from "lit/decorators.js";
import {RenderOptions, ColorSchemeEnum} from "./custom-types";
import {
    validateSubmittedJobIdInput,
    fetchData,
    dataAsType, validateSubmittedDbfetchInput,
} from "./other-utilities";
import {VisualOutput} from "./visual-output-app";

@customElement("jd-visual-output")
export class CanvasRendererComponent extends LitElement {
    @property({type: String}) data = "";
    @property({type: String}) colorScheme = "dynamic";
    @property({type: Number}) numberHits = 100;
    @property({type: Number}) numberHsps = 10;
    @property({type: Boolean}) logSkippedHsps = true;
    @property({type: Boolean}) canvasWrapperStroke = true;

    constructor() {
        super();
    }

    async render() {
        const renderOptions: RenderOptions = {
            colorScheme: this.colorScheme as ColorSchemeEnum,
            numberHits: this.numberHits,
            numberHsps: this.numberHsps,
            logSkippedHsps: this.logSkippedHsps,
            canvasWrapperStroke: this.canvasWrapperStroke,
        };

        // Checks to find if canvas element exist (with id="canvas")
        // if not, creates it and appends it to body
        const canvasElement = document.getElementById(
            "canvas"
        )! as HTMLCanvasElement;
        if (canvasElement === null) {
            const newDiv = document.createElement("div");
            newDiv.id = "canvas-wrapper";
            const newCanvas = document.createElement("canvas");
            newCanvas.id = "canvas";
            newDiv.appendChild(newCanvas);
            document.body.appendChild(newDiv);
        }
        // loading the JSON Data
        const sssJsonData = validateSubmittedJobIdInput(this.data);
        const sssJsonResponse = await fetchData(sssJsonData);
        const sssDataObj = dataAsType(sssJsonResponse, "SSSResultModel");

        // New JD Viewers Fabricjs Canvas
        new VisualOutput("canvas", sssDataObj, renderOptions).render();
        return html`${this.canvasDivTemplate}`;
    }

    get canvasDivTemplate() {
        return html``;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "jd-visual-output": CanvasRendererComponent;
    }
}
