import React, { useState, useRef,useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timer,setTimer] = useState(10);
  const timerRef = useRef(null);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const option_array = [Option1, Option2, Option3, Option4];


  useEffect(() => {
    if (lock || result) return;

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          submitAnswer();
        }
        return prev - 1;
      });
    }, 1000);
     return () => clearInterval(timerRef.current);
  }, [index, lock]);



  const selectOption = (ans, e) => {
    if (lock) return;
    setSelected(ans);
    option_array.forEach(opt => opt.current.classList.remove('selected-option'));
    e.target.classList.add('selected-option');
  };

  const submitAnswer = () => {
    if (selected === null || lock) return;
    clearInterval(timerRef.current);
    setLock(true);
    if (selected === question.ans) {
      option_array[selected - 1].current.classList.add('correct');
      setScore(prev => prev + 1);
    } else {
      option_array[selected - 1].current.classList.add('wrong', 'wrong-animate');
      setTimeout(() => {
        option_array[question.ans - 1].current.classList.add('correct-noanim');
        option_array[selected - 1].current.classList.remove('wrong-animate');
      }, 600);
    }
  };

  const next = () => {
    if (!lock) return;
    if (index === data.length - 1) {
      setResult(true);
      return;
    }
    const newIndex = index + 1;
    setIndex(newIndex);
    setQuestion(data[newIndex]);
    setLock(false);
    setSelected(null);
    setTimer(10);
    option_array.forEach(option => {
      option.current.classList.remove(
        'wrong',
        'correct',
        'correct-noanim',
        'wrong-animate',
        'selected-option'
      );
    });
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setSelected(null);
    setTimer(10);
  };

  return (
    <div className='container'>
      <div className='header-bar'>
      <h1>Quiz App</h1>
      <hr />
      {!result ? (
        <>
          <h2>{index + 1}. {question.question}</h2>
         <div className="circle-timer">
            <svg className="progress-ring" width="60" height="60">
              <circle
                className="progress-ring__circle"
                stroke="#553f9a"
                strokeWidth="6"
                fill="transparent"
                r="26"
                cx="30"
                cy="30"
                style={{
                  strokeDasharray: 2 * Math.PI * 26,
                  strokeDashoffset: ((10 - timer) / 10) * 2 * Math.PI * 26
                }}
              />
            </svg>
            <span className="timer-number">{timer}</span>
          </div>
          <ul>
            <li ref={Option1} onClick={(e) => selectOption(1, e)}>{question.option1}</li>
            <li ref={Option2} onClick={(e) => selectOption(2, e)}>{question.option2}</li>
            <li ref={Option3} onClick={(e) => selectOption(3, e)}>{question.option3}</li>
            <li ref={Option4} onClick={(e) => selectOption(4, e)}>{question.option4}</li>
          </ul>
          <div className="button-area">
            {!lock ? (
              <button onClick={submitAnswer}>Submit</button>
            ) : (
              <button onClick={next}>Next</button>
            )}
          </div>
          <div className="index">{index + 1} of {data.length} questions</div>
        </>
      ) : (
        <div className="result-screen">
          <h2>You Scored {score} out of {data.length}</h2>
          <button className="reset-btn" onClick={reset}>🔁 Restart Quiz</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Quiz;