import React from 'react'
import ScrollReveal from './ui/ScrollReveal'

export default function Experience() {
    const experiences = [
        {
            role: "IT Support & Data Management Intern",
            company: "Nigerian Shippers' Council",
            location: "Abuja, FCT, Nigeria",
            period: "March 2025 - Oct 2025",
            description: "Supporting data management operations and contributing to strategic decision-making through technical insights and documentation.",
            achievements: [
                "Streamlined database entry processes, reducing retrieval time by 20%",
                "Prepared detailed project reports and presentations for senior staff",
                "Developed internal documentation and process guidelines",
                "Contributed to problem-solving sessions that led to more efficient workflows"
            ],
            color: "cyan"
        },
        {
            role: "Frontend Developer Intern",
            company: "Comsoft",
            location: "Abuja",
            period: "October 2024 - March 2025",
            description: "Assisted in developing and testing software solutions while collaborating with senior developers to enhance application quality.",
            achievements: [
                "Introduced automated testing scripts improving coding efficiency by 15%",
                "Researched and implemented new tools to optimize workflow",
                "Collaborated with senior developers to debug and enhance applications",
                "Delivered technical presentations improving team understanding"
            ],
            color: "blue"
        },
        {
            role: "Advanced Diploma in Software Engineering",
            company: "Aptech Learning",
            location: "Abuja, FCT, Nigeria",
            period: "October 2022 - October 2024",
            description: "Comprehensive software engineering program covering full-stack development, databases, and modern frameworks.",
            achievements: [
                "Completed coursework in Java, C#, Python, Flutter, and AngularJS",
                "Built and deployed websites, mobile apps, and Python web applications",
                "Mastered SQL Server, MySQL, and database optimization",
                "Gained expertise in Agile, DevOps, and cloud platforms"
            ],
            color: "sky"
        }
    ]

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                border: 'border-blue-500/30 hover:border-blue-500/60',
                bg: 'from-blue-500 to-indigo-500',
                text: 'text-blue-500',
                glow: 'bg-blue-500/20'
            },
            sky: {
                border: 'border-sky-500/30 hover:border-sky-500/60',
                bg: 'from-sky-500 to-blue-500',
                text: 'text-sky-500',
                glow: 'bg-sky-500/20'
            },
            cyan: {
                border: 'border-cyan-500/30 hover:border-cyan-500/60',
                bg: 'from-cyan-500 to-blue-500',
                text: 'text-cyan-500',
                glow: 'bg-cyan-500/20'
            }
        }
        return colors[color as keyof typeof colors]
    }

    return (
        <div id='Experience' className='mx-auto max-w-6xl sm:px-14 px-5 py-24 relative z-10'>
            <div className="font-extrabold text-center w-[280px] sm:w-[340px] md:w-fit mx-auto relative flex flex-col md:flex-row items-center justify-center text-2xl sm:text-3xl mb-4">
                <span className="gradient-text">My Professional Journey</span>
                <div className="absolute right-1 top-13 sm:right-2 sm:top-15 md:-right-20 md:top-6 rotate-12 w-36 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-normal rounded-full px-4 py-1.5 shadow-lg animate-glow">
                    Experience
                </div>
            </div>

            <div className='mt-24 space-y-6'>
                {experiences.map((exp, index) => {
                    const colors = getColorClasses(exp.color)
                    return (
                        <ScrollReveal 
                            key={index} 
                            animation={index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}
                            delay={`delay-${index * 100}`}
                        >
                            <div className={`group relative glass-effect-dark p-5 md:p-6 rounded-2xl border ${colors.border} transition-all duration-500 hover-scale overflow-hidden`}>
                                {/* Animated background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>

                                <div className='relative z-10'>
                                    <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2'>
                                        <div>
                                            <h3 className='text-xl font-bold text-white mb-1'>{exp.role}</h3>
                                            <p className={`text-base ${colors.text} font-medium`}>{exp.company}</p>
                                            <p className='text-xs text-gray-400 mt-1'>{exp.location}</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full glass-effect border ${colors.border} ${colors.text} text-xs font-medium whitespace-nowrap w-fit`}>
                                            {exp.period}
                                        </div>
                                    </div>

                                    <div className={`h-px bg-gradient-to-r from-transparent via-${exp.color}-500 to-transparent mb-4`}></div>

                                    <p className='text-gray-300 text-sm mb-4 leading-relaxed'>
                                        {exp.description}
                                    </p>

                                    <div className='space-y-2'>
                                        <h4 className='text-white font-semibold text-xs uppercase tracking-wide'>Key Highlights:</h4>
                                        <ul className='space-y-1.5'>
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className='flex items-start gap-2 text-gray-300 text-sms'>
                                                    <span className={`inline-block w-1.5 h-1.5 ${colors.glow} rounded-full mt-1 flex-shrink-0 animate-pulse`}></span>
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Accent corner */}
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.bg} opacity-10 blur-3xl rounded-full pointer-events-none`}></div>
                                <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${colors.bg} opacity-10 blur-3xl rounded-full pointer-events-none`}></div>
                            </div>
                        </ScrollReveal>
                    )
                })}
            </div>

            {/* Timeline connector visual */}
            <div className='absolute left-8 top-32 bottom-32 w-px bg-gradient-to-b from-blue-500 via-cyan-500 to-sky-500 opacity-20 hidden lg:block'></div>
        </div>
    )
}