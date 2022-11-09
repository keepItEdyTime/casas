import { Navigate, Outlet } from "react-router-dom";
import { RoutesConstants } from "../helpers/routes_constants";
import { IUserModel } from "../shared/services/models/auth_model";

interface iProps {
    user?: IUserModel,
}

const Unautheticated: React.FC<iProps> = ({ user }) => {

    return (
        user
            ? <Navigate to={RoutesConstants.home} />
            : <Outlet />
    )

}

export default Unautheticated