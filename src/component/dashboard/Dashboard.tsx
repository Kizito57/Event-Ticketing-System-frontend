import { Outlet } from "react-router"
import Navbar from "../nav/Navbar"

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <div>
                <aside>

                </aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard