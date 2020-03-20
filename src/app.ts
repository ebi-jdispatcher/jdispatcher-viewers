import { fabric } from "fabric";
import { SSSResultModel } from "./data-model";

interface TextType {
    fontWeight: string;
    fontSize: number;
    selectable: boolean;
    evented: boolean;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    stroke?: string;
    fill?: string;
    [key: string]: any;
}

interface LineType {
    selectable: boolean;
    evented: boolean;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    [key: string]: any;
}

interface GroupType {
    selectable: boolean;
    evented: boolean;
    [key: string]: any;
}

class Defaults {
    public static canvasWidth: number = 1000;
    public static canvasHeight: number = 110;
    public static fontSize: number = 12;
    public static groupConfig: GroupType = {
        selectable: false,
        evented: false
    };
    constructor() {}
}

// Input Data Type
class CanvasType {
    constructor(public jobId: string, public dataObj: SSSResultModel) {}
}

// Object Renderers
class HeaderRenderer {
    constructor(private canvasObj: CanvasType, private topAdjust: number) {}
    public drawHeaderTextGroup() {
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: Defaults.fontSize + 1,
            selectable: false,
            evented: false,
            top: this.topAdjust + 0,
            left: 5
        };
        // program & version
        const program = this.canvasObj.dataObj.program;
        const version = this.canvasObj.dataObj.version;
        const programText = new fabric.Text(
            `${program} (version: ${version})`,
            textObj
        );
        // Database(s)
        let db_names: string[] = [];
        for (const db of this.canvasObj.dataObj.dbs) {
            db_names.push(db.name);
        }
        const dbs: string = db_names.join(", ");
        textObj.fontWeight = "normal";
        textObj.fontSize = Defaults.fontSize;
        textObj.top = this.topAdjust + 12;
        const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
        // Sequence
        const sequence = this.canvasObj.dataObj.query_def;
        textObj.top = this.topAdjust + 24;
        const sequenceText = new fabric.Text(`Sequence: ${sequence}`, textObj);
        // Length
        const length = this.canvasObj.dataObj.query_len;
        textObj.top = this.topAdjust + 36;
        const lengthText = new fabric.Text(`Length: ${length}`, textObj);
        // Start
        const start = this.canvasObj.dataObj.start;
        textObj.top = this.topAdjust + 0;
        textObj.left = Defaults.canvasWidth - 133;
        const startText = new fabric.Text(`${start}`, textObj);
        // End
        const end = this.canvasObj.dataObj.end;
        textObj.top = this.topAdjust + 12;
        const endText = new fabric.Text(`${end}`, textObj);
        const textGroup = new fabric.Group(
            [
                programText,
                databaseText,
                sequenceText,
                lengthText,
                startText,
                endText
            ],
            Defaults.groupConfig
        );
        return textGroup;
    }
}

class FooterRenderer {
    constructor(private topAdjust: number) {}
    public drawFooterTextGroup() {
        let textObj: TextType = {
            fontWeight: "normal",
            fontSize: Defaults.fontSize,
            selectable: false,
            evented: false,
            top: this.topAdjust + 0,
            left: 0,
            textAlign: "center"
        };
        const copyright =
            "European Bioinformatics Institute 2006-2020. EBI is an Outstation of the European Molecular Biology Laboratory.";
        const copyrightText = new fabric.Text(`${copyright}`, textObj);
        copyrightText.width = Defaults.canvasWidth;
        return copyrightText;
    }
}

function findPositionFactor(inputString: string) {
    let positionFactor = 0;
    if (inputString.length === 1) {
        positionFactor = 2.5;
    } else if (inputString.length === 2) {
        positionFactor = 10;
    } else if (inputString.length === 3) {
        positionFactor = 15.5;
    } else if (inputString.length === 4) {
        positionFactor = 21;
    }
    return positionFactor;
}

