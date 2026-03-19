import { card } from './ui/card.js';
import { button } from './ui/button.js';

export function renderQuestion({
  question,
  index,
  total,
  selectedOption,
  onSelect,
  onNext,
  onPrevious,
  canGoPrevious
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'stack';

  const progress = document.createElement('p');
  progress.className = 'question-progress';
  progress.textContent = `Question ${index + 1} of ${total}`;

  const stem = document.createElement('p');
  stem.className = 'question-stem';
  stem.textContent = question.question;

  const tagRow = document.createElement('p');
  tagRow.className = 'question-tags';
  tagRow.textContent = question.tags?.length ? `Tags: ${question.tags.join(', ')}` : '';

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
    label: index + 1 === total ? 'Submit Quiz' : 'Next',
    onClick: onNext,
    variant: 'primary',
    className: 'nav-btn'
  });

  controls.append(previousButton, nextButton);
  wrapper.append(progress, stem);
  if (tagRow.textContent) {
    wrapper.appendChild(tagRow);
  }
  wrapper.append(options, controls);

  return card({ title: 'Physio Quiz', body: wrapper });
}
