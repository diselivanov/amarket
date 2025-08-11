import css from './index.module.scss'

export const HintCreateAd = () => {
  return (
    <div className={css.HintCreateAd}>
      <div className={css.hint}>
        <div className={css.step}>
          <div className={css.stepCircle}>1</div>
          <div className={css.stepContent}>Выберите категорию и подкатегорию</div>
        </div>
        <div className={css.step}>
          <div className={css.stepCircle}>2</div>
          <div className={css.stepContent}>Укажите понятное название</div>
        </div>
        <div className={css.step}>
          <div className={css.stepCircle}>3</div>
          <div className={css.stepContent}>Подробно опишите товар</div>
        </div>
        <div className={css.step}>
          <div className={css.stepCircle}>4</div>
          <div className={css.stepContent}>Укажите цену</div>
        </div>
        <div className={css.step}>
          <div className={css.stepCircle}>5</div>
          <div className={css.stepContent}>Выберите город</div>
        </div>

        <div className={css.service}>Нужно продать быстро? Продвижение объявления</div>
      </div>
    </div>
  )
}
