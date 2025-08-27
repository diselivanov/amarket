import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'
import { LuSearch } from 'react-icons/lu'
import { FaCheck } from "react-icons/fa6";
import { BiSolidInfoCircle } from 'react-icons/bi'
import { ImUsers } from 'react-icons/im'
import { MdSettings, MdOutlineModeEditOutline } from 'react-icons/md'
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiBarChart2 } from 'react-icons/fi'
import { IoAdd } from 'react-icons/io5'
import { SiAlwaysdata } from 'react-icons/si'
import { BsList } from "react-icons/bs";

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: IoCloseOutline,
  error: TiWarning,
  search: LuSearch,
  success: FaCheck,
  info: BiSolidInfoCircle,
  stats: SiAlwaysdata,
  users: ImUsers,
  settings: MdSettings,
  arrowRight: FiChevronRight,
  arrowLeft: FiChevronLeft,
  arrowDown: FiChevronDown,
  arrowUp: FiChevronUp,
  edit: MdOutlineModeEditOutline,
  add: IoAdd,
  chart: FiBarChart2,
  list: BsList,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
