import { quizCategories, difficultyLevels } from '../data/questionBank.js';

function titleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function categorySelector({ onStart }) {
  const form = document.createElement('form');
  form.className = 'stack';

  const categoryLabel = document.createElement('label');
  categoryLabel.className = 'field-label';
  categoryLabel.textContent = 'Category';

  const categorySelect = document.createElement('select');
  categorySelect.className = 'input';
  categorySelect.name = 'category';
  ['all', ...quizCategories].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === 'all' ? 'All Categories' : titleCase(value);
    categorySelect.appendChild(option);
  });

  const difficultyLabel = document.createElement('label');
  difficultyLabel.className = 'field-label';
  difficultyLabel.textContent = 'Difficulty';

  const difficultySelect = document.createElement('select');
  difficultySelect.className = 'input';
  difficultySelect.name = 'difficulty';
  ['all', ...difficultyLevels].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === 'all' ? 'All Difficulty Levels' : titleCase(value);
    difficultySelect.appendChild(option);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn-primary';
  submit.textContent = 'Start Quiz';

  form.append(categoryLabel, categorySelect, difficultyLabel, difficultySelect, submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onStart({
      category: categorySelect.value,
      difficulty: difficultySelect.value
    });
  });

  return form;
}
