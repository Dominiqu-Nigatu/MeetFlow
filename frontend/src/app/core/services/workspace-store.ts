import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { LocalMeetings } from './local-meetings';

export type ActionStatus = 'todo' | 'in progress' | 'done';
export interface ActionDraft {
  description: string;
  owner: string | null;
  dueDate: string | null;
  status: ActionStatus;
}
export interface WorkspaceAction extends ActionDraft {
  id: string;
  meetingId: string;
  completed: boolean;
  meetingTitle: string;
}
export interface MeetingNotes {
  summary: string;
  decisions: string[];
  actions: WorkspaceAction[];
}
export interface WorkspaceMeeting {
  id: string;
  title: string;
  transcript: string;
  meetingDate: string;
  sample: boolean;
}
export interface AnalysisResult {
  summary: string;
  decisions: string[];
  actions: ActionDraft[];
}
export interface AnalysisAdapter {
  analyze(transcript: string): Promise<AnalysisResult | null>;
}
export const ANALYSIS_ADAPTER = new InjectionToken<AnalysisAdapter>('Meeting analysis adapter', {
  providedIn: 'root',
  factory: () => ({
    analyze: async () => {
      throw new Error(
        'AI provider unavailable. No provider is connected. Your transcript is unchanged; you can edit notes manually or retry after a provider is configured.',
      );
    },
  }),
});
export const ANALYSIS_TIMEOUT_MS = new InjectionToken<number>('Analysis response timeout', {
  providedIn: 'root',
  factory: () => 30000,
});
export const WORKSPACE_KEY = 'meetflow-workspace-v1';
export type AnalysisState = { status: 'idle' | 'loading' | 'error' | 'no-result'; message: string };
const titles = [
  'Product Strategy Meeting',
  'Frontend Sprint Planning',
  'Marketing Weekly Sync',
  'Client Feedback Review',
  'Design Review',
  'Engineering Stand-up',
  'Client Onboarding',
  'Monthly Retrospective',
];
const samples: WorkspaceMeeting[] = titles.map((title, index) => ({
  id: String(index + 1),
  title,
  transcript:
    index === 0
      ? 'Sample transcript\nJohn: Let us prepare the product roadmap presentation.\nSarah: I will review the frontend design system.\nMichael: I will finalise the API documentation.'
      : 'Sample meeting. No transcript provided.',
  meetingDate: `2026-11-${25 - index}`,
  sample: true,
}));
const emptyNotes = (): MeetingNotes => ({ summary: '', decisions: [], actions: [] });
function validDate(value: unknown): value is string | null {
  if (value === null) return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validDraft(value: unknown): value is ActionDraft {
  if (!value || typeof value !== 'object') return false;
  const v = value as ActionDraft;
  return (
    typeof v.description === 'string' &&
    !!v.description.trim() &&
    (v.owner === null || typeof v.owner === 'string') &&
    validDate(v.dueDate) &&
    ['todo', 'in progress', 'done'].includes(v.status)
  );
}
function validNotes(value: unknown): value is MeetingNotes {
  if (!value || typeof value !== 'object') return false;
  const v = value as MeetingNotes;
  return (
    typeof v.summary === 'string' &&
    Array.isArray(v.decisions) &&
    v.decisions.every((d) => typeof d === 'string') &&
    Array.isArray(v.actions) &&
    v.actions.every(
      (a) =>
        validDraft(a) &&
        typeof a.id === 'string' &&
        typeof a.meetingId === 'string' &&
        typeof a.meetingTitle === 'string' &&
        typeof a.completed === 'boolean' &&
        a.completed === (a.status === 'done'),
    ) &&
    new Set(v.actions.map((a) => a.id)).size === v.actions.length
  );
}
@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
  readonly local = inject(LocalMeetings);
  private readonly adapter = inject(ANALYSIS_ADAPTER);
  private readonly analysisTimeout = inject(ANALYSIS_TIMEOUT_MS);
  readonly storageError = signal('');
  private readonly edits = signal<Record<string, MeetingNotes>>(this.load());
  readonly analysis = signal<Record<string, AnalysisState>>({});
  readonly meetings = computed<WorkspaceMeeting[]>(() => [
    ...this.local.uploads().map((m) => ({
      id: m.id,
      title: m.title,
      transcript: m.transcript,
      meetingDate:
        (m as typeof m & { meetingDate?: string }).meetingDate || m.createdAt.slice(0, 10),
      sample: false,
    })),
    ...samples,
  ]);
  readonly actions = computed(() =>
    this.meetings().flatMap((m) =>
      this.notes(m.id).actions.map((a) => ({ ...a, meetingId: m.id, meetingTitle: m.title })),
    ),
  );
  meeting(id: string) {
    return this.meetings().find((m) => m.id === id);
  }
  notes(id: string): MeetingNotes {
    const saved = Object.hasOwn(this.edits(), id) ? this.edits()[id] : undefined;
    if (saved) return saved;
    if (id !== '1') return emptyNotes();
    return {
      summary:
        'Sample summary: the team aligned on product roadmap preparation and design system review.',
      decisions: ['Sample decision: review the frontend design system.'],
      actions: [
        {
          id: 'sample-action-1',
          meetingId: '1',
          meetingTitle: titles[0],
          description: 'Prepare the product roadmap presentation',
          owner: 'John Doe',
          dueDate: '2026-11-28',
          status: 'todo',
          completed: false,
        },
        {
          id: 'sample-action-2',
          meetingId: '1',
          meetingTitle: titles[0],
          description: 'Review the frontend design system',
          owner: 'Sarah',
          dueDate: '2026-11-27',
          status: 'in progress',
          completed: false,
        },
        {
          id: 'sample-action-3',
          meetingId: '1',
          meetingTitle: titles[0],
          description: 'Finalise API documentation',
          owner: 'Michael',
          dueDate: '2026-11-30',
          status: 'done',
          completed: true,
        },
      ],
    };
  }
  private load(): Record<string, MeetingNotes> {
    try {
      const raw = localStorage.getItem(WORKSPACE_KEY);
      if (!raw) return {};
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
      const data = value as { version?: number; meetings?: Record<string, unknown> };
      if (
        data.version !== 1 ||
        !data.meetings ||
        typeof data.meetings !== 'object' ||
        Array.isArray(data.meetings) ||
        !Object.entries(data.meetings).every(
          ([id, notes]) =>
            id !== '__proto__' &&
            id !== 'constructor' &&
            validNotes(notes) &&
            notes.actions.every((a) => a.meetingId === id),
        )
      )
        throw new Error();
      return data.meetings as Record<string, MeetingNotes>;
    } catch {
      this.storageError.set(
        'Saved workspace edits could not be loaded. Browser storage may be unavailable or the saved data is invalid. Original transcripts are unaffected.',
      );
      return {};
    }
  }
  private commit(id: string, notes: MeetingNotes): boolean {
    if (!this.meeting(id) || !validNotes(notes)) return false;
    const next = { ...this.edits(), [id]: notes };
    try {
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify({ version: 1, meetings: next }));
    } catch {
      this.storageError.set(
        'Changes were not saved. Browser storage may be full or unavailable. Please free space or allow site storage and try again.',
      );
      return false;
    }
    this.edits.set(next);
    this.storageError.set('');
    return true;
  }
  saveNotes(id: string, summary: string, decisions: string[]) {
    return this.commit(id, {
      ...this.notes(id),
      summary: summary.trim(),
      decisions: decisions.map((d) => d.trim()).filter(Boolean),
    });
  }
  addAction(id: string, draft: ActionDraft): boolean {
    if (!validDraft(draft)) return false;
    return this.commit(id, {
      ...this.notes(id),
      actions: [
        ...this.notes(id).actions,
        {
          ...draft,
          description: draft.description.trim(),
          owner: draft.owner?.trim() || null,
          id: crypto.randomUUID(),
          meetingId: id,
          meetingTitle: this.meeting(id)?.title || '',
          completed: draft.status === 'done',
        },
      ],
    });
  }
  updateAction(meetingId: string, id: string, draft: ActionDraft): boolean {
    if (!validDraft(draft) || !this.notes(meetingId).actions.some((a) => a.id === id)) return false;
    return this.commit(meetingId, {
      ...this.notes(meetingId),
      actions: this.notes(meetingId).actions.map((a) =>
        a.id === id
          ? {
              ...a,
              ...draft,
              description: draft.description.trim(),
              owner: draft.owner?.trim() || null,
              completed: draft.status === 'done',
            }
          : a,
      ),
    });
  }
  completeAction(meetingId: string, id: string, completed: boolean) {
    const action = this.notes(meetingId).actions.find((a) => a.id === id);
    return action
      ? this.updateAction(meetingId, id, { ...action, status: completed ? 'done' : 'todo' })
      : false;
  }
  deleteAction(meetingId: string, id: string) {
    return this.commit(meetingId, {
      ...this.notes(meetingId),
      actions: this.notes(meetingId).actions.filter((a) => a.id !== id),
    });
  }
  isOverdue(action: ActionDraft, today = new Date()) {
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return action.status !== 'done' && !!action.dueDate && action.dueDate < localDate;
  }
  async analyze(id: string): Promise<void> {
    const meeting = this.meeting(id);
    if (!meeting || this.analysis()[id]?.status === 'loading') return;
    this.setAnalysis(id, 'loading', 'Analyzing transcript…');
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        this.adapter.analyze(meeting.transcript),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () =>
              reject(
                new Error(
                  'Analysis took too long. Your transcript and notes are unchanged. Please retry.',
                ),
              ),
            this.analysisTimeout,
          );
        }),
      ]);
      if (
        result !== null &&
        (!result ||
          typeof result !== 'object' ||
          typeof result.summary !== 'string' ||
          !Array.isArray(result.decisions) ||
          !result.decisions.every((d) => typeof d === 'string') ||
          !Array.isArray(result.actions) ||
          !result.actions.every(validDraft))
      )
        throw new Error(
          'The provider returned invalid results. Your notes and transcript are unchanged. Please retry.',
        );
      if (
        !result ||
        (!result.summary.trim() && !result.decisions.length && !result.actions.length)
      ) {
        this.setAnalysis(
          id,
          'no-result',
          'No AI results returned. Your notes and transcript are unchanged. You can retry.',
        );
        return;
      }
      // Keep manual notes and actions; fill only empty output fields and append provider actions.
      const notes = this.notes(id);
      const saved = this.commit(id, {
        summary: notes.summary || result.summary,
        decisions: notes.decisions.length ? notes.decisions : result.decisions,
        actions: [
          ...notes.actions,
          ...result.actions.map((a) => ({
            ...a,
            id: crypto.randomUUID(),
            meetingId: id,
            meetingTitle: meeting.title,
            completed: a.status === 'done',
          })),
        ],
      });
      this.setAnalysis(
        id,
        saved ? 'idle' : 'error',
        saved
          ? 'Analysis saved in this browser.'
          : 'Analysis could not be saved. Retry after allowing browser storage.',
      );
    } catch (error) {
      this.setAnalysis(
        id,
        'error',
        error instanceof Error
          ? error.message
          : 'AI provider unavailable. Your transcript is unchanged. Please retry later.',
      );
    } finally {
      clearTimeout(timer);
    }
  }
  private setAnalysis(id: string, status: AnalysisState['status'], message: string) {
    this.analysis.update((states) => ({ ...states, [id]: { status, message } }));
  }
}
