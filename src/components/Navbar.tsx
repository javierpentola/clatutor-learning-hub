
import { Home, Info, Headset } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Index</span>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
            >
              <Info className="w-5 h-5 mr-2" />
              <span>About Us</span>
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
            >
              <Headset className="w-5 h-5 mr-2" />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
