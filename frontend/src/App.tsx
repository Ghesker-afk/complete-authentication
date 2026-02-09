import { Route, Routes } from "react-router-dom"

export function Home() {
  return (
    <div>Home</div>
  );
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  )
}

export default App
