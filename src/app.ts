import { fabric } from "fabric";
import { SSSResultModel } from "./data-model";

interface TextType {
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

interface LineType {
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

interface GroupType {
    selectable: boolean;
    evented: boolean;
    objectCaching: false;
    [key: string]: any;
}

class Defaults {
    public static canvasWidth: number = 1000;
    public static canvasHeight: number = 110;
    public static maxPixels: number = (65.0 * Defaults.canvasWidth) / 100;
    public static evaluePixels: number = (8.0 * Defaults.canvasWidth) / 100;
    public static leftPaddingPixels: number =
        (26.5 * Defaults.canvasWidth) / 100;
    public static borderPixels: number = (0.15 * Defaults.canvasWidth) / 100;
    public static fontSize: number = 12;
    public static groupConfig: GroupType = {
        selectable: false,
        evented: false,
        objectCaching: false
    };
    constructor() {}
}

// Input Data Type
class CanvasType {
    constructor(public jobId: string, public dataObj: SSSResultModel) {}
}

// Object Renderers
class HeaderRenderer {
    constructor(private canvasObj: CanvasType, private topPadding: number) {}
    public drawHeaderTextGroup(): [fabric.Group, number] {
        const origTopPadding = this.topPadding;
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: Defaults.fontSize + 1,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding,
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
        this.topPadding += 12;
        textObj.top = this.topPadding;
        const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
        // Sequence
        const sequence = this.canvasObj.dataObj.query_def;
        this.topPadding += 12;
        textObj.top = this.topPadding;
        const sequenceText = new fabric.Text(`Sequence: ${sequence}`, textObj);
        // Length
        const length = this.canvasObj.dataObj.query_len;
        this.topPadding += 12;
        textObj.top = this.topPadding;
        const lengthText = new fabric.Text(`Length: ${length}`, textObj);
        // Start
        const start = this.canvasObj.dataObj.start;
        textObj.top = origTopPadding;
        textObj.left = Defaults.canvasWidth - 133;
        const startText = new fabric.Text(`${start}`, textObj);
        // End
        const end = this.canvasObj.dataObj.end;
        textObj.top = origTopPadding + 12;
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
        return [textGroup, this.topPadding];
    }
}

class FooterRenderer {
    constructor(private topPadding: number) {}
    public drawFooterTextGroup(): [fabric.Text, number] {
        let textObj: TextType = {
            fontWeight: "normal",
            fontSize: Defaults.fontSize,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding + 0,
            left: 0,
            textAlign: "center"
        };
        const copyright =
            `European Bioinformatics Institute 2006-2020. ` +
            `EBI is an Outstation of the European Molecular Biology Laboratory.`;
        const copyrightText = new fabric.Text(`${copyright}`, textObj);
        copyrightText.width = Defaults.canvasWidth;
        return [copyrightText, this.topPadding];
    }
}

function getHorizontalPaddingFactor(inputString: string): number {
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

function getPixelCoordinates(
    queryLen: number,
    subjLen: number,
    subjHspLen: number,
    evalPixels: boolean = false
) {
    const totalLen: number = queryLen + subjLen;
    const totalQueryPixels: number =
        (queryLen * Defaults.maxPixels - Defaults.evaluePixels) / totalLen;
    // const totalSubjPixels: number =
    //     (subjLen * Defaults.maxPixels - Defaults.evaluePixels) / totalLen;
    const subjDiffPixels: number =
        (subjHspLen * Defaults.maxPixels - Defaults.evaluePixels) / totalLen;
    const startQueryPixels = Defaults.leftPaddingPixels + Defaults.borderPixels;
    const endQueryPixels =
        Defaults.leftPaddingPixels + totalQueryPixels - Defaults.borderPixels;
    const startSubjPixels =
        Defaults.leftPaddingPixels +
        totalQueryPixels +
        Defaults.evaluePixels +
        Defaults.borderPixels;
    const endSubjPixels =
        Defaults.leftPaddingPixels +
        totalQueryPixels +
        Defaults.evaluePixels +
        subjDiffPixels -
        Defaults.borderPixels;
    if (evalPixels) {
        const startEvalPixels =
            Defaults.leftPaddingPixels +
            totalQueryPixels +
            Defaults.borderPixels;
        const endEvalPixels =
            Defaults.leftPaddingPixels +
            totalQueryPixels +
            Defaults.evaluePixels -
            Defaults.borderPixels;
        return [
            startQueryPixels,
            endQueryPixels,
            startEvalPixels,
            endEvalPixels,
            startSubjPixels,
            endSubjPixels
        ];
    }
    return [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels];
}

function drawLineTracks(
    startQueryPixels: number,
    endQueryPixels: number,
    startSubjPixels: number,
    endSubjPixels: number,
    topPadding: number,
    strokeWidth: number
): [fabric.Group, number] {
    const top: number = 15;
    let lineObj: LineType = {
        selectable: false,
        evented: false,
        objectCaching: false,
        top: topPadding + top,
        stroke: "black",
        strokeWidth: strokeWidth
    };
    //  Query
    const coordsQuery: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top,
        endQueryPixels,
        topPadding + top
    ];
    lineObj.left = startQueryPixels;
    const queryLine = new fabric.Line(coordsQuery, lineObj);

    const coordsQueryStartCap: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top - 3,
        startQueryPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);

