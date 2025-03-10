# Developing a new visualisation

This documentation describes how to build an interactive visualization using [Fabric.js](http://fabricjs.com/) and jdispatcher-viewers. The visualisation leverages Fabric.js objects (e.g., rectangles) to create a dynamic, customizable canvas-based experience.

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

## Using jdispatcher-viewers

For an example of how `jdispatcher-viewers` is used to provide the two main visualisations, Visual Output and Functional Predictions, see [index.ts](https://github.com/ebi-jdispatcher/jdispatcher-viewers/blob/main/src/demo.ts).

## Creating a new visualisation with Fabric.js and some of the jdispatcher-viewers utilities

Before starting, ensure you have basic knowledge of [Fabric.js](https://fabricjs.com/docs/) for canvas rendering as jdispatcher-viewers builds on top of that.

Below is a step-by-step guide to setting up a basic Fabric.js visualization using a `<script>` tag to load Fabric.js and a `<canvas>` element to render the visualization.

### HTML based example

1. Create wew HTML file (e.g. 'demo.html') and set up a canvas element:

  ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fabric.js and jdispatcher-viewers Demo</title>
      <style>
      canvas {
        border: 1px solid #ccc;

      }
    </style>
    <!-- Load Fabric.js from a CDN with defer -->
    <script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.4.0/fabric.min.js"
      defer
    ></script>

    <!-- Load jdispatcher-viewers -->
    <script
      type="text/javascript"
      src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.5.bundle.min.js"
      defer
    ></script>
    </head>
    <body>
      <!-- Canvas -->
      <div id="canvas-wrapper">
        <canvas id="canvas" />
      </div>

      <!-- Your custom script -->
      <script>
        // Your Fabric.js code goes here
      </script>
    </body>
    </html>
  ```
2. Initialize Fabric.js

  Inside the `<script>` tag, initialize Fabric.js and create a canvas object:

  ```javascript
    // Wrap script with a DOMContentLoaded event listener 
    document.addEventListener("DOMContentLoaded", () => {
        
    // Get the canvas element
    const canvasElement = document.getElementById("canvas");

    // Initialize Fabric.js canvas
    const startupDef = {
      defaultCursor: 'default',
      moveCursor: 'default',
      hoverCursor: 'default',
      backgroundColor: '#ffffff',
    };
    const canvas = new fabric.Canvas(canvasElement, startupDef);
  });
  ```
3. Add objects to the canvas:

  Now, you can add objects like title, domain label and domain track:

  ```javascript

      // set a number of variables
      let topPadding = 0;
      let canvasWidth = 800;
      let canvasHeight = 100;
      let contentWidth = 300;
      let marginWidth = (0.15 * canvasWidth) / 100;
      let fontSize = 14;
      let fontWeigth = "normal";
      let fontFamily = "Arial";

      // set height and width of the canvas
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);

      // draw title
      topPadding += 20;
      const titleObj = { ...JDViewers.textDefaults };
      titleObj.fontWeight = "bold";
      titleObj.fontSize = fontSize + 1;
      titleObj.top = topPadding;
      titleObj.left = contentWidth;
      const titleText = new fabric.Text("Demo Visualisation", titleObj);
      canvas.add(titleText);

      topPadding += 30;
      // draw sequence label
      const labelObj = { ...JDViewers.textDefaults };
      labelObj.fontWeight = "bold";
      labelObj.fontSize = fontSize + 1;
      labelObj.top = topPadding - 10 ;
      labelObj.left = 40;
      const domainLabel = new fabric.Text("Domain", labelObj);
      canvas.add(domainLabel);
  
      // draw sequence track
      const lineTrackGroup = JDViewers.drawLineTracks(
      {
          startPixels: 100,
          endPixels: 750,
      },
      { strokeWidth: 1 },
      topPadding
      );
      canvas.add(lineTrackGroup);
  
      // draw a domain
      topPadding += 10;
      const seqDomain = JDViewers.drawDomain(150, 550, topPadding, "green");
      canvas.add(seqDomain);
  ```
4. Add interactivity

  You can make the visualization interactive reacting to mouse hovering and clicking. For example:

  ```javascript
    // domain mouse hovering and click
    const domainObj = { id: "domain", name: "test domain", type: "protein" };
    JDViewers.mouseOverDomain(
        seqDomain,
        150,
        550,
        150,
        550,
        domainObj,
        { fontSize: fontSize },
        canvas
    );
    JDViewers.mouseOutDomain(seqDomain, canvas);

    // Mouse click display/hide domain tooltip
    JDViewers.mouseClickDomain(
        seqDomain,
        150,
        550,
        150,
        550,
        domainObj,
        {
        fontSize: fontSize,
        },
        canvas
    );
    
    // finally, do not forget to render all elements
    canvas.renderAll();
  ```
5. Run the demo

  1. Open the `demo.html` file in your browser.

  2. You should see a canvas with a sequence track on domain in green.

  3. Interact with the objects (e.g., mouse hover over one of the domains or click on them to reveal the tooltip information).

<div>
    <style>
      canvas {
        border: 1px solid #ccc;

      }
    </style>
    <!-- Load Fabric.js from a CDN with defer -->
    <script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.4.0/fabric.min.js"
      defer
    ></script>

    <!-- Load jdispatcher-viewers -->
    <script
      type="text/javascript"
      src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.5.bundle.min.js"
      defer
    ></script>
  <div>
    <div id="canvas-wrapper">
      <canvas id="canvas" />
    </div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {

        // Get the canvas element
        const canvasElement = document.getElementById("canvas");

        // Initialize Fabric.js canvas
        const startupDef = {
            defaultCursor: 'default',
            moveCursor: 'default',
            hoverCursor: 'default',
            backgroundColor: '#ffffff',
          };
        const canvas = new fabric.Canvas(canvasElement, startupDef);

        // set a number of variables
        let topPadding = 0;
        let canvasWidth = 800;
        let canvasHeight = 100;
        let contentWidth = 300;
        let marginWidth = (0.15 * canvasWidth) / 100;
        let fontSize = 14;
        let fontWeigth = "normal";
        let fontFamily = "Arial";

        // set height and width of the canvas
        canvas.setWidth(canvasWidth);
        canvas.setHeight(canvasHeight);

        // draw title
        topPadding += 20;
        const titleObj = { ...JDViewers.textDefaults };
        titleObj.fontWeight = "bold";
        titleObj.fontSize = fontSize + 1;
        titleObj.top = topPadding;
        titleObj.left = contentWidth;
        const titleText = new fabric.Text("Demo Visualisation", titleObj);
        canvas.add(titleText);

        topPadding += 30;
        // draw sequence label
        const labelObj = { ...JDViewers.textDefaults };
        labelObj.fontWeight = "bold";
        labelObj.fontSize = fontSize + 1;
        labelObj.top = topPadding - 10 ;
        labelObj.left = 40;
        const domainLabel = new fabric.Text("Domain", labelObj);
        canvas.add(domainLabel);
    
        // draw sequence track
        const lineTrackGroup = JDViewers.drawLineTracks(
        {
            startPixels: 100,
            endPixels: 750,
        },
        { strokeWidth: 1 },
        topPadding
        );
        canvas.add(lineTrackGroup);
    
        // draw a domain
        topPadding += 10;
        const seqDomain = JDViewers.drawDomain(150, 550, topPadding, "green");
        canvas.add(seqDomain);
    
        // domain mouse hovering and click
        const domainObj = { id: "domain", name: "test domain", type: "protein" };
        JDViewers.mouseOverDomain(
            seqDomain,
            150,
            550,
            150,
            550,
            domainObj,
            { fontSize: fontSize },
            canvas
        );
        JDViewers.mouseOutDomain(seqDomain, canvas);
    
        // Mouse click display/hide domain tooltip
        JDViewers.mouseClickDomain(
            seqDomain,
            150,
            550,
            150,
            550,
            domainObj,
            {
            fontSize: fontSize,
            },
            canvas
        );
        
        // finally, do not forget to render all elements
        canvas.renderAll();
      });
    </script>
  </div>
</div>


### Develop a new JavaScript/TypeScript project

1. Initialize a new project (if you don’t already have one):

  ```bash
  mkdir visualisation-demo
  cd visualisation-demo
  npm init -y
  ```
2. Install Fabric.js and jdispatcher-viewers as a dependency:

  ```bash
  npm install fabric @ebi-jdispatcher/jdispatcher-viewers
  ```
3. If you're using TypeScript, install the types for Fabric.js:

  ```bash
  npm install --save-dev @types/fabric
  ```
4. Set up your project structure:

  ```
  fabric-demo/
  ├── src/
  │   ├── index.ts (or index.js)
  │   ├── styles.css
  ├── index.html
  ├── package.json
  ├── tsconfig.json (if using TypeScript)
  └── webpack.config.js (or vite.config.js, etc.)
  ```
5. Create an HTML File

  Create an `index.html` file in the root of your project:

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fabric.js and jdispatcher-viewers Demo</title>
  </head>
  <body>
    <div id="canvas-wrapper">
      <canvas id="canvas" />
    </div>
    <script src="./dist/bundle.js"></script> <!-- Output bundle file -->
  </body>
  </html>
  ```
6. Add Styles

  Create a styles.css file in the `src/` folder:

  ```css
  canvas {
    border: 1px solid #ccc;
    background-color: #fff;
  }
  ```
7. Add a TypeScript/JavaScript

  Create an `index.ts` (or `index.js`) file in the `src/` folder. For example for TypeScript:

  ```typescript
  import { fabric } from "fabric";
  import {
    BasicCanvasRenderer,
    RenderOptions,
    textDefaults,
    drawLineTracks,
    mouseOverDomain,
    mouseClickDomain,
    mouseOutDomain,
    drawDomain,
  } from "@ebi-jdispatcher/jdispatcher-viewers";

  // Get the canvas element
  export class DemoVisualisation extends BasicCanvasRenderer {
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
      renderOptions: RenderOptions
    ) {
      super(element);

      console.log("vlieeded");

      renderOptions.canvasWidth != undefined
        ? (this.canvasWidth = renderOptions.canvasWidth)
        : (this.canvasWidth = 800);
      renderOptions.canvasHeight != undefined
        ? (this.canvasHeight = renderOptions.canvasHeight)
        : (this.canvasHeight = 100);
      renderOptions.contentWidth != undefined
        ? (this.contentWidth = renderOptions.contentWidth)
        : (this.contentWidth = 300);
      renderOptions.marginWidth != undefined
        ? (this.marginWidth = renderOptions.marginWidth)
        : (this.marginWidth = (0.15 * this.canvasWidth) / 100);
      renderOptions.fontSize != undefined
        ? (this.fontSize = renderOptions.fontSize)
        : (this.fontSize = 14);
      renderOptions.fontWeigth != undefined
        ? (this.fontWeigth = renderOptions.fontWeigth)
        : (this.fontWeigth = "normal");
      renderOptions.fontFamily != undefined
        ? (this.fontFamily = renderOptions.fontFamily)
        : (this.fontFamily = "Arial");
      this.topPadding = 0;

      this.getFabricCanvas();
    }
    public render() {
      // clear the canvas
      // this.canvas.clear();
      console.log("rendering from canvas");
      // canvas title
      this.drawHeaderGroup();
      // canvas content
      this.drawContentGroup();
      // finishing off
      this.setFrameSize();
      // render all
      this.renderCanvas();
      this.canvas.renderAll();
    }
    protected drawHeaderGroup() {
      this.topPadding += 2;

      // draw title
      const textObj = { ...textDefaults };
      textObj.fontWeight = "bold";
      textObj.fontSize = this.fontSize! + 1;
      textObj.top = this.topPadding;
      textObj.left = this.contentWidth;

      const titleText = new fabric.Text("Demo Visualisation", textObj);
      this.canvas.add(titleText);
    }

    protected drawContentGroup() {
      this.topPadding += 30;
      // draw sequence label
      const labelObj = { ...textDefaults };
      labelObj.fontWeight = "bold";
      labelObj.fontSize = this.fontSize + 1;
      labelObj.top = this.topPadding - 10;
      labelObj.left = 40;
      const domainLabel = new fabric.Text("Domain", labelObj);
      this.canvas.add(domainLabel);

      // draw sequence track
      const lineTrackGroup = drawLineTracks(
        {
          startPixels: 100,
          endPixels: 750,
        },
        { strokeWidth: 1 },
        this.topPadding
      );
      this.canvas.add(lineTrackGroup);

      // draw a domain
      const seqDomain = drawDomain(150, 550, this.topPadding, "orange");
      this.canvas.add(seqDomain);

      // domain mouse hovering and click
      const domainObj = { id: "domain", name: "test domain", type: "protein" };
      mouseOverDomain(
        seqDomain,
        150,
        550,
        150,
        550,
        domainObj,
        { fontSize: this.fontSize },
        this
      );
      mouseOutDomain(seqDomain, this);

      // Mouse click display/hide domain tooltip
      mouseClickDomain(
        seqDomain,
        150,
        550,
        150,
        550,
        domainObj,
        {
          fontSize: this.fontSize,
        },
        this
      );
    }

    protected setFrameSize() {
      this.canvas.setWidth(this.canvasWidth);
      this.canvas.setHeight(this.canvasHeight);
    }

    protected renderCanvas() {
      this.canvas.renderAll();
    }
  }

  (window as any).DemoVisualisation = DemoVisualisation;
  ```
8. Bundle the Project

  Using Webpack. Install Webpack and its CLI:
  ```bash
  npm install --save-dev webpack webpack-cli webpack-dev-server ts-loader typescript
  ```

  Create a `webpack.config.js` file:
  ```javascript
  const path = require('path');

  module.exports = {
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      static: './',
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
  ```

  Add the following scripts to `package.json`:
  ```json
  "scripts": {
    "start": "webpack serve --open",
    "build": "webpack"
  }
  ```

  Finally run the project, and open your browser and navigate to http://localhost:3000 (or the port specified by your dev server).
  You should see the Fabric.js canvas visualisation.

  ```bash
  npm start
  ```

## API Reference
- Check Fabric.js [documentation](https://fabricjs.com/docs/) for advanced features like groups, animations, or filters.
- For a complete overview of the jdispatcher-viewers modules and utilities, check the [API Docs](/jdispatcher-viewers/api/modules.html).
