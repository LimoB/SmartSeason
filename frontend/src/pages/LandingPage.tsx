import Navbar from "../layouts/Navbar";
import { 
  Sprout, 
  Users, 
  BarChart3, 
  ChevronRight, 
  Map, 
  UserPlus, 
  Activity, 
  PieChart 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <div className="pt-16">
        {/* ================= HERO SECTION ================= */}
        <section id="home" className="relative w-full min-h-[90vh] md:h-screen overflow-hidden flex items-center">
          
          <div className="absolute inset-0 w-full h-full">
            {/* HERO IMAGE with improved object positioning */}
            <img
              src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=2000"
              alt="Kenyan Farmer"
              className="w-full h-full object-cover object-center lg:object-[50%_35%]"
            />
            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 lg:to-black/60"></div>
          </div>

          {/* HERO TEXT CONTENT */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-0 text-center lg:text-left text-white">
            
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 text-xs md:text-sm font-semibold bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fade-in">
              <Sprout size={16} className="text-green-400" />
              Next-Gen Kenyan Agriculture
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-6">
              Digital Monitoring for <br className="hidden md:block" />
              <span className="text-green-400">Productive Harvests</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl lg:mx-0 mx-auto leading-relaxed mb-10">
              Optimize your maize and bean production with real-time field data. 
              Built specifically for scale, sustainability, and the modern Kenyan farmer.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6 w-full">
              <Link
                to="/register"
                className="bg-green-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl hover:bg-green-600 transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
              >
                Get Started Free <ChevronRight size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 md:px-10 py-4 md:py-5 rounded-2xl border-2 border-white/40 font-bold text-lg md:text-xl hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Floating Status UI - Hidden on small screens, adjusted for tablets */}
          <div className="absolute bottom-10 right-10 p-5 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hidden xl:block text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <Activity size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Field Health</p>
                <p className="text-xl font-extrabold">Optimal Condition</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="services" className="px-6 py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Core Platform Features</h2>
              <div className="w-20 h-2 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  title: "Field Tracking",
                  desc: "Comprehensive monitoring for maize and bean growth stages with granular data points.",
                  icon: <Map className="text-green-500" size={32} />,
                },
                {
                  title: "Agent Management",
                  desc: "Seamlessly coordinate field agents, assign tasks, and track locations in real time.",
                  icon: <Users className="text-green-500" size={32} />,
                },
                {
                  title: "Yield Analytics",
                  desc: "Powerful data visualization to help you predict harvest volume and optimize inputs.",
                  icon: <BarChart3 className="text-green-500" size={32} />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="mb-6 md:mb-8 p-4 bg-green-50 dark:bg-green-900/20 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="about" className="py-20 md:py-32 px-6 bg-white dark:bg-dark-bg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Operational Flow</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
              {[
                { name: "Digital Mapping", icon: <Map size={24}/>, step: "01" },
                { name: "Agent Setup", icon: <UserPlus size={24}/>, step: "02" },
                { name: "Live Monitoring", icon: <Activity size={24}/>, step: "03" },
                { name: "Data Insight", icon: <PieChart size={24}/>, step: "04" },
              ].map((item, i) => (
                <div key={i} className="relative group text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    <p className="font-bold text-base md:text-lg px-2">{item.name}</p>
                    <span className="text-[10px] md:text-xs font-bold text-green-600/60 mt-2 uppercase tracking-[0.2em]">
                      Phase {item.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact" className="py-20 px-4 md:px-6 bg-green-600 dark:bg-green-700">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Connect with Our Experts</h2>
              <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400">Schedule a demo or ask how we can support your specific crop needs.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white text-base"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white text-base"
              />
              <textarea
                placeholder="Tell us about your farm operations..."
                rows={4}
                className="w-full md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition dark:text-white text-base"
              />
              <button 
                type="button" 
                className="md:col-span-2 bg-green-600 text-white py-4 md:py-5 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg active:scale-95"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-green-600">
              <Sprout />
              <span>SmartSeason</span>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center order-3 md:order-2">
              © {new Date().getFullYear()} SmartSeason. Digitizing agriculture in Kenya.
            </p>

            <div className="flex gap-6 md:gap-8 text-sm font-semibold order-2 md:order-3">
              <Link to="/" className="hover:text-green-500 transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-green-500 transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}