import React from 'react'
import Image from 'next/image'
import { Caveat } from 'next/font/google'
import ScrollReveal from './ui/ScrollReveal'

const caveat = Caveat({
    subsets: ['latin'],
    weight: ['400', '700'],
})

export default function Aboutme() {
    const cards = [
        {
            number: "01",
            title: "My Background",
            description: "I'm Aminu Ashraf, a results-driven software & web developer based in Abuja. I'm passionate about building secure, scalable applications that solve real business problems and improve user experience.",
            color: "sky",
            gradient: "from-sky-400 to-blue-500",
            bgGradient: "from-sky-50 to-blue-50",
            borderColor: "border-sky-300/50",
            shadowColor: "shadow-sky-500/10",
            iconColor: "text-sky-500"
        },
        {
            number: "02",
            title: "My Expertise",
            description: "I design and develop full-stack web applications using modern technologies like JavaScript, TypeScript, React.js, Node.js, MySQL, MongoDB & Firebase. I enjoy transforming ideas into high-performing digital solutions — from responsive web apps to cloud-powered services.",
            color: "cyan",
            gradient: "from-cyan-400 to-blue-500",
            bgGradient: "from-cyan-50 to-blue-50",
            borderColor: "border-cyan-300/50",
            shadowColor: "shadow-cyan-500/10",
            iconColor: "text-cyan-500"
        },
        {
            number: "03",
            title: "My Motivation",
            description: "Technology gives me a way to solve problems that matter — faster workflows, automated systems, and tools that help people. I love seeing how software can turn complex processes into simple, scalable, and smarter solutions. Every project is a chance to learn, improve, and contribute something valuable.",
            color: "indigo",
            gradient: "from-indigo-400 to-blue-500",
            bgGradient: "from-indigo-50 to-blue-50",
            borderColor: "border-indigo-300/50",
            shadowColor: "shadow-indigo-500/10",
            iconColor: "text-indigo-500"
        },
        {
            number: "04",
            title: "My Toolkit",
            description: null,
            color: "blue",
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            borderColor: "border-blue-300/50",
            shadowColor: "shadow-blue-500/10",
            iconColor: "text-blue-500",
            techStack: [
                { name: 'React.js', icon: 'https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000' },
                { name: 'TypeScript', icon: 'https://img.icons8.com/?size=100&id=wpZmKzk11AzJ&format=png&color=000000' },
                { name: 'Node.js', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png' },
                { name: 'Next.js', icon: 'https://img.icons8.com/?size=100&id=MWiBjkuHeMVq&format=png&color=000000' },
                { name: 'Express.js', icon: 'https://img.icons8.com/?size=100&id=WNoJgbzDr3i2&format=png&color=000000' },
                { name: 'MongoDB', icon: 'https://img.icons8.com/?size=100&id=B403GJErHZpx&format=png&color=000000' },
                { name: 'SQL', icon: 'https://img.icons8.com/?size=100&id=UFXRpPFebwa2&format=png&color=000000' },
                { name: 'TailwindCSS', icon: 'https://img.icons8.com/?size=100&id=x7XMNGh2vdqA&format=png&color=000000' },
                { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=33039&format=png&color=000000' },
                { name: 'REST APIs', icon: 'https://img.icons8.com/?size=100&id=EPbEfEa7o8CB&format=png&color=000000' },
                { name: 'Firebase', icon: 'https://img.icons8.com/?size=100&id=62452&format=png&color=000000' }
            ]
        }
    ]

    return (
        <>
            <div id='About' className='relative w-full bg-gradient-to-b from-[#0a0a1a] to-white overflow-hidden'>
                {/* Curved arch divider */}
                <svg
                    className="absolute top-0 left-0 w-full h-24 md:h-32 block"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="archGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0a0a1a" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,0 L0,40 Q600,120 1200,40 L1200,0 Z"
                        fill="url(#archGradient)"
                    />
                </svg>

                <div className='mx-auto max-w-6xl sm:px-14 px-5 pt-32 md:pt-48 relative z-10'>
                    <div className="font-extrabold text-center mx-auto relative text-black text-2xl md:text-3xl pb-12 md:pb-8">
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            Get to know me better
                        </span>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:-top-2 md:translate-x-0 -rotate-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm md:text-base font-normal rounded-full px-4 md:px-5 py-1 md:py-1.5 shadow-lg animate-glow whitespace-nowrap">
                            About
                        </div>
                    </div>
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            Get to know me better
                        </span>
                        <div className="absolute right-6 top-13 sm:right-14 sm:top-12 md:-right-20 md:top-5 -rotate-12 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-base font-normal rounded-full px-5 py-1.5 shadow-lg animate-glow">
                            About
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-20">
                        {cards.map((card, index) => (
                            <ScrollReveal key={index} animation='animate-fade-in' delay={`${(index + 1) * 100}`}>
                                <div className={`group relative ${card.borderColor} border-2 ${card.shadowColor} shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl p-5 flex flex-col hover-scale h-full overflow-hidden bg-white`}>
                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                                    
                                    {/* Decorative corner gradient */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}></div>
                                    
                                    {/* Content */}
                                    <div className='relative z-10'>
                                        {/* Handwritten number */}
                                        <h2 className={`${caveat.className} ${card.iconColor} text-4xl font-bold mb-3`}>
                                            {card.number}
                                        </h2>
                                        
                                        {/* Title */}
                                        <h2 className={`text-xl font-bold mb-3 ${card.iconColor}`}>
                                            {card.title}
                                        </h2>
                                        
                                        {/* Description or Tech Stack */}
                                        {card.description ? (
                                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                                {card.description}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                {card.techStack?.map((tech, i) => (
                                                    <div key={i} className='flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300'>
                                                        <Image alt={`${tech.name}-icon`} width={22} height={22} className='w-5 h-5 md:w-6 md:h-6 flex-shrink-0' src={tech.icon} />
                                                        <span className='text-xs md:text-sm font-medium text-gray-700'>{tech.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}