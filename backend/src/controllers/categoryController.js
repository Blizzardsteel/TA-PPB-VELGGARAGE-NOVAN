import { productService } from '../services/productService.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.json({ success: true, data: categories, count: categories.length });
  } catch (err) {
    next(err);
  }
};
