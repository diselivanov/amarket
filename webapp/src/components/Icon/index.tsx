import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'
import { LuSearch } from 'react-icons/lu'
import { HiMiniCheckCircle } from "react-icons/hi2";
import { BiStats, BiSolidInfoCircle } from "react-icons/bi";
import { ImUsers } from "react-icons/im";
import { MdSettings } from "react-icons/md";
import { FiChevronRight, FiChevronDown  } from "react-icons/fi";

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: IoCloseOutline, // Крестик
  error: TiWarning, // Ошибка
  search: LuSearch, // Поиск
  success: HiMiniCheckCircle, // Успех
  info: BiSolidInfoCircle, // Инфо
  stats: BiStats, // Статистика
  users: ImUsers, // Пользователи
  settings: MdSettings, // Настройки
  arrowRight: FiChevronRight, // Стрелка направа
  arrowDown: FiChevronDown, // Стрелка вниз
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
