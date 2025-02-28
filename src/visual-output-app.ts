import { fabric } from 'fabric';
import { SSSResultModel } from './data-model';
import { getQuerySubjPixelCoords, getDomainPixelCoords } from './coords-utilities';
import {
  getRgbColorLogGradient,
  getRgbColorLinearGradient,
  getRgbColorFixed,
  getGradientSteps,
} from './color-utilities';
import { BasicCanvasRenderer, ObjectCache } from './other-utilities';
import { RenderOptions, ColorSchemeEnum, ScaleTypeEnum, ScoreTypeEnum, TextType } from './custom-types';
import {
  mouseDownLink,
  mouseClickDomain,
  mouseOverText,
  mouseOutText,
  mouseOverDomain,
  mouseOutDomain,
  mouseOverCheckbox,
  mouseDownCheckbox,
  mouseOutCheckbox,
} from './custom-events';
import {
  drawHeaderTextGroup,
  drawFooterLinkText,
  drawHeaderLinkText,
  drawContentHeaderTextGroup,
  drawLineTracksQuerySubject,
  drawContentSequenceInfoText,
  drawHspNoticeText,
  drawScoreText,
  drawContentQuerySubjFooterTextGroup,
  drawNoHitsFoundText,
  drawDomainQueySubject,
  drawScaleLabelText,
  drawScaleTypeCheckBoxText,
  drawScoreTypeCheckBoxText,
  drawColorSchemeCheckBoxText,
  drawScaleScoreText,
  drawScaleColorGradient,
  drawLineAxis5Buckets,
  drawLineAxis6Buckets,
  drawScaleTick5LabelsGroup,
  drawScaleTick4LabelsGroup,
  drawFooterText,
  drawCanvasWrapperStroke,
  drawContentSupressText,
} from './drawing-utilities';

let objCache = new ObjectCache();

export class VisualOutput extends BasicCanvasRenderer {
  private topPadding: number = 0;
  private queryLen: number = 0;
  private subjLen: number = 0;
  private startQueryPixels: number;
  private endQueryPixels: number;
  private startEvalPixels: number;
  private startSubjPixels: number;
  private endSubjPixels: number;
  private gradientSteps: number[] = [];
  private queryFactor: number = 1.0;
  private subjFactor: number = 1.0;

