"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { FiMenu,FiX } from "react-icons/fi";

const NavBar = () => {
  const [menuOpen,setMenuOpen] = useState(false)

  return (
    <div className='p-2 flex justify-between items-center container mx-auto border-b-2'>
        <div className='flex text-[#000000] font-[Mont] leading-[25px] text-[25px] text-left decoration-skip-ink-none items-center space-x-2 font-bold'>
          <Image src="/images/logo.png" width={50} height={50} alt='logo'/>
        <div>Stories.fun</div>
        </div>
        <div className='hidden sm:flex relative'>
            <Image src={"/images/Search.png"} width={25} height={25} alt='search' className='absolute left-4 top-1/2 transform -translate-y-1/2'/>
            <input type='text' className='rounded-full border-pink-500 text-black px-24 py-4 bg-[#F5F5F5] focus:outline-none ' placeholder='Search Stories'/>
        </div>
        <div className='flex items-center space-x-4'>
        <div className='hidden sm:flex space-x-4'>
        <div className='bg-[#F5F5F5] px-4 py-2 rounded-full flex items-center space-x-2' >
          <Image src={"/images/Advertise.png"} width={25} height={25} alt='img'/>
        <div className='text-[#000000]'>Connect Wallet</div>
        </div>
        <div className='bg-[#FFE700] rounded-full px-6 py-2 flex items-center'>
          <div className='text-[#000000] font-bold'>Login</div>
        </div>
        </div>

        <button onClick={()=>setMenuOpen(!menuOpen) } className='sm:hidden text-2xl'>
          {menuOpen ?  <FiX />: <FiMenu />}
        </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
                  <div className='absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 sm:hidden'>
                  <input 
                    type='text' 
                    className='rounded-full border-pink-500 text-black px-4 py-2 bg-[#F5F5F5] focus:outline-none w-[80%]' 
                    placeholder='Search Stories' 
                  />
                  <div className='bg-[#F5F5F5] px-4 py-2 rounded-full flex items-center space-x-2 w-[80%] justify-center'>
                    <Image src={"/images/Advertise.png"} width={20} height={20} alt='advertise' />
                    <div className='text-black'>Connect Wallet</div>
                  </div>
                  <div className='bg-[#FFE700] rounded-full px-6 py-2 flex items-center w-[80%] justify-center'>
                    <div className='text-black font-bold'>Login</div>
                  </div>
                </div>
        )}
    </div>  
  )
}

export default NavBar