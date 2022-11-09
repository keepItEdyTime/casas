import { Outlet } from "react-router-dom";
import Footer from "../../shared/components/footer";
import NavBar from "../../shared/components/nav_bar";

const ComunLayouts = () => {

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
}

export default ComunLayouts;