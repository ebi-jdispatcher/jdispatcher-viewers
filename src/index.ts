import { FabricjsRenderer } from "./app";
import { SSSResultModel } from "./data-model";
import { InputType, RenderStatusEnum } from "./custom-types";
import { default as mockDataObj } from "./testdata/ncbiblast.json";

type Listener = (items: InputType[]) => void;

// Canvas State Management
class CanvasState {
    private canvasInstances: InputType[] = [];
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

    addCanvas(
        jobId: string,
        dataObj: SSSResultModel,
        status: RenderStatusEnum
    ) {
        if (this.jobIds.length === 0 || !this.jobIds.includes(jobId)) {
            this.canvasInstances = [];
            this.jobIds.push(jobId);
            const newCanvasInstance = new InputType(jobId, dataObj, status);
            this.canvasInstances.push(newCanvasInstance);
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
                canvasInstance.addCanvas(
                    jobId,
                    mockDataObj,
                    RenderStatusEnum.New
                );
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
class CanvasRenderer {
    private templateElement: HTMLTemplateElement;
    private templateElementTitle: HTMLTemplateElement;
    private hostElement: HTMLDivElement;
    private elementTitle: HTMLDivElement;
    private elementCanvas: HTMLDivElement;
    private canvasInstance: InputType[];

    constructor() {
        this.templateElement = document.getElementById(
            "output-vis-canvas"
        )! as HTMLTemplateElement;
        this.templateElementTitle = document.getElementById(
            "output-vis-title"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(
            "visual-output-app"
        )! as HTMLDivElement;

        const importedHTMLcontent = document.importNode(
            this.templateElement.content,
            true
        );
        this.elementCanvas = importedHTMLcontent.firstElementChild as HTMLDivElement;
        const importedHTMLcontentTitle = document.importNode(
            this.templateElementTitle.content,
            true
        );
        this.elementTitle = importedHTMLcontentTitle.firstElementChild as HTMLHeadingElement;

        this.canvasInstance = [];
        canvasInstance.addListener((canvasInstance: InputType[]) => {
            const filteredInstances = canvasInstance.filter(
                inst => inst.status === RenderStatusEnum.New
            );
            this.canvasInstance = filteredInstances;
            this.renderCanvas();
        });
    }

    private renderCanvas() {
        this.elementTitle.querySelector(
            "h3"
        )!.textContent = `Visual Output for ${this.canvasInstance[0].jobId}`;
        this.hostElement.insertAdjacentElement("beforeend", this.elementTitle);
        this.hostElement.insertAdjacentElement("beforeend", this.elementCanvas);
        const fabricjs = new FabricjsRenderer(
            {
                jobId: this.canvasInstance[0].jobId,
                dataObj: this.canvasInstance[0].dataObj,
                status: RenderStatusEnum.New
            },
            true,
            "dynamic"
        );
        // TODO add export as SVG and PNG - clickEvents
        console.log(fabricjs.canvas.renderCanvas);
    }
}

new JobIdInputForm();
new CanvasRenderer();
