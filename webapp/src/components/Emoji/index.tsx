import css from './index.module.scss';
import { ComponentPropsWithoutRef } from 'react';

// Импорты эмодзи остаются теми же
import SoccerBall from '../../assets/images/emojis/Soccer Ball.png';
import PottedPlant from '../../assets/images/emojis/Potted Plant.png';
import TShirt from '../../assets/images/emojis/T-Shirt.png';
import House from '../../assets/images/emojis/House.png';
import Gear from '../../assets/images/emojis/Gear.png';
import Dog from '../../assets/images/emojis/Dog.png';
import MoneyBag from '../../assets/images/emojis/Money Bag.png';
import Automobile from '../../assets/images/emojis/Automobile.png';
import HammerAndWrench from '../../assets/images/emojis/Hammer and Wrench.png';
import Briefcase from '../../assets/images/emojis/Briefcase.png';
import Laptop from '../../assets/images/emojis/Laptop.png';

interface EmojiProps extends ComponentPropsWithoutRef<'img'> {
  name: string;
}

const emojiMap = {
  'Soccer Ball': SoccerBall,
  'Potted Plant': PottedPlant,
  'T-Shirt': TShirt,
  'House': House,
  'Gear': Gear,
  'Dog': Dog,
  'Money Bag': MoneyBag,
  'Automobile': Automobile,
  'Hammer and Wrench': HammerAndWrench,
  'Briefcase': Briefcase,
  'Laptop': Laptop,
} as const;

type EmojiName = keyof typeof emojiMap;

export const Emoji = ({ name, ...props }: EmojiProps) => {
  const emojiSrc = emojiMap[name as EmojiName];
  
  if (!emojiSrc) {
    return null;
  }

  return (
    <div className={css.emojiContainer}>
        <img src={emojiSrc} className={css.emojiImage} {...props} />
    </div>
  );
};

// Новый компонент EmojiWithText
interface EmojiWithTextProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  text: string;
  emojiSize?: number;
  textClassName?: string;
}

export const EmojiWithText = ({ 
  name, 
  text, 
  emojiSize, 
  textClassName,
  className,
  ...props 
}: EmojiWithTextProps) => {
  const emojiSrc = emojiMap[name as EmojiName];
  
  if (!emojiSrc) {
    return <span>{text}</span>;
  }

  const emojiStyle = emojiSize ? { width: emojiSize, height: emojiSize } : {};

  return (
    <div className={`${css.emojiWithTextContainer} ${className || ''}`} {...props}>
      <div className={css.emojiContainer} style={emojiStyle}>
        <img 
          src={emojiSrc} 
          className={css.emojiImage} 
          style={emojiStyle}
          alt={name}
        />
      </div>
      <span className={`${css.emojiText} ${textClassName || ''}`}>
        {text}
      </span>
    </div>
  );
};