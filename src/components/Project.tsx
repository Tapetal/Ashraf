import React from 'react'
import Image from 'next/image'

export default function Project() {
    const projects = [
        {
            title: "Invora",
            description:
                "A full-featured inventory management web app built with TypeScript, React, Express, and MongoDB. Features role-based access, secure authentication, reporting tools, and a responsive dashboard for streamlined operations.",
            techStacks: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind", "JWT", "Nodemailer"],
            link: "https://inventory-management-system-demo-two.vercel.app/",
            github: "https://github.com/Tapetal/Inventory-Management-System",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            title: "ROSCA",
            description:
                "A modern web application built with TypeScript, designed to streamline rotating savings and credit association operations. Features a clean interface and robust backend for managing group financial activities securely.",
            techStacks: ["TypeScript", "React", "Node.js", "Express", "MongoDB", "Tailwind"],
            link: "https://rosca-client.onrender.com/",
            github: "https://github.com/Tapetal/ROSCA",
            gradient: "from-cyan-500 to-sky-500"
        },
        {
            title: "Miramar-SG",
            description:
                "A web application built with Python and modern web technologies. Features updated CSS styles for navigation, profile sections, and responsive design for seamless user experience across devices.",
            techStacks: ["Python", "HTML", "CSS", "JavaScript"],
            link: "https://miramar-sg.onrender.com",
            github: "https://github.com/Tapetal/Miramar-SG",
            gradient: "from-sky-500 to-blue-600"
        },
    ]

    return (
        <div id='Projects' className='mx-auto max-w-6xl sm:px-14 px-5 py-24 relative z-10'>
            <div className="font-extrabold text-center w-[280px] sm:w-[340px] md:w-fit mx-auto relative flex flex-col md:flex-row items-center justify-center text-2xl sm:text-3xl mb-4">
                <span className="gradient-text">Here&apos;s some things I have built</span>
                <div className="absolute right-1 top-13 sm:right-2 sm:top-15 md:-right-22 md:top-6 -rotate-12 w-32 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-normal rounded-full px-4 py-1.5 shadow-lg animate-glow">
                    2024 - 2025
                </div>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8 items-stretch mt-24'>
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className='group relative glass-effect-dark md:px-8 px-6 pt-6 pb-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/60 transition-all duration-500 hover-scale overflow-hidden flex flex-col'
                    >
                        {/* Animated gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}></div>
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer pointer-events-none"></div>

                        <div className='flex flex-row items-center justify-between mb-4'>
                            <div className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                                {project.title}
                            </div>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className='group/icon'>
                                <div className='relative'>
                                    <Image 
                                        height={70} 
                                        width={70} 
                                        className='w-9 h-9 group-hover/icon:scale-110 transition-transform duration-300 group-hover/icon:rotate-12' 
                                        alt='githublogo' 
                                        src='https://img.icons8.com/?size=100&id=62856&format=png&color=3b82f6' 
                                    />
                                    <div className="absolute inset-0 blur-xl bg-blue-500/50 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </a>
                        </div>

                        <div className='h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-5'></div>

                        <div className='text-gray-300 text-sm leading-relaxed mb-6 flex-grow'>
                            {project.description}
                        </div>

                        <div className='flex flex-row flex-wrap gap-2 text-xs mb-6 items-center'>
                            {project.techStacks.map((techStack, i) => (
                                <span 
                                    key={i} 
                                    className='px-2.5 py-1 rounded-full glass-effect text-blue-300 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/20 transition-all duration-300 hover:scale-105'
                                >
                                    {techStack}
                                </span>
                            ))}
                        </div>

                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium group/link transition-colors duration-300 mt-auto'
                        >
                            View Project
                            <span className='group-hover/link:translate-x-1 transition-transform duration-300'>🚀</span>
                        </a>

                        {/* Corner accent */}
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${project.gradient} opacity-10 blur-2xl rounded-full -z-10`}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
