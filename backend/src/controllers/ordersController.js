import prisma from '../lib/prisma.js'

function generateOrderNumber() {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `CMD-${y}${m}${d}-${rand}`
}

/**
 * POST /api/orders
 * Body: {
 *   firstName, lastName, email, phone?,
 *   address, city, zip, country?,
 *   items: [{ productId, selectedColor, quantity }]
 * }
 */
export async function createOrder(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zip,
      country = 'France',
      items,
    } = req.body

    // Validation basique
    if (!firstName || !lastName || !email || !address || !city || !zip) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' })
    }

    // Récupérer les produits et vérifier le stock
    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

    const orderItemsData = []
    let subtotal = 0

    for (const item of items) {
      const product = productMap[item.productId]
      if (!product) {
        return res.status(400).json({
          error: `Produit introuvable: ${item.productId}`,
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`,
        })
      }

      const totalPrice = product.price * item.quantity
      subtotal += totalPrice

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || '',
        selectedColor: item.selectedColor || product.colors[0] || '',
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice,
      })
    }

    const shipping = subtotal >= 150 ? 0 : 9.9
    const total = subtotal + shipping

    // Transaction: créer la commande + décrémenter le stock
    const order = await prisma.$transaction(async (tx) => {
      // Décrémenter le stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Créer la commande
      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          firstName,
          lastName,
          email,
          phone: phone || null,
          address,
          city,
          zip,
          country,
          subtotal,
          shipping,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      })
    })

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { orderNumber: req.params.id },
        ],
      },
      include: { items: true },
    })

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

export async function getOrders(req, res, next) {
  try {
    const { email, page = 1, limit = 20 } = req.query

    const where = {}
    if (email) where.email = email

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ])

    res.json({
      orders,
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
