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
    drawLineAxis5Buckets,
    drawLineAxis6Buckets
} from "./drawing-utilities";
import {
    getRgbColorGradient,
    getRgbColorFixed,
    getGradientSteps
} from "./color-utilities";
import {
    mouseDownText,
    mouseOverText,
    mouseOutText,
    mouseOverDomain,
    mouseOutDomain,
    mouseOverCheckbox,
    mouseDownCheckbox,
    mouseOutCheckbox
} from "./custom-events";
import {
    colorDefaultGradient,
    colorNcbiBlastGradient,
    defaultGradient,
    ncbiBlastGradient
} from "./color-schemes";
import { numberToString } from "./other-utilities";

export class FabricjsRenderer {
    public canvas: fabric.Canvas;
    private canvasHeight: number = CanvasDefaults.canvasHeight;
    private canvasWidth: number = CanvasDefaults.canvasWidth;
    private topPadding: number = 0;
    private queryLen: number = 0;
    private subjLen: number = 0;
    private startQueryPixels: number;
    private endQueryPixels: number;
    private startEvalPixels: number;
    private startSubjPixels: number;
    private endSubjPixels: number;
    private gradientSteps: number[] = [];

    constructor(
        public canvasObj: InputType,
        public limitNumberHsps: boolean = true,
        public scaleType: string = "dynamic"
    ) {
        this.canvas = new fabric.Canvas("canvas", {});
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
        this.startEvalPixels = getEvalPixelCoords(this.endQueryPixels);

        // render All components
        this.renderAll();
    }
    public renderAll() {
        this.canvas.clear();
        this.topPadding = 2;
        // canvas header
        this.drawHeaderTextGroup();

        // content header
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
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
        // Sequence
        const sequence = this.canvasObj.dataObj.query_def;
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const sequenceText = new fabric.Text("Sequence: ", textObj);
        let textSeqObj: TextType = {
            fontWeight: "normal",
            fontFamily: "Menlo",
            fontSize: CanvasDefaults.fontSize - 2,
            selectable: false,
            evented: true,
            objectCaching: false,
            top: this.topPadding,
            left: 57.5
        };
        const sequenceDefText = new fabric.Text(`${sequence}`, textSeqObj);
        this.canvas.add(sequenceDefText);
        if (this.canvasObj.dataObj.query_url != null) {
            mouseOverText(sequenceDefText, textSeqObj, this.canvas);
            mouseDownText(
                sequenceDefText,
                this.canvasObj.dataObj.query_url,
                this.canvas
            );
            mouseOutText(sequenceDefText, textSeqObj, this.canvas);
        }
        // Length
        const length = this.canvasObj.dataObj.query_len;
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const lengthText = new fabric.Text(`Length: ${length}`, textObj);
        // Start
        const start = this.canvasObj.dataObj.start;
        textObj.top = origTopPadding;
        textObj.left = CanvasDefaults.canvasWidth - 133;
        const startText = new fabric.Text(`${start}`, textObj);
        // End
        const end = this.canvasObj.dataObj.end;
        textObj.top = origTopPadding + 15;
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
        this.topPadding += 5;
        textObj.left = this.startEvalPixels;
        let evalueText;
        // E-value/ Bits
        if (this.scaleType === "ncbiblast") {
            evalueText = new fabric.Text("Bit score", textObj);
        } else {
            evalueText = new fabric.Text("E-value", textObj);
        }
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
        let maxIDLen: number = 0;
        for (const hit of this.canvasObj.dataObj.hits) {
            if (hit.hit_len > subjLen) subjLen = hit.hit_len;
            if (hit.hit_db.length + hit.hit_id.length > maxIDLen)
                maxIDLen = hit.hit_db.length + hit.hit_id.length;
        }
        let minScore: number = Number.MAX_VALUE;
        let maxScore: number = 0;
        let minNotZeroScore: number = Number.MAX_VALUE;
        for (const hit of this.canvasObj.dataObj.hits) {
            for (const hsp of hit.hit_hsps) {
                if (this.scaleType === "ncbiblast") {
                    if (hsp.hsp_bit_score! < minScore)
                        minScore = hsp.hsp_bit_score!;
                    if (hsp.hsp_bit_score! > maxScore)
                        maxScore = hsp.hsp_bit_score!;
                    if (
                        hsp.hsp_bit_score! < minNotZeroScore &&
                        hsp.hsp_bit_score! > 0.0
                    )
                        minNotZeroScore = hsp.hsp_bit_score!;
                } else {
                    if (hsp.hsp_expect! < minScore) minScore = hsp.hsp_expect!;
                    if (hsp.hsp_expect! > maxScore) maxScore = hsp.hsp_expect!;
                    if (
                        hsp.hsp_expect! < minNotZeroScore &&
                        hsp.hsp_expect! > 0.0
                    )
                        minNotZeroScore = hsp.hsp_expect!;
                }
            }
        }

        if (this.scaleType === "ncbiblast") {
            this.gradientSteps = getGradientSteps(
                minScore,
                maxScore,
                minNotZeroScore,
                this.scaleType
            );
        } else {
            this.gradientSteps = getGradientSteps(
                minScore,
                maxScore,
                minNotZeroScore,
                this.scaleType
            );
        }

        for (const hit of this.canvasObj.dataObj.hits) {
            let numberHsps: number = 0;
            const totalNumberHsps: number = hit.hit_hsps.length;
            // Hit ID + Hit Description text tracks
            let textObj: TextType = {
                fontWeight: "normal",
                fontFamily: "Menlo",
                fontSize: CanvasDefaults.fontSize - 2,
                selectable: false,
                evented: false,
                objectCaching: false,
                top: this.topPadding - 2
            };

            const variableSpace = " ".repeat(
                maxIDLen - (hit.hit_db.length + hit.hit_id.length)
            );
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
            mouseOverText(hitText, textObj, this.canvas);
            mouseDownText(hitText, hit.hit_url, this.canvas);
            mouseOutText(hitText, textObj, this.canvas);
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
                    let color: string;
                    if (this.scaleType === "ncbiblast") {
                        color = getRgbColorFixed(
                            hsp.hsp_bit_score!,
                            this.gradientSteps,
                            ncbiBlastGradient
                        );
                    } else {
                        color = getRgbColorGradient(
                            hsp.hsp_expect!,
                            this.gradientSteps,
                            defaultGradient
                        );
                    }
                    let queryDomain, subjDomain: fabric.Rect;
                    [
                        queryDomain,
                        subjDomain,
                        this.topPadding
                    ] = drawDomainTracks(
                        startQueryHspPixels,
                        endQueryHspPixels,
                        startSubjHspPixels,
                        endSubjHspPixels,
                        this.topPadding,
                        color
                    );
                    this.canvas.add(queryDomain);
                    this.canvas.add(subjDomain);

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
                    let evalText: fabric.Text; 
                    if (this.scaleType === "ncbiblast") {
                        evalText = new fabric.Text(
                            numberToString(hsp.hsp_bit_score!),
                            textObj
                        );
                    } else {
                        evalText = new fabric.Text(
                            numberToString(hsp.hsp_expect!),
                            textObj
                        );
                    }
                    evalText.width = CanvasDefaults.evaluePixels;
                    this.canvas.add(evalText);

                    // Query tooltip
                    const floatTextObj: TextType = {
                        fontWeight: "normal",
                        fontSize: CanvasDefaults.fontSize + 1,
                        selectable: false,
                        evented: false,
                        objectCaching: false,
                        textAlign: "left",
                        originX: "top",
                        originY: "top",
                        top: 5
                    };
                    let queryTooltipText: fabric.Text;
                    if (this.scaleType === "ncbiblast") {
                        queryTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_hit_from}\nEnd: ${
                                hsp.hsp_hit_to
                            }\nBit score: ${numberToString(
                                hsp.hsp_bit_score!
                            )}`,
                            floatTextObj
                        );
                    } else {
                        queryTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_hit_from}\nEnd: ${
                                hsp.hsp_hit_to
                            }\nE-value: ${numberToString(hsp.hsp_expect!)}`,
                            floatTextObj
                        );
                    }
                    const rectObj: RectType = {
                        selectable: false,
                        evented: false,
                        objectCaching: false,
                        fill: "white",
                        stroke: "lightseagreen",
                        rx: 5,
                        ry: 5,
                        originX: "top",
                        originY: "top",
                        width: 140,
                        height: 60,
                        opacity: 0.95
                    };
                    const queryTooltipBox: fabric.Rect = new fabric.Rect(
                        rectObj
                    );
                    const queryTooltipGroup: fabric.Group = new fabric.Group(
                        [queryTooltipBox, queryTooltipText],
                        {
                            selectable: false,
                            evented: false,
                            objectCaching: false,
                            visible: false,
                            top: this.topPadding - 10,
                            left: startQueryHspPixels + endQueryHspPixels / 2
                        }
                    );
                    this.canvas.add(queryTooltipGroup);
                    mouseOverDomain(
                        queryDomain,
                        queryTooltipGroup,
                        this.canvas
                    );
                    mouseOutDomain(queryDomain, queryTooltipGroup, this.canvas);

