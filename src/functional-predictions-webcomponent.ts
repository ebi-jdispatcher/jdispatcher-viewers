import { LitElement, html } from 'lit-element/lit-element.js';
import { property, customElement } from 'lit/decorators.js';
import { RenderOptions, DataModelEnum, ColorSchemeEnum } from './custom-types';
import {
  validateSubmittedJobIdInput,
  validateSubmittedDbfetchInput,
  getIPRMCDataModelFlatFromXML,
  fetchData,
  dataAsType,
} from './other-utilities';
import { FunctionalPredictions } from './functional-predictions-app';

@customElement('jd-functional-predictions')
export class CanvasRendererComponent extends LitElement {
  @property({ type: String }) data = '';
  @property({ type: String }) colorScheme = 'dynamic';
  @property({ type: Number }) numberHits = 30;
  @property({ type: Boolean }) canvasWrapperStroke = true;

  constructor() {
    super();
  }

  async render() {
    const renderOptions: RenderOptions = {
      colorScheme: this.colorScheme as ColorSchemeEnum,
      numberHits: this.numberHits,
      canvasWrapperStroke: this.canvasWrapperStroke,
    };

    // Checks to find if canvas element exist (with id="canvas")
    // if not, creates it and appends it to body
    const canvasElement = document.getElementById('canvas')! as HTMLCanvasElement;
    if (canvasElement === null) {
      const newDiv = document.createElement('div');
      newDiv.id = 'canvas-wrapper';
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'canvas';
      newDiv.appendChild(newCanvas);
      document.body.appendChild(newDiv);
    }

    // loading the JSON Data
    const sssJsonData = validateSubmittedJobIdInput(this.data);
    const sssJsonResponse = await fetchData(sssJsonData);
    const sssDataObj = dataAsType(sssJsonResponse, DataModelEnum.SSSResultModel);
    // jobID has been validated
    let iprmcXmlData;
    if (this.data === 'mock_jobid-I20200317-103136-0485-5599422-np2') {
      iprmcXmlData =
        'https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/src/testdata/iprmc.xml';
    } else {
      iprmcXmlData = validateSubmittedDbfetchInput(sssDataObj);
    }
    const iprmcXmlResponse = await fetchData(iprmcXmlData, 'xml');
    // convert XML into Flattened JSON
    const iprmcJSONResponse = getIPRMCDataModelFlatFromXML(iprmcXmlResponse as string);
    const iprmcDataObj = dataAsType(iprmcJSONResponse, DataModelEnum.IPRMCResultModelFlat);

    // New JD Viewers Fabricjs Canvas
    new FunctionalPredictions('canvas', sssDataObj, iprmcDataObj, renderOptions).render();
    return html` ${this.canvasDivTemplate} `;
  }

  get canvasDivTemplate() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jd-functional-predictions': CanvasRendererComponent;
  }
}
