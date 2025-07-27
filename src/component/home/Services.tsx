import serviceIMG from '../../assets/images/services.jpg'

const Services = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="flex-1 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={serviceIMG}
                alt="Premium event and venue booking services"
                className="w-full h-80 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
            </div>
            {/* Service Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="text-2xl font-bold text-emerald-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 lg:pl-8">
            <div className="mb-8">
              <div className="badge badge-lg mb-4 text-white bg-gradient-to-r from-emerald-500 to-cyan-500">
                🎉 Event & Venue Services
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Why Choose
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  {' '}Crystal Events?
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Seamlessly plan and book your dream events with our expert services and curated venues. Whether it's a wedding, corporate event, or private party — we've got you covered.
              </p>
            </div>

            {/* Services Table */}
            <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
              <table className="table w-full bg-white">
                <thead className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                  <tr>
                    <th className="text-white">Service</th>
                    <th className="text-white">Details</th>
                    <th className="text-white">Support</th>
                    <th className="text-white">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-emerald-50 transition-colors">
                    <td className="font-semibold">
                      <div className="flex items-center gap-3">
                        🏛️ <span>Venue Booking</span>
                      </div>
                    </td>
                    <td>Wide range of venues</td>
                    <td>On-site & remote</td>
                    <td>
                      <div className="badge bg-emerald-100 text-emerald-700">✓ Available</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-emerald-50 transition-colors">
                    <td className="font-semibold">
                      <div className="flex items-center gap-3">
                        🧑‍🎤 <span>Event Planning</span>
                      </div>
                    </td>
                    <td>Tailored packages</td>
                    <td>Dedicated coordinator</td>
                    <td>
                      <div className="badge bg-emerald-100 text-emerald-700">✓ Included</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-emerald-50 transition-colors">
                    <td className="font-semibold">
                      <div className="flex items-center gap-3">
                        📲 <span>Online Booking</span>
                      </div>
                    </td>
                    <td>Instant confirmation</td>
                    <td>Mobile & desktop</td>
                    <td>
                      <div className="badge bg-emerald-100 text-emerald-700">✓ Active</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn btn-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex-1 text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                🎟️ Book an Event
              </button>
              <button className="btn btn-outline btn-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all duration-200">
                📞 Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
