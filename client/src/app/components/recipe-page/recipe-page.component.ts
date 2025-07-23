import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { PageComponent } from 'src/app/shared/classes/page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'cb-recipe-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RecipeCardComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent extends PageComponent implements OnInit {
  recipe: Recipe | null = null;

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  override pageName = 'Recipe';

  override ngOnInit(): void {
    super.ngOnInit();
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      if (recipeId) {
        this.loadRecipe(recipeId);
      } else {
        this.error = 'Recipe ID not provided';
        this.isLoading.set(false);
      }
    });
  }

  loadRecipe(recipeId: string): void {
    this.isLoading.set(true);
    this.error = null;
    
    this.apiService.getRecipe(recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error = "Failed loading the recipe";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
}