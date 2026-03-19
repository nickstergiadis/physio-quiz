import { card } from './ui/card.js';
import { button } from './ui/button.js';

export function renderQuestion({ question, index, total, selectedOptionId, onSelect, onNext }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'stack';

  const progress = document.createElement('p');
  progress.className = 'question-progress';
  progress.textContent = `Question ${index + 1} of ${total}`;

  const stem = document.createElement('p');
  stem.className = 'question-stem';
  stem.textContent = question.stem;

  const options = document.createElement('div');
  options.className = 'stack';

  question.options.forEach((option) => {
    const optionBtn = button({
      label: option.label,
      variant: selectedOptionId === option.id ? 'secondary' : 'ghost',
      className: 'option-btn',
      onClick: () => onSelect(option.id)
    });
    options.appendChild(optionBtn);
  });

  const nextBtn = button({
    label: index + 1 === total ? 'Finish Quiz' : 'Next Question',
    onClick: onNext,
    variant: 'primary'
  });

  wrapper.append(progress, stem, options, nextBtn);
  return card({ title: 'Clinical Quiz', body: wrapper });
}
