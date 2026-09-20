import React from 'react'

interface C4ELogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const sizeConfig = {
  sm: 'size-6 text-xs rounded-md p-1',
  md: 'size-8 text-sm rounded-lg p-2',
  lg: 'size-12 text-xl rounded-xl p-3',
  xl: 'size-16 text-3xl rounded-2xl p-4',
  '2xl': 'size-20 text-4xl rounded-2xl p-5'
}

export const C4ELogo: React.FC<C4ELogoProps> = ({ size = 'md', className = '', ...props }) => {
  return (
    <div
      className={`bg-primary/90 flex aspect-square items-center justify-center font-bold text-white ${sizeConfig[size]} ${className}`}
      {...props}
    >
      C<span className="text-accent text-[1.2em] italic">4</span>E
    </div>
  )
}
