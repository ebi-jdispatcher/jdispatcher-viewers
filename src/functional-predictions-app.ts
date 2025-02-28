import { fabric } from 'fabric';
import { SSSResultModel, IPRMCResultModelFlat } from './data-model';
import { getPixelCoords, getDomainPixelCoords } from './coords-utilities';
import {
  getGradientSteps,
  getRgbColorFixed,
  getRgbColorLogGradient,
  getRgbColorLinearGradient,
  colorByDatabaseName,
} from './color-utilities';
import {
  BasicCanvasRenderer,
  ObjectCache,
  getUniqueIPRMCDomainDatabases,
  domainDatabaseNameToString,
  getDomainURLbyDatabase,
} from './other-utilities';
import { RenderOptions, ColorSchemeEnum, ScaleTypeEnum, ScoreTypeEnum, TextType, RectType } from './custom-types';
import {
  mouseDownLink,
  mouseClickDomain,
  mouseOverText,
  mouseOutText,
  mouseOverCheckbox,
  mouseDownCheckbox,
  mouseOutCheckbox,
  mouseOverDomainCheckbox,
  mouseDownDomainCheckbox,
  mouseOutDomainCheckbox,
  mouseOverDomain,
  mouseOutDomain,
} from './custom-events';
import {
  drawHeaderTextGroup,
  drawFooterLinkText,
  drawHeaderLinkText,
  drawNoHitsFoundText,
  drawScaleLabelText,
  drawScaleScoreText,
  drawScaleColorGradient,
  drawLineAxis5Buckets,
  drawLineAxis6Buckets,
  drawScaleTick5LabelsGroup,
  drawScaleTick4LabelsGroup,
  drawFooterText,
  drawCanvasWrapperStroke,
  drawColorSchemeCheckBoxText,
  drawScaleTypeCheckBoxText,
  drawScoreTypeCheckBoxText,
  drawContentTitleText,
  drawContentSupressText,
  drawProteinFeaturesText,
  drawDomainCheckbox,
  drawLineTracks,
  drawContentFooterTextGroup,
  drawContentSequenceInfoText,
  drawDomainLineTracks,
  drawHitTransparentBox,
  drawContentDomainInfoText,
  drawDomains,
} from './drawing-utilities';

const defaultDomainDatabaseList = [
  'PRODOM',
  'CATH-Gene3D',
  'CDD',
  'PANTHER',
  'HAMAP',
  'Pfam',
  'PIRSF',
  'PRINTS',
  'PROSITE profiles',
  'PROSITE patterns',
  'SFLD',
  'SMART',
  'SUPERFAMILY',
  'TIGRFAMs',
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
  if (!renderOptions.staticCanvas) {
    mouseOverDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseOutDomainCheckbox(rect, rectObj, currentDomainDatabase, _this);
    mouseDownDomainCheckbox(rect, currentDomainDatabase, _this);
  }
}

let objCache = new ObjectCache();

export class FunctionalPredictions extends BasicCanvasRenderer {
  private topPadding: number = 0;
  private queryStart: number = 0;
  private queryEnd: number = 0;
  private startPixels: number;
  private endPixels: number;
  private gradientSteps: number[] = [];
  public currentDomainDatabase: string | undefined;
  public uniqueDomainDatabases: string[] = [];
  public currentDomainDatabaseDisabled: boolean = false;

