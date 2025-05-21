import HeroSection from './_components/hero-section'
import RegisterPatientForm from './_components/register-patient-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <div className="h-screen w-full overflow-auto lg:w-1/2">
        <RegisterPatientForm />
      </div>
      <div className="h-screen w-full lg:w-1/2">
        <HeroSection />
      </div>
    </main>
  )
}
