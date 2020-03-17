// Input Data Type
class CanvasType {
  constructor(public jobId: string, public dataObj: object) {}
}

type Listener = (items: CanvasType[]) => void;

// Canvas State Management
class canvasState {
  private canvasInstances: CanvasType[] = [];
  private static instance: canvasState;
  private listener: Listener = () => {};
  private jobIds: string[] = [];

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new canvasState();
      return this.instance;
    }
  }

  addListener(listenerFn: Listener) {
    this.listener = listenerFn;
  }

  addCanvas(jobId: string, dataObj: object) {
    if (this.jobIds.length === 0 || !this.jobIds.includes(jobId)) {
      this.canvasInstances = [];
      this.jobIds.push(jobId);
      const newCanvasInstance = new CanvasType(jobId, dataObj);
      this.canvasInstances.push(newCanvasInstance);

      this.listener(this.canvasInstances.slice());
    }
  }
}

const canvasInstance = canvasState.getInstance();

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

function validate(validInput: Valitable) {
  let isValid = true;
  if (validInput.required) {
    isValid = isValid && validInput.value.trim().length !== 0;
  }
  if (validInput.minLength) {
    isValid = isValid && validInput.value.trim().length >= validInput.minLength;
  }
  if (validInput.maxLength) {
    isValid = isValid && validInput.value.trim().length <= validInput.maxLength;
  }
  if (validInput.pattern) {
    isValid = isValid && validInput.pattern.test(validInput.value.trim());
  }
  return isValid;
}

// jobId Input Form
class jobIdInputForm {
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

    this.configure();
    this.renderForm();
  }

  private configure() {
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

    if (validate(formValidatable)) {
      canvasInstance.addCanvas(jobId, {});
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
  private canvasInstance: CanvasType[];

  constructor() {
    this.templateElement = document.getElementById(
      "output-vis"
    )! as HTMLTemplateElement;
    this.templateElementTitle = document.getElementById(
      "output-vis"
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
    this.elementTitle = importedHTMLcontentTitle.firstElementChild as HTMLDivElement;

    this.canvasInstance = [];
    canvasInstance.addListener((canvasInstance: CanvasType[]) => {
      this.canvasInstance = canvasInstance;
      this.renderCanvas();
    });
  }

  private renderCanvas() {
    console.log(this.canvasInstance);
    this.elementTitle.querySelector(
      "h3"
    )!.textContent = `Visual Output for ${this.canvasInstance[0].jobId}`;
    this.hostElement.insertAdjacentElement("beforeend", this.elementTitle);
    this.hostElement.insertAdjacentElement("beforeend", this.elementCanvas);
  }
}

const jobIdForm = new jobIdInputForm();
const canvasRender = new CanvasRenderer();
