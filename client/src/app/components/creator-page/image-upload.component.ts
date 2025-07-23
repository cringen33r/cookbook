import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cb-image-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="image-upload-section">
      <input
        type="file"
        #imageInput
        (change)="onFileChange($event)"
        accept="image/*"
        hidden />
      <div class="image-preview" *ngIf="imagePreview">
        <img [src]="imagePreview" alt="Картинка блюда" />
        <button mat-icon-button class="remove-image" (click)="removeImage()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <button
        mat-raised-button
        color="primary"
        type="button"
        (click)="imageInput.click()">
        <mat-icon>add_photo_alternate</mat-icon>
        {{ imagePreview ? 'Изменить изображение' : 'Добавить изображение' }}
      </button>
    </div>
  `,
  styleUrls: ['./creator-page.component.scss']
})
export class ImageUploadComponent {
  @Input() imagePreview: string | null = null;
  @Output() fileChange = new EventEmitter<File | null>();
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileChange.emit(input.files[0]);
    }
  }

  removeImage() {
    this.fileChange.emit(null);
    if (this.imageInput) {
      this.imageInput.nativeElement.value = '';
    }
  }
} 