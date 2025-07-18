
import Testimonials from "../component/about/Testimonials"
import Footer from "../component/footer/Footer"
import { Hero } from "../component/home/Hero"
import Services from "../component/home/Services"
// import Navbar from "../component/nav/Navbar"

const LandingPage = () => {
    return (
        <div>
            {/* <Navbar /> */}
            <Hero />
            <Services />
            <Testimonials />
            <Footer />

        </div>
    )
}

export default LandingPage