import { fabric } from "fabric";
import {
    TextType,
    RectType,
    ColorSchemeEnum,
    ProteinFeaturesEnum,
} from "./custom-types";
import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";

export function mouseOverText(
    fabricObj: fabric.Object,
    textObj: TextType,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "pointer");
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: true });
            _this.canvas.renderAll();
        }
    });
}

export function mouseDownText(
    fabricObj: fabric.Object,
    href: string,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mousedown", (e: fabric.IEvent) => {
        if (e.target) {
            window.open(href, "_blank");
            _this.canvas.renderAll();
        }
    });
}

export function mouseOutText(
    fabricObj: fabric.Object,
    textObj: TextType,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: false });
            _this.canvas.renderAll();
        }
    });
}

export function mouseOverDomain(
    fabricObj: fabric.Object,
    fabricGroupObj: fabric.Object,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "pointer");
            fabricGroupObj.set({ visible: true });
            fabricGroupObj.bringToFront();
            _this.canvas.renderAll();
        }
    });
}

export function mouseOutDomain(
    fabricObj: fabric.Object,
    fabricGroupObj: fabric.Object,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            fabricGroupObj.set({ visible: false });
            _this.canvas.renderAll();
        }
    });
}

export function mouseOverCheckbox(
    fabricObj: fabric.Object,
    textObj: TextType,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "default");
            e.target.setOptions(textObj);
            e.target.setOptions({ fill: "black" });
            _this.canvas.renderAll();
        }
    });
}

export function mouseDownCheckbox(
    fabricObj: fabric.Object,
    value: ColorSchemeEnum,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mousedown", (e: fabric.IEvent) => {
        if (e.target) {
            if (_this.colorScheme != value) {
                _this.colorScheme = value;
                _this.render();
            }
        }
    });
}

export function mouseOutCheckbox(
    fabricObj: fabric.Object,
    textObj: TextType,
    value: ColorSchemeEnum,
    _this: VisualOutput | FunctionalPredictions
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.setOptions(textObj);
            if (_this.colorScheme != value) {
                e.target.setOptions({
                    fill: "grey",
                });
            }
            _this.canvas.renderAll();
        }
    });
}

export function mouseOverDomainCheckbox(
    fabricObj: fabric.Object,
    rectObj: RectType,
    currentProteinFeature: ProteinFeaturesEnum,
    _this: FunctionalPredictions
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "pointer");
            e.target.setOptions(rectObj);
            if (
                _this.currentProteinFeature !== undefined &&
                _this.currentProteinFeature === currentProteinFeature
            ) {
                e.target.setOptions({ fill: "white", stroke: "black" });
            } else {
                e.target.setOptions({ fill: "white", stroke: "black" });
            }
            _this.canvas.renderAll();
        }
    });
}

export function mouseDownDomainCheckbox(
    fabricObj: fabric.Object,
    currentProteinFeature: ProteinFeaturesEnum,
    _this: FunctionalPredictions
) {
    fabricObj.on("mousedown", (e: fabric.IEvent) => {
        if (e.target) {
            if (
                !_this.proteinFeaturesList.includes(
                    currentProteinFeature.toString()
                )
            ) {
                _this.proteinFeaturesList.push(
                    currentProteinFeature.toString()
                );
                _this.currentProteinFeature = currentProteinFeature;
                _this.render();
            } else {
                const indx = _this.proteinFeaturesList.indexOf(
                    currentProteinFeature.toString()
                );
                if (indx > -1) {
                    _this.proteinFeaturesList.splice(indx, 1);
                }
                _this.currentProteinFeature = undefined;
                _this.render();
            }
        }
    });
}

export function mouseOutDomainCheckbox(
    fabricObj: fabric.Object,
    rectObj: RectType,
    currentProteinFeature: ProteinFeaturesEnum,
    _this: FunctionalPredictions
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            if (
                !_this.proteinFeaturesList.includes(
                    currentProteinFeature.toString()
                )
            ) {
                e.target.setOptions({ stroke: "grey", fill: "white" });
            } else {
                e.target.setOptions(rectObj);
            }
            _this.canvas.renderAll();
        }
    });
}
