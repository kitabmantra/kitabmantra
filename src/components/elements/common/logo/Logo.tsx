import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image
      src={"/logo.png"}
      alt="KitabMantra"
      fill
      className='object-contain rounded-full'
    />
  )
}
export default Logo
