import { fabric } from "fabric";
import { numberToString } from "./other-utilities";
import { SSSResultModel, Hit, Hsp } from "./data-model";
import { getTotalPixels, getTextLegendPaddingFactor } from "./coords-utilities";
import { colorDefaultGradient, colorNcbiBlastGradient } from "./color-schemes";
import {
    objectDefaults,
    textDefaults,
    lineDefaults,
    rectDefaults,
    RenderOptions,
    CoordsValues,
    ColorSchemeEnum,
    TextType,
    RectType,
    DomainDatabaseEnum,
} from "./custom-types";
import { colorByDatabaseName } from "./color-utilities";


export function drawHeaderTextGroup(
    dataObj: SSSResultModel,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const origTopPadding = topPadding;
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize! + 1;
    textObj.top = topPadding;
    textObj.left = 5;

    // program & version
    const program = dataObj.program;
    const version = dataObj.version;
    const programText = new fabric.Text(
        `${program} (version: ${version})`,
        textObj
    );
    // Database(s)
    let db_names: string[] = [];
    for (const db of dataObj.dbs) {
        db_names.push(db.name);
    }
    const dbs: string = db_names.join(", ");
    textObj.fontWeight = "normal";
    textObj.fontSize = renderOptions.fontSize!;
    topPadding += 15;
    textObj.top = topPadding;
    const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
    // Sequence
    topPadding += 15;
    textObj.top = topPadding;
    const sequenceText = new fabric.Text("Sequence: ", textObj);
    // Length
    const length = dataObj.query_len;
    topPadding += 15;
    textObj.top = topPadding;
    const lengthText = new fabric.Text(`Length: ${length}`, textObj);
    // Start
    const start = dataObj.start;
    textObj.top = origTopPadding;
    textObj.left = renderOptions.canvasWidth! - 135;
    const startText = new fabric.Text(`${start}`, textObj);
    // End
    const end = dataObj.end;
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
    return textGroup;
}

export function drawHeaderLinkText(
    dataObj: SSSResultModel,
    renderOptions: RenderOptions,
    topPadding: number
): [fabric.Text, TextType] {
    // Sequence
    const sequence = dataObj.query_def;
    const textSeqObj = { ...textDefaults };
    textSeqObj.fontFamily = "Menlo";
    textSeqObj.fontSize = renderOptions.fontSize! - 2;
    textSeqObj.evented = true;
    textSeqObj.top = topPadding - 15;
    textSeqObj.left = 57.5;
    const sequenceDefText = new fabric.Text(`${sequence}`, textSeqObj);
    return [sequenceDefText, textSeqObj];
}

export function drawContentHeaderTextGroup(
    coordValues: CoordsValues,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize! + 1;
    textObj.top = topPadding + 2;
    textObj.textAlign = "center";
    const totalQueryPixels = getTotalPixels(
        coordValues.queryLen!,
        coordValues.subjLen!,
        coordValues.queryLen!,
        renderOptions.contentWidth!,
        renderOptions.contentScoringWidth!
    );
    const totalSubjPixels = getTotalPixels(
        coordValues.queryLen!,
        coordValues.subjLen!,
        coordValues.subjLen!,
        renderOptions.contentWidth!,
        renderOptions.contentScoringWidth!
    );
    // Query Match
    textObj.left = coordValues.startQueryPixels;
    const queryText = new fabric.Text("Sequence Match", textObj);
    queryText.width = totalQueryPixels;
    textObj.left = coordValues.startEvalPixels;
    let evalueText;
    // E-value/ Bits
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        evalueText = new fabric.Text("Bit score", textObj);
    } else {
        evalueText = new fabric.Text("E-value", textObj);
    }
    evalueText.width = renderOptions.contentScoringWidth;
    // Subject Match
    textObj.left = coordValues.startSubjPixels;
    const subjText = new fabric.Text("Subject Match", textObj);
    subjText.width = totalSubjPixels;
    const textGroup = new fabric.Group(
        [queryText, evalueText, subjText],
        objectDefaults
    );
    return textGroup;
}

