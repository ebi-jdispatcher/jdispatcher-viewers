## Script Embedding

jdispatcher-viweres can be used by loading the library's JavaScript and creating a new script tag.

### Visual Output

Visual Output can be used by embedding a script tag in HTML as shown in the example below. The visualisation can be customised to some extent.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Visual Output - plugin</title>
        <link rel="stylesheet" href="style.css" type="text/css" media="all" />
        <script type="text/javascript" src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.5.bundle.min.js" defer></script>
    </head>
    <body>
        <div id="canvas-wrapper">
            <canvas id="canvas" />
        </div>
    </body>
    <script>
        document.addEventListener("DOMContentLoaded", async () => {
            // Get Sequence Similarity Search JSON URL
            // jobId should be a valid jobId
            const jobId = "mock_jobid-I20200317-103136-0485-5599422-np2";
            const data = getJdispatcherJsonURL(jobId);
            const sssJsonResponse = await fetchData(data);
            const sssDataObj = dataAsType(sssJsonResponse, "SSSResultModel");

            // Render Options
            const options = {
                colorScheme: "ncbiblast",
                scaleType: "fixed",
                scoreType: "bitscore",
                numberHits: 100,
                numberHsps: 10,
                logSkippedHsps: true,
                canvasWrapperStroke: true,
            };
            // Call render method to display the viz
            new VisualOutput("canvas", sssDataObj, options).render();
        });
    </script>
</html>
```

### Functional Predictions

Similarly for the Functional Predictions visualisation:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Functional Predictions - plugin</title>
        <link rel="stylesheet" href="style.css" type="text/css" media="all" />
        <script type="text/javascript" src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.5.bundle.min.js" defer></script>
    </head>
    <body>
        <div id="canvas-wrapper">
            <canvas id="canvas" />
        </div>
    </body>
    <script>
        document.addEventListener("DOMContentLoaded", async () => {
            // Get Sequence Similarity Search JSON URL
            // jobId should be a valid jobId
            // const jobId = "ncbiblast-I20220810-095736-0608-24881701-np2";
            const jobId = "mock_jobid-I20200317-103136-0485-5599422-np2";
            const data = getJdispatcherJsonURL(jobId);
            const sssJsonResponse = await fetchData(data);
            const sssDataObj = dataAsType(sssJsonResponse, "SSSResultModel");

            const iprmcXmlData = validateSubmittedDbfetchInput(sssDataObj);
            const iprmcXmlResponse = await fetchData(iprmcXmlData, "xml");
            // convert XML into Flattened JSON
            const iprmcJSONResponse = getIPRMCDataModelFlatFromXML(
                iprmcXmlResponse
            );
            const iprmcDataObj = dataAsType(
                iprmcJSONResponse,
                "IPRMCResultModelFlat"
            );

            // Render Options
            const options = {
                colorScheme="heatmap"
                scaleType="dynamic"
                scoreType="evalue"
                numberHits: 30,
                canvasWrapperStroke: true,
            };
            // Call render method to display the viz
            new FunctionalPredictions(
                "canvas",
                sssDataObj,
                iprmcDataObj,
                options
            ).render();
        });
    </script>
</html>
```