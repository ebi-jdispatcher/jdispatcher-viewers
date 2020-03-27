import { GroupType } from "./custom-types";

export class CanvasDefaults {
    public static canvasWidth: number = 1000;
    public static canvasHeight: number = 110;
    public static maxPixels: number = (66.0 * CanvasDefaults.canvasWidth) / 100;
    public static evaluePixels: number =
        (7.0 * CanvasDefaults.canvasWidth) / 100;
    public static leftPaddingPixels: number =
        (26.5 * CanvasDefaults.canvasWidth) / 100;
    public static borderPixels: number =
        (0.15 * CanvasDefaults.canvasWidth) / 100;
    public static scalePixels: number =
        (75.0 * CanvasDefaults.canvasWidth) / 100;
    public static leftScalePaddingPixels: number =
        (20.0 * CanvasDefaults.canvasWidth) / 100;
    public static fontSize: number = 12;
    public static groupConfig: GroupType = {
        selectable: false,
        evented: false,
        objectCaching: false
    };
    constructor() {}
}
