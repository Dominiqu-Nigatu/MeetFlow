import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranscriptUpload } from './transcript-upload';

describe('TranscriptUpload', () => {
  let component: TranscriptUpload;
  let fixture: ComponentFixture<TranscriptUpload>;
  let router: Router;

  const mockFile = new File(['Meeting transcript content'], 'meeting.txt', { type: 'text/plain' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptUpload],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptUpload);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with empty meeting title', () => {
    expect(component.meetingTitle()).toBe('');
  });

  it('should initialise with no selected file', () => {
    expect(component.selectedFile()).toBeNull();
  });

  it('should initialise with no submission', () => {
    expect(component.submitted()).toBe(false);
  });

  it('should update meeting title', () => {
    component.onTitleChange('Weekly Stand-up');

    expect(component.meetingTitle()).toBe('Weekly Stand-up');
  });

  it('should update meeting date', () => {
    component.onDateChange('2026-11-25');

    expect(component.meetingDate()).toBe('2026-11-25');
  });

  it('should select a file', () => {
    component.onFileSelected(mockFile);

    expect(component.selectedFile()).toBe(mockFile);
  });

  it('should clear errors when selecting a file', () => {
    component.onValidationError('Invalid file');

    component.onFileSelected(mockFile);

    expect(component.errorMessage()).toBe('');
  });

  it('should remove selected file', () => {
    component.onFileSelected(mockFile);

    component.onFileRemoved();

    expect(component.selectedFile()).toBeNull();
  });

  it('should set validation error', () => {
    component.onValidationError('File is too large');

    expect(component.errorMessage()).toBe('File is too large');
  });

  it('should return the selected file name', () => {
    component.onFileSelected(mockFile);

    expect(component.fileName).toBe('meeting.txt');
  });

  it('should return the selected file size', () => {
    component.onFileSelected(mockFile);

    expect(component.fileSize).toContain('KB');
  });

  it('should not allow submission without a title', () => {
    component.onFileSelected(mockFile);

    expect(component.canSubmit()).toBe(false);
  });

  it('should not allow submission without a file', () => {
    component.onTitleChange('Weekly Stand-up');

    expect(component.canSubmit()).toBe(false);
  });

  it('should allow submission with a title and file', () => {
    component.onTitleChange('Weekly Stand-up');
    component.onFileSelected(mockFile);

    expect(component.canSubmit()).toBe(true);
  });

  it('should reject a blank title', () => {
    component.onTitleChange('   ');
    component.onFileSelected(mockFile);

    expect(component.canSubmit()).toBe(false);
  });

  it('should submit a valid meeting', () => {
    component.onTitleChange('Weekly Stand-up');
    component.onFileSelected(mockFile);

    component.submitMeeting();

    expect(component.submitted()).toBe(true);
  });

  it('should display an error when submitting invalid data', () => {
    component.submitMeeting();

    expect(component.errorMessage()).toBe('Please provide a meeting title and transcript.');
  });

  it('should reset the form', () => {
    component.onTitleChange('Weekly Stand-up');
    component.onDateChange('2026-11-25');
    component.onFileSelected(mockFile);
    component.submitMeeting();

    component.resetForm();

    expect(component.meetingTitle()).toBe('');
    expect(component.meetingDate()).toBe('');
    expect(component.selectedFile()).toBeNull();
    expect(component.submitted()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('should render the upload heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Upload a meeting');
  });

  it('should render the meeting details section', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Meeting details');
  });

  it('should render the supported formats', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('TXT');
    expect(compiled.textContent).toContain('VTT');
    expect(compiled.textContent).toContain('MD');
  });

  it('should render the workflow information', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('What happens next?');
    expect(compiled.textContent).toContain('AI summarisation');
    expect(compiled.textContent).toContain('Action items');
  });

  it('should render the selected file preview', () => {
    component.onFileSelected(mockFile);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('meeting.txt');
  });

  it('should render the success card after submission', () => {
    component.onTitleChange('Weekly Stand-up');
    component.onFileSelected(mockFile);
    component.submitMeeting();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('uploaded successfully');
  });

  it('should navigate to dashboard when going back', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });
});
