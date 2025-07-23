export interface Recipe {
  id: string;
  imageUrl?: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  updatedAt: Date;
}

export interface Ingredient {
  product: string;
  amount: number;
  unit: Unit;
}

export enum Unit {
  Gram = 'гр.',
  Kg = 'кг.',
  Ml = 'мл',
  L = 'л.',
  Piece = 'штука',
  Tsp = 'ч.л.',
  Tbsp = 'ст.л.',
  Glass = 'стакан',
}
