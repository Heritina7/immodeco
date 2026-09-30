import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  uploadImages,
} from '../../api/client'

const empty = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  images: [],          // always an array of URLs
  colors: '',
  materials: '',
  features: '',
  stock: 0,
  isNew: false,
  isPromo: false,
  categorySlug: 'chaises',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(empty)
  const [categories, setCategories] = useState([])
  const [previewFiles, setPreviewFiles] = useState([]) // local previews before upload finishes
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getProductById(id)
      .then((p) => {
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price ?? '',
          oldPrice: p.oldPrice ?? '',
          images: p.images || [],           // array
          colors: (p.colors || []).join(', '),
          materials: (p.materials || []).join(', '),
          features: (p.features || []).join('\n'),
          stock: p.stock ?? 0,
          isNew: p.isNew || false,
          isPromo: p.isPromo || false,
          categorySlug: p.category || 'chaises',
        })
      })
      .catch((err) => setError(err.message))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Local previews
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviewFiles((prev) => [...prev, ...previews])

    // Upload
    setUploading(true)
    setError('')
    try {
      const { urls } = await uploadImages(files)
      setForm((f) => ({
        ...f,
        images: [...(f.images || []), ...urls],
      }))
      // Clear local previews once uploaded (optional – keep them if you prefer)
      setPreviewFiles([])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }))
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice === '' ? null : parseFloat(form.oldPrice),
      images: form.images,                 // already an array of URLs
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      materials: form.materials.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock, 10) || 0,
      isNew: form.isNew,
      isPromo: form.isPromo,
      categorySlug: form.categorySlug,
    }

    try {
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        to="/admin/products"
        className="text-sm text-gray-500 hover:text-accent mb-4 inline-block"
      >
        ← Retour à la liste
      </Link>

      <h1 className="text-2xl font-semibold text-primary mb-6">
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Nom *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Catégorie *</label>
          <select
            name="categorySlug"
            value={form.categorySlug}
            onChange={handleChange}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prix */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Prix (€) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Ancien prix (€)</label>
            <input
              type="number"
              step="0.01"
              name="oldPrice"
              value={form.oldPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Images – upload */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Images du produit</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFilesChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
          />

          {uploading && (
            <p className="text-sm text-accent mt-2">Upload en cours...</p>
          )}

          {/* Aperçus (URLs déjà uploadées + previews locales) */}
          {(form.images?.length > 0 || previewFiles.length > 0) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {form.images.map((url, i) => (
                <div key={url} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {previewFiles.map((p, i) => (
                <div key={p.url} className="relative w-20 h-20 opacity-60">
                  <img
                    src={p.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Couleurs / Matières / Caractéristiques */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Couleurs (séparées par des virgules)
          </label>
          <input
            name="colors"
            value={form.colors}
            onChange={handleChange}
            className={inputClass}
            placeholder="Noir, Blanc, Chêne"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Matières (séparées par des virgules)
          </label>
          <input
            name="materials"
            value={form.materials}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Caractéristiques (une par ligne)
          </label>
          <textarea
            name="features"
            rows={3}
            value={form.features}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
            />
            Nouveau
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isPromo"
              checked={form.isPromo}
              onChange={handleChange}
            />
            Promo
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition disabled:opacity-50"
        >
          {loading
            ? 'Enregistrement...'
            : isEdit
            ? 'Enregistrer'
            : 'Créer le produit'}
        </button>
      </form>
    </div>
  )
}