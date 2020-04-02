export enum ColorSchemeEnum {
    fixed = "fixed", // e-value (fixed scale)
    dynamic = "dynamic", // e-value (dynamic scale)
    ncbiblast = "ncbiblast", // bit score (fixed scale)
    blasterjs = "blasterjs" // e-value (fixed scale)
}

/* Global Options for Rendering the Fabric.js canvas
 * Width and Height in Pixels (px)
 */
export interface RenderOptions {
    jobId?: string,
    canvasWidth?: number;
    canvasHeight?: number;
    contentWidth?: number; // Vizualisation
    contentScoringWidth?: number; // Scoring information
    contentLabelWidth?: number; // Sequence information
    scaleWidth?: number; // Color Scale
    scaleLabelWidth?: number; // Color score information
    marginWidth?: number; // Space around different objects
    colorScheme?: ColorSchemeEnum;
    numberHsps?: number; // Number of HSPs to be displayed
    logSkippedHsps?: boolean; // Display notice about skipped HSPs
    fontWeigth?: string;
    fontSize?: number;
    fontFamily?: string;
    canvasWrapperStroke?: boolean;
}

// jobId validation
export interface JobIdValitable {
    value: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export const jobIdDefaults: JobIdValitable = {
    value: "",
    required: true,
    minLength: 35,
    maxLength: 60,
    pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/
};

export interface TextType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    fontWeight?: string;
    fontSize?: number;
    fontFamily?: string;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    stroke?: string;
    fill?: string;
    [key: string]: any;
}

interface LineType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    top?: number;
    left?: number;
    right?: number;
    center?: number;
    angle?: number;
    [key: string]: any;
}

interface RectType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    fill?: string;
    [key: string]: any;
}

interface ObjectType {
    selectable: boolean;
    evented: boolean;
    objectCaching: boolean;
    [key: string]: any;
}

export interface ColorType {
    keys: number[];
    [key: number]: [number, number, number];
}

export const objectDefaults: ObjectType = {
    selectable: false,
    evented: false,
    objectCaching: false
};

export const textDefaults: TextType = { ...objectDefaults };
export const rectDefaults: RectType = { ...objectDefaults };
export const LineDefaults: LineType = { ...objectDefaults };
