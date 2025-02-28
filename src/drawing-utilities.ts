import { fabric } from 'fabric';
import { numberToString } from './other-utilities';
import { SSSResultModel, Hit, Hsp, IprMatchFlat } from './data-model';
import { getTotalPixels, getTextLegendPaddingFactor } from './coords-utilities';
import { colorGenericGradient, colorNcbiBlastGradient, colorQualitativeGradient } from './color-schemes';
import {
  objectDefaults,
  textDefaults,
  lineDefaults,
  rectDefaults,
  RenderOptions,
  CoordsValues,
  ColorSchemeEnum,
  ScaleTypeEnum,
  ScoreTypeEnum,
  TextType,
  RectType,
} from './custom-types';
import { colorByDatabaseName } from './color-utilities';

export function drawHeaderTextGroup(
  dataObj: SSSResultModel,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
  const origTopPadding = topPadding;
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  textObj.left = 5;

  // program & version
  const program = dataObj.program;
  const version = dataObj.version;
  const programText = new fabric.Text(`${program} (version: ${version})`, textObj);
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
  const databaseText = new fabric.Text(`Database(s): ${dbs}`, textObj);
  // Sequence
  topPadding += 15;
  textObj.top = topPadding;
  const sequenceText = new fabric.Text('Sequence: ', textObj);
  // Length
  const length = dataObj.query_len;
  topPadding += 15;
  textObj.top = topPadding;
  const lengthText = new fabric.Text(`Length: ${length}`, textObj);
  // Start
  const start = dataObj.start;
  textObj.top = origTopPadding;
  textObj.left = renderOptions.canvasWidth! - 155;
  const startText = new fabric.Text(`${start}`, textObj);
  // End
  const end = dataObj.end;
  textObj.top = origTopPadding + 15;
  const endText = new fabric.Text(`${end}`, textObj);
  const textGroup = new fabric.Group(
    [programText, databaseText, sequenceText, lengthText, startText, endText],
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
  textSeqObj.fontFamily = 'Menlo';
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
  const queryText = new fabric.Text('Sequence Match', textObj);
  queryText.width = totalQueryPixels;
  textObj.left = coordValues.startEvalPixels;
  let scoreTypeLabel;
  // E-value/ Bits
  if (renderOptions.scoreType === ScoreTypeEnum.identity) {
    scoreTypeLabel = new fabric.Text('Identity', textObj);
  } else if (renderOptions.scoreType === ScoreTypeEnum.similarity) {
    scoreTypeLabel = new fabric.Text('Similarity', textObj);
  } else if (renderOptions.scoreType === ScoreTypeEnum.bitscore) {
    scoreTypeLabel = new fabric.Text('Bit score', textObj);
  } else {
    scoreTypeLabel = new fabric.Text('E-value', textObj);
  }
  scoreTypeLabel.width = renderOptions.contentScoringWidth;
  scoreTypeLabel.textAlign = 'center';
  // Subject Match
  textObj.left = coordValues.startSubjPixels;
  const subjText = new fabric.Text('Subject Match', textObj);
  subjText.width = totalSubjPixels;
  const textGroup = new fabric.Group([queryText, scoreTypeLabel, subjText], objectDefaults);
  return textGroup;
}

export function drawLineTracksQuerySubject(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
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
  const queryLine = new fabric.Line(coordsQuery, lineObj);

  const coordsQueryStartCap: [number, number, number, number] = [
    coordValues.startQueryPixels!,
    topPadding - 3,
    coordValues.startQueryPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);

  const coordsQueryEndCap: [number, number, number, number] = [
    coordValues.endQueryPixels!,
    topPadding - 3,
    coordValues.endQueryPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endQueryPixels;
  const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);

  // Subject
  const coordsSubj: [number, number, number, number] = [
    coordValues.startSubjPixels!,
    topPadding,
    coordValues.endSubjPixels!,
    topPadding,
  ];
  lineObj.top = topPadding;
  lineObj.left = coordValues.startSubjPixels;
  const subjLine = new fabric.Line(coordsSubj, lineObj);

  const coordsSubjStartCap: [number, number, number, number] = [
    coordValues.startSubjPixels!,
    topPadding - 3,
    coordValues.startSubjPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);

  const coordsSubjEndCap: [number, number, number, number] = [
    coordValues.endSubjPixels!,
    topPadding - 3,
    coordValues.endSubjPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endSubjPixels;
  const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);

  // Group
  const lineGroup = new fabric.Group(
    [queryLine, subjLine, queryStartCap, queryEndCap, subjStartCap, subjEndCap],
    objectDefaults
  );
  return lineGroup;
}

export function drawLineTracks(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
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
  const Line = new fabric.Line(coordsQuery, lineObj);

  const coordsStartCap: [number, number, number, number] = [
    coordValues.startPixels!,
    topPadding - 3,
    coordValues.startPixels!,
    topPadding + 3,
  ];
  lineObj.top = topPadding - 2;
  const startCap = new fabric.Line(coordsStartCap, lineObj);

  const coordsEndCap: [number, number, number, number] = [
    coordValues.endPixels!,
    topPadding - 3,
    coordValues.endPixels!,
    topPadding + 3,
  ];
  lineObj.left = coordValues.endPixels;
  const endCap = new fabric.Line(coordsEndCap, lineObj);

  // Group
  const lineGroup = new fabric.Group([Line, startCap, endCap], objectDefaults);
  return lineGroup;
}

export function drawDomainLineTracks(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Line {
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
  return new fabric.Line(coordsQuery, lineObj);
}

export function drawContentFooterTextGroup(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  // Start Query/Subject
  textObj.left = coordValues.startPixels! - 2.5;
  const startText = new fabric.Text(`${coordValues.start}`, textObj);
  // End Query/Subject
  let positionFactor: number = getTextLegendPaddingFactor(`${coordValues.end}`);
  textObj.left = coordValues.endPixels! - positionFactor;
  const endText = new fabric.Text(`${coordValues.end}`, textObj);
  const textGroup = new fabric.Group([startText, endText], objectDefaults);
  return textGroup;
}

export function drawContentQuerySubjFooterTextGroup(
  coordValues: CoordsValues,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding;
  // Start Query
  textObj.left = coordValues.startQueryPixels! - 2.5;
  const startQueryText = new fabric.Text('1', textObj);
  // End Query
  let positionFactor: number = getTextLegendPaddingFactor(`${coordValues.queryLen}`);
  textObj.left = coordValues.endQueryPixels! - positionFactor;
  const endQueryText = new fabric.Text(`${coordValues.queryLen}`, textObj);
  // Start Subject
  textObj.left = coordValues.startSubjPixels! - 2.5;
  const startSubjText = new fabric.Text('1', textObj);
  // End Subject
  positionFactor = getTextLegendPaddingFactor(`${coordValues.subjLen}`);
  textObj.left = coordValues.endSubjPixels! - positionFactor;
  const endSubjText = new fabric.Text(`${coordValues.subjLen}`, textObj);
  const textGroup = new fabric.Group([startQueryText, endQueryText, startSubjText, endSubjText], objectDefaults);
  return textGroup;
}

export function drawNoHitsFoundText(renderOptions: RenderOptions, topPadding: number): fabric.Text {
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth! / 2;
  textObj.fill = 'red';
  const noHitsText = new fabric.Text('--------------------No hits found--------------------', textObj);
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
  textObj.fontFamily = 'Menlo';
  textObj.fontSize = renderOptions.fontSize! - 2;
  textObj.top = topPadding - 2;

  const variableSpace = ' '.repeat(maxIDLen - (hit.hit_db.length + hit.hit_id.length));
  const spaceText: fabric.Text = new fabric.Text(variableSpace, textObj);

  let hit_def: string = `${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  let hit_def_full: string = `${variableSpace}${hit.hit_db}:${hit.hit_id}  ${hit.hit_desc}`;
  if (hit_def_full.length > 40) {
    hit_def = (hit_def_full.slice(0, 38) + '...').slice(variableSpace.length);
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
  textObj.fill = 'red';
  const hspTextNotice = new fabric.Text(
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
): fabric.Text {
  // E-value text tracks
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.top = topPadding - 15;
  textObj.textAlign = 'center';

  textObj.left = startEvalPixels;
  let hspScoreText: fabric.Text;
  if (renderOptions.scoreType === ScoreTypeEnum.bitscore) {
    hspScoreText = new fabric.Text(numberToString(hsp.hsp_bit_score!), textObj);
  } else if (renderOptions.scoreType === ScoreTypeEnum.identity) {
    hspScoreText = new fabric.Text(numberToString(hsp.hsp_identity!), textObj);
  } else if (renderOptions.scoreType === ScoreTypeEnum.similarity) {
    hspScoreText = new fabric.Text(numberToString(hsp.hsp_positive!), textObj);
  } else {
    hspScoreText = new fabric.Text(numberToString(hsp.hsp_expect!), textObj);
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
  floatTextObj.textAlign = 'left';
  floatTextObj.originX = 'top';
  floatTextObj.originY = 'top';
  floatTextObj.top = 5;
  let tooltip: string;
  // if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) {
  //   tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nBit score: ${numberToString(hsp.hsp_bit_score!)}`;
  // } else {
  //   tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nE-value: ${numberToString(hsp.hsp_expect!)}`;
  // }
  tooltip = `Start: ${seq_from}\nEnd: ${seq_to}\nE-value: ${numberToString(
    hsp.hsp_expect!
  )}\nBit score: ${numberToString(hsp.hsp_bit_score!)}\nIdentity: ${numberToString(
    hsp.hsp_identity!
  )}\nSimilarity: ${numberToString(hsp.hsp_positive!)}`;
  const tooltipText = new fabric.Text(tooltip, floatTextObj);
  const rectObj = { ...rectDefaults };
  rectObj.fill = 'white';
  rectObj.stroke = 'lightseagreen';
  rectObj.rx = 5;
  rectObj.ry = 5;
  rectObj.originX = 'top';
  rectObj.originY = 'top';
  rectObj.width = 140;
  rectObj.height = 125;
  rectObj.opacity = 0.95;

  const tooltipBox: fabric.Rect = new fabric.Rect(rectObj);
  const tooltipGroup: fabric.Group = new fabric.Group([tooltipBox, tooltipText], {
    selectable: false,
    evented: false,
    objectCaching: false,
    visible: false,
    top: topPadding,
    left: startHspPixels + endHspPixels / 2,
  });
  return tooltipGroup;
}

export function drawScaleLabelText(renderOptions: RenderOptions, topPadding: number, label: string): fabric.Text {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.fontWeight = 'bold';
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth!;
  const scaleTypeText = new fabric.Text(label, textSelObj);
  return scaleTypeText;
}

export function drawScaleTypeCheckBoxText(
  renderOptions: RenderOptions,
  topPadding: number
): [fabric.Text, fabric.Text, TextType, fabric.Text, fabric.Text, TextType] {
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

  let checkSym: string;
  renderOptions.scaleType === ScaleTypeEnum.dynamic ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scaleType === ScaleTypeEnum.dynamic) textCheckDynObj.fill = 'black';
  textCheckDynObj.left! += 120;
  const dynamicCheckboxText = new fabric.Text(checkSym, textCheckDynObj);
  textSelObj.left! += 140;
  const dynamicText = new fabric.Text('Dynamic (Score: min to max)', textSelObj);

  renderOptions.scaleType! === ScaleTypeEnum.fixed ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scaleType! === ScaleTypeEnum.fixed) textCheckFixObj.fill = 'black';
  textCheckFixObj.left! += 340;
  const fixedCheckboxText = new fabric.Text(checkSym, textCheckFixObj);
  textSelObj.left! += 220;
  let fixedText;
  if (renderOptions.scoreType! === ScoreTypeEnum.bitscore) {
    fixedText = new fabric.Text('Fixed (Bit score: <40 to ≥200)', textSelObj);
  } else if (renderOptions.scoreType! === ScoreTypeEnum.similarity) {
    fixedText = new fabric.Text('Fixed (Similarity: 0.0 to 100.0)', textSelObj);
  } else if (renderOptions.scoreType! === ScoreTypeEnum.identity) {
    fixedText = new fabric.Text('Fixed (Identity: 0.0 to 100.0)', textSelObj);
  } else {
    fixedText = new fabric.Text('Fixed (E-value: 0.0 to 10.0)', textSelObj);
  }
  return [dynamicCheckboxText, dynamicText, textCheckDynObj, fixedCheckboxText, fixedText, textCheckFixObj];
}