export function drawLineTracks(
    coordValues: CoordsValues,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    //  Query
    const coordsQuery: [number, number, number, number] = [
        coordValues.startQueryPixels!,
        topPadding,
        coordValues.endQueryPixels!,
        topPadding
    ];
    lineObj.left = coordValues.startQueryPixels;
    const queryLine = new fabric.Line(coordsQuery, lineObj);

    const coordsQueryStartCap: [number, number, number, number] = [
        coordValues.startQueryPixels!,
        topPadding - 3,
        coordValues.startQueryPixels!,
        topPadding + 3
    ];
    lineObj.top = topPadding - 2;
    const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);

    const coordsQueryEndCap: [number, number, number, number] = [
        coordValues.endQueryPixels!,
        topPadding - 3,
        coordValues.endQueryPixels!,
        topPadding + 3
    ];
    lineObj.left = coordValues.endQueryPixels;
    const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);

    // Subject
    const coordsSubj: [number, number, number, number] = [
        coordValues.startSubjPixels!,
        topPadding,
        coordValues.endSubjPixels!,
        topPadding
    ];
    lineObj.top = topPadding;
    lineObj.left = coordValues.startSubjPixels;
    const subjLine = new fabric.Line(coordsSubj, lineObj);

    const coordsSubjStartCap: [number, number, number, number] = [
        coordValues.startSubjPixels!,
        topPadding - 3,
        coordValues.startSubjPixels!,
        topPadding + 3
    ];
    lineObj.top = topPadding - 2;
    const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);

    const coordsSubjEndCap: [number, number, number, number] = [
        coordValues.endSubjPixels!,
        topPadding - 3,
        coordValues.endSubjPixels!,
        topPadding + 3
    ];
    lineObj.left = coordValues.endSubjPixels;
    const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);

    // Group
    const lineGroup = new fabric.Group(
        [
            queryLine,
            subjLine,
            queryStartCap,
            queryEndCap,
            subjStartCap,
            subjEndCap
        ],
        objectDefaults
    );
    return lineGroup;
}

export function drawContentFooterTextGroup(
    coordValues: CoordsValues,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding;
    // Start Query
    textObj.left = coordValues.startQueryPixels! - 2.5;
    const startQueryText = new fabric.Text("1", textObj);
    // End Query
    let positionFactor: number = getTextLegendPaddingFactor(
        `${coordValues.queryLen}`
    );
    textObj.left = coordValues.endQueryPixels! - positionFactor;
    const endQueryText = new fabric.Text(`${coordValues.queryLen}`, textObj);
    // Start Subject
    textObj.left = coordValues.startSubjPixels! - 2.5;
    const startSubjText = new fabric.Text("1", textObj);
    // End Subject
    positionFactor = getTextLegendPaddingFactor(`${coordValues.subjLen}`);
    textObj.left = coordValues.endSubjPixels! - positionFactor;
    const endSubjText = new fabric.Text(`${coordValues.subjLen}`, textObj);
    const textGroup = new fabric.Group(
        [startQueryText, endQueryText, startSubjText, endSubjText],
        objectDefaults
    );
    return textGroup;
}

export function drawNoHitsFoundText(
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize! + 1;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth! / 2;
    textObj.fill = "red";
    const noHitsText = new fabric.Text(
        "--------------------No hits found--------------------",
        textObj
    );
    return noHitsText;
}

export function drawContentSequenceInfoText(
    maxIDLen: number,
    hit: Hit,
    renderOptions: RenderOptions,
    topPadding: number
): [fabric.Text, fabric.Text, TextType] {
    // Hit ID + Hit Description text tracks
    const textObj = { ...textDefaults };
    textObj.fontFamily = "Menlo";
    textObj.fontSize = renderOptions.fontSize! - 2;
    textObj.top = topPadding - 2;

    const variableSpace = " ".repeat(
        maxIDLen - (hit.hit_db.length + hit.hit_id.length)
    );
    const spaceText: fabric.Text = new fabric.Text(variableSpace, textObj);

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
    return [spaceText, hitText, textObj];
}

export function drawHspNoticeText(
    totalNumberHsps: number,
    numberHsps: number,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    // notice about not all HSPs being displayed
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize!;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth! / 2;
    textObj.fill = "red";
    const hspTextNotice = new fabric.Text(
        `This hit contains ${totalNumberHsps} alignments, ` +
            `but only the first ${numberHsps} are displayed`,
        textObj
    );
    return hspTextNotice;
}

