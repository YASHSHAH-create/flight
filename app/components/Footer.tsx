
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn, MdVerifiedUser } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="relative bg-[#020617] text-slate-300 pt-20 pb-10 border-t border-slate-800 overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group select-none mb-6">
                            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-sm ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md bg-white">
                                <Image
                                    src="/paymm.png"
                                    alt="Paymm Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors leading-none pb-1">
                                Paymm
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Experience the future of travel booking. Seamless flights, secure payments, and 24/7 support for your journey.
                        </p>
                        <div className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                            <MdVerifiedUser className="text-emerald-400 text-xl mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">PAYMM ADVISORY PRIVATE LIMITED</p>
                                <p className="text-sm font-medium text-slate-200 tracking-wider font-mono mt-1">GST: 10AAMCP7167L1Z1</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                            Explore
                            <span className="ml-2 w-12 h-0.5 bg-blue-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {['About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase()}`}
                                        className="text-slate-400 hover:text-blue-400 transition-colors flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 group-hover:bg-blue-400 transition-colors"></span>
                                        {item} Us
                                    </Link>
                                </li>
                            ))}
                            {/* Add more links if present in the app */}
                            <li>
                                <Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 group-hover:bg-blue-400 transition-colors"></span>
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                            Legal
                            <span className="ml-2 w-12 h-0.5 bg-purple-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Terms of Use', href: '/terms' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Refund Policy', href: '/refund' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-purple-400 transition-colors flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 group-hover:bg-purple-400 transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                            Get in Touch
                            <span className="ml-2 w-12 h-0.5 bg-emerald-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start space-x-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                                    <MdEmail />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email Support</p>
                                    <a href="mailto:support@paymm.in" className="text-slate-200 hover:text-white transition-colors text-sm">support@paymm.in</a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                                    <MdPhone />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Helpline</p>
                                    <a href="tel:+919343300271" className="text-slate-200 hover:text-white transition-colors text-sm">+91 9343300271</a>
                                </div>
                            </li>
                        </ul>

                        <div>
                            <p className="text-sm text-slate-400 mb-3">Follow us</p>
                            <div className="flex space-x-3">
                                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all transform hover:-translate-y-1"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800/50 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm order-2 md:order-1">
                            &copy; {new Date().getFullYear()} PayMM. All rights reserved. Made with <span className="text-red-500 animate-pulse">❤</span> in India.
                        </p>
                        <div className="flex items-center space-x-4 text-slate-600 order-1 md:order-2">
                            <FaCcVisa className="text-2xl hover:text-slate-400 transition-colors" />
                            <FaCcMastercard className="text-2xl hover:text-slate-400 transition-colors" />
                            <FaCcAmex className="text-2xl hover:text-slate-400 transition-colors" />
                            <FaPaypal className="text-2xl hover:text-slate-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
