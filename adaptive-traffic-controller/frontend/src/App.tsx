import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Settings from './pages/Settings';
import VideoAnalysis from './pages/VideoAnalysis';
import { Activity, Info, Settings as SettingsIcon, Video } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-background">
        <nav className="w-16 md:w-64 bg-surface border-r border-slate-700 flex flex-col transition-all">
          <div className="p-4 hidden md:block">
            <h1 className="text-xl font-bold text-primary truncate">Adaptive AI Traffic</h1>
            <p className="text-xs text-slate-400">Simulation Prototype</p>
          </div>
          <div className="flex-1 mt-6">
            <NavItem to="/" icon={<Activity size={20} />} label="Dashboard" />
            <NavItem to="/video" icon={<Video size={20} />} label="Video Analysis" />
            <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
            <NavItem to="/about" icon={<Info size={20} />} label="About" />
          </div>
        </nav>
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoAnalysis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </Link>
  );
}

export default App;
