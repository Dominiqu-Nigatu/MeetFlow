import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingUploadPanel } from '../../../shared/components/organisms/meeting-upload-panel/meeting-upload-panel';

@Component({
  selector: 'app-transcript-upload',
  standalone: true,
  imports: [MeetingUploadPanel],
  templateUrl: './transcript-upload.html',
  styleUrl: './transcript-upload.scss',
})
export class TranscriptUpload {
  private readonly router = inject(Router);
  goBack(): void {
    void this.router.navigate(['/dashboard']);
  }
}
