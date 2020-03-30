import { fabric } from "fabric";
import {
    RenderOptions,
    ColorSchemeEnum,
    objectDefaults,
    textDefaults,
    rectDefaults
} from "./custom-types";
import {
    getTextLegendPaddingFactor,
    getQuerySubjPixelCoords,
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
import { SSSResultModel } from "./data-model";

export class BasicCanvasRenderer {
    public canvas: fabric.Canvas;
    protected canvasWidth: number;
    protected canvasHeight: number;
    protected contentWidth: number;
    protected contentScoringWidth: number;
    protected contentLabelWidth: number;
    protected scaleWidth: number;
    protected scaleLabelWidth: number;
    protected marginWidth: number;
    public colorScheme: ColorSchemeEnum;
    protected numberHsps: number;
    protected logSkippedHsps: boolean;
    protected fontSize: number;
    protected fontWeigth: string;
    protected fontFamily: string;
    protected canvasWrapperStroke: boolean;

    constructor(renderOptions: RenderOptions) {
        renderOptions.canvasWidth != undefined
            ? (this.canvasWidth = renderOptions.canvasWidth)
            : (this.canvasWidth = 1000);
        renderOptions.canvasHeight != undefined
            ? (this.canvasHeight = renderOptions.canvasHeight)
            : (this.canvasHeight = 110);
        renderOptions.contentWidth != undefined
            ? (this.contentWidth = renderOptions.contentWidth)
            : (this.contentWidth = (65.5 * this.canvasWidth) / 100);
        renderOptions.contentScoringWidth != undefined
            ? (this.contentScoringWidth = renderOptions.contentScoringWidth)
            : (this.contentScoringWidth = (7.0 * this.canvasWidth) / 100);
        renderOptions.contentLabelWidth != undefined
            ? (this.contentLabelWidth = renderOptions.contentLabelWidth)
            : (this.contentLabelWidth = (26.5 * this.canvasWidth) / 100);
        renderOptions.scaleWidth != undefined
            ? (this.scaleWidth = renderOptions.scaleWidth)
            : (this.scaleWidth = (75.0 * this.canvasWidth) / 100);
        renderOptions.scaleLabelWidth != undefined
            ? (this.scaleLabelWidth = renderOptions.scaleLabelWidth)
            : (this.scaleLabelWidth = (20.0 * this.canvasWidth) / 100);
        renderOptions.marginWidth != undefined
            ? (this.marginWidth = renderOptions.marginWidth)
            : (this.marginWidth = (0.15 * this.canvasWidth) / 100);
        renderOptions.colorScheme != undefined
            ? (this.colorScheme = renderOptions.colorScheme)
            : (this.colorScheme = ColorSchemeEnum.fixed);
        renderOptions.numberHsps != undefined
            ? (this.numberHsps = renderOptions.numberHsps)
            : (this.numberHsps = 10);
        renderOptions.logSkippedHsps != undefined
            ? (this.logSkippedHsps = renderOptions.logSkippedHsps)
            : (this.logSkippedHsps = true);
        renderOptions.fontSize != undefined
            ? (this.fontSize = renderOptions.fontSize)
            : (this.fontSize = 12);
        renderOptions.fontWeigth != undefined
            ? (this.fontWeigth = renderOptions.fontWeigth)
            : (this.fontWeigth = "normal");
        renderOptions.fontFamily != undefined
            ? (this.fontFamily = renderOptions.fontFamily)
            : (this.fontFamily = "Times New Roman");
        renderOptions.canvasWrapperStroke != undefined
            ? (this.canvasWrapperStroke = renderOptions.canvasWrapperStroke)
            : (this.canvasWrapperStroke = false);

        this.canvas = new fabric.Canvas("canvas", {});
    }

    protected setFrameSize() {
        this.canvas.setWidth(this.canvasWidth);
        this.canvas.setHeight(this.canvasHeight);
    }
    protected renderCanvas() {
        this.canvas.renderAll();
    }
}

export class CanvasRenderer extends BasicCanvasRenderer {
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
        public dataObj: SSSResultModel,
        public renderOptions: RenderOptions
    ) {
        super(renderOptions);
        this.queryLen = this.dataObj.query_len;
        for (const hit of this.dataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
        [
            this.startQueryPixels,
            this.endQueryPixels,
            this.startSubjPixels,
            this.endSubjPixels
        ] = getQuerySubjPixelCoords(
            this.queryLen,
            this.subjLen,
            this.subjLen,
            this.contentWidth,
            this.contentScoringWidth,
            this.contentLabelWidth,
            this.marginWidth
        );
        this.startEvalPixels = this.endQueryPixels + 2 * this.marginWidth;

        // render All components
        this.renderAll();
    }
    public renderAll() {
        this.canvas.clear();
        this.topPadding = 2;
        // canvas header
        this.drawHeaderTextGroup();

        // content header
        if (this.dataObj.hits.length > 0) {
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
        if (this.canvasWrapperStroke) {
            // final canvas wrapper rect
            const canvasWrapper = new fabric.Rect({
                selectable: false,
                evented: false,
                objectCaching: false,
                top: 0,
                left: 0,
                width: this.canvasWidth - 1,
                height: this.canvasHeight - 1,
                strokeWidth: 1,
                stroke: "lightseagreen",
                fill: "transparent"
            });
            this.canvas.add(canvasWrapper);
        }
        this.setFrameSize();
        this.renderCanvas();
    }

    private drawHeaderTextGroup() {
        const origTopPadding = this.topPadding;
        const textObj = { ...textDefaults };
        textObj.fontWeight = "bold";
        textObj.fontSize = this.fontSize + 1;
        textObj.top = this.topPadding;
        textObj.left = 5;

        // program & version
        const program = this.dataObj.program;
        const version = this.dataObj.version;
        const programText = new fabric.Text(
            `${program} (version: ${version})`,
            textObj
        );
        // Database(s)
        let db_names: string[] = [];
        for (const db of this.dataObj.dbs) {
            db_names.push(db.name);
        }
        const dbs: string = db_names.join(", ");
        textObj.fontWeight = "normal";
        textObj.fontSize = this.fontSize;
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
        // Sequence
        const sequence = this.dataObj.query_def;
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const sequenceText = new fabric.Text("Sequence: ", textObj);
        const textSeqObj = { ...textDefaults };
        textSeqObj.fontFamily = "Menlo";
        textSeqObj.fontSize = this.fontSize - 2;
        textSeqObj.evented = true;
        textSeqObj.top = this.topPadding;
        textSeqObj.left = 57.5;
        const sequenceDefText = new fabric.Text(`${sequence}`, textSeqObj);
        this.canvas.add(sequenceDefText);
        if (this.dataObj.query_url != null) {
            mouseOverText(sequenceDefText, textSeqObj, this);
            mouseDownText(sequenceDefText, this.dataObj.query_url, this);
            mouseOutText(sequenceDefText, textSeqObj, this);
        }
        // Length
        const length = this.dataObj.query_len;
        this.topPadding += 15;
        textObj.top = this.topPadding;
        const lengthText = new fabric.Text(`Length: ${length}`, textObj);
        // Start
        const start = this.dataObj.start;
        textObj.top = origTopPadding;
        textObj.left = this.canvasWidth - 135;
        const startText = new fabric.Text(`${start}`, textObj);
        // End
        const end = this.dataObj.end;
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
            objectDefaults
        );
        this.canvas.add(textGroup);
    }
    private drawNoHitsFoundText() {
        const textObj = { ...textDefaults };
        textObj.fontWeight = "bold";
        textObj.fontSize = this.fontSize + 1;
        textObj.top = this.topPadding;
        textObj.left = this.contentWidth / 2;
        textObj.fill = "red";
        this.canvas.add(
            new fabric.Text(
                "--------------------No hits found--------------------",
                textObj
            )
        );
    }
    private drawContentHeaderTextGroup() {
        const textObj = { ...textDefaults };
        textObj.fontWeight = "bold";
        textObj.fontSize = this.fontSize + 1;
        textObj.top = this.topPadding + 2;
        textObj.textAlign = "center";
        const totalQueryPixels = getTotalPixels(
            this.queryLen,
            this.subjLen,
            this.queryLen,
            this.contentWidth,
            this.contentScoringWidth
        );
        const totalSubjPixels = getTotalPixels(
            this.queryLen,
            this.subjLen,
            this.subjLen,
            this.contentWidth,
            this.contentScoringWidth
        );
        // Query Match
        textObj.left = this.startQueryPixels;
        const queryText = new fabric.Text("Sequence Match", textObj);
        queryText.width = totalQueryPixels;
        this.topPadding += 5;
        textObj.left = this.startEvalPixels;
        let evalueText;
        // E-value/ Bits
        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
            evalueText = new fabric.Text("Bit score", textObj);
        } else {
            evalueText = new fabric.Text("E-value", textObj);
        }
        evalueText.width = this.contentScoringWidth;
        // Subject Match
        textObj.left = this.startSubjPixels;
        const subjText = new fabric.Text("Subject Match", textObj);
        subjText.width = totalSubjPixels;
        const textGroup = new fabric.Group(
            [queryText, evalueText, subjText],
            objectDefaults
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
        const textObj = { ...textDefaults };
        textObj.fontSize = this.fontSize;
        textObj.top = this.topPadding;
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
            objectDefaults
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
        const queryLen: number = this.dataObj.query_len;
        let subjLen: number = 0;
        let maxIDLen: number = 0;
        for (const hit of this.dataObj.hits) {
            if (hit.hit_len > subjLen) subjLen = hit.hit_len;
            if (hit.hit_db.length + hit.hit_id.length > maxIDLen)
                maxIDLen = hit.hit_db.length + hit.hit_id.length;
        }
        let minScore: number = Number.MAX_VALUE;
        let maxScore: number = 0;
        let minNotZeroScore: number = Number.MAX_VALUE;
        for (const hit of this.dataObj.hits) {
            for (const hsp of hit.hit_hsps) {
                if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
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

        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
            this.gradientSteps = getGradientSteps(
                minScore,
                maxScore,
                minNotZeroScore,
                this.colorScheme
            );
        } else {
            this.gradientSteps = getGradientSteps(
                minScore,
                maxScore,
                minNotZeroScore,
                this.colorScheme
            );
        }

        for (const hit of this.dataObj.hits) {
            let numberHsps: number = 0;
            const totalNumberHsps: number = hit.hit_hsps.length;
            // Hit ID + Hit Description text tracks
            const textObj = { ...textDefaults };
            textObj.fontFamily = "Menlo";
            textObj.fontSize = this.fontSize - 2;
            textObj.top = this.topPadding - 2;

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
            mouseOverText(hitText, textObj, this);
            mouseDownText(hitText, hit.hit_url, this);
            mouseOutText(hitText, textObj, this);
            for (const hsp of hit.hit_hsps) {
                numberHsps++;
                if (numberHsps > this.numberHsps) {
                    if (this.logSkippedHsps === true) {
                        // notice about not all HSPs being displayed
                        const textObj = { ...textDefaults };
                        textObj.fontSize = this.fontSize;
                        textObj.top = this.topPadding;
                        textObj.left = this.contentWidth / 2;
                        textObj.fill = "red";
                        this.canvas.add(
                            new fabric.Text(
                                `This hit contains ${totalNumberHsps} alignments, ` +
                                    `but only the first ${this.numberHsps} are displayed`,
                                textObj
                            )
                        );
                        this.topPadding += 20;
                    }
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
                    ] = getQuerySubjPixelCoords(
                        queryLen,
                        subjLen,
                        subjHspLen,
                        this.contentWidth,
                        this.contentScoringWidth,
                        this.contentLabelWidth,
                        this.marginWidth
                    );

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
                        hspQueryEnd,
                        this.contentWidth,
                        this.contentScoringWidth,
                        this.marginWidth
                    );
                    [startSubjHspPixels, endSubjHspPixels] = getHspPixelCoords(
                        queryLen,
                        subjLen,
                        subjHspLen,
                        startSubjPixels,
                        hspSubjStart,
                        hspSubjEnd,
                        this.contentWidth,
                        this.contentScoringWidth,
                        this.marginWidth
                    );
                    let color: string;
                    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
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
                    const textObj = { ...textDefaults };
                    textObj.fontSize = this.fontSize;
                    textObj.top = this.topPadding - 15;
                    textObj.textAlign = "center";

                    textObj.left = this.startEvalPixels;
                    let evalText: fabric.Text;
                    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
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
                    evalText.width = this.contentScoringWidth;
                    this.canvas.add(evalText);

                    // Query tooltip
                    const floatTextObj = { ...textDefaults };
                    floatTextObj.fontSize = this.fontSize + 1;
                    floatTextObj.textAlign = "left";
                    floatTextObj.originX = "top";
                    floatTextObj.originY = "top";
                    floatTextObj.top = 5;
                    let queryTooltipText: fabric.Text;
                    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
                        queryTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_query_from}\nEnd: ${
                                hsp.hsp_query_to
                            }\nBit score: ${numberToString(
                                hsp.hsp_bit_score!
                            )}`,
                            floatTextObj
                        );
                    } else {
                        queryTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_query_from}\nEnd: ${
                                hsp.hsp_query_to
                            }\nE-value: ${numberToString(hsp.hsp_expect!)}`,
                            floatTextObj
                        );
                    }
                    const rectObj = { ...rectDefaults };
                    rectObj.fill = "white";
                    rectObj.stroke = "lightseagreen";
                    rectObj.rx = 5;
                    rectObj.ry = 5;
                    rectObj.originX = "top";
                    rectObj.originY = "top";
                    rectObj.width = 140;
                    rectObj.height = 60;
                    rectObj.opacity = 0.95;

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
                    mouseOverDomain(queryDomain, queryTooltipGroup, this);
                    mouseOutDomain(queryDomain, queryTooltipGroup, this);

                    // Subject tooltip
                    let subjTooltipText: fabric.Text;
                    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
                        subjTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_hit_from}\nEnd: ${
                                hsp.hsp_hit_to
                            }\nBit score: ${numberToString(
                                hsp.hsp_bit_score!
                            )}`,
                            floatTextObj
                        );
                    } else {
                        subjTooltipText = new fabric.Text(
                            `Start: ${hsp.hsp_hit_from}\nEnd: ${
                                hsp.hsp_hit_to
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
                    mouseOverDomain(subjDomain, subjTooltipGroup, this);
                    mouseOutDomain(subjDomain, subjTooltipGroup, this);
                }
            }
        }
    }

    private drawColorScaleGroup() {
        // Scale Type selection
        const textSelObj = { ...textDefaults };
        textSelObj.fontSize = this.fontSize + 1;
        textSelObj.fontWeight = "bold";
        textSelObj.top = this.topPadding;
        textSelObj.left = this.scaleLabelWidth;

        var fixedText = new fabric.Text("Scale Type:", textSelObj);
        this.canvas.add(fixedText);

        const textCheckDynObj = { ...textDefaults };
        textCheckDynObj.fontSize = this.fontSize + 12;
        textCheckDynObj.fill = "grey";
        textCheckDynObj.evented = true;
        textCheckDynObj.top = this.topPadding - 8;
        textCheckDynObj.left = this.scaleLabelWidth;
        const textCheckFixObj = { ...textCheckDynObj };
        const textCheckNcbiObj = { ...textCheckDynObj };

        let checkSym: string;
        this.colorScheme === ColorSchemeEnum.dynamic
            ? (checkSym = "☒")
            : (checkSym = "☐");
        if (this.colorScheme === ColorSchemeEnum.dynamic)
            textCheckDynObj.fill = "black";
        textCheckDynObj.left! += 80;
        var dynamicText = new fabric.Text(checkSym, textCheckDynObj);
        mouseOverCheckbox(dynamicText, textCheckDynObj, this);
        mouseOutCheckbox(
            dynamicText,
            textCheckDynObj,
            ColorSchemeEnum.dynamic,
            this
        );
        mouseDownCheckbox(dynamicText, ColorSchemeEnum.dynamic, this);
        this.canvas.add(dynamicText);
        textSelObj.fontWeight = "normal";
        textSelObj.left! += 100;
        this.canvas.add(dynamicText);
        var dynamicText = new fabric.Text(
            "Dynamic (E-value: min to max)",
            textSelObj
        );
        this.canvas.add(dynamicText);

        this.colorScheme === ColorSchemeEnum.fixed
            ? (checkSym = "☒")
            : (checkSym = "☐");
        if (this.colorScheme === ColorSchemeEnum.fixed)
            textCheckFixObj.fill = "black";
        textCheckFixObj.left! += 290;
        var fixedText = new fabric.Text(checkSym, textCheckFixObj);
        mouseOverCheckbox(fixedText, textCheckFixObj, this);
        mouseOutCheckbox(
            fixedText,
            textCheckFixObj,
            ColorSchemeEnum.fixed,
            this
        );
        mouseDownCheckbox(fixedText, ColorSchemeEnum.fixed, this);
        this.canvas.add(fixedText);
        textSelObj.left! += 210;
        var fixedText = new fabric.Text(
            "Fixed (E-value: 0.0 to 100.0)",
            textSelObj
        );
        this.canvas.add(fixedText);

        this.colorScheme === ColorSchemeEnum.ncbiblast
            ? (checkSym = "☒")
            : (checkSym = "☐");
        if (this.colorScheme === ColorSchemeEnum.ncbiblast)
            textCheckNcbiObj.fill = "black";
        textCheckNcbiObj.left! += 480;
        var ncbiblastText = new fabric.Text(checkSym, textCheckNcbiObj);
        mouseOverCheckbox(ncbiblastText, textCheckNcbiObj, this);
        mouseOutCheckbox(
            ncbiblastText,
            textCheckNcbiObj,
            ColorSchemeEnum.ncbiblast,
            this
        );
        mouseDownCheckbox(ncbiblastText, ColorSchemeEnum.ncbiblast, this);
        this.canvas.add(ncbiblastText);
        textSelObj.left! += 190;
        var ncbiblastText = new fabric.Text(
            "NCBI BLAST+ (Bit score: <40 to ≥200)",
            textSelObj
        );
        this.canvas.add(ncbiblastText);

        // E-value/Bit Score Text
        this.topPadding += 25;
        const textObj = { ...textDefaults };
        textObj.fontSize = this.fontSize + 1;
        textObj.top = this.topPadding;
        let scaleTypeLabel: string;
        this.colorScheme === ColorSchemeEnum.ncbiblast
            ? (scaleTypeLabel = "Bit score")
            : (scaleTypeLabel = "E-value");
        this.colorScheme === ColorSchemeEnum.ncbiblast
            ? (textObj.left = this.scaleLabelWidth - 56)
            : (textObj.left = this.scaleLabelWidth - 50);
        var evalueText = new fabric.Text(`${scaleTypeLabel}`, textObj);
        this.canvas.add(evalueText);

        // E-value Color Gradient
        const rectObj = { ...rectDefaults };
        rectObj.top = this.topPadding;
        rectObj.left = this.scaleLabelWidth;
        rectObj.width = this.scaleWidth;
        rectObj.height = 15;
        var colorScale = new fabric.Rect(rectObj);
        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
            colorNcbiBlastGradient(colorScale, 0, this.scaleWidth);
        } else {
            colorDefaultGradient(colorScale, 0, this.scaleWidth);
        }

        this.canvas.add(colorScale);

        // E-value Axis (line and ticks)
        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
            const oneFifthGradPixels =
                (this.scaleLabelWidth +
                    this.scaleWidth -
                    this.scaleLabelWidth) /
                5;
            let axisGroup: fabric.Group;
            [axisGroup, this.topPadding] = drawLineAxis6Buckets(
                this.scaleLabelWidth,
                this.scaleLabelWidth + oneFifthGradPixels,
                this.scaleLabelWidth + oneFifthGradPixels * 2,
                this.scaleLabelWidth + oneFifthGradPixels * 3,
                this.scaleLabelWidth + oneFifthGradPixels * 4,
                this.scaleLabelWidth + this.scaleWidth,
                this.topPadding,
                1
            );
            this.canvas.add(axisGroup);

            // Bits scale tick mark labels
            this.topPadding += 5;
            textObj.top = this.topPadding;
            textObj.fontSize = this.fontSize;
            // 20% Tick Label
            let label = `<${this.gradientSteps[1]}`;
            textObj.left =
                this.scaleLabelWidth +
                oneFifthGradPixels -
                label.length * 3 -
                72;
            const o20LabelText = new fabric.Text(label, textObj);
            // 40% Tick Label
            label = `${this.gradientSteps[1]} - ${this.gradientSteps[2]}`;
            textObj.left =
                this.scaleLabelWidth +
                oneFifthGradPixels * 2 -
                label.length * 3 -
                72;
            const o40LabelText = new fabric.Text(label, textObj);
            // 60% Tick Label
            label = `${this.gradientSteps[2]} - ${this.gradientSteps[3]}`;
            textObj.left =
                this.scaleLabelWidth +
                oneFifthGradPixels * 3 -
                label.length * 3 -
                72;
            const o60LabelText = new fabric.Text(label, textObj);
            // 60% Tick Label
            label = `${this.gradientSteps[3]} - ${this.gradientSteps[4]}`;
            textObj.left =
                this.scaleLabelWidth +
                oneFifthGradPixels * 4 -
                label.length * 3 -
                72;
            const o80LabelText = new fabric.Text(label, textObj);
            // End Tick Label
            label = `≥${this.gradientSteps[4]}`;
            textObj.left =
                this.scaleLabelWidth + this.scaleWidth - label.length * 3 - 72;
            const endLabelText = new fabric.Text(label, textObj);

            const textGroup = new fabric.Group(
                [
                    o20LabelText,
                    o40LabelText,
                    o60LabelText,
                    o80LabelText,
                    endLabelText
                ],
                objectDefaults
            );
            this.canvas.add(textGroup);
        } else {
            const oneForthGradPixels =
                (this.scaleLabelWidth +
                    this.scaleWidth -
                    this.scaleLabelWidth) /
                4;
            let axisGroup: fabric.Group;
            [axisGroup, this.topPadding] = drawLineAxis5Buckets(
                this.scaleLabelWidth,
                this.scaleLabelWidth + oneForthGradPixels,
                this.scaleLabelWidth + oneForthGradPixels * 2,
                this.scaleLabelWidth + oneForthGradPixels * 3,
                this.scaleLabelWidth + this.scaleWidth,
                this.topPadding,
                1
            );
            this.canvas.add(axisGroup);

            // E-value scale tick mark labels
            this.topPadding += 5;
            textObj.top = this.topPadding;
            textObj.fontSize = this.fontSize;
            // Start Tick Label
            textObj.left =
                this.scaleLabelWidth -
                numberToString(this.gradientSteps[0]).length * 3;
            const startLabelText = new fabric.Text(
                numberToString(this.gradientSteps[0]),
                textObj
            );
            // 25% Tick Label
            textObj.left =
                this.scaleLabelWidth +
                oneForthGradPixels -
                numberToString(this.gradientSteps[1]).length * 3;
            const o25LabelText = new fabric.Text(
                numberToString(this.gradientSteps[1]),
                textObj
            );
            // 50% Tick Label
            textObj.left =
                this.scaleLabelWidth +
                oneForthGradPixels * 2 -
                numberToString(this.gradientSteps[2]).length * 3;
            const o50LabelText = new fabric.Text(
                numberToString(this.gradientSteps[2]),
                textObj
            );
            // 75% Tick Label
            textObj.left =
                this.scaleLabelWidth +
                oneForthGradPixels * 3 -
                numberToString(this.gradientSteps[3]).length * 3;
            const o75LabelText = new fabric.Text(
                numberToString(this.gradientSteps[3]),
                textObj
            );
            // End Tick Label
            textObj.left =
                this.scaleLabelWidth +
                this.scaleWidth -
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
                objectDefaults
            );
            this.canvas.add(textGroup);
        }
    }

    private drawFooterText() {
        const textObj = { ...textDefaults };
        textObj.fontSize = this.fontSize;
        textObj.evented = true;
        textObj.top = this.topPadding;
        textObj.left = 225;
        const copyright =
            `European Bioinformatics Institute 2006-2020. ` +
            `EBI is an Outstation of the European Molecular Biology Laboratory.`;
        const copyrightText = new fabric.Text(`${copyright}`, textObj);
        this.canvas.add(copyrightText);
        mouseOverText(copyrightText, textObj, this);
        mouseDownText(copyrightText, "https://www.ebi.ac.uk", this);
        mouseOutText(copyrightText, textObj, this);
    }
}
