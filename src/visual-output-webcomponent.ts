import { LitElement, html, property, customElement } from "lit-element";
import { RenderOptions, ColorSchemeEnum } from "./custom-types";
import { VisualOutput } from "./visual-output-app";

@customElement("jd-visual-output")
export class CanvasRendererComponent extends LitElement {
    @property({ type: String }) data = "";
    @property({ type: String }) colorScheme = "dynamic";
    @property({ type: Number }) numberHsps = 10;
    @property({ type: Boolean }) logSkippedHsps = true;
    @property({ type: Boolean }) canvasWrapperStroke = true;

    constructor() {
        super();
    }
    render() {
        const renderOptions: RenderOptions = {
            colorScheme: this.colorScheme as ColorSchemeEnum,
            numberHsps: this.numberHsps,
            logSkippedHsps: this.logSkippedHsps,
            canvasWrapperStroke: this.canvasWrapperStroke
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
        // New JD Viewers Fabricjs Canvas
        new VisualOutput("canvas", this.data, renderOptions).render();
        return html`
            ${this.canvasDivTemplate}
        `;
    }
    get canvasDivTemplate() {
        return html``;
    }
}
