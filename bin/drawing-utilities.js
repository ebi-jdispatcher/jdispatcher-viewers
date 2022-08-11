import { fabric } from "fabric";
import { numberToString } from "./other-utilities";
import { getTotalPixels, getTextLegendPaddingFactor } from "./coords-utilities";
import { colorDefaultGradient, colorNcbiBlastGradient } from "./color-schemes";
import { objectDefaults, textDefaults, lineDefaults, rectDefaults, ColorSchemeEnum, } from "./custom-types";
import { colorByDatabaseName } from "./color-utilities";
export function drawHeaderTextGroup(dataObj, renderOptions, topPadding) {
    const origTopPadding = topPadding;
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize + 1;
    textObj.top = topPadding;
    textObj.left = 5;
    // program & version
    const program = dataObj.program;
    const version = dataObj.version;
    const programText = new fabric.Text(`${program} (version: ${version})`, textObj);
    // Database(s)
    let db_names = [];
    for (const db of dataObj.dbs) {
        db_names.push(db.name);
    }
    const dbs = db_names.join(", ");
    textObj.fontWeight = "normal";
    textObj.fontSize = renderOptions.fontSize;
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
    textObj.left = renderOptions.canvasWidth - 135;
    const startText = new fabric.Text(`${start}`, textObj);
    // End
    const end = dataObj.end;
    textObj.top = origTopPadding + 15;
    const endText = new fabric.Text(`${end}`, textObj);
    const textGroup = new fabric.Group([
        programText,
        databaseText,
        sequenceText,
        lengthText,
        startText,
        endText,
    ], objectDefaults);
    return textGroup;
}
export function drawHeaderLinkText(dataObj, renderOptions, topPadding) {
    // Sequence
    const sequence = dataObj.query_def;
    const textSeqObj = { ...textDefaults };
    textSeqObj.fontFamily = "Menlo";
    textSeqObj.fontSize = renderOptions.fontSize - 2;
    textSeqObj.evented = true;
    textSeqObj.top = topPadding - 15;
    textSeqObj.left = 57.5;
    const sequenceDefText = new fabric.Text(`${sequence}`, textSeqObj);
    return [sequenceDefText, textSeqObj];
}
export function drawContentHeaderTextGroup(coordValues, renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize + 1;
    textObj.top = topPadding + 2;
    textObj.textAlign = "center";
    const totalQueryPixels = getTotalPixels(coordValues.queryLen, coordValues.subjLen, coordValues.queryLen, renderOptions.contentWidth, renderOptions.contentScoringWidth);
    const totalSubjPixels = getTotalPixels(coordValues.queryLen, coordValues.subjLen, coordValues.subjLen, renderOptions.contentWidth, renderOptions.contentScoringWidth);
    // Query Match
    textObj.left = coordValues.startQueryPixels;
    const queryText = new fabric.Text("Sequence Match", textObj);
    queryText.width = totalQueryPixels;
    textObj.left = coordValues.startEvalPixels;
    let evalueText;
    // E-value/ Bits
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        evalueText = new fabric.Text("Bit score", textObj);
    }
    else {
        evalueText = new fabric.Text("E-value", textObj);
    }
    evalueText.width = renderOptions.contentScoringWidth;
    // Subject Match
    textObj.left = coordValues.startSubjPixels;
    const subjText = new fabric.Text("Subject Match", textObj);
    subjText.width = totalSubjPixels;
    const textGroup = new fabric.Group([queryText, evalueText, subjText], objectDefaults);
    return textGroup;
}
export function drawLineTracksQuerySubject(coordValues, renderOptions, topPadding) {
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    //  Query
    const coordsQuery = [
        coordValues.startQueryPixels,
        topPadding,
        coordValues.endQueryPixels,
        topPadding,
    ];
    lineObj.left = coordValues.startQueryPixels;
    const queryLine = new fabric.Line(coordsQuery, lineObj);
    const coordsQueryStartCap = [
        coordValues.startQueryPixels,
        topPadding - 3,
        coordValues.startQueryPixels,
        topPadding + 3,
    ];
    lineObj.top = topPadding - 2;
    const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);
    const coordsQueryEndCap = [
        coordValues.endQueryPixels,
        topPadding - 3,
        coordValues.endQueryPixels,
        topPadding + 3,
    ];
    lineObj.left = coordValues.endQueryPixels;
    const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);
    // Subject
    const coordsSubj = [
        coordValues.startSubjPixels,
        topPadding,
        coordValues.endSubjPixels,
        topPadding,
    ];
    lineObj.top = topPadding;
    lineObj.left = coordValues.startSubjPixels;
    const subjLine = new fabric.Line(coordsSubj, lineObj);
    const coordsSubjStartCap = [
        coordValues.startSubjPixels,
        topPadding - 3,
        coordValues.startSubjPixels,
        topPadding + 3,
    ];
    lineObj.top = topPadding - 2;
    const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);
    const coordsSubjEndCap = [
        coordValues.endSubjPixels,
        topPadding - 3,
        coordValues.endSubjPixels,
        topPadding + 3,
    ];
    lineObj.left = coordValues.endSubjPixels;
    const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);
    // Group
    const lineGroup = new fabric.Group([
        queryLine,
        subjLine,
        queryStartCap,
        queryEndCap,
        subjStartCap,
        subjEndCap,
    ], objectDefaults);
    return lineGroup;
}
export function drawLineTracks(coordValues, renderOptions, topPadding) {
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    //  Query/Subject
    const coordsQuery = [
        coordValues.startPixels,
        topPadding,
        coordValues.endPixels,
        topPadding,
    ];
    lineObj.left = coordValues.startPixels;
    const Line = new fabric.Line(coordsQuery, lineObj);
    const coordsStartCap = [
        coordValues.startPixels,
        topPadding - 3,
        coordValues.startPixels,
        topPadding + 3,
    ];
    lineObj.top = topPadding - 2;
    const startCap = new fabric.Line(coordsStartCap, lineObj);
    const coordsEndCap = [
        coordValues.endPixels,
        topPadding - 3,
        coordValues.endPixels,
        topPadding + 3,
    ];
    lineObj.left = coordValues.endPixels;
    const endCap = new fabric.Line(coordsEndCap, lineObj);
    // Group
    const lineGroup = new fabric.Group([Line, startCap, endCap], objectDefaults);
    return lineGroup;
}
export function drawDomainLineTracks(coordValues, renderOptions, topPadding) {
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    lineObj.strokeDashArray = renderOptions.strokeDashArray;
    //  Query/Subject
    const coordsQuery = [
        coordValues.startPixels,
        topPadding,
        coordValues.endPixels,
        topPadding,
    ];
    lineObj.left = coordValues.startPixels;
    return new fabric.Line(coordsQuery, lineObj);
}
export function drawContentFooterTextGroup(coordValues, renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding;
    // Start Query/Subject
    textObj.left = coordValues.startPixels - 2.5;
    const startText = new fabric.Text(`${coordValues.start}`, textObj);
    // End Query/Subject
    let positionFactor = getTextLegendPaddingFactor(`${coordValues.end}`);
    textObj.left = coordValues.endPixels - positionFactor;
    const endText = new fabric.Text(`${coordValues.end}`, textObj);
    const textGroup = new fabric.Group([startText, endText], objectDefaults);
    return textGroup;
}
export function drawContentQuerySubjFooterTextGroup(coordValues, renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding;
    // Start Query
    textObj.left = coordValues.startQueryPixels - 2.5;
    const startQueryText = new fabric.Text("1", textObj);
    // End Query
    let positionFactor = getTextLegendPaddingFactor(`${coordValues.queryLen}`);
    textObj.left = coordValues.endQueryPixels - positionFactor;
    const endQueryText = new fabric.Text(`${coordValues.queryLen}`, textObj);
    // Start Subject
    textObj.left = coordValues.startSubjPixels - 2.5;
    const startSubjText = new fabric.Text("1", textObj);
    // End Subject
    positionFactor = getTextLegendPaddingFactor(`${coordValues.subjLen}`);
    textObj.left = coordValues.endSubjPixels - positionFactor;
    const endSubjText = new fabric.Text(`${coordValues.subjLen}`, textObj);
    const textGroup = new fabric.Group([startQueryText, endQueryText, startSubjText, endSubjText], objectDefaults);
    return textGroup;
}
export function drawNoHitsFoundText(renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize + 1;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth / 2;
    textObj.fill = "red";
    const noHitsText = new fabric.Text("--------------------No hits found--------------------", textObj);
    return noHitsText;
}
export function drawContentSequenceInfoText(maxIDLen, hit, renderOptions, topPadding) {
    // Hit ID + Hit Description text tracks
    const textObj = { ...textDefaults };
    textObj.fontFamily = "Menlo";
    textObj.fontSize = renderOptions.fontSize - 2;
    textObj.top = topPadding - 2;
    const variableSpace = " ".repeat(maxIDLen - (hit.hit_db.length + hit.hit_id.length));
    const spaceText = new fabric.Text(variableSpace, textObj);
    let hit_def = `${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
    let hit_def_full = `${variableSpace}${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
    if (hit_def_full.length > 40) {
        hit_def = (hit_def_full.slice(0, 38) + "...").slice(variableSpace.length);
    }
    textObj.left = 10 + variableSpace.length * 6;
    textObj.evented = true;
    const hitText = new fabric.Text(hit_def, textObj);
    return [spaceText, hitText, textObj];
}
export function drawHspNoticeText(totalNumberHsps, numberHsps, renderOptions, topPadding) {
    // notice about not all HSPs being displayed
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth / 2;
    textObj.fill = "red";
    const hspTextNotice = new fabric.Text(`This hit contains ${totalNumberHsps} alignments, ` +
        `but only the first ${numberHsps} are displayed!`, textObj);
    return hspTextNotice;
}
export function drawScoreText(startEvalPixels, hsp, renderOptions, topPadding) {
    // E-value text tracks
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding - 15;
    textObj.textAlign = "center";
    textObj.left = startEvalPixels;
    let hspScoreText;
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        hspScoreText = new fabric.Text(numberToString(hsp.hsp_bit_score), textObj);
    }
    else {
        hspScoreText = new fabric.Text(numberToString(hsp.hsp_expect), textObj);
    }
    return hspScoreText;
}
export function drawDomainQueySubject(startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels, topPadding, fill) {
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
export function drawDomainTooltips(startHspPixels, endHspPixels, seq_from, seq_to, hsp, renderOptions, topPadding) {
    const floatTextObj = { ...textDefaults };
    floatTextObj.fontSize = renderOptions.fontSize + 1;
    floatTextObj.textAlign = "left";
    floatTextObj.originX = "top";
    floatTextObj.originY = "top";
    floatTextObj.top = 5;
    let tooltip;
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nBit score: ${numberToString(hsp.hsp_bit_score)}`;
    }
    else {
        tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nE-value: ${numberToString(hsp.hsp_expect)}`;
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
    const tooltipBox = new fabric.Rect(rectObj);
    const tooltipGroup = new fabric.Group([tooltipBox, tooltipText], {
        selectable: false,
        evented: false,
        objectCaching: false,
        visible: false,
        top: topPadding,
        left: startHspPixels + endHspPixels / 2,
    });
    return tooltipGroup;
}
export function drawScaleTypeText(renderOptions, topPadding) {
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize + 1;
    textSelObj.fontWeight = "bold";
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth;
    const scaleTypeText = new fabric.Text("Scale Type:", textSelObj);
    return scaleTypeText;
}
export function drawCheckBoxText(renderOptions, topPadding) {
    // Scale Type selection
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize + 1;
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth;
    const textCheckDynObj = { ...textDefaults };
    textCheckDynObj.fontSize = renderOptions.fontSize + 12;
    textCheckDynObj.fill = "grey";
    textCheckDynObj.evented = true;
    textCheckDynObj.top = topPadding - 8;
    textCheckDynObj.left = renderOptions.scaleLabelWidth;
    const textCheckFixObj = { ...textCheckDynObj };
    const textCheckNcbiObj = { ...textCheckDynObj };
    let checkSym;
    renderOptions.colorScheme === ColorSchemeEnum.dynamic
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme === ColorSchemeEnum.dynamic)
        textCheckDynObj.fill = "black";
    textCheckDynObj.left += 80;
    const dynamicCheckboxText = new fabric.Text(checkSym, textCheckDynObj);
    textSelObj.left += 100;
    const dynamicText = new fabric.Text("Dynamic (E-value: min to max)", textSelObj);
    renderOptions.colorScheme === ColorSchemeEnum.fixed
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme === ColorSchemeEnum.fixed)
        textCheckFixObj.fill = "black";
    textCheckFixObj.left += 290;
    const fixedCheckboxText = new fabric.Text(checkSym, textCheckFixObj);
    textSelObj.left += 210;
    const fixedText = new fabric.Text("Fixed (E-value: 0.0 to 100.0)", textSelObj);
    renderOptions.colorScheme === ColorSchemeEnum.ncbiblast
        ? (checkSym = "☒")
        : (checkSym = "☐");
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast)
        textCheckNcbiObj.fill = "black";
    textCheckNcbiObj.left += 480;
    const ncbiblastCheckboxText = new fabric.Text(checkSym, textCheckNcbiObj);
    textSelObj.left += 190;
    const ncbiblastText = new fabric.Text("NCBI BLAST+ (Bit score: <40 to ≥200)", textSelObj);
    return [
        dynamicCheckboxText,
        dynamicText,
        textCheckDynObj,
        fixedCheckboxText,
        fixedText,
        textCheckFixObj,
        ncbiblastCheckboxText,
        ncbiblastText,
        textCheckNcbiObj,
    ];
}
export function drawScaleScoreText(renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize + 1;
    textObj.top = topPadding;
    let scaleTypeLabel;
    renderOptions.colorScheme === ColorSchemeEnum.ncbiblast
        ? (scaleTypeLabel = "Bit score")
        : (scaleTypeLabel = "E-value");
    renderOptions.colorScheme === ColorSchemeEnum.ncbiblast
        ? (textObj.left = renderOptions.scaleLabelWidth - 56)
        : (textObj.left = renderOptions.scaleLabelWidth - 50);
    const scaleScoreText = new fabric.Text(`${scaleTypeLabel}`, textObj);
    return scaleScoreText;
}
export function drawScaleColorGradient(renderOptions, topPadding) {
    const rectObj = { ...rectDefaults };
    rectObj.top = topPadding;
    rectObj.left = renderOptions.scaleLabelWidth;
    rectObj.width = renderOptions.scaleWidth;
    rectObj.height = 15;
    const colorScale = new fabric.Rect(rectObj);
    if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
        colorNcbiBlastGradient(colorScale, 0, renderOptions.scaleWidth);
    }
    else {
        colorDefaultGradient(colorScale, 0, renderOptions.scaleWidth);
    }
    return colorScale;
}
export function drawLineAxis5Buckets(startGradPixels, o25GradPixels, o50GradPixels, o75GradPixels, endGradPixels, renderOptions, topPadding) {
    // Axis
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    const coordsAxis = [
        startGradPixels,
        topPadding,
        endGradPixels,
        topPadding,
    ];
    lineObj.left = startGradPixels;
    const axisLine = new fabric.Line(coordsAxis, lineObj);
    // Start tick
    const coordsAxisStartTick = [
        startGradPixels,
        topPadding,
        startGradPixels,
        topPadding + 4,
    ];
    const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);
    // 25% tick
    const coordsAxis25Tick = [
        o25GradPixels,
        topPadding,
        o25GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o25GradPixels;
    const axis25Tick = new fabric.Line(coordsAxis25Tick, lineObj);
    // 50% tick
    const coordsAxis50Tick = [
        o50GradPixels,
        topPadding,
        o50GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o50GradPixels;
    const axis50Tick = new fabric.Line(coordsAxis50Tick, lineObj);
    // 75% tick
    const coordsAxis75Tick = [
        o75GradPixels,
        topPadding,
        o75GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o75GradPixels;
    const axis75Tick = new fabric.Line(coordsAxis75Tick, lineObj);
    // End tick
    const coordsAxisEndTick = [
        endGradPixels,
        topPadding,
        endGradPixels,
        topPadding + 4,
    ];
    lineObj.left = endGradPixels;
    const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);
    // Group
    const axisGroup = new fabric.Group([
        axisLine,
        axisStartTick,
        axis25Tick,
        axis50Tick,
        axis75Tick,
        axisEndTick,
    ], objectDefaults);
    return axisGroup;
}
export function drawLineAxis6Buckets(startGradPixels, o20GradPixels, o40GradPixels, o60GradPixels, o80GradPixels, endGradPixels, renderOptions, topPadding) {
    // Axis
    const lineObj = { ...lineDefaults };
    lineObj.top = topPadding;
    lineObj.stroke = "black";
    lineObj.strokeWidth = renderOptions.strokeWidth;
    const coordsAxis = [
        startGradPixels,
        topPadding,
        endGradPixels,
        topPadding,
    ];
    lineObj.left = startGradPixels;
    const axisLine = new fabric.Line(coordsAxis, lineObj);
    // Start tick
    const coordsAxisStartTick = [
        startGradPixels,
        topPadding,
        startGradPixels,
        topPadding + 4,
    ];
    const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);
    // 20% tick
    const coordsAxis20Tick = [
        o20GradPixels,
        topPadding,
        o20GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o20GradPixels;
    const axis20Tick = new fabric.Line(coordsAxis20Tick, lineObj);
    // 40% tick
    const coordsAxis40Tick = [
        o40GradPixels,
        topPadding,
        o40GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o40GradPixels;
    const axis40Tick = new fabric.Line(coordsAxis40Tick, lineObj);
    // 60% tick
    const coordsAxis60Tick = [
        o60GradPixels,
        topPadding,
        o60GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o60GradPixels;
    const axis60Tick = new fabric.Line(coordsAxis60Tick, lineObj);
    // 80% tick
    const coordsAxis80Tick = [
        o80GradPixels,
        topPadding,
        o80GradPixels,
        topPadding + 4,
    ];
    lineObj.left = o80GradPixels;
    const axis80Tick = new fabric.Line(coordsAxis80Tick, lineObj);
    // End tick
    const coordsAxisEndTick = [
        endGradPixels,
        topPadding,
        endGradPixels,
        topPadding + 4,
    ];
    lineObj.left = endGradPixels;
    const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);
    // Group
    const axisGroup = new fabric.Group([
        axisLine,
        axisStartTick,
        axis20Tick,
        axis40Tick,
        axis60Tick,
        axis80Tick,
        axisEndTick,
    ], objectDefaults);
    return axisGroup;
}
export function drawScaleTick5LabelsGroup(gradientSteps, leftPadding, renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.top = topPadding;
    textObj.fontSize = renderOptions.fontSize;
    // 20% Tick Label
    let label = `<${gradientSteps[1]}`;
    textObj.left =
        renderOptions.scaleLabelWidth + leftPadding - label.length * 3 - 72;
    const o20LabelText = new fabric.Text(label, textObj);
    // 40% Tick Label
    label = `${gradientSteps[1]} - ${gradientSteps[2]}`;
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding * 2 -
            label.length * 3 -
            72;
    const o40LabelText = new fabric.Text(label, textObj);
    // 60% Tick Label
    label = `${gradientSteps[2]} - ${gradientSteps[3]}`;
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding * 3 -
            label.length * 3 -
            72;
    const o60LabelText = new fabric.Text(label, textObj);
    // 60% Tick Label
    label = `${gradientSteps[3]} - ${gradientSteps[4]}`;
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding * 4 -
            label.length * 3 -
            72;
    const o80LabelText = new fabric.Text(label, textObj);
    // End Tick Label
    label = `≥${gradientSteps[4]}`;
    textObj.left =
        renderOptions.scaleLabelWidth +
            renderOptions.scaleWidth -
            label.length * 3 -
            72;
    const endLabelText = new fabric.Text(label, textObj);
    const textGroup = new fabric.Group([o20LabelText, o40LabelText, o60LabelText, o80LabelText, endLabelText], objectDefaults);
    return textGroup;
}
export function drawScaleTick4LabelsGroup(gradientSteps, leftPadding, renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.top = topPadding;
    textObj.fontSize = renderOptions.fontSize;
    // Start Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth -
            numberToString(gradientSteps[0]).length * 3;
    const startLabelText = new fabric.Text(numberToString(gradientSteps[0]), textObj);
    // 25% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding -
            numberToString(gradientSteps[1]).length * 3;
    const o25LabelText = new fabric.Text(numberToString(gradientSteps[1]), textObj);
    // 50% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding * 2 -
            numberToString(gradientSteps[2]).length * 3;
    const o50LabelText = new fabric.Text(numberToString(gradientSteps[2]), textObj);
    // 75% Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth +
            leftPadding * 3 -
            numberToString(gradientSteps[3]).length * 3;
    const o75LabelText = new fabric.Text(numberToString(gradientSteps[3]), textObj);
    // End Tick Label
    textObj.left =
        renderOptions.scaleLabelWidth +
            renderOptions.scaleWidth -
            numberToString(gradientSteps[4]).length * 3;
    const endLabelText = new fabric.Text(numberToString(gradientSteps[4]), textObj);
    const textGroup = new fabric.Group([
        startLabelText,
        o25LabelText,
        o50LabelText,
        o75LabelText,
        endLabelText,
    ], objectDefaults);
    return textGroup;
}
export function drawFooterText(renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.evented = true;
    textObj.top = topPadding;
    textObj.left = 225;
    const copyright = `European Bioinformatics Institute 2006-2022. ` +
        `EBI is an Outstation of the European Molecular Biology Laboratory.`;
    const copyrightText = new fabric.Text(`${copyright}`, textObj);
    return [copyrightText, textObj];
}
export function drawCanvasWrapperStroke(renderOptions) {
    const canvasWrapper = new fabric.Rect({
        selectable: false,
        evented: false,
        objectCaching: false,
        top: 0,
        left: 0,
        width: renderOptions.canvasWidth - 1,
        height: renderOptions.canvasHeight - 1,
        strokeWidth: 1,
        stroke: "lightseagreen",
        fill: "transparent",
    });
    return canvasWrapper;
}
export function drawContentTitleText(renderOptions, topPadding) {
    const textObj = { ...textDefaults };
    textObj.fontWeight = "bold";
    textObj.fontSize = renderOptions.fontSize + 2;
    textObj.top = topPadding;
    textObj.left = 350;
    const title = "Fast Family and Domain Prediction by InterPro";
    return new fabric.Text(`${title}`, textObj);
}
export function drawContentSupressText(renderOptions, topPadding, numberHits) {
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize;
    textObj.top = topPadding;
    textObj.left = renderOptions.contentWidth / 2;
    textObj.fill = "red";
    const title = `This is a partial representation of the result, ` +
        `only the first ${numberHits} hits are displayed!`;
    return new fabric.Text(`${title}`, textObj);
}
export function drawProteinFeaturesText(renderOptions, topPadding) {
    const textSelObj = { ...textDefaults };
    textSelObj.fontSize = renderOptions.fontSize + 1;
    textSelObj.fontWeight = "bold";
    textSelObj.top = topPadding;
    textSelObj.left = renderOptions.scaleLabelWidth - 10;
    const scaleTypeText = new fabric.Text("Select your database:", textSelObj);
    return scaleTypeText;
}
export function drawDomainCheckbox(renderOptions, topPadding, leftPadding, currentDomainDatabase) {
    const rectObj = { ...rectDefaults };
    rectObj.top = topPadding;
    rectObj.left = leftPadding;
    rectObj.height = 15;
    rectObj.width = 15;
    rectObj.evented = true;
    const textObj = { ...textDefaults };
    textObj.fontSize = renderOptions.fontSize + 1;
    textObj.top = topPadding;
    textObj.left = leftPadding + 20;
    if (renderOptions.currentDisabled) {
        textObj.fill = "grey";
        rectObj.fill = "white";
        rectObj.stroke = "grey";
    }
    else if (renderOptions.currentDomainDatabase !== undefined) {
        rectObj.fill = colorByDatabaseName(renderOptions.currentDomainDatabase);
        rectObj.stroke = "black";
    }
    else {
        rectObj.fill = "white";
        rectObj.stroke = "grey";
    }
    const proteinFeatureRect = new fabric.Rect(rectObj);
    const proteinFeatureText = new fabric.Text(currentDomainDatabase, textObj);
    return [proteinFeatureRect, proteinFeatureText, rectObj, rectObj];
}
export function drawHitTransparentBox(startPixels, endPixels, topPadding, fill, height) {
    const rectObj = { ...rectDefaults };
    rectObj.fill = fill;
    rectObj.opacity = 0.5;
    rectObj.rx = 5;
    rectObj.ry = 5;
    //  Hit
    rectObj.top = topPadding + 15;
    rectObj.left = startPixels;
    rectObj.width = endPixels;
    rectObj.height = height;
    return new fabric.Rect(rectObj);
}
export function drawContentDomainInfoText(domainID, renderOptions, topPadding) {
    // Domain ID text tracks
    const textObj = { ...textDefaults };
    textObj.fontFamily = "Menlo";
    textObj.fontSize = renderOptions.fontSize - 2;
    textObj.top = topPadding - 5;
    const variableSpace = " ".repeat(40 - domainID.length);
    const spaceText = new fabric.Text(variableSpace, textObj);
    let domain = `${domainID}`;
    let domain_full = `${variableSpace}${domainID}`;
    if (domain_full.length > 40) {
        domain = (domain_full.slice(0, 38) + "...").slice(variableSpace.length);
    }
    textObj.left = 12 + variableSpace.length * 6;
    textObj.evented = true;
    const hitText = new fabric.Text(domain, textObj);
    return [spaceText, hitText, textObj];
}
// TODO FIXME: fix boxes around the edges of the canvas
export function drawDomains(startPixels, endPixels, topPadding, color) {
    const rectObj = { ...rectDefaults };
    rectObj.evented = true;
    rectObj.top = topPadding;
    rectObj.fill = color;
    rectObj.rx = 5;
    rectObj.ry = 5;
    //  Domain
    rectObj.top = topPadding - 15;
    rectObj.left = startPixels;
    rectObj.width = endPixels;
    rectObj.height = 10;
    rectObj.stroke = "black";
    rectObj.strokeWidth = 0.5;
    return new fabric.Rect(rectObj);
}
export function drawDomainInfoTooltips(startPixels, endPixels, seq_from, seq_to, domain, renderOptions, topPadding) {
    const floatTextObj = { ...textDefaults };
    floatTextObj.fontSize = renderOptions.fontSize + 1;
    floatTextObj.textAlign = "left";
    floatTextObj.originX = "top";
    floatTextObj.originY = "top";
    floatTextObj.top = 5;
    floatTextObj.left = 10;
    floatTextObj.width = 200;
    let tooltip = `Start: ${seq_from}\n` +
        `End: ${seq_to}\n` +
        `Database: ${domain.dbname}\n`;
    if (domain.altid !== undefined && domain.altname !== undefined) {
        tooltip +=
            `ID: ${domain.altid}\n` +
                `Name: ${domain.altname}\n` +
                `Type: ${domain.type}\n` +
                `IPR ID: ${domain.id}\n` +
                `IPR Name: ${domain.name}\n`;
    }
    else {
        tooltip +=
            `ID: ${domain.id}\n` +
                `Name: ${domain.name}\n` +
                `Type: ${domain.type}\n`;
    }
    const tooltipText = new fabric.Textbox(tooltip, floatTextObj);
    const rectObj = { ...rectDefaults };
    rectObj.fill = "white";
    rectObj.stroke = "lightseagreen";
    rectObj.rx = 5;
    rectObj.ry = 5;
    rectObj.originX = "top";
    rectObj.originY = "top";
    rectObj.width = tooltipText.width + 40;
    rectObj.height = tooltipText.height;
    rectObj.opacity = 0.95;
    const tooltipBox = new fabric.Rect(rectObj);
    const tooltipGroup = new fabric.Group([tooltipBox, tooltipText], {
        selectable: false,
        evented: false,
        objectCaching: false,
        visible: false,
        top: topPadding,
        left: startPixels + endPixels / 2,
    });
    return tooltipGroup;
}
export function drawURLInfoTooltip(startPixels, sequence, URL, renderOptions, topPadding) {
    const floatTextObj = { ...textDefaults };
    floatTextObj.fontSize = renderOptions.fontSize + 1;
    floatTextObj.originX = "left";
    floatTextObj.originY = "top";
    floatTextObj.top = 5;
    floatTextObj.left = 5;
    if (sequence.length > 150) {
        sequence = sequence.slice(0, 150) + "...";
    }
    let tooltipText;
    if (sequence !== "") {
        const seqLabel = sequence.length * 6.3;
        const urlLabel = URL.length * 6.3;
        if (seqLabel > urlLabel) {
            floatTextObj.width = seqLabel + 5;
        }
        else {
            floatTextObj.width = urlLabel + 5;
        }
        tooltipText = new fabric.Text(`${sequence}\n` + `${URL}`, floatTextObj);
    }
    else {
        const urlLabel = URL.length * 6.3;
        floatTextObj.width = urlLabel + 5;
        tooltipText = new fabric.Text(`${URL}`, floatTextObj);
    }
    const rectObj = { ...rectDefaults };
    rectObj.fill = "white";
    rectObj.stroke = "lightseagreen";
    rectObj.strokeWidth = 0.5;
    rectObj.rx = 5;
    rectObj.ry = 5;
    rectObj.originX = "left";
    rectObj.originY = "top";
    rectObj.width = tooltipText.width + 10;
    rectObj.height = tooltipText.height + 10;
    rectObj.opacity = 0.95;
    const tooltipBox = new fabric.Rect(rectObj);
    const tooltipGroup = new fabric.Group([tooltipBox, tooltipText], {
        selectable: false,
        evented: false,
        objectCaching: false,
        visible: true,
        top: topPadding,
        originX: "left",
    });
    tooltipGroup.left = startPixels + 10;
    return tooltipGroup;
}
