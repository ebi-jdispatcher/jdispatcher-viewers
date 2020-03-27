import { fabric } from "fabric";
import { TextType } from "./custom-types";
import { FabricjsRenderer } from "./app";

export function mouseOverText(
    fabricObj: fabric.Object,
    textObj: TextType,
    canvas: fabric.Canvas
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "pointer");
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: true });
            canvas.renderAll();
        }
    });
}

export function mouseDownText(
    fabricObj: fabric.Object,
    href: string,
    canvas: fabric.Canvas
) {
    fabricObj.on("mousedown", (e: fabric.IEvent) => {
        if (e.target) {
            window.open(href, "_blank");
            canvas.renderAll();
        }
    });
}

export function mouseOutText(
    fabricObj: fabric.Object,
    textObj: TextType,
    canvas: fabric.Canvas
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: false });
            canvas.renderAll();
        }
    });
}

export function mouseOverDomain(
    fabricObj: fabric.Object,
    fabricGroupObj: fabric.Object,
    canvas: fabric.Canvas
) {
    fabricObj.on("mouseover", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.set("hoverCursor", "pointer");
            fabricGroupObj.set({ visible: true });
            fabricGroupObj.bringToFront();
            canvas.renderAll();
        }
    });
}

export function mouseOutDomain(
    fabricObj: fabric.Object,
    fabricGroupObj: fabric.Object,
    canvas: fabric.Canvas
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            fabricGroupObj.set({ visible: false });
            canvas.renderAll();
        }
    });
}

export function mouseOverCheckbox(
    fabricObj: fabric.Object,
    textObj: TextType,
    _this: FabricjsRenderer
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
    value: string,
    _this: FabricjsRenderer
) {
    fabricObj.on("mousedown", (e: fabric.IEvent) => {
        if (e.target) {
            if (_this.scaleType != value) {
                _this.scaleType = value;
                _this.renderAll();
            }
        }
    });
}

export function mouseOutCheckbox(
    fabricObj: fabric.Object,
    textObj: TextType,
    value: string,
    _this: FabricjsRenderer
) {
    fabricObj.on("mouseout", (e: fabric.IEvent) => {
        if (e.target) {
            e.target.setOptions(textObj);
            if (_this.scaleType != value) {
                e.target.setOptions({
                    fill: "grey"
                });
            }
            _this.canvas.renderAll();
        }
    });
}
