import { fabric } from "fabric";
import { CanvasDefaults } from "./config";
import { InputType, TextType, RectType } from "./custom-types";
import {
    getTextLegendPaddingFactor,
    getQuerySubjPixelCoords,
    getEvalPixelCoords,
    getHspPixelCoords,
    getTotalPixels
} from "./coords-utilities";
import {
    drawLineTracks,
    drawDomainTracks,
    drawLineAxis
} from "./drawing-utilities";
import { getRgbColor, getGradientSteps } from "./color-utilities";
import {
    mouseDownText,
    mouseOverText,
    mouseOutText,
    mouseOverDomain,
    mouseOutDomain
} from "./custom-events";
import { colorDefaultGradient, defaultGradient } from "./color-schemes";
import { numberToString } from "./other-utilities";

export class FabricjsRenderer {
    public canvas: fabric.Canvas;
    private canvasHeight: number = CanvasDefaults.canvasHeight;
    private canvasWidth: number = CanvasDefaults.canvasWidth;
    private topPadding: number = 2;
    private queryLen: number = 0;
    private subjLen: number = 0;
    private startQueryPixels: number;
    private endQueryPixels: number;
    private startEvalPixels: number;
    private endEvalPixels: number;
    private startSubjPixels: number;
    private endSubjPixels: number;
    private gradientSteps: number[] = [];

