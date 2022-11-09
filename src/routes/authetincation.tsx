import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RoutesConstants } from "../helpers/routes_constants";
import { IUserModel } from "../shared/services/models/auth_model";

interface iProps {
    user?: IUserModel,
    role: string[],
}

const Authetication: React.FC<iProps> = ({ user, role }) => {

    const location = useLocation()

    if (!user) {
        return <Navigate to={RoutesConstants.login} state={location.pathname}/>;
    }

    return (
        role.includes(user.role as string)
            ? <Outlet />
            : <h2>proibido</h2>
    );
  
}

export default Authetication;