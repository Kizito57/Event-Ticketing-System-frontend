import serviceIMG from '../../assets/images/services.jpg'

const Services = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Image Section */}
                    <div className="flex-1 relative">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src={serviceIMG}
                                alt="Our premium car rental services"
                                className="w-full h-80 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                        </div>
                        {/* Service Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                            <div className="text-2xl font-bold text-blue-600">24/7</div>
                            <div className="text-sm text-gray-600">Support</div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 lg:pl-8">
                        <div className="mb-8">
                            <div className="badge badge-primary badge-lg mb-4 text-black">
                                🌟 Premium Services
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                                Why Choose 
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {' '}DreamWheels?
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Experience hassle-free car rental with our comprehensive service package. 
                                Every vehicle comes with full coverage and premium care.
                            </p>
                        </div>

                        {/* Services Table */}
                        <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
                            <table className="table w-full bg-white">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <tr>
                                        <th className="text-white">Service</th>
                                        <th className="text-white">Coverage</th>
                                        <th className="text-white">Support</th>
                                        <th className="text-white">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-blue-50 transition-colors">
                                        <td className="font-semibold">
                                            <div className="flex items-center gap-3">
                                                🛡️ <span>Full Insurance</span>
                                            </div>
                                        </td>
                                        <td>Comprehensive Coverage</td>
                                        <td>24/7 Claims Support</td>
                                        <td>
                                            <div className="badge badge-success text-black">✓ Included</div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-blue-50 transition-colors">
                                        <td className="font-semibold">
                                            <div className="flex items-center gap-3">
                                                🔧 <span>Maintenance</span>
                                            </div>
                                        </td>
                                        <td>Professional Service</td>
                                        <td>Emergency Roadside</td>
                                        <td>
                                            <div className="badge badge-success text-black">✓ Included</div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-blue-50 transition-colors">
                                        <td className="font-semibold">
                                            <div className="flex items-center gap-3">
                                                📱 <span>Easy Booking</span>
                                            </div>
                                        </td>
                                        <td>Instant Confirmation</td>
                                        <td>Mobile App & Web</td>
                                        <td>
                                            <div className="badge badge-success text-black">✓ Available</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex-1">
                                🚗 Reserve Your Car
                            </button>
                            <button className="btn btn-outline btn-lg hover:shadow-lg transition-all duration-200">
                                💬 Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services