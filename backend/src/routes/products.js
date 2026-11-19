import { Router } from 'express';
import {
  getAll,
  search,
  getByBrand,
  getByCategory,
  getById,
} from '../controllers/productController.js';

const router = Router();

// NOTE: specific named routes MUST come before /:id
router.get('/search', search);
router.get('/brand/:brandId', getByBrand);
router.get('/category/:category', getByCategory);
router.get('/', getAll);
router.get('/:id', getById);

export default router;
