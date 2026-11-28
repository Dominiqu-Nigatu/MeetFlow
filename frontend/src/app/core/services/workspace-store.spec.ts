import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { LocalMeetings } from './local-meetings';
import {
  ANALYSIS_ADAPTER,
  ANALYSIS_TIMEOUT_MS,
  WorkspaceStore,
  WORKSPACE_KEY,
  ActionDraft,
} from './workspace-store';
const local = () => ({
  uploads: signal([
    {
      id: 'local-test',
      title: 'Uploaded title',
      transcript: 'Actual transcript',
      createdAt: '2026-11-28T12:00:00Z',
      fileName: 'notes.txt',
    },
  ]),
  loaded: signal(true),
  loadError: signal(''),
});
const draft: ActionDraft = {
  description: 'Follow up',
  owner: 'Sam',
  dueDate: '2026-11-20',
  status: 'todo',
};
describe('WorkspaceStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [{ provide: LocalMeetings, useValue: local() }] });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });
  it('keeps uploaded records empty and uses the real transcript/title', () => {
    const store = TestBed.inject(WorkspaceStore);
    expect(store.meeting('local-test')?.transcript).toBe('Actual transcript');
    expect(store.meeting('local-test')?.title).toBe('Uploaded title');
    expect(store.notes('local-test')).toEqual({ summary: '', decisions: [], actions: [] });
    expect(store.meeting('unknown')).toBeUndefined();
  });
  it('adds, edits, completes, reopens and deletes shared actions', () => {
    const store = TestBed.inject(WorkspaceStore);
    expect(store.addAction('local-test', draft)).toBe(true);
    const action = store.notes('local-test').actions[0];
    expect(store.actions().find((a) => a.id === action.id)?.meetingTitle).toBe('Uploaded title');
    expect(
      store.updateAction('local-test', action.id, {
        ...draft,
        status: 'in progress',
        owner: 'Pat',
      }),
    ).toBe(true);
    expect(store.notes('local-test').actions[0].status).toBe('in progress');
    store.completeAction('local-test', action.id, true);
    expect(store.notes('local-test').actions[0].status).toBe('done');
    store.completeAction('local-test', action.id, false);
    expect(store.notes('local-test').actions[0].completed).toBe(false);
    store.deleteAction('local-test', action.id);
    expect(store.notes('local-test').actions).toEqual([]);
  });
  it('restores notes/actions after a service reload', () => {
    const store = TestBed.inject(WorkspaceStore);
    store.saveNotes('local-test', 'Manual summary', ['Decision']);
    store.addAction('local-test', draft);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: LocalMeetings, useValue: local() }] });
    const reloaded = TestBed.inject(WorkspaceStore);
    expect(reloaded.notes('local-test').summary).toBe('Manual summary');
    expect(reloaded.notes('local-test').actions[0].description).toBe('Follow up');
  });
  it('reports storage errors without pretending changes were saved', () => {
    const store = TestBed.inject(WorkspaceStore);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    expect(store.addAction('local-test', draft)).toBe(false);
    expect(store.notes('local-test').actions).toEqual([]);
    expect(store.storageError()).toContain('not saved');
  });
  it('validates corrupted persisted data and invalid actions', () => {
    localStorage.setItem(WORKSPACE_KEY, '{bad');
    const store = TestBed.inject(WorkspaceStore);
    expect(store.storageError()).toContain('could not be loaded');
    expect(store.addAction('local-test', { ...draft, description: ' ' })).toBe(false);
    expect(store.addAction('local-test', { ...draft, dueDate: '2026-02-30' })).toBe(false);
    expect(store.addAction('unknown', draft)).toBe(false);
  });
  it('uses local calendar dates for overdue and excludes done tasks', () => {
    const store = TestBed.inject(WorkspaceStore);
    const today = new Date(2026, 10, 28, 1);
    expect(store.isOverdue(draft, today)).toBe(true);
    expect(store.isOverdue({ ...draft, dueDate: '2026-11-28' }, today)).toBe(false);
    expect(store.isOverdue({ ...draft, status: 'done' }, today)).toBe(false);
  });
  it('reports unavailable AI and permits retry without changing the transcript', async () => {
    const store = TestBed.inject(WorkspaceStore);
    await store.analyze('local-test');
    expect(store.analysis()['local-test'].status).toBe('error');
    await store.analyze('local-test');
    expect(store.analysis()['local-test'].message).toContain('provider unavailable');
    expect(store.meeting('local-test')?.transcript).toBe('Actual transcript');
    expect(store.notes('local-test').summary).toBe('');
  });
  it('exposes loading, prevents duplicate requests and handles no result via injected adapter', async () => {
    let resolve!: (value: null) => void;
    const analyze = vi.fn(() => new Promise<null>((r) => (resolve = r)));
    TestBed.overrideProvider(ANALYSIS_ADAPTER, { useValue: { analyze } });
    const store = TestBed.inject(WorkspaceStore);
    const request = store.analyze('local-test');
    expect(store.analysis()['local-test'].status).toBe('loading');
    await store.analyze('local-test');
    expect(analyze).toHaveBeenCalledTimes(1);
    resolve(null);
    await request;
    expect(store.analysis()['local-test'].status).toBe('no-result');
    expect(store.notes('local-test').actions).toEqual([]);
  });
  it('supports real adapter results while preserving manual notes and the transcript', async () => {
    TestBed.overrideProvider(ANALYSIS_ADAPTER, {
      useValue: {
        analyze: async () => ({
          summary: 'Adapter summary',
          decisions: ['Adapter decision'],
          actions: [draft],
        }),
      },
    });
    const store = TestBed.inject(WorkspaceStore);
    store.saveNotes('local-test', 'Manual', []);
    await store.analyze('local-test');
    expect(store.notes('local-test').summary).toBe('Manual');
    expect(store.notes('local-test').decisions).toEqual(['Adapter decision']);
    expect(store.notes('local-test').actions).toHaveLength(1);
    expect(store.meeting('local-test')?.transcript).toBe('Actual transcript');
  });
  it('times out a slow response and allows retry without losing notes', async () => {
    vi.useFakeTimers();
    try {
      const analyze = vi
        .fn()
        .mockImplementationOnce(() => new Promise(() => {}))
        .mockResolvedValueOnce(null);
      TestBed.overrideProvider(ANALYSIS_ADAPTER, { useValue: { analyze } });
      TestBed.overrideProvider(ANALYSIS_TIMEOUT_MS, { useValue: 50 });
      const store = TestBed.inject(WorkspaceStore);
      store.saveNotes('local-test', 'Manual notes', []);
      const request = store.analyze('local-test');
      await vi.advanceTimersByTimeAsync(50);
      await request;
      expect(store.analysis()['local-test'].message).toContain('too long');
      expect(store.notes('local-test').summary).toBe('Manual notes');
      await store.analyze('local-test');
      expect(store.analysis()['local-test'].status).toBe('no-result');
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects malformed analysis before saving any output', async () => {
    TestBed.overrideProvider(ANALYSIS_ADAPTER, {
      useValue: { analyze: async () => ({ summary: 42, decisions: [], actions: [] }) },
    });
    const store = TestBed.inject(WorkspaceStore);
    await store.analyze('local-test');
    expect(store.analysis()['local-test'].message).toContain('invalid results');
    expect(store.notes('local-test').summary).toBe('');
    expect(store.meeting('local-test')?.transcript).toBe('Actual transcript');
  });
});
