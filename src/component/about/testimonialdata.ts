import story1 from '../../assets/images/story1.jpg';
import story2 from '../../assets/images/story2.jpg';

type Testimonial = {
    id: number;
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
};

export const testimonialsData: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Mwangi',
        role: 'Business Traveler',
        image: story2,
        content: 'RentEasy made my business trip seamless! The car was spotless, fuel-efficient, and the pickup process was incredibly quick. Professional service from start to finish.',
        rating: 5
    },
    {
        id: 2,
        name: 'Mike Kimani',
        role: 'Weekend Explorer',
        image: story1,
        content: 'Perfect for my weekend getaway! Great selection of vehicles and the prices are unbeatable. The SUV handled mountain roads like a dream. Will definitely rent again.',
        rating: 5
    },
    {
        id: 3,
        name: 'Lisa Wanjenga',
        role: 'Family Vacation',
        image: story2,
        content: 'The 7-seater van was perfect for our family road trip across three states. Spacious, comfortable, and excellent customer service throughout our journey.',
        rating: 5
    },
    {
        id: 4,
        name: 'James Kimani',
        role: 'Corporate Client',
        image: story1,
        content: 'Reliable service for all our corporate transportation needs. The booking system is user-friendly, cars are always pristine, and billing is transparent.',
        rating: 5
    },
    {
        id: 5,
        name: 'Emma Njeri',
        role: 'City Explorer',
        image: story2,
        content: 'Exploring downtown was made easy with their compact hybrid. Great fuel economy, easy parking everywhere, and the GPS system was spot-on!',
        rating: 4
    },
    {
        id: 6,
        name: 'Alex Thuranira',
        role: 'Adventure Seeker',
        image: story1,
        content: 'The 4WD pickup truck handled rocky terrain and steep mountain roads perfectly. Great for camping trips and outdoor adventures. Highly recommend!',
        rating: 5
    },
    {
        id: 7,
        name: 'Maria Garcia',
        role: 'Airport Shuttle',
        image: story2,
        content: 'Needed a reliable ride from the airport at 3 AM. The car was ready as promised, clean, and got me home safely. Excellent late-night service.',
        rating: 5
    },
    {
        id: 8,
        name: 'David Park',
        role: 'Long Distance Driver',
        image: story1,
        content: 'Drove 1,200 miles for a cross-country move. The luxury sedan was comfortable, reliable, and made the long journey enjoyable. Great value for money.',
        rating: 4
    },
];