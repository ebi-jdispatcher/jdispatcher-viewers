import { fabric } from "fabric";
import { TextType, ColorSchemeEnum } from "./custom-types";
import { VisualOutput } from "./visual-output-app";

export function mouseOverText(
    fabricObj: fabric.Object,
    textObj: TextType,
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
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
    _this: VisualOutput
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.setOptions(textObj);
            if (_this.colorScheme != value) {
                e.target.setOptions({
                    fill: "grey"
                });
            }
            _this.canvas.renderAll();
        }
    });
}
