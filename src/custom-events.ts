import { fabric } from 'fabric';
import { TextType, RectType, ColorSchemeEnum, RenderOptions, ScaleTypeEnum, ScoreTypeEnum } from './custom-types';
import { VisualOutput } from './visual-output-app';
import { Hsp, IprMatchFlat } from './data-model';
import { FunctionalPredictions } from './functional-predictions-app';
import { drawURLInfoTooltip, drawDomainTooltips, drawDomainInfoTooltips } from './drawing-utilities';
import { tooltipState } from './other-utilities';

/**
 * Adds mouseover event to a fabric object to display a tooltip and underline the text.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to modify on hover.
 * @param {string} sequence - The sequence to display in the tooltip.
 * @param {string} URL - The URL to link to.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 * @param {boolean} [_tooltip=true] - Whether to show the tooltip.
 */
export function mouseOverText(
  fabricObj: fabric.Object,
  textObj: TextType,
  sequence: string,
  URL: string,
  renderOptions: RenderOptions,
  _this: VisualOutput | FunctionalPredictions | any,
  _tooltip = true
) {
  fabricObj.on('mouseover', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: true });
      // add tooltip (on the flight)
      if (_tooltip) {
        const urlTooltip = drawURLInfoTooltip(+fabricObj.left!, sequence, URL, renderOptions, +fabricObj.top! + 15);
        _this.canvas.add(urlTooltip);
        urlTooltip.visible = false;
      }
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mousedown event to a fabric object to open a link in a new tab.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {string} href - The URL to open.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseDownLink(
  fabricObj: fabric.Object,
  href: string,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mousedown', (e: fabric.IEvent) => {
    if (e.target) {
      window.open(href, '_blank');
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mouseout event to a fabric object to reset the text style.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to reset on mouseout.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseOutText(
  fabricObj: fabric.Object,
  textObj: TextType,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mouseout', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: false });
      _this.canvas.renderAll();
    }
  });
}

/**
 * Type guard to check if an object is of type Hsp.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is of type Hsp, false otherwise.
 */
function isHsp(object: any): object is Hsp {
  return 'hsp_hit_from' in object;
}

