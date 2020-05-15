import { fabric } from "fabric";
import {
    SSSResultModel,
    IPRMCResultModel,
    IPRMCResultModelFlat,
} from "./data-model";
import {
    getQuerySubjPixelCoords,
    getPixelCoords,
    getHspBoxPixelCoords,
    getDomainPixelCoords,
} from "./coords-utilities";
import {
    getGradientSteps,
    colorByDatabaseName,
    getRgbColorFixed,
    getRgbColorGradient,
} from "./color-utilities";
import { defaultGradient, ncbiBlastGradient } from "./color-schemes";
import {
    getDataFromURLorFile,
    validateJobId,
    getServiceURLfromJobId,
    getUniqueIPRMCDomainDatabases,
    getFlattenIPRMCDataModel,
    domainDatabaseNameToString,
} from "./other-utilities";
import {
    RenderOptions,
    ColorSchemeEnum,
    jobIdDefaults,
    TextType,
    RectType,
} from "./custom-types";
import {
    mouseDownText,
    mouseOverText,
    mouseOutText,
    mouseOverCheckbox,
    mouseDownCheckbox,
    mouseOutCheckbox,
    mouseOverDomainCheckbox,
    mouseDownDomainCheckbox,
    mouseOutDomainCheckbox,
} from "./custom-events";
import {
    drawHeaderTextGroup,
    drawHeaderLinkText,
    drawNoHitsFoundText,
    drawScaleTypeText,
    drawScaleScoreText,
    drawScaleColorGradient,
    drawLineAxis5Buckets,
    drawLineAxis6Buckets,
    drawScaleTick5LabelsGroup,
    drawScaleTick4LabelsGroup,
    drawFooterText,
    drawCanvasWrapperStroke,
    drawCheckBoxText,
    drawContentTitleText,
    drawContentSupressText,
    drawProteinFeaturesText,
    drawDomainCheckbox,
    drawLineTracks,
    drawContentFooterTextGroup,
    drawContentSequenceInfoText,
    drawDomainLineTracks,
    drawHitTransparentBox,
} from "./drawing-utilities";

const defaultDomainDatabaseList = [
    "PRODOM",
    "CATH-Gene3D",
    "CDD",
    "PANTHER",
    "HAMAP",
    "Pfam",
    "PIRSF",
    "PRINTS",
    "PROSITE profiles",
    "PROSITE patterns",
    "SFLD",
    "SMART",
    "SUPERFAMILY",
    "TIGERFAMs",
];

function createDomainCheckbox(
    _this: FunctionalPredictions,
    currentDomainDatabase: string,
    domainDatabases: string[],
    topPadding: number,
    leftPadding: number,
    renderOptions: RenderOptions
) {
    if (_this.domainDatabaseList.includes(currentDomainDatabase)) {
        _this.currentDomainDatabase = currentDomainDatabase;
    } else {
        _this.currentDomainDatabase = undefined;
    }

    _this.currentDomainDatabaseDisabled = false;
    if (!domainDatabases.includes(currentDomainDatabase)) {
        _this.currentDomainDatabaseDisabled = true;
    }

    let rectObj: RectType;
    let textObj: TextType;
    let rect: fabric.Rect;
    let text: fabric.Text;
    [rect, text, rectObj, textObj] = drawDomainCheckbox(
        {
            currentDomainDatabase: _this.currentDomainDatabase,
            currentDisabled: _this.currentDomainDatabaseDisabled,
            fontSize: renderOptions.fontSize,
        },
        topPadding,
        leftPadding,
        currentDomainDatabase
    );
    _this.canvas.add(rect);
    _this.canvas.add(text);
    mouseOverDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseOutDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseDownDomainCheckbox(rect, currentDomainDatabase, _this);
}