export function drawScoreText(
    startEvalPixels: number,
    hsp: Hsp,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    // E-value text tracks
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding - 15;
    textObj.textAlign = "center";

    textObj.left = startEvalPixels;
    let hspScoreText: fabric.Text;
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        hspScoreText = new fabric.Text(
            numberToString(hsp.hsp_bit_score!),
            textObj
        );
    } else {
        hspScoreText = new fabric.Text(
            numberToString(hsp.hsp_expect!),
            textObj
        );
    }
    return hspScoreText;
}

export function drawDomainTracks(
    startQueryPixels: number,
    endQueryPixels: number,
    startSubjPixels: number,
    endSubjPixels: number,
    topPadding: number,
    fill: string
): [fabric.Rect, fabric.Rect] {
    const rectObj = { ...rectDefaults };
    rectObj.evented = true;
    rectObj.top = topPadding;
    rectObj.fill = fill;
    rectObj.rx = 5;
    rectObj.ry = 5;
    //  Query
    rectObj.top = topPadding - 15;
    rectObj.left = startQueryPixels;
    rectObj.width = endQueryPixels;
    rectObj.height = 10;
    const queryDomain = new fabric.Rect(rectObj);

    // Subject
    rectObj.top = topPadding - 15;
    rectObj.left = startSubjPixels;
    rectObj.width = endSubjPixels;
    rectObj.height = 10;
    const subjDomain = new fabric.Rect(rectObj);

    return [queryDomain, subjDomain];
}

export function drawDomainTooltips(
    startHspPixels: number,
    endHspPixels: number,
    seq_from: number,
    seq_to: number,
    hsp: Hsp,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const floatTextObj = { ...textDefaults };
    floatTextObj.fontSize = renderOptions.fontSize! + 1;
    floatTextObj.textAlign = "left";
    floatTextObj.originX = "top";
    floatTextObj.originY = "top";
    floatTextObj.top = 5;
    let tooltip: string;
    if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) {
        tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nBit score: ${numberToString(
            hsp.hsp_bit_score!
        )}`;
    } else {
        tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nE-value: ${numberToString(
            hsp.hsp_expect!
        )}`;
    }
    const tooltipText = new fabric.Text(tooltip, floatTextObj);
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

    const tooltipBox: fabric.Rect = new fabric.Rect(rectObj);
    const tooltipGroup: fabric.Group = new fabric.Group(
        [tooltipBox, tooltipText],
        {
            selectable: false,
            evented: false,
            objectCaching: false,
            visible: false,
            top: topPadding - 10,
            left: startHspPixels + endHspPixels / 2
        }
    );
    return tooltipGroup;
}

export function drawScaleTypeText(
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize! + 1;
    textSelObj.fontWeight = "bold";
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth!;
    const scaleTypeText = new fabric.Text("Scale Type:", textSelObj);
    return scaleTypeText;
}

export function drawCheckBoxText(
    renderOptions: RenderOptions,
    topPadding: number
): [
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType
] {
    // Scale Type selection
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize! + 1;
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth!;

    const textCheckDynObj = { ...textDefaults };
    textCheckDynObj.fontSize = renderOptions.fontSize! + 12;
    textCheckDynObj.fill = "grey";
    textCheckDynObj.evented = true;
    textCheckDynObj.top = topPadding - 8;
    textCheckDynObj.left = renderOptions.scaleLabelWidth!;
    const textCheckFixObj = { ...textCheckDynObj };
    const textCheckNcbiObj = { ...textCheckDynObj };

    let checkSym: string;
    renderOptions.colorScheme === ColorSchemeEnum.dynamic
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme === ColorSchemeEnum.dynamic)
        textCheckDynObj.fill = "black";
    textCheckDynObj.left! += 80;
    const dynamicCheckboxText = new fabric.Text(checkSym, textCheckDynObj);
    textSelObj.left! += 100;
    const dynamicText = new fabric.Text(
        "Dynamic (E-value: min to max)",
        textSelObj
    );

    renderOptions.colorScheme! === ColorSchemeEnum.fixed
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme! === ColorSchemeEnum.fixed)
        textCheckFixObj.fill = "black";
    textCheckFixObj.left! += 290;
    const fixedCheckboxText = new fabric.Text(checkSym, textCheckFixObj);
    textSelObj.left! += 210;
    const fixedText = new fabric.Text(
        "Fixed (E-value: 0.0 to 100.0)",
        textSelObj
    );

    renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast)
        textCheckNcbiObj.fill = "black";
    textCheckNcbiObj.left! += 480;
    const ncbiblastCheckboxText = new fabric.Text(checkSym, textCheckNcbiObj);
    textSelObj.left! += 190;
    const ncbiblastText = new fabric.Text(
        "NCBI BLAST+ (Bit score: <40 to ≥200)",
        textSelObj
    );

    return [
        dynamicCheckboxText,
        dynamicText,
        textCheckDynObj,
        fixedCheckboxText,
        fixedText,
        textCheckFixObj,
        ncbiblastCheckboxText,
        ncbiblastText,
        textCheckNcbiObj
    ];
}

