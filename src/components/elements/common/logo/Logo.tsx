import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
      <Image 
        src={"/logo.png"}
        alt="KitabMantra"
        height={512}
        width={512}
        className='object-contain'
      />
    </div>
  )
}

export default Logo
