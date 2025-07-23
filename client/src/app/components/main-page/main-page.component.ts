import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RecipeCardComponent } from 'src/app/components/recipe-card/recipe-card.component';
import { ApiService } from 'src/app/services/api.service';
import { PageComponent } from 'src/app/shared/classes/page.component';
import { Recipe } from 'src/app/shared/models/recipe.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SearcherComponent } from '../searcher/searcher.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'cb-main-page',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent, MatProgressSpinnerModule, SearcherComponent, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent extends PageComponent implements OnInit {
  recipes: Recipe[] = [];
  override pageName = 'Main';
  private apiService = inject(ApiService);
  
  override ngOnInit(): void {
    super.ngOnInit();
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading.set(true);
    this.error = null;
    
    this.apiService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error = "Failed loading recipes";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
  searchRecipes(query: string) {
    this.isLoading.set(true);
    this.error = null;

    if (query === '') {
      this.loadRecipes();
      return;
    }
    
    this.apiService.searchRecipes(query).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error = "Failed searching recipes";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
}
