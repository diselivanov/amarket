import { env } from '../lib/env'
import { type AppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'
import { zCreateAdTrpcInput } from '../router/ads/createAd/input'

export const presetDb = async (ctx: AppContext) => {
//   // Создание админ аккаунта
//   await ctx.prisma.user.upsert({
//     where: {
//       email: 'admin@example.com',
//     },
//     create: {
//       name: 'admin',
//       email: 'admin@example.com',
//       password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
//       permissions: ['ALL'],
//     },
//     update: {
//       permissions: ['ALL'],
//     },
//   })

//   // Создание категорий и подкатегорий
//   const categoriesData = [
//     {
//       name: 'Авто',
//       sequence: '1',
//       subcategories: [
//         { name: 'Автомобили', sequence: '1' },
//         { name: 'Мотоциклы и мототехника', sequence: '2' },
//         { name: 'Запчасти и аксессуары', sequence: '3' },
//         { name: 'Шины, диски и колёса', sequence: '4' },
//         { name: 'Грузовики и спецтехника', sequence: '5' },
//         { name: 'Водный транспорт', sequence: '6' },
//         { name: 'Прочий транспорт', sequence: '7' },
//       ]
//     },
//     {
//       name: 'Недвижимость',
//       sequence: '2',
//       subcategories: [
//         { name: 'Аренда квартиры', sequence: '1' },
//         { name: 'Продажа квартиры', sequence: '2' },
//         { name: 'Аренда дома', sequence: '3' },
//         { name: 'Продажа дома', sequence: '4' },
//         { name: 'Коммерческая недвижимость', sequence: '5' },
//         { name: 'Земельные участки', sequence: '6' },
//         { name: 'Прочие строения', sequence: '7' },
//       ]
//     },
//     {
//       name: 'Электроника',
//       sequence: '3',
//       subcategories: [
//         { name: 'Телефоны и планшеты', sequence: '1' },
//         { name: 'Компьютеры и ноутбуки', sequence: '2' },
//         { name: 'Аксессуары и комплектующие', sequence: '3' },
//         { name: 'Фото, аудио, видео', sequence: '4' },
//         { name: 'Прочая электроника', sequence: '5' },
//       ]
//     },
//     {
//       name: 'Работа',
//       sequence: '4',
//       subcategories: [
//         { name: 'Вакансии', sequence: '1' },
//         { name: 'Резюме', sequence: '2' },
//       ]
//     },
//     {
//       name: 'Услуги',
//       sequence: '5',
//       subcategories: [
//         { name: 'Ремонт и строительство', sequence: '1' },
//         { name: 'Автосервис', sequence: '2' },
//         { name: 'Красота и здоровье', sequence: '3' },
//         { name: 'Фото и видео', sequence: '4' },
//         { name: 'Доставка и переезд', sequence: '5' },
//         { name: 'Уборка и клининг', sequence: '6' },
//         { name: 'Образование и консультации', sequence: '7' },
//       ]
//     },
//     {
//       name: 'Личные вещи',
//       sequence: '6',
//       subcategories: [
//         { name: 'Женский гардероб', sequence: '1' },
//         { name: 'Мужской гардероб', sequence: '2' },
//         { name: 'Товары для детей', sequence: '3' },
//       ]
//     },
//     {
//       name: 'Для дома и дачи',
//       sequence: '7',
//       subcategories: [
//         { name: 'Бытовая техника', sequence: '1' },
//         { name: 'Мебель и интерьер', sequence: '2' },
//         { name: 'Стройматериалы', sequence: '3' },
//         { name: 'Сад и огород', sequence: '4' },
//         { name: 'Хозтовары и инвентарь', sequence: '5' },
//         { name: 'Продукты питания', sequence: '6' },
//       ]
//     },
//     {
//       name: 'Хобби и отдых',
//       sequence: '8',
//       subcategories: [
//         { name: 'Разное', sequence: '1' },
//       ]
//     },
//     {
//       name: 'Животные',
//       sequence: '9',
//       subcategories: [
//         { name: 'Домашние', sequence: '1' },
//         { name: 'Сельскохозяйственные', sequence: '2' },
//       ]
//     },
//     {
//       name: 'Бизнес и оборудование',
//       sequence: '10',
//       subcategories: [
//         { name: 'Готовый бизнес', sequence: '1' },
//         { name: 'Оборудование и материалы', sequence: '2' },
//       ]
//     }
//   ]

//   // Создаем категории и подкатегории
//   for (const categoryData of categoriesData) {
//     const category = await ctx.prisma.category.create({
//       data: {
//         name: categoryData.name,
//         sequence: categoryData.sequence,
//       }
//     })

//     // Создаем подкатегории для каждой категории
//     for (const subcategoryData of categoryData.subcategories) {
//       await ctx.prisma.subcategory.create({
//         data: {
//           name: subcategoryData.name,
//           sequence: subcategoryData.sequence,
//           categoryId: category.id,
//         }
//       })
//     }
//   }

//   // Создание объявлений
//   const admin = await ctx.prisma.user.findUnique({
//     where: {
//       email: 'admin@example.com',
//     },
//   })
//   if (!admin) {
//     throw new Error('Admin user not found')
//   }
//   const adData = {
//     category: 'Категория',
//     subcategory: 'Подкатегория',
//     title: 'Название',
//     description: 'Описание',
//     price: '47500',
//     city: 'Сухум',
//     images: [
//       'images/yibvbmus18hjo2wjwpvf',
//       'images/ibrcukgfveiiju7vpr3s',
//       'images/e1rpe9os0lp1qcmutd0a',
//       'images/iwv22yvgnblt5edhfyym',
//       'images/mvynx8mw4vj54c0ged6h',
//     ],
//     authorId: admin.id,
//   }
//   const validatedData = zCreateAdTrpcInput.parse(adData)
//   const adPromises = Array.from({ length: 100 }).map(() =>
//     ctx.prisma.ad.create({
//       data: { ...validatedData, authorId: admin.id },
//     })
//   )
//   await Promise.all(adPromises)
}