    constructor(
        public canvasObj: InputType,
        private limitNumberHsps: boolean = true,
        private scaleType: string = "dynamic"
    ) {
        this.canvas = new fabric.Canvas("canvas", {});
        // canvas header
        this.drawHeaderTextGroup();
        // content header
        this.queryLen = this.canvasObj.dataObj.query_len;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
        [
            this.startQueryPixels,
            this.endQueryPixels,
            this.startSubjPixels,
            this.endSubjPixels
        ] = getQuerySubjPixelCoords(this.queryLen, this.subjLen, this.subjLen);
        [this.startEvalPixels, this.endEvalPixels] = getEvalPixelCoords(
            this.endQueryPixels
        );

        if (this.canvasObj.dataObj.hits.length > 0) {
            // content header
            this.topPadding += 25;
            this.drawContentHeaderGroup();
            // dynamic content
            this.topPadding += 25;
            this.drawDynamicContentGroup();
            // color scale
            this.topPadding += 20;
            this.drawColorScaleGroup();
        } else {
            // text content: "No hits found!"
            this.topPadding += 20;
            this.drawNoHitsFoundText();
        }
        // canvas footer
        this.topPadding += 30;
        this.drawFooterText();
        // finishing off
        this.topPadding += 20;
        if (this.canvasHeight < this.topPadding) {
            this.canvasHeight = this.topPadding;
        }
        this.setFrameSize();
        this.renderCanvas();
    }
    private setFrameSize() {
        this.canvas.setHeight(this.canvasHeight);
        this.canvas.setWidth(this.canvasWidth);
    }
    private renderCanvas() {
        this.canvas.renderAll();
    }
    private drawHeaderTextGroup() {
        const origTopPadding = this.topPadding;
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: CanvasDefaults.fontSize + 1,
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
        textObj.fontSize = CanvasDefaults.fontSize;
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
        textObj.left = CanvasDefaults.canvasWidth - 133;
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
            CanvasDefaults.groupConfig
        );
        this.canvas.add(textGroup);
    }
    private drawNoHitsFoundText() {
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: CanvasDefaults.fontSize + 1,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding,
            left: CanvasDefaults.maxPixels / 2,
            fill: "red"
        };
        this.canvas.add(
            new fabric.Text(
                "--------------------No hits found--------------------",
                textObj
            )
        );
    }
    private drawContentHeaderTextGroup() {
        let textObj: TextType = {
            fontWeight: "bold",
            fontSize: CanvasDefaults.fontSize + 1,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding + 2,
            textAlign: "center"
        };
        const totalQueryPixels = getTotalPixels(
            this.queryLen,
            this.subjLen,
            this.queryLen
        );
        const totalSubjPixels = getTotalPixels(
            this.queryLen,
            this.subjLen,
            this.subjLen
        );
        // Query Match
        textObj.left = this.startQueryPixels;
        const queryText = new fabric.Text("Sequence Match", textObj);
        queryText.width = totalQueryPixels;
        // E-value
        textObj.left = this.startEvalPixels;
        const evalueText = new fabric.Text("E-value", textObj);
        evalueText.width = CanvasDefaults.evaluePixels;
        // Subject Match
        textObj.left = this.startSubjPixels;
        const subjText = new fabric.Text("Subject Match", textObj);
        subjText.width = totalSubjPixels;
        const textGroup = new fabric.Group(
            [queryText, evalueText, subjText],
            CanvasDefaults.groupConfig
        );
        this.canvas.add(textGroup);
    }
    private drawContentMiddleLineGroup() {
        let lineGroup: fabric.Group;
        [lineGroup, this.topPadding] = drawLineTracks(
            this.startQueryPixels,
            this.endQueryPixels,
            this.startSubjPixels,
            this.endSubjPixels,
            this.topPadding,
            2
        );
        this.canvas.add(lineGroup);
    }
    private drawContentFooterTextGroup() {
        let textObj: TextType = {
            fontWeight: "normal",
            fontType: "monospace",
            fontSize: CanvasDefaults.fontSize,
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding
        };
        // Start Query
        textObj.left = this.startQueryPixels - 2.5;
        const startQueryText = new fabric.Text("1", textObj);
        // End Query
        let positionFactor: number = getTextLegendPaddingFactor(
            `${this.queryLen}`
        );
        textObj.left = this.endQueryPixels - positionFactor;
        const endQueryText = new fabric.Text(`${this.queryLen}`, textObj);
        // Start Subject
        textObj.left = this.startSubjPixels - 2.5;
        const startSubjText = new fabric.Text("1", textObj);
        // End Subject
        positionFactor = getTextLegendPaddingFactor(`${this.subjLen}`);
        textObj.left = this.endSubjPixels - positionFactor;
        const endSubjText = new fabric.Text(`${this.subjLen}`, textObj);
        const textGroup = new fabric.Group(
            [startQueryText, endQueryText, startSubjText, endSubjText],
            CanvasDefaults.groupConfig
        );
        this.canvas.add(textGroup);
    }
    private drawContentHeaderGroup() {
        this.drawContentHeaderTextGroup();
        this.topPadding += 10;
        this.drawContentMiddleLineGroup();
        this.topPadding += 5;
        this.drawContentFooterTextGroup();
    }

    private drawDynamicContentGroup() {
        // draw a new track per hsp for each hit
        // only display 10 hsps per hit
        const queryLen: number = this.canvasObj.dataObj.query_len;
        let subjLen: number = 0;
        let maxHitIDLen: number = 0;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > subjLen) subjLen = hit.hit_len;
            if (hit.hit_id.length > maxHitIDLen)
                maxHitIDLen = hit.hit_id.length;
        }
        let minEval: number = Number.MAX_VALUE;
        let maxEval: number = 0;
        let minNotZeroEval: number = Number.MAX_VALUE;

        for (const hit of this.canvasObj.dataObj.hits) {
            for (const hsp of hit.hit_hsps) {
                if (hsp.hsp_expect! < minEval) minEval = hsp.hsp_expect!;
                if (hsp.hsp_expect! > maxEval) maxEval = hsp.hsp_expect!;
                if (hsp.hsp_expect! < minNotZeroEval && hsp.hsp_expect! > 0.0)
                    minNotZeroEval = hsp.hsp_expect!;
            }
        }

        this.gradientSteps = getGradientSteps(
            minEval,
            maxEval,
            minNotZeroEval,
            this.scaleType
        );

        for (const hit of this.canvasObj.dataObj.hits) {
            let numberHsps: number = 0;
            const totalNumberHsps: number = hit.hit_hsps.length;
            // Hit ID + Hit Description text tracks
            let textObj: TextType = {
                fontWeight: "normal",
                fontFamily: "monospace",
                fontSize: CanvasDefaults.fontSize - 2,
                selectable: false,
                evented: false,
                objectCaching: false,
                top: this.topPadding + 2
            };

            const variableSpace = " ".repeat(maxHitIDLen - hit.hit_id.length);
            const spaceText: fabric.Text = new fabric.Text(
                variableSpace,
                textObj
            );
            this.canvas.add(spaceText);

            let hit_def: string = `${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
            let hit_def_full: string = `${variableSpace}${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
            if (hit_def_full.length > 40) {
                hit_def = (hit_def_full.slice(0, 38) + "...").slice(
                    variableSpace.length
                );
            }
            textObj.left = 10 + variableSpace.length * 6;
            textObj.evented = true;
            const hitText: fabric.Text = new fabric.Text(hit_def, textObj);
            this.canvas.add(hitText);
            mouseOver(hitText, textObj, this.canvas);
            mouseDown(hitText, hit.hit_url, this.canvas);
            mouseOut(hitText, textObj, this.canvas);
            for (const hsp of hit.hit_hsps) {
                numberHsps++;
                if (this.limitNumberHsps && numberHsps > 10) {
                    // notice about not all HSPs being displayed
                    let textObj: TextType = {
                        fontWeight: "normal",
                        fontSize: CanvasDefaults.fontSize,
                        selectable: false,
                        evented: false,
                        objectCaching: false,
                        top: this.topPadding,
                        left: CanvasDefaults.maxPixels / 2,
                        fill: "red"
                    };
                    this.canvas.add(
                        new fabric.Text(
                            `This hit contains ${totalNumberHsps} alignments, ` +
                                `but only the first 10 are displayed`,
                            textObj
                        )
                    );
                    this.topPadding += 20;
                    break;
                } else {
                    // line Tracks
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
                    ] = getQuerySubjPixelCoords(queryLen, subjLen, subjHspLen);

                    let linesGroup: fabric.Group;
                    [linesGroup, this.topPadding] = drawLineTracks(
                        startQueryPixels,
                        endQueryPixels,
                        startSubjPixels,
                        endSubjPixels,
                        this.topPadding,
                        1
                    );
                    this.canvas.add(linesGroup);

                    // domain tracks
                    let startQueryHspPixels: number;
                    let endQueryHspPixels: number;
                    let startSubjHspPixels: number;
                    let endSubjHspPixels: number;
                    const hspQueryStart: number = hsp.hsp_query_from;
                    const hspQueryEnd: number = hsp.hsp_query_to;
                    const hspSubjStart: number = hsp.hsp_hit_from;
                    const hspSubjEnd: number = hsp.hsp_hit_to;
                    [
                        startQueryHspPixels,
                        endQueryHspPixels
                    ] = getHspPixelCoords(
                        queryLen,
                        subjLen,
                        queryLen,
                        startQueryPixels,
                        hspQueryStart,
                        hspQueryEnd
                    );
                    [startSubjHspPixels, endSubjHspPixels] = getHspPixelCoords(
                        queryLen,
                        subjLen,
                        subjHspLen,
                        startSubjPixels,
                        hspSubjStart,
                        hspSubjEnd
                    );
                    const color = getRgbColor(
                        hsp.hsp_expect!,
                        this.gradientSteps,
                        defaultGradient
                    );
                    let domainsGroup: fabric.Group;
                    [domainsGroup, this.topPadding] = drawDomainTracks(
                        startQueryHspPixels,
                        endQueryHspPixels,
                        startSubjHspPixels,
                        endSubjHspPixels,
                        this.topPadding,
                        color
                    );
                    this.canvas.add(domainsGroup);

                    // E-value text tracks
                    let textObj: TextType = {
                        fontWeight: "normal",
                        fontSize: CanvasDefaults.fontSize,
                        selectable: false,
                        evented: false,
                        objectCaching: false,
                        top: this.topPadding - 15,
                        textAlign: "center"
                    };

                    textObj.left = this.startEvalPixels;
                    const evalText: fabric.Text = new fabric.Text(
                        numberToString(hsp.hsp_expect!),
                        textObj
                    );
                    evalText.width = CanvasDefaults.evaluePixels;
                    this.canvas.add(evalText);
                }
            }
        }
    }

    private drawColorScaleGroup() {
        // E-value Text
        const textObj: TextType = {
            fontSize: CanvasDefaults.fontSize + 1,
            fontWeight: "normal",
            selectable: false,
            evented: false,
            objectCaching: false,
            left: CanvasDefaults.leftScalePaddingPixels - 50,
            top: this.topPadding
        };
        var evalueText = new fabric.Text("E-value", textObj);
        this.canvas.add(evalueText);

        // E-value Color Gradient
        const rectObj: RectType = {
            selectable: false,
            evented: false,
            objectCaching: false,
            left: CanvasDefaults.leftScalePaddingPixels,
            top: this.topPadding,
            width: CanvasDefaults.scalePixels,
            height: 15
        };
        var colorScale = new fabric.Rect(rectObj);
        colorDefaultGradient(colorScale, 0, CanvasDefaults.scalePixels);
        this.canvas.add(colorScale);

        // E-value Axis (line and ticks)
        const oneForthGradPixels =
            (CanvasDefaults.leftScalePaddingPixels +
                CanvasDefaults.scalePixels -
                CanvasDefaults.leftScalePaddingPixels) /
            4;
        let axisGroup: fabric.Group;
        [axisGroup, this.topPadding] = drawLineAxis(
            CanvasDefaults.leftScalePaddingPixels,
            CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels,
            CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels * 2,
            CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels * 3,
            CanvasDefaults.leftScalePaddingPixels + CanvasDefaults.scalePixels,
            this.topPadding,
            1
        );
        this.canvas.add(axisGroup);

        // E-value scale tick mark labels
        this.topPadding += 5;
        textObj.top = this.topPadding;
        textObj.fontType = "monospace";
        textObj.fontSize = CanvasDefaults.fontSize;
            // Start Tick Label
            (textObj.left =
                CanvasDefaults.leftScalePaddingPixels -
                numberToString(this.gradientSteps[0]).length * 3);
        const startLabelText = new fabric.Text(
            numberToString(this.gradientSteps[0]),
            textObj
        );
        // 25% Tick Label
        textObj.left =
            CanvasDefaults.leftScalePaddingPixels +
            oneForthGradPixels -
            numberToString(this.gradientSteps[1]).length * 3;
        const o25LabelText = new fabric.Text(
            numberToString(this.gradientSteps[1]),
            textObj
        );
        // 50% Tick Label
        textObj.left =
            CanvasDefaults.leftScalePaddingPixels +
            oneForthGradPixels * 2 -
            numberToString(this.gradientSteps[2]).length * 3;
        const o50LabelText = new fabric.Text(
            numberToString(this.gradientSteps[2]),
            textObj
        );
        // 75% Tick Label
        textObj.left =
            CanvasDefaults.leftScalePaddingPixels +
            oneForthGradPixels * 3 -
            numberToString(this.gradientSteps[3]).length * 3;
        const o75LabelText = new fabric.Text(
            numberToString(this.gradientSteps[3]),
            textObj
        );
        // End Tick Label
        textObj.left =
            CanvasDefaults.leftScalePaddingPixels +
            CanvasDefaults.scalePixels -
            numberToString(this.gradientSteps[4]).length * 3;
        const endLabelText = new fabric.Text(
            numberToString(this.gradientSteps[4]),
            textObj
        );

        const textGroup = new fabric.Group(
            [
                startLabelText,
                o25LabelText,
                o50LabelText,
                o75LabelText,
                endLabelText
            ],
            CanvasDefaults.groupConfig
        );
        this.canvas.add(textGroup);
    }

    private drawFooterText() {
        let textObj: TextType = {
            fontWeight: "normal",
            fontSize: CanvasDefaults.fontSize,
            selectable: false,
            evented: true,
            objectCaching: false,
            top: this.topPadding,
            left: 225,
            underline: false
        };
        const copyright =
            `European Bioinformatics Institute 2006-2020. ` +
            `EBI is an Outstation of the European Molecular Biology Laboratory.`;
        const copyrightText = new fabric.Text(`${copyright}`, textObj);
        this.canvas.add(copyrightText);
        mouseOver(copyrightText, textObj, this.canvas);
        mouseDown(copyrightText, "https://www.ebi.ac.uk", this.canvas);
        mouseOut(copyrightText, textObj, this.canvas);
    }
}
