export const me = {
  name:       'Ashraf Aminu',
  title:      'Software Developer',
  tagline:    'Crafting scalable, high-impact applications with clean UIs and efficient performance.',
  bio:        "A results-driven software & web developer. I'm passionate about building secure, scalable applications that solve real business problems and improve user experience. Outside of work, I'm fascinated by science, technology, and artificial intelligence (AI). I also enjoy playing video games and football.",
  heroBio:    "I build digital experiences that solve real problems. From responsive web apps to blockchain-powered solutions, I transform ideas into scalable, high-performing products.",
  location:   'Nigeria',
  email:      'aminuashraf55@gmail.com',
  github:     'https://github.com/Tapetal',
  twitter:    'https://x.com/ashraf_amyn_',
  linkedin:   'https://www.linkedin.com/in/ashraf-aminu-a81310251',
  resume:     'https://docs.google.com/document/d/1PoA605SNC3MbxYPQq33uNeLC_qcfuJfc/edit?usp=sharing&ouid=105281908719143806537&rtpof=true&sd=true',
  available:  true,
  phone:      '+2347040762509',
  website:    'https://ashraf-aminu.vercel.app',
};

export const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React.js', 'Next.js', 'Vue.js', 'Svelte', 'TailwindCSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST APIs'],
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'SQL', 'Supabase'],
  },
  {
    title: 'Cloud & Tools',
    skills: ['AWS', 'Google Cloud', 'Firebase', 'Git/GitHub'],
  },
];

export const skills = skillGroups.flatMap((group) => group.skills);

export interface Project {
  id:          string;
  title:       string;
  description: string;
  longDesc:    string;
  tags:        string[];
  category:    'fullstack' | 'frontend' | 'realtime' | 'security' | 'mobile';
  accent:      string;
  icon:        string;
  demo?:       string;
  repo?:       string;
  featured:    boolean;
  year:        number;
}

export const projects: Project[] = [
  {
    id:          'ticketproof',
    title:       'TicketProof',
    description: 'Web3-powered event ticketing platform with blockchain NFT verification',
    longDesc:    'Blockchain-based event ticketing platform using Next.js and Hedera blockchain. Each ticket is minted as a unique NFT, featuring wallet integration with HashConnect, QR verification, and fraud-proof authentication to eliminate counterfeit tickets.',
    tags:        ['Next.js', 'TypeScript', 'Hedera', 'Web3', 'Firebase', 'Tailwind CSS'],
    category:    'fullstack',
    accent:      '#06b6d4',
    icon:        '🎫',
    demo:        'https://ticketproof.vercel.app',
    repo:        'https://github.com/Tapetal/TicketProof',
    featured:    true,
    year:        2024,
  },
  {
    id:          'tapetrics',
    title:       'Tapetrics',
    description: 'Real-time analytics and monitoring dashboard (formerly SentinelX)',
    longDesc:    'High-performance analytics platform with real-time data streaming, comprehensive visualizations, and responsive dashboard. Built for monitoring and analyzing system metrics with live updates.',
    tags:        ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category:    'fullstack',
    accent:      '#10b981',
    icon:        '📊',
    demo:        'https://hng-stage5a-tapetrics.vercel.app/',
    repo:        'https://github.com/Tapetal/hng-stage5A-tapetrics',
    featured:    true,
    year:        2025,
  },
  {
    id:          'invora',
    title:       'Invora',
    description: 'Full-featured inventory management system with secure authentication',
    longDesc:    'Web-based inventory system with role-based access, secure authentication, transaction filtering, and PDF/Excel report generation. Built with React/TypeScript frontend, Node.js/Express backend, and MongoDB for data storage.',
    tags:        ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    category:    'fullstack',
    accent:      '#8b5cf6',
    icon:        '📦',
    demo:        'https://invora-demo.vercel.app/',
    repo:        'https://github.com/Tapetal/Inventory-Management-System',
    featured:    true,
    year:        2024,
  },
  {
    id:          'circle-save',
    title:       'Circle Save',
    description: 'Rotational Savings Group management app with payment integration',
    longDesc:    'Full-stack web app for managing Rotational Savings Groups with Monnify payment integration and AWS services. Enables group creation, automated contributions, and secure KYC verification.',
    tags:        ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'AWS'],
    category:    'fullstack',
    accent:      '#f59e0b',
    icon:        '💰',
    demo:        'https://circle-save.onrender.com',
    repo:        'https://github.com/Tapetal/Circle-Save',
    featured:    false,
    year:        2024,
  },
  {
    id:          'whisperbox',
    title:       'WhisperBox',
    description: 'End-to-end encrypted messaging application',
    longDesc:    'Real-time messaging platform with end-to-end encryption, ensuring messages remain private and secure. Features wallet integration and secure communication protocols.',
    tags:        ['Next.js', 'TypeScript', 'E2EE', 'WebSocket', 'Tailwind CSS'],
    category:    'security',
    accent:      '#6366f1',
    icon:        '🔒',
    demo:        'https://hng-stage4-b-whisperbox.vercel.app/',
    repo:        'https://github.com/Tapetal/hng-stage4B-whisperbox',
    featured:    false,
    year:        2024,
  },
  {
    id:          'miramar-sg',
    title:       'Miramar-SG',
    description: 'Hotel room booking system with responsive design',
    longDesc:    'Hotel booking web app for searching, reserving, and managing room bookings with efficient data handling and smooth UX. Features include advanced search, real-time availability, and secure bookings.',
    tags:        ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL'],
    category:    'fullstack',
    accent:      '#ec4899',
    icon:        '🏨',
    demo:        'https://miramar-sg.onrender.com/',
    repo:        'https://github.com/Tapetal/Miramar-SG',
    featured:    false,
    year:        2023,
  },
  {
    id:          'qr-scanner',
    title:       'QR Scanner & Brain Teaser',
    description: 'Multi-featured mobile app with QR scanning and brain teaser puzzles',
    longDesc:    'Cross-platform mobile application featuring QR code scanning, QR generation, puzzle solving, offline support, and AdMob integration. Built with React Native with tab-based navigation.',
    tags:        ['React Native', 'JavaScript', 'Mobile', 'QR Code', 'Expo'],
    category:    'mobile',   // ← moved from 'frontend' to 'mobile'
    accent:      '#14b8a6',
    icon:        '📱',
    repo:        'https://github.com/Tapetal/QR-Scanner-Pro',
    featured:    false,
    year:        2026,
  },
];

