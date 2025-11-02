import React from 'react'
import Image from 'next/image'
import bluepushpin from '../images/icons/BluePushPin.png'
import yellowpushpin from '../images/icons/YellowPushPin.png'
import orangepushpin from '../images/icons/OrangePuhPin.png'
import pinkpushpin from '../images/icons/PinkPushPin.png'
import { Caveat } from 'next/font/google'
import ScrollReveal from './ui/ScrollReveal'

const caveat = Caveat({
    subsets: ['latin'],
    weight: ['400', '700'],
})

export default function Aboutme() {
    return (
        <>
            <div id='Aboutme' className='relative w-full bg-gradient-to-b from-[#0a0a1a] to-white overflow-hidden'>
                {/* Wavy divider */}
                <svg
                    className="absolute top-0 left-0 w-full h-16 md:h-32 block rotate-180"
                    viewBox="0 0 1200 180"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0a0a1a" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,40 
                       C75,40 75,160 150,160 
                       C225,160 225,40 300,40 
                       C375,40 375,170 450,170 
                       C525,170 525,40 600,40 
                       C675,40 675,150 750,150 
                       C825,150 825,40 900,40 
                       C975,40 975,160 1050,160 
                       C1125,160 1125,40 1200,40 
                       L1200,200 L0,200 Z"
                        fill="url(#waveGradient)"
                    />
                </svg>

                <div className='mx-auto max-w-6xl sm:px-14 px-5 pt-32 md:pt-48 relative z-10'>
                    <div className="font-extrabold text-center w-[280px] sm:w-[320px] md:w-fit mx-auto relative flex flex-col md:flex-row items-center text-black text-2xl md:text-3xl">
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            Everything you need to know
                        </span>
                        <div className="absolute right-6 top-13 sm:right-14 sm:top-12 md:-right-22 md:top-5 -rotate-12 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-base font-normal rounded-full px-5 py-1.5 shadow-lg animate-glow">
                            About me
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-12 md:gap-y-10 lg:gap-y-14 mt-20">
                        {/* Card 1 - Who I Am */}
                        <ScrollReveal animation='animate-fade-in' delay='100'>
                            <div className="group border-2 border-sky-200 shadow-[0_10px_50px_rgba(14,165,233,0.15)] hover:shadow-[0_20px_60px_rgba(14,165,233,0.25)] transition-all duration-500 rounded-2xl px-4 py-3 flex flex-col hover-scale h-full">
                                <div className='relative'>
                                    <Image
                                        width={41}
                                        height={41}
                                        className="mx-auto drop-shadow-[0_0_15px_rgba(14,165,233,0.9)] my-2 md:my-4 z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                                        src={bluepushpin}
                                        alt="blue pushpin"
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-sky-50 to-blue-100 border-2 border-sky-300 px-6 py-7 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-300 opacity-10 blur-3xl rounded-full"></div>
                                    <h2 className={`${caveat.className} text-sky-500 text-5xl font-bold relative z-10`}>01</h2>
                                    <div className="py-6 flex-1 relative z-10">
                                        <h2 className="text-[#262626] font-bold text-xl mb-3">Who I Am</h2>
                                        <p className="text-md tracking-wide text-[#555] leading-relaxed">
                                            I&apos;m Aminu Ashraf, a results-driven software & web developer based in Abuja. I&apos;m passionate about building secure, scalable applications that solve real business problems and improve user experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Card 2 - What I Do */}
                        <ScrollReveal animation='animate-fade-in' delay='200'>
                            <div className="group border-2 border-cyan-200 shadow-[0_10px_50px_rgba(6,182,212,0.15)] hover:shadow-[0_20px_60px_rgba(6,182,212,0.25)] transition-all duration-500 rounded-2xl px-4 py-3 flex flex-col hover-scale h-full">
                                <Image
                                    width={41}
                                    height={41}
                                    className="mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] my-2 md:my-4 z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                                    src={pinkpushpin}
                                    alt="pushpin"
                                />
                                <div className="bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-300 px-6 py-7 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-300 opacity-10 blur-3xl rounded-full"></div>
                                    <h2 className={`${caveat.className} text-cyan-500 text-5xl font-bold relative z-10`}>02</h2>
                                    <div className="py-6 flex-1 relative z-10">
                                        <h2 className="text-[#262626] font-bold text-xl mb-3">What I Do</h2>
                                        <p className="text-md tracking-wide text-[#555] leading-relaxed">
                                            I design and develop full-stack web applications using modern technologies like JavaScript, TypeScript, React.js, Node.js, MySQL, MongoDB & Firebase. I enjoy transforming ideas into high-performing digital solutions — from responsive web apps to cloud-powered services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Card 3 - Why I Do It */}
                        <ScrollReveal animation='animate-fade-in' delay='300'>
                            <div className="group border-2 border-indigo-200 shadow-[0_10px_50px_rgba(99,102,241,0.15)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.25)] transition-all duration-500 rounded-2xl px-4 py-3 flex flex-col hover-scale h-full">
                                <Image
                                    width={41}
                                    height={41}
                                    className="mx-auto drop-shadow-[0_0_15px_rgba(99,102,241,0.9)] my-2 md:my-4 z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                                    src={orangepushpin}
                                    alt="pushpin"
                                />
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 border-2 border-indigo-300 px-6 py-7 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-300 opacity-10 blur-3xl rounded-full"></div>
                                    <h2 className={`${caveat.className} text-indigo-500 text-5xl font-bold relative z-10`}>03</h2>
                                    <div className="py-6 flex-1 relative z-10">
                                        <h2 className="text-[#262626] font-bold text-xl mb-3">Why I Do It</h2>
                                        <p className="text-md tracking-wide text-[#555] leading-relaxed">
                                            Technology gives me a way to solve problems that matter — faster workflows, automated systems, and tools that help people. I love seeing how software can turn complex processes into simple, scalable, and smarter solutions. Every project is a chance to learn, improve, and contribute something valuable.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Card 4 - Tech Stacks I Use */}
                        <ScrollReveal animation='animate-fade-in' delay='400'>
                            <div className="group border-2 border-blue-200 shadow-[0_10px_50px_rgba(59,130,246,0.15)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] transition-all duration-500 rounded-2xl px-4 py-3 flex flex-col hover-scale h-full">
                                <Image
                                    width={40}
                                    height={40}
                                    className="mx-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.9)] my-2 md:my-4 z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                                    src={yellowpushpin}
                                    alt="pushpin"
                                />
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-300 px-6 py-7 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 opacity-10 blur-3xl rounded-full"></div>
                                    <h2 className={`${caveat.className} text-blue-500 text-5xl font-bold relative z-10`}>04</h2>
                                    <div className="pt-4 flex-1 relative z-10 flex flex-col">
                                        <h2 className="text-[#262626] font-bold text-xl mb-4">Tech Stacks I Use</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 text-black flex-1">
                                            {[
                                                { name: 'React.js', icon: 'https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000', delay: '100' },
                                                { name: 'TypeScript', icon: 'https://img.icons8.com/?size=100&id=wpZmKzk11AzJ&format=png&color=000000', delay: '200' },
                                                { name: 'Node.js', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png', delay: '300' },
                                                { name: 'MongoDB', icon: 'https://img.icons8.com/?size=100&id=B403GJErHZpx&format=png&color=000000', delay: '400' },
                                                { name: 'TailwindCSS', icon: 'https://img.icons8.com/?size=100&id=x7XMNGh2vdqA&format=png&color=000000', delay: '500' },
                                                { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=33039&format=png&color=000000', delay: '600' },
                                                { name: 'REST APIs', icon: 'https://img.icons8.com/?size=100&id=EPbEfEa7o8CB&format=png&color=000000', delay: '700' },
                                                { name: 'Firebase', icon: 'https://img.icons8.com/?size=100&id=62452&format=png&color=000000', delay: '800' }
                                            ].map((tech) => (
                                                <ScrollReveal key={tech.name} animation='animate-fade-in' delay={tech.delay}>
                                                    <div className='flex items-center justify-center h-12 w-auto gap-x-2 rounded-xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-100 px-3'>
                                                        <Image alt={`${tech.name}-icon`} width={22} height={22} className='h-5 w-5' src={tech.icon} />
                                                        <div className='text-xs md:text-sm tracking-wide font-medium'>{tech.name}</div>
                                                    </div>
                                                </ScrollReveal>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </>
    )
}