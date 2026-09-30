import { Router } from 'express'
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController.js'

const router = Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/:id/similar', getSimilarProducts)
router.get('/:id', getProductById)

// Admin
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router