import { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [num, setNum] = useState(1200);

  return <div onClick={() => setNum(num + 1)}>{num}</div>;
}

function Child() {
  return <span>z-react</span>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
