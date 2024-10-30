import { Group, FabricText, Line, Rect, Textbox } from 'fabric';
import { numberToString } from './other-utilities';
import { SSSResultModel, Hit, Hsp, IprMatchFlat } from './data-model';
import { getTotalPixels, getTextLegendPaddingFactor } from './coords-utilities';
import { colorDefaultGradient, colorNcbiBlastGradient } from './color-schemes';
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
} from './custom-types';
import { colorByDatabaseName } from './color-utilities';

export function drawHeaderTextGroup(dataObj: SSSResultModel, renderOptions: RenderOptions, topPadding: number): Group {
  const origTopPadding = topPadding;
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  textObj.left = 5;

  // program & version
  const program = dataObj.program;
  const version = dataObj.version;
  const programText = new FabricText(`${program} (version: ${version})`, textObj);
  // Database(s)
  let db_names: string[] = [];
  for (const db of dataObj.dbs) {
    db_names.push(db.name);
  }
  const dbs: string = db_names.join(', ');
  textObj.fontWeight = 'normal';
  textObj.fontSize = renderOptions.fontSize!;
  topPadding += 15;
  textObj.top = topPadding;
  const databaseText = new FabricText(`Database(s): ${dbs}`, textObj);
  // Sequence
  topPadding += 15;
  textObj.top = topPadding;
  const sequenceText = new FabricText('Sequence: ', textObj);
  // Length
  const length = dataObj.query_len;
  topPadding += 15;
  textObj.top = topPadding;
  const lengthText = new FabricText(`Length: ${length}`, textObj);
  // Start
  const start = dataObj.start;
  textObj.top = origTopPadding;
  textObj.left = renderOptions.canvasWidth! - 135;
  const startText = new FabricText(`${start}`, textObj);
  // End
  const end = dataObj.end;
  textObj.top = origTopPadding + 15;
  const endText = new FabricText(`${end}`, textObj);
  const textGroup = new Group(
    [programText, databaseText, sequenceText, lengthText, startText, endText],
    objectDefaults
  );
  return textGroup;
}

export function drawHeaderLinkText(
  dataObj: SSSResultModel,
  renderOptions: RenderOptions,
  topPadding: number
): [FabricText, TextType] {
  // Sequence
  const sequence = dataObj.query_def;
  const textSeqObj = { ...textDefaults };
  textSeqObj.fontFamily = 'Menlo';
  textSeqObj.fontSize = renderOptions.fontSize! - 2;
  textSeqObj.evented = true;
  textSeqObj.top = topPadding - 15;
  textSeqObj.left = 57.5;
  const sequenceDefText = new FabricText(`${sequence}`, textSeqObj);
  return [sequenceDefText, textSeqObj];
}

export function drawContentHeaderTextGroup(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding + 2;
  textObj.textAlign = 'center';
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
  const queryText = new FabricText('Sequence Match', textObj);
  queryText.width = totalQueryPixels;
  textObj.left = coordValues.startEvalPixels;
  let evalueText;
  // E-value/ Bits
  if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
    evalueText = new FabricText('Bit score', textObj);
  } else {
    evalueText = new FabricText('E-value', textObj);
  }
  evalueText.width = renderOptions.contentScoringWidth as number;
  // Subject Match
  textObj.left = coordValues.startSubjPixels;
  const subjText = new FabricText('Subject Match', textObj);
  subjText.width = totalSubjPixels;
  const textGroup = new Group([queryText, evalueText, subjText], objectDefaults);
  return textGroup;
}

