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
import { Select } from '../../../components/Select'
import { TrpcRouterOutput } from '@amarket/backend/src/router'

type Category = TrpcRouterOutput['getCategories']['categories'][number]
type Subcategory = TrpcRouterOutput['getSubcategories']['subcategories'][number]

// Типы для значений формы
type CreateAdInput = typeof zCreateAdTrpcInput._type
type CreateCarInfoInput = Omit<typeof zCreateCarInfoTrpcInput._type, 'adId'>

type FormValues = CreateAdInput & Partial<CreateCarInfoInput>

export const NewAdPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Ad',
})(() => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')

  const createAd = trpc.createAd.useMutation()
  const createCarInfo = trpc.createCarInfo.useMutation()
  const { data: categoriesData } = trpc.getCategories.useQuery({})
  const { data: subcategoriesData } = trpc.getSubcategories.useQuery({})
  const { data: vehicleBrandsData } = trpc.getVehicleBrands.useQuery({})
  const { data: vehicleModelsData } = trpc.getVehicleModels.useQuery(
    { brandId: selectedBrandId },
    { enabled: !!selectedBrandId }
  )

  const isCarCategory = selectedSubcategory?.slug === 'cars'

  // Фильтруем модели по выбранному бренду
  const filteredModels = vehicleModelsData?.vehicleModels || []

  // Базовые начальные значения
  const baseInitialValues: CreateAdInput = {
    categoryId: '',
    subcategoryId: '',
    title: '',
    description: '',
    price: '',
    city: '',
    images: [],
  }

  // Начальные значения для CarInfo
  const carInfoInitialValues: CreateCarInfoInput = {
    vehicleBrandId: '',
    vehicleModelId: '',
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
    onSubmit: async (values: FormValues) => {
      try {
        let title = values.title

        // Если это автомобиль, формируем title из названий бренда и модели
        if (isCarCategory) {
          const brandName = vehicleBrandsData?.vehicleBrands.find((b) => b.id === values.vehicleBrandId)?.name || ''
          const modelName = filteredModels.find((m) => m.id === values.vehicleModelId)?.name || ''
          title = `${brandName} ${modelName}`
        }

        // Создаем объявление с правильным title
        const adResult = await createAd.mutateAsync({
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          title: title,
          description: values.description,
          price: values.price,
          city: values.city,
          images: values.images,
        })

        // Если это категория автомобилей, создаем CarInfo с ID
        if (isCarCategory && adResult.id) {
          await createCarInfo.mutateAsync({
            vehicleBrandId: values.vehicleBrandId!,
            vehicleModelId: values.vehicleModelId!,
            year: values.year!,
            steering: values.steering!,
            bodyType: values.bodyType!,
            power: values.power!,
            engineType: values.engineType!,
            transmission: values.transmission!,
            driveType: values.driveType!,
            mileage: values.mileage!,
            condition: values.condition!,
            adId: adResult.id,
          })
        }

        formik.resetForm()
        setShowForm(false)
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        setSelectedBrandId('')
      } catch (error) {
        console.error('Error creating ad:', error)
      }
    },
    successMessage: 'Ad created!',
    showValidationAlert: true,
  })

  // Для удобства доступа к значениям формы
  const values = formik.values as FormValues

  // Устанавливаем заглушку для title при выборе бренда
  useEffect(() => {
    if (isCarCategory && values.vehicleBrandId && !values.title) {
      const brandName = vehicleBrandsData?.vehicleBrands.find((b) => b.id === values.vehicleBrandId)?.name || ''
      formik.setFieldValue('title', brandName)
    }
  }, [values.vehicleBrandId, isCarCategory, vehicleBrandsData])

  // Обработчик выбора бренда
  const handleBrandChange = (value: string) => {
    setSelectedBrandId(value)
    formik.setFieldValue('vehicleBrandId', value)
    formik.setFieldValue('vehicleModelId', '') // Сбрасываем модель при смене бренда
  }

  // Обработчик выбора модели
  const handleModelChange = (value: string) => {
    formik.setFieldValue('vehicleModelId', value)
  }

  const handleSubcategorySelect = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)

    // Сбрасываем форму с новыми начальными значениями
    const newInitialValues = subcategory.slug === 'cars' ? fullInitialValues : baseInitialValues

    formik.resetForm({
      values: {
        ...newInitialValues,
        categoryId: category.id,
        subcategoryId: subcategory.id,
      },
    })

    setShowForm(true)
  }

  const handleBackToCategories = () => {
    setShowForm(false)
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setSelectedBrandId('')
    formik.resetForm()
  }

  if (!categoriesData || !subcategoriesData) {
    return <div>Loading...</div>
  }

  if (showForm) {
    return (
      <FormWrapper type={'big'}>
        <div className={css.header}>
          <button type="button" onClick={handleBackToCategories} className={css.backButton}>
            ← Назад
          </button>
          <h2>
            {selectedCategory?.name} / {selectedSubcategory?.name}
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <FormItems>
            {/* Если категория - легковые автомобили */}
            {isCarCategory && (
              <>
                <h3>Информация об автомобиле</h3>

                {/* Select для бренда автомобиля */}
                <Select
                  name="vehicleBrandId"
                  label="Марка"
                  formik={formik}
                  options={
                    vehicleBrandsData?.vehicleBrands.map((brand) => ({
                      value: brand.id,
                      label: brand.name,
                    })) || []
                  }
                  onChange={handleBrandChange}
                />

                {/* Select для модели автомобиля */}
                <Select
                  name="vehicleModelId"
                  label="Модель"
                  formik={formik}
                  options={filteredModels.map((model) => ({
                    value: model.id,
                    label: model.name,
                  }))}
                  onChange={handleModelChange}
                  disabled={!selectedBrandId}
                />

                <Select
                  name="steering"
                  label="Руль"
                  formik={formik}
                  options={[
                    { value: 'left', label: 'Левый' },
                    { value: 'right', label: 'Правый' },
                  ]}
                />

                <Input name="year" label="Год выпуска" formik={formik} />

                <Select
                  name="bodyType"
                  label="Кузов"
                  formik={formik}
                  options={[
                    { value: 'suv', label: 'Внедорожник' },
                    { value: 'station_wagon', label: 'Универсал' },
                    { value: 'sedan', label: 'Седан' },
                    { value: 'hatchback', label: 'Хетчбэк' },
                    { value: 'minivan', label: 'Минивэн' },
                    { value: 'pickup', label: 'Пикап' },
                    { value: 'coupe', label: 'Купе' },
                    { value: 'convertible', label: 'Кабриолет' },
                    { value: 'limousine', label: 'Лимузин' },
                  ]}
                />

                <Input name="power" label="Мощность" formik={formik} />

                <Select
                  name="engineType"
                  label="Тип двигателя"
                  formik={formik}
                  options={[
                    { value: 'petrol', label: 'Бензиновый' },
                    { value: 'diesel', label: 'Дизельный' },
                    { value: 'gas', label: 'Газ' },
                    { value: 'hybrid', label: 'Гибридный' },
                    { value: 'electric', label: 'Электрический' },
                  ]}
                />

                <Select
                  name="transmission"
                  label="Коробка передач"
                  formik={formik}
                  options={[
                    { value: 'manual', label: 'Механика' },
                    { value: 'automatic', label: 'Автомат' },
                    { value: 'cvt', label: 'Вариатор' },
                    { value: 'robot', label: 'Робот' },
                  ]}
                />

                <Select
                  name="driveType"
                  label="Привод"
                  formik={formik}
                  options={[
                    { value: 'front', label: 'Передний' },
                    { value: 'rear', label: 'Задний' },
                    { value: 'all', label: 'Полный' },
                  ]}
                />

                <Input name="mileage" label="Пробег" formik={formik} />

                <Select
                  name="condition"
                  label="Состояние автомобиля"
                  formik={formik}
                  options={[
                    { value: 'broken', label: 'Битый' },
                    { value: 'notbroken', label: 'Не битый' },
                  ]}
                />
              </>
            )}

            {!isCarCategory && <Input name="title" label="Название" formik={formik} />}

            <Textarea name="description" label="Описание" formik={formik} />
            <Input name="price" label="Цена" formik={formik} />
            <Input name="city" label="Город" formik={formik} />

            <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />

            <Alert {...alertProps} />
            <Button {...buttonProps} loading={createAd.isLoading || createCarInfo.isLoading}>
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
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})