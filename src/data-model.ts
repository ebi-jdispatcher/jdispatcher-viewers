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
    _doctype: string;
    interpromatch: IPRMC;
}

export interface IPRMC {
    release: Release;
    protein: Protein[];
}

export interface Protein {
    _attributes: ProteinAttributes;
    match: Match[];
}

export interface ProteinAttributes {
    id: string;
    name: string;
    length: string;
    crc64: string;
}

export interface Match {
    _attributes: MatchAttributes;
    ipr?: Ipr;
    lcn: Lcn;
}

export interface MatchAttributes {
    id: string;
    name: string;
    dbname: IprDbname;
    status: IprStatus;
    model: string;
    evd: IprEvd;
}

export enum IprDbname {
    Cathgene3D = "CATHGENE3D",
    Cdd = "CDD",
    Panther = "PANTHER",
    Pfam = "PFAM",
    Pirsf = "PIRSF",
    Prints = "PRINTS",
    Profile = "PROFILE",
    Smart = "SMART",
    Ssf = "SSF",
    Unclassified = "Unclassified",
}

export enum IprEvd {
    FPrintScan = "FPrintScan",
    HMMPfam = "HMMPfam",
    PrfScan = "PrfScan",
    RpsBlast = "RPS-BLAST",
    SmartScan = "Smart scan",
}

export enum IprStatus {
    T = "T",
}

export interface Ipr {
    _attributes: IprAttributes;
}

export interface IprAttributes {
    id: string;
    name: string;
    type: IprType;
    parent_id?: string;
}

export enum IprType {
    Domain = "Domain",
    Family = "Family",
    HomologousSuperfamily = "Homologous_superfamily",
    Repeat = "Repeat",
}

export interface Lcn {
    _attributes: LcnAttributes;
}

export interface LcnAttributes {
    start: string;
    end: string;
    fragments?: string;
    score: string;
}

export interface Declaration {
    _attributes: DeclarationAttributes;
}

export interface DeclarationAttributes {
    version: string;
    encoding: string;
}

export interface Release {
    dbinfo: Dbinfo[];
}

export interface Dbinfo {
    _attributes: DbinfoAttributes;
}

export interface DbinfoAttributes {
    dbname: string;
    version: string;
    entry_count: string;
    file_date: string;
}