  constructor(
    element: string | HTMLCanvasElement,
    private sssDataObj: SSSResultModel,
    private iprmcDataObj: IPRMCResultModelFlat,
    renderOptions: RenderOptions,
    public domainDatabaseList: string[] = defaultDomainDatabaseList
  ) {
    super(element);

    renderOptions.canvasWidth != undefined ? (this.canvasWidth = renderOptions.canvasWidth) : (this.canvasWidth = 1200);
    renderOptions.canvasHeight != undefined
      ? (this.canvasHeight = renderOptions.canvasHeight)
      : (this.canvasHeight = 110);
    renderOptions.contentWidth != undefined
      ? (this.contentWidth = renderOptions.contentWidth)
      : (this.contentWidth = (72.5 * this.canvasWidth) / 100);
    renderOptions.contentLabelWidth != undefined
      ? (this.contentLabelWidth = renderOptions.contentLabelWidth)
      : (this.contentLabelWidth = (26.5 * this.canvasWidth) / 100);
    renderOptions.contentLabelLeftWidth != undefined
      ? (this.contentLabelLeftWidth = renderOptions.contentLabelLeftWidth)
      : (this.contentLabelLeftWidth = (8.25 * this.canvasWidth) / 100);
    renderOptions.scaleWidth != undefined
      ? (this.scaleWidth = renderOptions.scaleWidth)
      : (this.scaleWidth = (75 * this.canvasWidth) / 100);
    renderOptions.scaleLabelWidth != undefined
      ? (this.scaleLabelWidth = renderOptions.scaleLabelWidth)
      : (this.scaleLabelWidth = (15 * this.canvasWidth) / 100);
    renderOptions.marginWidth != undefined
      ? (this.marginWidth = renderOptions.marginWidth)
      : (this.marginWidth = (0.15 * this.canvasWidth) / 100);
    renderOptions.colorScheme != undefined
      ? (this.colorScheme = renderOptions.colorScheme)
      : (this.colorScheme = ColorSchemeEnum.heatmap);
    renderOptions.numberHits != undefined ? (this.numberHits = renderOptions.numberHits) : (this.numberHits = 30);
    renderOptions.fontSize != undefined ? (this.fontSize = renderOptions.fontSize) : (this.fontSize = 14);
    renderOptions.fontWeigth != undefined ? (this.fontWeigth = renderOptions.fontWeigth) : (this.fontWeigth = 'normal');
    renderOptions.fontFamily != undefined ? (this.fontFamily = renderOptions.fontFamily) : (this.fontFamily = 'Arial');
    renderOptions.canvasWrapperStroke != undefined
      ? (this.canvasWrapperStroke = renderOptions.canvasWrapperStroke)
      : (this.canvasWrapperStroke = false);
    renderOptions.staticCanvas != undefined
      ? (this.staticCanvas = renderOptions.staticCanvas)
      : (this.staticCanvas = false);

    this.getFabricCanvas();
  }

  public render() {
    this.loadIPRMCProperties();
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

  private loadInitalProperties() {
    this.queryStart = 1;
    this.queryEnd = this.sssDataObj.query_len;
  }

  private loadInitialCoords() {
    this.startPixels = objCache.get('startPixels') as number;
    this.endPixels = objCache.get('endPixels') as number;
    if (!this.startPixels && !this.endPixels) {
      [this.startPixels, this.endPixels] = getPixelCoords(this.contentWidth, this.contentLabelWidth, this.marginWidth);
      objCache.put('startPixels', this.startPixels);
      objCache.put('endPixels', this.endPixels);
    }
  }

  private loadIPRMCProperties() {
    if (this.sssDataObj != undefined) {
      // disable domain checkboxes that have no predictions
      this.uniqueDomainDatabases = objCache.get('uniqueDomainDatabases') as string[];
      if (!this.uniqueDomainDatabases) {
        let proteinIdList: string[] = [];
        for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
          proteinIdList.push(hit.hit_acc);
        }
        this.uniqueDomainDatabases = getUniqueIPRMCDomainDatabases(this.iprmcDataObj, proteinIdList);
        objCache.put('uniqueDomainDatabases', this.uniqueDomainDatabases);
      }
      // remove domainDatabases not in the set of unique domainDatabases
      for (const db of this.domainDatabaseList) {
        if (!this.uniqueDomainDatabases.includes(domainDatabaseNameToString(db))) {
          const indx = this.domainDatabaseList.indexOf(db);
          if (indx > -1) {
            this.domainDatabaseList.splice(indx, 1);
          }
        }
      }
    }
  }

