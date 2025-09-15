import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'
import { LuSearch } from 'react-icons/lu'
import { FaCheck } from 'react-icons/fa6'
import { BiSolidInfoCircle } from 'react-icons/bi'
import { TbUserScan } from "react-icons/tb";
import { MdSettings, MdOutlineModeEditOutline } from 'react-icons/md'
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiBarChart2 } from 'react-icons/fi'
import { IoAdd } from 'react-icons/io5'
import { SiAlwaysdata } from 'react-icons/si'
import { BsList } from 'react-icons/bs'
import { RxReset } from 'react-icons/rx'
import { IoCarSportOutline } from "react-icons/io5";
import { TbCopy } from 'react-icons/tb'
import { HiOutlineViewGrid } from "react-icons/hi";

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: IoCloseOutline,
  error: TiWarning,
  search: LuSearch,
  success: FaCheck,
  info: BiSolidInfoCircle,
  stats: SiAlwaysdata,
  users: TbUserScan,
  settings: MdSettings,
  arrowRight: FiChevronRight,
  arrowLeft: FiChevronLeft,
  arrowDown: FiChevronDown,
  arrowUp: FiChevronUp,
  edit: MdOutlineModeEditOutline,
  add: IoAdd,
  copy: TbCopy,
  chart: FiBarChart2,
  list: BsList,
  car: IoCarSportOutline,
  reset: RxReset,
  category: HiOutlineViewGrid,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
