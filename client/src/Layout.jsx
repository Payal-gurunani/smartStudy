import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";

const Layout = () => {
    return(
        <>
        <Header/>
        <main >
            <Outlet />
        </main>
        </>
    )
}
export default Layout;