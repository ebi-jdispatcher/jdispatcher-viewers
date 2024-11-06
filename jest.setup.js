const { createCanvas } = require('canvas');
global.HTMLCanvasElement.prototype.getContext = () => createCanvas(1200, 800).getContext('2d');
