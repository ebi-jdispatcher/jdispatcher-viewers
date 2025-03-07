import { fabric } from 'fabric';
import { xml2json } from 'xml-js';
import { SSSResultModel, IPRMCResultModel, IPRMCResultModelFlat, IprMatchesFlat, IprMatchFlat } from './data-model';
import {
  JobIdValidable,
  ColorSchemeEnum,
  jobIdDefaults,
  ScoreTypeEnum,
  ScaleTypeEnum,
  DataModelEnum,
} from './custom-types';

/**
 * A base class for rendering a Fabric.js canvas with customizable properties.
 * @class BasicCanvasRenderer
 * @description Provides foundational functionality for rendering a canvas, including frame sizing and content rendering.
 */
export class BasicCanvasRenderer {
  /**
   * The Fabric.js canvas instance, either interactive or static.
   * @type {fabric.Canvas | fabric.StaticCanvas}
   * @public
   */
  public canvas: fabric.Canvas | fabric.StaticCanvas;

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
  public colorScheme: ColorSchemeEnum;

  /**
   * The type of scale used in the canvas.
   * @type {ScaleTypeEnum}
   * @public
   */
  public scaleType: ScaleTypeEnum;

  /**
   * The type of scoring mechanism.
   * @type {ScoreTypeEnum}
   * @public
   */
  public scoreType: ScoreTypeEnum;

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
  protected fontWeigth: string; // Note: Likely a typo, should be `fontWeight`

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
  constructor(private element: string | HTMLCanvasElement) {}

  /**
   * Initializes the Fabric.js canvas instance based on the staticCanvas property.
   * @protected
   * @returns {void}
   */
  protected getFabricCanvas() {
    const startupDef = {
      defaultCursor: 'default',
      moveCursor: 'default',
      hoverCursor: 'default',
    };
    if (this.staticCanvas) {
      this.canvas = new fabric.StaticCanvas(this.element, startupDef);
    } else {
      this.canvas = new fabric.Canvas(this.element, startupDef);
    }
  }

  /**
   * Sets the width and height of the canvas.
   * @protected
   * @returns {void}
   */
  protected setFrameSize() {
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
  }

  /**
   * Renders all objects on the canvas.
   * @protected
   * @returns {void}
   */
  protected renderCanvas() {
    this.canvas.renderAll();
  }
}

/**
 * A generic cache for storing and retrieving objects by string keys.
 * @class ObjectCache
 * @template T - The type of objects stored in the cache.
 * @description Uses a Map to efficiently cache objects, allowing retrieval, addition, and deletion by key.
 */
export class ObjectCache<T> {
  /**
   * The internal Map storing cached key-value pairs.
   * @type {Map<string, T>}
   * @private
   */
  private values: Map<string, T> = new Map<string, T>();

  /**
   * Retrieves a cached object by its key.
   * @param {string} key - The key associated with the cached object.
   * @returns {T | undefined} - The cached object if found, otherwise undefined.
   */
  public get(key: string): T | undefined {
    const hasKey = this.values.has(key);
    if (hasKey) {
      return this.values.get(key) as T;
    }
    return;
  }

  /**
   * Adds an object to the cache if it doesn’t already exist.
   * @param {string} key - The key to associate with the object.
   * @param {T} value - The object to cache.
   * @returns {void}
   */
  public put(key: string, value: T) {
    const hasKey = this.values.has(key);
    if (!hasKey) {
      this.values.set(key, value);
    }
  }

