import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recipe } from '../shared/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
      catchError(this.handleError)
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes/search/${encodeURIComponent(query)}`).pipe(
      catchError(this.handleError)
    );
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe).pipe(
      catchError(this.handleError)
    );
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/recipes/${id}`, recipe).pipe(
      catchError(this.handleError)
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipes/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Image upload
  uploadImage(file: File): Observable<{ success: number; file: { url: string } }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ success: number; file: { url: string } }>(`${this.apiUrl}/uploads`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
