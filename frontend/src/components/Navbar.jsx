import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Grid, Bell, User, Menu, X, Sparkles, Wallet, LogIn, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, requireAuth, openAuthModal } = useAuth();
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!requireAuth(null, {
      title: 'Sign In to Search Products',
      message: 'Please sign in or create an account to search products, compare prices across 8+ platforms, and view verified deals.'
    })) {
      return;
    }
    if (searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()));
      setMobileOpen(false);
    }
  };

  const handleSearchTouch = () => {
    if (!isAuthenticated) {
      openAuthModal({
        title: 'Sign In to Search Products',
        message: 'Please sign in or create an account to search products, compare prices across 8+ platforms, and view verified deals.'
      });
    }
  };

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data?.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const markRead = async (id) => {
    try {
      await api.patch('/notifications/' + id + '/read');
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const handleNavClick = (path, label) => {
    requireAuth(() => navigate(path), {
      title: `Sign In to Access ${label}`,
      message: `Please sign in or create an account to use ${label} and view live prices.`
    });
    setMobileOpen(false);
  };

  const notifTypeColor = (t) => t === 'GREAT_DEAL' ? 'bg-green-100 text-green-800' : t === 'PRICE_DROP' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800';
  const notifIcon = (t) => t === 'GREAT_DEAL' ? '🏆' : t === 'PRICE_DROP' ? '📉' : '🏷️';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-[#111111] group-hover:bg-[#2A2A2A] rounded-[10px] flex items-center justify-center transition-colors shadow-sm">
              <Sparkles className="w-4 h-4 text-[#3FA66B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#111111] tracking-tight leading-none">SHOPWISE <span className="text-[#3FA66B]">AI</span></span>
              <span className="text-[10px] text-[#6B7280] tracking-wider uppercase font-semibold leading-tight">Compare Smarter</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onFocus={handleSearchTouch}
                onClick={handleSearchTouch}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleSearchTouch();
                    return;
                  }
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search products, brands, groceries, electronics..."
                className="w-full pl-10 pr-20 py-2 bg-[#FAFAF7] border border-[#E5E7EB] rounded-[10px] text-sm text-[#111111] placeholder:text-[#6B7280] focus:outline-none focus:bg-white focus:border-[#3FA66B] transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#111111] hover:bg-[#2A2A2A] text-white text-xs font-semibold rounded-[6px] transition-colors">Search</button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-1.5">
            <NavLink onClick={() => handleNavClick('/categories', 'Categories')} active={isActive('/categories')} icon={<Grid className="w-4 h-4" />} label="Categories" />
            <NavLink onClick={() => handleNavClick('/ai-assistant', 'AI Advisor')} active={isActive('/ai-assistant')} icon={<Sparkles className="w-4 h-4 text-[#3FA66B]" />} label="AI Advisor" />
            <NavLink onClick={() => handleNavClick('/budget', 'Budget Guard')} active={isActive('/budget')} icon={<Wallet className="w-4 h-4 text-[#3FA66B]" />} label="Budget" />
            <NavLink onClick={() => handleNavClick('/wishlist', 'Wishlist')} active={isActive('/wishlist')} icon={<Heart className="w-4 h-4 text-[#E8798F]" />} label="Wishlist" />
            <NavLink to="/cart" active={isActive('/cart')} icon={<ShoppingCart className="w-4 h-4 text-[#111111]" />} label="Cart" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-[8px] hover:bg-[#FAFAF7] border border-transparent hover:border-[#E5E7EB] transition-all">
                  <Bell className="w-4 h-4 text-[#6B7280]" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-[16px] shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                      <h3 className="text-sm font-bold text-[#111111]">Notifications</h3>
                      {unreadCount > 0 && <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] text-[#3FA66B] font-semibold"><CheckCheck className="w-3 h-3" /> Mark all read</button>}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#F3F4F6]">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-[#9CA3AF]">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-[#E5E7EB]" />
                          No notifications yet. Add products to wishlist to track prices!
                        </div>
                      ) : notifications.map(n => (
                        <div key={n.id} onClick={() => markRead(n.id)} className={`px-4 py-3 cursor-pointer hover:bg-[#FAFAF7] transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{notifIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase ${notifTypeColor(n.type)}`}>{n.type?.replace('_', ' ')}</span>
                                {!n.isRead && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                              </div>
                              <p className="text-xs font-semibold text-[#111111] leading-snug">{n.title}</p>
                              <p className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">{n.message}</p>
                              <p className="text-[10px] text-[#9CA3AF] mt-1">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAF7] border border-[#E5E7EB] hover:border-[#3FA66B] transition-colors">
                  <div className="w-6 h-6 bg-[#111111] rounded-full flex items-center justify-center text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span className="text-xs font-semibold text-[#111111] max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="p-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors font-medium">Sign Out</button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-1.5 px-4 text-xs"><LogIn className="w-3.5 h-3.5" />Sign In</Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-[#111111] hover:bg-[#FAFAF7]">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-[#E5E7EB] space-y-2 animate-fade-in bg-white">
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={handleSearchTouch}
                  onClick={handleSearchTouch}
                  onChange={(e) => {
                    if (!isAuthenticated) {
                      handleSearchTouch();
                      return;
                    }
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search products..."
                  className="input-clean pl-9 pr-4 py-2"
                />
              </div>
            </form>
            <MobileNavLink to="/" icon={<Search className="w-4 h-4" />} label="Home" active={location.pathname === '/'} />
            <MobileNavLink onClick={() => handleNavClick('/categories', 'Categories')} icon={<Grid className="w-4 h-4" />} label="Categories" active={isActive('/categories')} />
            <MobileNavLink onClick={() => handleNavClick('/ai-assistant', 'AI Advisor')} icon={<Sparkles className="w-4 h-4 text-[#3FA66B]" />} label="AI Advisor" active={isActive('/ai-assistant')} />
            <MobileNavLink onClick={() => handleNavClick('/budget', 'Budget Guard')} icon={<Wallet className="w-4 h-4 text-[#3FA66B]" />} label="Budget Guard" active={isActive('/budget')} />
            <MobileNavLink onClick={() => handleNavClick('/wishlist', 'Wishlist')} icon={<Heart className="w-4 h-4 text-[#E8798F]" />} label="Wishlist" active={isActive('/wishlist')} />
            <MobileNavLink to="/cart" icon={<ShoppingCart className="w-4 h-4" />} label="Cart" active={isActive('/cart')} />
            {isAuthenticated ? (<><MobileNavLink to="/profile" icon={<User className="w-4 h-4" />} label="Profile" active={isActive('/profile')} /><button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-[#FAFAF7] rounded-lg transition-colors font-medium">Sign Out</button></>) : (<MobileNavLink to="/login" icon={<LogIn className="w-4 h-4" />} label="Sign In / Register" active={isActive('/login')} />)}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, label, onClick }) {
  if (onClick) {
    return (
      <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${active ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:bg-[#FAFAF7] hover:text-[#111111]'}`}>
        {icon}<span>{label}</span>
      </button>
    );
  }
  return (<Link to={to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${active ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:bg-[#FAFAF7] hover:text-[#111111]'}`}>{icon}<span>{label}</span></Link>);
}

function MobileNavLink({ to, icon, label, active, onClick }) {
  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${active ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:bg-[#FAFAF7] hover:text-[#111111]'}`}>
        {icon}<span>{label}</span>
      </button>
    );
  }
  return (<Link to={to} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${active ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:bg-[#FAFAF7] hover:text-[#111111]'}`}>{icon}<span>{label}</span></Link>);
}
