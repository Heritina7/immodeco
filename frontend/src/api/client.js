const API_URL = import.meta.env.VITE_API_URL || ''

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erreur serveur' }))
    throw new Error(error.error || `Erreur ${res.status}`)
  }

  return res.json()
}

// ========== PRODUITS ==========
export async function getProducts(params = {}) {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.minPrice != null) query.set('minPrice', params.minPrice)
  if (params.maxPrice != null) query.set('maxPrice', params.maxPrice)
  if (params.colors?.length) query.set('colors', params.colors.join(','))
  if (params.promo) query.set('promo', 'true')
  if (params.sort) query.set('sort', params.sort)
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)

  const qs = query.toString()
  return request(`/products${qs ? `?${qs}` : ''}`)
}

export async function getProductById(id) {
  return request(`/products/${id}`)
}

export async function getFeaturedProducts() {
  return request('/products/featured')
}

export async function getSimilarProducts(id) {
  return request(`/products/${id}/similar`)
}

export async function createProduct(data) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id, data) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  })
}

// ========== CATÉGORIES ==========
export async function getCategories() {
  return request('/categories')
}

// ========== COMMANDES ==========
export async function createOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
}

export async function uploadImages(files) {
  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }

  const res = await fetch(`${API_URL}/upload/images`, {
    method: 'POST',
    body: formData,
    // Ne pas mettre Content-Type : le navigateur le gère avec FormData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur upload' }))
    throw new Error(err.error || `Erreur ${res.status}`)
  }

  return res.json() // { urls: ['http://...', ...] }
}