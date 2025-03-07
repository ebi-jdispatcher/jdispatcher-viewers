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
export interface SSSResultModel {
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
export interface Hit {
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
export interface Hsp {
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
export interface IPRMCResultModel {
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
export interface IPRMCResultModelFlat {
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
export interface IprMatchesFlat {
  [key: string]: IprMatchFlat[];
}

/**
 * Interface representing a single flattened match entry.
 * @interface IprMatchFlat
 * @property {string | number | undefined} [key: string] - Dynamic match properties.
 */
export interface IprMatchFlat {
  [key: string]: string | number | undefined;
}