export const timeline = [
  {
    year: '2026',
    title: 'Engineering & Technology Intern',
    company: 'Noma Service Consolidated Ltd',
    location: 'Abuja, FCT, Nigeria',
    period: 'April 2026 - Present',
    desc: 'Serving in the Engineering & Technology department at Noma Service Consolidated Ltd, an agri-tech firm empowering over 15,000 smallholder farmers across Nigeria, responsible for driving the design, development, and deployment of NOMA\'s digital infrastructure and platforms.',
    highlights: [
      'Contributing to the development and maintenance of the Thrum platform',
      'NOMA website development, maintenance, and performance optimization',
      'Maintaining code repositories, technical documentation, and internal workflows',
      'Cybersecurity, access control, system integrations, and digital asset management'
    ],
    accent: '#10b981'
  },
  {
    year: '2025',
    title: 'Bachelor of Science in Information Technology (Hons)',
    company: 'Lincoln University',
    location: 'Abuja, FCT, Nigeria',
    period: 'November 2025 - Present',
    desc: 'Pursuing a comprehensive degree in Information Technology with focus on software development, systems architecture, and emerging technologies.',
    highlights: [
      'Studying advanced topics in software engineering, cloud computing, and database systems',
      'Applying academic knowledge to real-world projects and internships',
      'Building expertise in system design, algorithms, and modern development frameworks',
      'Developing strong foundation in IT infrastructure and security principles'
    ],
    accent: '#06b6d4'
  },
  {
    year: '2025',
    title: 'IT Support & Data Management Intern',
    company: 'Nigerian Shippers\' Council',
    location: 'Abuja, FCT, Nigeria',
    period: 'March 2025 - Oct 2025',
    desc: 'Supporting data management operations and contributing to strategic decision-making through technical insights and documentation.',
    highlights: [
      'Streamlined database entry processes, reducing retrieval time by 20%',
      'Prepared detailed project reports and presentations for senior staff',
      'Developed internal documentation and process guidelines',
      'Contributed to problem-solving sessions that led to more efficient workflows'
    ],
    accent: '#8b5cf6'
  },
  {
    year: '2024',
    title: 'Frontend Developer Intern',
    company: 'Comsoft',
    location: 'Abuja',
    period: 'October 2024 - March 2025',
    desc: 'Assisted in developing and testing software solutions while collaborating with senior developers to enhance application quality.',
    highlights: [
      'Introduced automated testing scripts improving coding efficiency by 15%',
      'Researched and implemented new tools to optimize workflow',
      'Collaborated with senior developers to debug and enhance applications',
      'Delivered technical presentations improving team understanding'
    ],
    accent: '#f59e0b'
  },
  {
    year: '2022',
    title: 'Advanced Diploma in Software Engineering',
    company: 'Aptech Learning',
    location: 'Abuja, FCT, Nigeria',
    period: 'October 2022 - October 2024',
    desc: 'Comprehensive software engineering program covering full-stack development, databases, and modern frameworks.',
    highlights: [
      'Completed coursework in Java, C#, Python, Flutter, and AngularJS',
      'Built and deployed websites, mobile apps, and Python web applications',
      'Mastered SQL Server, MySQL, and database optimization',
      'Gained expertise in Agile, DevOps, and cloud platforms'
    ],
    accent: '#ec4899'
  }
];