class ContentHeaderRenderer {
    private maxPixels: number = (65.0 * Defaults.canvasWidth) / 100;
    private evaluePixels: number = (7.0 * Defaults.canvasWidth) / 100;
    private leftpadPixels: number = (27.5 * Defaults.canvasWidth) / 100;
    private borderPixels: number = (0.15 * Defaults.canvasWidth) / 100;
    private queryPixels: number;
    private subjPixels: number;
    private startQueryPixels: number;
    private endQueryPixels: number;
    private startEvalPixels: number;
    private endEvalPixels: number;
    private startSubjPixels: number;
    private endSubjPixels: number;

    constructor(
        public canvasObj: CanvasType,
        private queryLen: number,
        private subjLen: number,
        private topAdjust: number
    ) {
        const totalLen: number = this.queryLen + this.subjLen;
        this.queryPixels =
            (this.queryLen * this.maxPixels - this.evaluePixels) / totalLen;
        this.subjPixels =
            (this.subjLen * this.maxPixels - this.evaluePixels) / totalLen;
        this.startQueryPixels = this.leftpadPixels + this.borderPixels;
        this.endQueryPixels =
            this.leftpadPixels + this.queryPixels - this.borderPixels;
        this.startEvalPixels =
            this.leftpadPixels + this.queryPixels + this.borderPixels;
        this.endEvalPixels =
            this.leftpadPixels +
            this.queryPixels +
            this.evaluePixels -
            this.borderPixels;
        this.startSubjPixels =
            this.leftpadPixels +
            this.queryPixels +
            this.evaluePixels +
            this.borderPixels;
        this.endSubjPixels =
            this.leftpadPixels +
            this.queryPixels +
            this.evaluePixels +
            this.subjPixels -
            this.borderPixels;
    }
    private drawHeaderTextGroup() {
        this.drawMiddleLineGroup();
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: Defaults.fontSize,
            selectable: false,
            evented: false,
            top: this.topAdjust + 0
        };
        // Query Match
        textObj.left =
            this.startQueryPixels +
            (this.endQueryPixels - this.startQueryPixels) / 2 -
            41;
        const queryText = new fabric.Text("Sequence Match", textObj);
        // E-value
        textObj.left =
            this.startEvalPixels +
            (this.endEvalPixels - this.startEvalPixels) / 2 -
            17;
        const evalueText = new fabric.Text("E-value", textObj);
        // Subject Match
        textObj.left =
            this.startSubjPixels +
            (this.endSubjPixels - this.startSubjPixels) / 2 -
            35;
        const subjText = new fabric.Text("Subject Match", textObj);
        const textGroup = new fabric.Group(
            [queryText, evalueText, subjText],
            Defaults.groupConfig
        );
        return textGroup;
    }
    private drawMiddleLineGroup() {
        const top: number = 15;
        let lineObj: LineType = {
            selectable: false,
            evented: false,
            top: this.topAdjust + top,
            stroke: "black",
            strokeWidth: 2
        };
        //  Query
        const coordsQuery: [number, number, number, number] = [
            this.startQueryPixels,
            this.topAdjust + top,
            this.endQueryPixels,
            this.topAdjust + top
        ];
        lineObj.left = this.startQueryPixels;
        const queryLine = new fabric.Line(coordsQuery, lineObj);
        lineObj.top = this.topAdjust + top - 2;
        const coordsQueryStartCap: [number, number, number, number] = [
            this.startQueryPixels,
            this.topAdjust + top - 3,
            this.startQueryPixels,
            this.topAdjust + top + 3
        ];
        const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);
        lineObj.left = this.endQueryPixels;
        const coordsQueryEndCap: [number, number, number, number] = [
            this.endQueryPixels,
            this.topAdjust + top - 3,
            this.endQueryPixels,
            this.topAdjust + top + 3
        ];
        const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);
        // Subject
        lineObj.top = this.topAdjust + top;
        const coordsSubj: [number, number, number, number] = [
            this.startSubjPixels,
            this.topAdjust + top,
            this.endSubjPixels,
            this.topAdjust + top
        ];
        lineObj.left = this.startSubjPixels;
        lineObj.top = this.topAdjust + top;
        const subjLine = new fabric.Line(coordsSubj, lineObj);
        lineObj.top = this.topAdjust + top - 2;
        const coordsSubjStartCap: [number, number, number, number] = [
            this.startSubjPixels,
            this.topAdjust + top - 3,
            this.startSubjPixels,
            this.topAdjust + top + 3
        ];
        const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);
        lineObj.left = this.endSubjPixels;
        const coordsSubjEndCap: [number, number, number, number] = [
            this.endSubjPixels,
            this.topAdjust + top - 3,
            this.endSubjPixels,
            this.topAdjust + top + 3
        ];
        const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);
        const lineGroup = new fabric.Group(
            [
                queryLine,
                subjLine,
                queryStartCap,
                queryEndCap,
                subjStartCap,
                subjEndCap
            ],
            Defaults.groupConfig
        );
        return lineGroup;
    }
    private drawFooterTextGroup() {
        let textObj: TextType = {
            fontWeight: "normal",
            fontSize: Defaults.fontSize,
            selectable: false,
            evented: false,
            top: this.topAdjust + 19
        };
        // Start Query
        textObj.left = this.startQueryPixels - 2.5;
        const startQueryText = new fabric.Text("1", textObj);
        // End Query
        let positionFactor: number = findPositionFactor(`${this.queryLen}`);
        textObj.left = this.endQueryPixels - positionFactor;
        const endQueryText = new fabric.Text(`${this.queryLen}`, textObj);
        // Start Subject
        textObj.left = this.startSubjPixels - 2.5;
        const startSubjText = new fabric.Text("1", textObj);
        // End Subject
        positionFactor = findPositionFactor(`${this.subjLen}`);
        textObj.left = this.endSubjPixels - positionFactor;
        const endSubjText = new fabric.Text(`${this.subjLen}`, textObj);
        const textGroup = new fabric.Group(
            [startQueryText, endQueryText, startSubjText, endSubjText],
            Defaults.groupConfig
        );
        return textGroup;
    }
    public drawContentHeader() {
        const headerText = this.drawHeaderTextGroup();
        const middleLine = this.drawMiddleLineGroup();
        const footerText = this.drawFooterTextGroup();
        const mixedGroup = new fabric.Group(
            [headerText, middleLine, footerText],
            Defaults.groupConfig
        );
        return mixedGroup;
    }
}

