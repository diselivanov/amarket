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
  //       createdAt: new Date('2024-01-01'),
  //     },
  //     update: {
  //       permissions: ['ALL'],
  //     },
  //   })
  //   // Получаем существующие категории и подкатегории
  //   const allCategories = await ctx.prisma.category.findMany({
  //     include: {
  //       subcategories: true
  //     }
  //   })
  //   // Если нет категорий, выходим - нужны предварительно созданные категории
  //   if (allCategories.length === 0) {
  //     console.log('Нет категорий в базе данных. Сначала создайте категории.')
  //     return
  //   }
  //   // Создаем 1000 тестовых пользователей с использованием upsert
  //   const testUsers = []
  //   const userCreationDates = generateRandomDates(1000, new Date('2023-01-01'), new Date())
  //   for (let i = 1; i <= 1000; i++) {
  //     const email = `test${i}@example.com`
  //     const user = await ctx.prisma.user.upsert({
  //       where: { email },
  //       create: {
  //         name: `TestUser${i}`,
  //         email,
  //         password: getPasswordHash('password123'),
  //         phone: `+7916${String(i).padStart(7, '0')}`,
  //         createdAt: userCreationDates[i - 1],
  //       },
  //       update: {} // Обновляем, если уже существует
  //     })
  //     testUsers.push(user)
  //     // Добавляем небольшую задержку чтобы не перегружать базу
  //     if (i % 100 === 0) {
  //       await new Promise(resolve => setTimeout(resolve, 100))
  //       console.log(`Обработано ${i} пользователей`)
  //     }
  //   }
  //   console.log('Создано/обновлено 1000 тестовых пользователей')
  //   // Данные для объявлений
  //   const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону']
  //   const titles = [
  //     'Отличный товар в идеальном состоянии',
  //     'Продам недорого, срочно',
  //     'Качественный продукт от проверенного продавца',
  //     'Уникальное предложение на рынке',
  //     'Премиум качество по доступной цене',
  //     'Новый, в оригинальной упаковке',
  //     'Редкий экземпляр, коллекционная вещь',
  //     'Идеально подходит для подарка',
  //     'Профессиональное оборудование',
  //     'Современный дизайн и функциональность'
  //   ]
  //   const descriptions = [
  //     'Состояние идеальное, использовался аккуратно. Все функции работают исправно. Возможен торг при быстрой покупке.',
  //     'Продаю в связи с переездом. Товар в отличном состоянии, полная комплектация. Самовывоз или доставка по договоренности.',
  //     'Качественный продукт от известного бренда. Гарантия качества. Возможен обмен на интересующий товар.',
  //     'Уникальное предложение на рынке. Такую цену больше нигде не найдете. Торопитесь, количество ограничено!',
  //     'Премиум качество материалов и сборки. Идеально подходит для профессионального использования. Сертификаты в наличии.',
  //     'Абсолютно новый, не распаковывался. Сохранены все бирки и ярлыки. Оригинальная гарантия производителя.',
  //     'Редкий коллекционный экземпляр в прекрасном состоянии. Ценность со временем будет только расти.',
  //     'Отличный вариант для подарка близким или коллегам. Элегантная упаковка в подарок. Доставка в день заказа.',
  //     'Профессиональное оборудование для серьезной работы. Высокая производительность и надежность. Обслуживался у официального дилера.',
  //     'Современный эргономичный дизайн и расширенная функциональность. Подходит для повседневного использования и особых случаев.'
  //   ]
  //   // Функция для генерации случайного числа в диапазоне
  //   const getRandomInt = (min: number, max: number) => {
  //     return Math.floor(Math.random() * (max - min + 1)) + min
  //   }
  //   // Функция для генерации случайного элемента из массива
  //   const getRandomItem = (array: any[]) => {
  //     return array[Math.floor(Math.random() * array.length)]
  //   }
  //   // Генерируем случайные даты для объявлений (последние 6 месяцев)
  //   const adCreationDates = generateRandomDates(1000, new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date())
  //   // Создаем 1000 объявлений
  //   for (let i = 0; i < 1000; i++) {
  //     try {
  //       // Выбираем случайную категорию
  //       const randomCategory = getRandomItem(allCategories)
  //       // Выбираем случайную подкатегорию из выбранной категории
  //       const randomSubcategory = getRandomItem(randomCategory.subcategories)
  //       // Выбираем случайного пользователя
  //       const randomUser = getRandomItem(testUsers)
  //       // Генерируем случайную цену от 1000 до 1000000
  //       const randomPrice = getRandomInt(1000, 1000000).toString()
  //       // Создаем объявление
  //       await ctx.prisma.ad.create({
  //         data: {
  //           categoryId: randomCategory.id,
  //           subcategoryId: randomSubcategory.id,
  //           title: getRandomItem(titles),
  //           description: getRandomItem(descriptions),
  //           price: randomPrice,
  //           city: getRandomItem(cities),
  //           images: [], // Пустой массив изображений для тестовых объявлений
  //           authorId: randomUser.id,
  //           createdAt: adCreationDates[i],
  //         }
  //       })
  //       // Добавляем небольшую задержку чтобы не перегружать базу
  //       if (i % 100 === 0) {
  //         await new Promise(resolve => setTimeout(resolve, 100))
  //         console.log(`Создано ${i} объявлений`)
  //       }
  //     } catch (error) {
  //       console.error(`Ошибка при создании объявления ${i}:`, error)
  //     }
  //   }
  //   console.log('Создано 1000 тестовых объявлений')
  // }
  // // Функция для генерации массива случайных дат
  // function generateRandomDates(count: number, start: Date, end: Date): Date[] {
  //   const dates: Date[] = []
  //   const startTime = start.getTime()
  //   const endTime = end.getTime()
  //   for (let i = 0; i < count; i++) {
  //     const randomTime = startTime + Math.random() * (endTime - startTime)
  //     dates.push(new Date(randomTime))
  //   }
  //   // Сортируем даты для более реалистичного распределения
  //   return dates.sort((a, b) => a.getTime() - b.getTime())
}
