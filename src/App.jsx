import { useEffect } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Stats } from "./pages/Stats.jsx";
import { Info } from "./pages/Info.jsx";
import { Settings } from "./pages/Settings.jsx";
import { API } from "./pages/API.jsx";
import { ListPage } from "./pages/ListPage.jsx";
import { Changelog } from "./pages/Changelog.jsx";
import { Credits } from "./pages/Credits.jsx";
import { listConfigs } from "./data/listConfig.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
                <Header />
                <Routes>
                    {listConfigs.map((config) => (
                        <Route
                            key={config.key}
                            path={config.path}
                            element={<ListPage config={config} />}
                        />
                    ))}
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/api" element={<API />} />
                    <Route path="/changelog" element={<Changelog />} />
                    <Route path="/credits" element={<Credits />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
