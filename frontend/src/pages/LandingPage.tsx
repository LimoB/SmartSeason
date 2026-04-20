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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <div className="pt-16">
        {/* ================= HERO SECTION ================= */}
        <section className="relative w-full h-screen overflow-hidden">
          
          <div className="relative w-full h-full group">
            
            {/* HERO IMAGE (FIXED HERE) */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=2000"
                alt="Kenyan Farmer"
                className="w-full h-full object-cover object-[50%_35%]"
              />

              {/* Slightly softer overlay so subject is visible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"></div>
            </div>

            {/* HERO TEXT CONTENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white">
              
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sprout size={18} className="text-green-400" />
                Next-Gen Kenyan Agriculture
              </span>

              <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter">
                Digital Monitoring for <br />
                <span className="text-green-400">
                  Productive Harvests
                </span>
              </h1>

              <p className="mt-8 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Optimize your maize and bean production with real-time field data. 
                Built specifically for scale, sustainability, and the modern Kenyan farmer.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                <a
                  href="/register"
                  className="bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
                >
                  Get Started Free <ChevronRight size={24} />
                </a>
                <a
                  href="/login"
                  className="px-10 py-5 rounded-2xl border-2 border-white/40 font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Sign In
                </a>
              </div>
            </div>

            {/* Floating Status UI */}
            <div className="absolute top-12 right-12 p-5 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hidden lg:block text-white">
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
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="px-6 py-24 bg-light-card/50 dark:bg-dark-surface/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold mb-4">Core Platform Features</h2>
              <div className="w-24 h-2 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Field Tracking",
                  desc: "Comprehensive monitoring for maize and bean growth stages with granular data points.",
                  icon: <Map className="text-green-500" size={36} />,
                },
                {
                  title: "Agent Management",
                  desc: "Seamlessly coordinate field agents, assign tasks, and track locations in real time.",
                  icon: <Users className="text-green-500" size={36} />,
                },
                {
                  title: "Yield Analytics",
                  desc: "Powerful data visualization to help you predict harvest volume and optimize inputs.",
                  icon: <BarChart3 className="text-green-500" size={36} />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-dark-surface p-10 rounded-[2.5rem] border border-light-border dark:border-dark-border hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl shadow-sm"
                >
                  <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-light-muted dark:text-dark-muted text-lg leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Operational Flow</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { name: "Digital Mapping", icon: <Map size={24}/>, step: "01" },
                { name: "Agent Setup", icon: <UserPlus size={24}/>, step: "02" },
                { name: "Live Monitoring", icon: <Activity size={24}/>, step: "03" },
                { name: "Data Insight", icon: <PieChart size={24}/>, step: "04" },
              ].map((item, i) => (
                <div key={i} className="relative group text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-dark-surface border border-light-border dark:border-dark-border flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <p className="font-bold text-lg">{item.name}</p>
                    <span className="text-sm font-bold text-primary-500/40 mt-1 uppercase tracking-widest">
                      Phase {item.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="py-24 px-6 bg-primary-600">
          <div className="max-w-4xl mx-auto bg-white dark:bg-dark-bg p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Connect with Our Experts</h2>
              <p className="text-light-muted">Schedule a demo or ask how we can support your specific crop needs.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-dark-surface border border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-dark-surface border border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
              <textarea
                placeholder="Tell us about your farm operations..."
                rows={4}
                className="w-full md:col-span-2 p-4 rounded-xl bg-gray-50 dark:bg-dark-surface border border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
              <button className="md:col-span-2 bg-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg active:scale-95">
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-12 px-6 border-t border-light-border dark:border-dark-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-xl font-bold text-primary-500">
              <Sprout />
              <span>SmartSeason</span>
            </div>
            <p className="text-light-muted dark:text-dark-muted text-sm">
              © {new Date().getFullYear()} SmartSeason. Digitizing agriculture in Kenya.
            </p>
            <div className="flex gap-8 text-sm font-semibold">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}