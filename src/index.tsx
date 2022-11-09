import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { AuthContextProvider } from "./shared/contexts/auth_context";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

root.render(
    <BrowserRouter>
        <AuthContextProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </AuthContextProvider>
    </BrowserRouter>

)