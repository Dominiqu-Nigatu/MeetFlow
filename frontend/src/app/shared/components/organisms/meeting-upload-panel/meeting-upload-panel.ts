import { Component, inject, output, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';
import { FileUpload } from '../../atoms/file-upload/file-upload';

import { LocalMeetings } from '../../../../core/services/local-meetings';

export interface MeetingUploadData {
  title: string;
  file: File;
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
  selectedFile = signal<File | null>(null);

  uploadSubmitted = output<MeetingUploadData>();

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

    if (!title || !file || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    try {
      await this.localMeetings.save(title, file);
      this.successMessage.set(
        'Saved in this browser. You can find it in Meetings. AI processing is not connected yet.',
      );
      this.uploadSubmitted.emit({ title, file });
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
