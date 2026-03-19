import { quizCategories, difficultyLevels } from '../data/questionBank.js';
import { titleCase } from '../utils/format/titleCase.js';
import { getQuestionPool } from '../utils/quizEngine.js';

const QUIZ_LENGTH_OPTIONS = [5, 10, 15, 20];

function createLabel(text) {
  const label = document.createElement('label');
  label.className = 'field-label';
  label.textContent = text;
  return label;
}

function createSelect(name) {
  const select = document.createElement('select');
  select.className = 'input';
  select.name = name;
  return select;
}

export function categorySelector({
  onStart,
  initialFilters = { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
  startError = ''
}) {
  const form = document.createElement('form');
  form.className = 'setup-form stack';

  const grid = document.createElement('div');
  grid.className = 'setup-grid';

  const modeLabel = createLabel('Mode');
  const modeSelect = createSelect('mode');
  [
    { value: 'normal', label: 'Standard Mode' },
    { value: 'clinical-reasoning', label: 'Clinical Reasoning Mode' }
  ].forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    modeSelect.appendChild(option);
  });

  const categoryLabel = createLabel('Category');
  const categorySelect = createSelect('category');
  ['all', ...quizCategories].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === 'all' ? 'All Categories' : titleCase(value);
    categorySelect.appendChild(option);
  });

  const difficultyLabel = createLabel('Difficulty');
  const difficultySelect = createSelect('difficulty');
  ['all', ...difficultyLevels].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === 'all' ? 'All Difficulty Levels' : titleCase(value);
    difficultySelect.appendChild(option);
  });

  const lengthLabel = createLabel('Quiz Length');
  const lengthSelect = createSelect('length');
  QUIZ_LENGTH_OPTIONS.forEach((value) => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = `${value} questions`;
    lengthSelect.appendChild(option);
  });

  const orderLabel = createLabel('Question Order');
  const orderSelect = createSelect('order');
  [
    { value: 'shuffled', label: 'Shuffled' },
    { value: 'fixed', label: 'Fixed (by question ID)' }
  ].forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    orderSelect.appendChild(option);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn-primary';
  submit.textContent = 'Start Quiz';

  const availability = document.createElement('p');
  availability.className = 'question-progress';

  const errorText = document.createElement('p');
  errorText.className = 'setup-error';

  function resolveSelection() {
    return {
      mode: modeSelect.value,
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      length: Number(lengthSelect.value),
      order: orderSelect.value
    };
  }

  function updateAvailability() {
    const selection = resolveSelection();
    const available = getQuestionPool(selection).length;
    const requested = selection.length;
    const questionWord = available === 1 ? 'question' : 'questions';

    if (available === 0) {
      availability.textContent = 'No matching questions. Change filters to continue.';
      errorText.textContent = '';
      submit.disabled = true;
      return;
    }

    if (available < requested) {
      availability.textContent = `Only ${available} ${questionWord} available. The quiz will use all of them.`;
    } else {
      availability.textContent = `${available} ${questionWord} available for this setup.`;
    }
    submit.disabled = false;
    errorText.textContent = startError;
  }

  modeSelect.value = initialFilters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal';
  categorySelect.value = typeof initialFilters.category === 'string' ? initialFilters.category : 'all';
  difficultySelect.value = typeof initialFilters.difficulty === 'string' ? initialFilters.difficulty : 'all';
  lengthSelect.value = String(QUIZ_LENGTH_OPTIONS.includes(initialFilters.length) ? initialFilters.length : 10);
  orderSelect.value = initialFilters.order === 'fixed' ? 'fixed' : 'shuffled';

  const fields = [
    [modeLabel, modeSelect],
    [categoryLabel, categorySelect],
    [difficultyLabel, difficultySelect],
    [lengthLabel, lengthSelect],
    [orderLabel, orderSelect]
  ];

  fields.forEach(([label, input]) => {
    const row = document.createElement('div');
    row.className = 'stack';
    row.append(label, input);
    grid.appendChild(row);
  });

  form.append(grid, availability, errorText, submit);

  [modeSelect, categorySelect, difficultySelect, lengthSelect, orderSelect].forEach((select) => {
    select.addEventListener('change', updateAvailability);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    onStart(resolveSelection());
  });

  updateAvailability();

  return form;
}
