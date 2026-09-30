import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import serverless from 'serverless-http'

// Importations statiques (standard et sans top-level await)
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import uploadRouter from './routes/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: true,
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

// Enregistrement des routes
app.use('/api/categories', categoriesRouter)
app.use('/categories', categoriesRouter)

app.use('/api/products', productsRouter)
app.use('/products', productsRouter)

app.use('/api/orders', ordersRouter)
app.use('/orders', ordersRouter)

app.use('/api/upload', uploadRouter)
app.use('/upload', uploadRouter)

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')))

// Gestionnaire 404
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
})

// Error handler global
app.use((err, req, res, next) => {
  console.error("Erreur interne du serveur :", err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Démarrage local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

// Export serverless pour Netlify
export const handler = serverless(app)