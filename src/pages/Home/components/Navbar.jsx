import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Calendar, LogOut, ChevronDown, ArrowRight } from "lucide-react";

export const Navbar = ({ user, onLogout, onOpenAuthPrompt }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[#FAF7EF]/95 backdrop-blur-md shadow-[0_1px_0_rgba(24,30,25,0.08)] py-3.5"
                    : "bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
                {/* Brand / Logo */}
                <Link to="/" className="flex items-center gap-3 group focus:outline-none shrink-0" aria-label="Atlantis home">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border font-serif text-2xl leading-none tracking-[0.08em] shadow-sm transition-all duration-300 ${
                            scrolled
                                ? "border-[#386641]/20 bg-[#FAF7EF] text-[#1B2A1B]"
                                : "border-white/40 bg-[#F5F0E6]/90 text-[#1B2A1B] group-hover:bg-white"
                        }`}
                    >
                        A
                    </div>

                    <div className="flex flex-col leading-none">
                        <span
                            className={`font-serif text-[1.05rem] sm:text-[1.35rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                                scrolled ? "text-[#161A17]" : "text-white"
                            }`}
                        >
                            Atlantis
                        </span>
                        <span
                            className={`mt-1 text-[7px] sm:text-[8px] uppercase tracking-[0.28em] font-medium transition-colors duration-300 ${
                                scrolled ? "text-[#386641]" : "text-white/75"
                            }`}
                        >
                            Clifton • Karachi
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-[0.14em] font-medium">
                    <Link
                        to="/suites"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Suites
                    </Link>
                    <Link
                        to="/story"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Story
                    </Link>
                    <Link
                        to="/amenities"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Amenities
                    </Link>
                    <Link
                        to="/experience"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Experience
                    </Link>
                    <Link
                        to="/gallery"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Gallery
                    </Link>
                    <Link
                        to="/reviews"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        Reviews
                    </Link>
                    <Link
                        to="/faq"
                        className={`transition-colors duration-200 hover:text-[#6A994E] ${
                            scrolled ? "text-neutral-700" : "text-white/90"
                        }`}
                    >
                        FAQ
                    </Link>
                </nav>

                {/* Right Actions: Auth or Guest Menu + Book CTA */}
                <div className="hidden lg:flex items-center gap-5">
                    {user?.name ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium py-1.5 px-3 rounded transition-colors ${
                                    scrolled
                                        ? "text-neutral-800 hover:bg-neutral-200/50"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                <span className="w-6 h-6 rounded-full bg-[#386641] text-[#F2E8CF] text-[10px] flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <span>{user.name.split(" ")[0]}</span>
                                <ChevronDown size={14} className="opacity-70" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-[#FAF7EF] text-neutral-900 border border-neutral-300/70 shadow-xl rounded-sm py-2 z-50 text-xs">
                                    <div className="px-4 py-2 border-b border-neutral-200">
                                        <p className="font-semibold text-neutral-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/mybookings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#386641]/10 text-neutral-800 transition-colors"
                                    >
                                        <Calendar size={14} className="text-[#386641]" />
                                        <span>My Reservations</span>
                                    </Link>
                                    <Link
                                        to="/my-profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#386641]/10 text-neutral-800 transition-colors"
                                    >
                                        <User size={14} className="text-[#386641]" />
                                        <span>Guest Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            onLogout();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-700 transition-colors border-t border-neutral-200 mt-1"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors hover:text-[#6A994E] ${
                                scrolled ? "text-neutral-800" : "text-white"
                            }`}
                        >
                            Sign In
                        </Link>
                    )}

                    <button
                        onClick={() => scrollToSection("rooms")}
                        className={`text-xs uppercase tracking-[0.16em] font-semibold px-6 py-2.5 transition-all duration-300 ${
                            scrolled
                                ? "bg-[#386641] text-white hover:bg-[#2a4e32]"
                                : "bg-[#F2E8CF] text-[#161A17] hover:bg-white"
                        }`}
                    >
                        Book Stay
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                    className={`lg:hidden p-2 transition-colors ${
                        scrolled ? "text-neutral-900" : "text-white"
                    }`}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden bg-[#FAF7EF] border-b border-neutral-200 px-6 py-8 shadow-2xl animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-5 text-sm uppercase tracking-[0.18em] font-medium text-neutral-800">
                        <Link
                            to="/suites"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            Suites & Rooms
                        </Link>
                        <Link
                            to="/story"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            Our Story
                        </Link>
                        <Link
                            to="/amenities"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            Facilities
                        </Link>
                        <Link
                            to="/experience"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            The Experience
                        </Link>
                        <Link
                            to="/gallery"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            Gallery
                        </Link>
                        <Link
                            to="/reviews"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            Guest Reviews
                        </Link>
                        <Link
                            to="/faq"
                            onClick={() => setMobileOpen(false)}
                            className="text-left py-1 hover:text-[#386641]"
                        >
                            FAQ
                        </Link>

                        <div className="pt-4 border-t border-neutral-300 flex flex-col gap-3">
                            {user?.name ? (
                                <>
                                    <div className="text-xs tracking-normal text-neutral-600">
                                        Signed in as <strong className="text-neutral-900">{user.name}</strong>
                                    </div>
                                    <Link
                                        to="/mybookings"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-xs uppercase tracking-[0.14em] text-[#386641] font-semibold"
                                    >
                                        My Reservations
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileOpen(false);
                                            onLogout();
                                        }}
                                        className="text-left text-xs uppercase tracking-[0.14em] text-red-700 font-semibold"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xs uppercase tracking-[0.14em] text-[#386641] font-semibold"
                                >
                                    Sign In / Register
                                </Link>
                            )}

                            <button
                                onClick={() => scrollToSection("rooms")}
                                className="w-full mt-2 bg-[#386641] text-white py-3 text-xs uppercase tracking-[0.18em] font-semibold text-center"
                            >
                                Book Your Stay
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
