import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Stats } from "./pages/Stats.jsx";
import { Info } from "./pages/Info.jsx";
import { Settings } from "./pages/Settings.jsx";
import { API } from "./pages/API.jsx";
import { ListPage } from "./pages/ListPage.jsx";
import { listConfigs } from "./data/listConfig.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
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
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
