import { fabric } from "fabric";
import { SSSResultModel } from "./data-model";
import { defaultGradient, ncbiBlastGradient } from "./color-schemes";
import { getQuerySubjPixelCoords, getHspPixelCoords } from "./coords-utilities";
import {
    getRgbColorGradient,
    getRgbColorFixed,
    getGradientSteps
} from "./color-utilities";
import {
    getDataFromURLorFile,
    validateJobId,
    getServiceURLfromJobId
} from "./other-utilities";
import {
    RenderOptions,
    ColorSchemeEnum,
    jobIdDefaults,
    TextType
} from "./custom-types";
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
    drawHeaderTextGroup,
    drawHeaderLinkText,
    drawContentHeaderTextGroup,
    drawLineTracks,
    drawContentSequenceInfoText,
    drawHspNoticeText,
    drawScoreText,
    drawContentFooterTextGroup,
    drawNoHitsFoundText,
    drawDomainTracks,
    drawDomainTooltips,
    drawScaleTypeText,
    drawCheckBoxText,
    drawScaleScoreText,
    drawScaleColorGradient,
    drawLineAxis5Buckets,
    drawLineAxis6Buckets,
    drawScaleTick5LabelsGroup,
    drawScaleTick4LabelsGroup,
    drawFooterText,
    drawCanvasWrapperStroke
} from "./drawing-utilities";

