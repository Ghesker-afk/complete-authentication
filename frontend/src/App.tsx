import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage";

export function Home() {
  return (
    <div>Home</div>
  );
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
    </Routes>
  )
}

export default App
