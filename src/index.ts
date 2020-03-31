import { CanvasRenderer } from "./app";
import { SSSResultModel } from "./data-model";
import { ColorSchemeEnum } from "./custom-types";
import { default as mockDataObj } from "./testdata/ncbiblast3.json";

type Listener = (items: SSSResultModel[]) => void;

// Canvas State Management
class CanvasState {
    private canvasInstances: SSSResultModel[] = [];
    private static instance: CanvasState;
    private listener: Listener = () => {};
    private jobIds: string[] = [];

    private constructor() {}

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

    addCanvas(jobId: string, dataObj: SSSResultModel) {
        if (this.jobIds.length === 0 || !this.jobIds.includes(jobId)) {
            this.canvasInstances = [];
            this.jobIds.push(jobId);
            this.canvasInstances.push(dataObj);
            this.listener(this.canvasInstances.slice());
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
        }
    };
    return adjDescriptor;
}

// input validation
interface Valitable {
    value: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

function validateInput(validInput: Valitable) {
    let isValid = true;
    if (validInput.required) {
        isValid = isValid && validInput.value.trim().length !== 0;
    }
    if (validInput.minLength) {
        isValid =
            isValid && validInput.value.trim().length >= validInput.minLength;
    }
    if (validInput.maxLength) {
        isValid =
            isValid && validInput.value.trim().length <= validInput.maxLength;
    }
    if (validInput.pattern) {
        isValid = isValid && validInput.pattern.test(validInput.value.trim());
    }
    return isValid;
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
            "visual-output-app"
        )! as HTMLDivElement;

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

    private submitListener() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    private renderForm() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const jobId = this.jobIdElement.value.trim();
        const formValidatable = {
            value: jobId,
            required: true,
            minLength: 35,
            maxLength: 60,
            pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)/g
        };

        if (validateInput(formValidatable)) {
            if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                canvasInstance.addCanvas(jobId, mockDataObj);
            } else {
                alert("Fetching from live service not yet implemented!");
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
    private canvasInstance: SSSResultModel[];

    constructor() {
        this.templateElement = document.getElementById(
            "output-vis-canvas"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(
            "visual-output-app"
        )! as HTMLDivElement;

        const importedHTMLcontent = document.importNode(
            this.templateElement.content,
            true
        );
        this.elementCanvas = importedHTMLcontent.firstElementChild as HTMLDivElement;

        this.canvasInstance = [];
        canvasInstance.addListener((canvasInstance: SSSResultModel[]) => {
            this.canvasInstance = canvasInstance;
            this.renderCanvas();
        });
    }

    private renderCanvas() {
        this.hostElement.insertAdjacentElement("beforeend", this.elementCanvas);
        const fabricjs = new CanvasRenderer("canvas", this.canvasInstance[0], {
            canvasWidth: 1000,
            canvasHeight: 100,
            numberHsps: 10,
            logSkippedHsps: true,
            colorScheme: ColorSchemeEnum.dynamic,
            canvasWrapperStroke: true
        }).render();
        // TODO add export as SVG and PNG - clickEvents
        console.log(fabricjs.canvas.renderCanvas);
    }
}

new JobIdInputForm();
new FabricjsRenderer();
