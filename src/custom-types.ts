export enum ColorSchemeEnum {
  heatmap = 'heatmap', // red to blue
  ncbiblast = 'ncbiblast', // NCBI BLAST+ coloring
  greyscale = 'greyscale', // greyscale
  sequential = 'sequential', // light blue to blue
  divergent = 'divergent', // green to red
  qualitative = 'qualitative', // diverse colors
}

export enum ScaleTypeEnum {
  dynamic = 'dynamic',
  fixed = 'fixed',
}

export enum ScoreTypeEnum {
  evalue = 'evalue',
  bitscore = 'bitscore',
  identity = 'identity',
  similarity = 'similarity',
}

/* Global Options for Rendering the Fabric.js canvas
 * Width and Height in Pixels (px)
 */
export interface RenderOptions {
  jobId?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  contentWidth?: number; // Vizualisation
  contentScoringWidth?: number; // Scoring information
  contentLabelWidth?: number; // Sequence information
  contentLabelLeftWidth?: number; // Sequence/Domain information
  contentLabelRightWidth?: number; // Sequence/Domain information
  scaleWidth?: number; // Color Scale
  scaleLabelWidth?: number; // Color score information
  marginWidth?: number; // Space around different objects
  colorScheme?: ColorSchemeEnum;
  scaleType?: ScaleTypeEnum;
  scoreType?: ScoreTypeEnum;
  numberHits?: number; // Number of Hits to be displayed
  numberHsps?: number; // Number of HSPs to be displayed
  logSkippedHsps?: boolean; // Display notice about skipped HSPs
  fontWeigth?: string;
  fontSize?: number;
  fontFamily?: string;
  canvasWrapperStroke?: boolean;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
  currentDomainDatabase?: string | undefined;
  currentColor?: string;
  currentDisabled?: boolean;
  staticCanvas?: boolean; // No dynamic components (for CLI)
}

// jobId validation
export interface JobIdValidable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export const jobIdDefaults: JobIdValidable = {
  value: '',
  required: true,
  minLength: 35,
  maxLength: 60,
  pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/,
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

export interface LineType {
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

export interface RectType {
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

export interface ObjectType {
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
  objectCaching: false,
};

export const textDefaults: TextType = { ...objectDefaults };
export const rectDefaults: RectType = { ...objectDefaults };
export const lineDefaults: LineType = { ...objectDefaults };

export interface CoordsValues {
  queryLen?: number;
  subjLen?: number;
  subjHspLen?: number;
  start?: number;
  end?: number;
  queryStart?: number;
  queryEnd?: number;
  subjStart?: number;
  subjEnd?: number;
  startPixels?: number;
  endPixels?: number;
  startQueryPixels?: number;
  endQueryPixels?: number;
  startEvalPixels?: number;
  endEvalPixels?: number;
  startSubjPixels?: number;
  endSubjPixels?: number;
}

export type posnumber = number & { readonly _positive: unique symbol };

export function toPositiveNumber(value: number): posnumber {
  if (value < 0) {
    throw new Error(`${value} is not a positive number`);
  }
  return value as posnumber;
}
