/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient, Recipe, Unit } from 'src/app/shared/models/recipe.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageComponent } from 'src/app/shared/classes/page.component';
import { ImageUploadComponent } from './image-upload.component';
import { IngredientRowComponent } from './ingredient-row.component';
import { InstructionRowComponent } from './instruction-row.component';
import { RecipeService } from './recipe.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'cb-creator-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatOptionModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
    IngredientRowComponent,
    InstructionRowComponent,
    ImageUploadComponent,
    MatDialogModule,
  ],
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.scss'],
})
export class CreatorPageComponent extends PageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  override pageName = "Creator";

  imagePreview: string | null = null;
  isEditMode = false;

  private recipeId: string | null = null;
  private originalRecipe: any = null;

  public recipeForm: FormGroup = this.createRecipeForm();

  // getters

  get ingredients(): FormArray<FormGroup> {
    return this.recipeForm.get('ingredients') as FormArray<FormGroup>;
  }
  get instructions(): FormArray<FormControl> {
    return this.recipeForm.get('instructions') as FormArray<FormControl>;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // getting right recipe from the path
    this.route.params.subscribe(params => {
      this.recipeId = params['id'] ?? null;
      this.isEditMode = !!this.recipeId;
      if (this.isEditMode && this.recipeId) {
        this.loadRecipe(this.recipeId);
      }
      this.isLoading.set(false);
    });
  }

  // initialisating form
  private createRecipeForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      image: [null as File | null],
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([this.createInstructionControl()]),
    });
  }

  private createIngredient(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      amount: ['', Validators.required],
      unit: [Unit.Gram, Validators.required],
    });
  }

  private createInstructionControl(): FormControl {
    return this.fb.control('', Validators.required);
  }

  // ingredients
  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }
  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  // instructions
  addInstruction(): void {
    this.instructions.push(this.createInstructionControl());
  }
  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  // image handling
  onImageFileChange(file: File | null): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.recipeForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
      this.recipeForm.patchValue({ image: null });
    }
  }

  onSubmit(): void {
    if (!this.recipeForm.valid) return;
    if (this.isEditMode && !this.hasChanges()) return;
    const formRawValue = this.recipeForm.value;
    const formValue = {
      ...formRawValue,
      title: formRawValue.title ?? '',
      description: formRawValue.description ?? '',
    };
    if (formValue.image) {
      this.recipeService.uploadImage(formValue.image).subscribe({
        next: (uploadResponse: { success: number; file: { url: string } }) => {
          const recipeToSend = this.prepareRecipePayload(formValue, uploadResponse.file.url);
          this.saveRecipe(recipeToSend);
        },
        error: (error: Error) => {
          console.error('Error uploading image:', error.message);
        },
      });
    } else {
      const recipeToSend = this.prepareRecipePayload(formValue);
      this.saveRecipe(recipeToSend);
    }
  }

  private prepareRecipePayload(formValue: any, imageUrl?: string) {
    const payload = { ...formValue };
    payload.ingredients = payload.ingredients.map((ingredient: any) => ({
      ...ingredient,
      amount: Number(ingredient.amount),
      unit: ingredient.unit as Unit,
    }));
    if (imageUrl) {
      payload.imageUrl = imageUrl;
    }
    delete payload.image;
    return payload;
  }

  private saveRecipe(recipeToSend: any): void {
    if (this.isEditMode && this.recipeId) {
      this.recipeService.updateRecipe(this.recipeId, recipeToSend).subscribe({
        next: (response: Recipe) => {
          console.log('Recipe updated successfully:', response);
          this.router.navigate(['recipe', this.recipeId]);
        },
        error: (error: Error) => {
          console.error('Error updating recipe:', error.message);
        },
      });
    } else {
      this.recipeService.createRecipe(recipeToSend).subscribe({
        next: (response: Recipe) => {
          console.log('Recipe created successfully:', response);
          this.router.navigate(['recipe', response.id]);
        },
        error: (error: Error) => {
          console.error('Error creating recipe:', error.message);
        },
      });
    }
  }

  private loadRecipe(id: string): void {
    this.isLoading.set(true);
    this.error = null;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe: Recipe) => {
        this.isLoading.set(false);
        this.fillFormWithRecipe(recipe);
      },
      error: (err: unknown) => {
        this.error = "Failed loading the recipe";
        this.isLoading.set(false);
        console.error(err instanceof Error ? err.message : err);
      },
    });
  }

  private fillFormWithRecipe(recipe: Recipe): void {
    this.clearFormArrays();
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description || '',
    });
    recipe.ingredients.forEach((ingredient: Ingredient) => {
      this.ingredients.push(this.fb.group({
        product: [ingredient.product, Validators.required],
        amount: [ingredient.amount, Validators.required],
        unit: [ingredient.unit as Unit, Validators.required],
      }));
    });
    (recipe.instructions || ['']).forEach((instruction: string) => {
      this.instructions.push(this.fb.control(instruction, Validators.required));
    });
    if (recipe.imageUrl) {
      // i'm too tired to remove this hardcode
      this.imagePreview = this.isEditMode
        ? `http://localhost:3000${recipe.imageUrl}`
        : recipe.imageUrl;
    }
    this.originalRecipe = this.getCurrentRecipeState();
  }

  private getCurrentRecipeState(): any {
    return {
      ...this.recipeForm.value,
      imagePreview: this.imagePreview,
    };
  }

  hasChanges(): boolean {
    if (!this.originalRecipe) return false;
    const current = this.getCurrentRecipeState();
    return JSON.stringify(current) !== JSON.stringify(this.originalRecipe);
  }

  private clearFormArrays(): void {
    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }
    while (this.instructions.length) {
      this.instructions.removeAt(0);
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.recipeId) {
      this.router.navigate(['recipe', this.recipeId]);
    } else {
      this.router.navigate(['main']);
    }
  }

  onDelete(): void {
    if (!this.isEditMode || !this.recipeId) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(this.recipeId!).subscribe({
          next: () => {
            console.log('Recipe deleted successfully:');
            this.router.navigate(['main']);
          },
          error: (error: Error) => {
            console.error('Error deleting recipe:', error.message);
          },
        });
      }
    });
  }
}
