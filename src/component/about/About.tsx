import taskManager from '../../assets/images/tasks-manager.png';
import { Shield, Car, Calendar, Wrench, ArrowRight, Phone } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-4 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 hover:scale-105">
                                <img
                                    src={taskManager}
                                    alt="Dreamwheels Task Manager Interface"
                                    className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
                                />
                                <div className="absolute top-8 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    🚗 Premium Fleet
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500">
                                
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
                                        <Car className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-800">Premium Car Rental</span>
                                    </div>
                                    
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                        About Dreamwheels
                                    </h1>
                                </div>

                                {/* Description */}
                                <div className="space-y-6 mb-8">
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        Dreamwheels is your <span className="font-semibold text-blue-700">trusted car rental partner</span>, offering a premium fleet of well-maintained vehicles for all your transportation needs.
                                    </p>
                                    
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        With our easy booking and reservation system, you can <span className="font-semibold text-purple-700">secure your perfect vehicle</span> in minutes, knowing that every car is fully insured and ready for the road.
                                    </p>
                                    
                                    <p className="text-lg text-slate-700 leading-relaxed">
                                        We pride ourselves on <span className="font-semibold text-indigo-700">regular maintenance schedules</span> and comprehensive insurance coverage, ensuring your safety and peace of mind on every journey.
                                    </p>
                                </div>

                                {/* Feature Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                        <Calendar className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        <span className="font-semibold text-green-800">Easy Booking</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-100">
                                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                        <span className="font-semibold text-blue-800">Full Insurance</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                                        <Car className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                        <span className="font-semibold text-purple-800">Premium Fleet</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                                        <Wrench className="w-6 h-6 text-orange-600 flex-shrink-0" />
                                        <span className="font-semibold text-orange-800">Regular Maintenance</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <span>Book Now</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                    
                                    <button className="group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-8 rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                        <span>Contact Us</span>
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
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Car className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">500+</h3>
                            <p className="text-slate-600 font-medium">Premium Vehicles</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">100%</h3>
                            <p className="text-slate-600 font-medium">Insured Fleet</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Wrench className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">24/7</h3>
                            <p className="text-slate-600 font-medium">Maintenance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About