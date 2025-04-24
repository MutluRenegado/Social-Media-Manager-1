"use client";

export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-blue-600 flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 inline-block mr-2 align-middle" />
          SocialBoost
        </div>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#pricing" className="hover:text-blue-600">Pricing</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Supercharge Your Social Media Presence
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Manage, schedule, analyze, and grow all your social media accounts from one powerful dashboard.
          </p>
          <a href="#get-started" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
            Get Started Free
          </a>
        </div>
        {/* Hero Banner Image */}
        <div className="mt-12">
          <img src="/banner.png" alt="Dashboard Preview" className="mx-auto max-w-full rounded-xl shadow-lg" />
        </div>
      </section>

      {/* Optional: Add more sections here */}
    </div>
  );
}
