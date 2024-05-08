import React from "react";

export default function Questions(props) {
  return (
    <div className="questions">
      <h2>{props.question}</h2>
      {props.answers.map((answer, index) => (
        <button
          key={index}
          onClick={() => props.checkAnswer(props.id, answer)}
          disabled={props.disabled}
          style={{
            border:
              answer.isChecked && props.userCheckedAnswers
                ? answer.text === props.correctAnswer
                  ? "none"
                  : "none"
                : answer.isChecked
                ? "none"
                : "0.794px solid #4D5B9E",
            background:
              answer.isChecked && props.userCheckedAnswers
                ? answer.text === props.correctAnswer
                  ? "#94d7a2"
                  : "#f8bcbc"
                : answer.isChecked
                ? "#d6dbf5"
                : "white",
          }}
        >
          {answer.text}
        </button>
      ))}
    </div>
  );
}
