import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Unit } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'cb-ingredient-row',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="ingredient" class="ingredient-row">
      <mat-form-field appearance="outline">
        <mat-label>Продукт</mat-label>
        <input matInput formControlName="product" maxlength="40" required />
      </mat-form-field>
      <mat-form-field appearance="outline" class="amount-field">
        <mat-label>Кол-во</mat-label>
        <input matInput type="number" formControlName="amount" max="10000" required />
      </mat-form-field>
      <mat-form-field appearance="outline" class="unit-field">
        <mat-label>Ед. изм.</mat-label>
        <mat-select formControlName="unit">
          <mat-option *ngFor="let unit of unitOptions" [value]="unit">{{ unit }}</mat-option>
        </mat-select>
      </mat-form-field>
      <button mat-icon-button color="warn" (click)="remove.emit(index)" *ngIf="index !== 0">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./creator-page.component.scss']
})
export class IngredientRowComponent {
  @Input() ingredient!: FormGroup;
  @Input() index!: number;
  @Output() remove = new EventEmitter<number>();
  unitOptions = Object.values(Unit);
} 