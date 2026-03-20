import { NavLink } from "react-router-dom";
import { CloudSun, Wind } from "lucide-react";
const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm">
            <div className="w-full mx-auto px-2 sm:px-6 md:px-10 h-16 flex items-center justify-between">
                <div className="flex items-center justify-between lg:gap-10 w-full">
                    <NavLink to="/" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <CloudSun className="w-6 h-6 text-white absolute transition-opacity duration-300 group-hover:opacity-0" />
                            <Wind className="w-6 h-6 text-white opacity-0 absolute transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="flex flex-col">
                            <span className="hidden sm:block text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-none">AuraWeather</span>
                        </div>
                    </NavLink>
                    
                    <div className="flex items-center gap-8">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => `text-sm font-bold transition-all hover:text-blue-600 relative py-1 ${isActive ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-gray-500'}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink 
                            to="/historical" 
                            className={({ isActive }) => `text-sm font-bold transition-all hover:text-blue-600 relative py-1 ${isActive ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-gray-500'}`}
                        >
                            Historical
                        </NavLink>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </nav>
    );
};
export default Navbar;