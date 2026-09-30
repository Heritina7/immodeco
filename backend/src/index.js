import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import ordersRouter from './ordersRouter.js' // Ajustez selon votre chemin (ex: './routes/orders.js')
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRouter from './routes/upload.js'
import serverless from 'serverless-http'

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
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Furniture API is running' })
})

// Routes principales doublées (avec et sans /api pour éviter tout conflit de redirection Netlify)
app.use('/api/categories', categoriesRouter)
app.use('/categories', categoriesRouter)

app.use('/api/products', productsRouter)
app.use('/products', productsRouter)

app.use('/api/orders', ordersRouter)
app.use('/orders', ordersRouter)

// Routes d'upload et fichiers statiques doublées
app.use('/api/upload', uploadRouter)
app.use('/upload', uploadRouter)

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')))

// Gestionnaire 404 (Doit toujours être positionné à la fin, juste avant les erreurs)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler global
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Démarrage local pour le développement
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📦 API: http://localhost:${PORT}/api`)
  })
}

// Exportation serverless obligatoire pour Netlify
export const handler = serverless(app)