  constructor(
    element: string | HTMLCanvasElement,
    private dataObj: SSSResultModel,
    renderOptions: RenderOptions
  ) {
    super(element);

    renderOptions.canvasWidth != undefined ? (this.canvasWidth = renderOptions.canvasWidth) : (this.canvasWidth = 1200);
    renderOptions.canvasHeight != undefined
      ? (this.canvasHeight = renderOptions.canvasHeight)
      : (this.canvasHeight = 110);
    renderOptions.contentWidth != undefined
      ? (this.contentWidth = renderOptions.contentWidth)
      : (this.contentWidth = (65 * this.canvasWidth) / 100);
    renderOptions.contentScoringWidth != undefined
      ? (this.contentScoringWidth = renderOptions.contentScoringWidth)
      : (this.contentScoringWidth = (7 * this.canvasWidth) / 100);
    renderOptions.contentLabelWidth != undefined
      ? (this.contentLabelWidth = renderOptions.contentLabelWidth)
      : (this.contentLabelWidth = (27 * this.canvasWidth) / 100);
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
    renderOptions.scaleType != undefined
      ? (this.scaleType = renderOptions.scaleType)
      : (this.scaleType = ScaleTypeEnum.dynamic);
    renderOptions.scoreType != undefined
      ? (this.scoreType = renderOptions.scoreType)
      : (this.scoreType = ScoreTypeEnum.evalue);
    renderOptions.numberHits != undefined ? (this.numberHits = renderOptions.numberHits) : (this.numberHits = 100);
    renderOptions.numberHsps != undefined ? (this.numberHsps = renderOptions.numberHsps) : (this.numberHsps = 10);
    renderOptions.logSkippedHsps != undefined
      ? (this.logSkippedHsps = renderOptions.logSkippedHsps)
      : (this.logSkippedHsps = true);
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
    this.queryLen = this.dataObj.query_len;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_len > this.subjLen) {
        this.subjLen = hit.hit_len;
      }
    }
    // if size of query and subject sequences is to high,
    // use a scalling factor
    const diffQueryFactor = this.queryLen / this.subjLen;
    const diffSubjFactor = this.subjLen / this.queryLen;
    if (diffQueryFactor > 8) {
      this.subjFactor = (this.queryLen * 0.5) / this.subjLen;
    }
    if (diffSubjFactor > 8) {
      this.queryFactor = (this.subjLen * 0.5) / this.queryLen;
    }
  }

  private loadInitialCoords() {
    this.startQueryPixels = objCache.get('startQueryPixels') as number;
    this.endQueryPixels = objCache.get('endQueryPixels') as number;
    this.startSubjPixels = objCache.get('startSubjPixels') as number;
    this.endSubjPixels = objCache.get('endSubjPixels') as number;
    this.startEvalPixels = objCache.get('startEvalPixels') as number;
    if (
      !this.startQueryPixels &&
      !this.endQueryPixels &&
      !this.startSubjPixels &&
      !this.endSubjPixels &&
      !this.startEvalPixels
    ) {
      [this.startQueryPixels, this.endQueryPixels, this.startSubjPixels, this.endSubjPixels] = getQuerySubjPixelCoords(
        this.queryLen * this.queryFactor,
        this.subjLen * this.subjFactor,
        this.subjLen * this.subjFactor,
        this.contentWidth,
        this.contentScoringWidth,
        this.contentLabelWidth,
        this.marginWidth
      );
      this.startEvalPixels = this.endQueryPixels + 2 * this.marginWidth;
      objCache.put('startQueryPixels', this.startQueryPixels);
      objCache.put('endQueryPixels', this.endQueryPixels);
      objCache.put('startSubjPixels', this.startSubjPixels);
      objCache.put('endSubjPixels', this.endSubjPixels);
      objCache.put('startEvalPixels', this.startEvalPixels);
    }
  }

  private drawHeaderGroup() {
    // canvas header
    this.topPadding = 2;
    let textHeaderGroup: fabric.Object;
    textHeaderGroup = objCache.get('textHeaderGroup') as fabric.Object;
    if (!textHeaderGroup) {
      textHeaderGroup = drawHeaderTextGroup(
        this.dataObj,
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
      [textHeaderLink, textSeqObj] = drawHeaderLinkText(this.dataObj, { fontSize: this.fontSize }, this.topPadding);
      objCache.put('textHeaderLink', textHeaderLink);
      objCache.put('textHeaderLink_textSeqObj', textSeqObj);
    }
    this.canvas.add(textHeaderLink);
    if (!this.staticCanvas) {
      if (this.dataObj.query_url !== null && this.dataObj.query_url !== '') {
        mouseOverText(
          textHeaderLink,
          textSeqObj,
          this.dataObj.query_def!,
          this.dataObj.query_url!,
          { fontSize: this.fontSize },
          this
        );
        mouseDownLink(textHeaderLink, this.dataObj.query_url!, this);
        mouseOutText(textHeaderLink, textSeqObj, this);
      }
    }
  }

  private drawContentGroup() {
    if (this.dataObj.hits.length > 0) {
      // content header
      this.topPadding += 25;
      let textContentHeaderGroup: fabric.Group;
      textContentHeaderGroup = objCache.get('textContentHeaderGroup') as fabric.Group;
      if (!textContentHeaderGroup) {
        textContentHeaderGroup = drawContentHeaderTextGroup(
          {
            queryLen: this.queryLen * this.queryFactor,
            subjLen: this.subjLen * this.subjFactor,
            startQueryPixels: this.startQueryPixels,
            startEvalPixels: this.startEvalPixels,
            startSubjPixels: this.startSubjPixels,
          },
          {
            contentWidth: this.contentWidth,
            contentScoringWidth: this.contentScoringWidth,
            fontSize: this.fontSize,
            scoreType: this.scoreType,
          },
          this.topPadding
        );
        // FIXME breaks
        // objCache.put('textContentHeaderGroup', textContentHeaderGroup);
      }
      this.canvas.add(textContentHeaderGroup);

      // content header line tracks
      this.topPadding += 20;
      let lineTrackGroup: fabric.Group;
      lineTrackGroup = objCache.get('lineTrackGroup') as fabric.Group;
      if (!lineTrackGroup) {
        lineTrackGroup = drawLineTracksQuerySubject(
          {
            startQueryPixels: this.startQueryPixels,
            endQueryPixels: this.endQueryPixels,
            startSubjPixels: this.startSubjPixels,
            endSubjPixels: this.endSubjPixels,
          },
          { strokeWidth: 2 },
          this.topPadding
        );
        objCache.put('lineTrackGroup', lineTrackGroup);
      }
      this.canvas.add(lineTrackGroup);

      this.topPadding += 5;
      let textContentFooterGroup: fabric.Group;
      textContentFooterGroup = objCache.get('textContentFooterGroup') as fabric.Group;
      if (!textContentFooterGroup) {
        textContentFooterGroup = drawContentQuerySubjFooterTextGroup(
          {
            queryLen: this.queryLen,
            subjLen: this.subjLen,
            startQueryPixels: this.startQueryPixels,
            endQueryPixels: this.endQueryPixels,
            startSubjPixels: this.startSubjPixels,
            endSubjPixels: this.endSubjPixels,
          },
          {
            fontSize: this.fontSize,
          },
          this.topPadding
        );
        // objCache.put('textContentFooterGroup', textContentFooterGroup);
      }
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
          contentWidth: this.contentWidth,
        },
        this.topPadding
      );
      this.canvas.add(noHitsTextGroup);
    }
  }

  private drawDynamicContentGroup() {
    // draw a new track per hsp for each hit
    // only display 10 hsps per hit
    let subjLen: number = 0;
    let maxIDLen: number = 0;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
      if (hit.hit_len > subjLen) subjLen = hit.hit_len;
      if (hit.hit_db.length + hit.hit_id.length > maxIDLen) maxIDLen = hit.hit_db.length + hit.hit_id.length;
    }
    let minScore: number = Number.MAX_VALUE;
    let maxScore: number = 0;
    let minNotZeroScore: number = Number.MAX_VALUE;
    for (const hit of this.dataObj.hits.slice(0, this.numberHits)) {
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
    for (const hit of this.dataObj.hits) {
      tmpNumberHits++;
      if (tmpNumberHits <= this.numberHits) {
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
        if (!this.staticCanvas) {
          mouseOverText(hitText, textObj, hit.hit_def, hit.hit_url, { fontSize: this.fontSize }, this);
          mouseDownLink(hitText, hit.hit_url, this);
          mouseOutText(hitText, textObj, this);
        }
        for (const hsp of hit.hit_hsps) {
          numberHsps++;
          if (numberHsps <= this.numberHsps) {
            // line Tracks
            const subjHspLen: number = hit.hit_len;
            let startQueryPixels: number;
            let endQueryPixels: number;
            let startSubjPixels: number;
            let endSubjPixels: number;
            [startQueryPixels, endQueryPixels, startSubjPixels, endSubjPixels] = getQuerySubjPixelCoords(
              this.queryLen * this.queryFactor,
              this.subjLen * this.subjFactor,
              subjHspLen,
              this.contentWidth,
              this.contentScoringWidth,
              this.contentLabelWidth,
              this.marginWidth
            );

            this.topPadding += 5;
            const linesGroup = drawLineTracksQuerySubject(
              {
                startQueryPixels: startQueryPixels,
                endQueryPixels: endQueryPixels,
                startSubjPixels: startSubjPixels,
                endSubjPixels: endSubjPixels,
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
            let hspQueryStart: number;
            let hspQueryEnd: number;
            let hspSubjStart: number;
            let hspSubjEnd: number;
            if (hsp.hsp_query_frame! === '-1') {
              hspQueryStart = hsp.hsp_query_to;
              hspQueryEnd = hsp.hsp_query_from;
            } else {
              hspQueryStart = hsp.hsp_query_from;
              hspQueryEnd = hsp.hsp_query_to;
            }
            if (hsp.hsp_hit_frame! === '-1') {
              hspSubjStart = hsp.hsp_hit_to;
              hspSubjEnd = hsp.hsp_hit_from;
            } else {
              hspSubjStart = hsp.hsp_hit_from;
              hspSubjEnd = hsp.hsp_hit_to;
            }
            [startQueryHspPixels, endQueryHspPixels] = getDomainPixelCoords(
              startQueryPixels,
              endQueryPixels,
              this.queryLen,
              hspQueryStart,
              hspQueryEnd,
              this.marginWidth
            );
            [startSubjHspPixels, endSubjHspPixels] = getDomainPixelCoords(
              startSubjPixels,
              endSubjPixels,
              subjHspLen,
              hspSubjStart,
              hspSubjEnd,
              this.marginWidth
            );
            let color: string;

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
              color = getRgbColorFixed(score, this.gradientSteps, this.colorScheme);
            } else {
              if (this.scoreType === ScoreTypeEnum.evalue && this.colorScheme === ColorSchemeEnum.heatmap) {
                color = getRgbColorLogGradient(score, this.gradientSteps, this.colorScheme);
              } else {
                color = getRgbColorLinearGradient(score, this.gradientSteps, this.colorScheme);
              }
            }

            this.topPadding += 10;
            let queryDomain, subjDomain: fabric.Rect;
            [queryDomain, subjDomain] = drawDomainQueySubject(
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
                scoreType: this.scoreType,
              },
              this.topPadding
            );
            scoreText.width = this.contentScoringWidth;
            this.canvas.add(scoreText);
            if (!this.staticCanvas) {
              // Query hovering and tooltip
              mouseOverDomain(
                queryDomain,
                startQueryHspPixels,
                endQueryHspPixels,
                hspQueryStart,
                hspQueryEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme,
                },
                this
              );
              mouseOutDomain(queryDomain, this);

              // Query click display/hide domain tooltip
              mouseClickDomain(
                queryDomain,
                startQueryHspPixels,
                endQueryHspPixels,
                hspQueryStart,
                hspQueryEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme,
                },
                this
              );

              // Subject hovering and tooltip
              mouseOverDomain(
                subjDomain,
                startSubjHspPixels,
                endSubjHspPixels,
                hspSubjStart,
                hspSubjEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme,
                },
                this
              );
              mouseOutDomain(subjDomain, this);

              // Subject click display/hide domain tooltip
              mouseClickDomain(
                subjDomain,
                startSubjHspPixels,
                endSubjHspPixels,
                hspSubjStart,
                hspSubjEnd,
                hsp,
                {
                  fontSize: this.fontSize,
                  colorScheme: this.colorScheme,
                },
                this
              );
            }
          } else {
            if (this.logSkippedHsps === true) {
              let hspTextNotice: fabric.Text;
              hspTextNotice = objCache.get('hspTextNotice') as fabric.Text;
              if (!hspTextNotice) {
                hspTextNotice = drawHspNoticeText(
                  totalNumberHsps,
                  this.numberHsps,
                  {
                    fontSize: this.fontSize,
                    contentWidth: this.contentWidth,
                  },
                  this.topPadding
                );
                objCache.put('hspTextNotice', hspTextNotice);
              }
              this.canvas.add(hspTextNotice);
              this.topPadding += 20;
            }
            break;
          }
        }
      } else {
        // canvas content suppressed output
        this.topPadding += 20;
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
        this.topPadding += 20;
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
      this.canvas.add(textFooterLink);
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