/**
 * Adds mouseover event to a fabric object to display a domain tooltip.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {Hsp | IprMatchFlat} domain - The domain object (Hsp or IprMatchFlat).
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseOverDomain(
  fabricObj: fabric.Object,
  startPixels: number,
  endPixels: number,
  seq_from: number,
  seq_to: number,
  domain: Hsp | IprMatchFlat,
  renderOptions: RenderOptions,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mouseover', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      let tooltipGroup: fabric.Group;
      if (isHsp(domain)) {
        // Query/Subject tooltip
        tooltipGroup = drawDomainTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain as Hsp,
          renderOptions,
          fabricObj.top! + 5
        );
      } else {
        // Domain tooltip
        tooltipGroup = drawDomainInfoTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain as IprMatchFlat,
          renderOptions,
          fabricObj.top! + 5
        );
      }
      _this.canvas.add(tooltipGroup);
      tooltipGroup.set({ visible: true });
      tooltipGroup.bringToFront();
      _this.canvas.renderAll();
      tooltipGroup.set({ visible: false });
    }
  });
}

/**
 * Adds mousedown event to a fabric object to toggle a domain tooltip.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {Hsp | IprMatchFlat} domain - The domain object (Hsp or IprMatchFlat).
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseClickDomain(
  fabricObj: fabric.Object,
  startPixels: number,
  endPixels: number,
  seq_from: number,
  seq_to: number,
  domain: Hsp | IprMatchFlat,
  renderOptions: RenderOptions,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mousedown', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      let tooltipGroup: fabric.Group;
      if (isHsp(domain)) {
        // Query/Subject tooltip
        tooltipGroup = drawDomainTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain as Hsp,
          renderOptions,
          fabricObj.top! + 5
        );
      } else {
        // Domain tooltip
        tooltipGroup = drawDomainInfoTooltips(
          startPixels,
          endPixels,
          seq_from,
          seq_to,
          domain as IprMatchFlat,
          renderOptions,
          fabricObj.top! + 5
        );
      }
      const coordProxy = startPixels;
      +endPixels + seq_from + seq_to;
      let newState: any = tooltipState(coordProxy, tooltipGroup);
      if (newState.state) {
        _this.canvas.add(tooltipGroup);
        tooltipGroup.set({ visible: true });
        fabricObj.bringToFront();
        tooltipGroup.bringToFront();
      } else {
        fabricObj.bringToFront();
        _this.canvas.remove(newState.data);
        _this.canvas.renderAll();
      }
    }
  });
}

/**
 * Adds mouseout event to a fabric object to reset the canvas.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseOutDomain(fabricObj: fabric.Object, _this: VisualOutput | FunctionalPredictions | any) {
  fabricObj.on('mouseout', (e: fabric.IEvent) => {
    if (e.target) {
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mouseover event to a fabric checkbox to change its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to modify on hover.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseOverCheckbox(
  fabricObj: fabric.Object,
  textObj: TextType,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mouseover', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      e.target.setOptions(textObj);
      e.target.setOptions({ fill: 'black' });
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mousedown event to a fabric checkbox to update the state.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum} value - The value to set.
 * @param {string} inputEnum - The type of input (ColorSchemeEnum, ScaleTypeEnum, or ScoreTypeEnum).
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseDownCheckbox(
  fabricObj: fabric.Object,
  value: ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum,
  inputEnum: string,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mousedown', (e: fabric.IEvent) => {
    if (e.target) {
      if (inputEnum === 'ColorSchemeEnum') {
        if (_this.colorScheme != value) {
          _this.colorScheme = value as ColorSchemeEnum;
          // if (_this.colorScheme === ColorSchemeEnum.ncbiblast) {
          //   _this.scaleType = ScaleTypeEnum.fixed;
          //   _this.scoreType = ScoreTypeEnum.bitscore;
          // }
          _this.render();
        }
      } else if (inputEnum === 'ScaleTypeEnum') {
        if (_this.scaleType != value) {
          _this.scaleType = value as ScaleTypeEnum;
          _this.render();
        }
      } else if (inputEnum === 'ScoreTypeEnum') {
        if (_this.scoreType != value) {
          _this.scoreType = value as ScoreTypeEnum;
          _this.render();
        }
      }
    }
  });
}

/**
 * Adds mouseout event to a fabric checkbox to reset its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to reset on mouseout.
 * @param {ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum} value - The value to check against.
 * @param {string} inputEnum - The type of input (ColorSchemeEnum, ScaleTypeEnum, or ScoreTypeEnum).
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
export function mouseOutCheckbox(
  fabricObj: fabric.Object,
  textObj: TextType,
  value: ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum,
  inputEnum: string,
  _this: VisualOutput | FunctionalPredictions | any
) {
  fabricObj.on('mouseout', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.setOptions(textObj);
      if (inputEnum === 'ColorSchemeEnum') {
        if (_this.colorScheme != value) {
          e.target.setOptions({
            fill: 'grey',
          });
        }
      } else if (inputEnum === 'ScaleTypeEnum') {
        if (_this.scaleType != value) {
          e.target.setOptions({
            fill: 'grey',
          });
        }
      } else if (inputEnum === 'ScoreTypeEnum') {
        if (_this.scoreType != value) {
          e.target.setOptions({
            fill: 'grey',
          });
        }
      }
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mouseover event to a fabric domain checkbox to change its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {RectType} rectObj - The rectangle object to modify on hover.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
export function mouseOverDomainCheckbox(
  fabricObj: fabric.Object,
  rectObj: RectType,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mouseover', (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      e.target.setOptions(rectObj);
      let currentDomainDatabaseDisabled = false;
      if (!_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        currentDomainDatabaseDisabled = true;
      }
      if (currentDomainDatabaseDisabled) {
        e.target.setOptions({ fill: 'white', stroke: 'grey' });
        e.target.set('hoverCursor', 'default');
      } else if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
        e.target.setOptions({ stroke: 'black' });
        e.target.set('hoverCursor', 'pointer');
      } else {
        e.target.setOptions({ opacity: 0.5, stroke: 'grey' });
        e.target.set('hoverCursor', 'pointer');
      }
      _this.canvas.renderAll();
    }
  });
}

/**
 * Adds mousedown event to a fabric domain checkbox to update the state.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
export function mouseDownDomainCheckbox(
  fabricObj: fabric.Object,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mousedown', (e: fabric.IEvent) => {
    if (e.target) {
      if (
        !_this.domainDatabaseList.includes(currentDomainDatabase) &&
        _this.uniqueDomainDatabases.includes(currentDomainDatabase)
      ) {
        _this.domainDatabaseList.push(currentDomainDatabase);
        _this.currentDomainDatabase = currentDomainDatabase;
        _this.render();
      } else if (_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        const indx = _this.domainDatabaseList.indexOf(currentDomainDatabase);
        if (indx > -1) {
          _this.domainDatabaseList.splice(indx, 1);
        }
        _this.currentDomainDatabase = undefined;
        _this.render();
      }
    }
  });
}

/**
 * Adds mouseout event to a fabric domain checkbox to reset its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {RectType} rectObj - The rectangle object to reset on mouseout.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
export function mouseOutDomainCheckbox(
  fabricObj: fabric.Object,
  rectObj: RectType,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mouseout', (e: fabric.IEvent) => {
    if (e.target) {
      let currentDomainDatabaseDisabled = false;
      if (!_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
        currentDomainDatabaseDisabled = true;
      }
      if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
        e.target.setOptions({ stroke: 'grey', fill: 'white' });
      } else if (currentDomainDatabaseDisabled) {
        e.target.setOptions({ stroke: 'grey', fill: 'white' });
      } else {
        e.target.setOptions(rectObj);
        e.target.setOptions({ opacity: 1.0, stroke: 'black' });
      }
      _this.canvas.renderAll();
    }
  });
}
