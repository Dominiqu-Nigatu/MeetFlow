import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalMeetings } from '../../../../core/services/local-meetings';
import { MeetingUploadPanel } from './meeting-upload-panel';

export const savedMeeting = {
  id: 'local-test',
  title: 'Call',
  fileName: 'call.txt',
  transcript: 'Text',
  createdAt: '2026-11-28T12:00:00Z',
};

describe('MeetingUploadPanel', () => {
  let component: MeetingUploadPanel;
  let fixture: ComponentFixture<MeetingUploadPanel>;
  let store: { save: ReturnType<typeof vi.fn>; saveText: ReturnType<typeof vi.fn> };
  beforeEach(async () => {
    store = {
      save: vi.fn().mockResolvedValue(savedMeeting),
      saveText: vi.fn().mockResolvedValue(savedMeeting),
    };
    await TestBed.configureTestingModule({
      imports: [MeetingUploadPanel],
      providers: [{ provide: LocalMeetings, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(MeetingUploadPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('saves upload with title and actual date, then emits', async () => {
    const file = new File(['Text'], 'call.md');
    component.onTitleChange(' Call ');
    component.onFileSelected(file);
    component.meetingDate.set('2026-01-02');
    const emit = vi.spyOn(component.uploadSubmitted, 'emit');
    await component.onSubmit(new Event('submit'));
    expect(store.save).toHaveBeenCalledWith('Call', file, '2026-01-02');
    expect(emit).toHaveBeenCalledWith({ title: 'Call', file, meetingDate: '2026-01-02' });
    expect(component.successMessage()).toBe('Saved in this browser.');
  });
  it('saves pasted text verbatim instead of the selected file', async () => {
    component.onTitleChange('Call');
    component.onFileSelected(new File(['Wrong'], 'call.txt'));
    component.setMode('text');
    component.transcriptText.set('  Original\ntext  ');
    component.meetingDate.set('2026-11-26');
    await component.onSubmit(new Event('submit'));
    expect(store.saveText).toHaveBeenCalledWith('Call', '  Original\ntext  ', '2026-11-26');
    expect(store.save).not.toHaveBeenCalled();
  });
  it('prevents duplicate submissions and waits for real storage success', async () => {
    let resolve!: (value: typeof savedMeeting) => void;
    store.saveText.mockReturnValue(new Promise((r) => (resolve = r)));
    component.onTitleChange('Call');
    component.setMode('text');
    component.transcriptText.set('Text');
    const first = component.onSubmit(new Event('submit'));
    await component.onSubmit(new Event('submit'));
    expect(store.saveText).toHaveBeenCalledTimes(1);
    expect(component.saving()).toBe(true);
    expect(component.successMessage()).toBe('');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea').disabled).toBe(true);
    resolve(savedMeeting);
    await first;
    expect(component.saving()).toBe(false);
    expect(component.successMessage()).not.toBe('');
  });
  it('reports failure without emitting success', async () => {
    store.saveText.mockRejectedValue(new Error('Storage full'));
    component.onTitleChange('Call');
    component.setMode('text');
    component.transcriptText.set('Text');
    const emit = vi.spyOn(component.uploadSubmitted, 'emit');
    await component.onSubmit(new Event('submit'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Storage full',
    );
    expect(component.saving()).toBe(false);
    expect(component.successMessage()).toBe('');
    expect(emit).not.toHaveBeenCalled();
  });
  it('rejects whitespace-only text and missing title', async () => {
    component.setMode('text');
    component.transcriptText.set('  ');
    component.onTitleChange('Call');
    await component.onSubmit(new Event('submit'));
    expect(store.saveText).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('title and transcript');
  });
  it('handles file upload validation errors and clears stale selection', () => {
    component.onFileSelected(new File(['Text'], 'call.txt'));
    const fileInput = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const invalid = new File(['Invalid'], 'call.pdf');
    Object.defineProperty(fileInput, 'files', { value: [invalid] });
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.errorMessage()).toContain('Invalid file type');
    expect(component.selectedFile()).toBeNull();
    expect(component.canSubmit()).toBe(false);
  });
  it('provides native labels and selectable paste controls', () => {
    const root = fixture.nativeElement as HTMLElement;
    const radios = root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    radios[1].click();
    fixture.detectChanges();
    const textarea = root.querySelector('textarea')!;
    expect(root.querySelector(`label[for="${textarea.id}"]`)?.textContent).toContain(
      'Transcript text',
    );
    expect(component.mode()).toBe('text');
  });
});
