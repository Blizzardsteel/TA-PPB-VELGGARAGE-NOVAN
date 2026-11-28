import { productService } from '../services/productService.js';

export const getAll = async (req, res, next) => {
  try {
    const { brand, category, construction_type, diameter, sort, q, featured } = req.query;
    const products = await productService.getAll({
      brand,
      category,
      construction_type,
      diameter,
      sort,
      q,
      featured,
    });
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

export const create = async (req, res, next) => {
  try {
    if (!req.body?.name || !String(req.body.name).trim()) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await productService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
