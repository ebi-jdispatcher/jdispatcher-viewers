import { fabric } from "fabric";
import { CanvasDefaults } from "./config";
import { LineType, RectangleType } from "./custom-types";

export function drawLineTracks(
    startQueryPixels: number,
    endQueryPixels: number,
    startSubjPixels: number,
    endSubjPixels: number,
    topPadding: number,
    strokeWidth: number
): [fabric.Group, number] {
    const top: number = 10;
    let lineObj: LineType = {
        selectable: false,
        evented: false,
        objectCaching: false,
        top: topPadding + top,
        stroke: "black",
        strokeWidth: strokeWidth
    };
    //  Query
    const coordsQuery: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top,
        endQueryPixels,
        topPadding + top
    ];
    lineObj.left = startQueryPixels;
    const queryLine = new fabric.Line(coordsQuery, lineObj);

    const coordsQueryStartCap: [number, number, number, number] = [
        startQueryPixels,
        topPadding + top - 3,
        startQueryPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const queryStartCap = new fabric.Line(coordsQueryStartCap, lineObj);

    const coordsQueryEndCap: [number, number, number, number] = [
        endQueryPixels,
        topPadding + top - 3,
        endQueryPixels,
        topPadding + top + 3
    ];
    lineObj.left = endQueryPixels;
    const queryEndCap = new fabric.Line(coordsQueryEndCap, lineObj);

    // Subject
    const coordsSubj: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top,
        endSubjPixels,
        topPadding + top
    ];
    lineObj.top = topPadding + top;
    lineObj.left = startSubjPixels;
    const subjLine = new fabric.Line(coordsSubj, lineObj);

    const coordsSubjStartCap: [number, number, number, number] = [
        startSubjPixels,
        topPadding + top - 3,
        startSubjPixels,
        topPadding + top + 3
    ];
    lineObj.top = topPadding + top - 2;
    const subjStartCap = new fabric.Line(coordsSubjStartCap, lineObj);

    const coordsSubjEndCap: [number, number, number, number] = [
        endSubjPixels,
        topPadding + top - 3,
        endSubjPixels,
        topPadding + top + 3
    ];
    lineObj.left = endSubjPixels;
    const subjEndCap = new fabric.Line(coordsSubjEndCap, lineObj);

    // Group
    const lineGroup = new fabric.Group(
        [
            queryLine,
            subjLine,
            queryStartCap,
            queryEndCap,
            subjStartCap,
            subjEndCap
        ],
        CanvasDefaults.groupConfig
    );
    return [lineGroup, topPadding + top];
}

export function drawDomainTracks(
    startQueryPixels: number,
    endQueryPixels: number,
    startSubjPixels: number,
    endSubjPixels: number,
    topPadding: number,
    fill: string
): [fabric.Group, number] {
    const top: number = 10;
    let rectObj: RectangleType = {
        selectable: false,
        evented: false,
        objectCaching: false,
        top: topPadding + top,
        fill: fill,
        rx: 5,
        ry: 5
    };
    //  Query
    rectObj.top = topPadding - 5;
    rectObj.left = startQueryPixels;
    rectObj.width = endQueryPixels;
    rectObj.height = top;
    const queryDomain = new fabric.Rect(rectObj);

    // Subject
    rectObj.top = topPadding - 5;
    rectObj.left = startSubjPixels;
    rectObj.width = endSubjPixels;
    rectObj.height = top;
    const subjDomain = new fabric.Rect(rectObj);

    // Group
    const domainGroup = new fabric.Group(
        [queryDomain, subjDomain],
        CanvasDefaults.groupConfig
    );
    return [domainGroup, topPadding + top];
}

export function drawLineAxis(
    startGradPixels: number,
    o25GradPixels: number,
    o50GradPixels: number,
    o75GradPixels: number,
    endGradPixels: number,
    topPadding: number,
    strokeWidth: number
): [fabric.Group, number] {
    // Axis
    topPadding += 15;
    let lineObj: LineType = {
        selectable: false,
        evented: false,
        objectCaching: false,
        top: topPadding,
        stroke: "black",
        strokeWidth: strokeWidth
    };
    const coordsAxis: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        endGradPixels,
        topPadding
    ];
    lineObj.left = startGradPixels;
    const axisLine = new fabric.Line(coordsAxis, lineObj);

    // Start tick
    const coordsAxisStartTick: [number, number, number, number] = [
        startGradPixels,
        topPadding,
        startGradPixels,
        topPadding + 4
    ];
    const axisStartTick = new fabric.Line(coordsAxisStartTick, lineObj);

    // 25% tick
    const coordsAxis25Tick: [number, number, number, number] = [
        o25GradPixels,
        topPadding,
        o25GradPixels,
        topPadding + 4
    ];
    lineObj.left = o25GradPixels;
    const axis25Tick = new fabric.Line(coordsAxis25Tick, lineObj);

    // 50% tick
    const coordsAxis50Tick: [number, number, number, number] = [
        o50GradPixels,
        topPadding,
        o50GradPixels,
        topPadding + 4
    ];
    lineObj.left = o50GradPixels;
    const axis50Tick = new fabric.Line(coordsAxis50Tick, lineObj);

    // 75% tick
    const coordsAxis75Tick: [number, number, number, number] = [
        o75GradPixels,
        topPadding,
        o75GradPixels,
        topPadding + 4
    ];
    lineObj.left = o75GradPixels;
    const axis75Tick = new fabric.Line(coordsAxis75Tick, lineObj);
    
    // End tick
    const coordsAxisEndTick: [number, number, number, number] = [
        endGradPixels,
        topPadding,
        endGradPixels,
        topPadding + 4
    ];
    lineObj.left = endGradPixels;
    const axisEndTick = new fabric.Line(coordsAxisEndTick, lineObj);
    
    // Group
    const axisGroup = new fabric.Group(
        [
            axisLine,
            axisStartTick,
            axis25Tick,
            axis50Tick,
            axis75Tick,
            axisEndTick,
        ],
        CanvasDefaults.groupConfig
    );
    return [axisGroup, topPadding];
}