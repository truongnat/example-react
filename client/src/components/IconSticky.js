import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { classes } from '../utils';

export default function IconSticky({
  icon: Icon,
  fn = () => {},
  customClass = '',
  sizeDefault = 35,
  colorDefault = 'white',
}) {
  return (
    <div
      onClick={fn}
      className={classes(
        'w-16 h-16 flex items-center justify-center bg-blue-500 rounded-full fixed right-10 bottom-10 cursor-pointer',
        customClass
      )}
    >
      {Icon || <AiOutlinePlus size={sizeDefault} color={colorDefault} />}
    </div>
  );
}