export function drawScoreTypeCheckBoxText(
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
  TextType,
  fabric.Text,
  fabric.Text,
  TextType,
] {
  // Score Type selection
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth!;

  const textCheckEvalueObj = { ...textDefaults };
  textCheckEvalueObj.fontSize = renderOptions.fontSize! + 12;
  textCheckEvalueObj.fill = 'grey';
  textCheckEvalueObj.evented = true;
  textCheckEvalueObj.top = topPadding - 8;
  textCheckEvalueObj.left = renderOptions.scaleLabelWidth!;
  const textCheckIdentityObj = { ...textCheckEvalueObj };
  const textCheckSimilarityObj = { ...textCheckEvalueObj };
  const textCheckBitscoreObj = { ...textCheckEvalueObj };

  let checkSym: string;
  renderOptions.scoreType === ScoreTypeEnum.evalue ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scoreType === ScoreTypeEnum.evalue) textCheckEvalueObj.fill = 'black';
  textCheckEvalueObj.left! += 120;
  const evalueCheckboxText = new fabric.Text(checkSym, textCheckEvalueObj);
  textSelObj.left! += 140;
  const evalueText = new fabric.Text('E-value', textSelObj);

  renderOptions.scoreType! === ScoreTypeEnum.identity ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scoreType! === ScoreTypeEnum.identity) textCheckIdentityObj.fill = 'black';
  textCheckIdentityObj.left! += 230;
  const identityCheckboxText = new fabric.Text(checkSym, textCheckIdentityObj);
  textSelObj.left! += 110;
  const identityText = new fabric.Text('Identity', textSelObj);

  renderOptions.scoreType! === ScoreTypeEnum.similarity ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scoreType! === ScoreTypeEnum.similarity) textCheckSimilarityObj.fill = 'black';
  textCheckSimilarityObj.left! += 340;
  const similarityCheckboxText = new fabric.Text(checkSym, textCheckSimilarityObj);
  textSelObj.left! += 110;
  const similarityText = new fabric.Text('Similarity', textSelObj);

  renderOptions.scoreType! === ScoreTypeEnum.bitscore ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.scoreType! === ScoreTypeEnum.bitscore) textCheckBitscoreObj.fill = 'black';
  textCheckBitscoreObj.left! += 460;
  const bitscoreCheckboxText = new fabric.Text(checkSym, textCheckBitscoreObj);
  textSelObj.left! += 120;
  const bitscoreText = new fabric.Text('Bit score', textSelObj);

  return [
    evalueCheckboxText,
    evalueText,
    textCheckEvalueObj,
    identityCheckboxText,
    identityText,
    textCheckIdentityObj,
    similarityCheckboxText,
    similarityText,
    textCheckSimilarityObj,
    bitscoreCheckboxText,
    bitscoreText,
    textCheckBitscoreObj,
  ];
}

export function drawColorSchemeCheckBoxText(
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
  TextType,
  fabric.Text,
  fabric.Text,
  TextType,
  fabric.Text,
  fabric.Text,
  TextType,
  fabric.Text,
  fabric.Text,
  TextType,
] {
  // Score Type selection
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth!;

  const textCheckHeatmapObj = { ...textDefaults };
  textCheckHeatmapObj.fontSize = renderOptions.fontSize! + 12;
  textCheckHeatmapObj.fill = 'grey';
  textCheckHeatmapObj.evented = true;
  textCheckHeatmapObj.top = topPadding - 8;
  textCheckHeatmapObj.left = renderOptions.scaleLabelWidth!;
  const textCheckGreyscaleObj = { ...textCheckHeatmapObj };
  const textCheckSequentialObj = { ...textCheckHeatmapObj };
  const textCheckDivergentObj = { ...textCheckHeatmapObj };
  const textCheckQualitativeObj = { ...textCheckHeatmapObj };
  const textCheckNcbiBlastObj = { ...textCheckHeatmapObj };

  let checkSym: string;
  renderOptions.colorScheme === ColorSchemeEnum.heatmap ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme === ColorSchemeEnum.heatmap) textCheckHeatmapObj.fill = 'black';
  textCheckHeatmapObj.left! += 120;
  const heatmapCheckboxText = new fabric.Text(checkSym, textCheckHeatmapObj);
  textSelObj.left! += 140;
  const heatmapText = new fabric.Text('Heatmap', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.greyscale ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.greyscale) textCheckGreyscaleObj.fill = 'black';
  textCheckGreyscaleObj.left! += 230;
  const greyscaleCheckboxText = new fabric.Text(checkSym, textCheckGreyscaleObj);
  textSelObj.left! += 110;
  const greyscaleText = new fabric.Text('Greyscale', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.sequential ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.sequential) textCheckSequentialObj.fill = 'black';
  textCheckSequentialObj.left! += 340;
  const sequentialCheckboxText = new fabric.Text(checkSym, textCheckSequentialObj);
  textSelObj.left! += 110;
  const sequentialText = new fabric.Text('Sequential', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.divergent ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.divergent) textCheckDivergentObj.fill = 'black';
  textCheckDivergentObj.left! += 460;
  const divergentCheckboxText = new fabric.Text(checkSym, textCheckDivergentObj);
  textSelObj.left! += 120;
  const divergentText = new fabric.Text('Divergent', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.qualitative ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.qualitative) textCheckQualitativeObj.fill = 'black';
  textCheckQualitativeObj.left! += 560;
  const qualitativeCheckboxText = new fabric.Text(checkSym, textCheckQualitativeObj);
  textSelObj.left! += 100;
  const qualitativeText = new fabric.Text('Qualitative', textSelObj);

  renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast ? (checkSym = '☒') : (checkSym = '☐');
  if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) textCheckNcbiBlastObj.fill = 'black';
  textCheckNcbiBlastObj.left! += 660;
  const ncbiblastCheckboxText = new fabric.Text(checkSym, textCheckNcbiBlastObj);
  textSelObj.left! += 100;
  const ncbiblastText = new fabric.Text('NCBI BLAST+', textSelObj);

  return [
    heatmapCheckboxText,
    heatmapText,
    textCheckHeatmapObj,
    greyscaleCheckboxText,
    greyscaleText,
    textCheckGreyscaleObj,
    sequentialCheckboxText,
    sequentialText,
    textCheckSequentialObj,
    divergentCheckboxText,
    divergentText,
    textCheckDivergentObj,
    qualitativeCheckboxText,
    qualitativeText,
    textCheckQualitativeObj,
    ncbiblastCheckboxText,
    ncbiblastText,
    textCheckNcbiBlastObj,
  ];
}

