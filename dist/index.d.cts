import { fabric } from 'fabric';

/**
 * Interface representing the result model for sequence similarity search (SSS) data.
 * @interface SSSResultModel
 * @property {number} [alignments] - Number of alignments.
 * @property {string} command - Command used for the search.
 * @property {number} db_count - Number of databases searched.
 * @property {number} db_len - Total length of database sequences.
 * @property {number} db_num - Number of sequences in the database.
 * @property {string} [dbrange] - Database range.
 * @property {DB[]} dbs - Array of database metadata.
 * @property {string} end - End position or timestamp of the search.
 * @property {number} [expect_lower] - Lower expectation value threshold.
 * @property {number} [expect_upper] - Upper expectation value threshold.
 * @property {string} [filter] - Filter applied to the search.
 * @property {number} [gap_extend] - Gap extension penalty.
 * @property {number} [gap_open] - Gap opening penalty.
 * @property {boolean} [histogram] - Whether a histogram was generated.
 * @property {Hit[]} hits - Array of hit results.
 * @property {number} [ktup] - K-tuple length for search.
 * @property {string} [matrix] - Scoring matrix used.
 * @property {string} program - Search program name (e.g., BLAST).
 * @property {string} [query_acc] - Query accession number.
 * @property {string} [query_db] - Query database.
 * @property {string} query_def - Query definition.
 * @property {string} [query_desc] - Query description.
 * @property {string} [query_id] - Query identifier.
 * @property {number} query_len - Length of the query sequence.
 * @property {string} [query_seq] - Query sequence.
 * @property {string} [query_stype] - Query sequence type.
 * @property {string} [query_uni_gn] - Query UniProt gene name.
 * @property {string} [query_uni_os] - Query UniProt organism.
 * @property {string} [query_uni_ox] - Query UniProt organism taxonomy ID.
 * @property {string} [query_uni_pe] - Query UniProt protein existence level.
 * @property {string} [query_uni_sv] - Query UniProt sequence version.
 * @property {string} [query_url] - Query URL.
 * @property {number} [scores] - Number of scores calculated.
 * @property {string} search - Search type or parameters.
 * @property {string} start - Start position or timestamp of the search.
 * @property {string} [statistics] - Statistical method used.
 * @property {string} [strand] - Strand orientation.
 * @property {string} version - Program version.
 */
interface SSSResultModel {
    alignments?: number;
    command: string;
    db_count: number;
    db_len: number;
    db_num: number;
    dbrange?: string;
    dbs: DB[];
    end: string;
    expect_lower?: number;
    expect_upper?: number;
    filter?: string;
    gap_extend?: number;
    gap_open?: number;
    histogram?: boolean;
    hits: Hit[];
    ktup?: number;
    matrix?: string;
    program: string;
    query_acc?: string;
    query_db?: string;
    query_def: string;
    query_desc?: string;
    query_id?: string;
    query_len: number;
    query_seq?: string;
    query_stype?: string;
    query_uni_gn?: string;
    query_uni_os?: string;
    query_uni_ox?: string;
    query_uni_pe?: string;
    query_uni_sv?: string;
    query_url?: string;
    scores?: number;
    search: string;
    start: string;
    statistics?: string;
    strand?: string;
    version: string;
}
/**
 * Interface representing a database used in an SSS search.
 * @interface DB
 * @property {string} name - Database name.
 * @property {string} stype - Sequence type (e.g., protein, nucleotide).
 * @property {string} [created] - Creation date of the database.
 */
interface DB {
    name: string;
    stype: string;
    created?: string;
}
/**
 * Interface representing a hit from an SSS search.
 * @interface Hit
 * @property {string} hit_acc - Hit accession number.
 * @property {string} hit_db - Hit database.
 * @property {string} hit_def - Hit definition.
 * @property {string} hit_desc - Hit description.
 * @property {Hsp[]} hit_hsps - Array of high-scoring pairs (HSPs).
 * @property {string} hit_id - Hit identifier.
 * @property {number} hit_len - Length of the hit sequence.
 * @property {number} hit_num - Hit number in results.
 * @property {string} [hit_seq] - Hit sequence.
 * @property {string} [hit_uni_de] - Hit UniProt description.
 * @property {string} [hit_uni_gn] - Hit UniProt gene name.
 * @property {string} [hit_uni_os] - Hit UniProt organism.
 * @property {string} [hit_uni_ox] - Hit UniProt organism taxonomy ID.
 * @property {string} [hit_uni_pe] - Hit UniProt protein existence level.
 * @property {string} [hit_uni_sv] - Hit UniProt sequence version.
 * @property {string} hit_url - Hit URL.
 */
interface Hit {
    hit_acc: string;
    hit_db: string;
    hit_def: string;
    hit_desc: string;
    hit_hsps: Hsp[];
    hit_id: string;
    hit_len: number;
    hit_num: number;
    hit_seq?: string;
    hit_uni_de?: string;
    hit_uni_gn?: string;
    hit_uni_os?: string;
    hit_uni_ox?: string;
    hit_uni_pe?: string;
    hit_uni_sv?: string;
    hit_url: string;
}
/**
 * Interface representing a high-scoring pair (HSP) from an SSS hit.
 * @interface Hsp
 * @property {number} [hsp_align_len] - Alignment length.
 * @property {number} [hsp_bit_score] - Bit score.
 * @property {number} [hsp_expect] - Expectation value (E-value).
 * @property {number} [hsp_gaps] - Number of gaps in the alignment.
 * @property {string} [hsp_hit_frame] - Hit frame.
 * @property {number} hsp_hit_from - Start position in the hit sequence.
 * @property {number} hsp_hit_to - End position in the hit sequence.
 * @property {string} hsp_hseq - Hit sequence in the alignment.
 * @property {number} [hsp_identity] - Percentage identity.
 * @property {number} [hsp_init1] - Initial score 1.
 * @property {number} [hsp_initn] - Initial score N.
 * @property {string} hsp_mseq - Midline sequence in the alignment.
 * @property {number} hsp_num - HSP number in the hit.
 * @property {number} [hsp_opt] - Optimal score.
 * @property {number} [hsp_positive] - Number of positive matches.
 * @property {string} hsp_qseq - Query sequence in the alignment.
 * @property {string} [hsp_query_frame] - Query frame.
 * @property {number} hsp_query_from - Start position in the query sequence.
 * @property {number} hsp_query_to - End position in the query sequence.
 * @property {number} hsp_score - Alignment score.
 * @property {string} [hsp_strand] - Strand orientation.
 * @property {number} [hsp_sw_score] - Smith-Waterman score.
 * @property {number} [hsp_zscore] - Z-score.
 */
interface Hsp {
    hsp_align_len?: number;
    hsp_bit_score?: number;
    hsp_expect?: number;
    hsp_gaps?: number;
    hsp_hit_frame?: string;
    hsp_hit_from: number;
    hsp_hit_to: number;
    hsp_hseq: string;
    hsp_identity?: number;
    hsp_init1?: number;
    hsp_initn?: number;
    hsp_mseq: string;
    hsp_num: number;
    hsp_opt?: number;
    hsp_positive?: number;
    hsp_qseq: string;
    hsp_query_frame?: string;
    hsp_query_from: number;
    hsp_query_to: number;
    hsp_score: number;
    hsp_strand?: string;
    hsp_sw_score?: number;
    hsp_zscore?: number;
}
/**
 * Interface representing the InterPro Match Complete (IPMC) result model from XML data.
 * @interface IPRMCResultModel
 * @property {Declaration} _declaration - XML declaration metadata.
 * @property {string[]} _doctype - Document type definition.
 * @property {IPRMC[]} interpromatch - Array of IPMC data.
 */
