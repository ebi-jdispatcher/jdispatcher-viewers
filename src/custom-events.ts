import { FabricObject, Group } from 'fabric';
import { TextType, RectType, ColorSchemeEnum, RenderOptions } from './custom-types';
import { VisualOutput } from './visual-output-app';
import { Hsp, IprMatchFlat } from './data-model';
import { FunctionalPredictions } from './functional-predictions-app';
import { drawURLInfoTooltip, drawDomainTooltips, drawDomainInfoTooltips } from './drawing-utilities';

export function mouseOverText(
  fabricObj: FabricObject,
  textObj: TextType,
  sequence: string,
  URL: string,
  renderOptions: RenderOptions,
  _this: VisualOutput | FunctionalPredictions
) {
  fabricObj.on('mouseover', (e: any) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: true });
      // add tooltip (on the flight)
      const urlTooltip = drawURLInfoTooltip(+fabricObj.left!, sequence, URL, renderOptions, +fabricObj.top! + 15);
      _this.canvas.add(urlTooltip);
      _this.canvas.renderAll();
      urlTooltip.visible = false;
    }
  });
}

export function mouseDownText(fabricObj: FabricObject, href: string, _this: VisualOutput | FunctionalPredictions) {
  fabricObj.on('mousedown', (e: any) => {
    if (e.target) {
      window.open(href, '_blank');
      _this.canvas.renderAll();
    }
  });
}

export function mouseOutText(fabricObj: FabricObject, textObj: TextType, _this: VisualOutput | FunctionalPredictions) {
  fabricObj.on('mouseout', (e: any) => {
    if (e.target) {
      e.target.setOptions(textObj);
      e.target.setOptions({ underline: false });
      _this.canvas.renderAll();
    }
  });
}

function isHsp(object: any): object is Hsp {
  return 'hsp_hit_from' in object;
}

export function mouseOverDomain(
  fabricObj: FabricObject,
  startPixels: number,
  endPixels: number,
  seq_from: number,
  seq_to: number,
  domain: Hsp | IprMatchFlat,
  renderOptions: RenderOptions,
  _this: VisualOutput | FunctionalPredictions
) {
  fabricObj.on('mouseover', (e: any) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      let tooltipGroup: Group;
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
      // FIXME
      // fabricObj.bringToFront();
      // tooltipGroup.bringToFront();
      _this.canvas.renderAll();
      tooltipGroup.set({ visible: false });
    }
  });
}

export function mouseOutDomain(fabricObj: FabricObject, _this: VisualOutput | FunctionalPredictions) {
  fabricObj.on('mouseout', (e: any) => {
    if (e.target) {
      _this.canvas.renderAll();
    }
  });
}

export function mouseOverCheckbox(
  fabricObj: FabricObject,
  textObj: TextType,
  _this: VisualOutput | FunctionalPredictions
) {
  fabricObj.on('mouseover', (e: any) => {
    if (e.target) {
      e.target.set('hoverCursor', 'pointer');
      e.target.setOptions(textObj);
      e.target.setOptions({ fill: 'black' });
      _this.canvas.renderAll();
    }
  });
}

export function mouseDownCheckbox(
  fabricObj: FabricObject,
  value: ColorSchemeEnum,
  _this: VisualOutput | FunctionalPredictions
) {
  fabricObj.on('mousedown', (e: any) => {
    if (e.target) {
      if (_this.colorScheme != value) {
        _this.colorScheme = value;
        _this.render();
      }
    }
  });
}

export function mouseOutCheckbox(
  fabricObj: FabricObject,
  textObj: TextType,
  value: ColorSchemeEnum,
  _this: VisualOutput | FunctionalPredictions
) {
  fabricObj.on('mouseout', (e: any) => {
    if (e.target) {
      e.target.setOptions(textObj);
      if (_this.colorScheme != value) {
        e.target.setOptions({
          fill: 'grey',
        });
      }
      _this.canvas.renderAll();
    }
  });
}

export function mouseOverDomainCheckbox(
  fabricObj: FabricObject,
  rectObj: RectType,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mouseover', (e: any) => {
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

export function mouseDownDomainCheckbox(
  fabricObj: FabricObject,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mousedown', (e: any) => {
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

export function mouseOutDomainCheckbox(
  fabricObj: FabricObject,
  rectObj: RectType,
  currentDomainDatabase: string,
  _this: FunctionalPredictions
) {
  fabricObj.on('mouseout', (e: any) => {
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
