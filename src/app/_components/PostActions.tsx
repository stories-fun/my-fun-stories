import React from 'react'
import { IoFlowerOutline } from "react-icons/io5";
import { FaCommentDots } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";


const PostActions = () => {
  return (
    <div className='flex space-x-2 items-center space-y-2'>
        {/* flower button */}
        <div className='bg-[#F5F5F5] px-9 py-2 rounded-full'>
        <IoFlowerOutline />
        </div>
        {/* Comment button */}
        <div className='bg-[#F5F5F5] px-9 py-2 rounded-full'>
        <FaCommentDots />
        </div>
        {/* Share button */}
        <div className='bg-[#F5F5F5] px-9 py-2 rounded-full'>
        <FaRegShareSquare />
        </div>
    </div>
  )
}

export default PostActions