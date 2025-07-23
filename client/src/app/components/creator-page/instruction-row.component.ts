import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'cb-instruction-row',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <div class="instruction-row">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Шаг {{ index + 1 }}</mat-label>
        <textarea matInput [formControl]="instruction" required></textarea>
      </mat-form-field>
      <button mat-icon-button color="warn" (click)="remove.emit(index)" *ngIf="canRemove">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./creator-page.component.scss']
})
export class InstructionRowComponent {
  @Input() instruction!: FormControl<string>;
  @Input() index!: number;
  @Input() canRemove = true;
  @Output() remove = new EventEmitter<number>();
} 