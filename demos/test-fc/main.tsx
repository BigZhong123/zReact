import { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [num, setNum] = useState(1200);

  window.setNum = setNum;

  return num === 3 ? <Child /> : <div>{num}</div>;
}

function Child() {
  return <span>z-react</span>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
