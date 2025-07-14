'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/enum/enum';
import { getPublicImageUrl } from '@/utils/getPublicImageUrl';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Auction', href: '/auction' },
  { label: 'Create Auction', href: '/auction/create' },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          QuickGear 2
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
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
                <span>{user.username || 'Profile'}</span>
                {user.role === Role.ADMIN && (
                  <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded">admin</span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-600">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
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
                  <Link
                    href="/profile"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2"
                  >
                    {user?.imgPath && (
                      <img
                        src={getPublicImageUrl(user?.imgPath)}
                        alt="avatar"
                        className="w-6 h-6 rounded-full object-cover border"
                      />
                    )}
                    <span>{user.username || 'Profile'}</span>
                    {user.role === Role.ADMIN && (
                      <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded">admin</span>
                    )}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
