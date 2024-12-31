import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";

import GenerateSolution from "./components/GenerateSolution";
import SolvePuzzle from "./components/SolvePuzzle";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate-solution" element={<GenerateSolution />} />
          <Route path="/solve-puzzle" element={<SolvePuzzle />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
