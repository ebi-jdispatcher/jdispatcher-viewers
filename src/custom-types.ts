import { SSSResultModel } from "./data-model";

export enum CanvasStatus {
    New = "new",
    Rendered = "rendered"
}
export class CanvasType {
    constructor(
        public jobId: string,
        public dataObj: SSSResultModel,
        public status: CanvasStatus
    ) {}
}

export interface TextType {
    fontWeight: string;
    fontSize: number;
    selectable: boolean;
    evented: boolean;
    objectCaching: false;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    stroke?: string;
    fill?: string;
    [key: string]: any;
}

export interface LineType {
    selectable: boolean;
    evented: boolean;
    objectCaching: false;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    [key: string]: any;
}

export interface GroupType {
    selectable: boolean;
    evented: boolean;
    objectCaching: false;
    [key: string]: any;
}
