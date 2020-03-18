import { fabric } from "fabric";
import { SSSResultModel } from "./data-model";

class CanvasType {
  constructor(public jobId: string, public dataObj: SSSResultModel) {}
}

export class FabricjsRenderer {
  canvas: fabric.Canvas;
  private canvasHeight: number = 100;
  private canvasWidth: number = 900;
  private numberHits: number;
  private canvasElement: fabric.Object[] = [];

  constructor(public canvasObj: CanvasType) {
    this.canvas = new fabric.Canvas("canvas", {
      selectionLineWidth: 2
    });
    this.numberHits = this.canvasObj.dataObj.hits.length;
    console.log(this.numberHits);
    this.setFrameSize();
    this.setTemplateTextGroup();
    this.renderCanvas();
  }

  private setFrameSize() {
    this.canvas.setHeight(this.canvasHeight);
    this.canvas.setWidth(this.canvasWidth);
  }

  private setTemplateTextGroup() {
    const fontSize: number = 11;
    const program = this.canvasObj.dataObj.program;
    const version = this.canvasObj.dataObj.version;
    const programText = new fabric.Text(`${program} (version: ${version})`, {
      fontWeight: "bold",
      fontSize: fontSize,
      top: 40,
      left: 20,
      selectable: false
    });
    let db_names: string[] = [];
    for (const db of this.canvasObj.dataObj.dbs) {
      db_names.push(db.name);
    }
    const dbs: string = db_names.join(", ");
    const databaseText = new fabric.Text(`Database(s): ${dbs}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 52,
      left: 20,
      selectable: false
    });
    const sequence = this.canvasObj.dataObj.query_def;
    const sequenceText = new fabric.Text(`Sequence: ${sequence}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 64,
      left: 20,
      selectable: false
    });
    const length = this.canvasObj.dataObj.query_len;
    const lengthText = new fabric.Text(`Length: ${length}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 76,
      left: 20,
      selectable: false
    });
    const start = this.canvasObj.dataObj.start;
    const startText = new fabric.Text(`${start}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 40,
      left: 800,
      selectable: false
    });
    const end = this.canvasObj.dataObj.end;
    const endText = new fabric.Text(`${end}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 52,
      left: 800,
      selectable: false
    });
    const copyright =
      "European Bioinformatics Institute 2006-2020. EBI is an Outstation of the European Molecular Biology Laboratory.";
    const copyrightText = new fabric.Text(`${copyright}`, {
      fontWeight: "normal",
      fontSize: fontSize,
      top: 120,
      left: 170,
      selectable: false
    });
    const textGroup = new fabric.Group(
      [
        programText,
        databaseText,
        sequenceText,
        lengthText,
        startText,
        endText,
        copyrightText
      ],
      {
        left: 0,
        top: 0,
        angle: 0,
        selectable: false
      }
    );
    this.canvasElement.push(textGroup);
  }

  private renderCanvas() {
    this.canvas.add(...this.canvasElement);
  }
}