interface IPRMCResultModel {
    _declaration: Declaration;
    _doctype: string[];
    interpromatch: IPRMC[];
}
/**
 * Interface representing IPMC data within IPRMCResultModel.
 * @interface IPRMC
 * @property {Release[]} release - Array of release metadata.
 * @property {Protein[]} protein - Array of protein matches.
 */
interface IPRMC {
    release: Release[];
    protein: Protein[];
}
/**
 * Interface representing a protein in IPMC data.
 * @interface Protein
 * @property {ProteinAttributes} _attributes - Protein metadata.
 * @property {Match[]} match - Array of domain matches.
 */
interface Protein {
    _attributes: ProteinAttributes;
    match: Match[];
}
/**
 * Interface representing protein attributes in IPMC data.
 * @interface ProteinAttributes
 * @property {string} id - Protein identifier.
 * @property {string} name - Protein name.
 * @property {string} length - Protein length as a string.
 * @property {string} crc64 - CRC64 checksum.
 */
interface ProteinAttributes {
    id: string;
    name: string;
    length: string;
    crc64: string;
}
/**
 * Interface representing a domain match in IPMC data.
 * @interface Match
 * @property {MatchAttributes} _attributes - Match metadata.
 * @property {Ipr[]} [ipr] - Array of InterPro annotations (optional).
 * @property {Lcn[]} lcn - Array of location data.
 */
interface Match {
    _attributes: MatchAttributes;
    ipr?: Ipr[];
    lcn: Lcn[];
}
/**
 * Interface representing match attributes in IPMC data.
 * @interface MatchAttributes
 * @property {string} id - Match identifier.
 * @property {string} name - Match name.
 * @property {string} model - Match model.
 * @property {string} [key: string] - Additional dynamic attributes.
 */
interface MatchAttributes {
    id: string;
    name: string;
    model: string;
    [key: string]: string;
}
/**
 * Interface representing an InterPro annotation in a match.
 * @interface Ipr
 * @property {IprAttributes} _attributes - InterPro metadata.
 */
interface Ipr {
    _attributes: IprAttributes;
}
/**
 * Interface representing InterPro attributes.
 * @interface IprAttributes
 * @property {string} id - InterPro identifier.
 * @property {string} name - InterPro name.
 * @property {string} [key: string] - Additional dynamic attributes.
 */
interface IprAttributes {
    id: string;
    name: string;
    [key: string]: string;
}
/**
 * Interface representing location data in a match.
 * @interface Lcn
 * @property {LcnAttributes} _attributes - Location metadata.
 */
interface Lcn {
    _attributes: LcnAttributes;
}
/**
 * Interface representing location attributes.
 * @interface LcnAttributes
 * @property {string} start - Start position.
 * @property {string} end - End position.
 * @property {string} [fragments] - Fragment data.
 * @property {string} score - Score value.
 */
interface LcnAttributes {
    start: string;
    end: string;
    fragments?: string;
    score: string;
}
/**
 * Interface representing XML declaration attributes.
 * @interface Declaration
 * @property {DeclarationAttributes} _attributes - Declaration metadata.
 */
interface Declaration {
    _attributes: DeclarationAttributes;
}
/**
 * Interface representing declaration attributes.
 * @interface DeclarationAttributes
 * @property {string} version - XML version.
 * @property {string} encoding - XML encoding.
 */
interface DeclarationAttributes {
    version: string;
    encoding: string;
}
/**
 * Interface representing release metadata in IPMC data.
 * @interface Release
 * @property {Dbinfo[]} dbinfo - Array of database info.
 */
interface Release {
    dbinfo: Dbinfo[];
}
/**
 * Interface representing database info in a release.
 * @interface Dbinfo
 * @property {DbinfoAttributes} _attributes - Database metadata.
 */
interface Dbinfo {
    _attributes: DbinfoAttributes;
}
/**
 * Interface representing database info attributes.
 * @interface DbinfoAttributes
 * @property {string} dbname - Database name.
 * @property {string} version - Database version.
 * @property {string} entry_count - Number of entries.
 * @property {string} file_date - File creation date.
 */
interface DbinfoAttributes {
    dbname: string;
    version: string;
    entry_count: string;
    file_date: string;
}
/**
 * Interface representing a flattened IPRMC result model.
 * @interface IPRMCResultModelFlat
 * @property {IPRMCFlat} [key: string] - Protein data indexed by protein ID.
 */
interface IPRMCResultModelFlat {
    [key: string]: IPRMCFlat;
}
/**
 * Interface representing flattened protein data in IPRMCResultModelFlat.
 * @interface IPRMCFlat
 * @property {string} id - Protein identifier.
 * @property {string} name - Protein name.
 * @property {number} length - Protein length.
 * @property {string[]} matches - Array of match identifiers.
 * @property {IprMatchesFlat} match - Object mapping match IDs to match details.
 */
interface IPRMCFlat {
    id: string;
    name: string;
    length: number;
    matches: string[];
    match: IprMatchesFlat;
}
/**
 * Interface representing a collection of flattened match data.
 * @interface IprMatchesFlat
 * @property {IprMatchFlat[]} [key: string] - Array of match details indexed by match ID.
 */
interface IprMatchesFlat {
    [key: string]: IprMatchFlat[];
}
/**
 * Interface representing a single flattened match entry.
 * @interface IprMatchFlat
 * @property {string | number | undefined} [key: string] - Dynamic match properties.
 */
interface IprMatchFlat {
    [key: string]: string | number | undefined;
}

/**
 * Enum defining color schemes for visualization.
 * @enum {string}
 */
declare enum ColorSchemeEnum {
    heatmap = "heatmap",
    ncbiblast = "ncbiblast",
    greyscale = "greyscale",
    sequential = "sequential",
    divergent = "divergent",
    qualitative = "qualitative"
}
/**
 * Enum defining scale types for visualization.
 * @enum {string}
 */
declare enum ScaleTypeEnum {
    dynamic = "dynamic",
    fixed = "fixed"
}
/**
 * Enum defining score types for visualization.
 * @enum {string}
 */
declare enum ScoreTypeEnum {
    evalue = "evalue",
    bitscore = "bitscore",
    identity = "identity",
    similarity = "similarity"
}
/**
 * Enum defining data model types.
 * @enum {string}
 */
