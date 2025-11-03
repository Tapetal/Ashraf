import React from 'react'

export default function Footer() {
  return (
    <div className='max-w-6xl bottom-0 mx-auto mt-24 pb-12 sm:px-14 px-5'>
      <div className='flex flex-col md:flex-row items-center text-black justify-between border-t-2 border-blue-200/50 py-10 gap-6'>
        <div className='flex flex-row items-center font-bold text-sm sm:text-lg md:text-xl group'>
          <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
            Connect With Me
          </span>
          <span className="relative ml-2 sm:ml-3 flex size-2.5 sm:size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-75"></span>
            <span className="relative inline-flex size-2.5 sm:size-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></span>
          </span>
        </div>
        
        <div className='flex flex-row flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm items-center justify-center'>
          <a 
            href="https://www.instagram.com/ashraf_amyn_/" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-300 text-indigo-700 hover:from-indigo-200 hover:to-blue-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
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
            className='px-4 py-2 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-300 text-sky-700 hover:from-sky-200 hover:to-blue-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            Github
          </a>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aminuashraf55@gmail.com" 
            target='_blank' 
            className='px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-sky-100 border border-cyan-300 text-cyan-700 hover:from-cyan-200 hover:to-sky-200 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium'
          >
            Gmail
          </a>
        </div>
      </div>

      {/* Copyright & Credit Section */}
      <div className='text-center text-gray-600 text-xs sm:text-sm mt-8 pb-4 space-y-2'>
        <p>© 2025 Ashraf Aminu. Built with <span className='text-blue-600'>💙</span> and Next.js</p>
        <p className='text-gray-500'>
          Design inspiration from{' '}
          <a 
            href="https://github.com/zainab-kassim" 
            target='_blank' 
            rel='noopener noreferrer' 
            className='text-blue-600 hover:text-cyan-600 hover:underline transition-colors duration-200 font-medium'
          >
            Zainab Kassim
          </a>
        </p>
      </div>
    </div>
  )
}