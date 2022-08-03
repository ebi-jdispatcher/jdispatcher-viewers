import svgToMiniDataURI from "mini-svg-data-uri";
import { VisualOutput } from "./visual-output-app";
import { FunctionalPredictions } from "./functional-predictions-app";
import { ColorSchemeEnum, jobIdDefaults } from "./custom-types";
import {
    validateJobId,
    validateSubmittedJobIdInput,
    validateSubmittedDbfetchInput,
    fetchData,
    dataAsType,
    getIPRMCDataModelFlatFromXML,
} from "./other-utilities";

interface InstanceObjType {
    jobId: string;
    data: string;
    submitter: string;
}

type Listener = (items: InstanceObjType) => void;

interface SubmitEvent {
    explicitOriginalTarget: HTMLElement;
    submitter: HTMLButtonElement;
}

// Canvas State Management
class CanvasState {
    private canvasInstance: InstanceObjType;
    private static instance: CanvasState;
    private listener: Listener = () => { };
    private jobIds: string[] = [];
    private submitterName: string = "";

    private constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new CanvasState();
            return this.instance;
        }
    }

    addListener(listenerFn: Listener) {
        this.listener = listenerFn;
    }

    addCanvas(jobId: string, data: string, submitter: string) {
        if (
            this.jobIds.length === 0 ||
            !this.jobIds.includes(jobId) ||
            submitter !== this.submitterName
        ) {
            this.submitterName = submitter;
            this.jobIds.push(jobId);
            this.canvasInstance = {
                jobId: jobId,
                data: data,
                submitter: submitter,
            };
            this.listener(this.canvasInstance);
        }
    }
}

const canvasInstance = CanvasState.getInstance();

function autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

// jobId Input Form
class JobIdInputForm {
    private templateElement: HTMLTemplateElement;
    private hostElement: HTMLDivElement;
    private element: HTMLFormElement;
    private jobIdElement: HTMLInputElement;
    public jobId: string = "";

    constructor() {
        this.templateElement = document.getElementById(
            "input-jobid"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(
            "jd-viewers-app"
        )! as HTMLDivElement;
        if (this.templateElement !== null) {
            const importedHTMLcontent = document.importNode(
                this.templateElement.content,
                true
            );
            this.element = importedHTMLcontent.firstElementChild as HTMLFormElement;

            this.jobIdElement = this.element.querySelector(
                "#jobid"
            )! as HTMLInputElement;

            this.submitListener();
            this.renderForm();
        }
    }

    private submitListener() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    private renderForm() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const submittedEvent = (event as unknown) as SubmitEvent;
        const jobId = this.jobIdElement.value.trim();
        let formValidatable = { ...jobIdDefaults };
        formValidatable.value = jobId;

        if (validateJobId(formValidatable)) {
            if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                canvasInstance.addCanvas(
                    jobId,
                    "../src/testdata/ncbiblast.json",
                    submittedEvent.submitter.name.trim()
                );
            } else {
                canvasInstance.addCanvas(
                    jobId,
                    jobId,
                    submittedEvent.submitter.name.trim()
                );
                return;
            }
        } else {
            alert("The jobId provided is not valid!");
            return;
        }
    }
}

// Fabricjs Render Class
class FabricjsRenderer {
    private templateElement: HTMLTemplateElement;
    private hostElement: HTMLDivElement;
    private elementCanvas: HTMLDivElement;
    private canvasInstance: InstanceObjType;

    constructor() {
        this.templateElement = document.getElementById(
            "jd-viewers-output"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(
            "jd-viewers-app"
        )! as HTMLDivElement;
        if (this.templateElement !== null) {
            const importedHTMLcontent = document.importNode(
                this.templateElement.content,
                true
            );
            this.elementCanvas = importedHTMLcontent.firstElementChild as HTMLDivElement;

            canvasInstance.addListener((canvasInstance: InstanceObjType) => {
                this.canvasInstance = canvasInstance;
                this.renderCanvas();
            });
        }
    }

    private async renderCanvas() {
        this.hostElement.insertAdjacentElement("beforeend", this.elementCanvas);
        let fabricjs: VisualOutput | FunctionalPredictions;
        const sssJsonData = validateSubmittedJobIdInput(
            this.canvasInstance.data
        );
        const sssJsonResponse = await fetchData(sssJsonData);
        const dataObj = dataAsType(sssJsonResponse, "SSSResultModel");
        if (this.canvasInstance.submitter === "visual-output") {
            fabricjs = new VisualOutput("canvas", dataObj, {
                colorScheme: ColorSchemeEnum.dynamic,
                numberHits: 100,
                numberHsps: 10,
                logSkippedHsps: true,
                canvasWrapperStroke: true,
            });
            fabricjs.render();
        } else if (this.canvasInstance.submitter === "functional-predictions") {
            let iprmcXmlData;
            if (
                this.canvasInstance.jobId ===
                "mock_jobid-I20200317-103136-0485-5599422-np2"
            ) {
                iprmcXmlData = "../src/testdata/iprmc.xml";
            } else {
                iprmcXmlData = validateSubmittedDbfetchInput(dataObj);
            }
            const iprmcXmlResponse = await fetchData(iprmcXmlData, "xml");
            // convert XML into Flattened JSON
            const iprmcJSONResponse = getIPRMCDataModelFlatFromXML(
                iprmcXmlResponse
            );
            const iprmcDataObj = dataAsType(
                iprmcJSONResponse,
                "IPRMCResultModelFlat"
            );

            fabricjs = new FunctionalPredictions(
                "canvas",
                dataObj,
                iprmcDataObj,
                {
                    colorScheme: ColorSchemeEnum.dynamic,
                    numberHits: 30,
                    canvasWrapperStroke: true,
                }
            );
            fabricjs.render();
        }
        // export as SVG and PNG
        document.getElementById("btn-svg")!.onclick = function () {
            const img: HTMLImageElement = document.getElementById(
                "svg"
            ) as HTMLImageElement;
            img.src = svgToMiniDataURI(fabricjs!.canvas.toSVG().toString());
            // remove canvas-wrapper
            const el: HTMLElement = document.getElementById("canvas-wrapper")!;
            el.parentNode?.removeChild(el);
        };
        document.getElementById("btn-png")!.onclick = function () {
            const img: HTMLImageElement = document.getElementById(
                "png"
            ) as HTMLImageElement;
            img.src = fabricjs!.canvas
                .toDataURL({
                    format: "png",
                    enableRetinaScaling: true,
                    withoutTransform: true,
                })
                .toString();
            img.width = fabricjs.canvas.getWidth();
            // remove canvas-wrapper
            const el: HTMLElement = document.getElementById("canvas-wrapper")!;
            el.parentNode?.removeChild(el);
        };
    }
}

new JobIdInputForm();
new FabricjsRenderer();