export function drawLineTracksQuerySubject(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth;
  //  Query
  const coordsQuery: [number, number, number, number] = [
    coordValues.startQueryPixels!,
    topPadding,
    coordValues.endQueryPixels!,
    topPadding,
  ];
  lineObj.left = coordValues.startQueryPixels;
  const queryLine = new Line(coordsQuery, lineObj);

  const coordsQueryStartCap: [number, number, number, number] = [
    coordValues.startQueryPixels!,
    topPadding - 3,
    coordValues.startQueryPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const queryStartCap = new Line(coordsQueryStartCap, lineObj);

  const coordsQueryEndCap: [number, number, number, number] = [
    coordValues.endQueryPixels!,
    topPadding - 3,
    coordValues.endQueryPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endQueryPixels;
  const queryEndCap = new Line(coordsQueryEndCap, lineObj);

  // Subject
  const coordsSubj: [number, number, number, number] = [
    coordValues.startSubjPixels!,
    topPadding,
    coordValues.endSubjPixels!,
    topPadding,
  ];
  lineObj.top = topPadding;
  lineObj.left = coordValues.startSubjPixels;
  const subjLine = new Line(coordsSubj, lineObj);

  const coordsSubjStartCap: [number, number, number, number] = [
    coordValues.startSubjPixels!,
    topPadding - 3,
    coordValues.startSubjPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const subjStartCap = new Line(coordsSubjStartCap, lineObj);

  const coordsSubjEndCap: [number, number, number, number] = [
    coordValues.endSubjPixels!,
    topPadding - 3,
    coordValues.endSubjPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endSubjPixels;
  const subjEndCap = new Line(coordsSubjEndCap, lineObj);

  // Group
  const lineGroup = new Group(
    [queryLine, subjLine, queryStartCap, queryEndCap, subjStartCap, subjEndCap],
    objectDefaults
  );
  return lineGroup;
}

export function drawLineTracks(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): Group {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth;
  //  Query/Subject
  const coordsQuery: [number, number, number, number] = [
    coordValues.startPixels!,
    topPadding,
    coordValues.endPixels!,
    topPadding,
  ];
  lineObj.left = coordValues.startPixels;
  const line = new Line(coordsQuery, lineObj);

  const coordsStartCap: [number, number, number, number] = [
    coordValues.startPixels!,
    topPadding - 3,
    coordValues.startPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const startCap = new Line(coordsStartCap, lineObj);

  const coordsEndCap: [number, number, number, number] = [
    coordValues.endPixels!,
    topPadding - 3,
    coordValues.endPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endPixels;
  const endCap = new Line(coordsEndCap, lineObj);

  // Group
  const lineGroup = new Group([line, startCap, endCap], objectDefaults);
  return lineGroup;
}

export function drawDomainLineTracks(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): Line {
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth;
  lineObj.strokeDashArray = renderOptions.strokeDashArray;
  //  Query/Subject
  const coordsQuery: [number, number, number, number] = [
    coordValues.startPixels!,
    topPadding,
    coordValues.endPixels!,
    topPadding,
  ];
  lineObj.left = coordValues.startPixels;
  return new Line(coordsQuery, lineObj);
}

export function drawContentFooterTextGroup(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  // Start Query/Subject
  textObj.left = coordValues.startPixels! - 2.5;
  const startText = new FabricText(`${coordValues.start}`, textObj);
  // End Query/Subject
  let positionFactor: number = getTextLegendPaddingFactor(`${coordValues.end}`);
  textObj.left = coordValues.endPixels! - positionFactor;
  const endText = new FabricText(`${coordValues.end}`, textObj);
  const textGroup = new Group([startText, endText], objectDefaults);
  return textGroup;
}

export function drawContentQuerySubjFooterTextGroup(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  // Start Query
  textObj.left = coordValues.startQueryPixels! - 2.5;
  const startQueryText = new FabricText('1', textObj);
  // End Query
  let positionFactor: number = getTextLegendPaddingFactor(`${coordValues.queryLen}`);
  textObj.left = coordValues.endQueryPixels! - positionFactor;
  const endQueryText = new FabricText(`${coordValues.queryLen}`, textObj);
  // Start Subject
  textObj.left = coordValues.startSubjPixels! - 2.5;
  const startSubjText = new FabricText('1', textObj);
  // End Subject
  positionFactor = getTextLegendPaddingFactor(`${coordValues.subjLen}`);
  textObj.left = coordValues.endSubjPixels! - positionFactor;
  const endSubjText = new FabricText(`${coordValues.subjLen}`, textObj);
  const textGroup = new Group([startQueryText, endQueryText, startSubjText, endSubjText], objectDefaults);
  return textGroup;
}

export function drawNoHitsFoundText(renderOptions: RenderOptions, topPadding: number): FabricText {
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth! / 2;
  textObj.fill = 'red';
  const noHitsText = new FabricText('--------------------No hits found--------------------', textObj);
  return noHitsText;
}

export function drawContentSequenceInfoText(
  maxIDLen: number,
  hit: Hit,
  renderOptions: RenderOptions,
  topPadding: number
): [FabricText, FabricText, TextType] {
  // Hit ID + Hit Description text tracks
  const textObj = { ...textDefaults };
  textObj.fontFamily = 'Menlo';
  textObj.fontSize = renderOptions.fontSize! - 2;
  textObj.top = topPadding - 2;

  const variableSpace = ' '.repeat(maxIDLen - (hit.hit_db.length + hit.hit_id.length));
  const spaceText: FabricText = new FabricText(variableSpace, textObj);

  let hit_def: string = `${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  let hit_def_full: string = `${variableSpace}${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  if (hit_def_full.length > 40) {
    hit_def = (hit_def_full.slice(0, 38) + '...').slice(variableSpace.length);
  }
  textObj.left = 10 + variableSpace.length * 6;
  textObj.evented = true;
  const hitText: FabricText = new FabricText(hit_def, textObj);
  return [spaceText, hitText, textObj];
}

export function drawHspNoticeText(
  totalNumberHsps: number,
  numberHsps: number,
  renderOptions: RenderOptions,
  topPadding: number
): FabricText {
  // notice about not all HSPs being displayed
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize!;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth! / 2;
  textObj.fill = 'red';
  const hspTextNotice = new FabricText(
    `This hit contains ${totalNumberHsps} alignments, ` + `but only the first ${numberHsps} are displayed!`,
    textObj
  );
  return hspTextNotice;
}

export function drawScoreText(
  startEvalPixels: number,
  hsp: Hsp,
  renderOptions: RenderOptions,
  topPadding: number
): FabricText {
  // E-value text tracks
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding - 15;
  textObj.textAlign = 'center';

  textObj.left = startEvalPixels;
  let hspScoreText: FabricText;
  if (renderOptions.colorScheme === ColorSchemeEnum.ncbiblast) {
    hspScoreText = new FabricText(numberToString(hsp.hsp_bit_score!), textObj);
  } else {
    hspScoreText = new FabricText(numberToString(hsp.hsp_expect!), textObj);
  }
  return hspScoreText;
}

export function drawDomainQueySubject(
  startQueryPixels: number,
  endQueryPixels: number,
  startSubjPixels: number,
  endSubjPixels: number,
  topPadding: number,
  fill: string
): [Rect, Rect] {
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
  const queryDomain = new Rect(rectObj);

  // Subject
  rectObj.top = topPadding - 15;
  rectObj.left = startSubjPixels;
  rectObj.width = endSubjPixels;
  rectObj.height = 10;
  const subjDomain = new Rect(rectObj);

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
): Group {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize! + 1;
  floatTextObj.textAlign = 'left';
  floatTextObj.originX = 'top';
  floatTextObj.originY = 'top';
  floatTextObj.top = 5;
  let tooltip: string;
  if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) {
    tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nBit score: ${numberToString(hsp.hsp_bit_score!)}`;
  } else {
    tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nE-value: ${numberToString(hsp.hsp_expect!)}`;
  }
  const tooltipText = new FabricText(tooltip, floatTextObj);
  const rectObj = { ...rectDefaults };
  rectObj.fill = 'white';
  rectObj.stroke = 'lightseagreen';
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = 'top';
  rectObj.originY = 'top';
  rectObj.width = 140;
  rectObj.height = 60;
  rectObj.opacity = 0.95;

  const tooltipBox: Rect = new Rect(rectObj);
  const tooltipGroup: Group = new Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: false,
    top: topPadding,
    left: startHspPixels + endHspPixels / 2,
  });
  return tooltipGroup;
}

export function drawScaleTypeText(renderOptions: RenderOptions, topPadding: number): FabricText {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.fontWeight = 'bold';
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth!;
  const scaleTypeText = new FabricText('Scale Type:', textSelObj);
  return scaleTypeText;
}

export function drawCheckBoxText(
  renderOptions: RenderOptions,
  topPadding: number
): [FabricText, FabricText, TextType, FabricText, FabricText, TextType, FabricText, FabricText, TextType] {
  // Scale Type selection
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth!;

  const textCheckDynObj = { ...textDefaults };
  textCheckDynObj.fontSize = renderOptions.fontSize! + 12;
  textCheckDynObj.fill = 'grey';
  textCheckDynObj.evented = true;
  textCheckDynObj.top = topPadding - 8;
  textCheckDynObj.left = renderOptions.scaleLabelWidth!;
  const textCheckFixObj = { ...textCheckDynObj };
  const textCheckNcbiObj = { ...textCheckDynObj };

  let checkSym: string;
  renderOptions.colorScheme === ColorSchemeEnum.dynamic ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme === ColorSchemeEnum.dynamic) textCheckDynObj.fill = 'black';
  textCheckDynObj.left! += 80;
  const dynamicCheckboxText = new FabricText(checkSym, textCheckDynObj);
  textSelObj.left! += 100;
  const dynamicText = new FabricText('Dynamic (E-value: min to max)', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.fixed ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.fixed) textCheckFixObj.fill = 'black';
  textCheckFixObj.left! += 290;
  const fixedCheckboxText = new FabricText(checkSym, textCheckFixObj);
  textSelObj.left! += 210;
  const fixedText = new FabricText('Fixed (E-value: 0.0 to 100.0)', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) textCheckNcbiObj.fill = 'black';
  textCheckNcbiObj.left! += 480;
  const ncbiblastCheckboxText = new FabricText(checkSym, textCheckNcbiObj);
  textSelObj.left! += 190;
  const ncbiblastText = new FabricText('NCBI BLAST+ (Bit score: <40 to ≥200)', textSelObj);

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

export function drawScaleScoreText(renderOptions: RenderOptions, topPadding: number): FabricText {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  let scaleTypeLabel: string;
  renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast
    ? (scaleTypeLabel = 'Bit score')
    : (scaleTypeLabel = 'E-value');
  renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast
    ? (textObj.left = renderOptions.scaleLabelWidth! - 56)
    : (textObj.left = renderOptions.scaleLabelWidth! - 50);
  const scaleScoreText = new FabricText(`${scaleTypeLabel}`, textObj);
  return scaleScoreText;
}

export function drawScaleColorGradient(renderOptions: RenderOptions, topPadding: number): Rect {
  const rectObj = { ...rectDefaults };
  rectObj.top = topPadding;
  rectObj.left = renderOptions.scaleLabelWidth!;
  rectObj.width = renderOptions.scaleWidth!;
  rectObj.height = 15;
  const colorScale = new Rect(rectObj);
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
): Group {
  // Axis
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth!;
  const coordsAxis: [number, number, number, number] = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new Line(coordsAxis, lineObj);

  // Start tick
  const coordsAxisStartTick: [number, number, number, number] = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4,
  ];
  const axisStartTick = new Line(coordsAxisStartTick, lineObj);

  // 25% tick
  const coordsAxis25Tick: [number, number, number, number] = [o25GradPixels, topPadding, o25GradPixels, topPadding + 4];
  lineObj.left = o25GradPixels;
  const axis25Tick = new Line(coordsAxis25Tick, lineObj);

  // 50% tick
  const coordsAxis50Tick: [number, number, number, number] = [o50GradPixels, topPadding, o50GradPixels, topPadding + 4];
  lineObj.left = o50GradPixels;
  const axis50Tick = new Line(coordsAxis50Tick, lineObj);

  // 75% tick
  const coordsAxis75Tick: [number, number, number, number] = [o75GradPixels, topPadding, o75GradPixels, topPadding + 4];
  lineObj.left = o75GradPixels;
  const axis75Tick = new Line(coordsAxis75Tick, lineObj);

  // End tick
  const coordsAxisEndTick: [number, number, number, number] = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4,
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new Line(coordsAxisEndTick, lineObj);

  // Group
  const axisGroup = new Group(
    [axisLine, axisStartTick, axis25Tick, axis50Tick, axis75Tick, axisEndTick],
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
): Group {
  // Axis
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth!;
  const coordsAxis: [number, number, number, number] = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new Line(coordsAxis, lineObj);

  // Start tick
  const coordsAxisStartTick: [number, number, number, number] = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4,
  ];
  const axisStartTick = new Line(coordsAxisStartTick, lineObj);

  // 20% tick
  const coordsAxis20Tick: [number, number, number, number] = [o20GradPixels, topPadding, o20GradPixels, topPadding + 4];
  lineObj.left = o20GradPixels;
  const axis20Tick = new Line(coordsAxis20Tick, lineObj);

  // 40% tick
  const coordsAxis40Tick: [number, number, number, number] = [o40GradPixels, topPadding, o40GradPixels, topPadding + 4];
  lineObj.left = o40GradPixels;
  const axis40Tick = new Line(coordsAxis40Tick, lineObj);

  // 60% tick
  const coordsAxis60Tick: [number, number, number, number] = [o60GradPixels, topPadding, o60GradPixels, topPadding + 4];
  lineObj.left = o60GradPixels;
  const axis60Tick = new Line(coordsAxis60Tick, lineObj);

  // 80% tick
  const coordsAxis80Tick: [number, number, number, number] = [o80GradPixels, topPadding, o80GradPixels, topPadding + 4];
  lineObj.left = o80GradPixels;
  const axis80Tick = new Line(coordsAxis80Tick, lineObj);

  // End tick
  const coordsAxisEndTick: [number, number, number, number] = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4,
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new Line(coordsAxisEndTick, lineObj);

  // Group
  const axisGroup = new Group(
    [axisLine, axisStartTick, axis20Tick, axis40Tick, axis60Tick, axis80Tick, axisEndTick],
    objectDefaults
  );
  return axisGroup;
}

export function drawScaleTick5LabelsGroup(
  gradientSteps: number[],
  leftPadding: number,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const textObj = { ...textDefaults };
  textObj.top = topPadding;
  textObj.fontSize = renderOptions.fontSize!;
  // 20% Tick Label
  let label = `<${gradientSteps[1]}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding - label.length * 3 - 72;
  const o20LabelText = new FabricText(label, textObj);
  // 40% Tick Label
  label = `${gradientSteps[1]} - ${gradientSteps[2]}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 2 - label.length * 3 - 72;
  const o40LabelText = new FabricText(label, textObj);
  // 60% Tick Label
  label = `${gradientSteps[2]} - ${gradientSteps[3]}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 3 - label.length * 3 - 72;
  const o60LabelText = new FabricText(label, textObj);
  // 60% Tick Label
  label = `${gradientSteps[3]} - ${gradientSteps[4]}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 4 - label.length * 3 - 72;
  const o80LabelText = new FabricText(label, textObj);
  // End Tick Label
  label = `≥${gradientSteps[4]}`;
  textObj.left = renderOptions.scaleLabelWidth! + renderOptions.scaleWidth! - label.length * 3 - 72;
  const endLabelText = new FabricText(label, textObj);

  const textGroup = new Group([o20LabelText, o40LabelText, o60LabelText, o80LabelText, endLabelText], objectDefaults);
  return textGroup;
}

export function drawScaleTick4LabelsGroup(
  gradientSteps: number[],
  leftPadding: number,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const textObj = { ...textDefaults };
  textObj.top = topPadding;
  textObj.fontSize = renderOptions.fontSize!;
  // Start Tick Label
  textObj.left = renderOptions.scaleLabelWidth! - numberToString(gradientSteps[0]).length * 3;
  const startLabelText = new FabricText(numberToString(gradientSteps[0]), textObj);
  // 25% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding - numberToString(gradientSteps[1]).length * 3;
  const o25LabelText = new FabricText(numberToString(gradientSteps[1]), textObj);
  // 50% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 2 - numberToString(gradientSteps[2]).length * 3;
  const o50LabelText = new FabricText(numberToString(gradientSteps[2]), textObj);
  // 75% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 3 - numberToString(gradientSteps[3]).length * 3;
  const o75LabelText = new FabricText(numberToString(gradientSteps[3]), textObj);
  // End Tick Label
  textObj.left =
    renderOptions.scaleLabelWidth! + renderOptions.scaleWidth! - numberToString(gradientSteps[4]).length * 3;
  const endLabelText = new FabricText(numberToString(gradientSteps[4]), textObj);

  const textGroup = new Group([startLabelText, o25LabelText, o50LabelText, o75LabelText, endLabelText], objectDefaults);
  return textGroup;
}

export function drawFooterText(renderOptions: RenderOptions, topPadding: number): [FabricText, TextType] {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.evented = true;
  textObj.top = topPadding;
  textObj.left = 225;
  const copyright =
    `European Bioinformatics Institute 2006-2022. ` +
    `EBI is an Outstation of the European Molecular Biology Laboratory.`;
  const copyrightText = new FabricText(`${copyright}`, textObj);
  return [copyrightText, textObj];
}

export function drawCanvasWrapperStroke(renderOptions: RenderOptions) {
  const canvasWrapper = new Rect({
    selectable: false,
    evented: false,
    objectCaching: false,
    top: 0,
    left: 0,
    width: renderOptions.canvasWidth! - 1,
    height: renderOptions.canvasHeight! - 1,
    strokeWidth: 1,
    stroke: 'lightseagreen',
    fill: 'transparent',
  });
  return canvasWrapper;
}

export function drawContentTitleText(renderOptions: RenderOptions, topPadding: number): FabricText {
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 2;
  textObj.top = topPadding;
  textObj.left = 350;
  const title = 'Fast Family and Domain Prediction by InterPro';
  return new FabricText(`${title}`, textObj);
}

export function drawContentSupressText(
  renderOptions: RenderOptions,
  topPadding: number,
  numberHits: number
): FabricText {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize!;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth! / 2;
  textObj.fill = 'red';
  const title = `This is a partial representation of the result, ` + `only the first ${numberHits} hits are displayed!`;
  return new FabricText(`${title}`, textObj);
}

export function drawProteinFeaturesText(renderOptions: RenderOptions, topPadding: number): FabricText {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.fontWeight = 'bold';
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth! - 10;
  const scaleTypeText = new FabricText('Select your database:', textSelObj);
  return scaleTypeText;
}

export function drawDomainCheckbox(
  renderOptions: RenderOptions,
  topPadding: number,
  leftPadding: number,
  currentDomainDatabase: string
): [Rect, FabricText, RectType, TextType] {
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
    textObj.fill = 'grey';
    rectObj.fill = 'white';
    rectObj.stroke = 'grey';
  } else if (renderOptions.currentDomainDatabase !== undefined) {
    rectObj.fill = colorByDatabaseName(renderOptions.currentDomainDatabase);
    rectObj.stroke = 'black';
  } else {
    rectObj.fill = 'white';
    rectObj.stroke = 'grey';
  }

  const proteinFeatureRect = new Rect(rectObj);
  const proteinFeatureText = new FabricText(currentDomainDatabase, textObj);
  return [proteinFeatureRect, proteinFeatureText, rectObj, rectObj];
}

export function drawHitTransparentBox(
  startPixels: number,
  endPixels: number,
  topPadding: number,
  fill: string,
  height: number
): Rect {
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
  return new Rect(rectObj);
}

export function drawContentDomainInfoText(
  domainID: string,
  renderOptions: RenderOptions,
  topPadding: number
): [FabricText, FabricText, TextType] {
  // Domain ID text tracks
  const textObj = { ...textDefaults };
  textObj.fontFamily = 'Menlo';
  textObj.fontSize = renderOptions.fontSize! - 2;
  textObj.top = topPadding - 5;
  const variableSpace = ' '.repeat(40 - domainID.length);
  const spaceText: FabricText = new FabricText(variableSpace, textObj);

  let domain: string = `${domainID}`;
  let domain_full: string = `${variableSpace}${domainID}`;
  if (domain_full.length > 40) {
    domain = (domain_full.slice(0, 38) + '...').slice(variableSpace.length);
  }
  textObj.left = 12 + variableSpace.length * 6;
  textObj.evented = true;
  const hitText: FabricText = new FabricText(domain, textObj);
  return [spaceText, hitText, textObj];
}

// TODO FIXME: fix boxes around the edges of the canvas
export function drawDomains(startPixels: number, endPixels: number, topPadding: number, color: string): Rect {
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
  rectObj.stroke = 'black';
  rectObj.strokeWidth = 0.5;
  return new Rect(rectObj);
}

export function drawDomainInfoTooltips(
  startPixels: number,
  endPixels: number,
  seq_from: number,
  seq_to: number,
  domain: IprMatchFlat,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize! + 1;
  floatTextObj.textAlign = 'left';
  floatTextObj.originX = 'top';
  floatTextObj.originY = 'top';
  floatTextObj.top = 5;
  floatTextObj.left = 10;
  floatTextObj.width = 200;
  let tooltip: string = `Start: ${seq_from}\n` + `End: ${seq_to}\n` + `Database: ${domain.dbname}\n`;
  if (domain.altid !== undefined && domain.altname !== undefined) {
    tooltip +=
      `ID: ${domain.altid}\n` +
      `Name: ${domain.altname}\n` +
      `Type: ${domain.type}\n` +
      `IPR ID: ${domain.id}\n` +
      `IPR Name: ${domain.name}\n`;
  } else {
    tooltip += `ID: ${domain.id}\n` + `Name: ${domain.name}\n` + `Type: ${domain.type}\n`;
  }
  const tooltipText = new Textbox(tooltip, floatTextObj);

  const rectObj = { ...rectDefaults };
  rectObj.fill = 'white';
  rectObj.stroke = 'lightseagreen';
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = 'top';
  rectObj.originY = 'top';
  rectObj.width = tooltipText.width! + 40;
  rectObj.height = tooltipText.height!;
  rectObj.opacity = 0.95;

  const tooltipBox: Rect = new Rect(rectObj);
  const tooltipGroup: Group = new Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: false,
    top: topPadding,
    left: startPixels + endPixels / 2,
  });
  return tooltipGroup;
}

