This demo works with a pre-loaded example, but you can also pass a valid Job Dispatcher job ID.

<div class="app">
  <script type="text/javascript" src="../assets/jd_viewers_0.1.4.bundle.min.js" defer></script>
  <style>
    #canvas-wrapper {
      width: 100%;
      padding: -30px;
      display: block;
      padding-bottom: 30px;
    }

  .jd-viewers-app {
    max-width: 1200px;
    margin: 0 auto;
  }

  #jd-viewers-form {
    margin-bottom: 5px;
  }

  canvas, img {
    max-width: 100%;
    height: auto;
  }

  input[type="text"] {
    padding: 8px;
    padding-bottom: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }

  .md-sidebar {
    display: none;
  }

  </style>
  <script>
    async function eventHandler(event){
        event.preventDefault();
        // remove canvas-wrapper (if some available)
        const el = document.getElementById("canvas-wrapper");
        if (el !== null) el.parentNode.removeChild(el);
        // create new canvas-wrapper
        const canvasElement = document.getElementById("canvas");
        if (canvasElement === null) {
            const newDiv = document.createElement("div");
            newDiv.id = "canvas-wrapper";
            const newCanvas = document.createElement("canvas");
            newCanvas.id = "canvas";
            newDiv.appendChild(newCanvas);
            document.getElementsByClassName('md-content')[0].appendChild(newDiv);
        }
        // reset images if not empty
        const png = document.getElementById("png");
        png.src = ""
        const svg = document.getElementById("svg");
        svg.src = ""

        const submitter = event.submitter.name.trim();
        const jobId = event.target.querySelector("#jobid").value.trim();
        const jobIdObj = {
            value: jobId,
            required: true,
            minLength: 35,
            maxLength: 60,
            pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/,
        }

        if (validateJobId(jobIdObj)) {
            let sssJsonData;
            if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                sssJsonData = "../testdata/ncbiblast.json";
            } else {
                sssJsonData = validateSubmittedJobIdInput(jobId);
            }
            const sssJsonResponse = await fetchData(sssJsonData);
            const sssDataObj = dataAsType(sssJsonResponse, "SSSResultModel");

            let iprmcXmlData;
            if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                iprmcXmlData = "../testdata/iprmc.xml";
            } else {
                iprmcXmlData = validateSubmittedDbfetchInput(sssDataObj)
            }
            const iprmcXmlResponse = await fetchData(iprmcXmlData, "xml");
            // convert XML into Flattened JSON
            const iprmcJSONResponse = getIPRMCDataModelFlatFromXML(iprmcXmlResponse);
            const iprmcDataObj = dataAsType(iprmcJSONResponse, "IPRMCResultModelFlat");

            // viz app
            let fabricjs;
            let submitterShort = ";"
            if (submitter == "visual-output") {
                submitterShort = "vo";
                // Render Options
                const options = {
                    colorScheme: "dynamic",
                    numberHits: 100,
                    numberHsps: 10,
                    logSkippedHsps: true,
                    canvasWrapperStroke: true,
                    staticCanvas: false
                };
                // Call render method to display the viz
                fabricjs = new VisualOutput("canvas", sssDataObj, options);
                fabricjs.render();
            } else if (submitter == "functional-predictions"){
                submitterShort = "fp";
                // Render Options
                const options = {
                    colorScheme: "dynamic",
                    numberHits: 30,
                    canvasWrapperStroke: true,
                    staticCanvas: false
                };
                // Call render method to display the viz
                fabricjs = new FunctionalPredictions("canvas", sssDataObj, iprmcDataObj, options);
                fabricjs.render();
            }

            // export as SVG and PNG
            document.getElementById("btn-svg").onclick = function () {
                const img = document.getElementById(
                    "svg"
                );
                img.src = svgToMiniDataURI(fabricjs.canvas.toSVG().toString());
                // remove canvas-wrapper
                const el = document.getElementById("canvas-wrapper");
                el.parentNode?.removeChild(el);
            };
            document.getElementById("btn-png").onclick = function () {
                const img = document.getElementById(
                    "png"
                );
                img.src = fabricjs.canvas
                    .toDataURL({
                        format: "png",
                        enableRetinaScaling: true,
                        withoutTransform: true,
                    })
                    .toString();
                img.width = fabricjs.canvas.getWidth();
                // remove canvas-wrapper
                const el = document.getElementById("canvas-wrapper");
                el.parentNode?.removeChild(el);
            };

            // download as SVG and PNG
            document.getElementById("btn-svg-download").onclick = function () {
                const img = document.getElementById(
                    "svg"
                );
                img.src = svgToMiniDataURI(fabricjs.canvas.toSVG().toString());
                const a = document.createElement('a');
                a.href = img.src;
                a.download = `${jobId}-${submitterShort}.svg`;
                a.target = '_blank';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
            };
            document.getElementById("btn-png-download").onclick = function () {
                const img = document.getElementById(
                    "png"
                );
                img.src = fabricjs.canvas
                    .toDataURL({
                        format: "png",
                        enableRetinaScaling: true,
                        withoutTransform: true,
                    })
                    .toString();
                img.width = fabricjs.canvas.getWidth();
                const a = document.createElement('a');
                a.href = img.src;
                a.download = `${jobId}-${submitterShort}.png`;
                a.target = '_blank';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
            };

        } else {
            alert("The jobId provided is not valid!");
            return;
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        // Form submit handler
        const element = document.getElementById("jd-viewers-form");
        const jobIdElement = element.querySelector("#jobid");
        element.addEventListener("submit", eventHandler);
    });
  </script>
  <div class="jd-viewers-app">
      <form id="jd-viewers-form">
          <label for="jobid">Job ID:</label>
          <input type="text" size="60" id="jobid" required
          value="mock_jobid-I20200317-103136-0485-5599422-np2" />
          </br>
          <button type="submit" name="visual-output" class="md-button md-button--primary ">Generate Visual Output</button>
          <button type="submit" name="functional-predictions" class="md-button md-button--primary">Generate Functional Predictions</button>
      </form>
      <input type='button' class='md-button' id='btn-png' value='Display as PNG' />
      <input type='button' class='md-button' id='btn-png-download' value='Save as PNG' />
      <input type='button' class='md-button' id='btn-svg' value='Display as SVG' />
      <input type='button' class='md-button' id='btn-svg-download' value='Save as SVG' />
      <p>
          <div id="canvas-wrapper">
              <canvas id="canvas" />
          </div>
          <img id="svg"></img>
          <img id="png"></img>
      </p>
  </div>
</div>
