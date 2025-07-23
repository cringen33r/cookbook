import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cb-searcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field subscriptSizing="dynamic" appearance="outline" class="search-field">
    <mat-label>Поиск товаров</mat-label>
    <input 
      matInput 
      [formControl]="searchControl" 
      placeholder="Введите название рецепта"
    >
    <mat-icon matSuffix>search</mat-icon>
  </mat-form-field>
  `,
  styles: [``]
})
export class SearcherComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();
  searchControl = new FormControl('');
  
  ngOnInit() {
    this.setupSearchDebounce();
  }

  private setupSearchDebounce() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.emitSearchEvent(query || '');
      });
  }

  private emitSearchEvent(query: string) {
    this.searchChanged.emit(query);
  }
}
