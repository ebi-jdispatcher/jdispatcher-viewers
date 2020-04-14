import { VisualOutput } from "./visual-output-app";
import { ColorSchemeEnum, jobIdDefaults } from "./custom-types";
import { validateJobId } from "./other-utilities";

type Listener = (items: string[]) => void;

// Canvas State Management
class CanvasState {
    private canvasInstances: string[] = [];
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

    addCanvas(jobId: string, data: string) {
        if (this.jobIds.length === 0 || !this.jobIds.includes(jobId)) {
            this.canvasInstances = [];
            this.jobIds.push(jobId);
            this.canvasInstances.push(data);
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
        const jobId = this.jobIdElement.value.trim();
        let formValidatable = { ...jobIdDefaults };
        formValidatable.value = jobId;

        if (validateJobId(formValidatable)) {
            if (jobId === "mock_jobid-I20200317-103136-0485-5599422-np2") {
                canvasInstance.addCanvas(
                    jobId,
                    "./src/testdata/ncbiblast.json"
                );
            } else {
                canvasInstance.addCanvas(jobId, jobId);
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
    private canvasInstance: string[];

    constructor() {
        this.templateElement = document.getElementById(
            "output-vis-canvas"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(
            "visual-output-app"
        )! as HTMLDivElement;

        if (this.templateElement !== null) {
            const importedHTMLcontent = document.importNode(
                this.templateElement.content,
                true
            );
            this.elementCanvas = importedHTMLcontent.firstElementChild as HTMLDivElement;

            this.canvasInstance = [];
            canvasInstance.addListener((canvasInstance: string[]) => {
                this.canvasInstance = canvasInstance;
                this.renderCanvas();
            });
        }
    }

    private renderCanvas() {
        this.hostElement.insertAdjacentElement("beforeend", this.elementCanvas);
        const fabricjs = new VisualOutput("canvas", this.canvasInstance[0], {
            colorScheme: ColorSchemeEnum.dynamic,
            numberHsps: 10,
            logSkippedHsps: true,
            canvasWrapperStroke: true
        }).render();
    }
}

new JobIdInputForm();
new FabricjsRenderer();
