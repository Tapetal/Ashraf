import React from 'react'
// import Image from 'next/image'

export default function Project() {
    const projects = [
        {
            title: "TicketProof",
            description:
                "A Web3-powered event ticketing platform built with Next.js and Hedera blockchain. Each ticket is a unique NFT minted via Hedera Token Service, featuring QR verification, wallet integration, gamification badges, and fraud-proof authentication to eliminate counterfeit tickets.",
            techStacks: ["Next.js", "TypeScript", "Hedera", "Firebase", "Tailwind", "HashConnect", "Web3"],
            link: "https://ticket-proof.vercel.app/",
            github: "https://github.com/Tapetal/TicketProof",
        },
        {
            title: "Invora",
            description:
                "A full-featured inventory management web app built with TypeScript, React, Express, and MongoDB. Features role-based access, secure authentication, reporting tools, and a responsive dashboard for streamlined operations.",
            techStacks: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind", "JWT", "Nodemailer"],
            link: "https://invora-demo.vercel.app/",
            github: "https://github.com/Tapetal/Inventory-Management-System",
        },
        {
            title: "ROSCA",
            description:
                "A modern web application built with TypeScript, designed to streamline rotating savings and credit association operations. Features a clean interface and robust backend for managing group financial activities securely.",
            techStacks: ["TypeScript", "React", "Node.js", "Express", "MongoDB", "Tailwind"],
            link: "https://rosca-client.onrender.com/",
            github: "https://github.com/Tapetal/ROSCA",
        },
        {
            title: "Miramar-SG",
            description:
                "A hotel booking web application built using Python and modern web technologies. It features enhanced CSS styling for intuitive navigation, user-friendly booking and profile interfaces, and a fully responsive design to ensure a smooth and seamless experience across all devices.",
            techStacks: ["Python", "HTML", "CSS", "JavaScript"],
            link: "https://miramar-sg.onrender.com",
            github: "https://github.com/Tapetal/Miramar-SG",
        },
    ]

    return (
        <div id='Projects' className='mx-auto max-w-7xl sm:px-14 px-5 py-24 relative z-10'>
            <div className="font-extrabold text-center w-[280px] sm:w-[340px] md:w-fit mx-auto relative flex flex-col md:flex-row items-center justify-center text-2xl sm:text-3xl mb-16">
                <span className="gradient-text">Here&apos;s some things I have built</span>
                <div className="absolute right-1 top-13 sm:right-2 sm:top-15 md:-right-22 md:top-6 -rotate-12 w-32 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-normal rounded-full px-4 py-1.5 shadow-lg animate-glow">
                    2024 - 2025
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className='group relative glass-effect-dark p-6 rounded-xl border border-blue-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1 flex flex-col'
                    >
                        {/* Folder Icon and Links */}
                        <div className='flex flex-row items-start justify-between mb-4'>
                            <div className='text-cyan-400'>
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <div className='flex gap-3'>
                                <a 
                                    href={project.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='text-gray-400 hover:text-cyan-400 transition-colors'
                                >
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a 
                                    href={project.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className='text-gray-400 hover:text-cyan-400 transition-colors'
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Project Title */}
                        <div className='text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors'>
                            {project.title}
                        </div>

                        {/* Description */}
                        <div className='text-gray-400 text-sm leading-relaxed mb-6 flex-grow'>
                            {project.description}
                        </div>

                        {/* Tech Stack */}
                        <div className='text-xs text-gray-500 font-mono'>
                            {project.techStacks.join(' • ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}