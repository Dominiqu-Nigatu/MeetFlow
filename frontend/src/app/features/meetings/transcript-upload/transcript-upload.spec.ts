import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { TranscriptUpload } from './transcript-upload';

describe('TranscriptUpload', () => {
  let fixture: ComponentFixture<TranscriptUpload>;
  let saveText: ReturnType<typeof vi.fn>;
  beforeEach(async () => {
    saveText = vi.fn().mockResolvedValue({ id: 'local-test' });
    await TestBed.configureTestingModule({
      imports: [TranscriptUpload],
      providers: [
        provideRouter([]),
        { provide: LocalMeetings, useValue: { saveText, save: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TranscriptUpload);
    fixture.detectChanges();
  });
  it('actually calls the shared save service from the standalone form', async () => {
    const root = fixture.nativeElement as HTMLElement;
    const title = root.querySelector('input[type="text"]') as HTMLInputElement;
    title.value = 'Standalone call';
    title.dispatchEvent(new Event('input'));
    const date = root.querySelector('input[type="date"]') as HTMLInputElement;
    date.value = '2026-11-24';
    date.dispatchEvent(new Event('input'));
    root.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1].click();
    fixture.detectChanges();
    const text = root.querySelector('textarea')!;
    text.value = 'Original transcript';
    text.dispatchEvent(new Event('input'));
    root.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(saveText).toHaveBeenCalledWith('Standalone call', 'Original transcript', '2026-11-24');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Saved in this browser');
  });
  it('navigates back to the dashboard', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.componentInstance.goBack();
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