export class FabricjsRenderer {
    public canvas: fabric.Canvas;
    private canvasHeight: number = Defaults.canvasHeight;
    private canvasWidth: number = Defaults.canvasWidth;
    private canvasObjects: fabric.Object[] = [];
    // private numberHits: number;
    private queryLen: number = 0;
    private subjLen: number = 0;
    private topAdjust: number = 2;

    constructor(public canvasObj: CanvasType) {
        this.canvas = new fabric.Canvas("canvas", {
            selectionLineWidth: 2
        });

        this.queryLen = this.canvasObj.dataObj.query_len;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
        // canvas header
        this.canvasObjects.push(
            new HeaderRenderer(canvasObj, this.topAdjust).drawHeaderTextGroup()
        );
        // content header
        this.topAdjust = 50;
        this.canvasObjects.push(
            new ContentHeaderRenderer(
                canvasObj,
                this.queryLen,
                this.subjLen,
                this.topAdjust
            ).drawContentHeader()
        );

        // TODO dynamic content

        // TODO color scale

        // canvas footer
        this.topAdjust = 100;
        this.canvasObjects.push(
            new FooterRenderer(this.topAdjust).drawFooterTextGroup()
        );

        // finishing off
        this.topAdjust = this.topAdjust + 20;
        if (this.canvasHeight < this.topAdjust) {
            this.canvasHeight = this.topAdjust;
        }
        this.setFrameSize();
        this.renderCanvas();
    }
    private setFrameSize() {
        this.canvas.setHeight(this.canvasHeight);
        this.canvas.setWidth(this.canvasWidth);
    }
    private renderCanvas() {
        this.canvas.add(...this.canvasObjects);
        this.canvas.renderAll();
    }
}
