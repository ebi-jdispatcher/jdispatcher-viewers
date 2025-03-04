# jdispatcher-viewers

This documentation describes how to build an interactive visualization using jdispatcher-viewers and the [Fabric.js](http://fabricjs.com/) library. The visualisation leverages Fabric.js objects (e.g., rectangles) to create a dynamic, customizable canvas-based experience.

## Overview
Fabric.js supports features like gradient fills, object manipulation, and dynamic updates, making it suitable for applications such as biological data visualisation. Here we demonstrate how to build a small basic visualisation for viewing protein domain annotations on a sequence track.

## Prerequisites
- **Fabric.js**: Tested with version 5.4.0
- **TypeScript**: Tested with version 4.9
- **Browser**: Modern browser with Canvas support

## Installation
1. Include Fabric.js in your new project:
   ```bash
   npm install fabric
   ```
2. Likewise, you need to install jdispatcher-viewers:
   ```bash
   npm install jdispatcher-viewers
   ```

2. Create wew HTML file (e.g. 'index.html') and set up a canvas element:
   ```html
   <canvas id="canvas" width="800" height="600"></canvas>
   ```

3. Initialize Fabric.js in your JavaScript/TypeScript:
   ```javascript
   const canvas = new fabric.Canvas('canvas');
   ```

## Notes
- Ensure the canvas is re-rendered (`canvas.renderAll()`) after dynamic updates.
- Check Fabric.js [documentation](https://fabricjs.com/docs/) for advanced features like groups, animations, or filters.


## API Reference
- For a complete overview of the jdispatcher-viewers modules and utilities, check the [API Docs](/jdispatcher-viewers/api/modules.html).
