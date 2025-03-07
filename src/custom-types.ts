/**
 * Enum defining color schemes for visualization.
 * @enum {string}
 */
export enum ColorSchemeEnum {
  heatmap = 'heatmap', // Red to blue gradient
  ncbiblast = 'ncbiblast', // NCBI BLAST+ coloring
  greyscale = 'greyscale', // Grayscale gradient
  sequential = 'sequential', // Light blue to blue gradient
  divergent = 'divergent', // Green to red gradient
  qualitative = 'qualitative', // Diverse distinct colors
}

/**
 * Enum defining scale types for visualization.
 * @enum {string}
 */
export enum ScaleTypeEnum {
  dynamic = 'dynamic', // Scale adjusts dynamically
  fixed = 'fixed', // Fixed scale range
}

/**
 * Enum defining score types for visualization.
 * @enum {string}
 */
export enum ScoreTypeEnum {
  evalue = 'evalue', // Expectation value
  bitscore = 'bitscore', // Bit score
  identity = 'identity', // Sequence identity
  similarity = 'similarity', // Sequence similarity
}

/**
 * Enum defining data model types.
 * @enum {string}
 */
export enum DataModelEnum {
  SSSResultModel = 'SSSResultModel',
  IPRMCResultModel = 'IPRMCResultModel',
  IPRMCResultModelFlat = 'IPRMCResultModelFlat',
}

/**
 * Interface defining global rendering options for a Fabric.js canvas.
 * @interface RenderOptions
 * @description Configures rendering parameters for a Fabric.js canvas, used in BasicCanvasRenderer.
 * All width and height values are in pixels (px).
 * @see BasicCanvasRenderer - Class utilizing these options.
 * @property {string} [jobId] - Job identifier for the data.
 * @property {number} [canvasWidth] - Canvas width in pixels.
 * @property {number} [canvasHeight] - Canvas height in pixels.
 * @property {number} [contentWidth] - Width of the visualization content.
 * @property {number} [contentScoringWidth] - Width for scoring information.
 * @property {number} [contentLabelWidth] - Width for sequence information.
 * @property {number} [contentLabelLeftWidth] - Width for left-side sequence/domain info.
 * @property {number} [contentLabelRightWidth] - Width for right-side sequence/domain info.
 * @property {number} [scaleWidth] - Width of the color scale.
 * @property {number} [scaleLabelWidth] - Width for color score information.
 * @property {number} [marginWidth] - Margin space around objects.
 * @property {ColorSchemeEnum} [colorScheme] - Color scheme for rendering.
 * @property {ScaleTypeEnum} [scaleType] - Scale type for visualization.
 * @property {ScoreTypeEnum} [scoreType] - Score type for visualization.
 * @property {number} [numberHits] - Number of hits to display.
 * @property {number} [numberHsps] - Number of HSPs to display.
 * @property {boolean} [logSkippedHsps] - Whether to log skipped HSPs.
 * @property {string} [fontWeigth] - Font weight (likely a typo, should be fontWeight).
 * @property {number} [fontSize] - Font size in pixels.
 * @property {string} [fontFamily] - Font family.
 * @property {boolean} [canvasWrapperStroke] - Whether to stroke the canvas wrapper.
 * @property {number} [strokeWidth] - Stroke width in pixels.
 * @property {[number, number]} [strokeDashArray] - Dash array for strokes.
 * @property {string | undefined} [currentDomainDatabase] - Current domain database name.
 * @property {string} [currentColor] - Current color value.
 * @property {boolean} [currentDisabled] - Whether rendering is disabled.
 * @property {boolean} [staticCanvas] - Whether to use a static canvas (no interactivity).
 */
export interface RenderOptions {
  jobId?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  contentWidth?: number;
  contentScoringWidth?: number;
  contentLabelWidth?: number;
  contentLabelLeftWidth?: number;
  contentLabelRightWidth?: number;
  scaleWidth?: number;
  scaleLabelWidth?: number;
  marginWidth?: number;
  colorScheme?: ColorSchemeEnum;
  scaleType?: ScaleTypeEnum;
  scoreType?: ScoreTypeEnum;
  numberHits?: number;
  numberHsps?: number;
  logSkippedHsps?: boolean;
  fontWeigth?: string;
  fontSize?: number;
  fontFamily?: string;
  canvasWrapperStroke?: boolean;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
  currentDomainDatabase?: string | undefined;
  currentColor?: string;
  currentDisabled?: boolean;
  staticCanvas?: boolean;
}

/**
 * Interface for validating job IDs.
 * @interface JobIdValidable
 * @property {string} value - The job ID string.
 * @property {boolean} [required=true] - Whether the job ID is required.
 * @property {number} [minLength=35] - Minimum length of the job ID.
 * @property {number} [maxLength=60] - Maximum length of the job ID.
 * @property {RegExp} [pattern=/([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/]
 *  - Regular expression pattern the job ID must match.
 */
export interface JobIdValidable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

/**
 * Default validation constraints for job IDs.
 * @type {JobIdValidable}
 * @description Provides default settings for validating job IDs, used in validateJobId.
 * @see validateJobId - Function using these defaults.
 */
export const jobIdDefaults: JobIdValidable = {
  value: '',
  required: true,
  minLength: 35,
  maxLength: 60,
  pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/,
};

