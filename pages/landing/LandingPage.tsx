
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckSquare, Sparkles, Star, Menu, X, UserPlus, Target, TrendingUp, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/signup');
    }
  };

  const handleSignIn = () => {
      navigate('/login');
  };

  const navigation = [
    { name: 'Features', href: '#features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'How it Works', href: '#how-it-works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Reviews', href: '#reviews', action: () => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  const steps = [
    {
      id: "01",
      title: "Create Your Profile",
      description: "Sign up in seconds and customize your dashboard.",
      icon: <UserPlus size={24} className="text-white" />,
    },
    {
      id: "02",
      title: "Set Spiritual Goals",
      description: "Choose habits like 'Read Surah Kahf on Friday'.",
      icon: <Target size={24} className="text-white" />,
    },
    {
      id: "03",
      title: "Track & Reflect",
      description: "Log daily activities and watch your Iman grow.",
      icon: <TrendingUp size={24} className="text-white" />,
    }
  ];

  return (
    <div className="bg-white font-sans text-slate-900">
      
      {/* --- NEW HERO SECTION --- */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Quraan & Habits</span>
              <div className="w-8 h-8 bg-digri-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-digri-500/30">
                  <BookOpen size={18} />
              </div>
              <span className="text-lg font-bold text-slate-900">Quraan<span className="text-digri-600">&</span>Habits</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:bg-slate-50"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => { e.preventDefault(); item.action(); }}
                className="text-sm font-semibold leading-6 text-slate-900 hover:text-digri-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
                <button onClick={() => navigate('/app')} className="text-sm font-semibold leading-6 text-slate-900 hover:text-digri-600 flex items-center gap-1">
                    Dashboard <span aria-hidden="true">&rarr;</span>
                </button>
            ) : (
                <div className="flex gap-4">
                     <button onClick={handleSignIn} className="text-sm font-semibold leading-6 text-slate-900 hover:text-digri-600">
                        Log in
                    </button>
                    <button onClick={handleGetStarted} className="text-sm font-bold leading-6 text-digri-600 border border-digri-100 rounded-full px-4 py-1 hover:bg-digri-50">
                        Sign up
                    </button>
                </div>
            )}
          </div>
        </nav>
        
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10 shadow-2xl">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                  <span className="sr-only">Quraan & Habits</span>
                  <div className="w-8 h-8 bg-digri-600 rounded-lg flex items-center justify-center text-white">
                      <BookOpen size={18} />
                  </div>
                  <span className="text-lg font-bold text-slate-900">Quraan<span className="text-digri-600">&</span>Habits</span>
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <span className="sr-only">Close menu</span>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-slate-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setMobileMenuOpen(false);
                            item.action(); 
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                        <button
                        onClick={() => navigate('/app')}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 w-full text-left"
                        >
                        Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                            onClick={handleSignIn}
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 w-full text-left"
                            >
                            Log in
                            </button>
                             <button
                            onClick={handleGetStarted}
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-bold leading-7 text-digri-600 hover:bg-digri-50 w-full text-left"
                            >
                            Sign Up
                            </button>
                        </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20 bg-white/50 backdrop-blur-sm">
              New: Track your daily Dhikr streaks.{' '}
              <a href="#" onClick={(e) => {e.preventDefault(); handleGetStarted()}} className="font-semibold text-digri-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Try it now <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Focus on your <br className="hidden sm:block"/>
              <span className="text-digri-600">Deen & Dunya</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              A comprehensive Islamic lifestyle app. Organize your habits, track Quran reading, and manage your Duco & Dhikr efficiently in one serene space.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-full bg-digri-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-digri-500/30 hover:bg-digri-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-digri-600 transition-all hover:scale-105 active:scale-95"
              >
                {user ? 'Go to App' : 'Get started'}
              </button>
              <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-semibold leading-6 text-slate-900 hover:text-digri-600">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 px-6 relative bg-white">
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
              <span className="text-digri-600 font-bold uppercase tracking-widest text-xs">Powerful Tools</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Everything you need to grow</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-digri-200 hover:-translate-y-1 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-digri-500 mb-6 group-hover:bg-digri-500 group-hover:text-white transition-colors shadow-sm">
                    <BookOpen size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-3">Quran Tracking</h3>
                 <p className="text-slate-500 leading-relaxed">
                   Set reading goals, track pages or ayahs, and read comfortably with our dedicated Mushaf mode.
                 </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-digri-200 hover:-translate-y-1 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-digri-500 mb-6 group-hover:bg-digri-500 group-hover:text-white transition-colors shadow-sm">
                    <CheckSquare size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-3">Habit Builder</h3>
                 <p className="text-slate-500 leading-relaxed">
                   Create custom habits, set durations, and build streaks. Visualize your progress day by day.
                 </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-digri-200 hover:-translate-y-1 transition-all duration-300 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-digri-500 mb-6 group-hover:bg-digri-500 group-hover:text-white transition-colors shadow-sm">
                    <Sparkles size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-3">Duco & Dhikr</h3>
                 <p className="text-slate-500 leading-relaxed">
                   Digital Tasbih counters and Duco logging. Keep track of your daily Adhkar effortlessly.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-digri-50 relative overflow-hidden">
        {/* Decorative patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-digri-400 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 right-0 w-64 h-64 bg-digri-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content - Text */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Simple Path to <br />
                <span className="text-digri-600">Consistency</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We've stripped away the complexity. Focus on what matters: your connection with the Creator.
              </p>

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-digri-600 flex items-center justify-center shadow-lg shadow-digri-200">
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Visual Mockup */}
            <div className="lg:w-1/2 w-full">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-2xl bg-white shadow-2xl p-6 md:p-8 border border-gray-100"
              >
                {/* Fake App Interface */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-sm text-gray-400">Daily Verse</p>
                      <h5 className="font-bold text-gray-800">Al-Baqarah, 2:152</h5>
                    </div>
                    <div className="w-10 h-10 bg-digri-100 rounded-full flex items-center justify-center text-digri-600">
                      <span className="font-bold text-sm">28</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <p className="font-arabic text-2xl md:text-3xl text-gray-800 leading-loose mb-4">
                      فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ
                    </p>
                    <p className="text-gray-600 italic font-light">
                      "So remember Me; I will remember you. And be grateful to Me and do not deny Me."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-gray-100 hover:border-digri-200 transition-colors cursor-pointer group">
                      <p className="text-sm text-gray-400 mb-1">Morning Adhkar</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">12/24</span>
                        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-yellow-400 h-full w-1/2"></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 hover:border-digri-200 transition-colors cursor-pointer group">
                      <p className="text-sm text-gray-400 mb-1">Prayer Streak</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">14 Days</span>
                        <div className="w-4 h-4 rounded-full bg-digri-500"></div>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-digri-500 h-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-digri-200 rounded-2xl opacity-20 transform rotate-3"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Modernized) --- */}
      <section id="reviews" className="relative isolate bg-white py-24 sm:py-32">
        <div
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true"
        >
            <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
                clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-digri-600">Community Feedback</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Loved by thousands of users
            </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {[
                 { name: "Ahmed S.", role: "Student", text: "This app helped me finish the Quran during Ramadan for the first time. The pacing feature is a lifesaver." },
                 { name: "Fatima K.", role: "Designer", text: "I love the clean design. Most Islamic apps are cluttered, but this one is so peaceful and easy to use." },
                 { name: "Yusuf M.", role: "Developer", text: "The habit tracker is flexible and the Dhikr counter is perfect for my morning commute. Highly recommended." }
               ].map((review, i) => (
                <div key={i} className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                    <figure className="h-full flex flex-col justify-between">
                        <blockquote className="text-gray-900">
                            <Quote className="text-digri-300 mb-4 h-8 w-8" />
                            <p className="italic">“{review.text}”</p>
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-x-4">
                            <div className="h-10 w-10 rounded-full bg-digri-50 flex items-center justify-center font-bold text-digri-600 text-xs">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold">{review.name}</div>
                                <div className="text-gray-600">{review.role}</div>
                            </div>
                        </figcaption>
                    </figure>
                </div>
               ))}
            </div>
        </div>
      </section>

      {/* --- CTA (Modernized) --- */}
      <div className="relative isolate px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
         <div className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
            <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
            />
         </div>
         <div className="mx-auto max-w-2xl text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to start your journey?
              <br />
              <span className="text-digri-600">Join Quraan & Habits today.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
               Build lasting habits, track your spiritual progress, and find peace in your daily routine. Free to start, priceless for your soul.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-full bg-digri-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-digri-500/30 hover:bg-digri-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-digri-600 transition-all hover:scale-105 active:scale-95"
              >
                {user ? 'Go to App' : 'Get started'}
              </button>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-digri-600">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
         </div>
      </div>

      {/* --- FOOTER (Modernized) --- */}
      <footer className="relative bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
            <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                <a href="#" className="text-sm leading-6 text-gray-600 hover:text-digri-600 block sm:inline mb-6 sm:mb-0">About</a>
                <a href="#" className="text-sm leading-6 text-gray-600 hover:text-digri-600 block sm:inline mb-6 sm:mb-0">Blog</a>
                <a href="#" className="text-sm leading-6 text-gray-600 hover:text-digri-600 block sm:inline mb-6 sm:mb-0">Privacy</a>
                <a href="#" className="text-sm leading-6 text-gray-600 hover:text-digri-600 block sm:inline mb-6 sm:mb-0">Contact</a>
            </nav>
            <div className="mt-10 flex justify-center space-x-10">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-digri-100 rounded flex items-center justify-center text-digri-600">
                        <BookOpen size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-900">Quraan<span className="text-digri-600">&</span>Habits</span>
                </div>
            </div>
            <p className="mt-10 text-center text-xs leading-5 text-gray-500">
                &copy; {new Date().getFullYear()} Quraan & Habits. All rights reserved.
            </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
