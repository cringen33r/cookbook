import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'cb-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Подтверждение</h2>
    <mat-dialog-content>Удалить рецепт?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Нет</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Да</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule],
  standalone: true
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 