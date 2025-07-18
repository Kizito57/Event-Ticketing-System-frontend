import homeIMG from '../../assets/images/car1.jpg'

export const Hero = () => {
    return (
        <div className="hero min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl mx-auto px-4">
                {/* Image Section */}
                <div className="flex-1 relative">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                        <img
                            src={homeIMG}
                            alt="Premium rental car"
                            className="w-full h-80 lg:h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="mb-6">
                        <div className="badge badge-secondary badge-lg mb-4 text-black">
                            🚗 Car Rental Made Easy
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                            DreamWheels
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 mt-2 font-medium">
                            Your Journey, Our Promise
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Experience premium car rental with <span className="font-bold text-blue-600">full insurance coverage</span> and 
                            <span className="font-bold text-indigo-600"> professional maintenance</span> included.
                        </p>
                        <p className="text-base text-gray-600">
                            Book instantly, drive confidently, and enjoy peace of mind with our comprehensive care package.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                        <div className="badge badge-outline badge-lg p-3">
                            🛡️ Full Insurance
                        </div>
                        <div className="badge badge-outline badge-lg p-3">
                            🔧 Maintained Fleet
                        </div>
                        <div className="badge badge-outline badge-lg p-3">
                            📱 Instant Booking
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                            🚗 Book Now
                        </button>
                        <button className="btn btn-outline btn-lg hover:shadow-lg transition-all duration-200">
                            📋 View Fleet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}