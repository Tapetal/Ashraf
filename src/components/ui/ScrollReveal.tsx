'use client'
import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: string;
  repeat?: boolean;
  duration?: string;
  delay?: string; // 👈 Tailwind delay class
}

export default function ScrollReveal({
  children,
  animation = "animate-fadeInUp",
  repeat = false,
  duration = "duration-700",
  delay = "delay-0",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (repeat) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? `${animation} ${duration} ${delay}` : "opacity-0"} transition-all`}
    >
      {children}
    </div>
  );
}

