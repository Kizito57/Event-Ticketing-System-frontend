import { testimonialsData } from "./testimonialdata";

// Star rating component
type StarRatingProps = {
    rating: number;
};

const StarRating = ({ rating }: StarRatingProps) => {
    return (
        <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const Testimonials = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real experiences from our satisfied customers
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonialsData.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            {/* Rating */}
                            <StarRating rating={testimonial.rating} />

                            {/* Testimonial content */}
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                &quot;{testimonial.content}&quot;
                            </p>

                            {/* Customer info */}
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                    <span className="text-blue-600 text-sm">{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;