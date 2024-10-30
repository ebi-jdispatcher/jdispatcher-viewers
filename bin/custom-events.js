import { drawURLInfoTooltip, drawDomainTooltips, drawDomainInfoTooltips } from './drawing-utilities';
export function mouseOverText(fabricObj, textObj, sequence, URL, renderOptions, _this) {
    fabricObj.on('mouseover', (e) => {
        if (e.target) {
            e.target.set('hoverCursor', 'pointer');
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: true });
            // add tooltip (on the flight)
            const urlTooltip = drawURLInfoTooltip(+fabricObj.left, sequence, URL, renderOptions, +fabricObj.top + 15);
            _this.canvas.add(urlTooltip);
            _this.canvas.renderAll();
            urlTooltip.visible = false;
        }
    });
}
export function mouseDownText(fabricObj, href, _this) {
    fabricObj.on('mousedown', (e) => {
        if (e.target) {
            window.open(href, '_blank');
            _this.canvas.renderAll();
        }
    });
}
export function mouseOutText(fabricObj, textObj, _this) {
    fabricObj.on('mouseout', (e) => {
        if (e.target) {
            e.target.setOptions(textObj);
            e.target.setOptions({ underline: false });
            _this.canvas.renderAll();
        }
    });
}
function isHsp(object) {
    return 'hsp_hit_from' in object;
}
export function mouseOverDomain(fabricObj, startPixels, endPixels, seq_from, seq_to, domain, renderOptions, _this) {
    fabricObj.on('mouseover', (e) => {
        if (e.target) {
            e.target.set('hoverCursor', 'pointer');
            let tooltipGroup;
            if (isHsp(domain)) {
                // Query/Subject tooltip
                tooltipGroup = drawDomainTooltips(startPixels, endPixels, seq_from, seq_to, domain, renderOptions, fabricObj.top + 5);
            }
            else {
                // Domain tooltip
                tooltipGroup = drawDomainInfoTooltips(startPixels, endPixels, seq_from, seq_to, domain, renderOptions, fabricObj.top + 5);
            }
            _this.canvas.add(tooltipGroup);
            tooltipGroup.set({ visible: true });
            fabricObj.bringToFront();
            tooltipGroup.bringToFront();
            _this.canvas.renderAll();
            tooltipGroup.set({ visible: false });
        }
    });
}
export function mouseOutDomain(fabricObj, _this) {
    fabricObj.on('mouseout', (e) => {
        if (e.target) {
            _this.canvas.renderAll();
        }
    });
}
export function mouseOverCheckbox(fabricObj, textObj, _this) {
    fabricObj.on('mouseover', (e) => {
        if (e.target) {
            e.target.set('hoverCursor', 'pointer');
            e.target.setOptions(textObj);
            e.target.setOptions({ fill: 'black' });
            _this.canvas.renderAll();
        }
    });
}
export function mouseDownCheckbox(fabricObj, value, _this) {
    fabricObj.on('mousedown', (e) => {
        if (e.target) {
            if (_this.colorScheme != value) {
                _this.colorScheme = value;
                _this.render();
            }
        }
    });
}
export function mouseOutCheckbox(fabricObj, textObj, value, _this) {
    fabricObj.on('mouseout', (e) => {
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
export function mouseOverDomainCheckbox(fabricObj, rectObj, currentDomainDatabase, _this) {
    fabricObj.on('mouseover', (e) => {
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
            }
            else if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
                e.target.setOptions({ stroke: 'black' });
                e.target.set('hoverCursor', 'pointer');
            }
            else {
                e.target.setOptions({ opacity: 0.5, stroke: 'grey' });
                e.target.set('hoverCursor', 'pointer');
            }
            _this.canvas.renderAll();
        }
    });
}
export function mouseDownDomainCheckbox(fabricObj, currentDomainDatabase, _this) {
    fabricObj.on('mousedown', (e) => {
        if (e.target) {
            if (!_this.domainDatabaseList.includes(currentDomainDatabase) &&
                _this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
                _this.domainDatabaseList.push(currentDomainDatabase);
                _this.currentDomainDatabase = currentDomainDatabase;
                _this.render();
            }
            else if (_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
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
export function mouseOutDomainCheckbox(fabricObj, rectObj, currentDomainDatabase, _this) {
    fabricObj.on('mouseout', (e) => {
        if (e.target) {
            let currentDomainDatabaseDisabled = false;
            if (!_this.uniqueDomainDatabases.includes(currentDomainDatabase)) {
                currentDomainDatabaseDisabled = true;
            }
            if (!_this.domainDatabaseList.includes(currentDomainDatabase)) {
                e.target.setOptions({ stroke: 'grey', fill: 'white' });
            }
            else if (currentDomainDatabaseDisabled) {
                e.target.setOptions({ stroke: 'grey', fill: 'white' });
            }
            else {
                e.target.setOptions(rectObj);
                e.target.setOptions({ opacity: 1.0, stroke: 'black' });
            }
            _this.canvas.renderAll();
        }
    });
}
