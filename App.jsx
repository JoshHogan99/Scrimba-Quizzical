import React from "react";
import { nanoid } from "nanoid";
import he from "he";

import Intro from "./components/Intro";
import Questions from "./components/Questions";

export default function App() {
  const [questionScreen, setQuestionScreen] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [answersChecked, setAnsweredChecked] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const maxScore = 5;
  const [answersDisabled, setAnswersDisabled] = React.useState(false);
  const [userCheckedAnswers, setUserCheckedAnswers] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [type, setType] = React.useState("");

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  React.useEffect(() => {
    if (!questionScreen) return;

    async function getQuestions() {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=5${
          category === "any" ? "" : `&category=${category}`
        }${difficulty === "any" ? "" : `&difficulty=${difficulty}`}${
          type === "any" ? "" : `&type=${type}`
        }`
      );
      const data = await response.json();
      console.log(data);
      let newArr = [];
      data.results.forEach((question) => {
        const decodedQuestion = he.decode(question.question);
        const decodedCorrectAnswer = he.decode(question.correct_answer);
        const decodedIncorrectAnswer = question.incorrect_answers.map(
          he.decode
        );

        newArr.push({
          id: nanoid(),
          question: decodedQuestion,
          correctAnswer: decodedCorrectAnswer,
          answers: shuffleArray(
            [...decodedIncorrectAnswer, decodedCorrectAnswer].map((answer) => ({
              text: answer,
              isChecked: false,
            }))
          ),
        });
      });
      setQuestions(newArr);
    }
    getQuestions();
  }, [questionScreen]);

  const questionElement = questions.map((question) => {
    return (
      <Questions
        key={question.id}
        checkAnswer={checkAnswer}
        userCheckedAnswers={userCheckedAnswers}
        disabled={answersDisabled}
        {...question}
      />
    );
  });

  function checkAnswer(id, answer) {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question) => {
        if (question.id === id) {
          return {
            ...question,
            answers: question.answers.map((questionAnswer) =>
              questionAnswer.text === answer.text
                ? { ...questionAnswer, isChecked: true }
                : { ...questionAnswer, isChecked: false }
            ),
          };
        }
        return question;
      })
    );
  }

  function checkAnswers() {
    let newScore = 0;
    questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.isChecked) {
          if (answer.text === question.correctAnswer) {
            newScore++;
          }
        }
      });
    });
    setScore(newScore);
    setAnsweredChecked(true);
    setAnswersDisabled(true);
    setUserCheckedAnswers(true);
  }

  function startQuiz(e) {
    e.preventDefault();
    setCategory(e.target.category.value);
    setDifficulty(e.target.difficulty.value);
    setType(e.target.type.value);
    setQuestionScreen(true);
  }

  function playAgain() {
    setQuestionScreen(false);
    setAnsweredChecked(false);
    setAnswersDisabled(false);
    setUserCheckedAnswers(false);
  }

  return (
    <div className="container">
      {questionScreen ? (
        <div className="questions-container">
          {questionElement}
          <div className="score">
            {answersChecked && (
              <h3>{`You scored ${score}/${maxScore} correct answers`}</h3>
            )}
            {answersChecked ? (
              <button className="play-again" onClick={playAgain}>
                Play again
              </button>
            ) : (
              <button className="check-answers" onClick={checkAnswers}>
                Check answers
              </button>
            )}
          </div>
        </div>
      ) : (
        <Intro startQuiz={startQuiz} />
      )}
    </div>
  );
}
