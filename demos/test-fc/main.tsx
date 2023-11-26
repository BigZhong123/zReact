import { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [num, setNum] = useState(1200);

  const arr =
    num % 2 === 0
      ? [<li key={1}>1</li>, <li key={2}>2</li>, <li key={3}>3</li>]
      : [<li key={3}>3</li>, <li key={2}>2</li>, <li key={1}>1</li>];

  return (
    <ul onClick={() => setNum(num + 1)}>
      <li>4</li>
      <li>5</li>
      {arr}
    </ul>
  );

  return <ul onClick={() => setNum(num + 1)}>{arr}</ul>;
}

function Child() {
  return <span>z-react</span>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
