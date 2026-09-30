import { Router } from 'express'
import { upload } from '../middleware/upload.js'

const router = Router()

// Upload une ou plusieurs images
router.post('/images', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Aucun fichier reçu' })
  }

  const urls = req.files.map(
    (file) => `http://localhost:3001/uploads/products/${file.filename}`
  )

  res.json({ urls })
})

export default router