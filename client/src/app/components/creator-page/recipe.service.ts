import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private api = inject(ApiService);

  getRecipe(id: string): Observable<Recipe> {
    return this.api.getRecipe(id);
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.api.createRecipe(recipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.api.updateRecipe(id, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.api.deleteRecipe(id);
  }

  uploadImage(file: File): Observable<{ success: number; file: { url: string } }> {
    return this.api.uploadImage(file);
  }
} 