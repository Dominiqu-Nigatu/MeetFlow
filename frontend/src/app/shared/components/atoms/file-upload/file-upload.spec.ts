import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUpload } from './file-upload';

describe('FileUpload', () => {
  let component: FileUpload;
  let fixture: ComponentFixture<FileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUpload);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the upload label', () => {
    expect(fixture.nativeElement.textContent).toContain('Upload a file');
  });

  it('should accept text, vtt and markdown files by default', () => {
    expect(component.acceptedExtensions).toEqual(['.txt', '.vtt', '.md']);
  });

  it('should select a valid text file', () => {
    const file = new File(['Meeting notes'], ['meeting.txt'][0], {
      type: 'text/plain',
    });

    const emitSpy = vi.spyOn(component.fileSelected, 'emit');

    component.validateFile(file);

    expect(component.selectedFile()).toBe(file);
    expect(emitSpy).toHaveBeenCalledWith(file);
  });

  it('should select a valid vtt file', () => {
    const file = new File(['WEBVTT'], 'meeting.vtt');

    component.validateFile(file);

    expect(component.selectedFile()).toBe(file);
  });

  it('should select a valid markdown file', () => {
    const file = new File(['# Notes'], 'meeting.md');

    component.validateFile(file);

    expect(component.selectedFile()).toBe(file);
  });

  it('should reject unsupported file types', () => {
    const file = new File(['image'], 'image.png');

    component.validateFile(file);

    expect(component.selectedFile()).toBeNull();
    expect(component.errorMessage()).toContain('Invalid file type');
  });

  it('should reject files exceeding the maximum size', () => {
    fixture.componentRef.setInput('maxSizeMB', 1);

    const file = {
      name: 'large.txt',
      size: 2 * 1024 * 1024,
    } as File;

    component.validateFile(file);

    expect(component.selectedFile()).toBeNull();
    expect(component.errorMessage()).toContain('File is too large');
  });

  it('should remove the selected file', () => {
    const file = new File(['Notes'], 'meeting.txt');
    component.validateFile(file);

    const emitSpy = vi.spyOn(component.fileRemoved, 'emit');

    component.removeFile();

    expect(component.selectedFile()).toBeNull();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should format file sizes correctly', () => {
    expect(component.formatFileSize(500)).toBe('500 B');
    expect(component.formatFileSize(2048)).toBe('2.0 KB');
    expect(component.formatFileSize(1048576)).toBe('1.0 MB');
  });

  it('should clear the error after selecting a valid file', () => {
    component.validateFile(new File(['image'], 'image.png'));
    component.validateFile(new File(['Notes'], 'meeting.txt'));

    expect(component.errorMessage()).toBeNull();
  });
});
