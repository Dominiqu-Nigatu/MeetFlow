import { Component, output, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';
import { FileUpload } from '../../atoms/file-upload/file-upload';

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
  title = signal('');
  selectedFile = signal<File | null>(null);

  uploadSubmitted = output<MeetingUploadData>();

  onTitleChange(value: string): void {
    this.title.set(value);
  }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  onFileRemoved(): void {
    this.selectedFile.set(null);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const title = this.title().trim();
    const file = this.selectedFile();

    if (!title || !file) {
      return;
    }

    this.uploadSubmitted.emit({ title, file });
  }
}