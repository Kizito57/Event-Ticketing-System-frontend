import story1 from '../../assets/images/story1.jpg'
import story2 from '../../assets/images/story2.jpg'

type Testimonial = {
  id: number
  name: string
  role: string
  image: string
  content: string
  rating: number
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mwangi',
    role: 'Event Organizer',
    image: story2,
    content:
      'The team handled our product launch with such professionalism. From setup to guest coordination, everything was smooth and impressive. Highly recommended!',
    rating: 5
  },
  {
    id: 2,
    name: 'Mike Kimani',
    role: 'Concert Attendee',
    image: story1,
    content:
      'The concert was electric! Great sound, top-notch security, and perfect lighting. Easily one of the best events I’ve attended this year.',
    rating: 5
  },
  {
    id: 3,
    name: 'Lisa Wanjenga',
    role: 'Bride',
    image: story2,
    content:
      'Our wedding day was magical thanks to their planning team. The décor, timing, and coordination were flawless. They made our dream day come true!',
    rating: 5
  },
  {
    id: 4,
    name: 'James Kimani',
    role: 'Corporate Planner',
    image: story1,
    content:
      'We hosted our annual summit with their help, and it was a huge success. Well-managed logistics, great catering, and professional execution throughout.',
    rating: 5
  },
  {
    id: 5,
    name: 'Emma Njeri',
    role: 'Fashion Show Guest',
    image: story2,
    content:
      'The runway show was stunning! Beautiful lighting and excellent stage setup. Everything ran on time and felt super high-end.',
    rating: 4
  },
  {
    id: 6,
    name: 'Alex Thuranira',
    role: 'Adventure Race Participant',
    image: story1,
    content:
      'The outdoor challenge event was thrilling! Routes were well-marked, safety was top-notch, and the post-event celebration was a blast.',
    rating: 5
  },
  {
    id: 7,
    name: 'Maria Garcia',
    role: 'Gala Guest',
    image: story2,
    content:
      'From the red carpet to the dining experience, everything about the awards gala was elegant and perfectly organized.',
    rating: 5
  },
  {
    id: 8,
    name: 'David Park',
    role: 'Speaker at Tech Expo',
    image: story1,
    content:
      'The stage tech and AV setup were spot-on. Staff were responsive, and the event flow was seamless. A truly professional setup for presenters.',
    rating: 4
  }
]
