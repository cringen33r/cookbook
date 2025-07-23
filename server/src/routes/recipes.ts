import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { Recipe } from '../models/models';

const router = Router();
const DB_PATH = path.join(process.cwd(), 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { recipes: [] };
    }
    throw error;
  }
}

async function writeDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// GET RECIPES
router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.recipes || []);
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
});

// GET RECIPE
router.get('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const recipe = db.recipes.find((r: Recipe) => r.id === req.params.id);
    
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
});

// CREATE RECIPE
router.post('/', async (req, res) => {
  try {
    const db = await readDB();
    const newRecipe: Recipe = {
      id: uuidv4(),
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.recipes.push(newRecipe);
    await writeDB(db);
    
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create recipe' });
  }
});

// UPDATE RECIPE
router.put('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.recipes.findIndex((r: Recipe) => r.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const oldRecipe = db.recipes[index];
    const newImageUrl = req.body.imageUrl;
    
    // Удаляем старое изображение, если оно изменилось
    if (oldRecipe.imageUrl && oldRecipe.imageUrl !== newImageUrl) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldRecipe.imageUrl));
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.log('Old image not found or already deleted');
      }
    }
    
    const updatedRecipe: Recipe = {
      ...oldRecipe,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.recipes[index] = updatedRecipe;
    await writeDB(db);
    
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe' });
  }
});

// DELETE RECIPE
router.delete('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const recipe = db.recipes.find((r: Recipe) => r.id === req.params.id);
    
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(recipe.imageUrl));
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log('Image not found or already deleted');
      }
    }

    db.recipes = db.recipes.filter((r: Recipe) => r.id !== req.params.id);
    await writeDB(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
});

// GET RECIPES with query
router.get('/search/:query', async (req, res) => {
  try {
    const db = await readDB();
    const query = req.params.query.toLowerCase();
    
    const results = db.recipes.filter((recipe: Recipe) => 
      recipe.title.toLowerCase().includes(query)
    );
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;