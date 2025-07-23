import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Recipe } from 'src/app/shared/models/recipe.model';
import {MatTooltipModule} from '@angular/material/tooltip';

type RecipeMode = 'preview' | 'full';
@Component({
  selector: 'cb-recipe-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  private router = inject(Router);
  @Input() mode: RecipeMode = 'preview';
  @Input(/*{ required: true }*/) recipe!: Recipe;

  ngOnInit() {
    if (this.recipe.imageUrl === undefined) {
      this.recipe.imageUrl = "/uploads/default-recipe-image.png"
    }
  }

  onClick() {
    this.openRecipe();
  }

  openRecipe() {
    if (this.mode === 'preview')
      this.router.navigate(['/recipe', this.recipe.id]);
  }
  onEdit() {
    this.router.navigate(['/creator', this.recipe.id]);
  }
}
