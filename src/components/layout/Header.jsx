import React, { useContext, useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

import CartDrawer from "../cart/CartDrawer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const navigation = [
  { name: "Ana Sayfa", href: "/", current: false },
  { name: "Koleksiyonlar", href: "/products", current: false },
  { name: "Yeni Gelenler", href: "/products?filter=new", current: false },
  { name: "Kampanyalar", href: "/sales", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll efekti
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active link kontrolü
  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Disclosure as="nav" className={classNames(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md" 
        : "bg-white border-b border-gray-200"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Mobil Menü Butonu */}
          <div className="flex items-center lg:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset transition-colors"
              style={{ '--tw-ring-color': 'var(--color-secondary)' }}
            >
              <span className="sr-only">Menüyü Aç</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center lg:justify-start">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <svg 
                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" 
                    style={{ color: 'var(--color-secondary)' }} 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                    <circle cx="12" cy="14" r="2" fill="currentColor"/>
                  </svg>
                  <div 
                    className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ background: 'var(--color-secondary)' }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-primary text-2xl font-bold text-gray-900 tracking-tight">
                    JEWELRY
                  </span>
                  <span className="text-xs tracking-widest text-gray-500 -mt-1">
                    SINCE 2024
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-12 lg:block">
              <div className="flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive(item.href)
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900",
                      "relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                    )}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <span 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full"
                        style={{ background: 'var(--color-secondary)' }}
                      />
                    )}
                    <span 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-200 group-hover:w-1/2"
                      style={{ background: 'var(--color-secondary)' }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => navigate("/search")}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              aria-label="Arama"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {!user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-gray-900 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
                  }}
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/favorites")}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 relative"
                  aria-label="Favoriler"
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 relative"
                  aria-label="Sepet"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-white text-xs font-bold rounded-full shadow-md"
                    style={{ background: 'var(--color-secondary)' }}
                  >
                    3
                  </span>
                </button>
                <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />

                <Menu as="div" className="relative">
                  <MenuButton className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110">
                    <span className="sr-only">Kullanıcı menüsü</span>
                    <UserIcon className="h-6 w-6" />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl border border-gray-100 focus:outline-none transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.username || 'Kullanıcı'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 transition-colors'
                            )}
                          >
                            <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                            Profilim
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/orders"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 transition-colors'
                            )}
                          >
                            <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Siparişlerim
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/favorites"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 transition-colors'
                            )}
                          >
                            <HeartIcon className="h-4 w-4 mr-3 text-gray-400" />
                            Favorilerim
                          </Link>
                        )}
                      </MenuItem>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-red-50' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors'
                            )}
                          >
                            <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Çıkış Yap
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="lg:hidden border-t border-gray-100 bg-white">
        <div className="space-y-1 px-4 py-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                isActive(item.href)
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "block rounded-lg px-3 py-2 text-base font-medium transition-colors"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          {!user ? (
            <div className="pt-4 pb-2 border-t border-gray-100 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-gray-900 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
                }}
              >
                Kayıt Ol
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100">
              <div className="px-3 py-2 mb-2">
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Profilim
              </Link>
              <Link
                to="/favorites"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Favorilerim
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Header;
