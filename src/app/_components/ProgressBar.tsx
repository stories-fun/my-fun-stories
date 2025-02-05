import React from 'react'

const ProgressBar = () => {
  return (
    <div>
        <div className='flex justify-between mb-1 w-[50%]'>
            <span>$invested raised</span>
            <span>Goal:$cap</span>
        </div>
        <div className='w-[50%] '>
        <div className='h-4 bg-gray-200 rounded-full'>
        <div 
          className="h-4 w-[50%] bg-pink-500 rounded-full transition-all duration-500" 
          style={{ width: `$88%` }}
        />
        </div>
        </div>
    </div>
  )
}

export default ProgressBar