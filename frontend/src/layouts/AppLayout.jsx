import {Outlet} from "react-router-dom";
import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import Sidebar from "../components/sidebar/sidebar.jsx";
import { useAuth } from "../auth/useAuth.js";
import { FaMaxcdn } from "react-icons/fa6";

export default function AppLayout() {
  const { user } = useAuth();
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header className="sticky-top" />

            <div className="container-fluid flex-grow-1" style={{ marginTop: "64px", paddingTop: "20px", backgroundColor: "var(--color-background)" }}>
                <div className="row" style={{marginBottom: "10px"}}>
                    {user && (
                        <>
                           <div className="d-none d-md-block col-md-1 col-xl-2 ps-0" style={{ maxWidth: "184px" }}>
                                <Sidebar />
                            </div>
                            <div className="col-md-11 col-xl-10">
                                <Outlet />
                            </div>
                        </>
                    )}
                    {!user && (
                        <div className="col-12">
                            <Outlet />
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}