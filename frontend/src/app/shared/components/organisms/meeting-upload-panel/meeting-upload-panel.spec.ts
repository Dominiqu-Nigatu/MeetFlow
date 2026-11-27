import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingUploadPanel } from './meeting-upload-panel';

describe('MeetingUploadPanel', () => {
  let component: MeetingUploadPanel;
  let fixture: ComponentFixture<MeetingUploadPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingUploadPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingUploadPanel);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty title', () => {
    expect(component.title()).toBe('');
  });

  it('should start without a selected file', () => {
    expect(component.selectedFile()).toBeNull();
  });

  it('should update the meeting title', () => {
    component.onTitleChange('Weekly stand-up');

    expect(component.title()).toBe('Weekly stand-up');
  });

  it('should store a selected file', () => {
    const file = new File(['Meeting transcript'], 'meeting.txt', {
      type: 'text/plain',
    });

    component.onFileSelected(file);

    expect(component.selectedFile()).toBe(file);
  });

  it('should clear the selected file when removed', () => {
    const file = new File(['Meeting transcript'], 'meeting.txt');

    component.onFileSelected(file);
    component.onFileRemoved();

    expect(component.selectedFile()).toBeNull();
  });

  it('should emit the title and file when submitted', () => {
    const file = new File(['Meeting transcript'], 'meeting.txt');
    const spy = vi.spyOn(component.uploadSubmitted, 'emit');

    component.onTitleChange('Weekly stand-up');
    component.onFileSelected(file);

    component.onSubmit(new Event('submit'));

    expect(spy).toHaveBeenCalledWith({
      title: 'Weekly stand-up',
      file,
    });
  });

  it('should not submit when the title is empty', () => {
    const file = new File(['Meeting transcript'], 'meeting.txt');
    const spy = vi.spyOn(component.uploadSubmitted, 'emit');

    component.onFileSelected(file);
    component.onSubmit(new Event('submit'));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when no file is selected', () => {
    const spy = vi.spyOn(component.uploadSubmitted, 'emit');

    component.onTitleChange('Weekly stand-up');
    component.onSubmit(new Event('submit'));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should trim whitespace from the title before submitting', () => {
    const file = new File(['Meeting transcript'], 'meeting.txt');
    const spy = vi.spyOn(component.uploadSubmitted, 'emit');

    component.onTitleChange('  Weekly stand-up  ');
    component.onFileSelected(file);
    component.onSubmit(new Event('submit'));

    expect(spy).toHaveBeenCalledWith({
      title: 'Weekly stand-up',
      file,
    });
  });
});