export function drawURLInfoTooltip(
  startPixels: number,
  sequence: string,
  URL: string,
  renderOptions: RenderOptions,
  topPadding: number
): Group {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize! + 1;
  floatTextObj.originX = 'left';
  floatTextObj.originY = 'top';
  floatTextObj.top = 5;
  floatTextObj.left = 5;
  if (sequence.length > 150) {
    sequence = sequence.slice(0, 150) + '...';
  }
  let tooltipText: FabricText;
  if (sequence !== '') {
    const seqLabel = sequence.length * 6.3;
    const urlLabel = URL.length * 6.3;
    if (seqLabel > urlLabel) {
      floatTextObj.width = seqLabel + 5;
    } else {
      floatTextObj.width = urlLabel + 5;
    }
    tooltipText = new FabricText(`${sequence}\n` + `${URL}`, floatTextObj);
  } else {
    const urlLabel = URL.length * 6.3;
    floatTextObj.width = urlLabel + 5;
    tooltipText = new FabricText(`${URL}`, floatTextObj);
  }
  const rectObj = { ...rectDefaults };
  rectObj.fill = 'white';
  rectObj.stroke = 'lightseagreen';
  rectObj.strokeWidth = 0.5;
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = 'left';
  rectObj.originY = 'top';
  rectObj.width = tooltipText.width! + 10;
  rectObj.height = tooltipText.height! + 10;
  rectObj.opacity = 0.95;

  const tooltipBox: Rect = new Rect(rectObj);
  const tooltipGroup: Group = new Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: true,
    top: topPadding,
    originX: 'left',
  });
  tooltipGroup.left = startPixels + 10;
  return tooltipGroup;
}
