import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
    return (
        <div>
            <Navbar />

            <div>
                <Sidebar />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;