import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

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
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/email/verify/:code" element={<VerifyEmailPage />}></Route>
    </Routes>
  )
}

export default App
