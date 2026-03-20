import { renderQuestion } from '../components/QuestionRenderer.js';

export function quizPage({ questions, answers, currentIndex, onSelectAnswer, onNext, onPrevious }) {
  const question = questions[currentIndex];
  if (!question) {
    const empty = document.createElement('p');
    empty.textContent = 'No questions available for the selected filters. Please try another selection.';
    return empty;
  }

  return renderQuestion({
    question,
    questions,
    answers,
    index: currentIndex,
    total: questions.length,
    selectedOption: answers[question.id],
    onSelect: (optionIndex) => onSelectAnswer(question.id, optionIndex),
    onNext,
    onPrevious,
    canGoPrevious: currentIndex > 0
  });
}
