import { productService } from '../services/productService.js';

export const getAll = async (req, res, next) => {
  try {
    const { brand, category, diameter, sort, q, featured } = req.query;
    const products = await productService.getAll({ brand, category, diameter, sort, q, featured });
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, error: 'Query parameter ?q= is required' });
    }
    const products = await productService.search(q.trim());
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const getByBrand = async (req, res, next) => {
  try {
    const products = await productService.getByBrandId(req.params.brandId);
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const getByCategory = async (req, res, next) => {
  try {
    const products = await productService.getByCategory(req.params.category);
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
