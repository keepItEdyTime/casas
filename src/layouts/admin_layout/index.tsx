import { Outlet } from "react-router-dom";
import NavBar from "../../shared/components/nav_bar";


const AdminLayout = () => {

    return (
        <div className="">

            <Outlet />

        </div>
    );
}

export default AdminLayout;