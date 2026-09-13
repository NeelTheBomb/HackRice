import { useState } from "react";

interface QuizQuestion {
  id: string;
  prompt: string;
  correctAnswer: boolean;
  explanation: string;
}

const questions: readonly QuizQuestion[] = [
  {
    id: "college-number",
    prompt: "Is Chao Rice's 12th residential college?",
    correctAnswer: true,
    explanation: "Chao opened in fall 2026 as Rice's 12th residential college.",
  },
  {
    id: "tower-count",
    prompt: "Does Chao have only one residential tower?",
    correctAnswer: false,
    explanation: "Chao has two towers: one five stories tall and one 10 stories tall.",
  },
  {
    id: "quad-size",
    prompt: "Is Chao's central quad about 11,000 square feet?",
    correctAnswer: true,
    explanation: "The central quad covers approximately 11,000 square feet.",
  },
];

export function ChaoQuiz() {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({});

  return (
    <section className="location-activity" aria-labelledby="chao-quiz-title">
      <h2 id="chao-quiz-title">Chao quick quiz</h2>
      <p>Test what you learned. Choose yes or no for each question.</p>

      {questions.map((question) => {
        const answer = answers[question.id];
        const isCorrect = answer === question.correctAnswer;

        return (
          <fieldset className="quiz-question" key={question.id}>
            <legend>{question.prompt}</legend>
            <div className="quiz-question__answers">
              {[true, false].map((choice) => (
                <button
                  type="button"
                  aria-pressed={answer === choice}
                  key={String(choice)}
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: choice,
                    }))
                  }
                >
                  {choice ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {answer !== undefined ? (
              <p
                className={`quiz-question__feedback quiz-question__feedback--${
                  isCorrect ? "correct" : "incorrect"
                }`}
                role="status"
              >
                <strong>{isCorrect ? "Correct!" : "Not quite."}</strong>{" "}
                {question.explanation}
              </p>
            ) : null}
          </fieldset>
        );
      })}
    </section>
  );
}