  private drawHeaderGroup() {
    // canvas header
    this.topPadding = 2;
    let textHeaderGroup: fabric.Object;
    textHeaderGroup = objCache.get('textHeaderGroup') as fabric.Object;
    if (!textHeaderGroup) {
      textHeaderGroup = drawHeaderTextGroup(
        this.sssDataObj,
        {
          fontSize: this.fontSize,
          canvasWidth: this.canvasWidth,
        },
        this.topPadding
      );
      objCache.put('textHeaderGroup', textHeaderGroup);
    }
    this.canvas.add(textHeaderGroup);

    // canvas header (sequence info)
    this.topPadding += 45;
    let textHeaderLink: fabric.Text;
    let textSeqObj: TextType;
    textHeaderLink = objCache.get('textHeaderLink') as fabric.Text;
    textSeqObj = objCache.get('textHeaderLink_textSeqObj') as TextType;
    if (!textHeaderLink) {
      [textHeaderLink, textSeqObj] = drawHeaderLinkText(this.sssDataObj, { fontSize: this.fontSize }, this.topPadding);
      objCache.put('textHeaderLink', textHeaderLink);
      objCache.put('textHeaderLink_textSeqObj', textSeqObj);
    }
    this.canvas.add(textHeaderLink);
    if (!this.staticCanvas) {
      if (this.sssDataObj.query_url != null && this.sssDataObj.query_url !== '') {
        mouseOverText(
          textHeaderLink,
          textSeqObj,
          this.sssDataObj.query_def,
          this.sssDataObj.query_url,
          { fontSize: this.fontSize },
          this
        );
        mouseDownLink(textHeaderLink, this.sssDataObj.query_url, this);
        mouseOutText(textHeaderLink, textSeqObj, this);
      }
    }
  }

