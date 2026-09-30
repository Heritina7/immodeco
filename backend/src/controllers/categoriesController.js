import prisma from '../lib/prisma.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    })

    res.json(
      categories.map((c) => ({
        id: c.slug,
        name: c.name,
        icon: c.icon,
        productCount: c._count.products,
      }))
    )
  } catch (err) {
    next(err)
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return res.status(404).json({ error: 'Catégorie introuvable' })
    }

    res.json({
      id: category.slug,
      name: category.name,
      icon: category.icon,
      productCount: category._count.products,
    })
  } catch (err) {
    next(err)
  }
}
