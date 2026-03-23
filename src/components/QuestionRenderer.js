import { card } from './ui/card.js';
import { button } from './ui/button.js';

export function renderQuestion({
  question,
  questions,
  answers,
  index,
  total,
  selectedOption,
  onSelect,
  onNext,
  onPrevious,
  canGoPrevious
}) {
  const unansweredCount = Array.isArray(questions)
    ? questions.reduce((count, currentQuestion) => {
        return answers[currentQuestion.id] === undefined ? count + 1 : count;
      }, 0)
    : 0;
  const isFinalQuestion = index + 1 === total;

  const wrapper = document.createElement('div');
  wrapper.className = 'stack';

  const progress = document.createElement('p');
  progress.className = 'question-progress';
  progress.textContent = `Question ${index + 1} of ${total}`;

  const stem = document.createElement('p');
  stem.className = 'question-stem';
  stem.textContent = question.question;

  const options = document.createElement('div');
  options.className = 'stack';

  question.options.forEach((option, optionIndex) => {
    const optionBtn = button({
      label: `${String.fromCharCode(65 + optionIndex)}. ${option}`,
      variant: selectedOption === optionIndex ? 'secondary' : 'ghost',
      className: 'option-btn',
      onClick: () => onSelect(optionIndex)
    });
    optionBtn.setAttribute('aria-pressed', String(selectedOption === optionIndex));
    options.appendChild(optionBtn);
  });

  const controls = document.createElement('div');
  controls.className = 'quiz-controls';

  const previousButton = button({
    label: 'Previous',
    onClick: onPrevious,
    variant: 'ghost',
    className: 'nav-btn'
  });
  previousButton.disabled = !canGoPrevious;

  const nextButton = button({
    label: isFinalQuestion ? 'Submit Quiz' : 'Next',
    onClick: () => {
      if (isFinalQuestion && unansweredCount > 0) {
        const shouldSubmit = window.confirm(
          `You still have ${unansweredCount} unanswered question${unansweredCount === 1 ? '' : 's'}. Submitting now will score them as incorrect. Continue?`
        );

        if (!shouldSubmit) {
          return;
        }
      }

      onNext();
    },
    variant: 'primary',
    className: 'nav-btn'
  });

  const submitNote = document.createElement('p');
  submitNote.className = 'question-progress';
  submitNote.textContent = unansweredCount
    ? `Unanswered: ${unansweredCount}. You can submit now, but unanswered questions count as incorrect.`
    : 'All questions answered. You are ready to submit.';

  controls.append(previousButton, nextButton);
  wrapper.append(progress, stem);
  wrapper.append(options, controls, submitNote);

  return card({ title: 'Physio Quiz', body: wrapper });
}
