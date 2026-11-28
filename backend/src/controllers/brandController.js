import { brandService } from '../services/brandService.js';

export const getAll = async (req, res, next) => {
  try {
    const brands = await brandService.getAll();
    res.json({ success: true, data: brands, count: brands.length });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const brand = await brandService.getById(req.params.id);
    if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    if (!req.body?.name || !String(req.body.name).trim()) {
      return res.status(400).json({ success: false, error: 'Brand name is required' });
    }
    const brand = await brandService.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const brand = await brandService.update(req.params.id, req.body);
    if (!brand) return res.status(404).json({ success: false, error: 'Brand not found' });
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await brandService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
};
