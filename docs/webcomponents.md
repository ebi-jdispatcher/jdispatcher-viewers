## Web Components

jdispatcher-viweres can be used as [Web Components](https://www.webcomponents.org/). 

### Visual Output

Visual Output can be used directly as HTML elements as shown in the example below. The visualisation can be customised to some extent.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Visual Output - webcomponent</title>
        <link rel="stylesheet" href="style.css" type="text/css" media="all" />
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.6.0/webcomponents-bundle.min.js" charset="utf-8"></script>
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.6.0/custom-elements-es5-adapter.min.js" charset="utf-8"></script>
        <script type="text/javascript" src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.6.bundle.min.js" defer></script>
    </head>
    <body>
        <!-- JD Visual Output Web-component -->
        <!-- data attribute should be a valid jobId -->
        <jd-visual-output
            data="mock_jobid-I20200317-103136-0485-5599422-np2"
            colorScheme="ncbiblast"
            scaleType="fixed"
            scoreType="bitscore"
            numberHits="100"
            numberHsps="10"
            logSkippedHsps="true"
            canvasWrapperStroke="true"
        ></jd-visual-output>
    </body>
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
        <title>Functional Predictions - webcomponent</title>
        <link rel="stylesheet" href="style.css" type="text/css" media="all" />
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.6.0/webcomponents-bundle.min.js" charset="utf-8"></script>
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.6.0/custom-elements-es5-adapter.min.js" charset="utf-8"></script>
        <script type="text/javascript" src="https://ebi-jdispatcher.github.io/jdispatcher-viewers/assets/jd_viewers_0.1.6.bundle.min.js" defer></script>
    </head>
    <body>
        <!-- JD Functional Predictions Web-component -->
        <!-- data attribute should be a valid jobId -->
        <jd-functional-predictions
            data="mock_jobid-I20200317-103136-0485-5599422-np2"
            scaleType="dynamic"
            scoreType="evalue"
            colorScheme="heatmap"
            numberHits="30"
            canvasWrapperStroke="true"
        ></jd-functional-predictions>
    </body>
</html>
```
