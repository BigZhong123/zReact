import { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [num] = useState(1200);

  return <div>{num}</div>;
}

function Child() {
  return <span>z-react</span>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
