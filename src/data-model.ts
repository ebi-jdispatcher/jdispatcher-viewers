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

interface DB {
  name: string;
  stype: string;
  created?: string;
}

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

export interface IPRMCResultModel {
  _declaration: Declaration;
  _doctype: string[];
  interpromatch: IPRMC[];
}

interface IPRMC {
  release: Release[];
  protein: Protein[];
}

interface Protein {
  _attributes: ProteinAttributes;
  match: Match[];
}

interface ProteinAttributes {
  id: string;
  name: string;
  length: string;
  crc64: string;
}

interface Match {
  _attributes: MatchAttributes;
  ipr?: Ipr[];
  lcn: Lcn[];
}

interface MatchAttributes {
  id: string;
  name: string;
  model: string;

  [key: string]: string;
}

interface Ipr {
  _attributes: IprAttributes;
}

interface IprAttributes {
  id: string;
  name: string;

  [key: string]: string;
}

interface Lcn {
  _attributes: LcnAttributes;
}

interface LcnAttributes {
  start: string;
  end: string;
  fragments?: string;
  score: string;
}

interface Declaration {
  _attributes: DeclarationAttributes;
}

interface DeclarationAttributes {
  version: string;
  encoding: string;
}

interface Release {
  dbinfo: Dbinfo[];
}

interface Dbinfo {
  _attributes: DbinfoAttributes;
}

interface DbinfoAttributes {
  dbname: string;
  version: string;
  entry_count: string;
  file_date: string;
}

export interface IPRMCResultModelFlat {
  [key: string]: IPRMCFlat;
}

interface IPRMCFlat {
  id: string;
  name: string;
  length: number;
  matches: string[];
  match: IprMatchesFlat;
}

export interface IprMatchesFlat {
  [key: string]: IprMatchFlat[];
}

export interface IprMatchFlat {
  [key: string]: string | number | undefined;
}
