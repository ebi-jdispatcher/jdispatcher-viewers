import {
  SSSResultModel,
  Hit,
  Hsp,
  IPRMCResultModel,
  IPRMCResultModelFlat,
  IprMatchesFlat,
  IprMatchFlat,
} from '../src/data-model';

// Example data for testing
const exampleHsp: Hsp = {
  hsp_hit_from: 10,
  hsp_hit_to: 50,
  hsp_hseq: 'ATCG',
  hsp_mseq: 'TTAG',
  hsp_num: 1,
  hsp_qseq: 'AGTC',
  hsp_query_from: 1,
  hsp_query_to: 4,
  hsp_score: 100,
};

const exampleHit: Hit = {
  hit_acc: 'XP_12345',
  hit_db: 'GenBank',
  hit_def: 'Example protein',
  hit_desc: 'Sample description',
  hit_hsps: [exampleHsp],
  hit_id: 'hit_001',
  hit_len: 100,
  hit_num: 1,
  hit_url: 'https://example.com',
};

const exampleSSSResultModel: SSSResultModel = {
  command: 'search command',
  db_count: 10,
  db_len: 10000,
  db_num: 5,
  dbs: [{ name: 'Database1', stype: 'protein' }],
  end: '2024-10-31T00:00:00Z',
  hits: [exampleHit],
  program: 'BLAST',
  query_def: 'Query protein',
  query_len: 400,
  search: 'Protein search',
  start: '2024-10-30T00:00:00Z',
  version: '1.0.0',
};

const exampleIprMatchFlat: IprMatchFlat = {
  id: 'IPR000123',
  name: 'Example domain',
  score: 45,
};

const exampleIprMatchesFlat: IprMatchesFlat = {
  match_1: [exampleIprMatchFlat],
};

const exampleIPRMCResultModelFlat: IPRMCResultModelFlat = {
  IPR000123: {
    id: 'IPR000123',
    name: 'Example domain',
    length: 300,
    matches: ['match_1'],
    match: exampleIprMatchesFlat,
  },
};

describe('Interfaces and Types', () => {
  test('SSSResultModel should match expected structure', () => {
    expect(exampleSSSResultModel.command).toBe('search command');
    expect(exampleSSSResultModel.db_count).toBe(10);
    expect(exampleSSSResultModel.hits[0].hit_acc).toBe('XP_12345');
    expect(exampleSSSResultModel.hits[0].hit_hsps[0].hsp_score).toBe(100);
  });

  test('IPRMCResultModelFlat should contain valid data', () => {
    expect(exampleIPRMCResultModelFlat['IPR000123'].id).toBe('IPR000123');
    expect(exampleIPRMCResultModelFlat['IPR000123'].matches[0]).toBe('match_1');
    expect(exampleIPRMCResultModelFlat['IPR000123'].match.match_1[0].score).toBe(45);
  });

  test('Hit should have correct fields', () => {
    const hit: Hit = exampleHit;
    expect(hit.hit_acc).toBe('XP_12345');
    expect(hit.hit_db).toBe('GenBank');
    expect(hit.hit_def).toBe('Example protein');
    expect(hit.hit_hsps[0].hsp_query_to).toBe(4);
  });

  test('Hsp should have mandatory fields set', () => {
    const hsp: Hsp = exampleHsp;
    expect(hsp.hsp_hit_from).toBe(10);
    expect(hsp.hsp_hit_to).toBe(50);
    expect(hsp.hsp_score).toBe(100);
    expect(hsp.hsp_qseq).toBe('AGTC');
  });

  test('IPRMCResultModelFlat matches IPRMCFlat data structure', () => {
    const iprmcFlat = exampleIPRMCResultModelFlat['IPR000123'];
    expect(iprmcFlat.id).toBe('IPR000123');
    expect(iprmcFlat.name).toBe('Example domain');
    expect(iprmcFlat.length).toBe(300);
    expect(iprmcFlat.matches).toContain('match_1');
    expect(iprmcFlat.match.match_1[0].name).toBe('Example domain');
  });
});
