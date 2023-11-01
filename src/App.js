import "./App.css";
import { Header } from "./components/header/header.jsx";
import { Levels } from "./components/levels/levels.jsx";
import { Progress } from "./components/progress/progress.jsx";
import { Footer } from "./components/footer/footer.jsx";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="levelsprogress">
        <Levels />
        <Progress />
      </div>
      <Footer />
    </div>
  );
}

export default App;
