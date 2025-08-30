// NewAdPage/index.tsx
import { zCreateAdTrpcInput } from '@amarket/backend/src/router/ads/createAd/input'
import { zCreateCarInfoTrpcInput } from '@amarket/backend/src/router/ads/createCarInfo/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'
import { useState, useEffect } from 'react'
import css from './index.module.scss'

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  categoryId: string
}

// Базовые значения формы без CarInfo полей
interface BaseFormValues {
  categoryId: string
  subcategoryId: string
  title: string
  description: string
  price: string
  city: string
  images: string[]
}

// Поля для CarInfo
interface CarInfoValues {
  brand: string
  year: string
  steering: string
  bodyType: string
  power: string
  engineType: string
  transmission: string
  driveType: string
  mileage: string
  condition: string
}

// Полные значения формы
type FormValues = BaseFormValues & Partial<CarInfoValues>

export const NewAdPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Ad',
})(() => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const createAd = trpc.createAd.useMutation()
  const createCarInfo = trpc.createCarInfo.useMutation()
  const { data: categoriesData } = trpc.getCategories.useQuery({})
  const { data: subcategoriesData } = trpc.getSubcategories.useQuery({})

  const isCarCategory = selectedSubcategory?.name === "Легковые автомобили"

  // Базовые начальные значения с пустыми строками вместо undefined
  const baseInitialValues: BaseFormValues = {
    categoryId: '',
    subcategoryId: '',
    title: '',
    description: '',
    price: '',
    city: '',
    images: [],
  }

  // Полные начальные значения с CarInfo полями
  const carInfoInitialValues: CarInfoValues = {
    brand: '',
    year: '',
    steering: '',
    bodyType: '',
    power: '',
    engineType: '',
    transmission: '',
    driveType: '',
    mileage: '',
    condition: '',
  }

  const fullInitialValues: FormValues = {
    ...baseInitialValues,
    ...carInfoInitialValues,
  }

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: isCarCategory ? fullInitialValues : baseInitialValues,
    validationSchema: isCarCategory 
      ? zCreateAdTrpcInput.merge(zCreateCarInfoTrpcInput.omit({ adId: true }))
      : zCreateAdTrpcInput,
    onSubmit: async (values: any) => {
      try {
        // Создаем объявление
        const adResult = await createAd.mutateAsync({
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          title: isCarCategory ? values.brand : values.title,
          description: values.description,
          price: values.price,
          city: values.city,
          images: values.images,
        })

        // Если это категория автомобилей, создаем CarInfo
        if (isCarCategory && adResult.id) {
          await createCarInfo.mutateAsync({
            brand: values.brand,
            year: values.year,
            steering: values.steering,
            bodyType: values.bodyType,
            power: values.power,
            engineType: values.engineType,
            transmission: values.transmission,
            driveType: values.driveType,
            mileage: values.mileage,
            condition: values.condition,
            adId: adResult.id,
          })
        }

        formik.resetForm()
        setShowForm(false)
        setSelectedCategory(null)
        setSelectedSubcategory(null)
      } catch (error) {
        console.error('Error creating ad:', error)
      }
    },
    successMessage: 'Ad created!',
    showValidationAlert: true,
  })

  // Обновляем поле title при изменении brand для автомобилей
  useEffect(() => {
  if (isCarCategory && (formik.values as FormValues).brand) {
    formik.setFieldValue('title', (formik.values as FormValues).brand);
  }
}, [(formik.values as FormValues).brand, isCarCategory]);

  const handleSubcategorySelect = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    
    // Сбрасываем форму с новыми начальными значениями
    const newInitialValues = subcategory.name === "Легковые автомобили" 
      ? fullInitialValues 
      : baseInitialValues
    
    formik.resetForm({
      values: {
        ...newInitialValues,
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }
    })
    
    setShowForm(true)
  }

  const handleBackToCategories = () => {
    setShowForm(false)
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    formik.resetForm()
  }

  if (!categoriesData || !subcategoriesData) {
    return <div>Loading...</div>
  }

  if (showForm) {
    return (
      <FormWrapper type={'big'}>
        <div className={css.header}>
          <button 
            type="button" 
            onClick={handleBackToCategories}
            className={css.backButton}
          >
            ← Назад
          </button>
          <h2>
            {selectedCategory?.name} / {selectedSubcategory?.name}
          </h2>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <FormItems>
            {!isCarCategory && (
              <Input name="title" label="Название" formik={formik} />
            )}
            
            <Textarea name="description" label="Описание" formik={formik} />
            <Input name="price" label="Цена" formik={formik} />
            <Input name="city" label="Город" formik={formik} />

            <UploadsToCloudinary 
              label="Images" 
              name="images" 
              type="image" 
              preset="preview" 
              formik={formik} 
            />

            {/* Поля для CarInfo, если это категория автомобилей */}
            {isCarCategory && (
              <>
                <h3>Информация об автомобиле</h3>
                <Input name="brand" label="Марка" formik={formik} />
                <Input name="year" label="Год выпуска" formik={formik} />
                <Input name="steering" label="Руль" formik={formik} />
                <Input name="bodyType" label="Кузов" formik={formik} />
                <Input name="power" label="Мощность" formik={formik} />
                <Input name="engineType" label="Тип двигателя" formik={formik} />
                <Input name="transmission" label="Коробка передач" formik={formik} />
                <Input name="driveType" label="Привод" formik={formik} />
                <Input name="mileage" label="Пробег" formik={formik} />
                <Input name="condition" label="Состояние" formik={formik} />
              </>
            )}

            <Alert {...alertProps} />
            <Button 
              {...buttonProps} 
              loading={createAd.isLoading || createCarInfo.isLoading}
            >
              Разместить объявление
            </Button>
          </FormItems>
        </form>
      </FormWrapper>
    )
  }

  return (
    <div className={css.categoriesContainer}>
      <h1>Выбор категории</h1>
      <div className={css.categoriesList}>
        {categoriesData.categories.map((category: Category) => (
          <div key={category.id} className={css.categoryItem}>
            <h2 className={css.categoryTitle}>{category.name}</h2>
            <div className={css.subcategoriesList}>
              {subcategoriesData.subcategories
                .filter((sc: Subcategory) => sc.categoryId === category.id)
                .map((subcategory: Subcategory) => (
                  <div
                    key={subcategory.id}
                    className={css.subcategoryItem}
                    onClick={() => handleSubcategorySelect(category, subcategory)}
                  >
                    {subcategory.name}
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})