    const coordsQueryEndCap: [number, number, number, number] = [
        endQueryPixels,
        topPadding + top - 3,
        endQueryPixels,
        topPadding + top + 3
    ];
    lineObj.left = endQueryPixels;
    const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);

    // Subject
    const coordsSubj: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top,
        endSubjPixels,
        topPadding + top
    ];
    lineObj.top = topPadding + top;
    lineObj.left = startSubjPixels;
    const subjLine = new fabric.Line(coordsSubj, lineObj);

    const coordsSubjStartCap: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top - 3,
        startSubjPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);

    const coordsSubjEndCap: [number, number, number, number] = [
        endSubjPixels,
        topPadding + top - 3,
        endSubjPixels,
        topPadding + top + 3
    ];
    lineObj.left = endSubjPixels;
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
    return [lineGroup, topPadding + top];
}

class ContentHeaderRenderer {
    private queryLen: number = 0;
    private subjLen: number = 0;
    private startQueryPixels: number;
    private endQueryPixels: number;
    private startEvalPixels: number;
    private endEvalPixels: number;
    private startSubjPixels: number;
    private endSubjPixels: number;

    constructor(public canvasObj: CanvasType, private topPadding: number) {
        this.queryLen = this.canvasObj.dataObj.query_len;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
        [
            this.startQueryPixels,
            this.endQueryPixels,
            this.startEvalPixels,
            this.endEvalPixels,
            this.startSubjPixels,
            this.endSubjPixels
        ] = getPixelCoordinates(
            this.queryLen,
            this.subjLen,
            this.subjLen,
            true
        );
    }
    private drawHeaderTextGroup(): fabric.Group {
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: Defaults.fontSize + 1,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding + 2
        };
        // Query Match
        textObj.left =
            this.startQueryPixels +
            (this.endQueryPixels - this.startQueryPixels) / 2 -
            45;
        const queryText = new fabric.Text("Sequence Match", textObj);
        // E-value
        textObj.left =
            this.startEvalPixels +
            (this.endEvalPixels - this.startEvalPixels) / 2 -
            20;
        const evalueText = new fabric.Text("E-value", textObj);
        // Subject Match
        textObj.left =
            this.startSubjPixels +
            (this.endSubjPixels - this.startSubjPixels) / 2 -
            45;
        const subjText = new fabric.Text("Subject Match", textObj);
        const textGroup = new fabric.Group(
            [queryText, evalueText, subjText],
            Defaults.groupConfig
        );
        return textGroup;
    }
    private drawMiddleLineGroup(): fabric.Group {
        let lineGroup: fabric.Group;
        [lineGroup, this.topPadding] = drawLineTracks(
            this.startQueryPixels,
            this.endQueryPixels,
            this.startSubjPixels,
            this.endSubjPixels,
            this.topPadding + 2,
            2
        );
        return lineGroup;
    }
    private drawFooterTextGroup(): fabric.Group {
        let textObj: TextType = {
            fontWeight: "normal",
            fontSize: Defaults.fontSize,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding + 7
        };
        // Start Query
        textObj.left = this.startQueryPixels - 2.5;
        const startQueryText = new fabric.Text("1", textObj);
        // End Query
        let positionFactor: number = getHorizontalPaddingFactor(
            `${this.queryLen}`
        );
        textObj.left = this.endQueryPixels - positionFactor;
        const endQueryText = new fabric.Text(`${this.queryLen}`, textObj);
        // Start Subject
        textObj.left = this.startSubjPixels - 2.5;
        const startSubjText = new fabric.Text("1", textObj);
        // End Subject
        positionFactor = getHorizontalPaddingFactor(`${this.subjLen}`);
        textObj.left = this.endSubjPixels - positionFactor;
        const endSubjText = new fabric.Text(`${this.subjLen}`, textObj);
        const textGroup = new fabric.Group(
            [startQueryText, endQueryText, startSubjText, endSubjText],
            Defaults.groupConfig
        );
        return textGroup;
    }
    public drawContentHeader(): [fabric.Group, number] {
        const headerText = this.drawHeaderTextGroup();
        const middleLine = this.drawMiddleLineGroup();
        const footerText = this.drawFooterTextGroup();
        const mixedGroup = new fabric.Group(
            [headerText, middleLine, footerText],
            Defaults.groupConfig
        );
        this.topPadding += 5;
        return [mixedGroup, this.topPadding];
    }
}

