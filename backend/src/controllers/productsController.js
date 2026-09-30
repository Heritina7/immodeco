import prisma from '../lib/prisma.js'

/**
 * GET /api/products
 * Query params:
 *   - category: slug de la catégorie
 *   - search: recherche texte
 *   - minPrice, maxPrice
 *   - colors: couleurs séparées par virgule
 *   - promo: true
 *   - sort: price-asc | price-desc | name | new
 *   - page, limit
 */
export async function getProducts(req, res, next) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      colors,
      promo,
      sort = 'default',
      page = 1,
      limit = 50,
    } = req.query

    const where = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (promo === 'true') {
      where.isPromo = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (colors) {
      const colorList = colors.split(',').map((c) => c.trim())
      where.colors = { hasSome: colorList }
    }

    let orderBy = { createdAt: 'desc' }
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'new':
        orderBy = [{ isNew: 'desc' }, { createdAt: 'desc' }]
        break
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          category: { select: { slug: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products: products.map(formatProduct),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { slug: req.params.id },
        ],
        isActive: true,
      },
      include: {
        category: { select: { slug: true, name: true } },
      },
    })

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' })
    }

    res.json(formatProduct(product))
  } catch (err) {
    next(err)
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ isPromo: true }, { isNew: true }],
      },
      take: 8,
      orderBy: [{ isPromo: 'desc' }, { isNew: 'desc' }],
      include: {
        category: { select: { slug: true, name: true } },
      },
    })

    res.json(products.map(formatProduct))
  } catch (err) {
    next(err)
  }
}

export async function getSimilarProducts(req, res, next) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: req.params.id }, { slug: req.params.id }],
      },
    })

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' })
    }

    const similar = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: { select: { slug: true, name: true } },
      },
    })

    res.json(similar.map(formatProduct))
  } catch (err) {
    next(err)
  }
}

// ========== ADMIN CRUD ==========

/**
 * POST /api/products
 */
export async function createProduct(req, res, next) {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      images,
      colors,
      materials,
      features,
      stock,
      isNew,
      isPromo,
      categorySlug,
    } = req.body

    if (!name || price == null || !categorySlug) {
      return res.status(400).json({
        error: 'name, price et categorySlug sont obligatoires',
      })
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })

    if (!category) {
      return res.status(400).json({ error: 'Catégorie introuvable' })
    }

    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = await prisma.product.create({
      data: {
        name,
        slug: `${baseSlug}-${Date.now().toString(36)}`,
        description: description || '',
        price: parseFloat(price),
        oldPrice: oldPrice != null && oldPrice !== '' ? parseFloat(oldPrice) : null,
        images: Array.isArray(images) ? images : [],
        colors: Array.isArray(colors) ? colors : [],
        materials: Array.isArray(materials) ? materials : [],
        features: Array.isArray(features) ? features : [],
        stock: parseInt(stock) || 0,
        isNew: Boolean(isNew),
        isPromo: Boolean(isPromo),
        categoryId: category.id,
      },
      include: {
        category: { select: { slug: true, name: true } },
      },
    })

    res.status(201).json(formatProduct(product))
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const data = { ...req.body }

    if (data.categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: data.categorySlug },
      })
      if (!category) {
        return res.status(400).json({ error: 'Catégorie introuvable' })
      }
      data.categoryId = category.id
      delete data.categorySlug
    }

    if (data.price != null) data.price = parseFloat(data.price)
    if (data.oldPrice !== undefined) {
      data.oldPrice =
        data.oldPrice === '' || data.oldPrice == null
          ? null
          : parseFloat(data.oldPrice)
    }
    if (data.stock != null) data.stock = parseInt(data.stock)
    if (data.isNew != null) data.isNew = Boolean(data.isNew)
    if (data.isPromo != null) data.isPromo = Boolean(data.isPromo)

    // Ne pas laisser passer des champs non autorisés
    delete data.id
    delete data.slug
    delete data.createdAt
    delete data.updatedAt

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { slug: true, name: true } },
      },
    })

    res.json(formatProduct(product))
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Produit introuvable' })
    }
    next(err)
  }
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    })
    res.json({ message: 'Produit supprimé' })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Produit introuvable' })
    }
    next(err)
  }
}

/** Format product for frontend compatibility */
function formatProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.slug || p.categoryId,
    categoryName: p.category?.name,
    price: p.price,
    oldPrice: p.oldPrice,
    images: p.images,
    colors: p.colors,
    materials: p.materials,
    description: p.description,
    features: p.features,
    stock: p.stock,
    isNew: p.isNew,
    isPromo: p.isPromo,
  }
}