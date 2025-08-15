import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: IoCloseOutline,
  error: TiWarning,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
