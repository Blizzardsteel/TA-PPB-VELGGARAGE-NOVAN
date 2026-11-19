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
