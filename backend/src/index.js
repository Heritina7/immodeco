import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRouter from './routes/upload.js'
import serverless from 'serverless-http' // 👈 1. Importez serverless-http

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Furniture API is running' })
})

// Routes principales
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

// ✅ ROUTES D'UPLOAD ET FICHIERS STATIQUES (Placées AVANT le 404)
app.use('/api/upload', uploadRouter)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 🛑 404 (Doit toujours être positionné à la fin, juste avant le gestionnaire d'erreurs global)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// 👈 2. Conditionner le app.listen pour le développement local uniquement
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📦 API: http://localhost:${PORT}/api`)
  })
}

// 👈 3. Exporter l'application enveloppée pour Netlify
export const handler = serverless(app)