declare enum DataModelEnum {
    SSSResultModel = "SSSResultModel",
    IPRMCResultModel = "IPRMCResultModel",
    IPRMCResultModelFlat = "IPRMCResultModelFlat"
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
interface RenderOptions {
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
interface JobIdValidable {
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
declare const jobIdDefaults: JobIdValidable;
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
interface TextType {
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
/**
 * Base interface for Fabric.js object properties.
 * @interface ObjectType
 * @property {boolean} selectable - Whether the object is selectable.
 * @property {boolean} evented - Whether the object responds to events.
 * @property {boolean} objectCaching - Whether to cache the object.
 * @property {any} [key: string] - Additional dynamic properties.
 */
interface ObjectType {
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
interface ColorType {
    keys: number[];
    [key: number]: [number, number, number];
}
/**
 * Default properties for Fabric.js objects.
 * @type {ObjectType}
 */
declare const objectDefaults: ObjectType;
/**
 * Default properties for Fabric.js text objects.
 * @type {TextType}
 */
declare const textDefaults: TextType;
/**
 * Default properties for Fabric.js rectangle objects.
 * @type {RectType}
 */
declare const rectDefaults: RectType;
/**
 * Default properties for Fabric.js line objects.
 * @type {LineType}
 */
declare const lineDefaults: LineType;
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
interface CoordsValues {
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
type posnumber = number & {
    readonly _positive: unique symbol;
};
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
declare function toPositiveNumber(value: number): posnumber;

/**
 * A base class for rendering a Fabric.js canvas with customizable properties.
 * @class BasicCanvasRenderer
 * @description Provides foundational functionality for rendering a canvas, including frame sizing and content rendering.
 */
declare class BasicCanvasRenderer {
    private element;
    /**
     * The Fabric.js canvas instance, either interactive or static.
     * @type {fabric.Canvas | fabric.StaticCanvas}
     * @public
     */
    canvas: fabric.Canvas | fabric.StaticCanvas;
    /**
     * The width of the canvas in pixels or a custom value.
     * @type {any}
     * @protected
     */
    protected canvasWidth: number;
    /**
     * The height of the canvas in pixels.
     * @type {number}
     * @protected
     */
    protected canvasHeight: number;
    /**
     * The width of the content area.
     * @type {number}
     * @protected
     */
    protected contentWidth: number;
    /**
     * The width allocated for scoring content.
     * @type {number}
     * @protected
     */
    protected contentScoringWidth: number;
    /**
     * The width allocated for labels.
     * @type {number}
     * @protected
     */
    protected contentLabelWidth: number;
    /**
     * The width of the left-side label area.
     * @type {number}
     * @protected
     */
    protected contentLabelLeftWidth: number;
    /**
     * The width scale factor.
     * @type {number}
     * @protected
     */
    protected scaleWidth: number;
    /**
     * The width allocated for scale labels.
     * @type {number}
     * @protected
     */
    protected scaleLabelWidth: number;
    /**
     * The margin width around the canvas content.
     * @type {number}
     * @protected
     */
    protected marginWidth: number;
    /**
     * The color scheme used for rendering.
     * @type {ColorSchemeEnum}
     * @public
     */
    colorScheme: ColorSchemeEnum;
    /**
     * The type of scale used in the canvas.
     * @type {ScaleTypeEnum}
     * @public
     */
    scaleType: ScaleTypeEnum;
    /**
     * The type of scoring mechanism.
     * @type {ScoreTypeEnum}
     * @public
     */
    scoreType: ScoreTypeEnum;
    /**
     * The number of hits to render.
     * @type {number}
     * @protected
     */
    protected numberHits: number;
    /**
     * The number of HSPs (High-Scoring Pairs) to render.
     * @type {number}
     * @protected
     */
    protected numberHsps: number;
    /**
     * Whether to log skipped HSPs.
     * @type {boolean}
     * @protected
     */
    protected logSkippedHsps: boolean;
    /**
     * The font size for text rendering.
     * @type {number}
     * @protected
     */
    protected fontSize: number;
    /**
     * The font weight for text rendering.
     * @type {string}
     * @protected
     */
    protected fontWeigth: string;
    /**
     * The font family for text rendering.
     * @type {string}
     * @protected
     */
    protected fontFamily: string;
    /**
     * Whether to render a stroke around the canvas wrapper.
     * @type {boolean}
     * @protected
     */
    protected canvasWrapperStroke: boolean;
    /**
     * Whether to use a static (non-interactive) canvas.
     * @type {boolean}
     * @protected
     */
    protected staticCanvas: boolean;
    /**
     * Creates an instance of BasicCanvasRenderer.
     * @constructor
     * @param {string | HTMLCanvasElement} element - The canvas element or its ID to render into.
     */
    constructor(element: string | HTMLCanvasElement);
    /**
     * Initializes the Fabric.js canvas instance based on the staticCanvas property.
     * @protected
     * @returns {void}
     */
    protected getFabricCanvas(): void;
    /**
     * Sets the width and height of the canvas.
     * @protected
     * @returns {void}
     */
    protected setFrameSize(): void;
    /**
     * Renders all objects on the canvas.
     * @protected
     * @returns {void}
     */
    protected renderCanvas(): void;
}
/**
 * A generic cache for storing and retrieving objects by string keys.
 * @class ObjectCache
 * @template T - The type of objects stored in the cache.
 * @description Uses a Map to efficiently cache objects, allowing retrieval, addition, and deletion by key.
 */
declare class ObjectCache<T> {
    /**
     * The internal Map storing cached key-value pairs.
     * @type {Map<string, T>}
     * @private
     */
    private values;
    /**
     * Retrieves a cached object by its key.
     * @param {string} key - The key associated with the cached object.
     * @returns {T | undefined} - The cached object if found, otherwise undefined.
     */
    get(key: string): T | undefined;
    /**
     * Adds an object to the cache if it doesn’t already exist.
     * @param {string} key - The key to associate with the object.
     * @param {T} value - The object to cache.
     * @returns {void}
     */
    put(key: string, value: T): void;
    /**
     * Removes an object from the cache by its key.
     * @param {string} key - The key of the object to remove.
     * @returns {void}
     */
    delete(key: string): void;
}
/**
 * Counts the number of decimal places in a number.
 * @function countDecimals
 * @param {number} n - The number to analyze.
 * @returns {number} - The number of digits after the decimal point, or 0 if the number is an integer, has no decimal part, or is not a finite number (e.g., NaN, Infinity).
 * @example
 * console.log(countDecimals(123.45));    // Outputs: 2
 * console.log(countDecimals(10));        // Outputs: 0
 * console.log(countDecimals(5.0));       // Outputs: 0
 * console.log(countDecimals(3.14159));   // Outputs: 5
 * console.log(countDecimals(NaN));       // Outputs: 0
 * console.log(countDecimals(Infinity));  // Outputs: 0
 */
declare function countDecimals(n: number): number;
/**
 * Converts a number to a string with custom formatting based on its value.
 * @function numberToString
 * @param {number} n - The number to convert to a string.
 * @returns {string} - The formatted string representation of the number, or "0" for non-finite values (e.g., NaN, Infinity).
 * @description Formats numbers as follows:
 * - Non-finite numbers (NaN, Infinity) return "0".
 * - 0.0 returns "0".
 * - Numbers < 0.0001 or > 10000 use exponential notation with 2 decimal places.
 * - Integers (except 0) append ".0".
 * - Numbers with more than 2 decimal places are rounded to 2 decimal places.
 * - Other numbers are converted to their default string representation.
 * @example
 * console.log(numberToString(0.0));      // Outputs: "0"
 * console.log(numberToString(0.00005));  // Outputs: "5.00e-5"
 * console.log(numberToString(15000));    // Outputs: "1.50e+4"
 * console.log(numberToString(42));       // Outputs: "42.0"
 * console.log(numberToString(3.14159));  // Outputs: "3.14"
 * console.log(numberToString(1.23));     // Outputs: "1.23"
 * console.log(numberToString(NaN));      // Outputs: "0"
 * console.log(numberToString(Infinity)); // Outputs: "0"
 */
declare function numberToString(n: number): string;
/**
 * Fetches data from a specified URL and returns it in the requested format.
 * @function fetchData
 * @async
 * @param {string} dataLoc - The URL or location to fetch data from.
 * @param {string} [format='json'] - The format of the returned data ('json' or 'text').
 * @returns {Promise<any | string>} - A promise that resolves to the fetched data: parsed JSON (if format is 'json') or raw text (if format is 'text').
 * @throws {Error} - Throws an error if the fetch fails or JSON decoding fails (for 'json' format).
 * @description Retrieves data from a URL, parsing it as JSON by default or returning it as text if specified.
 * @example
 * // Fetching JSON data
 * fetchData('https://api.example.com/data')
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 *
 * // Fetching text data
 * fetchData('https://example.com/file.txt', 'text')
 *   .then(text => console.log(text))
 *   .catch(err => console.error(err));
 */
declare function fetchData(dataLoc: string, format?: string): Promise<any | string>;
/**
 * Casts data to a specific type based on a type identifier.
 * @function dataAsType
 * @param {any} data - The data to cast.
 * @param {DataType} dtype - The type identifier.
 * @returns {SSSResultModel | IPRMCResultModel | IPRMCResultModelFlat | any} - The data cast to the specified type,
 * or the original data if the type is not recognized.
 * @description Performs a type assertion on the input data based on the provided dtype.
 * Recognized types are 'SSSResultModel', 'IPRMCResultModel', and 'IPRMCResultModelFlat'.
 * If dtype is unrecognized, returns the data as-is.
 * @example
 * const rawData = { id: 1, value: 'test' };
 * const sssData = dataAsType(rawData, DataType.SSSResultModel);
 * console.log(sssData); // Treated as SSSResultModel
 *
 * const unknownData = dataAsType(rawData, 'unknown' as DataType);
 * console.log(unknownData); // Returns rawData unchanged
 */
declare function dataAsType(data: any, dtype: DataModelEnum): SSSResultModel | IPRMCResultModel | IPRMCResultModelFlat | any;
/**
 * Generates a URL for fetching JSON data from JDispatcher based on a job ID.
 * @function getJdispatcherJsonURL
 * @param {string} jobId - The job ID used to construct the URL, expected to conform to JobIdValidable constraints.
 * @returns {string} - The URL pointing to the JSON result for the given job ID.
 * @throws {Error} - Throws an error if the job ID does not match the pattern validation.
 * @description Constructs a URL for JDispatcher JSON results based on the job ID format:
 * - Mock job ID 'mock_jobid-I20200317-103136-0485-5599422-np2' returns a static test URL.
 * - Job IDs ending in '-np2' use the development server (wwwdev.ebi.ac.uk).
 * - Other job IDs (e.g., ending in '-p1m' or '-p2m') use the production server (www.ebi.ac.uk).
 * The tool name is extracted from the first part of the job ID (before the first '-').
 * Job IDs should ideally match the pattern defined in jobIdDefaults (/([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/),
 * with a length between 35 and 60 characters.
 * @see JobIdValidable - Interface defining job ID validation constraints.
 * @example
 * // Valid development job ID
 * console.log(getJdispatcherJsonURL('ncbiblast-I20200317-103136-0485-5599422-np2'));
 * // Outputs: "https://wwwdev.ebi.ac.uk/Tools/services/rest/ncbiblast/result/ncbiblast-I20200317-103136-0485-5599422-np2/json"
 *
 * // Valid production job ID
 * console.log(getJdispatcherJsonURL('ncbiblast-I20200317-103136-0485-5599422-p1m'));
 * // Outputs: "https://www.ebi.ac.uk/Tools/services/rest/ncbiblast/result/ncbiblast-I20200317-103136-0485-5599422-p1m/json"
 *
 * // Mock job ID
 * console.log(getJdispatcherJsonURL('mock_jobid-I20200317-103136-0485-5599422-np2'));
 * // Outputs: "https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/src/testdata/ncbiblast.json"
 */
declare function getJdispatcherJsonURL(jobId: string): string;
/**
 * Validates a job ID object against specified constraints.
 * @function validateJobId
 * @param {JobIdValidable} jobIdObj - The job ID object to validate, containing value and optional constraints.
 * @param {boolean} [verbose=false] - If true, logs validation result to the console.
 * @returns {boolean} - True if the job ID meets all constraints, false otherwise.
 * @description Checks a job ID against the constraints defined in the JobIdValidable object:
 * - If `required` is true, ensures the value is not empty.
 * - If `minLength` is set, ensures the value meets the minimum length.
 * - If `maxLength` is set, ensures the value does not exceed the maximum length.
 * - If `pattern` is set, ensures the value matches the regular expression.
 * Trims the value before validation. Logs a message if verbose is true.
 * @see JobIdValidable - Interface defining job ID validation constraints.
 * @example
 * const jobId = { value: 'ncbiblast-I20200317-103136-0485-5599422-np2', minLength: 35,
 * pattern: /([a-z_])*-([A-Z0-9])*-\d*-\d*-\d*-(np2|p1m|p2m)$/ };
 * console.log(validateJobId(jobId)); // Outputs: true
 *
 * const invalidJobId = { value: 'invalid', required: true };
 * console.log(validateJobId(invalidJobId, true)); // Outputs: false (logs "JobId "invalid" is not valid!")
 */
declare function validateJobId(jobIdObj: JobIdValidable, verbose?: boolean): boolean;
/**
 * Validates and transforms a submitted job ID input into a URL if applicable.
 * @function validateSubmittedJobIdInput
 * @param {string} data - The input string to validate and potentially transform.
 * @returns {string} - The transformed URL if the input is a valid job ID, otherwise the original input.
 * @description Checks if the input is a job ID by:
 * - Ensuring it does not start with 'http', contain '/', or './' (to exclude URLs or paths).
 * - Validating it against jobIdDefaults using validateJobId.
 * If it’s a valid job ID, returns the corresponding JDispatcher JSON URL via getJdispatcherJsonURL.
 * Otherwise, returns the input unchanged.
 * @see JobIdValidable - Interface defining job ID validation constraints.
 * @see validateJobId - Function used to validate the job ID.
 * @see getJdispatcherJsonURL - Function used to generate the JDispatcher URL.
 * @example
 * // Valid job ID
 * const result = validateSubmittedJobIdInput('ncbiblast-I20200317-103136-0485-5599422-np2');
 * console.log(result);
 * // Outputs: "https://wwwdev.ebi.ac.uk/Tools/services/rest/ncbiblast/result/ncbiblast-I20200317-103136-0485-5599422-np2/json"
 *
 * // URL or invalid input (returned unchanged)
 * console.log(validateSubmittedJobIdInput('https://example.com/data.json'));
 * // Outputs: "https://example.com/data.json"
 *
 * console.log(validateSubmittedJobIdInput('invalid'));
 * // Outputs: "invalid"
 */
declare function validateSubmittedJobIdInput(data: string): string;
/**
 * Generates a URL for fetching InterPro Match Complete XML data via Dbfetch.
 * @function getIPRMCDbfetchURL
 * @param {string} accessions - A comma-separated string of accession IDs to fetch data for.
 * @returns {string} - The URL for retrieving IPMC XML data from the EBI Dbfetch service.
 * @throws {Error} - Throws an error if the accessions parameter is empty or not a string.
 * @description Constructs a URL to fetch InterPro Match Complete (IPMC) data in XML format
 * from the EBI Dbfetch service (https://www.ebi.ac.uk/Tools/dbfetch).
 * The accessions parameter should be a single ID or a comma-separated list of IDs.
 * The input is URL-encoded to handle special characters.
 * The returned URL uses the 'iprmcxml' format and 'raw' style.
 * @example
 * console.log(getIPRMCDbfetchURL('P12345'));
 * // Outputs: "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=P12345;format=iprmcxml;style=raw"
 *
 * console.log(getIPRMCDbfetchURL('P12345,P67890'));
 * // Outputs: "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=P12345%2CP67890;format=iprmcxml;style=raw"
 */
declare function getIPRMCDbfetchURL(accessions: string): string;
/**
 * Extracts accession IDs from an SSSResultModel object as a comma-separated string.
 * @function getIPRMCDbfetchAccessions
 * @param {SSSResultModel} sssDataObj - The SSSResultModel object containing hit data.
 * @param {number} [numberHits=30] - The maximum number of hits to process (defaults to 30, clamped to 0 if negative).
 * @returns {string} - A comma-separated string of accession IDs from the hits, or an empty string if no valid hits are present.
 * @description Extracts accession IDs (hit_acc) from the hits array in the SSSResultModel object,
 * up to the specified numberHits, and joins them with commas.
 * Returns an empty string if hits is undefined, empty, or numberHits is 0 or negative.
 * @example
 * const sssData = {
 *   hits: [
 *     { hit_acc: 'P12345' },
 *     { hit_acc: 'P67890' }
 *   ]
 * };
 * console.log(getIPRMCDbfetchAccessions(sssData));
 * // Outputs: "P12345,P67890"
 *
 * console.log(getIPRMCDbfetchAccessions({ hits: [] }, 2));
 * // Outputs: ""
 */
declare function getIPRMCDbfetchAccessions(sssDataObj: SSSResultModel, numberHits?: number): string;
/**
 * Validates and transforms SSSResultModel data into a Dbfetch URL for IPMC XML.
 * @function validateSubmittedDbfetchInput
 * @param {SSSResultModel} sssDataObj - The SSSResultModel object containing hit data.
 * @param {number} [numberHits=30] - The maximum number of hits to include (defaults to 30).
 * @returns {string} - The Dbfetch URL for fetching IPMC XML data based on accessions.
 * @description Extracts accessions from the SSSResultModel using getIPRMCDbfetchAccessions
 * and generates a Dbfetch URL with getIPRMCDbfetchURL.
 * @see getIPRMCDbfetchAccessions - Function to extract accessions.
 * @see getIPRMCDbfetchURL - Function to generate the Dbfetch URL.
 * @example
 * const sssData = { hits: [{ hit_acc: 'P12345' }, { hit_acc: 'P67890' }] };
 * console.log(validateSubmittedDbfetchInput(sssData, 2));
 * // Outputs: "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=P12345,P67890;format=iprmcxml;style=raw"
 */
declare function validateSubmittedDbfetchInput(sssDataObj: SSSResultModel, numberHits?: number): string;
/**
 * Converts IPMC XML data into a flattened IPRMCResultModelFlat object.
 * @function getIPRMCDataModelFlatFromXML
 * @param {string} iprmcXML - The IPMC XML string to parse.
 * @param {number} [numberHits=30] - The maximum number of hits to process (defaults to 30).
 * @returns {IPRMCResultModelFlat} - The flattened IPRMC data model.
 * @description Parses the IPMC XML into an IPRMCResultModel using parseXMLData,
 * then flattens it with getFlattenIPRMCDataModel.
 * @see parseXMLData - Function to parse XML into JSON.
 * @see getFlattenIPRMCDataModel - Function to flatten the IPRMC data.
 * @example
 * const xml = "<interpromatch><protein>...</protein></interpromatch>";
 * const flatData = getIPRMCDataModelFlatFromXML(xml);
 * console.log(flatData);
 */
declare function getIPRMCDataModelFlatFromXML(iprmcXML: string, numberHits?: number): IPRMCResultModelFlat;
/**
 * Converts a domain database name to a standardized string representation.
 * @function domainDatabaseNameToString
 * @param {string} domainName - The domain database name to convert.
 * @returns {string} - The standardized name of the domain database, or 'Unclassified' if unrecognized.
 * @description Maps various domain database identifiers (case-insensitive) to a consistent format.
 * Supports InterPro, CATH-Gene3D, CDD, PANTHER, HAMAP, Pfam, PIRSF, PRINTS, PROSITE profiles/patterns,
 * SFLD, SMART, SUPERFAMILY, TIGRFAMs, and PRODOM.
 * @example
 * console.log(domainDatabaseNameToString('PFAM')); // Outputs: "Pfam"
 * console.log(domainDatabaseNameToString('unknown')); // Outputs: "Unclassified"
 */
declare function domainDatabaseNameToString(domainName: string): string;
/**
 * Extracts unique domain database names from an IPRMCResultModelFlat object.
 * @function getUniqueIPRMCDomainDatabases
 * @param {IPRMCResultModelFlat} dataObj - The flattened IPRMC data model.
 * @param {string[]} proteinIdList - List of protein IDs to process.
 * @returns {string[]} - An array of unique domain database names.
 * @description Iterates over the specified proteins in the IPRMCResultModelFlat,
 * extracting the database name (before '_') from each match and returning unique values.
 * @example
 * const data = { 'P12345': { matches: ['Pfam_PF0001', 'CDD_CD0002'] } };
 * const proteins = ['P12345'];
 * console.log(getUniqueIPRMCDomainDatabases(data, proteins));
 * // Outputs: ["Pfam", "CDD"]
 */
declare function getUniqueIPRMCDomainDatabases(dataObj: IPRMCResultModelFlat, proteinIdList: string[]): string[];
/**
 * Generates a URL for a domain database entry based on its ID and name.
 * @function getDomainURLbyDatabase
 * @param {string} domainID - The domain identifier (e.g., 'IPR000123').
 * @param {string} domainName - The standardized domain database name (from domainDatabaseNameToString).
 * @returns {string} - The URL for the domain entry, or an empty string if unrecognized.
 * @description Constructs a URL for InterPro or member database entries based on domainID and domainName.
 * Supports InterPro, CATH-Gene3D, CDD, PANTHER, HAMAP, Pfam, PIRSF, PRINTS, PROSITE profiles/patterns,
 * SFLD, SMART, SUPERFAMILY, TIGRFAMs, and PRODOM.
 * @see domainDatabaseNameToString - Function to standardize domain names.
 * @example
 * console.log(getDomainURLbyDatabase('IPR000123', 'InterPro'));
 * // Outputs: "https://www.ebi.ac.uk/interpro/entry/InterPro/IPR000123"
 */
declare function getDomainURLbyDatabase(domainID: string, domainName: string): string;
/**
 * Manages tooltip state and associated data for a given coordinate.
 * @function tooltipState
 * @param {number} coord - The coordinate key to manage state for.
 * @param {object} data - The data to associate with the coordinate when toggled on.
 * @returns {Record<number, { state: boolean; data: any }>} - The updated coordStates object for the given coordinate.
 * @description Toggles the boolean state for a coordinate in a global coordStates record.
 * Initializes the state to false if not present, and updates the associated data if provided when state is true.
 * @example
 * console.log(tooltipState(1, { info: 'test' })); // Toggles state to true, sets data
 * console.log(tooltipState(1, undefined)); // Toggles state to false, keeps previous data
 */
declare let coordStates: Record<number, {
    state: boolean;
    data: any;
}>;
declare function tooltipState(coord: number, data: object): typeof coordStates;

declare class VisualOutput extends BasicCanvasRenderer {
    private dataObj;
    private topPadding;
    private queryLen;
    private subjLen;
    private startQueryPixels;
    private endQueryPixels;
    private startEvalPixels;
    private startSubjPixels;
    private endSubjPixels;
    private gradientSteps;
    private queryFactor;
    private subjFactor;
    constructor(element: string | HTMLCanvasElement, dataObj: SSSResultModel, renderOptions: RenderOptions);
    render(): void;
    private loadInitalProperties;
    private loadInitialCoords;
    private drawHeaderGroup;
    private drawContentGroup;
    private drawDynamicContentGroup;
    private drawColorScaleGroup;
    private drawFooterGroup;
    private wrapCanvas;
}

declare class FunctionalPredictions extends BasicCanvasRenderer {
    private sssDataObj;
    private iprmcDataObj;
    domainDatabaseList: string[];
    private topPadding;
    private queryStart;
    private queryEnd;
    private startPixels;
    private endPixels;
    private gradientSteps;
    currentDomainDatabase: string | undefined;
    uniqueDomainDatabases: string[];
    currentDomainDatabaseDisabled: boolean;
    constructor(element: string | HTMLCanvasElement, sssDataObj: SSSResultModel, iprmcDataObj: IPRMCResultModelFlat, renderOptions: RenderOptions, domainDatabaseList?: string[]);
    render(): void;
    private loadInitalProperties;
    private loadInitialCoords;
    private loadIPRMCProperties;
    private drawHeaderGroup;
    private drawContentGroup;
    private drawPredictionsGroup;
    private drawDynamicContentGroup;
    private drawColorScaleGroup;
    private drawFooterGroup;
    private wrapCanvas;
}

/**
 * Adds mouseover event to a fabric object to display a tooltip and underline the text.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to modify on hover.
 * @param {string} sequence - The sequence to display in the tooltip.
 * @param {string} URL - The URL to link to.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 * @param {boolean} [_tooltip=true] - Whether to show the tooltip.
 */
declare function mouseOverText(fabricObj: fabric.Object, textObj: TextType, sequence: string, URL: string, renderOptions: RenderOptions, _this: VisualOutput | FunctionalPredictions | any, _tooltip?: boolean): void;
/**
 * Adds mousedown event to a fabric object to open a link in a new tab.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {string} href - The URL to open.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseDownLink(fabricObj: fabric.Object, href: string, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseout event to a fabric object to reset the text style.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to reset on mouseout.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseOutText(fabricObj: fabric.Object, textObj: TextType, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseover event to a fabric object to display a domain tooltip.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {Hsp | IprMatchFlat} domain - The domain object (Hsp or IprMatchFlat).
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseOverDomain(fabricObj: fabric.Object, startPixels: number, endPixels: number, seq_from: number, seq_to: number, domain: Hsp | IprMatchFlat, renderOptions: RenderOptions, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mousedown event to a fabric object to toggle a domain tooltip.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {Hsp | IprMatchFlat} domain - The domain object (Hsp or IprMatchFlat).
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseClickDomain(fabricObj: fabric.Object, startPixels: number, endPixels: number, seq_from: number, seq_to: number, domain: Hsp | IprMatchFlat, renderOptions: RenderOptions, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseout event to a fabric object to reset the canvas.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseOutDomain(fabricObj: fabric.Object, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseover event to a fabric checkbox to change its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to modify on hover.
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseOverCheckbox(fabricObj: fabric.Object, textObj: TextType, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mousedown event to a fabric checkbox to update the state.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum} value - The value to set.
 * @param {string} inputEnum - The type of input (ColorSchemeEnum, ScaleTypeEnum, or ScoreTypeEnum).
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseDownCheckbox(fabricObj: fabric.Object, value: ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum, inputEnum: string, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseout event to a fabric checkbox to reset its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {TextType} textObj - The text object to reset on mouseout.
 * @param {ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum} value - The value to check against.
 * @param {string} inputEnum - The type of input (ColorSchemeEnum, ScaleTypeEnum, or ScoreTypeEnum).
 * @param {VisualOutput | FunctionalPredictions | any} _this - The context (VisualOutput or FunctionalPredictions).
 */
declare function mouseOutCheckbox(fabricObj: fabric.Object, textObj: TextType, value: ColorSchemeEnum | ScaleTypeEnum | ScoreTypeEnum, inputEnum: string, _this: VisualOutput | FunctionalPredictions | any): void;
/**
 * Adds mouseover event to a fabric domain checkbox to change its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {RectType} rectObj - The rectangle object to modify on hover.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
declare function mouseOverDomainCheckbox(fabricObj: fabric.Object, rectObj: RectType, currentDomainDatabase: string, _this: FunctionalPredictions): void;
/**
 * Adds mousedown event to a fabric domain checkbox to update the state.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
declare function mouseDownDomainCheckbox(fabricObj: fabric.Object, currentDomainDatabase: string, _this: FunctionalPredictions): void;
/**
 * Adds mouseout event to a fabric domain checkbox to reset its appearance.
 * @param {fabric.Object} fabricObj - The fabric object to attach the event to.
 * @param {RectType} rectObj - The rectangle object to reset on mouseout.
 * @param {string} currentDomainDatabase - The current domain database.
 * @param {FunctionalPredictions} _this - The context (FunctionalPredictions).
 */
declare function mouseOutDomainCheckbox(fabricObj: fabric.Object, rectObj: RectType, currentDomainDatabase: string, _this: FunctionalPredictions): void;

/**
 * A gradient color map for heatmap visualization.
 * @type {ColorType}
 */
declare const heatmapGradient: ColorType;
/**
 * A gradient color map for greyscale visualization.
 * @type {ColorType}
 */
declare const greyscaleGradient: ColorType;
/**
 * A gradient color map for sequential visualization.
 * @type {ColorType}
 */
declare const sequentialGradient: ColorType;
/**
 * A gradient color map for divergent visualization.
 * @type {ColorType}
 */
declare const divergentGradient: ColorType;
/**
 * A gradient color map for qualitative visualization.
 * @type {ColorType}
 */
declare const qualitativeGradient: ColorType;
/**
 * Creates a linear gradient for qualitative visualization.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
declare function colorQualitativeGradient(start: number, end: number): fabric.Gradient;
/**
 * A gradient color map for NCBI BLAST visualization.
 * @type {ColorType}
 */
declare const ncbiBlastGradient: ColorType;
/**
 * Creates a linear gradient for NCBI BLAST visualization.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
declare function colorNcbiBlastGradient(start: number, end: number): fabric.Gradient;
/**
 * Retrieves the appropriate color gradient based on the specified color scheme.
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {ColorType} The corresponding color gradient.
 */
declare function getColorType(colorScheme: ColorSchemeEnum): ColorType;
/**
 * Creates a generic linear gradient based on the specified color scheme.
 * @param {number} start - The starting x-coordinate of the gradient.
 * @param {number} end - The ending x-coordinate of the gradient.
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {fabric.Gradient} A Fabric.js gradient object.
 */
declare function colorGenericGradient(start: number, end: number, colorScheme: ColorSchemeEnum): fabric.Gradient;

/**
 * Calculates an RGB color based on a logarithmic gradient.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
declare function getRgbColorLogGradient(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum): string;
/**
 * Calculates an RGB color based on a linear gradient.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
declare function getRgbColorLinearGradient(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum): string;
/**
 * Calculates an RGB color based on fixed gradient steps.
 * @param {number} score - The score to determine the color.
 * @param {number[]} gradientSteps - The steps for the gradient (assumes length is 5).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {string} The RGB color as a string.
 */
declare function getRgbColorFixed(score: number, gradientSteps: number[], colorScheme: ColorSchemeEnum): string;
/**
 * Calculates gradient steps based on the provided parameters.
 * @param {number} minScore - The minimum score.
 * @param {number} maxSCore - The maximum score.
 * @param {number} minScoreNotZero - The minimum non-zero score.
 * @param {ScaleTypeEnum} scaleType - The scale type (fixed or dynamic).
 * @param {ScoreTypeEnum} scoreType - The type of score (e.g., bitscore, similarity, etc.).
 * @param {ColorSchemeEnum} colorScheme - The color scheme to use.
 * @returns {number[]} An array of gradient steps.
 */
declare function getGradientSteps(minScore: number, maxSCore: number, minScoreNotZero: number, scaleType: ScaleTypeEnum, scoreType: ScoreTypeEnum, colorScheme: ColorSchemeEnum): number[];
/**
 * Converts HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue).
 * @param {number} h - Hue (0–1).
 * @param {number} s - Saturation (0–1).
 * @param {number} v - Value (0–1).
 * @returns {[number, number, number]} The RGB color as an array.
 */
declare function HSVtoRGB(h: number, s: number, v: number): number[];
/**
 * Returns a color based on the database name.
 * @param {string} domainName - The name of the database.
 * @returns {string} The RGB color as a string.
 */
declare function colorByDatabaseName(domainName: string): string;

/**
 * Calculates a padding factor based on the length of the input string.
 * @param {string} inputString - The input string to determine the padding factor.
 * @returns {number} The calculated padding factor.
 */
declare function getTextLegendPaddingFactor(inputString: string): number;
/**
 * Calculates the total number of pixels based on the provided lengths and widths.
 * @param {number} queryLen - The length of the query.
 * @param {number} subjLen - The length of the subject.
 * @param {number} varLen - The variable length.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentScoringWidth - The width of the scoring content.
 * @returns {number} The total number of pixels.
 */
declare function getTotalPixels(queryLen: number, subjLen: number, varLen: number, contentWidth: number, contentScoringWidth: number): number;
/**
 * Calculates the pixel coordinates for the start and end positions.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentLabelWidth - The width of the content label.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number]} An array containing the start and end pixel coordinates.
 */
declare function getPixelCoords(contentWidth: number, contentLabelWidth: number, marginWidth: number): number[];
/**
 * Calculates the pixel coordinates for query and subject regions.
 * @param {number} queryLen - The length of the query.
 * @param {number} subjLen - The length of the subject.
 * @param {number} subjHspLen - The length of the subject HSP.
 * @param {number} contentWidth - The width of the content.
 * @param {number} contentScoringWidth - The width of the scoring content.
 * @param {number} contentLabelWidth - The width of the content label.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number, number, number]} An array containing the start and end
 * pixel coordinates for query and subject regions.
 */
declare function getQuerySubjPixelCoords(queryLen: number, subjLen: number, subjHspLen: number, contentWidth: number, contentScoringWidth: number, contentLabelWidth: number, marginWidth: number): number[];
/**
 * Calculates the pixel coordinates for a domain region.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} hitLen - The length of the hit.
 * @param {number} startDomain - The starting position of the domain.
 * @param {number} endDomain - The ending position of the domain.
 * @param {number} marginWidth - The width of the margin.
 * @returns {[number, number]} An array containing the start and end pixel coordinates for the domain.
 */
declare function getDomainPixelCoords(startPixels: number, endPixels: number, hitLen: number, startDomain: number, endDomain: number, marginWidth: number): [number, number];

/**
 * Draws a header text group for the visualization.
 * @param {SSSResultModel} dataObj - The data object containing program, version, and database information.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the header text.
 */
declare function drawHeaderTextGroup(dataObj: SSSResultModel, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a header link text for the sequence.
 * @param {SSSResultModel} dataObj - The data object containing sequence information.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, TextType]} A tuple containing the Fabric.js text object and its type.
 */
declare function drawHeaderLinkText(dataObj: SSSResultModel, renderOptions: RenderOptions, topPadding: number): [fabric.Text, TextType];
/**
 * Draws a content header text group for the visualization.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the content header text.
 */
declare function drawContentHeaderTextGroup(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws line tracks for query and subject regions.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the line tracks.
 */
declare function drawLineTracksQuerySubject(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws line tracks for a single region.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the line tracks.
 */
declare function drawLineTracks(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a domain line track.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Line} A Fabric.js line object.
 */
declare function drawDomainLineTracks(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Line;
/**
 * Draws a content footer text group.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the footer text.
 */
declare function drawContentFooterTextGroup(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a content query and subject footer text group.
 * @param {CoordsValues} coordValues - The coordinate values for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the footer text.
 */
declare function drawContentQuerySubjFooterTextGroup(coordValues: CoordsValues, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a "No hits found" text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawNoHitsFoundText(renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws content sequence information text.
 * @param {number} maxIDLen - The maximum length of the hit ID.
 * @param {Hit} hit - The hit object containing ID and description.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, fabric.Text, TextType]} A tuple containing the Fabric.js text objects and their type.
 */
declare function drawContentSequenceInfoText(maxIDLen: number, hit: Hit, renderOptions: RenderOptions, topPadding: number): [fabric.Text, fabric.Text, TextType];
/**
 * Draws an HSP notice text.
 * @param {number} totalNumberHsps - The total number of HSPs.
 * @param {number} numberHsps - The number of HSPs being displayed.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawHspNoticeText(totalNumberHsps: number, numberHsps: number, renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws a score text for HSPs.
 * @param {number} startEvalPixels - The starting pixel position for the score.
 * @param {Hsp} hsp - The HSP object containing score information.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawScoreText(startEvalPixels: number, hsp: Hsp, renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws domain rectangles for query and subject regions.
 * @param {number} startPixels - The domain's starting pixel position.
 * @param {number} endPixels - The domain's ending pixel position.
 * @param {number} topPadding - The top padding for positioning.
 * @param {string} fill - The fill color for the domain rectangles.
 * @returns {[fabric.Rect, fabric.Rect]} A tuple containing the Fabric.js rectangle objects.
 */
declare function drawDomain(startPixels: number, endPixels: number, topPadding: number, fill: string): fabric.Rect;
/**
 * Draws domain rectangles for query and subject regions.
 * @param {number} startQueryPixels - The starting pixel position for the query domain.
 * @param {number} endQueryPixels - The ending pixel position for the query domain.
 * @param {number} startSubjPixels - The starting pixel position for the subject domain.
 * @param {number} endSubjPixels - The ending pixel position for the subject domain.
 * @param {number} topPadding - The top padding for positioning.
 * @param {string} fill - The fill color for the domain rectangles.
 * @returns {[fabric.Rect, fabric.Rect]} A tuple containing the Fabric.js rectangle objects.
 */
declare function drawDomainQueySubject(startQueryPixels: number, endQueryPixels: number, startSubjPixels: number, endSubjPixels: number, topPadding: number, fill: string): [fabric.Rect, fabric.Rect];
/**
 * Draws domain tooltips for HSPs.
 * @param {number} startHspPixels - The starting pixel position for the HSP.
 * @param {number} endHspPixels - The ending pixel position for the HSP.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {Hsp} hsp - The HSP object containing score information.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the tooltip.
 */
declare function drawDomainTooltips(startHspPixels: number, endHspPixels: number, seq_from: number, seq_to: number, hsp: Hsp, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a scale label text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @param {string} label - The label text.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawScaleLabelText(renderOptions: RenderOptions, topPadding: number, label: string): fabric.Text;
/**
 * Draws scale type checkbox text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, fabric.Text, TextType, fabric.Text, fabric.Text, TextType]} A tuple containing the Fabric.js text objects and their type.
 */
declare function drawScaleTypeCheckBoxText(renderOptions: RenderOptions, topPadding: number): [fabric.Text, fabric.Text, TextType, fabric.Text, fabric.Text, TextType];
/**
 * Draws score type checkbox text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType
 * ]} A tuple containing the Fabric.js text objects and their type.
 */
declare function drawScoreTypeCheckBoxText(renderOptions: RenderOptions, topPadding: number): [
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType
];
/**
 * Draws color scheme checkbox text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType,
 *   fabric.Text,
 *   fabric.Text,
 *   TextType
 * ]} A tuple containing the Fabric.js text objects and their type.
 */
declare function drawColorSchemeCheckBoxText(renderOptions: RenderOptions, topPadding: number): [
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType,
    fabric.Text,
    fabric.Text,
    TextType
];
/**
 * Draws a scale score text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawScaleScoreText(renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws a scale color gradient.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Rect} A Fabric.js rectangle object representing the gradient.
 */
declare function drawScaleColorGradient(renderOptions: RenderOptions, topPadding: number): fabric.Rect;
/**
 * Draws a line axis with 5 buckets.
 * @param {number} startGradPixels - The starting pixel position for the gradient.
 * @param {number} o25GradPixels - The 25% pixel position for the gradient.
 * @param {number} o50GradPixels - The 50% pixel position for the gradient.
 * @param {number} o75GradPixels - The 75% pixel position for the gradient.
 * @param {number} endGradPixels - The ending pixel position for the gradient.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the line axis.
 */
declare function drawLineAxis5Buckets(startGradPixels: number, o25GradPixels: number, o50GradPixels: number, o75GradPixels: number, endGradPixels: number, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws a line axis with 6 buckets.
 * @param {number} startGradPixels - The starting pixel position for the gradient.
 * @param {number} o20GradPixels - The 20% pixel position for the gradient.
 * @param {number} o40GradPixels - The 40% pixel position for the gradient.
 * @param {number} o60GradPixels - The 60% pixel position for the gradient.
 * @param {number} o80GradPixels - The 80% pixel position for the gradient.
 * @param {number} endGradPixels - The ending pixel position for the gradient.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the line axis.
 */
declare function drawLineAxis6Buckets(startGradPixels: number, o20GradPixels: number, o40GradPixels: number, o60GradPixels: number, o80GradPixels: number, endGradPixels: number, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws scale tick labels for 5 buckets.
 * @param {number[]} gradientSteps - The gradient steps for the scale.
 * @param {number} leftPadding - The left padding for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the tick labels.
 */
declare function drawScaleTick5LabelsGroup(gradientSteps: number[], leftPadding: number, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws scale tick labels for 4 buckets.
 * @param {number[]} gradientSteps - The gradient steps for the scale.
 * @param {number} leftPadding - The left padding for positioning.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the tick labels.
 */
declare function drawScaleTick4LabelsGroup(gradientSteps: number[], leftPadding: number, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws footer text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, TextType]} A tuple containing the Fabric.js text object and its type.
 */
declare function drawFooterText(renderOptions: RenderOptions, topPadding: number): [fabric.Text, TextType];
/**
 * Draws footer link text.
 * @param {string} url - The URL to link to.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, TextType]} A tuple containing the Fabric.js text object and its type.
 */
declare function drawFooterLinkText(url: string, renderOptions: RenderOptions, topPadding: number): [fabric.Text, TextType];
/**
 * Draws a canvas wrapper stroke.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @returns {fabric.Rect} A Fabric.js rectangle object representing the stroke.
 */
declare function drawCanvasWrapperStroke(renderOptions: RenderOptions): fabric.Rect;
/**
 * Draws a content title text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawContentTitleText(renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws a content suppress text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @param {number} numberHits - The number of hits being displayed.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawContentSupressText(renderOptions: RenderOptions, topPadding: number, numberHits: number): fabric.Text;
/**
 * Draws protein features text.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Text} A Fabric.js text object.
 */
declare function drawProteinFeaturesText(renderOptions: RenderOptions, topPadding: number): fabric.Text;
/**
 * Draws a domain checkbox.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @param {number} leftPadding - The left padding for positioning.
 * @param {string} currentDomainDatabase - The current domain database.
 * @returns {[fabric.Rect, fabric.Text, RectType, TextType]} A tuple containing the Fabric.js rectangle and text objects and their types.
 */
declare function drawDomainCheckbox(renderOptions: RenderOptions, topPadding: number, leftPadding: number, currentDomainDatabase: string): [fabric.Rect, fabric.Text, RectType, TextType];
/**
 * Draws a hit transparent box.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} topPadding - The top padding for positioning.
 * @param {string} fill - The fill color for the box.
 * @param {number} height - The height of the box.
 * @returns {fabric.Rect} A Fabric.js rectangle object.
 */
declare function drawHitTransparentBox(startPixels: number, endPixels: number, topPadding: number, fill: string, height: number): fabric.Rect;
/**
 * Draws content domain information text.
 * @param {string} domainID - The domain ID.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {[fabric.Text, fabric.Text, TextType]} A tuple containing the Fabric.js text objects and their type.
 */
declare function drawContentDomainInfoText(domainID: string, renderOptions: RenderOptions, topPadding: number): [fabric.Text, fabric.Text, TextType];
/**
 * Draws domain rectangles.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} topPadding - The top padding for positioning.
 * @param {string} color - The color of the domain rectangles.
 * @returns {fabric.Rect} A Fabric.js rectangle object.
 */
declare function drawDomains(startPixels: number, endPixels: number, topPadding: number, color: string): fabric.Rect;
/**
 * Draws domain information tooltips.
 * @param {number} startPixels - The starting pixel position.
 * @param {number} endPixels - The ending pixel position.
 * @param {number} seq_from - The starting sequence position.
 * @param {number} seq_to - The ending sequence position.
 * @param {IprMatchFlat} domain - The domain object containing information.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the tooltip.
 */
declare function drawDomainInfoTooltips(startPixels: number, endPixels: number, seq_from: number, seq_to: number, domain: IprMatchFlat, renderOptions: RenderOptions, topPadding: number): fabric.Group;
/**
 * Draws URL information tooltips.
 * @param {number} startPixels - The starting pixel position.
 * @param {string} sequence - The sequence to display.
 * @param {string} URL - The URL to link to.
 * @param {RenderOptions} renderOptions - The rendering options.
 * @param {number} topPadding - The top padding for positioning.
 * @returns {fabric.Group} A Fabric.js group containing the tooltip.
 */
declare function drawURLInfoTooltip(startPixels: number, sequence: string, URL: string, renderOptions: RenderOptions, topPadding: number): fabric.Group;

export { BasicCanvasRenderer, ColorSchemeEnum, type ColorType, type CoordsValues, DataModelEnum, FunctionalPredictions, HSVtoRGB, type Hit, type Hsp, type IPRMCResultModel, type IPRMCResultModelFlat, type IprMatchFlat, type IprMatchesFlat, type JobIdValidable, type LineType, ObjectCache, type ObjectType, type RectType, type RenderOptions, type SSSResultModel, ScaleTypeEnum, ScoreTypeEnum, type TextType, VisualOutput, colorByDatabaseName, colorGenericGradient, colorNcbiBlastGradient, colorQualitativeGradient, countDecimals, dataAsType, divergentGradient, domainDatabaseNameToString, drawCanvasWrapperStroke, drawColorSchemeCheckBoxText, drawContentDomainInfoText, drawContentFooterTextGroup, drawContentHeaderTextGroup, drawContentQuerySubjFooterTextGroup, drawContentSequenceInfoText, drawContentSupressText, drawContentTitleText, drawDomain, drawDomainCheckbox, drawDomainInfoTooltips, drawDomainLineTracks, drawDomainQueySubject, drawDomainTooltips, drawDomains, drawFooterLinkText, drawFooterText, drawHeaderLinkText, drawHeaderTextGroup, drawHitTransparentBox, drawHspNoticeText, drawLineAxis5Buckets, drawLineAxis6Buckets, drawLineTracks, drawLineTracksQuerySubject, drawNoHitsFoundText, drawProteinFeaturesText, drawScaleColorGradient, drawScaleLabelText, drawScaleScoreText, drawScaleTick4LabelsGroup, drawScaleTick5LabelsGroup, drawScaleTypeCheckBoxText, drawScoreText, drawScoreTypeCheckBoxText, drawURLInfoTooltip, fetchData, getColorType, getDomainPixelCoords, getDomainURLbyDatabase, getGradientSteps, getIPRMCDataModelFlatFromXML, getIPRMCDbfetchAccessions, getIPRMCDbfetchURL, getJdispatcherJsonURL, getPixelCoords, getQuerySubjPixelCoords, getRgbColorFixed, getRgbColorLinearGradient, getRgbColorLogGradient, getTextLegendPaddingFactor, getTotalPixels, getUniqueIPRMCDomainDatabases, greyscaleGradient, heatmapGradient, jobIdDefaults, lineDefaults, mouseClickDomain, mouseDownCheckbox, mouseDownDomainCheckbox, mouseDownLink, mouseOutCheckbox, mouseOutDomain, mouseOutDomainCheckbox, mouseOutText, mouseOverCheckbox, mouseOverDomain, mouseOverDomainCheckbox, mouseOverText, ncbiBlastGradient, numberToString, objectDefaults, type posnumber, qualitativeGradient, rectDefaults, sequentialGradient, textDefaults, toPositiveNumber, tooltipState, validateJobId, validateSubmittedDbfetchInput, validateSubmittedJobIdInput };
