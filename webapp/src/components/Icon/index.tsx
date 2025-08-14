import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillCloseCircle, AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { TiWarning } from "react-icons/ti";

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: AiFillCloseCircle,
  error: TiWarning,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
