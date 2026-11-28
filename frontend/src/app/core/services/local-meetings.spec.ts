import { LocalMeetings, LocalMeeting } from './local-meetings';

/** Deliberately small asynchronous IndexedDB mock: commits and aborts are distinct. */
function mockStore(
  records: LocalMeeting[] = [],
  options: { readFail?: boolean; writeFail?: boolean; openFail?: boolean } = {},
) {
  const stored = [...records];
  const db = {
    close: vi.fn(),
    transaction: vi.fn((_store: string, mode: string) => {
      const tx: any = {};
      let request: any;
      let pending: LocalMeeting | undefined;
      tx.objectStore = () => ({
        getAll: () => (request = { result: [...stored] }),
        put: (value: LocalMeeting) => {
          pending = value;
        },
      });
      queueMicrotask(() => {
        if (
          (mode === 'readonly' && options.readFail) ||
          (mode === 'readwrite' && options.writeFail)
        ) {
          tx.error = new Error('Storage failed');
          tx.onerror?.();
        } else {
          if (pending) stored.push(pending);
          tx.oncomplete?.();
        }
      });
      return tx;
    }),
  };
  vi.stubGlobal('indexedDB', {
    open: () => {
      const request: any = { result: db };
      queueMicrotask(() => (options.openFail ? request.onerror?.() : request.onsuccess?.()));
      return request;
    },
  });
  return { stored, db, options };
}

describe('LocalMeetings', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('stores pasted text exactly, trimmed title and actual meeting date', async () => {
    const { stored } = mockStore();
    const service = new LocalMeetings();
    const text = '  Speaker: Hello\r\n\n  Original spacing.  ';
    const meeting = await service.saveText('  Planning  ', text, '2026-01-03');
    expect(meeting.transcript).toBe(text);
    expect(meeting.title).toBe('Planning');
    expect(meeting.meetingDate).toBe('2026-01-03');
    expect(stored).toEqual([meeting]);
    expect(service.uploads()).toEqual([meeting]);
    expect(service.cards()[0].date).toBe('3 Jan 2026');
  });
  it.each(['txt', 'vtt', 'md'])('stores original %s file contents', async (extension) => {
    mockStore();
    const service = new LocalMeetings();
    const text = 'WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHello\n';
    const meeting = await service.save('Call', new File([text], `call.${extension}`), '2026-11-27');
    expect(meeting.transcript).toBe(text);
    expect(meeting.fileName).toBe(`call.${extension}`);
    expect(meeting.meetingDate).toBe('2026-11-27');
  });
  it('supports older records and the two argument save API', async () => {
    const old = {
      id: 'old',
      title: 'Old',
      transcript: 'Text',
      fileName: 'old.txt',
      createdAt: '2025-01-01T12:00:00Z',
    };
    mockStore([old]);
    const service = new LocalMeetings();
    await service.ready;
    expect(service.uploads()).toEqual([old]);
    expect(service.cards()[0].date).toContain('2025');
    const saved = await service.save('New', new File(['Transcript'], 'call.txt'));
    expect(saved.meetingDate).toBeUndefined();
    expect(service.uploads()).toHaveLength(2);
  });
  it('reports read failure while settling ready', async () => {
    mockStore([], { readFail: true });
    const service = new LocalMeetings();
    await service.ready;
    expect(service.loaded()).toBe(true);
    expect(service.loadError()).toBe('Storage failed');
    expect(service.uploads()).toEqual([]);
  });
  it('does not publish a meeting if the write fails', async () => {
    mockStore([], { writeFail: true });
    const service = new LocalMeetings();
    await expect(service.saveText('Call', 'Text')).rejects.toThrow('Could not save');
    expect(service.uploads()).toEqual([]);
  });
  it('reports unavailable storage', async () => {
    vi.stubGlobal('indexedDB', undefined);
    const service = new LocalMeetings();
    await service.ready;
    expect(service.loadError()).toContain('unavailable');
    await expect(service.saveText('Call', 'Text')).rejects.toThrow('unavailable');
  });
  it('validates title, empty text, size, extension and real calendar dates', async () => {
    mockStore();
    const service = new LocalMeetings();
    await expect(service.saveText(' ', 'Text')).rejects.toThrow('title');
    await expect(service.saveText('Call', ' \n ')).rejects.toThrow('containing text');
    await expect(service.save('Call', new File([' '], 'call.txt'))).rejects.toThrow(
      'containing text',
    );
    await expect(service.saveText('Call', 'Text', '2026-02-30')).rejects.toThrow(
      'valid meeting date',
    );
    await expect(service.saveText('Call', 'Text', '01/01/2026')).rejects.toThrow(
      'valid meeting date',
    );
    await expect(service.save('Call', new File(['text'], 'call.pdf'))).rejects.toThrow('TXT');
    await expect(service.saveText('Call', 'x'.repeat(10 * 1024 * 1024 + 1))).rejects.toThrow(
      '10 MB',
    );
  });
  it('reports file read failure', async () => {
    mockStore();
    vi.stubGlobal(
      'FileReader',
      class {
        onerror?: () => void;
        readAsText() {
          queueMicrotask(() => this.onerror?.());
        }
      },
    );
    const service = new LocalMeetings();
    await expect(service.save('Call', new File(['Text'], 'call.txt'))).rejects.toThrow(
      'Could not read',
    );
    expect(service.uploads()).toEqual([]);
  });
});
