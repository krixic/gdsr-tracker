import "./App.css";
import { Header } from "./components/header/header.jsx";
import { Footer } from "./components/footer/footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { DLCPage } from "./pages/DLCPage.jsx";
import { ProgressPage } from "./pages/ProgressPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="main-content">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/dlc" element={<DLCPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
