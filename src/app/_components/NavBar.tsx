import React from 'react'

const NavBar = () => {
  return (
    <div className='p-6 flex justify-between '>
        <div>Stories.fun</div>
        <div>
            <input type='text' className='rounded-full border-pink-500 text-black px-16 py-2 bg-gray-200' placeholder='Search Stories'/>
        </div>
        <div>Connect Wallet</div>
    </div>  
  )
}

export default NavBar