export function drawScaleScoreText(
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize! + 1;
    textObj.top = topPadding;
    let scaleTypeLabel: string;
    renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast
        ? (scaleTypeLabel = "Bit score")
        : (scaleTypeLabel = "E-value");
    renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast
        ? (textObj.left = renderOptions.scaleLabelWidth! - 56)
        : (textObj.left = renderOptions.scaleLabelWidth! - 50);
    const scaleScoreText = new fabric.Text(`${scaleTypeLabel}`, textObj);
    return scaleScoreText;
}

export function drawScaleColorGradient(
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Rect {
    const rectObj = { ...rectDefaults };
    rectObj.top = topPadding;
    rectObj.left = renderOptions.scaleLabelWidth!;
    rectObj.width = renderOptions.scaleWidth!;
    rectObj.height = 15;
    const colorScale = new fabric.Rect(rectObj);
    if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) {
        colorNcbiBlastGradient(colorScale, 0, renderOptions.scaleWidth!);
    } else {
        colorDefaultGradient(colorScale, 0, renderOptions.scaleWidth!);
    }
    return colorScale;
}

export function drawLineAxis5Buckets(
    startGradPixels: number,
    o25GradPixels: number,
    o50GradPixels: number,
    o75GradPixels: number,
    endGradPixels: number,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    // Axis
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth!;
    const coordsAxis: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        endGradPixels,
        topPadding
    ];
    lineObj.left = startGradPixels;
    const axisLine = new fabric.Line(coordsAxis, lineObj);

    // Start tick
    const coordsAxisStartTick: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        startGradPixels,
        topPadding + 4
    ];
    const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);

    // 25% tick
    const coordsAxis25Tick: [number, number, number, number] = [
        o25GradPixels,
        topPadding,
        o25GradPixels,
        topPadding + 4
    ];
    lineObj.left = o25GradPixels;
    const axis25Tick = new fabric.Line(coordsAxis25Tick, lineObj);

    // 50% tick
    const coordsAxis50Tick: [number, number, number, number] = [
        o50GradPixels,
        topPadding,
        o50GradPixels,
        topPadding + 4
    ];
    lineObj.left = o50GradPixels;
    const axis50Tick = new fabric.Line(coordsAxis50Tick, lineObj);

    // 75% tick
    const coordsAxis75Tick: [number, number, number, number] = [
        o75GradPixels,
        topPadding,
        o75GradPixels,
        topPadding + 4
    ];
    lineObj.left = o75GradPixels;
    const axis75Tick = new fabric.Line(coordsAxis75Tick, lineObj);

    // End tick
    const coordsAxisEndTick: [number, number, number, number] = [
        endGradPixels,
        topPadding,
        endGradPixels,
        topPadding + 4
    ];
    lineObj.left = endGradPixels;
    const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);

    // Group
    const axisGroup = new fabric.Group(
        [
            axisLine,
            axisStartTick,
            axis25Tick,
            axis50Tick,
            axis75Tick,
            axisEndTick
        ],
        objectDefaults
    );
    return axisGroup;
}

