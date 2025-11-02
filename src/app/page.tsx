import HeroSection from '@/components/HeroSection'
import Project from "@/components/Project"
import Experience from "@/components/Experience"
import Footer from "@/components/Footer"
import Aboutme from '@/components/Aboutme'

export default function Home() {
  return (
    <>
      <div className='justify-center mx-auto gradient-bg min-h-screen'>
        <HeroSection />
        <Project />
        <Experience />
        <div className='bg-white'>
          <Aboutme />
          <Footer />
        </div>
      </div>
    </>
  )
}