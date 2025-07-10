import "./scss/global.css"
import Game from './pages/Game_contents';
import Start from './pages/Start_menu';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/content" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

