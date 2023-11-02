import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css"
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import { useRouter } from "next/router"

export default function App({ Component, pageProps }) {

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const router = useRouter();
    const showHeader = router.pathname === '/login' || router.pathname === '/register' ? false : true;

    return (
        <>

            {showHeader && <Header />}
            <Component {...pageProps} />
            <Footer />

        </>
    )
}