export class BasicCanvasRenderer {
    public canvas: fabric.Canvas;
    protected canvasWidth: number;
    protected canvasHeight: number;
    protected contentWidth: number;
    protected contentScoringWidth: number;
    protected contentLabelWidth: number;
    protected contentLabelLeftWidth: number;
    protected contentLabelRightWidth: number;
    protected scaleWidth: number;
    protected scaleLabelWidth: number;
    protected marginWidth: number;
    public colorScheme: ColorSchemeEnum;
    protected numberHits: number;
    protected fontSize: number;
    protected fontWeigth: string;
    protected fontFamily: string;
    protected canvasWrapperStroke: boolean;

    constructor(
        private element: string | HTMLCanvasElement,
        protected renderOptions: RenderOptions
    ) {
        renderOptions.canvasWidth != undefined
            ? (this.canvasWidth = renderOptions.canvasWidth)
            : (this.canvasWidth = 1000);
        renderOptions.canvasHeight != undefined
            ? (this.canvasHeight = renderOptions.canvasHeight)
            : (this.canvasHeight = 110);
        renderOptions.contentWidth != undefined
            ? (this.contentWidth = renderOptions.contentWidth)
            : (this.contentWidth = (72.5 * this.canvasWidth) / 100);
        renderOptions.contentScoringWidth != undefined
            ? (this.contentScoringWidth = renderOptions.contentScoringWidth)
            : (this.contentScoringWidth = (7.0 * this.canvasWidth) / 100);
        renderOptions.contentLabelWidth != undefined
            ? (this.contentLabelWidth = renderOptions.contentLabelWidth)
            : (this.contentLabelWidth = (26.5 * this.canvasWidth) / 100);
        renderOptions.contentLabelLeftWidth != undefined
            ? (this.contentLabelLeftWidth = renderOptions.contentLabelLeftWidth)
            : (this.contentLabelLeftWidth = (8.25 * this.canvasWidth) / 100);
        renderOptions.contentLabelRightWidth != undefined
            ? (this.contentLabelRightWidth =
                  renderOptions.contentLabelRightWidth)
            : (this.contentLabelRightWidth = (18.25 * this.canvasWidth) / 100);
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
        renderOptions.numberHits != undefined
            ? (this.numberHits = renderOptions.numberHits)
            : (this.numberHits = 30);
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
            hoverCursor: "default",
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

export class FunctionalPredictions extends BasicCanvasRenderer {
    private topPadding: number = 0;
    private queryLen: number = 0;
    private subjLen: number = 0;
    private queryStart: number = 0;
    private queryEnd: number = 0;
    private startPixels: number;
    private endPixels: number;
    private startQueryPixels: number;
    private endQueryPixels: number;
    private startEvalPixels: number;
    private startSubjPixels: number;
    private endSubjPixels: number;
    private gradientSteps: number[] = [];
    private sssDataObj: SSSResultModel;
    private iprmcDataObj: IPRMCResultModel;
    private iprmcDataFlatObj: IPRMCResultModelFlat = {};
    public currentDomainDatabase: string | undefined;
    public uniqueDomainDatabases: string[] = [];
    public currentDomainDatabaseDisabled: boolean = false;

    constructor(
        element: string | HTMLCanvasElement,
        private data: string,
        renderOptions: RenderOptions,
        public domainDatabaseList: string[] = defaultDomainDatabaseList
    ) {
        super(element, renderOptions);
        this.validateInput();
        this.getFabricCanvas();
    }
    public render() {
        this.loadData();
        this.loadIPRMCdata();
        if (
            typeof this.sssDataObj !== "undefined" &&
            typeof this.iprmcDataObj !== "undefined"
        ) {
            this.loadInitalProperties();
            this.loadInitialCoords();
            // clear the canvas
            this.canvas.clear();
            // canvas header
            this.drawHeaderGroup();

            // canvas content
            // TODO?
            "Query Sequence View - Switch to Subject Sequence View";
            "Subject Sequence View - Switch to Query Sequence View";
            // this.dataObj.hits = [];
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
        const json = getDataFromURLorFile(this.data).then((data) => data);
        json.then((data) => {
            if (typeof this.sssDataObj === "undefined") {
                this.sssDataObj = data as SSSResultModel;
                this.render();
            }
        }).catch((error) => console.log(error));
    }

    private loadInitalProperties() {
        this.queryStart = 1;
        this.queryEnd = this.sssDataObj.query_len;
        this.queryLen = this.sssDataObj.query_len;
        for (const hit of this.sssDataObj.hits) {
            if (hit.hit_len > this.subjLen) this.subjLen = hit.hit_len;
        }
    }

    private loadInitialCoords() {
        [this.startPixels, this.endPixels] = getPixelCoords(
            this.contentWidth,
            this.contentLabelWidth,
            this.marginWidth
        );
        [
            this.startQueryPixels,
            this.endQueryPixels,
            this.startSubjPixels,
            this.endSubjPixels,
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

    private loadIPRMCdata() {
        let accessions: string = "";
        if (this.sssDataObj != undefined) {
            for (const hit of this.sssDataObj.hits) {
                if (accessions === "") accessions += `${hit.hit_acc}`;
                else accessions += `,${hit.hit_acc}`;
            }
            //    const xmlURL = getIPRMCDbfetchURL(accessions);
            //    const xml = getXMLDataFromURL(xmlURL).then((data) => data);
            //    xml.then((data) => {
            //        if (typeof this.iprmcDataObj === "undefined") {
            //            this.iprmcDataObj = parseXMLData(data);
            //            this.render();
            //        }
            //    }).catch((error) => console.log(error));
            // Temporarily to avoid hitting Dbfetch
            const json = getDataFromURLorFile("./src/testdata/iprmc.json").then(
                (data) => data
            );
            json.then((data) => {
                if (typeof this.iprmcDataObj === "undefined") {
                    this.iprmcDataObj = data as IPRMCResultModel;
                    this.render();
                }
            }).catch((error) => console.log(error));

            // disable domain checkboxes that have no predictions
            // and get 'workable' IPRMC data structure
            if (this.iprmcDataObj != undefined) {
                this.uniqueDomainDatabases = getUniqueIPRMCDomainDatabases(
                    this.iprmcDataObj
                );
                // remove domainDatabases not in the set of unique domainDatabases
                for (const db of this.domainDatabaseList) {
                    if (
                        !this.uniqueDomainDatabases.includes(
                            domainDatabaseNameToString(db)
                        )
                    ) {
                        const indx = this.domainDatabaseList.indexOf(db);
                        if (indx > -1) {
                            this.domainDatabaseList.splice(indx, 1);
                        }
                    }
                }
                this.iprmcDataFlatObj = getFlattenIPRMCDataModel(
                    this.iprmcDataObj,
                    this.numberHits
                );
            }
        }
    }

    private drawHeaderGroup() {
        // canvas header
        this.topPadding = 2;
        const textHeaderGroup = drawHeaderTextGroup(
            this.sssDataObj,
            {
                fontSize: this.fontSize,
                canvasWidth: this.canvasWidth,
            },
            this.topPadding
        );
        this.canvas.add(textHeaderGroup);

        // canvas header (sequence info)
        this.topPadding += 45;
        let textHeaderLink: fabric.Text;
        let textSeqObj: TextType;
        [textHeaderLink, textSeqObj] = drawHeaderLinkText(
            this.sssDataObj,
            { fontSize: this.fontSize },
            this.topPadding
        );
        this.canvas.add(textHeaderLink);
        if (this.sssDataObj.query_url != null) {
            mouseOverText(textHeaderLink, textSeqObj, this);
            mouseDownText(textHeaderLink, this.sssDataObj.query_url, this);
            mouseOutText(textHeaderLink, textSeqObj, this);
        }
    }

    private drawContentGroup() {
        // canvas content title
        this.topPadding += 25;
        let titleText: fabric.Text;
        let textTitleObj: TextType;
        [titleText, textTitleObj] = drawContentTitleText(
            {
                fontSize: this.fontSize + 1,
            },
            this.topPadding
        );
        this.canvas.add(titleText);

        // canvas dynamic content
        if (this.sssDataObj.hits.length > 0) {
            // domain selection
            this.topPadding += 35;
            this.drawPredictionsGroup();

            // query/subj sequence
            this.topPadding += 25;
            this.drawContentHeader();

            // dynamic content
            this.topPadding += 25;
            this.drawDynamicContentGroup();

            // color scale
            this.topPadding += 35;
            this.drawColorScaleGroup();
        } else {
            // text content: "No predictions found!"
            this.topPadding += 20;
            const noHitsTextGroup = drawNoHitsFoundText(
                {
                    fontSize: this.fontSize,
                    contentWidth: this.contentWidth,
                },
                this.topPadding
            );
            this.canvas.add(noHitsTextGroup);
        }
    }

    private drawContentHeader() {
        // query sequence tracks
        this.topPadding += 20;
        // content header line tracks
        const lineTrackGroup = drawLineTracks(
            {
                startPixels: this.startPixels,
                endPixels: this.endPixels,
            },
            { strokeWidth: 2 },
            this.topPadding
        );
        this.canvas.add(lineTrackGroup);
        // content header line track legends
        this.topPadding += 5;
        const textContentFooterGroup = drawContentFooterTextGroup(
            {
                start: this.queryStart,
                end: this.queryEnd,
                startPixels: this.startPixels,
                endPixels: this.endPixels,
            },
            {
                fontSize: this.fontSize,
            },
            this.topPadding
        );
        this.canvas.add(textContentFooterGroup);
    }

    private drawPredictionsGroup() {
        // Protein Features - Database Selection
        const pfLabelText = drawProteinFeaturesText(
            {
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth - 50,
            },
            this.topPadding
        );
        this.canvas.add(pfLabelText);

        // display the domain checkboxes
        createDomainCheckbox(
            this,
            "Pfam",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 190,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "SUPERFAMILY",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 260,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "SMART",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 390,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "HAMAP",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 480,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PANTHER",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 570,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PRODOM",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 680,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PROSITE profiles",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 770,
            { fontSize: this.fontSize }
        );
        this.topPadding += 30;
        createDomainCheckbox(
            this,
            "CDD",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 190,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "CATH-Gene3D",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 260,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PIRSF",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 390,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PRINTS",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 480,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "TIGERFAMs",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 570,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "SFLD",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 680,
            { fontSize: this.fontSize }
        );
        createDomainCheckbox(
            this,
            "PROSITE patterns",
            this.uniqueDomainDatabases,
            this.topPadding,
            this.contentLabelLeftWidth + 770,
            { fontSize: this.fontSize }
        );
    }

    private drawDynamicContentGroup() {
        // draw a new track group per hit
        // only display 30 hits by default
        // draw only one HSP per hit
        const queryLen: number = this.sssDataObj.query_len;
        let subjLen: number = 0;
        let maxIDLen: number = 0;
        for (const hit of this.sssDataObj.hits) {
            if (hit.hit_len > subjLen) subjLen = hit.hit_len;
            if (hit.hit_db.length + hit.hit_id.length > maxIDLen)
                maxIDLen = hit.hit_db.length + hit.hit_id.length;
        }
        let minScore: number = Number.MAX_VALUE;
        let maxScore: number = 0;
        let minNotZeroScore: number = Number.MAX_VALUE;
        for (const hit of this.sssDataObj.hits) {
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
        let tmpNumberHits = 0;
        for (const hit of this.sssDataObj.hits) {
            tmpNumberHits++;
            if (tmpNumberHits <= this.numberHits) {
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

                // subject line tracks
                const lineTrackGroup = drawLineTracks(
                    {
                        startPixels: this.startPixels,
                        endPixels: this.endPixels,
                    },
                    { strokeWidth: 1 },
                    this.topPadding
                );
                this.canvas.add(lineTrackGroup);

                // subject line tracks - legends
                this.topPadding += 5;
                const textContentFooterGroup = drawContentFooterTextGroup(
                    {
                        start: this.queryStart,
                        end: hit.hit_len,
                        startPixels: this.startPixels,
                        endPixels: this.endPixels,
                    },
                    {
                        fontSize: this.fontSize,
                    },
                    this.topPadding
                );
                this.canvas.add(textContentFooterGroup);

                // hit (1st HSP) transparent domain
                let boxColor: string = "white";
                let hspStart = 0;
                let hspEnd = 0;
                for (const hsp of hit.hit_hsps) {
                    hspStart = hsp.hsp_hit_from;
                    hspEnd = hsp.hsp_hit_to;
                    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
                        boxColor = getRgbColorFixed(
                            hsp.hsp_bit_score!,
                            this.gradientSteps,
                            ncbiBlastGradient
                        );
                    } else {
                        boxColor = getRgbColorGradient(
                            hsp.hsp_expect!,
                            this.gradientSteps,
                            defaultGradient
                        );
                    }
                    break;
                }
                let startDomainPixels: number = 0;
                let endDomainPixels: number = 0;
                [startDomainPixels, endDomainPixels] = getHspBoxPixelCoords(
                    this.startPixels,
                    this.endPixels,
                    hit.hit_len,
                    hspStart,
                    hspEnd,
                    this.marginWidth
                );

                // unique domain predictions && selected domain Databases
                let selectedDomainDatabases: string[] = [];
                for (const did of this.iprmcDataFlatObj[hit.hit_acc][
                    "matches"
                ]) {
                    const domain = domainDatabaseNameToString(
                        this.iprmcDataFlatObj[hit.hit_acc]["match"][did][0][
                            "dbname"
                        ] as string
                    );
                    if (this.domainDatabaseList.includes(domain)) {
                        selectedDomainDatabases.push(domain);
                    }
                }
                let boxHeight = selectedDomainDatabases.length * 15 + 15;
                if (selectedDomainDatabases.length === 0) boxHeight = 0;

                const hitTransparentBox = drawHitTransparentBox(
                    startDomainPixels,
                    endDomainPixels,
                    this.topPadding,
                    boxColor,
                    boxHeight
                );
                this.canvas.add(hitTransparentBox);

                // domain dashed-line tracks
                this.topPadding += 15;
                for (const _ of selectedDomainDatabases) {
                    this.topPadding += 15;
                    let dashedLineTrackGroup = drawDomainLineTracks(
                        {
                            startPixels: this.startPixels,
                            endPixels: this.endPixels,
                        },
                        { strokeWidth: 1, strokeDashArray: [1, 5] },
                        this.topPadding
                    );
                    this.canvas.add(dashedLineTrackGroup);
                }

                // final padding
                this.topPadding += 30;
            } else {
                // canvas content suppressed output
                let supressText: fabric.Text;
                let textSupressObj: TextType;
                [supressText, textSupressObj] = drawContentSupressText(
                    {
                        fontSize: this.fontSize,
                        contentWidth: this.contentWidth,
                    },
                    this.topPadding,
                    this.numberHits
                );
                this.canvas.add(supressText);
                break;
            }
        }
    }

    private drawColorScaleGroup() {
        // Scale Type
        const scaleTypeText = drawScaleTypeText(
            {
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth,
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
            textCheckNcbiObj,
        ] = drawCheckBoxText(
            {
                colorScheme: this.colorScheme,
                fontSize: this.fontSize,
                scaleLabelWidth: this.scaleLabelWidth,
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
                colorScheme: this.colorScheme,
            },
            this.topPadding
        );
        this.canvas.add(scaleScoreText);

        // E-value/Bit score Color Gradient
        const colorScale = drawScaleColorGradient(
            {
                scaleWidth: this.scaleWidth,
                scaleLabelWidth: this.scaleLabelWidth,
                colorScheme: this.colorScheme,
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
                    scaleLabelWidth: this.scaleLabelWidth,
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
                    scaleLabelWidth: this.scaleLabelWidth,
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
                fontSize: this.fontSize,
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
        // topPadding always overrides the canvasHeight?
        // if (this.canvasHeight < this.topPadding) {
        //     this.canvasHeight = this.topPadding;
        // }
        this.canvasHeight = this.topPadding;
        if (this.canvasWrapperStroke) {
            // final canvas wrapper stroke
            const canvasWrapper = drawCanvasWrapperStroke({
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight,
            });
            this.canvas.add(canvasWrapper);
        }
    }
}
