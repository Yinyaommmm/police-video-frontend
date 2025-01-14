import { type FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./route/home";

const App: FC = () => {
  return (
    <div className="" >

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