  /**
   * Removes an object from the cache by its key.
   * @param {string} key - The key of the object to remove.
   * @returns {void}
   */
  public delete(key: string) {
    const hasKey = this.values.has(key);
    if (hasKey) {
      this.values.delete(key);
    }
  }
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
export function countDecimals(n: number): number {
  // Return 0 for non-finite numbers (NaN, Infinity, -Infinity)
  if (!Number.isFinite(n)) return 0;
  // Return 0 if the number is an integer
  if (Math.floor(n) === n) return 0;
  // Count decimal places by converting to string and splitting
  return n.toString().split('.')[1]?.length || 0;
}

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
export function numberToString(n: number): string {
  if (!Number.isFinite(n)) {
    return '0';
  } else if (n === 0.0) {
    return n.toString();
  } else if (n < 0.0001 || n > 10000) {
    return n.toExponential(2);
  } else if (Number.isInteger(n)) {
    return n + '.0';
  } else if (countDecimals(n) > 2) {
    return n.toFixed(2);
  } else {
    return n.toString();
  }
}

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
export async function fetchData(dataLoc: string, format: string = 'json'): Promise<any | string> {
  const response = await fetch(dataLoc);
  if (!response.ok) {
    throw new Error(`Could not retrieve data from ${dataLoc}`);
  }
  if (format === 'json') {
    return response.json();
  }
  return response.text();
}

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
export function dataAsType(
  data: any,
  dtype: DataModelEnum
): SSSResultModel | IPRMCResultModel | IPRMCResultModelFlat | any {
  if (dtype === DataModelEnum.SSSResultModel) {
    return data as SSSResultModel;
  } else if (dtype === DataModelEnum.IPRMCResultModel) {
    return data as IPRMCResultModel;
  } else if (dtype === DataModelEnum.IPRMCResultModelFlat) {
    return data as IPRMCResultModelFlat;
  } else {
    return data;
  }
}

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
export function getJdispatcherJsonURL(jobId: string): string {
  // Enforce jobIdDefaults pattern (uncomment to enable strict validation)
  if (!jobIdDefaults.pattern?.test(jobId)) {
    throw new Error('Invalid jobId format: does not match expected pattern');
  }

  const toolName = jobId.split('-')[0];
  if (jobId === 'mock_jobid-I20200317-103136-0485-5599422-np2') {
    // mock jobId
    return 'https://raw.githubusercontent.com/ebi-jdispatcher/jdispatcher-viewers/master/src/testdata/ncbiblast.json';
  } else if (jobId.endsWith('-np2')) {
    // wwwdev server (-np2$)
    return `https://wwwdev.ebi.ac.uk/Tools/services/rest/${toolName}/result/${jobId}/json`;
  } else {
    // production servers (-p1m$ and -p2m$)
    return `https://www.ebi.ac.uk/Tools/services/rest/${toolName}/result/${jobId}/json`;
  }
}

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
export function validateJobId(jobIdObj: JobIdValidable, verbose: boolean = false): boolean {
  let isValid = true;
  if (jobIdObj.required) {
    isValid = isValid && jobIdObj.value.trim().length !== 0;
  }
  if (jobIdObj.minLength) {
    isValid = isValid && jobIdObj.value.trim().length >= jobIdObj.minLength;
  }
  if (jobIdObj.maxLength) {
    isValid = isValid && jobIdObj.value.trim().length <= jobIdObj.maxLength;
  }
  if (jobIdObj.pattern) {
    isValid = isValid && jobIdObj.pattern.test(jobIdObj.value.trim());
  }
  if (verbose) {
    if (isValid) {
      console.log(`JobId "${jobIdObj.value}" is valid!`);
    } else {
      console.log(`JobId "${jobIdObj.value}" is not valid!`);
    }
  }
  return isValid;
}

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
export function validateSubmittedJobIdInput(data: string): string {
  // check if input is a jobId
  const jobId = { ...jobIdDefaults };
  jobId.value = data;
  // if so, get the service URL, else use as is
  if (
    !jobId.value.startsWith('http') &&
    !jobId.value.includes('/') &&
    !jobId.value.includes('./') &&
    validateJobId(jobId)
  ) {
    data = getJdispatcherJsonURL(data);
  }
  return data;
}

// InterPro Match Complete XML data (via Dbfetch)
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
export function getIPRMCDbfetchURL(accessions: string): string {
  if (!accessions || typeof accessions !== 'string') {
    throw new Error('Accessions must be a non-empty string');
  }
  const encodedAccessions = encodeURIComponent(accessions);
  return `https://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=iprmc;id=${encodedAccessions};format=iprmcxml;style=raw`;
}

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
export function getIPRMCDbfetchAccessions(sssDataObj: SSSResultModel, numberHits: number = 30): string {
  if (!sssDataObj?.hits || !Array.isArray(sssDataObj.hits)) return '';
  const maxHits = Math.max(0, numberHits);
  return sssDataObj.hits
    .slice(0, maxHits)
    .map(hit => hit.hit_acc)
    .join(',');
}

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
export function validateSubmittedDbfetchInput(sssDataObj: SSSResultModel, numberHits: number = 30): string {
  const accessions = getIPRMCDbfetchAccessions(sssDataObj, numberHits);
  return getIPRMCDbfetchURL(accessions);
}

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
export function getIPRMCDataModelFlatFromXML(iprmcXML: string, numberHits: number = 30): IPRMCResultModelFlat {
  const iprmcDataObj = parseXMLData(iprmcXML) as IPRMCResultModel;
  return getFlattenIPRMCDataModel(iprmcDataObj, numberHits);
}

/**
 * Parses XML data into a JSON object, typically an IPRMCResultModel.
 * @function parseXMLData
 * @param {string} data - The XML string to parse.
 * @returns {IPRMCResultModel | object} - The parsed JSON object, or an empty object if parsing fails.
 * @description Converts XML to JSON using xml2json with compact output and arrays.
 * Logs an error and returns an empty object if parsing fails (e.g., invalid XML).
 * @example
 * const xml = "<data><item>value</item></data>";
 * console.log(parseXMLData(xml)); // Outputs parsed JSON
 */
function parseXMLData(data: string): IPRMCResultModel | object {
  try {
    return JSON.parse(
      xml2json(data, {
        compact: true,
        spaces: 2,
        alwaysArray: true,
      })
    );
  } catch (error) {
    console.log('Cannot parse the resulting ' + 'Dbfetch response (likely not formatted XML)!');
    return {};
  }
}

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
export function domainDatabaseNameToString(domainName: string): string {
  domainName = domainName.toUpperCase();
  let domainNameEnum = 'Unclassified';
  if (domainName === 'IPR' || domainName === 'INTERPRO') {
    domainNameEnum = 'InterPro';
  } else if (domainName === 'CATHGENE3D' || domainName === 'CATH-GENE3D' || domainName === 'GENE3D') {
    domainNameEnum = 'CATH-Gene3D';
  } else if (domainName === 'CDD') {
    domainNameEnum = 'CDD';
  } else if (domainName === 'PANTHER') {
    domainNameEnum = 'PANTHER';
  } else if (domainName === 'HAMAP') {
    domainNameEnum = 'HAMAP';
  } else if (domainName === 'PFAM') {
    domainNameEnum = 'Pfam';
  } else if (domainName === 'PIRSF') {
    domainNameEnum = 'PIRSF';
  } else if (domainName === 'PRINTS') {
    domainNameEnum = 'PRINTS';
  } else if (domainName === 'PROSITE PROFILES' || domainName === 'PROSITE_PROFILES' || domainName === 'PROFILE') {
    domainNameEnum = 'PROSITE profiles';
  } else if (domainName === 'PROSITE PATTERNS' || domainName === 'PROSITE_PATTERNS' || domainName === 'PROSITE') {
    domainNameEnum = 'PROSITE patterns';
  } else if (domainName === 'SFLD') {
    domainNameEnum = 'SFLD';
  } else if (domainName === 'SMART') {
    domainNameEnum = 'SMART';
  } else if (domainName === 'SUPERFAMILY' || domainName === 'SSF') {
    domainNameEnum = 'SUPERFAMILY';
  } else if (domainName === 'TIGERFAMS') {
    domainNameEnum = 'TIGRFAMs';
  } else if (domainName === 'PRODOM') {
    domainNameEnum = 'PRODOM';
  }
  return domainNameEnum;
}

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
export function getUniqueIPRMCDomainDatabases(dataObj: IPRMCResultModelFlat, proteinIdList: string[]): string[] {
  const domainPredictions: string[] = [];
  for (const protein of proteinIdList) {
    for (const match of dataObj[`${protein}`]['matches']) {
      domainPredictions.push(match.split('_')[0]);
    }
  }
  return domainPredictions.filter((v, i, x) => x.indexOf(v) === i);
}

/**
 * Flattens an IPRMCResultModel into an IPRMCResultModelFlat structure.
 * @function getFlattenIPRMCDataModel
 * @param {IPRMCResultModel} dataObj - The IPRMC data model to flatten.
 * @param {number} numberHits - The maximum number of proteins to process.
 * @returns {IPRMCResultModelFlat} - The flattened IPRMC data model.
 * @description Processes up to numberHits proteins from the IPRMCResultModel,
 * extracting matches and organizing them into a flat structure with domain database names.
 * Uses domainDatabaseNameToString for consistent naming.
 * @example
 * const data = { interpromatch: [{ protein: [{ _attributes: { id: 'P12345' }, match: [...] }] }] };
 * console.log(getFlattenIPRMCDataModel(data, 1));
 */
function getFlattenIPRMCDataModel(dataObj: IPRMCResultModel, numberHits: number): IPRMCResultModelFlat {
  let tmpNumberHits = 0;
  let iprmcDataFlatObj: IPRMCResultModelFlat = {};
  for (const protein of dataObj['interpromatch'][0]['protein']) {
    tmpNumberHits++;
    if (tmpNumberHits <= numberHits) {
      let matches: string[] = [];
      let matchObjs: IprMatchesFlat = {};
      for (const match of protein['match']) {
        let matchObj: IprMatchFlat = {};
        if (match.ipr !== undefined) {
          const iprdomain = `${domainDatabaseNameToString(match._attributes.dbname)}_${match.ipr[0]._attributes.id}`;
          if (!matches.includes(iprdomain)) {
            matches.push(iprdomain);
          }
          if (!(iprdomain in matchObjs)) {
            matchObjs[iprdomain] = [];
          }
          matchObj = {
            id: match.ipr[0]._attributes.id,
            name: match.ipr[0]._attributes.name,
            dbname: domainDatabaseNameToString(match._attributes.dbname),
            type: match.ipr[0]._attributes.type,
            altid: match._attributes.id,
            altname: match._attributes.name,
            // altdbname: "InterPro",
            status: match._attributes.status,
            model: match._attributes.model,
            evd: match._attributes.evd,
            start: Number(match.lcn[0]._attributes.start),
            end: Number(match.lcn[0]._attributes.end),
            fragments: match.lcn[0]._attributes.fragments,
            score: match.lcn[0]._attributes.fragments,
          };
          matchObjs[iprdomain].push(matchObj);
        } else {
          const iprdomain = `${domainDatabaseNameToString(match._attributes.dbname)}_${match._attributes.id}`;
          if (!matches.includes(iprdomain)) {
            matches.push(iprdomain);
          }
          if (!(iprdomain in matchObjs)) {
            matchObjs[iprdomain] = [];
          }
          matchObj = {
            id: match._attributes.id,
            name: match._attributes.name,
            dbname: domainDatabaseNameToString(match._attributes.dbname),
            status: match._attributes.status,
            model: match._attributes.model,
            evd: match._attributes.evd,
            type: 'Unclassified',
            start: Number(match.lcn[0]._attributes.start),
            end: Number(match.lcn[0]._attributes.end),
            fragments: match.lcn[0]._attributes.fragments,
            score: match.lcn[0]._attributes.fragments,
          };
          matchObjs[iprdomain].push(matchObj);
        }
      }
      iprmcDataFlatObj[protein._attributes.id] = {
        id: protein._attributes.id,
        name: protein._attributes.name,
        length: Number(protein._attributes.length),
        matches: matches.sort(),
        match: matchObjs,
      };
    }
    // else {
    //     console.log(
    //         `Skipping protein as number of hits has reached ${numberHits}`
    //     );
    // }
  }
  return iprmcDataFlatObj;
}

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
export function getDomainURLbyDatabase(domainID: string, domainName: string): string {
  let domainURL = '';
  if (domainID.startsWith('IPR')) {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/InterPro/${domainID}`;
  } else if (domainName === 'CATH-Gene3D') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/cathgene3d/${domainID}`;
    // domainURL = `http://www.cathdb.info/version/latest/superfamily/${domainID}`;
  } else if (domainName === 'CDD') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/cdd/${domainID}`;
    // domainURL = `https://www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid=${domainID}`;
  } else if (domainName === 'PANTHER') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/panther/${domainID}`;
    // domainURL = `http://www.pantherdb.org/panther/family.do?clsAccession=${domainID}`;
  } else if (domainName === 'HAMAP') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/hamap/${domainID}`;
    // domainURL = `https://hamap.expasy.org/signature/${domainID}`;
  } else if (domainName === 'Pfam') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/pfam/${domainID}`;
    // domainURL = `https://pfam.xfam.org/family/${domainID}`;
  } else if (domainName === 'PIRSF') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/pirsf/${domainID}`;
    // domainURL = `https://pir.georgetown.edu/cgi-bin/ipcSF?id=${domainID}`;
  } else if (domainName === 'PRINTS') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prints/${domainID}`;
    // domainURL = `http://www.bioinf.manchester.ac.uk/cgi-bin/dbbrowser/sprint/searchprintss.cgi?prints_accn=${domainID}&display_opts=Prints&category=None&queryform=false&regexpr=off`;
  } else if (domainName === 'PROSITE profiles') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/profile/${domainID}`;
    // domainURL = `https://www.expasy.org/prosite/${domainID}`;
  } else if (domainName === 'PROSITE patterns') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prosite/${domainID}`;
    // domainURL = `https://www.expasy.org/prosite/${domainID}`;
  } else if (domainName === 'SFLD') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/sfld/${domainID}`;
    // domainURL = `http://sfld.rbvi.ucsf.edu/django/family/${domainID}`;
  } else if (domainName === 'SMART') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/smart/${domainID}`;
    // domainURL = `https://smart.embl-heidelberg.de/smart/do_annotation.pl?BLAST=DUMMY&amp;ACC=${domainID}`;
  } else if (domainName === 'SUPERFAMILY') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/ssf/${domainID}`;
    // domainURL = `https://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid=${domainID}`;
  } else if (domainName === 'TIGRFAMs') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/tigrfams/${domainID}`;
    // domainURL = `https://cmr.tigr.org/tigr-scripts/CMR/HmmReport.cgi?hmm_acc=${domainID}`;
  } else if (domainName === 'PRODOM') {
    domainURL = `https://www.ebi.ac.uk/interpro/entry/prodom/${domainID}`;
    // domainURL = `https://prodom.prabi.fr/prodom/current/cgi-bin/request.pl?SSID=1289309949_1085&amp;db_ent1=${domainID}`;
  }
  return domainURL;
}

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
let coordStates: Record<number, { state: boolean; data: any }> = {};

export function tooltipState(coord: number, data: object): typeof coordStates {
  // ensure the initial state is false
  if (!(coord in coordStates)) {
    coordStates[coord] = { state: false, data: data };
  }
  // toggle the boolean state
  coordStates[coord].state = !coordStates[coord].state;

  // update the associated object if provided
  if (coordStates[coord].state && data !== undefined) {
    coordStates[coord].data = data;
  }
  return coordStates[coord];
}
