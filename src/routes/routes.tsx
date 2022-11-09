import { useEffect } from "react";
import { Route, Routes } from "react-router";
import { ApiConstants } from "../helpers/api_constants";
import { RoutesConstants } from "../helpers/routes_constants";
import AdminLayout from "../layouts/admin_layout";
import ComunLayouts from "../layouts/comon_layout";
import ManagerLayout from "../layouts/manager_layout";
import HomeAdmin from "../pages/admin_pages";
import AccountPage from "../pages/comon/account_page";
import FavoritPage from "../pages/comon/favorits_page";
import HomeDetailsPage from "../pages/comon/home_details_page";
import Home from "../pages/comon/home_page";
import HomeSearchPage from "../pages/comon/home_search_page";
import ManagerHistoryPage from "../pages/comon/manager_history_page";
import ManagePaddingsPage from "../pages/comon/manager_paddings_page";
import ManagerActivesPage from "../pages/comon/maneger_actives_page";
import ManegerInfoHomePage from "../pages/comon/maneger_info_home_page";
import ManagerAnouncePage from "../pages/comon/manger_anounce_page";
import ConfirmEmailPage from "../pages/shared/confirm_email";
import Error from "../pages/shared/error/error";
import Login from "../pages/shared/login/login";
import PasswordRecover from "../pages/shared/password_recover";
import PasswordRecoverEmail from "../pages/shared/password_recover_email";
import Register from "../pages/shared/register";
import { useAuth } from "../shared/hooks/auth_hook";
import authRepository from "../shared/services/repository/auth_repository";
import Authetication from "./authetincation";
import Unautheticated from "./unautheticated_routes";


export const MainRoutes = () => {

    const { auth } = useAuth()

    useEffect(() => {
        authRepository.csrf()
            .catch(reject => {
                console.log('error')
            })

    }, [])

    return (

        <Routes>

            {/* open routes */}
            <Route element={<Unautheticated user={auth?.user} />}>
                <Route path={RoutesConstants.login} element={<Login />} />
                <Route path={RoutesConstants.register} element={<Register />} />
                <Route path={RoutesConstants.passwordRecoverEmail} element={<PasswordRecoverEmail />} />
                <Route path={RoutesConstants.emailVerification} element={<ConfirmEmailPage />} />
                <Route path={RoutesConstants.passwordRecover + ':code'} element={<PasswordRecover />} />
            </Route>
            {/* Admins routes*/}
            <Route element={<Authetication user={auth?.user} role={[ApiConstants.adminRole]} />}>
                <Route path={RoutesConstants.admin} element={<AdminLayout />}>

                    <Route index element={<HomeAdmin />} />
                    <Route path={RoutesConstants.relHomeAdmin} element={<HomeAdmin />} />

                    <Route path="*" element={<Error />} />
                </Route>
            </Route>

            {/* normal users routes */}
            <Route path={RoutesConstants.home} element={<ComunLayouts />}>
                <Route index element={<Home />} />
                <Route path={RoutesConstants.relHomeDetails + ':slug'} element={<HomeDetailsPage />} />
                <Route path={RoutesConstants.relHomeSearch} element={<HomeSearchPage />} />

                {/* Authenticated users routes */}
                <Route element={<Authetication user={auth?.user} role={[ApiConstants.userRole, ApiConstants.adminRole]} />}>
                    <Route path={RoutesConstants.relFavorits} element={<FavoritPage />} />
                    <Route path={RoutesConstants.relAccount} element={<AccountPage />} />
                    <Route path={RoutesConstants.manage} element={<ManagerLayout />}>
                        <Route index element={<ManagerActivesPage />} />
                        <Route path={RoutesConstants.relManageAnounce} element={<ManagerAnouncePage />} />
                        <Route path={RoutesConstants.relManageHistory} element={<ManagerHistoryPage />} />
                        <Route path={RoutesConstants.relManegePeddidngs} element={<ManagePaddingsPage />} />
                        <Route path={RoutesConstants.relManageInfoHome + ':slug'} element={<ManegerInfoHomePage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Error />} />
            </Route>

            <Route path="*" element={<Error />} />
        </Routes >
    );
}