                    // Subject tooltip
                    let subjTooltipText: fabric.Text;
                    if (this.scaleType === "ncbiblast") {
                        subjTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_query_from}\nEnd: ${
                                hsp.hsp_query_to
                            }\nBit score: ${numberToString(
                                hsp.hsp_bit_score!
                            )}`,
                            floatTextObj
                        );
                    } else {
                        subjTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_query_from}\nEnd: ${
                                hsp.hsp_query_to
                            }\nE-value: ${numberToString(hsp.hsp_expect!)}`,
                            floatTextObj
                        );
                    }

                    const subjTooltipBox: fabric.Rect = new fabric.Rect(
                        rectObj
                    );
                    const subjTooltipGroup: fabric.Group = new fabric.Group(
                        [subjTooltipBox, subjTooltipText],
                        {
                            selectable: false,
                            evented: false,
                            objectCaching: false,
                            visible: false,
                            top: this.topPadding - 10,
                            left: startSubjHspPixels + endSubjHspPixels / 2
                        }
                    );
                    this.canvas.add(subjTooltipGroup);
                    mouseOverDomain(subjDomain, subjTooltipGroup, this.canvas);
                    mouseOutDomain(subjDomain, subjTooltipGroup, this.canvas);
                }
            }
        }
    }

    private drawColorScaleGroup() {
        // Scale Type selection
        const textSelObj: TextType = {
            fontSize: CanvasDefaults.fontSize + 1,
            fontWeight: "bold",
            selectable: false,
            evented: false,
            objectCaching: false,
            left: CanvasDefaults.leftScalePaddingPixels,
            top: this.topPadding
        };

        var fixedText = new fabric.Text("Scale Type:", textSelObj);
        this.canvas.add(fixedText);

        const textCheckDynObj: TextType = {
            fontSize: CanvasDefaults.fontSize + 12,
            fontWeight: "normal",
            fill: "grey",
            selectable: false,
            evented: true,
            objectCaching: false,
            left: CanvasDefaults.leftScalePaddingPixels,
            top: this.topPadding - 8
        };
        const textCheckFixObj: TextType = { ...textCheckDynObj };
        const textCheckNcbiObj: TextType = { ...textCheckDynObj };

        let checkSym: string;
        this.scaleType === "dynamic" ? (checkSym = "☒") : (checkSym = "☐");
        if (this.scaleType === "dynamic") textCheckDynObj.fill = "black";
        textCheckDynObj.left! += 80;
        var dynamicText = new fabric.Text(checkSym, textCheckDynObj);
        mouseOverCheckbox(dynamicText, textCheckDynObj, this);
        mouseOutCheckbox(dynamicText, textCheckDynObj, "dynamic", this);
        mouseDownCheckbox(dynamicText, "dynamic", this);
        this.canvas.add(dynamicText);
        textSelObj.fontWeight = "normal";
        textSelObj.left! += 100;
        this.canvas.add(dynamicText);
        var dynamicText = new fabric.Text(
            "Dynamic (E-value: min to max)",
            textSelObj
        );
        this.canvas.add(dynamicText);

        this.scaleType === "fixed" ? (checkSym = "☒") : (checkSym = "☐");
        // this.scaleType === "fixed" ? (checkSym = "◉") : (checkSym = "○");
        if (this.scaleType === "fixed") textCheckFixObj.fill = "black";
        textCheckFixObj.left! += 290;
        var fixedText = new fabric.Text(checkSym, textCheckFixObj);
        mouseOverCheckbox(fixedText, textCheckFixObj, this);
        mouseOutCheckbox(fixedText, textCheckFixObj, "fixed", this);
        mouseDownCheckbox(fixedText, "fixed", this);
        this.canvas.add(fixedText);
        textSelObj.left! += 210;
        var fixedText = new fabric.Text(
            "Fixed (E-value: 0.0 to 100.0)",
            textSelObj
        );
        this.canvas.add(fixedText);

        // this.scaleType === "ncbiblast" ? (checkSym = "☑︎") : (checkSym = "☐");
        this.scaleType === "ncbiblast" ? (checkSym = "☒") : (checkSym = "☐");
        if (this.scaleType === "ncbiblast") textCheckNcbiObj.fill = "black";
        textCheckNcbiObj.left! += 480;
        var ncbiblastText = new fabric.Text(checkSym, textCheckNcbiObj);
        mouseOverCheckbox(ncbiblastText, textCheckNcbiObj, this);
        mouseOutCheckbox(ncbiblastText, textCheckNcbiObj, "ncbiblast", this);
        mouseDownCheckbox(ncbiblastText, "ncbiblast", this);
        this.canvas.add(ncbiblastText);
        textSelObj.left! += 190;
        var ncbiblastText = new fabric.Text(
            "NCBI BLAST+ (Bit score: <40 to ≥200)",
            textSelObj
        );
        this.canvas.add(ncbiblastText);

        // E-value/Bit Score Text
        this.topPadding += 25;
        const textObj: TextType = {
            fontSize: CanvasDefaults.fontSize + 1,
            fontWeight: "normal",
            selectable: false,
            evented: false,
            objectCaching: false,
            top: this.topPadding
        };
        let scaleTypeLabel: string;
        this.scaleType === "ncbiblast"
            ? (scaleTypeLabel = "Bit score")
            : (scaleTypeLabel = "E-value");
        this.scaleType === "ncbiblast"
            ? (textObj.left = CanvasDefaults.leftScalePaddingPixels - 56)
            : (textObj.left = CanvasDefaults.leftScalePaddingPixels - 50);
        var evalueText = new fabric.Text(`${scaleTypeLabel}`, textObj);
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
        if (this.scaleType === "ncbiblast") {
            colorNcbiBlastGradient(colorScale, 0, CanvasDefaults.scalePixels);
        } else {
            colorDefaultGradient(colorScale, 0, CanvasDefaults.scalePixels);
        }

        this.canvas.add(colorScale);

        // E-value Axis (line and ticks)
        if (this.scaleType === "ncbiblast") {
            const oneFifthGradPixels =
                (CanvasDefaults.leftScalePaddingPixels +
                    CanvasDefaults.scalePixels -
                    CanvasDefaults.leftScalePaddingPixels) /
                5;
            let axisGroup: fabric.Group;
            [axisGroup, this.topPadding] = drawLineAxis6Buckets(
                CanvasDefaults.leftScalePaddingPixels,
                CanvasDefaults.leftScalePaddingPixels + oneFifthGradPixels,
                CanvasDefaults.leftScalePaddingPixels + oneFifthGradPixels * 2,
                CanvasDefaults.leftScalePaddingPixels + oneFifthGradPixels * 3,
                CanvasDefaults.leftScalePaddingPixels + oneFifthGradPixels * 4,
                CanvasDefaults.leftScalePaddingPixels +
                    CanvasDefaults.scalePixels,
                this.topPadding,
                1
            );
            this.canvas.add(axisGroup);

            // Bits scale tick mark labels
            this.topPadding += 5;
            textObj.top = this.topPadding;
            textObj.fontSize = CanvasDefaults.fontSize;
            // 20% Tick Label
            let label = `<${this.gradientSteps[1]}`;
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels +
                oneFifthGradPixels -
                label.length * 3 -
                72;
            const o20LabelText = new fabric.Text(label, textObj);
            // 40% Tick Label
            label = `${this.gradientSteps[1]} - ${this.gradientSteps[2]}`;
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels +
                oneFifthGradPixels * 2 -
                label.length * 3 -
                72;
            const o40LabelText = new fabric.Text(label, textObj);
            // 60% Tick Label
            label = `${this.gradientSteps[2]} - ${this.gradientSteps[3]}`;
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels +
                oneFifthGradPixels * 3 -
                label.length * 3 -
                72;
            const o60LabelText = new fabric.Text(label, textObj);
            // 60% Tick Label
            label = `${this.gradientSteps[3]} - ${this.gradientSteps[4]}`;
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels +
                oneFifthGradPixels * 4 -
                label.length * 3 -
                72;
            const o80LabelText = new fabric.Text(label, textObj);
            // End Tick Label
            label = `≥${this.gradientSteps[4]}`;
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels +
                CanvasDefaults.scalePixels -
                label.length * 3 -
                72;
            const endLabelText = new fabric.Text(label, textObj);

            const textGroup = new fabric.Group(
                [
                    o20LabelText,
                    o40LabelText,
                    o60LabelText,
                    o80LabelText,
                    endLabelText
                ],
                CanvasDefaults.groupConfig
            );
            this.canvas.add(textGroup);
        } else {
            const oneForthGradPixels =
                (CanvasDefaults.leftScalePaddingPixels +
                    CanvasDefaults.scalePixels -
                    CanvasDefaults.leftScalePaddingPixels) /
                4;
            let axisGroup: fabric.Group;
            [axisGroup, this.topPadding] = drawLineAxis5Buckets(
                CanvasDefaults.leftScalePaddingPixels,
                CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels,
                CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels * 2,
                CanvasDefaults.leftScalePaddingPixels + oneForthGradPixels * 3,
                CanvasDefaults.leftScalePaddingPixels +
                    CanvasDefaults.scalePixels,
                this.topPadding,
                1
            );
            this.canvas.add(axisGroup);

            // E-value scale tick mark labels
            this.topPadding += 5;
            textObj.top = this.topPadding;
            textObj.fontSize = CanvasDefaults.fontSize;
            // Start Tick Label
            textObj.left =
                CanvasDefaults.leftScalePaddingPixels -
                numberToString(this.gradientSteps[0]).length * 3;
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
        mouseOverText(copyrightText, textObj, this.canvas);
        mouseDownText(copyrightText, "https://www.ebi.ac.uk", this.canvas);
        mouseOutText(copyrightText, textObj, this.canvas);
    }
}