export function drawScaleScoreText(renderOptions: RenderOptions, topPadding: number): fabric.Text {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize! + 1;
  textObj.top = topPadding;
  textObj.textAlign = 'right';
  let scoreTypeLabel: string;
  if (renderOptions.scoreType === ScoreTypeEnum.identity) {
    scoreTypeLabel = 'Identity';
  } else if (renderOptions.scoreType === ScoreTypeEnum.similarity) {
    scoreTypeLabel = 'Similarity';
  } else if (renderOptions.scoreType === ScoreTypeEnum.bitscore) {
    scoreTypeLabel = 'Bit score';
  } else {
    scoreTypeLabel = 'E-value';
  }
  textObj.left = renderOptions.scaleLabelWidth! - 70;
  const scaleScoreText = new fabric.Text(`${scoreTypeLabel}`, textObj);
  return scaleScoreText;
}

export function drawScaleColorGradient(renderOptions: RenderOptions, topPadding: number): fabric.Rect {
  const rectObj = { ...rectDefaults };
  rectObj.top = topPadding;
  rectObj.left = renderOptions.scaleLabelWidth!;
  rectObj.width = renderOptions.scaleWidth!;
  rectObj.height = 15;
  const colorScale = new fabric.Rect(rectObj);
  if (renderOptions.colorScheme! === ColorSchemeEnum.ncbiblast) {
    colorScale.set('fill', colorNcbiBlastGradient(0, renderOptions.scaleWidth!));
  } else if (renderOptions.colorScheme! === ColorSchemeEnum.qualitative) {
    colorScale.set('fill', colorQualitativeGradient(0, renderOptions.scaleWidth!));
  } else {
    colorScale.set('fill', colorGenericGradient(0, renderOptions.scaleWidth!, renderOptions.colorScheme!));
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
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth!;
  const coordsAxis: [number, number, number, number] = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new fabric.Line(coordsAxis, lineObj);

  // Start tick
  const coordsAxisStartTick: [number, number, number, number] = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4,
  ];
  const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);

  // 25% tick
  const coordsAxis25Tick: [number, number, number, number] = [o25GradPixels, topPadding, o25GradPixels, topPadding + 4];
  lineObj.left = o25GradPixels;
  const axis25Tick = new fabric.Line(coordsAxis25Tick, lineObj);

  // 50% tick
  const coordsAxis50Tick: [number, number, number, number] = [o50GradPixels, topPadding, o50GradPixels, topPadding + 4];
  lineObj.left = o50GradPixels;
  const axis50Tick = new fabric.Line(coordsAxis50Tick, lineObj);

  // 75% tick
  const coordsAxis75Tick: [number, number, number, number] = [o75GradPixels, topPadding, o75GradPixels, topPadding + 4];
  lineObj.left = o75GradPixels;
  const axis75Tick = new fabric.Line(coordsAxis75Tick, lineObj);

  // End tick
  const coordsAxisEndTick: [number, number, number, number] = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4,
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);

  // Group
  const axisGroup = new fabric.Group(
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
): fabric.Group {
  // Axis
  const lineObj = { ...lineDefaults };
  lineObj.top = topPadding;
  lineObj.stroke = 'black';
  lineObj.strokeWidth = renderOptions.strokeWidth!;
  const coordsAxis: [number, number, number, number] = [startGradPixels, topPadding, endGradPixels, topPadding];
  lineObj.left = startGradPixels;
  const axisLine = new fabric.Line(coordsAxis, lineObj);

  // Start tick
  const coordsAxisStartTick: [number, number, number, number] = [
    startGradPixels,
    topPadding,
    startGradPixels,
    topPadding + 4,
  ];
  const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);

  // 20% tick
  const coordsAxis20Tick: [number, number, number, number] = [o20GradPixels, topPadding, o20GradPixels, topPadding + 4];
  lineObj.left = o20GradPixels;
  const axis20Tick = new fabric.Line(coordsAxis20Tick, lineObj);

  // 40% tick
  const coordsAxis40Tick: [number, number, number, number] = [o40GradPixels, topPadding, o40GradPixels, topPadding + 4];
  lineObj.left = o40GradPixels;
  const axis40Tick = new fabric.Line(coordsAxis40Tick, lineObj);

  // 60% tick
  const coordsAxis60Tick: [number, number, number, number] = [o60GradPixels, topPadding, o60GradPixels, topPadding + 4];
  lineObj.left = o60GradPixels;
  const axis60Tick = new fabric.Line(coordsAxis60Tick, lineObj);

  // 80% tick
  const coordsAxis80Tick: [number, number, number, number] = [o80GradPixels, topPadding, o80GradPixels, topPadding + 4];
  lineObj.left = o80GradPixels;
  const axis80Tick = new fabric.Line(coordsAxis80Tick, lineObj);

  // End tick
  const coordsAxisEndTick: [number, number, number, number] = [
    endGradPixels,
    topPadding,
    endGradPixels,
    topPadding + 4,
  ];
  lineObj.left = endGradPixels;
  const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);

  // Group
  const axisGroup = new fabric.Group(
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
): fabric.Group {
  const textObj = { ...textDefaults };
  textObj.top = topPadding;
  textObj.fontSize = renderOptions.fontSize!;
  // 20% Tick Label
  let label = `<${numberToString(gradientSteps[1])}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding - label.length * 3 - 72;
  const o20LabelText = new fabric.Text(label, textObj);
  // 40% Tick Label
  label = `${numberToString(gradientSteps[1])} - ${numberToString(gradientSteps[2])}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 2 - label.length * 3 - 72;
  const o40LabelText = new fabric.Text(label, textObj);
  // 60% Tick Label
  label = `${numberToString(gradientSteps[2])} - ${numberToString(gradientSteps[3])}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 3 - label.length * 3 - 72;
  const o60LabelText = new fabric.Text(label, textObj);
  // 60% Tick Label
  label = `${numberToString(gradientSteps[3])} - ${numberToString(gradientSteps[4])}`;
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 4 - label.length * 3 - 72;
  const o80LabelText = new fabric.Text(label, textObj);
  // End Tick Label
  label = `≥${numberToString(gradientSteps[4])}`;
  textObj.left = renderOptions.scaleLabelWidth! + renderOptions.scaleWidth! - label.length * 3 - 72;
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
  textObj.left = renderOptions.scaleLabelWidth! - numberToString(gradientSteps[0]).length * 3;
  const startLabelText = new fabric.Text(numberToString(gradientSteps[0]), textObj);
  // 25% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding - numberToString(gradientSteps[1]).length * 3;
  const o25LabelText = new fabric.Text(numberToString(gradientSteps[1]), textObj);
  // 50% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 2 - numberToString(gradientSteps[2]).length * 3;
  const o50LabelText = new fabric.Text(numberToString(gradientSteps[2]), textObj);
  // 75% Tick Label
  textObj.left = renderOptions.scaleLabelWidth! + leftPadding * 3 - numberToString(gradientSteps[3]).length * 3;
  const o75LabelText = new fabric.Text(numberToString(gradientSteps[3]), textObj);
  // End Tick Label
  textObj.left =
    renderOptions.scaleLabelWidth! + renderOptions.scaleWidth! - numberToString(gradientSteps[4]).length * 3;
  const endLabelText = new fabric.Text(numberToString(gradientSteps[4]), textObj);

  const textGroup = new fabric.Group(
    [startLabelText, o25LabelText, o50LabelText, o75LabelText, endLabelText],
    objectDefaults
  );
  return textGroup;
}

export function drawFooterText(renderOptions: RenderOptions, topPadding: number): [fabric.Text, TextType] {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize;
  textObj.evented = true;
  textObj.top = topPadding;
  textObj.left = 310;
  const copyright = `European Bioinformatics Institute (EMBL-EBI) - `;
  const copyrightText = new fabric.Text(`${copyright}`, textObj);
  return [copyrightText, textObj];
}

export function drawFooterLinkText(
  url: string,
  renderOptions: RenderOptions,
  topPadding: number
): [fabric.Text, TextType] {
  // Sequence
  const textSeqObj = { ...textDefaults };
  textSeqObj.fontSize = renderOptions.fontSize!;
  textSeqObj.evented = true;
  textSeqObj.top = topPadding;
  textSeqObj.left = 593;
  const sequenceDefText = new fabric.Text(`${url}`, textSeqObj);
  return [sequenceDefText, textSeqObj];
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
    stroke: 'lightseagreen',
    fill: 'transparent',
  });
  return canvasWrapper;
}

export function drawContentTitleText(renderOptions: RenderOptions, topPadding: number): fabric.Text {
  const textObj = { ...textDefaults };
  textObj.fontWeight = 'bold';
  textObj.fontSize = renderOptions.fontSize! + 2;
  textObj.top = topPadding;
  textObj.left = 350;
  const title = 'Fast Family and Domain Prediction by InterPro';
  return new fabric.Text(`${title}`, textObj);
}

export function drawContentSupressText(
  renderOptions: RenderOptions,
  topPadding: number,
  numberHits: number
): fabric.Text {
  const textObj = { ...textDefaults };
  textObj.fontSize = renderOptions.fontSize!;
  textObj.top = topPadding;
  textObj.left = renderOptions.contentWidth! / 2;
  textObj.fill = 'red';
  const title = `This is a partial representation of the result, ` + `only the first ${numberHits} hits are displayed!`;
  return new fabric.Text(`${title}`, textObj);
}

export function drawProteinFeaturesText(renderOptions: RenderOptions, topPadding: number): fabric.Text {
  const textSelObj = { ...textDefaults };
  textSelObj.fontSize = renderOptions.fontSize! + 1;
  textSelObj.fontWeight = 'bold';
  textSelObj.top = topPadding;
  textSelObj.left = renderOptions.scaleLabelWidth! - 5;
  const scaleTypeText = new fabric.Text('Select your database:', textSelObj);
  return scaleTypeText;
}

export function drawDomainCheckbox(
  renderOptions: RenderOptions,
  topPadding: number,
  leftPadding: number,
  currentDomainDatabase: string
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

  const proteinFeatureRect = new fabric.Rect(rectObj);
  const proteinFeatureText = new fabric.Text(currentDomainDatabase, textObj);
  return [proteinFeatureRect, proteinFeatureText, rectObj, rectObj];
}

export function drawHitTransparentBox(
  startPixels: number,
  endPixels: number,
  topPadding: number,
  fill: string,
  height: number
): fabric.Rect {
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

export function drawContentDomainInfoText(
  domainID: string,
  renderOptions: RenderOptions,
  topPadding: number
): [fabric.Text, fabric.Text, TextType] {
  // Domain ID text tracks
  const textObj = { ...textDefaults };
  textObj.fontFamily = 'Menlo';
  textObj.fontSize = renderOptions.fontSize! - 2;
  textObj.top = topPadding - 5;
  const variableSpace = ' '.repeat(40 - domainID.length);
  const spaceText: fabric.Text = new fabric.Text(variableSpace, textObj);

  let domain: string = `${domainID}`;
  let domain_full: string = `${variableSpace}${domainID}`;
  if (domain_full.length > 40) {
    domain = (domain_full.slice(0, 38) + '...').slice(variableSpace.length);
  }
  textObj.left = 12 + variableSpace.length * 7.25;
  textObj.evented = true;
  const hitText: fabric.Text = new fabric.Text(domain, textObj);
  return [spaceText, hitText, textObj];
}

// TODO FIXME: fix boxes around the edges of the canvas
export function drawDomains(startPixels: number, endPixels: number, topPadding: number, color: string): fabric.Rect {
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
  return new fabric.Rect(rectObj);
}

export function drawDomainInfoTooltips(
  startPixels: number,
  endPixels: number,
  seq_from: number,
  seq_to: number,
  domain: IprMatchFlat,
  renderOptions: RenderOptions,
  topPadding: number
): fabric.Group {
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
  const tooltipText = new fabric.Textbox(tooltip, floatTextObj);

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

  const tooltipBox: fabric.Rect = new fabric.Rect(rectObj);
  const tooltipGroup: fabric.Group = new fabric.Group([tooltipBox, tooltipText], {
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
): fabric.Group {
  const floatTextObj = { ...textDefaults };
  floatTextObj.fontSize = renderOptions.fontSize! + 1;
  floatTextObj.originX = 'left';
  floatTextObj.originY = 'top';
  floatTextObj.top = 5;
  floatTextObj.left = 5;
  if (sequence.length > 150) {
    sequence = sequence.slice(0, 150) + '...';
  }
  let tooltipText: fabric.Text;
  if (sequence !== '') {
    const seqLabel = sequence.length * 6.3;
    const urlLabel = URL.length * 6.3;
    if (seqLabel > urlLabel) {
      floatTextObj.width = seqLabel + 5;
    } else {
      floatTextObj.width = urlLabel + 5;
    }
    tooltipText = new fabric.Text(`${sequence}\n` + `${URL}`, floatTextObj);
  } else {
    const urlLabel = URL.length * 6.3;
    floatTextObj.width = urlLabel + 5;
    tooltipText = new fabric.Text(`${URL}`, floatTextObj);
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

  const tooltipBox: fabric.Rect = new fabric.Rect(rectObj);
  const tooltipGroup: fabric.Group = new fabric.Group([tooltipBox, tooltipText], {
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
