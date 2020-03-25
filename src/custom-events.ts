import { fabric } from "fabric";
import { TextType } from "./custom-types";

export function mouseOver(
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

export function mouseDown(
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

export function mouseOut(
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