  private drawContentGroup() {
    // canvas content title
    this.topPadding += 25;
    let titleText: fabric.Text;
    titleText = objCache.get('titleText') as fabric.Text;
    if (!titleText) {
      titleText = drawContentTitleText(
        {
          fontSize: this.fontSize + 1,
        },
        this.topPadding
      );
      objCache.put('titleText', titleText);
    }
    this.canvas.add(titleText);

    // canvas dynamic content
    if (this.sssDataObj.hits.length > 0) {
      // domain selection
      this.topPadding += 35;
      this.drawPredictionsGroup();

      // dynamic content
      this.topPadding += 50;
      this.drawDynamicContentGroup();

      // color scale
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

  private drawPredictionsGroup() {
    // Protein Features - Database Selection
    let pfLabelText: fabric.Text;
    pfLabelText = objCache.get('pfLabelText') as fabric.Text;
    if (!pfLabelText) {
      pfLabelText = drawProteinFeaturesText(
        {
          fontSize: this.fontSize,
          scaleLabelWidth: this.scaleLabelWidth - 50,
        },
        this.topPadding
      );
      objCache.put('pfLabelText', pfLabelText);
    }
    this.canvas.add(pfLabelText);

    // display the domain checkboxes
    createDomainCheckbox(this, 'Pfam', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 190, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(
      this,
      'SUPERFAMILY',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 260,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, 'SMART', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 390, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(this, 'HAMAP', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 480, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(
      this,
      'PANTHER',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 570,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      'PRODOM',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 680,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      'PROSITE profiles',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 770,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    this.topPadding += 30;
    createDomainCheckbox(this, 'CDD', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 190, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(
      this,
      'CATH-Gene3D',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 260,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, 'PIRSF', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 390, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(
      this,
      'PRINTS',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 480,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(
      this,
      'TIGRFAMs',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 570,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
    createDomainCheckbox(this, 'SFLD', this.uniqueDomainDatabases, this.topPadding, this.contentLabelLeftWidth + 680, {
      fontSize: this.fontSize,
      staticCanvas: this.staticCanvas,
    });
    createDomainCheckbox(
      this,
      'PROSITE patterns',
      this.uniqueDomainDatabases,
      this.topPadding,
      this.contentLabelLeftWidth + 770,
      { fontSize: this.fontSize, staticCanvas: this.staticCanvas }
    );
  }

  private drawDynamicContentGroup() {
    // draw a new track group per hit
    // only display 30 hits by default
    // draw only one HSP per hit
    let maxIDLen: number = 0;
    for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_db.length + hit.hit_id.length > maxIDLen) maxIDLen = hit.hit_db.length + hit.hit_id.length;
    }
    let minScore: number = Number.MAX_VALUE;
    let maxScore: number = 0;
    let minNotZeroScore: number = Number.MAX_VALUE;
    for (const hit of this.sssDataObj.hits.slice(0, this.numberHits)) {
      for (const hsp of hit.hit_hsps) {
        if (this.scoreType === ScoreTypeEnum.bitscore) {
          if (hsp.hsp_bit_score! < minScore) minScore = hsp.hsp_bit_score!;
          if (hsp.hsp_bit_score! > maxScore) maxScore = hsp.hsp_bit_score!;
          if (hsp.hsp_bit_score! < minNotZeroScore && hsp.hsp_bit_score! > 0.0) minNotZeroScore = hsp.hsp_bit_score!;
        } else if (this.scoreType === ScoreTypeEnum.identity) {
          if (hsp.hsp_identity! < minScore) minScore = hsp.hsp_identity!;
          if (hsp.hsp_identity! > maxScore) maxScore = hsp.hsp_identity!;
          if (hsp.hsp_identity! < minNotZeroScore && hsp.hsp_identity! > 0.0) minNotZeroScore = hsp.hsp_identity!;
        } else if (this.scoreType === ScoreTypeEnum.similarity) {
          if (hsp.hsp_positive! < minScore) minScore = hsp.hsp_positive!;
          if (hsp.hsp_positive! > maxScore) maxScore = hsp.hsp_positive!;
          if (hsp.hsp_positive! < minNotZeroScore && hsp.hsp_positive! > 0.0) minNotZeroScore = hsp.hsp_positive!;
        } else {
          if (hsp.hsp_expect! < minScore) minScore = hsp.hsp_expect!;
          if (hsp.hsp_expect! > maxScore) maxScore = hsp.hsp_expect!;
          if (hsp.hsp_expect! < minNotZeroScore && hsp.hsp_expect! > 0.0) minNotZeroScore = hsp.hsp_expect!;
        }
      }
    }

    this.gradientSteps = getGradientSteps(
      minScore,
      maxScore,
      minNotZeroScore,
      this.scaleType,
      this.scoreType,
      this.colorScheme
    );

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
        if (!this.staticCanvas) {
          mouseOverText(hitText, textObj, hit.hit_def, hit.hit_url, { fontSize: this.fontSize }, this);
          mouseDownLink(hitText, hit.hit_url, this);
          mouseOutText(hitText, textObj, this);
        }

        // domain line tracks
        const lineTrackGroup = drawLineTracks(
          {
            startPixels: this.startPixels,
            endPixels: this.endPixels,
          },
          { strokeWidth: 1 },
          this.topPadding
        );
        this.canvas.add(lineTrackGroup);

        // domain line tracks - legends
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
        this.topPadding += 15;

        // hit (1st HSP) transparent domain
        let boxColor: string = 'white';
        let hspStart = 0;
        let hspEnd = 0;
        for (const hsp of hit.hit_hsps) {
          if (hsp.hsp_hit_frame! === '-1') {
            hspStart = hsp.hsp_hit_to;
            hspEnd = hsp.hsp_hit_from;
          } else {
            hspStart = hsp.hsp_hit_from;
            hspEnd = hsp.hsp_hit_to;
          }
          let score: number;
          if (this.scoreType === ScoreTypeEnum.bitscore) {
            score = hsp.hsp_bit_score!;
          } else if (this.scoreType === ScoreTypeEnum.identity) {
            score = hsp.hsp_identity!;
          } else if (this.scoreType === ScoreTypeEnum.similarity) {
            score = hsp.hsp_positive!;
          } else {
            score = hsp.hsp_expect!;
          }
          if (this.colorScheme === ColorSchemeEnum.qualitative || this.colorScheme === ColorSchemeEnum.ncbiblast) {
            boxColor = getRgbColorFixed(score, this.gradientSteps, this.colorScheme);
          } else {
            if (this.scoreType === ScoreTypeEnum.evalue && this.colorScheme === ColorSchemeEnum.heatmap) {
              boxColor = getRgbColorLogGradient(score, this.gradientSteps, this.colorScheme);
            } else {
              boxColor = getRgbColorLinearGradient(score, this.gradientSteps, this.colorScheme);
            }
          }
          break;
        }
        let startDomainPixels: number = 0;
        let endDomainPixels: number = 0;
        [startDomainPixels, endDomainPixels] = getDomainPixelCoords(
          this.startPixels,
          this.endPixels,
          hit.hit_len,
          hspStart,
          hspEnd,
          this.marginWidth
        );

        // unique domain predictions && selected domain Databases
        let boxHeight = 0;
        let tmpTopPadding = this.topPadding - 15;
        if (hit.hit_acc in this.iprmcDataObj) {
          if (this.iprmcDataObj[hit.hit_acc]['matches'] !== undefined) {
            for (const did of this.iprmcDataObj[hit.hit_acc]['matches']) {
              const domain = domainDatabaseNameToString(
                this.iprmcDataObj[hit.hit_acc]['match'][did][0]['dbname'] as string
              );
              if (this.domainDatabaseList.includes(domain)) {
                this.topPadding += 15;
                boxHeight += 15;
                // domain dashed-line tracks
                let dashedLineTrackGroup = drawDomainLineTracks(
                  {
                    startPixels: this.startPixels,
                    endPixels: this.endPixels,
                  },
                  { strokeWidth: 1, strokeDashArray: [1, 5] },
                  this.topPadding
                );
                this.canvas.add(dashedLineTrackGroup);
                dashedLineTrackGroup.sendToBack();

                // draw domain ID text
                let textObj: TextType;
                let spaceText, hitText: fabric.Text;
                [spaceText, hitText, textObj] = drawContentDomainInfoText(
                  did.split('_')[1] + ' ►',
                  { fontSize: this.fontSize },
                  this.topPadding
                );
                this.canvas.add(spaceText);
                this.canvas.add(hitText);
                // Domain URL mapping
                const domainURL = getDomainURLbyDatabase(did.split('_')[1], domain);
                if (!this.staticCanvas) {
                  mouseOverText(hitText, textObj, '', domainURL, { fontSize: this.fontSize }, this);
                  mouseDownLink(hitText, domainURL, this);
                  mouseOutText(hitText, textObj, this);
                }

                // draw domain Predictions (loop over each prediction)
                for (const dp of this.iprmcDataObj[hit.hit_acc]['match'][did]) {
                  // domain coordinates
                  let domainStart = dp.start as number;
                  let domainEnd = dp.end as number;
                  let startDomainPixels: number = 0;
                  let endDomainPixels: number = 0;
                  [startDomainPixels, endDomainPixels] = getDomainPixelCoords(
                    this.startPixels,
                    this.endPixels,
                    hit.hit_len,
                    domainStart,
                    domainEnd,
                    this.marginWidth
                  );

                  // domain predictions
                  const dpDomain = drawDomains(
                    startDomainPixels,
                    endDomainPixels,
                    this.topPadding + 10,
                    colorByDatabaseName(dp.dbname as string)
                  );
                  this.canvas.add(dpDomain);
                  // Domain hovering and tooltip
                  if (!this.staticCanvas) {
                    mouseOverDomain(
                      dpDomain,
                      startDomainPixels,
                      endDomainPixels,
                      domainStart,
                      domainEnd,
                      dp,
                      {
                        fontSize: this.fontSize,
                      },
                      this
                    );
                    mouseOutDomain(dpDomain, this);

                    // Mouse click display/hide domain tooltip
                    mouseClickDomain(
                      dpDomain,
                      startDomainPixels,
                      endDomainPixels,
                      domainStart,
                      domainEnd,
                      dp,
                      {
                        fontSize: this.fontSize,
                      },
                      this
                    );
                  }
                }
              }
            }
          }
        }
        // draw domain transparent box
        boxHeight += 15;
        const hitTransparentBox = drawHitTransparentBox(
          startDomainPixels,
          endDomainPixels,
          tmpTopPadding,
          boxColor,
          boxHeight
        );
        this.canvas.add(hitTransparentBox);
        hitTransparentBox.sendToBack();

        // final padding
        this.topPadding += 40;
      } else {
        // canvas content suppressed output
        let supressText: fabric.Text;
        supressText = objCache.get('supressText') as fabric.Text;
        if (!supressText) {
          supressText = drawContentSupressText(
            {
              fontSize: this.fontSize,
              contentWidth: this.contentWidth,
            },
            this.topPadding,
            this.numberHits
          );
          objCache.put('supressText', supressText);
        }
        supressText.top = this.topPadding;
        this.canvas.add(supressText);
        this.topPadding += 40;
        break;
      }
    }
  }

  private drawColorScaleGroup() {
    // Scale Type
    const scaleTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
      },
      this.topPadding,
      'Scale Type:'
    );
    this.canvas.add(scaleTypeText);

    // Scale Type selection: dynamic and static
    let textCheckDynObj, textCheckFixObj: TextType;
    let dynamicBoxText, dynamicText, fixedBoxText, fixedText: fabric.Text;

    [dynamicBoxText, dynamicText, textCheckDynObj, fixedBoxText, fixedText, textCheckFixObj] =
      drawScaleTypeCheckBoxText(
        {
          scaleType: this.scaleType,
          scoreType: this.scoreType,
          fontSize: this.fontSize,
          scaleLabelWidth: this.scaleLabelWidth,
        },
        this.topPadding
      );
    this.canvas.add(dynamicBoxText);
    this.canvas.add(dynamicText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(dynamicBoxText, textCheckDynObj, this);
      mouseOutCheckbox(dynamicBoxText, textCheckDynObj, ScaleTypeEnum.dynamic, 'ScaleTypeEnum', this);
      mouseDownCheckbox(dynamicBoxText, ScaleTypeEnum.dynamic, 'ScaleTypeEnum', this);
    }

    this.canvas.add(fixedBoxText);
    this.canvas.add(fixedText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(fixedBoxText, textCheckFixObj, this);
      mouseOutCheckbox(fixedBoxText, textCheckFixObj, ScaleTypeEnum.fixed, 'ScaleTypeEnum', this);
      mouseDownCheckbox(fixedBoxText, ScaleTypeEnum.fixed, 'ScaleTypeEnum', this);
    }

    // Score Type: e-value, identity, similarity, bit-score
    this.topPadding += 20;
    const scoreTypeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
      },
      this.topPadding,
      'Score Used:'
    );
    this.canvas.add(scoreTypeText);
    let textCheckEvalueObj, textCheckIdentityObj, textCheckSimilarityObj, textCheckBitscoreObj: TextType;
    let evalueBoxText,
      evalueText,
      identityBoxText,
      identityText,
      similarityBoxText,
      similarityText,
      bitscoreBoxText,
      bitscoreText: fabric.Text;

    [
      evalueBoxText,
      evalueText,
      textCheckEvalueObj,
      identityBoxText,
      identityText,
      textCheckIdentityObj,
      similarityBoxText,
      similarityText,
      textCheckSimilarityObj,
      bitscoreBoxText,
      bitscoreText,
      textCheckBitscoreObj,
    ] = drawScoreTypeCheckBoxText(
      {
        scoreType: this.scoreType,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
      },
      this.topPadding
    );
    this.canvas.add(evalueBoxText);
    this.canvas.add(evalueText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(evalueBoxText, textCheckEvalueObj, this);
      mouseOutCheckbox(evalueBoxText, textCheckEvalueObj, ScoreTypeEnum.evalue, 'ScoreTypeEnum', this);
      mouseDownCheckbox(evalueBoxText, ScoreTypeEnum.evalue, 'ScoreTypeEnum', this);
    }

    this.canvas.add(identityBoxText);
    this.canvas.add(identityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(identityBoxText, textCheckIdentityObj, this);
      mouseOutCheckbox(identityBoxText, textCheckIdentityObj, ScoreTypeEnum.identity, 'ScoreTypeEnum', this);
      mouseDownCheckbox(identityBoxText, ScoreTypeEnum.identity, 'ScoreTypeEnum', this);
    }

    this.canvas.add(similarityBoxText);
    this.canvas.add(similarityText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(similarityBoxText, textCheckSimilarityObj, this);
      mouseOutCheckbox(similarityBoxText, textCheckSimilarityObj, ScoreTypeEnum.similarity, 'ScoreTypeEnum', this);
      mouseDownCheckbox(similarityBoxText, ScoreTypeEnum.similarity, 'ScoreTypeEnum', this);
    }

    this.canvas.add(bitscoreBoxText);
    this.canvas.add(bitscoreText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(bitscoreBoxText, textCheckBitscoreObj, this);
      mouseOutCheckbox(bitscoreBoxText, textCheckBitscoreObj, ScoreTypeEnum.bitscore, 'ScoreTypeEnum', this);
      mouseDownCheckbox(bitscoreBoxText, ScoreTypeEnum.bitscore, 'ScoreTypeEnum', this);
    }

    // Color Scheme: Heatmap, NCBI-BLAST+, Greys, Blues, YellowBlue, YellowRed
    this.topPadding += 20;
    const colorSchemeText = drawScaleLabelText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
      },
      this.topPadding,
      'Color Scheme:'
    );
    this.canvas.add(colorSchemeText);
    let textCheckHeatmapObj,
      textCheckGreyscaleObj,
      textCheckSequentialObj,
      textCheckDivergentObj,
      textCheckQualitativeObj,
      textCheckNcbiBlastObj: TextType;
    let heatmapBoxText,
      heatmapText,
      greyscaleBoxText,
      greyscaleText,
      sequentialBoxText,
      sequentialText,
      divergentBoxText,
      divergentText,
      qualitativeBoxText,
      qualitativeText,
      ncbiblastBoxText,
      ncbiblastText: fabric.Text;

    [
      heatmapBoxText,
      heatmapText,
      textCheckHeatmapObj,
      greyscaleBoxText,
      greyscaleText,
      textCheckGreyscaleObj,
      sequentialBoxText,
      sequentialText,
      textCheckSequentialObj,
      divergentBoxText,
      divergentText,
      textCheckDivergentObj,
      qualitativeBoxText,
      qualitativeText,
      textCheckQualitativeObj,
      ncbiblastBoxText,
      ncbiblastText,
      textCheckNcbiBlastObj,
    ] = drawColorSchemeCheckBoxText(
      {
        colorScheme: this.colorScheme,
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
      },
      this.topPadding
    );
    this.canvas.add(heatmapBoxText);
    this.canvas.add(heatmapText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(heatmapBoxText, textCheckHeatmapObj, this);
      mouseOutCheckbox(heatmapBoxText, textCheckHeatmapObj, ColorSchemeEnum.heatmap, 'ColorSchemeEnum', this);
      mouseDownCheckbox(heatmapBoxText, ColorSchemeEnum.heatmap, 'ColorSchemeEnum', this);
    }

    this.canvas.add(greyscaleBoxText);
    this.canvas.add(greyscaleText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(greyscaleBoxText, textCheckGreyscaleObj, this);
      mouseOutCheckbox(greyscaleBoxText, textCheckGreyscaleObj, ColorSchemeEnum.greyscale, 'ColorSchemeEnum', this);
      mouseDownCheckbox(greyscaleBoxText, ColorSchemeEnum.greyscale, 'ColorSchemeEnum', this);
    }

    this.canvas.add(sequentialBoxText);
    this.canvas.add(sequentialText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(sequentialBoxText, textCheckSequentialObj, this);
      mouseOutCheckbox(sequentialBoxText, textCheckSequentialObj, ColorSchemeEnum.sequential, 'ColorSchemeEnum', this);
      mouseDownCheckbox(sequentialBoxText, ColorSchemeEnum.sequential, 'ColorSchemeEnum', this);
    }

    this.canvas.add(divergentBoxText);
    this.canvas.add(divergentText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(divergentBoxText, textCheckDivergentObj, this);
      mouseOutCheckbox(divergentBoxText, textCheckDivergentObj, ColorSchemeEnum.divergent, 'ColorSchemeEnum', this);
      mouseDownCheckbox(divergentBoxText, ColorSchemeEnum.divergent, 'ColorSchemeEnum', this);
    }

    this.canvas.add(qualitativeBoxText);
    this.canvas.add(qualitativeText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(qualitativeBoxText, textCheckQualitativeObj, this);
      mouseOutCheckbox(
        qualitativeBoxText,
        textCheckQualitativeObj,
        ColorSchemeEnum.qualitative,
        'ColorSchemeEnum',
        this
      );
      mouseDownCheckbox(qualitativeBoxText, ColorSchemeEnum.qualitative, 'ColorSchemeEnum', this);
    }

    this.canvas.add(ncbiblastBoxText);
    this.canvas.add(ncbiblastText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, this);
      mouseOutCheckbox(ncbiblastBoxText, textCheckNcbiBlastObj, ColorSchemeEnum.ncbiblast, 'ColorSchemeEnum', this);
      mouseDownCheckbox(ncbiblastBoxText, ColorSchemeEnum.ncbiblast, 'ColorSchemeEnum', this);
    }