// web-component support
import "./visual-output-webcomponent.ts";

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

    constructor(
        private element: string | HTMLCanvasElement,
        renderOptions: RenderOptions
    ) {
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
            : (this.colorScheme = ColorSchemeEnum.dynamic);
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
    }

    protected getFabricCanvas() {
        this.canvas = new fabric.Canvas(this.element, {
            defaultCursor: "default",
            moveCursor: "default",
            hoverCursor: "default"
        });
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
    private dataObj: SSSResultModel;

    constructor(
        element: string | HTMLCanvasElement,
        private data: string,
        renderOptions: RenderOptions
    ) {
        super(element, renderOptions);
        this.validateInput();
        this.getFabricCanvas();
    }
    public render() {
        this.loadData();
        if (typeof this.dataObj !== "undefined") {
            this.loadInitalProperties();
            this.loadInitialCoords();
            // clear the canvas
            this.canvas.clear();
            // canvas header
            this.drawHeaderGroup();
            // canvas content
            this.drawContentGroup();
            // canvas footer
            this.drawFooterGroup();
            // finishing off
            this.wrapCanvas();
            this.setFrameSize();
            this.renderCanvas();
        }
    }

    private validateInput() {
        // check if input is a jobId
        const jobId = { ...jobIdDefaults };
        jobId.value = this.data;
        // if so, get the service URL, else use as is
        if (
            !jobId.value.startsWith("http") &&
            !jobId.value.includes("/") &&
            validateJobId(jobId)
        ) {
            this.data = getServiceURLfromJobId(this.data);
        }
    }

    private loadData() {
        const json = getDataFromURLorFile(this.data).then(data => data);
        json.then(data => {
            if (typeof this.dataObj === "undefined") {
                this.dataObj = data;
                this.render();
            }
        }).catch(error => console.log(error));
    }

    private loadInitalProperties() {
        this.queryLen = this.dataObj.query_len;
        for (const hit of this.dataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
    }

    private loadInitialCoords() {
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
    }

    private drawHeaderGroup() {
        // canvas header
        this.topPadding = 2;
        const textHeaderGroup = drawHeaderTextGroup(
            this.dataObj,
            {
                fontSize: this.fontSize,
                canvasWidth: this.canvasWidth
            },
            this.topPadding
        );
        this.canvas.add(textHeaderGroup);

        // canvas header (sequence info)
        this.topPadding += 45;
        let textHeaderLink: fabric.Text;
        let textSeqObj: TextType;
        [textHeaderLink, textSeqObj] = drawHeaderLinkText(
            this.dataObj,
            { fontSize: this.fontSize },
            this.topPadding
        );
        this.canvas.add(textHeaderLink);
        if (this.dataObj.query_url != null) {
            mouseOverText(textHeaderLink, textSeqObj, this);
            mouseDownText(textHeaderLink, this.dataObj.query_url, this);
            mouseOutText(textHeaderLink, textSeqObj, this);
        }
    }

    private drawContentGroup() {
        if (this.dataObj.hits.length > 0) {
            // content header
            this.topPadding += 25;
            const textContentHeaderGroup = drawContentHeaderTextGroup(
                {
                    queryLen: this.queryLen,
                    subjLen: this.subjLen,
                    startQueryPixels: this.startQueryPixels,
                    startEvalPixels: this.startEvalPixels,
                    startSubjPixels: this.startSubjPixels
                },
                {
                    contentWidth: this.contentWidth,
                    contentScoringWidth: this.contentScoringWidth,
                    fontSize: this.fontSize,
                    colorScheme: this.colorScheme
                },
                this.topPadding
            );
            this.canvas.add(textContentHeaderGroup);

            // content header line tracks
            this.topPadding += 20;
            const lineTrackGroup = drawLineTracks(
                {
                    startQueryPixels: this.startQueryPixels,
                    endQueryPixels: this.endQueryPixels,
                    startSubjPixels: this.startSubjPixels,
                    endSubjPixels: this.endSubjPixels
                },
                { strokeWidth: 2 },
                this.topPadding
            );
            this.canvas.add(lineTrackGroup);

            this.topPadding += 5;
            const textContentFooterGroup = drawContentFooterTextGroup(
                {
                    queryLen: this.queryLen,
                    subjLen: this.subjLen,
                    startQueryPixels: this.startQueryPixels,
                    endQueryPixels: this.endQueryPixels,
                    startSubjPixels: this.startSubjPixels,
                    endSubjPixels: this.endSubjPixels
                },
                {
                    fontSize: this.fontSize
                },
                this.topPadding
            );
            this.canvas.add(textContentFooterGroup);

            // dynamic content
            this.topPadding += 25;
            this.drawDynamicContentGroup();

            // color scale
            this.topPadding += 20;
            this.drawColorScaleGroup();
        } else {
            // text content: "No hits found!"
            this.topPadding += 20;
            const noHitsTextGroup = drawNoHitsFoundText(
                {
                    fontSize: this.fontSize,
                    contentWidth: this.contentWidth
                },
                this.topPadding
            );
            this.canvas.add(noHitsTextGroup);
        }
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
            let textObj: TextType;
            let spaceText, hitText: fabric.Text;
            [spaceText, hitText, textObj] = drawContentSequenceInfoText(
                maxIDLen,
                hit,
                { fontSize: this.fontSize },
                this.topPadding
            );
            this.canvas.add(spaceText);
            this.canvas.add(hitText);
            mouseOverText(hitText, textObj, this);
            mouseDownText(hitText, hit.hit_url, this);
            mouseOutText(hitText, textObj, this);
            for (const hsp of hit.hit_hsps) {
                numberHsps++;
                if (numberHsps > this.numberHsps) {
                    if (this.logSkippedHsps === true) {
                        const hspTextNotice = drawHspNoticeText(
                            totalNumberHsps,
                            this.numberHsps,
                            {
                                fontSize: this.fontSize,
                                contentWidth: this.contentWidth
                            },
                            this.topPadding
                        );
                        this.canvas.add(hspTextNotice);
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

                    this.topPadding += 5;
                    const linesGroup = drawLineTracks(
                        {
                            startQueryPixels: startQueryPixels,
                            endQueryPixels: endQueryPixels,
                            startSubjPixels: startSubjPixels,
                            endSubjPixels: endSubjPixels
                        },
                        { strokeWidth: 1 },
                        this.topPadding
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
                    this.topPadding += 10;
                    let queryDomain, subjDomain: fabric.Rect;
                    [queryDomain, subjDomain] = drawDomainTracks(
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
                    const scoreText = drawScoreText(
                        this.startEvalPixels,
                        hsp,
                        {
                            fontSize: this.fontSize,
                            colorScheme: this.colorScheme
                        },
                        this.topPadding
                    );
                    scoreText.width = this.contentScoringWidth;
                    this.canvas.add(scoreText);

                    // Query tooltip
                    const queryTooltipGroup = drawDomainTooltips(
                        startQueryHspPixels,
                        endQueryHspPixels,
                        hsp.hsp_query_from,
                        hsp.hsp_query_to,
                        hsp,
                        {
                            fontSize: this.fontSize,
                            colorScheme: this.colorScheme
                        },
                        this.topPadding
                    );
                    this.canvas.add(queryTooltipGroup);
                    mouseOverDomain(queryDomain, queryTooltipGroup, this);
                    mouseOutDomain(queryDomain, queryTooltipGroup, this);

                    // Subject tooltip
                    const subjTooltipGroup = drawDomainTooltips(
                        startSubjHspPixels,
                        endSubjHspPixels,
                        hsp.hsp_hit_from,
                        hsp.hsp_hit_to,
                        hsp,
                        {
                            fontSize: this.fontSize,
                            colorScheme: this.colorScheme
                        },
                        this.topPadding
                    );
                    this.canvas.add(subjTooltipGroup);
                    mouseOverDomain(subjDomain, subjTooltipGroup, this);
                    mouseOutDomain(subjDomain, subjTooltipGroup, this);
                }
            }
        }
    }

    private drawColorScaleGroup() {
        // Scale Type
        const scaleTypeText = drawScaleTypeText(
            {
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth
            },
            this.topPadding
        );
        this.canvas.add(scaleTypeText);

        // Scale Type selection
        let textCheckDynObj, textCheckFixObj, textCheckNcbiObj: TextType;
        let dynamicBoxText,
            dynamicText,
            fixedBoxText,
            fixedText,
            ncbiblastBoxText,
            ncbiblastText: fabric.Text;
        [
            dynamicBoxText,
            dynamicText,
            textCheckDynObj,
            fixedBoxText,
            fixedText,
            textCheckFixObj,
            ncbiblastBoxText,
            ncbiblastText,
            textCheckNcbiObj
        ] = drawCheckBoxText(
            {
                colorScheme: this.colorScheme,
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth
            },
            this.topPadding
        );
        this.canvas.add(dynamicBoxText);
        this.canvas.add(dynamicText);
        mouseOverCheckbox(dynamicBoxText, textCheckDynObj, this);
        mouseOutCheckbox(
            dynamicBoxText,
            textCheckDynObj,
            ColorSchemeEnum.dynamic,
            this
        );
        mouseDownCheckbox(dynamicBoxText, ColorSchemeEnum.dynamic, this);

        this.canvas.add(fixedBoxText);
        this.canvas.add(fixedText);
        mouseOverCheckbox(fixedBoxText, textCheckFixObj, this);
        mouseOutCheckbox(
            fixedBoxText,
            textCheckFixObj,
            ColorSchemeEnum.fixed,
            this
        );
        mouseDownCheckbox(fixedBoxText, ColorSchemeEnum.fixed, this);

        this.canvas.add(ncbiblastBoxText);
        this.canvas.add(ncbiblastText);
        mouseOverCheckbox(ncbiblastBoxText, textCheckNcbiObj, this);
        mouseOutCheckbox(
            ncbiblastBoxText,
            textCheckNcbiObj,
            ColorSchemeEnum.ncbiblast,
            this
        );
        mouseDownCheckbox(ncbiblastBoxText, ColorSchemeEnum.ncbiblast, this);

        // E-value/Bit Score Text
        this.topPadding += 25;
        const scaleScoreText = drawScaleScoreText(
            {
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth,
                colorScheme: this.colorScheme
            },
            this.topPadding
        );
        this.canvas.add(scaleScoreText);

        // E-value/Bit score Color Gradient
        const colorScale = drawScaleColorGradient(
            {
                scaleWidth: this.scaleWidth,
                scaleLabelWidth: this.scaleLabelWidth,
                colorScheme: this.colorScheme
            },
            this.topPadding
        );

        this.canvas.add(colorScale);

        // E-value/Bit score Axis (line and ticks)
        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
            const oneFifthGradPixels =
                (this.scaleLabelWidth +
                    this.scaleWidth -
                    this.scaleLabelWidth) /
                5;
            this.topPadding += 15;
            const axisGroup = drawLineAxis6Buckets(
                this.scaleLabelWidth,
                this.scaleLabelWidth + oneFifthGradPixels,
                this.scaleLabelWidth + oneFifthGradPixels * 2,
                this.scaleLabelWidth + oneFifthGradPixels * 3,
                this.scaleLabelWidth + oneFifthGradPixels * 4,
                this.scaleLabelWidth + this.scaleWidth,
                { strokeWidth: 1 },
                this.topPadding
            );
            this.canvas.add(axisGroup);

            // Bits scale tick mark labels
            this.topPadding += 5;
            const tickLabels5Group = drawScaleTick5LabelsGroup(
                this.gradientSteps,
                oneFifthGradPixels,
                {
                    fontSize: this.fontSize,
                    scaleWidth: this.scaleWidth,
                    scaleLabelWidth: this.scaleLabelWidth
                },
                this.topPadding
            );
            this.canvas.add(tickLabels5Group);
        } else {
            const oneForthGradPixels =
                (this.scaleLabelWidth +
                    this.scaleWidth -
                    this.scaleLabelWidth) /
                4;
            this.topPadding += 15;
            const axisGroup = drawLineAxis5Buckets(
                this.scaleLabelWidth,
                this.scaleLabelWidth + oneForthGradPixels,
                this.scaleLabelWidth + oneForthGradPixels * 2,
                this.scaleLabelWidth + oneForthGradPixels * 3,
                this.scaleLabelWidth + this.scaleWidth,
                { strokeWidth: 1 },
                this.topPadding
            );
            this.canvas.add(axisGroup);

            // E-value scale tick mark labels
            this.topPadding += 5;
            const tickLabels4Group = drawScaleTick4LabelsGroup(
                this.gradientSteps,
                oneForthGradPixels,
                {
                    fontSize: this.fontSize,
                    scaleWidth: this.scaleWidth,
                    scaleLabelWidth: this.scaleLabelWidth
                },
                this.topPadding
            );
            this.canvas.add(tickLabels4Group);
        }
    }

    private drawFooterGroup() {
        this.topPadding += 30;
        let copyrightText: fabric.Text;
        let textFooterObj: TextType;
        [copyrightText, textFooterObj] = drawFooterText(
            {
                fontSize: this.fontSize
            },
            this.topPadding
        );
        this.canvas.add(copyrightText);
        mouseOverText(copyrightText, textFooterObj, this);
        mouseDownText(copyrightText, "https://www.ebi.ac.uk", this);
        mouseOutText(copyrightText, textFooterObj, this);
    }

    private wrapCanvas() {
        this.topPadding += 20;
        if (this.canvasHeight < this.topPadding) {
            this.canvasHeight = this.topPadding;
        }
        if (this.canvasWrapperStroke) {
            // final canvas wrapper stroke
            const canvasWrapper = drawCanvasWrapperStroke({
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight
            });
            this.canvas.add(canvasWrapper);
        }
    }
}

(window as any).CanvasRenderer = CanvasRenderer;
