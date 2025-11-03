import React from 'react'
import Image from 'next/image'
import githublogo from '../images/icons/github (3).png'
import memoji from '../images/icons/Me-moji.png'
import blackOnly from '../images/icons/black_only.png'
import flag from '../images/icons/flag.png'
import ScrollReveal from './ui/ScrollReveal'

export default function HeroSection() {
  return (
    <>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <div className='sm:px-14 px-5 sticky top-8 z-50'>
        <div className='flex mx-auto max-w-sm sm:max-w-3xl sm:justify-between justify-center justify-items-center px-3 sm:px-5 items-center glass-effect-dark shadow-xl backdrop-blur-3xl border-purple-500/30 py-2 rounded-full transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20'>
          <Image height={40} width={40} className='w-8 h-8 sm:flex hidden animate-rotate-slow' alt='logo' src={blackOnly} />
          <div className='flex flex-row lg:gap-12 md:gap-9 gap-6 justify-center text-white tracking-wide items-center lg:text-[13px] text-sm'>
            <div className='hover:text-purple-400 transition-colors duration-200 cursor-pointer'><a href="#Projects">Projects</a></div>
            <div className='hover:text-cyan-400 transition-colors duration-200 cursor-pointer'><a href="#Experience">Experience</a></div>
            <div className='hover:text-purple-400 transition-colors duration-200 cursor-pointer'><a href="#Aboutme">About</a></div>
            <a href="https://docs.google.com/document/d/1lVQgfJbiybqjRakxfJUksAl2DdnFSI1YKD6itd8YFQM/edit?usp=sharing" target='_blank'>
              <div className="p-[1px] bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 rounded-3xl cursor-pointer hover:scale-105 transition-transform duration-300 animate-glow">
                <div className="rounded-full py-2 px-4 md:py-3 md:px-6 bg-black text-white backdrop-blur-2xl hover:bg-gray-900 transition-colors duration-200">
                  Resume
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className='flex flex-col sm:px-14 px-5 justify-center items-center mb-20 pt-5 mt-24 sm:mt-36 relative z-10'>
        <div className='relative'>
          <Image height={170} width={170} className='animate-fade-in-up animate-float w-21 h-21' quality={100} alt='memoji' src={memoji} />
          <div className="absolute inset-0 blur-2xl bg-blue-500/30 animate-pulse-glow rounded-full -z-10"></div>
        </div>
        
        <div className='text-center text-white animate-fade-in-up font-bold font-sans mt-6 text-xl md:text-3xl lg:text-[41px]'>
          <h2 className='flex justify-center mb-2'>
            <span className='gradient-text'>Aminu Ashraf</span>
            <span className='ml-2'>is a Software Developer</span>
          </h2>
          <h2 className='flex justify-center items-center gap-2'>
            From Abuja, 
            <Image 
              src={flag} 
              alt="Nigeria flag" 
              width={40} 
              height={40} 
              className='w-8 h-8 md:w-10 md:h-10 hover:scale-110 transition-transform duration-200 inline-block'
            />
          </h2>
        </div>

        <ScrollReveal animation='animate-expand-horizontally'>
          <div className='flex justify-items-center mt-8 gap-2 sm:gap-3 relative mb-12'>
            <a href="https://x.com/TemiDevtips" target='_blank' className='cursor-pointer group'>
              <div className='relative'>
                <Image height={70} width={70} className='glass-effect hover:bg-blue-500/30 hover:border-blue-400 hover:scale-110 transition-all duration-300 hover:-translate-y-3 hover:rotate-0 sm:w-14 sm:h-12 w-12 h-10 rounded-xl px-4 py-3 -rotate-6 relative border border-white/10' alt='twitter logo' src='https://img.icons8.com/?size=100&id=A4DsujzAX4rw&format=png&color=ffffff' />
                <div className="absolute inset-0 blur-xl bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </div>
            </a>
            
            <a href="https://github.com/tapetal" target='_blank' className='cursor-pointer group'>
              <div className='relative'>
                <Image height={70} width={70} className='glass-effect hover:bg-cyan-500/30 hover:border-cyan-400 hover:scale-110 transition-all duration-300 hover:-translate-y-3 hover:rotate-0 sm:w-14 sm:h-12 w-12 h-10 rounded-xl px-4 py-3 -rotate-2 relative border border-white/10' alt='githublogo' src={githublogo} />
                <div className="absolute inset-0 blur-xl bg-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </div>
            </a>
            
            <a href="https://www.linkedin.com/in/ashraf-aminu-a81310251" target='_blank' className='cursor-pointer group'>
              <div className='relative'>
                <Image height={70} width={70} className='glass-effect hover:bg-blue-600/30 hover:border-blue-400 hover:scale-110 transition-all duration-300 hover:-translate-y-3 sm:w-15 sm:h-12 w-12 h-10 rounded-xl px-4 py-3 border border-white/10' alt='linkedinlogo' src='https://img.icons8.com/?size=100&id=2EqeH19eMd3a&format=png&color=ffffff' />
                <div className="absolute inset-0 blur-xl bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </div>
            </a>
            
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aminuashraf55@gmail.com&su=Hello%20Ashraf&body=I%20would%20like%20to%20get%20in%20touch%20with%20you." target="_blank" rel="noopener noreferrer" className='cursor-pointer group'>
              <div className='relative'>
                <Image height={70} width={70} className='glass-effect hover:bg-sky-500/30 hover:border-sky-400 hover:scale-110 transition-all duration-300 hover:-translate-y-3 hover:rotate-0 sm:w-14 sm:h-12 w-12 h-10 rounded-xl px-4 py-3 rotate-3 relative border border-white/10' alt='maillogo' src='https://img.icons8.com/?size=100&id=Y2GfpkgYNp42&format=png&color=ffffff' />
                <div className="absolute inset-0 blur-xl bg-sky-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </div>
            </a>
            
            <a href="https://www.instagram.com/ashraf_amyn_/" target='_blank' className='cursor-pointer group'>
              <div className='relative'>
                <Image height={80} width={80} className='glass-effect hover:bg-indigo-500/30 hover:border-indigo-400 hover:scale-110 transition-all duration-300 hover:-translate-y-3 hover:rotate-0 sm:w-15 sm:h-12 w-12 h-10 rounded-xl px-4 py-3 rotate-6 relative border border-white/10' alt='instagram logo' src='https://img.icons8.com/?size=100&id=32320&format=png&color=FFFFFF' />
                <div className="absolute inset-0 blur-xl bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
              </div>
            </a>
          </div> 
        </ScrollReveal>
      </div>
    </>
  )
}