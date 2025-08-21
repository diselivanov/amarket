import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'
import { LuSearch } from 'react-icons/lu'
import { HiMiniCheckCircle } from 'react-icons/hi2'
import { BiSolidInfoCircle } from 'react-icons/bi'
import { ImUsers } from 'react-icons/im'
import { MdSettings, MdOutlineModeEditOutline } from 'react-icons/md'
import { FiChevronRight, FiChevronDown, FiBarChart2 } from 'react-icons/fi'
import { IoAdd } from 'react-icons/io5'
import { SiAlwaysdata } from 'react-icons/si'

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: IoCloseOutline,
  error: TiWarning,
  search: LuSearch,
  success: HiMiniCheckCircle,
  info: BiSolidInfoCircle,
  stats: SiAlwaysdata,
  users: ImUsers,
  settings: MdSettings,
  arrowRight: FiChevronRight,
  arrowDown: FiChevronDown,
  edit: MdOutlineModeEditOutline,
  add: IoAdd,
  chart: FiBarChart2,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