class ContentRenderer {
    private trackObjects: fabric.Object[] = [];

    constructor(
        public canvasObj: CanvasType,
        private topPadding: number,
        private limitNumberHsps: boolean = true
    ) {
        // draw a new track per hsp for each hit
        // only display 10 hsps per hit
        const queryLen: number = this.canvasObj.dataObj.query_len;
        let subjLen: number = 0;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > subjLen) subjLen = hit.hit_len;
        }
        for (const hit of this.canvasObj.dataObj.hits) {
            let numberHsps: number = 0;
            const totalNumberHsps: number = hit.hit_hsps.length;
            for (const _hsp of hit.hit_hsps) {
                numberHsps++;
                if (this.limitNumberHsps && numberHsps > 10) {
                    // notice about not all HSPs being displayed
                    this.topPadding += 5;
                    let textObj: TextType = {
                        fontWeight: "normal",
                        fontSize: Defaults.fontSize,
                        selectable: false,
                        evented: false,
                        objectCaching: false,
                        top: this.topPadding,
                        left: Defaults.maxPixels / 2,
                        fill: "red"
                    };
                    this.trackObjects.push(
                        new fabric.Text(
                            `This hit contains ${totalNumberHsps} alignments, ` +
                                `but only the first 10 are displayed`,
                            textObj
                        )
                    );
                    this.topPadding += 15;
                    break;
                } else {
                    const subjHspLen: number = hit.hit_len;
                    let startQueryPixels: number;
                    let endQueryPixels: number;
                    let startSubjPixels: number;
                    let endSubjPixels: number;
                    [
                        startQueryPixels,
                        endQueryPixels,
                        startSubjPixels,
                        endSubjPixels
                    ] = getPixelCoordinates(
                        queryLen,
                        subjLen,
                        subjHspLen,
                        false
                    );
                    let lineGroup: fabric.Group;
                    [lineGroup, this.topPadding] = drawLineTracks(
                        startQueryPixels,
                        endQueryPixels,
                        startSubjPixels,
                        endSubjPixels,
                        this.topPadding,
                        1
                    );
                    this.trackObjects.push(lineGroup);
                }
                //   this.topPadding += 5;
            }
        }
    }
    public drawContent(): [fabric.Group, number] {
        const lineGroup = new fabric.Group(
            [...this.trackObjects],
            Defaults.groupConfig
        );
        console.log(lineGroup);
        return [lineGroup, this.topPadding];
    }
}

export class FabricjsRenderer {
    public canvas: fabric.Canvas;
    private canvasHeight: number = Defaults.canvasHeight;
    private canvasWidth: number = Defaults.canvasWidth;
    private canvasObjects: fabric.Object[] = [];

    constructor(public canvasObj: CanvasType) {
        this.canvas = new fabric.Canvas("canvas", {
            selectionLineWidth: 2
        });
        let topPadding: number = 2;

        // canvas header
        let headerGroup: fabric.Group;
        [headerGroup, topPadding] = new HeaderRenderer(
            canvasObj,
            topPadding
        ).drawHeaderTextGroup();
        this.canvasObjects.push(headerGroup);

        // content header
        if (this.canvasObj.dataObj.hits.length > 0) {
            topPadding += 15;
            let contentHeaderGroup: fabric.Group;
            [contentHeaderGroup, topPadding] = new ContentHeaderRenderer(
                canvasObj,
                topPadding
            ).drawContentHeader();
            this.canvasObjects.push(contentHeaderGroup);

            // dynamic content
            topPadding += 15;
            let contentGroup: fabric.Group;
            [contentGroup, topPadding] = new ContentRenderer(
                canvasObj,
                topPadding
            ).drawContent();
            this.canvasObjects.push(contentGroup);

            // TODO color scale
        } else {
            // text content: "No hits found!"
            topPadding += 15;
            let textObj: TextType = {
                fontWeight: "bold",
                fontSize: 13,
                selectable: false,
                evented: false,
                objectCaching: false,
                top: topPadding
            };
            this.canvasObjects.push(new fabric.Text("No hits found!", textObj));
            topPadding += 10;
        }

        // canvas footer
        topPadding += 20;
        let footerGroup: fabric.Text;
        [footerGroup, topPadding] = new FooterRenderer(
            topPadding
        ).drawFooterTextGroup();
        this.canvasObjects.push(footerGroup);

        // finishing off
        topPadding += 20;
        if (this.canvasHeight < topPadding) {
            this.canvasHeight = topPadding;
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
