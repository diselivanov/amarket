import cn from 'classnames'
import CircularProgress from '@mui/material/CircularProgress'
import css from './index.module.scss'

export const Loader = ({ type }: { type: 'page' | 'section' }) => (
  <div
    className={cn({
      [css.loader]: true,
      [css[`type-${type}`]]: true,
    })}
  >
    <CircularProgress
      color="inherit"
      sx={{
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        },
      }}
    />
  </div>
)
