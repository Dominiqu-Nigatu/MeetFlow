import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  accept = input('.txt,.vtt,.md');
  maxSizeMB = input(10);
  disabled = input(false);
  label = input('Upload a file');
  hint = input('Drag and drop your file here, or browse');

  fileSelected = output<File>();
  fileRemoved = output<void>();
  validationError = output<string>();

  selectedFile = signal<File | null>(null);
  errorMessage = signal<string | null>(null);
  isDragging = signal(false);

  get acceptedExtensions(): string[] {
    return this.accept()
      .split(',')
      .map((extension) => extension.trim().toLowerCase());
  }

  onFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this.validateFile(file);
    }

    inputElement.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (this.disabled()) return;

    const file = event.dataTransfer?.files[0];

    if (file) {
      this.validateFile(file);
    }
  }

  validateFile(file: File): void {
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

    if (!this.acceptedExtensions.includes(extension)) {
      this.setError(`Invalid file type. Accepted formats: ${this.accept()}`);
      return;
    }

    const maxSizeBytes = this.maxSizeMB() * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.setError(`File is too large. Maximum size is ${this.maxSizeMB()} MB.`);
      return;
    }

    this.errorMessage.set(null);
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.fileRemoved.emit();
  }

  private setError(message: string): void {
    this.errorMessage.set(message);
    this.validationError.emit(message);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