export function drawLineAxis6Buckets(
    startGradPixels: number,
    o20GradPixels: number,
    o40GradPixels: number,
    o60GradPixels: number,
    o80GradPixels: number,
    endGradPixels: number,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    // Axis
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth!;
    const coordsAxis: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        endGradPixels,
        topPadding
    ];
    lineObj.left = startGradPixels;
    const axisLine = new fabric.Line(coordsAxis, lineObj);

    // Start tick
    const coordsAxisStartTick: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        startGradPixels,
        topPadding + 4
    ];
    const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);

    // 20% tick
    const coordsAxis20Tick: [number, number, number, number] = [
        o20GradPixels,
        topPadding,
        o20GradPixels,
        topPadding + 4
    ];
    lineObj.left = o20GradPixels;
    const axis20Tick = new fabric.Line(coordsAxis20Tick, lineObj);

    // 40% tick
    const coordsAxis40Tick: [number, number, number, number] = [
        o40GradPixels,
        topPadding,
        o40GradPixels,
        topPadding + 4
    ];
    lineObj.left = o40GradPixels;
    const axis40Tick = new fabric.Line(coordsAxis40Tick, lineObj);

    // 60% tick
    const coordsAxis60Tick: [number, number, number, number] = [
        o60GradPixels,
        topPadding,
        o60GradPixels,
        topPadding + 4
    ];
    lineObj.left = o60GradPixels;
    const axis60Tick = new fabric.Line(coordsAxis60Tick, lineObj);

    // 80% tick
    const coordsAxis80Tick: [number, number, number, number] = [
        o80GradPixels,
        topPadding,
        o80GradPixels,
        topPadding + 4
    ];
    lineObj.left = o80GradPixels;
    const axis80Tick = new fabric.Line(coordsAxis80Tick, lineObj);

    // End tick
    const coordsAxisEndTick: [number, number, number, number] = [
        endGradPixels,
        topPadding,
        endGradPixels,
        topPadding + 4
    ];
    lineObj.left = endGradPixels;
    const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);

    // Group
    const axisGroup = new fabric.Group(
        [
            axisLine,
            axisStartTick,
            axis20Tick,
            axis40Tick,
            axis60Tick,
            axis80Tick,
            axisEndTick
        ],
        objectDefaults
    );
    return axisGroup;
}

export function drawScaleTick5LabelsGroup(
    gradientSteps: number[],
    leftPadding: number,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const textObj = { ...textDefaults };
    textObj.top = topPadding;
    textObj.fontSize = renderOptions.fontSize!;
    // 20% Tick Label
    let label = `<${gradientSteps[1]}`;
    textObj.left =
        renderOptions.scaleLabelWidth! + leftPadding - label.length * 3 - 72;
    const o20LabelText = new fabric.Text(label, textObj);
    // 40% Tick Label
    label = `${gradientSteps[1]} - ${gradientSteps[2]}`;
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding * 2 -
        label.length * 3 -
        72;
    const o40LabelText = new fabric.Text(label, textObj);
    // 60% Tick Label
    label = `${gradientSteps[2]} - ${gradientSteps[3]}`;
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding * 3 -
        label.length * 3 -
        72;
    const o60LabelText = new fabric.Text(label, textObj);
    // 60% Tick Label
    label = `${gradientSteps[3]} - ${gradientSteps[4]}`;
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding * 4 -
        label.length * 3 -
        72;
    const o80LabelText = new fabric.Text(label, textObj);
    // End Tick Label
    label = `≥${gradientSteps[4]}`;
    textObj.left =
        renderOptions.scaleLabelWidth! +
        renderOptions.scaleWidth! -
        label.length * 3 -
        72;
    const endLabelText = new fabric.Text(label, textObj);

    const textGroup = new fabric.Group(
        [o20LabelText, o40LabelText, o60LabelText, o80LabelText, endLabelText],
        objectDefaults
    );
    return textGroup;
}

