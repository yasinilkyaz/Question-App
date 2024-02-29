import React, { useState, useEffect } from "react";
import "./App.css";
import questions from "./questions";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill("")
  );

  useEffect(() => {
    if (quizStarted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizStarted]);
  useEffect(() => {
    if (timer === 20) {
      setShowOptions(true);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, isAnswered]);

  useEffect(() => {
    if (timer === 0 && !isAnswered) {
      const correctAnswer = questions[currentQuestion].answer;
      setSelectedOptions((prevSelectedOptions) => {
        const updatedSelectedOptions = [...prevSelectedOptions];
        updatedSelectedOptions[currentQuestion] = correctAnswer;
        return updatedSelectedOptions;
      });
      setIsAnswered(true);
      setWrongAnswers(wrongAnswers + 1);
    }
  }, [timer]);

  const handleOptionClick = (option) => {
    if (!isAnswered) {
      const correctAnswer = questions[currentQuestion].answer;
      setSelectedOption(option);
      setIsAnswered(true);

      if (option === correctAnswer) {
        setScore(score + 1);
      } else {
        setWrongAnswers(wrongAnswers + 1);
      }

      const updatedSelectedOptions = [...selectedOptions];
      updatedSelectedOptions[currentQuestion] = option;
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setShowOptions(false);
      setIsAnswered(false);
      setTimer(30);
    } else {
      setShowResults(true);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimer(30);
  };

  return (
    <div className="app">
      {!quizStarted && (
        <div className="start-container">
          <h2>Teste Hoş Geldiniz!</h2>
          <p>Teste başlamak için lütfen aşağıdaki butona tıklayın.</p>
          <button onClick={handleStartQuiz} id="start">
            Teste Başla
          </button>
        </div>
      )}
      {quizStarted && !showResults && (
        <div className="question-container">
          <h2>{questions[currentQuestion].question}</h2>
          {questions[currentQuestion].media && (
            <img src={questions[currentQuestion].media} alt="media" />
          )}
          {showOptions && (
            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`option ${
                    selectedOption === option && "selected"
                  }`}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="timer">
            <p>{timer} sn</p>
          </div>
        </div>
      )}
      <div className="button-container">
        {quizStarted && !showResults && (
          <button onClick={handleNextQuestion} id="start">
            {currentQuestion === questions.length - 1
              ? "Sonuçları Gör"
              : "Sonraki Soru"}
          </button>
        )}
      </div>
      <div className="score-container">
        {showResults && (
          <div>
            <p>Doğru Sayısı: {score}</p> <br />
            <p>Yanlış Sayısı: {wrongAnswers}</p> <br />
            <div className="selected-options">
              <h3>Seçilen Seçenekler:</h3>
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>
                    <strong>{question.question}</strong> <br />
                    {"Cevabınız"}:{selectedOptions[index]} {" Doğru Cevap :  "}
                    {question.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
