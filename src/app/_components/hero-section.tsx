'use client'

import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative h-full flex-1">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-500/10 to-blue-500/30" />
      <Image
        src="/assets/hero.jpg"
        alt="Healthcare professionals"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute bottom-10 left-10 z-20 max-w-md">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">
          Your health journey starts here
        </h2>
        <p className="mt-4 text-white drop-shadow-md">
          Join our patient portal for personalized care, easy appointment
          scheduling, and secure access to your medical records.
        </p>
      </div>
    </div>
  )
}