export function drawScaleTick4LabelsGroup(
    gradientSteps: number[],
    leftPadding: number,
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Group {
    const textObj = { ...textDefaults };
    textObj.top = topPadding;
    textObj.fontSize = renderOptions.fontSize!;
    // Start Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth! -
        numberToString(gradientSteps[0]).length * 3;
    const startLabelText = new fabric.Text(
        numberToString(gradientSteps[0]),
        textObj
    );
    // 25% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding -
        numberToString(gradientSteps[1]).length * 3;
    const o25LabelText = new fabric.Text(
        numberToString(gradientSteps[1]),
        textObj
    );
    // 50% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding * 2 -
        numberToString(gradientSteps[2]).length * 3;
    const o50LabelText = new fabric.Text(
        numberToString(gradientSteps[2]),
        textObj
    );
    // 75% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth! +
        leftPadding * 3 -
        numberToString(gradientSteps[3]).length * 3;
    const o75LabelText = new fabric.Text(
        numberToString(gradientSteps[3]),
        textObj
    );
    // End Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth! +
        renderOptions.scaleWidth! -
        numberToString(gradientSteps[4]).length * 3;
    const endLabelText = new fabric.Text(
        numberToString(gradientSteps[4]),
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
    return textGroup;
}

export function drawFooterText(
    renderOptions: RenderOptions,
    topPadding: number
): [fabric.Text, TextType] {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.evented = true;
    textObj.top = topPadding;
    textObj.left = 225;
    const copyright =
        `European Bioinformatics Institute 2006-2020. ` +
        `EBI is an Outstation of the European Molecular Biology Laboratory.`;
    const copyrightText = new fabric.Text(`${copyright}`, textObj);
    return [copyrightText, textObj];
}

export function drawCanvasWrapperStroke(renderOptions: RenderOptions) {
    const canvasWrapper = new fabric.Rect({
        selectable: false,
        evented: false,
        objectCaching: false,
        top: 0,
        left: 0,
        width: renderOptions.canvasWidth! - 1,
        height: renderOptions.canvasHeight! - 1,
        strokeWidth: 1,
        stroke: "lightseagreen",
        fill: "transparent"
    });
    return canvasWrapper;
}

export function drawContentTitleText(
    renderOptions: RenderOptions,
    topPadding: number
): [fabric.Text, TextType] {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize! + 2;
    textObj.top = topPadding;
    textObj.left = 375;
    const title = "Fast Family and Domain Prediction";
    const titleText = new fabric.Text(`${title}`, textObj);
    return [titleText, textObj];
}

export function drawContentSupressText(
    renderOptions: RenderOptions,
    topPadding: number
): [fabric.Text, TextType] {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize!;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth! / 2;
    textObj.fill = "red";
    const title =
        "This is a partial representation of the result, only the first hits are displayed";
    const titleText = new fabric.Text(`${title}`, textObj);
    return [titleText, textObj];
}

export function drawProteinFeaturesText(
    renderOptions: RenderOptions,
    topPadding: number
): fabric.Text {
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize! + 1;
    textSelObj.fontWeight = "bold";
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth! - 75;
    const scaleTypeText = new fabric.Text("Select your database:", textSelObj);
    return scaleTypeText;
}

export function drawDomainCheckbox(
    renderOptions: RenderOptions,
    topPadding: number,
    leftPadding: number,
    currentDomainDatabase: DomainDatabaseEnum
): [fabric.Rect, fabric.Text, RectType, TextType] {
    const rectObj = { ...rectDefaults };
    rectObj.top = topPadding;
    rectObj.left = leftPadding;
    rectObj.height = 15;
    rectObj.width = 15;
    rectObj.evented = true;
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize! + 1;
    textObj.top = topPadding;
    textObj.left = leftPadding + 20;

    if (renderOptions.currentDisabled) {
        textObj.fill = "grey";
        rectObj.fill = "white";
        rectObj.stroke = "grey";
    } else if (renderOptions.currentDomainDatabase !== undefined) {
        rectObj.fill = colorByDatabaseName(renderOptions.currentDomainDatabase);
        rectObj.stroke = "black";
    } else {
        rectObj.fill = "white";
        rectObj.stroke = "grey";
    }

    const proteinFeatureRect = new fabric.Rect(rectObj);
    const proteinFeatureText = new fabric.Text(
        currentDomainDatabase.toString(),
        textObj
    );
    return [proteinFeatureRect, proteinFeatureText, rectObj, rectObj];
}
