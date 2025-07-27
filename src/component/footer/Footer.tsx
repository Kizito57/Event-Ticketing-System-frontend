import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-emerald-400">Crystal Events</h3>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Empowering seamless event planning, ticketing, and venue discovery. Your ultimate events partner.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                                <FaFacebook className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                                <FaTwitter className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                                <FaYoutube className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
                                <FaInstagram className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <nav>
                        <h6 className="text-lg font-semibold mb-4 text-white">Our Services</h6>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Event Ticketing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Venue Booking</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Guest Management</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Smart Check-in</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Event Analytics</a></li>
                        </ul>
                    </nav>

                    {/* Company */}
                    <nav>
                        <h6 className="text-lg font-semibold mb-4 text-white">Company</h6>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Our Team</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Partners</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Media Kit</a></li>
                        </ul>
                    </nav>

                    {/* Contact Info */}
                    <div>
                        <h6 className="text-lg font-semibold mb-4 text-white">Contact Us</h6>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-emerald-400 flex-shrink-0" />
                                <span className="text-gray-400">+254 700 123 456</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-emerald-400 flex-shrink-0" />
                                <span className="text-gray-400">support@crystalevents.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-emerald-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-400">
                                    Crystal Towers, Nairobi CBD<br />
                                    Kenya
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 Crystal Events. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
