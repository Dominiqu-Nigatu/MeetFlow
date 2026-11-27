import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/atoms/button/button';
import { Input } from '../../../shared/components/atoms/input/input';
import { FileUpload } from '../../../shared/components/atoms/file-upload/file-upload';

@Component({
  selector: 'app-transcript-upload',
  standalone: true,
  imports: [Button, Input, FileUpload],
  templateUrl: './transcript-upload.html',
  styleUrl: './transcript-upload.scss',
})
export class TranscriptUpload {
  meetingTitle = signal('');
  meetingDate = signal('');
  selectedFile = signal<File | null>(null);
  errorMessage = signal('');
  isSubmitting = signal(false);
  submitted = signal(false);

  constructor(private router: Router) {}

  onTitleChange(value: string): void {
    this.meetingTitle.set(value);
  }

  onDateChange(value: string): void {
    this.meetingDate.set(value);
  }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
    this.errorMessage.set('');
    this.submitted.set(false);
  }

  onFileRemoved(): void {
    this.selectedFile.set(null);
  }

  onValidationError(message: string): void {
    this.errorMessage.set(message);
  }

  get fileName(): string {
    return this.selectedFile()?.name ?? '';
  }

  get fileSize(): string {
    const file = this.selectedFile();

    if (!file) return '';

    const sizeInKB = file.size / 1024;

    if (sizeInKB >= 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }

    return `${sizeInKB.toFixed(1)} KB`;
  }

  canSubmit(): boolean {
    return !!this.meetingTitle().trim() && !!this.selectedFile();
  }

  submitMeeting(): void {
    if (!this.canSubmit()) {
      this.errorMessage.set('Please provide a meeting title and transcript.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulated frontend submission.
    this.isSubmitting.set(false);
    this.submitted.set(true);
  }

  resetForm(): void {
    this.meetingTitle.set('');
    this.meetingDate.set('');
    this.selectedFile.set(null);
    this.errorMessage.set('');
    this.submitted.set(false);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