    // Score Text
    this.topPadding += 25;
    const scaleScoreText = drawScaleScoreText(
      {
        fontSize: this.fontSize,
        scaleLabelWidth: this.scaleLabelWidth,
        scoreType: this.scoreType,
      },
      this.topPadding
    );
    this.canvas.add(scaleScoreText);

    // Color Gradient
    const colorScale = drawScaleColorGradient(
      {
        scaleWidth: this.scaleWidth,
        scaleLabelWidth: this.scaleLabelWidth,
        colorScheme: this.colorScheme,
      },
      this.topPadding
    );
    this.canvas.add(colorScale);

    // Score Axis (line and ticks)
    if (this.colorScheme === ColorSchemeEnum.ncbiblast || this.colorScheme === ColorSchemeEnum.qualitative) {
      const oneFifthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 5;
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

      // scale tick mark labels
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
      const oneForthGradPixels = (this.scaleLabelWidth + this.scaleWidth - this.scaleLabelWidth) / 4;
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

      // scale tick mark labels
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
    copyrightText = objCache.get('copyrightText') as fabric.Text;
    textFooterObj = objCache.get('copyrightText_textFooterObj') as TextType;
    if (!copyrightText && !textFooterObj) {
      [copyrightText, textFooterObj] = drawFooterText(
        {
          fontSize: this.fontSize,
        },
        this.topPadding
      );
      objCache.put('copyrightText', copyrightText);
      objCache.put('copyrightText_textFooterObj', textFooterObj);
    }
    this.canvas.add(copyrightText);

    // canvas footer (repo info)
    let textFooterLink: fabric.Text;
    let textFooterLinkObj: TextType;
    textFooterLink = objCache.get('textFooterLink') as fabric.Text;
    textFooterLinkObj = objCache.get('textFooterLink_textSeqObj') as TextType;
    const footerLink: string = 'https://github.com/ebi-jdispatcher/jdispatcher-viewers';
    if (!textFooterLink && !textFooterLinkObj) {
      if (!textFooterLink) {
        [textFooterLink, textFooterLinkObj] = drawFooterLinkText(
          footerLink,
          { fontSize: this.fontSize },
          this.topPadding
        );
        objCache.put('textFooterLink', textFooterLink);
        objCache.put('textFooterLink_textSeqObj', textFooterLinkObj);
      }

      if (!this.staticCanvas) {
        mouseOverText(textFooterLink, textFooterLinkObj, footerLink, '', { fontSize: this.fontSize }, this, false);
        mouseDownLink(textFooterLink, footerLink, this);
        mouseOutText(textFooterLink, textFooterLinkObj, this);
      }
    }
    this.canvas.add(textFooterLink);
  }

  private wrapCanvas() {
    this.topPadding += 20;
    // topPadding always overrides the canvasHeight
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
