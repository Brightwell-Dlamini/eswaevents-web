import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  CalendarIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { User } from '@/types/types';

const NAV_LINKS = [
  {
    name: 'Events',
    href: '/events',
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: 'Organizers',
    href: '/organizer',
    icon: <UserGroupIcon className="h-6 w-6" />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <InformationCircleIcon className="h-6 w-6" />,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <PhoneIcon className="h-6 w-6" />,
  },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ss', name: 'Siswati', flag: '🇸🇿' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

const MobileMenu = ({
  isOpen,
  onClose,
  user,
  unreadNotifs,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  unreadNotifs: number;
  onLogout: () => void;
}) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = mounted
    ? theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
    : 'light';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-8">
              <nav className="space-y-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium ${
                        pathname === link.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      } transition-all duration-200`}
                      onClick={onClose}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                        {link.icon}
                      </div>
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-12 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between px-4 py-3 mb-6">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-3">
                    {currentTheme === 'dark' ? (
                      <MoonIcon className="h-5 w-5" />
                    ) : (
                      <SunIcon className="h-5 w-5" />
                    )}
                    <span>Dark Mode</span>
                  </span>
                  <button
                    onClick={() =>
                      setTheme(currentTheme === 'dark' ? 'light' : 'dark')
                    }
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                    aria-label="Toggle dark mode"
                  >
                    <span
                      className={`${
                        currentTheme === 'dark'
                          ? 'translate-x-6 bg-blue-500'
                          : 'translate-x-1 bg-yellow-500'
                      } inline-block h-4 w-4 transform rounded-full transition-all duration-200`}
                    />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      className="block w-full bg-transparent text-gray-900 dark:text-white"
                      aria-label="Select language"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/notifications"
                        className="flex items-center justify-between px-4 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        onClick={onClose}
                      >
                        <div className="flex items-center space-x-3">
                          <BellIcon className="h-5 w-5" />
                          <span>Notifications</span>
                        </div>
                        {unreadNotifs > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadNotifs}
                          </span>
                        )}
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link
                        href="/profile"
                        className="flex items-center justify-center space-x-3 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        onClick={onClose}
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <button
                        onClick={onLogout}
                        className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/auth/login"
                        className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                        onClick={onClose}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Link
                        href="/auth/register"
                        className="flex items-center justify-center space-x-3 w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        onClick={onClose}
                      >
                        <UserPlusIcon className="h-5 w-5" />
                        <span>Create Account</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
