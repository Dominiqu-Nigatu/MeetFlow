import { Injectable, computed, signal } from '@angular/core';

export interface LocalMeeting {
  id: string;
  title: string;
  fileName: string;
  transcript: string;
  createdAt: string;
  /** Local calendar date, independent of the time this record was saved. */
  meetingDate?: string;
}

@Injectable({ providedIn: 'root' })
export class LocalMeetings {
  readonly uploads = signal<LocalMeeting[]>([]);
  readonly loaded = signal(false);
  readonly loadError = signal('');
  readonly cards = computed(() =>
    this.uploads().map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      date: (meeting.meetingDate
        ? new Date(`${meeting.meetingDate}T12:00:00`)
        : new Date(meeting.createdAt)
      ).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      duration: 'Not recorded',
      summaryStatus: 'pending' as const,
      actionItemCount: 0,
    })),
  );
  readonly ready = this.load();

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(
          new Error('Browser storage is unavailable. Please allow site storage and try again.'),
        );
        return;
      }
      const request = indexedDB.open('meetflow-local', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('meetings')) {
          request.result.createObjectStore('meetings', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          new Error('Could not open browser storage. Please allow site storage and try again.'),
        );
      request.onblocked = () => reject(new Error('Close other MeetFlow tabs and try again.'));
    });
  }

  private async load(): Promise<void> {
    try {
      const db = await this.open();
      const records = await new Promise<LocalMeeting[]>((resolve, reject) => {
        const transaction = db.transaction('meetings', 'readonly');
        const request = transaction.objectStore('meetings').getAll();
        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      }).finally(() => db.close());
      this.uploads.set(records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Could not load saved meetings.');
    } finally {
      this.loaded.set(true);
    }
  }

  async save(title: string, file: File, date?: string): Promise<LocalMeeting> {
    this.validateDetails(title, date);
    if (!/\.(txt|vtt|md)$/i.test(file.name))
      throw new Error('Please choose a TXT, VTT or MD transcript.');
    if (file.size > 10 * 1024 * 1024) throw new Error('The transcript must be smaller than 10 MB.');
    const transcript = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = reader.onabort = () =>
        reject(new Error('Could not read this file. Please select it again.'));
      reader.readAsText(file);
    });
    return this.persist(title, transcript, file.name, date);
  }

  async saveText(title: string, text: string, date?: string): Promise<LocalMeeting> {
    return this.persist(title, text, 'Pasted transcript.txt', date);
  }

  private validateDetails(title: string, date?: string): void {
    if (!title.trim()) throw new Error('Please enter a meeting title.');
    if (date) {
      // Parse as a local date, never UTC. Check each part to reject rollover dates.
      const parsed = new Date(`${date}T12:00:00`);
      const [year, month, day] = date.split('-').map(Number);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsed.getTime()) ||
        parsed.getFullYear() !== year ||
        parsed.getMonth() + 1 !== month ||
        parsed.getDate() !== day
      ) {
        throw new Error('Please enter a valid meeting date.');
      }
    }
  }

  private async persist(
    title: string,
    transcript: string,
    fileName: string,
    date?: string,
  ): Promise<LocalMeeting> {
    this.validateDetails(title, date);
    if (!transcript.trim()) throw new Error('Please provide a transcript containing text.');
    if (new Blob([transcript]).size > 10 * 1024 * 1024) {
      throw new Error('The transcript must be smaller than 10 MB.');
    }
    await this.ready;
    const meeting: LocalMeeting = {
      id: `local-${crypto.randomUUID()}`,
      title: title.trim(),
      fileName,
      transcript,
      createdAt: new Date().toISOString(),
      ...(date ? { meetingDate: date } : {}),
    };
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('meetings', 'readwrite');
      transaction.objectStore('meetings').put(meeting);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(new Error('Could not save the transcript. Browser storage may be full.'));
      transaction.onabort = () => reject(new Error('Saving was interrupted. Please try again.'));
    }).finally(() => db.close());
    this.uploads.update((meetings) => [meeting, ...meetings]);
    this.loadError.set('');
    return meeting;
  }
}
