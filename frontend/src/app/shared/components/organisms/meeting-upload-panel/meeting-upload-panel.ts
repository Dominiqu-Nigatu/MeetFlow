import { Component, inject, output, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';
import { FileUpload } from '../../atoms/file-upload/file-upload';

import { LocalMeetings } from '../../../../core/services/local-meetings';

export interface MeetingUploadData {
  title: string;
  file: File;
  meetingDate?: string;
}

@Component({
  selector: 'app-meeting-upload-panel',
  standalone: true,
  imports: [Button, Input, FileUpload],
  templateUrl: './meeting-upload-panel.html',
  styleUrl: './meeting-upload-panel.scss',
})
export class MeetingUploadPanel {
  private readonly localMeetings = inject(LocalMeetings);
  readonly saving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  title = signal('');
  readonly meetingDate = signal('');
  readonly transcriptText = signal('');
  readonly mode = signal<'file' | 'text'>('file');
  private static nextId = 0;
  readonly formId = `transcript-intake-${MeetingUploadPanel.nextId++}`;
  selectedFile = signal<File | null>(null);

  uploadSubmitted = output<MeetingUploadData>();

  setMode(mode: 'file' | 'text'): void {
    if (this.saving()) return;
    this.mode.set(mode);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  canSubmit(): boolean {
    return (
      !!this.title().trim() &&
      (this.mode() === 'file' ? !!this.selectedFile() : !!this.transcriptText().trim())
    );
  }

  onValidationError(message: string): void {
    this.selectedFile.set(null);
    this.errorMessage.set(message);
    this.successMessage.set('');
  }

  onTitleChange(value: string): void {
    this.title.set(value);
    this.successMessage.set('');
  }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  onFileRemoved(): void {
    this.selectedFile.set(null);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const title = this.title().trim();
    const file = this.selectedFile();

    if (this.saving()) return;
    if (!this.canSubmit()) {
      this.errorMessage.set('Please provide a meeting title and transcript.');
      return;
    }

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    try {
      const date = this.meetingDate() || undefined;
      const text = this.transcriptText();
      if (this.mode() === 'file') {
        await this.localMeetings.save(title, file!, date);
      } else {
        await this.localMeetings.saveText(title, text, date);
      }
      this.successMessage.set('Saved in this browser.');
      this.uploadSubmitted.emit({
        title,
        file:
          this.mode() === 'file'
            ? file!
            : new File([text], 'Pasted transcript.txt', { type: 'text/plain' }),
        ...(date ? { meetingDate: date } : {}),
      });
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : 'Could not save your transcript. Please try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
