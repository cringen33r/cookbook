import { Routes } from '@angular/router';
import { CreatorPageComponent } from './components/creator-page/creator-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RecipePageComponent } from './components/recipe-page/recipe-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'recipe/:id', component: RecipePageComponent },
  { path: 'creator/:id', component: CreatorPageComponent },
  { path: 'creator', component: CreatorPageComponent },
]