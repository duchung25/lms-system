import {Outlet} from "react-router-dom";
import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";

export default function AppLayout() {

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header className="sticky-top" />

            <div className="container-fluid flex-grow-1">
                <div className="row">
                    <div className="d-none d-md-block col-md-3 col-lg-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-md-9 col-lg-10">
                        <Outlet />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}