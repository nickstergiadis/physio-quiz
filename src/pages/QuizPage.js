import { renderQuestion } from '../components/QuestionRenderer.js';

export function quizPage({ questions, answers, currentIndex, onSelectAnswer, onNext }) {
  const question = questions[currentIndex];
  if (!question) {
    const empty = document.createElement('p');
    empty.textContent = 'No questions available for the selected filters. Please try another selection.';
    return empty;
  }

  return renderQuestion({
    question,
    index: currentIndex,
    total: questions.length,
    selectedOptionId: answers[question.id],
    onSelect: (optionId) => onSelectAnswer(question.id, optionId),
    onNext
  });
}
