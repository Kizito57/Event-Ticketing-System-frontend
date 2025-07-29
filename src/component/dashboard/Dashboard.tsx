import { Outlet } from "react-router"
import Navbar from "../nav/Navbar"

const Dashboard = () => {
    return (
        <div>
            <div data-test="dashboard-navbar">
                <Navbar />
            </div>
            <div>
                <aside data-test="dashboard-aside">
                    {/* Add sidebar content here if needed */}
                </aside>
                <main data-test="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard
