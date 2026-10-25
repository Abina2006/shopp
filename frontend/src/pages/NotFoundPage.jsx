import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-3">
      <div className="text-6xl font-extrabold text-[#2563EB]">404</div>
      <h2 className="text-xl font-bold text-white">Page Not Found</h2>
      <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-3 pt-2">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" /> Go to Home
        </Link>
        <Link to="/search?q=all" className="btn-secondary">
          <Search className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  );
}
