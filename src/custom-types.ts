import { SSSResultModel } from "./data-model";

export enum RenderStatusEnum {
    New = "new",
    Rendered = "rendered"
}

export class InputType {
    constructor(
        public jobId: string,
        public dataObj: SSSResultModel,
        public status: RenderStatusEnum
    ) {}
}

export interface TextType {
    fontWeight: string;
    fontSize: number;
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
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
    objectCaching: boolean;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    [key: string]: any;
}

export interface RectType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    fill?: string;
    [key: string]: any;
}

export interface GroupType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    [key: string]: any;
}

export interface ColorType {
    keys: number[];
    [key: number]: [number, number, number];
}[]
