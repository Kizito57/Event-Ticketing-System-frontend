import eventSystemImg from '../../assets/images/tasks-manager.png';
import { Shield, Calendar, MapPin, Ticket, ArrowRight, Phone } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-emerald-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-4 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 hover:scale-105">
                                <img
                                    src={eventSystemImg}
                                    alt="Crystal Events Management Dashboard"
                                    className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
                                />
                                <div className="absolute top-8 right-8 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    🎫 Event Ticketing
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-10"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500">
                                
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-2 rounded-full mb-4">
                                        <Ticket className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-semibold text-emerald-800">Event Ticketing Platform</span>
                                    </div>
                                    
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent leading-tight">
                                        About Crystal Events
                                    </h1>
                                </div>

                                {/* Description */}
                                <div className="space-y-6 mb-8">
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        <span className="font-semibold text-emerald-700">Crystal Events</span> empowers organizers and attendees with a seamless ticketing and venue booking experience for concerts, expos, weddings, conferences and more.
                                    </p>
                                    
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        Our platform provides real-time booking, digital ticket delivery, and secure check-ins for all types of events.
                                    </p>
                                    
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        Discover verified venues, manage attendance, and sell tickets confidently—all from one powerful dashboard.
                                    </p>
                                </div>

                                {/* Feature Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                        <Calendar className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                        <span className="font-semibold text-emerald-800">Instant Booking</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl border border-cyan-100">
                                        <Shield className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                                        <span className="font-semibold text-cyan-800">Secure Ticketing</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                        <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                        <span className="font-semibold text-emerald-800">Verified Venues</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-100">
                                        <Ticket className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                                        <span className="font-semibold text-cyan-800">Digital Tickets</span>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                    
                                    <button className="group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-8 rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                        <span>Contact Support</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white/50 backdrop-blur-sm border-t border-white/50">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">350+</h3>
                            <p className="text-slate-600 font-medium">Partner Venues</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Ticket className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">40K+</h3>
                            <p className="text-slate-600 font-medium">Tickets Sold</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">100%</h3>
                            <p className="text-slate-600 font-medium">Secure Check-ins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
