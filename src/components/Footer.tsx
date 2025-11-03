import React from 'react'

export default function Footer() {
  return (
    <div className='max-w-6xl bottom-0 mx-auto mt-24 pb-12 sm:px-14 px-5'>
      <div className='flex flex-col md:flex-row items-center text-black justify-between border-t-2 border-purple-200/50 py-10 gap-6'>
        <div className='flex flex-row items-center font-bold text-sm sm:text-lg md:text-xl group'>
          <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
            Connect With Me
          </span>
          <span className="relative ml-2 sm:ml-3 flex size-2.5 sm:size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-75"></span>
            <span className="relative inline-flex size-2.5 sm:size-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </span>
        </div>
        
        <div className='flex flex-row flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm items-center justify-center'>
          <a 
            href="https://www.instagram.com/ashraf_amyn_/" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-300 text-pink-700 hover:from-pink-200 hover:to-rose-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            Instagram
          </a>
          <a 
            href="https://www.linkedin.com/in/ashraf-aminu-a81310251/" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 text-blue-700 hover:from-blue-200 hover:to-cyan-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/Tapetal/" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-300 text-purple-700 hover:from-purple-200 hover:to-violet-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            Github
          </a>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aminuashraf55@gmail.com" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-700 hover:from-amber-200 hover:to-orange-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            Gmail
          </a>
        </div>
      </div>

      {/* Copyright & Credit Section */}
      <div className='text-center text-gray-600 text-xs sm:text-sm mt-8 pb-4 space-y-1'>
        <p>© 2025 Ashraf Aminu. All rights reserved.</p>
        <p className='text-gray-400'>
          Design inspiration from{' '}
          <a 
            href="https://github.com/zainab-kassim" 
            target='_blank' 
            rel='noopener noreferrer' 
            className='text-purple-500 hover:underline'
          >
            Zainab Kassim
          </a>.
        </p>
      </div>
    </div>
  )
}
