import { useState } from "react";

export default function App() {
  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
  });

  function handleFeedback(type) {
    setFeedback((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  }

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button text="good" value="good" onClick={handleFeedback}></Button>
        <Button
          text="neutral"
          value="neutral"
          onClick={handleFeedback}
        ></Button>
        <Button text="bad" value="bad" onClick={handleFeedback}></Button>
      </div>
      <Statistics feedback={feedback} />
    </>
  );
}

function Statistics({ feedback }) {
  const { good, neutral, bad } = feedback;
  const total = bad + neutral + good;
  const avg = total > 0 ? (bad * -1 + neutral * 0 + good * 1) / total : 0;
  const positive = total > 0 ? (good / total) * 100 : 0;

  return (
    <div>
      <h1>statistics</h1>
      {total > 0 ? (
        <table>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total" value={total} />
          <StatisticLine text="average" value={avg.toPrecision(4)} />
          <StatisticLine
            text="positive"
            value={positive.toPrecision(4) + " %"}
          />
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}
function StatisticLine({ text, value, format = "default" }) {
  return (
    <tbody>
      {format == "percent" ? (
        <tr>
          <td>{`${text} : `}</td>
          <td>{`${value}  %`}</td>
        </tr>
      ) : (
        <tr>
          <td>{`${text} : `}</td>
          <td>{`${value}`}</td>
        </tr>
      )}
    </tbody>
  );
}

function Button({ text, value, onClick }) {
  return <button onClick={() => onClick(value)}>{text}</button>;
}