/**
 * Interface defining properties for Fabric.js text objects.
 * @interface TextType
 * @property {boolean} selectable - Whether the text is selectable.
 * @property {boolean} evented - Whether the text responds to events.
 * @property {boolean} objectCaching - Whether to cache the text object.
 * @property {string} [fontWeight] - Font weight.
 * @property {number} [fontSize] - Font size in pixels.
 * @property {string} [fontFamily] - Font family.
 * @property {number} [top] - Top position in pixels.
 * @property {number} [left] - Left position in pixels.
 * @property {number} [right] - Right position in pixels.
 * @property {number} [center] - Center position in pixels.
 * @property {number} [angle] - Rotation angle in degrees.
 * @property {string} [stroke] - Stroke color.
 * @property {string} [fill] - Fill color.
 * @property {any} [key: string] - Additional dynamic properties.
 */
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

/**
 * Interface defining properties for Fabric.js line objects.
 * @interface LineType
 * @property {boolean} selectable - Whether the line is selectable.
 * @property {boolean} evented - Whether the line responds to events.
 * @property {boolean} objectCaching - Whether to cache the line object.
 * @property {number} [top] - Top position in pixels.
 * @property {number} [left] - Left position in pixels.
 * @property {number} [right] - Right position in pixels.
 * @property {number} [center] - Center position in pixels.
 * @property {number} [angle] - Rotation angle in degrees.
 * @property {any} [key: string] - Additional dynamic properties.
 */
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

/**
 * Interface defining properties for Fabric.js rectangle objects.
 * @interface RectType0
 * @property {boolean} selectable - Whether the rectangle is selectable.
 * @property {boolean} evented - Whether the rectangle responds to events.
 * @property {boolean} objectCaching - Whether to cache the rectangle object.
 * @property {number} [top] - Top position in pixels.
 * @property {number} [left] - Left position in pixels.
 * @property {number} [width] - Width in pixels.
 * @property {number} [height] - Height in pixels.
 * @property {string} [fill] - Fill color.
 * @property {any} [key: string] - Additional dynamic properties.
 */
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

/**
 * Base interface for Fabric.js object properties.
 * @interface ObjectType
 * @property {boolean} selectable - Whether the object is selectable.
 * @property {boolean} evented - Whether the object responds to events.
 * @property {boolean} objectCaching - Whether to cache the object.
 * @property {any} [key: string] - Additional dynamic properties.
 */
export interface ObjectType {
  selectable: boolean;
  evented: boolean;
  objectCaching: boolean;
  [key: string]: any;
}

/**
 * Interface defining a color mapping for visualization.
 * @interface ColorType
 * @property {number[]} keys - Array of score keys.
 * @property {[number, number, number]} [key: number] - RGB color tuple indexed by score.
 */
export interface ColorType {
  keys: number[];
  [key: number]: [number, number, number];
}

/**
 * Default properties for Fabric.js objects.
 * @type {ObjectType}
 */
export const objectDefaults: ObjectType = {
  selectable: false,
  evented: false,
  objectCaching: false,
};

/**
 * Default properties for Fabric.js text objects.
 * @type {TextType}
 */
export const textDefaults: TextType = { ...objectDefaults };

/**
 * Default properties for Fabric.js rectangle objects.
 * @type {RectType}
 */
export const rectDefaults: RectType = { ...objectDefaults };

/**
 * Default properties for Fabric.js line objects.
 * @type {LineType}
 */
export const lineDefaults: LineType = { ...objectDefaults };

/**
 * Interface defining coordinate values for rendering.
 * @interface CoordsValues
 * @property {number} [queryLen] - Query sequence length.
 * @property {number} [subjLen] - Subject sequence length.
 * @property {number} [subjHspLen] - Subject HSP length.
 * @property {number} [start] - General start position.
 * @property {number} [end] - General end position.
 * @property {number} [queryStart] - Query start position.
 * @property {number} [queryEnd] - Query end position.
 * @property {number} [subjStart] - Subject start position.
 * @property {number} [subjEnd] - Subject end position.
 * @property {number} [startPixels] - Start position in pixels.
 * @property {number} [endPixels] - End position in pixels.
 * @property {number} [startQueryPixels] - Query start position in pixels.
 * @property {number} [endQueryPixels] - Query end position in pixels.
 * @property {number} [startEvalPixels] - Evaluation start position in pixels.
 * @property {number} [endEvalPixels] - Evaluation end position in pixels.
 * @property {number} [startSubjPixels] - Subject start position in pixels.
 * @property {number} [endSubjPixels] - Subject end position in pixels.
 */
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

/**
 * Type representing a positive number with a branded constraint.
 * @typedef {number} posnumber
 */
export type posnumber = number & { readonly _positive: unique symbol };

/**
 * Converts a number to a positive number type, throwing an error if negative.
 * @function toPositiveNumber
 * @param {number} value - The number to convert.
 * @returns {posnumber} - The value as a positive number type.
 * @throws {Error} - Throws an error if the value is negative.
 * @description Ensures the input is a non-negative number, branding it as posnumber.
 * @example
 * console.log(toPositiveNumber(5)); // Outputs: 5 (as posnumber)
 * toPositiveNumber(-1); // Throws: "-1 is not a positive number"
 */
export function toPositiveNumber(value: number): posnumber {
  if (value < 0) {
    throw new Error(`${value} is not a positive number`);
  }
  return value as posnumber;
}
