import { env } from '../lib/env'
import { type AppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'

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
//       name: '🚗 Авто',
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
//       name: '🏢 Недвижимость',
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
//       name: '💻 Электроника',
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
//       name: '💼 Работа',
//       sequence: '4',
//       subcategories: [
//         { name: 'Вакансии', sequence: '1' },
//         { name: 'Резюме', sequence: '2' },
//       ]
//     },
//     {
//       name: '🛠️ Услуги',
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
//       name: '👖 Личные вещи',
//       sequence: '6',
//       subcategories: [
//         { name: 'Женский гардероб', sequence: '1' },
//         { name: 'Мужской гардероб', sequence: '2' },
//         { name: 'Товары для детей', sequence: '3' },
//       ]
//     },
//     {
//       name: '🏠 Для дома и дачи',
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
//       name: '🎾 Хобби и отдых',
//       sequence: '8',
//       subcategories: [
//         { name: 'Разное', sequence: '1' },
//       ]
//     },
//     {
//       name: '🐕 Животные',
//       sequence: '9',
//       subcategories: [
//         { name: 'Домашние', sequence: '1' },
//         { name: 'Сельскохозяйственные', sequence: '2' },
//       ]
//     },
//     {
//       name: '💰 Бизнес и оборудование',
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

//     // Создание 1000 тестовых объявлений
// const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону']
// const titles = [
//   'Название 1',
//   'Название 2',
//   'Название 3',
//   'Название 4',
//   'Название 5' 
// ]
// const descriptions = [
//   'Описание 1',
//   'Описание 2',
//   'Описание 3',
//   'Описание 4',
//   'Описание 5'
// ]

// // Получаем все категории и подкатегории из базы
// const allCategories = await ctx.prisma.category.findMany({
//   include: {
//     subcategories: true
//   }
// })

// // Создаем массив пользователей (можно создать тестовых пользователей или использовать существующих)
// const testUsers = await ctx.prisma.user.findMany({
//   take: 10,
//   where: {
//     email: {
//       not: 'admin@example.com'
//     }
//   }
// })

// // Если нет тестовых пользователей, создаем несколько
// if (testUsers.length === 0) {
//   for (let i = 1; i <= 5; i++) {
//     const user = await ctx.prisma.user.create({
//       data: {
//         name: `TestUser${i}`,
//         email: `test${i}@example.com`,
//         password: getPasswordHash('password123'),
//         phone: `+7916123456${i}`
//       }
//     })
//     testUsers.push(user)
//   }
// }

// // Функция для генерации случайного числа в диапазоне
// const getRandomInt = (min: number, max: number) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

// // Функция для генерации случайного элемента из массива
// const getRandomItem = (array: any[]) => {
//   return array[Math.floor(Math.random() * array.length)]
// }

// // Создаем 1000 объявлений
// for (let i = 0; i < 1000; i++) {
//   // Выбираем случайную категорию
//   const randomCategory = getRandomItem(allCategories)
  
//   // Выбираем случайную подкатегорию из выбранной категории
//   const randomSubcategory = getRandomItem(randomCategory.subcategories)
  
//   // Выбираем случайного пользователя
//   const randomUser = getRandomItem(testUsers)
  
//   // Генерируем случайную цену от 1000 до 1000000
//   const randomPrice = getRandomInt(1000, 1000000).toString()
  
//   // Создаем объявление
//   await ctx.prisma.ad.create({
//     data: {
//       categoryId: randomCategory.id,
//       subcategoryId: randomSubcategory.id,
//       title: getRandomItem(titles),
//       description: getRandomItem(descriptions),
//       price: randomPrice,
//       city: getRandomItem(cities),
//       images: [], // Пустой массив изображений для тестовых объявлений
//       authorId: randomUser.id
//     }
//   })
  
//   // Добавляем небольшую задержку чтобы не перегружать базу
//   if (i % 100 === 0) {
//     await new Promise(resolve => setTimeout(resolve, 100))
//   }
// }

// console.log('Создано 1000 тестовых объявлений')
//   }
}