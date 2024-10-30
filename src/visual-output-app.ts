import { FabricText, Group, Rect } from 'fabric';
import { SSSResultModel } from './data-model';
import { defaultGradient, ncbiBlastGradient } from './color-schemes';
import { getQuerySubjPixelCoords, getDomainPixelCoords } from './coords-utilities';
import { getRgbColorGradient, getRgbColorFixed, getGradientSteps } from './color-utilities';
import { BasicCanvasRenderer, ObjectCache } from './other-utilities';
import { RenderOptions, ColorSchemeEnum, TextType } from './custom-types';
import {
  mouseDownText,
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
  drawHeaderLinkText,
  drawContentHeaderTextGroup,
  drawLineTracksQuerySubject,
  drawContentSequenceInfoText,
  drawHspNoticeText,
  drawScoreText,
  drawContentQuerySubjFooterTextGroup,
  drawNoHitsFoundText,
  drawDomainQueySubject,
  drawScaleTypeText,
  drawCheckBoxText,
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

  constructor(element: string | HTMLCanvasElement, private dataObj: SSSResultModel, renderOptions: RenderOptions) {
    super(element);

    renderOptions.canvasWidth != undefined ? (this.canvasWidth = renderOptions.canvasWidth) : (this.canvasWidth = 1000);
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
    renderOptions.numberHits != undefined ? (this.numberHits = renderOptions.numberHits) : (this.numberHits = 100);
    renderOptions.numberHsps != undefined ? (this.numberHsps = renderOptions.numberHsps) : (this.numberHsps = 10);
    renderOptions.logSkippedHsps != undefined
      ? (this.logSkippedHsps = renderOptions.logSkippedHsps)
      : (this.logSkippedHsps = true);
    renderOptions.fontSize != undefined ? (this.fontSize = renderOptions.fontSize) : (this.fontSize = 12);
    renderOptions.fontWeigth != undefined ? (this.fontWeigth = renderOptions.fontWeigth) : (this.fontWeigth = 'normal');
    renderOptions.fontFamily != undefined
      ? (this.fontFamily = renderOptions.fontFamily)
      : (this.fontFamily = 'Times New Roman');
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
    let textHeaderGroup: Group;
    textHeaderGroup = objCache.get('textHeaderGroup') as Group;
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
    let textHeaderLink: FabricText;
    let textSeqObj: TextType;
    textHeaderLink = objCache.get('textHeaderLink') as FabricText;
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
        mouseDownText(textHeaderLink, this.dataObj.query_url!, this);
        mouseOutText(textHeaderLink, textSeqObj, this);
      }
    }
  }

  private drawContentGroup() {
    if (this.dataObj.hits.length > 0) {
      // content header
      this.topPadding += 25;
      let textContentHeaderGroup: Group;
      textContentHeaderGroup = objCache.get('textContentHeaderGroup') as Group;
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
            colorScheme: this.colorScheme,
          },
          this.topPadding
        );
        objCache.put('textContentHeaderGroup', textContentHeaderGroup);
      }
      this.canvas.add(textContentHeaderGroup);

      // content header line tracks
      this.topPadding += 20;
      let lineTrackGroup: Group;
      lineTrackGroup = objCache.get('lineTrackGroup') as Group;
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
      let textContentFooterGroup: Group;
      textContentFooterGroup = objCache.get('textContentFooterGroup') as Group;
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
        objCache.put('textContentFooterGroup', textContentFooterGroup);
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
        if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
          if (hsp.hsp_bit_score! < minScore) minScore = hsp.hsp_bit_score!;
          if (hsp.hsp_bit_score! > maxScore) maxScore = hsp.hsp_bit_score!;
          if (hsp.hsp_bit_score! < minNotZeroScore && hsp.hsp_bit_score! > 0.0) minNotZeroScore = hsp.hsp_bit_score!;
        } else {
          if (hsp.hsp_expect! < minScore) minScore = hsp.hsp_expect!;
          if (hsp.hsp_expect! > maxScore) maxScore = hsp.hsp_expect!;
          if (hsp.hsp_expect! < minNotZeroScore && hsp.hsp_expect! > 0.0) minNotZeroScore = hsp.hsp_expect!;
        }
      }
    }

    if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
      this.gradientSteps = getGradientSteps(minScore, maxScore, minNotZeroScore, this.colorScheme);
    } else {
      this.gradientSteps = getGradientSteps(minScore, maxScore, minNotZeroScore, this.colorScheme);
    }

    let tmpNumberHits = 0;
    for (const hit of this.dataObj.hits) {
      tmpNumberHits++;
      if (tmpNumberHits <= this.numberHits) {
        let numberHsps: number = 0;
        const totalNumberHsps: number = hit.hit_hsps.length;
        // Hit ID + Hit Description text tracks
        let textObj: TextType;
        let spaceText, hitText: FabricText;
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
          mouseDownText(hitText, hit.hit_url, this);
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
            if (this.colorScheme === ColorSchemeEnum.ncbiblast) {
              color = getRgbColorFixed(hsp.hsp_bit_score!, this.gradientSteps, ncbiBlastGradient);
            } else {
              color = getRgbColorGradient(hsp.hsp_expect!, this.gradientSteps, defaultGradient);
            }
            this.topPadding += 10;
            let queryDomain, subjDomain: Rect;
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
                colorScheme: this.colorScheme,
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
            }
          } else {
            if (this.logSkippedHsps === true) {
              let hspTextNotice: FabricText;
              hspTextNotice = objCache.get('hspTextNotice') as FabricText;
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
        let supressText: FabricText;
        supressText = objCache.get('supressText') as FabricText;
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
    let dynamicBoxText, dynamicText, fixedBoxText, fixedText, ncbiblastBoxText, ncbiblastText: FabricText;
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
    if (!this.staticCanvas) {
      mouseOverCheckbox(dynamicBoxText, textCheckDynObj, this);
      mouseOutCheckbox(dynamicBoxText, textCheckDynObj, ColorSchemeEnum.dynamic, this);
      mouseDownCheckbox(dynamicBoxText, ColorSchemeEnum.dynamic, this);
    }

    this.canvas.add(fixedBoxText);
    this.canvas.add(fixedText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(fixedBoxText, textCheckFixObj, this);
      mouseOutCheckbox(fixedBoxText, textCheckFixObj, ColorSchemeEnum.fixed, this);
      mouseDownCheckbox(fixedBoxText, ColorSchemeEnum.fixed, this);
    }

    this.canvas.add(ncbiblastBoxText);
    this.canvas.add(ncbiblastText);
    if (!this.staticCanvas) {
      mouseOverCheckbox(ncbiblastBoxText, textCheckNcbiObj, this);
      mouseOutCheckbox(ncbiblastBoxText, textCheckNcbiObj, ColorSchemeEnum.ncbiblast, this);
      mouseDownCheckbox(ncbiblastBoxText, ColorSchemeEnum.ncbiblast, this);
    }
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
    let copyrightText: FabricText;
    let textFooterObj: TextType;
    copyrightText = objCache.get('copyrightText') as FabricText;
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
