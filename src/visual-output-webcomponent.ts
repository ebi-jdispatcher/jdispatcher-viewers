import { LitElement, html, property, customElement } from "lit-element";
import { RenderOptions, ColorSchemeEnum } from "./custom-types";
import { CanvasRenderer } from "./app";

@customElement("jd-visual-output")
export class CanvasRendererComponent extends LitElement {
    @property({ type: String }) data = "";
    @property({ type: Number }) canvasWidth = 1000;
    @property({ type: Number }) canvasHeight = 100;
    @property({ type: Number }) contentWidth = Number.NaN;
    @property({ type: Number }) contentScoringWidth = Number.NaN;
    @property({ type: Number }) contentLabelWidth = Number.NaN;
    @property({ type: Number }) scaleWidth = Number.NaN;
    @property({ type: Number }) scaleLabelWidth = Number.NaN;
    @property({ type: Number }) marginWidth = Number.NaN;
    @property({ type: String }) colorScheme = "dynamic";
    @property({ type: Number }) numberHsps = 10;
    @property({ type: Boolean }) logSkippedHsps = true;
    @property({ type: String }) fontWeigth = "normal";
    @property({ type: Number }) fontSize = 12;
    @property({ type: String }) fontFamily = "Times New Roman";
    @property({ type: Boolean }) canvasWrapperStroke = true;

    constructor() {
        super();
    }
    render() {
        const renderOptions: RenderOptions = {
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            numberHsps: this.numberHsps,
            colorScheme: this.colorScheme as ColorSchemeEnum,
            logSkippedHsps: this.logSkippedHsps,
            fontWeigth: this.fontWeigth,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            canvasWrapperStroke: this.canvasWrapperStroke
        };
        if (!Number.isNaN(this.contentWidth)) {
            renderOptions["contentWidth"] = this.contentWidth;
        }
        if (!Number.isNaN(this.contentScoringWidth)) {
            renderOptions["contentScoringWidth"] = this.contentScoringWidth;
        }
        if (!Number.isNaN(this.contentLabelWidth)) {
            renderOptions["contentLabelWidth"] = this.contentLabelWidth;
        }
        if (!Number.isNaN(this.scaleWidth)) {
            renderOptions["scaleWidth"] = this.scaleWidth;
        }
        if (!Number.isNaN(this.scaleLabelWidth)) {
            renderOptions["scaleLabelWidth"] = this.scaleLabelWidth;
        }
        if (!Number.isNaN(this.marginWidth)) {
            renderOptions["marginWidth"] = this.marginWidth;
        }

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
        new CanvasRenderer("canvas", this.data, renderOptions).render();
        return html`
            ${this.canvasDivTemplate}
        `;
    }
    get canvasDivTemplate() {
        return html``;
    }
}
