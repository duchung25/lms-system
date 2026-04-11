import {Outlet} from "react-router-dom";
import Header from "../components/header/header.jsx";

export default function AppLayout() {

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header className="relative"/>

            <div className="container-fluid flex-grow-1">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}