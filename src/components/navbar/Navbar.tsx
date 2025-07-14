'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { getPublicImageUrl } from '@/utils/getPublicImageUrl';
import { Role } from '@/enum/enum';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Auction', href: '/auction' },
  { label: 'Create Auction', href: '/auction/create' },
];

const adminDropdownItems = [
  { label: 'User Management', href: '/admin/users' },
  { label: 'Product Management', href: '/admin/products' },
  { label: 'Auction Management', href: '/admin/auctions' },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          QuickGear 2
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center relative">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-blue-600 ${
                pathname === item.href ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === Role.ADMIN && (
            <div className="relative">
              <button
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                Admin Panel <ChevronDown size={16} />
              </button>

              {adminDropdownOpen && (
                <div className="absolute top-8 right-0 w-48 bg-white border rounded shadow z-50">
                  {adminDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!user ? (
            <>
              <Link href="/auth/sign-in" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/auth/register" className="text-gray-700 hover:text-blue-600">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                {user?.imgPath && (
                  <img
                    src={getPublicImageUrl(user?.imgPath)}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover border"
                  />
                )}
                <span>{user.username|| 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar (Framer Motion) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-4 space-y-4"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-blue-600">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`hover:text-blue-600 ${
                      pathname === item.href ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {user?.role === Role.ADMIN && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold text-red-500 mb-1">Admin Panel</p>
                    {adminDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="pl-3 py-1 text-gray-700 hover:text-blue-600 block"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                {!user ? (
                  <>
                    <Link href="/auth/sign-in" onClick={() => setSidebarOpen(false)}>
                      Login
                    </Link>
                    <Link href="/auth/register" onClick={() => setSidebarOpen(false)}>
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" onClick={() => setSidebarOpen(false)}>
                      {user.username || 'Profile'}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                      className="text-left text-red-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
