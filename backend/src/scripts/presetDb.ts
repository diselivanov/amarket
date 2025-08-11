import { env } from '../lib/env'
import { type AppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'
import { zCreateAdTrpcInput } from '../router/ads/createAd/input'

export const presetDb = async (ctx: AppContext) => {
  // Create admin user
  await ctx.prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
    },
    update: {
      permissions: ['ALL'],
    },
  })

  // Check if admin exists (or just created)
  const admin = await ctx.prisma.user.findUnique({
    where: {
      email: 'admin@example.com',
    },
  })

  if (!admin) {
    throw new Error('Admin user not found')
  }

  // Create 100 ads
  const adData = {
    category: 'Категория',
    subcategory: 'Подкатегория',
    title: 'Название',
    description: 'Описание',
    price: '47500',
    city: 'Сухум',
    images: [
      'images/yibvbmus18hjo2wjwpvf',
      'images/ibrcukgfveiiju7vpr3s',
      'images/e1rpe9os0lp1qcmutd0a',
      'images/iwv22yvgnblt5edhfyym',
      'images/mvynx8mw4vj54c0ged6h',
    ],
    authorId: admin.id,
  }

  // Validate input data
  const validatedData = zCreateAdTrpcInput.parse(adData)

  // Create 100 ads in parallel
  const adPromises = Array.from({ length: 100 }).map(() =>
    ctx.prisma.ad.create({
      data: { ...validatedData, authorId: admin.id },
    })
  )

  await Promise.all(adPromises)

  console.log('Created 100 ads successfully')
}
