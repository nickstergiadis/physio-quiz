import { quizCategories, difficultyLevels } from '../data/questionBank.js';
import { titleCase } from '../utils/format/titleCase.js';
import { getQuestionPool } from '../utils/quizEngine.js';

function getQuizLengthOptions(availableQuestions) {
  if (availableQuestions <= 0) {
    return [];
  }

  if (availableQuestions <= 5) {
    return [availableQuestions];
  }

  const options = [];
  for (let value = 5; value < availableQuestions; value += 5) {
    options.push(value);
  }

  if (options[options.length - 1] !== availableQuestions) {
    options.push(availableQuestions);
  }

  return options;
}

function getCategoryOptions(mode = 'normal') {
  if (mode === 'clinical-reasoning') {
    return ['all', 'clinical reasoning'];
  }

  return ['all', ...quizCategories];
}

function createLabel(text, htmlFor) {
  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = htmlFor;
  label.textContent = text;
  return label;
}

function createSelect(name, id) {
  const select = document.createElement('select');
  select.className = 'input';
  select.name = name;
  select.id = id;
  return select;
}

export function categorySelector({
  onStart,
  initialFilters = { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
  startError = '',
  questionSource
}) {
  const form = document.createElement('form');
  form.className = 'setup-form stack';

  const grid = document.createElement('div');
  grid.className = 'setup-grid';

  const modeLabel = createLabel('Mode', 'mode');
  const modeSelect = createSelect('mode', 'mode');
  [
    { value: 'normal', label: 'Standard Mode' },
    { value: 'clinical-reasoning', label: 'Clinical Reasoning Mode' }
  ].forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    modeSelect.appendChild(option);
  });

  const categoryLabel = createLabel('Category', 'category');
  const categorySelect = createSelect('category', 'category');

  function renderCategoryOptions(mode, selectedCategory) {
    const nextOptions = getCategoryOptions(mode);
    categorySelect.innerHTML = '';

    nextOptions.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value === 'all' ? 'All Categories' : titleCase(value);
      categorySelect.appendChild(option);
    });

    if (nextOptions.includes(selectedCategory)) {
      categorySelect.value = selectedCategory;
      return;
    }

    categorySelect.value = mode === 'clinical-reasoning' ? 'clinical reasoning' : 'all';
  }

  const difficultyLabel = createLabel('Difficulty', 'difficulty');
  const difficultySelect = createSelect('difficulty', 'difficulty');
  ['all', ...difficultyLevels].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === 'all' ? 'All Difficulty Levels' : titleCase(value);
    difficultySelect.appendChild(option);
  });

  function getDifficultyCounts(selection) {
    const counts = Object.fromEntries(difficultyLevels.map((level) => [level, 0]));
    const availableQuestions = getQuestionPool({
      mode: selection.mode,
      category: selection.category,
      difficulty: 'all',
      questionSource
    });

    availableQuestions.forEach((question) => {
      if (counts[question.difficulty] !== undefined) {
        counts[question.difficulty] += 1;
      }
    });

    return { availableQuestions, counts };
  }

  function updateDifficultyOptions(counts) {
    const currentValue = difficultySelect.value;
    let hasActiveSelection = currentValue === 'all';

    Array.from(difficultySelect.children).forEach((option) => {
      if (option.value === 'all') {
        option.disabled = false;
        option.hidden = false;
        return;
      }

      const count = counts[option.value] || 0;
      const isEnabled = count > 0;
      option.disabled = !isEnabled;
      option.hidden = !isEnabled;

      if (isEnabled && option.value === currentValue) {
        hasActiveSelection = true;
      }
    });

    if (!hasActiveSelection) {
      difficultySelect.value = 'all';
    }
  }

  const lengthLabel = createLabel('Quiz Length', 'length');
  const lengthSelect = createSelect('length', 'length');
  let preferredLength = Number.isInteger(initialFilters.length) && initialFilters.length > 0 ? initialFilters.length : 10;

  function updateLengthOptions(availableQuestions) {
    const options = getQuizLengthOptions(availableQuestions);
    const currentLength = Number(lengthSelect.value);
    const desiredLength = Number.isInteger(currentLength) && currentLength > 0 ? currentLength : preferredLength;
    lengthSelect.innerHTML = '';

    options.forEach((value) => {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = `${value} questions`;
      lengthSelect.appendChild(option);
    });

    if (options.length === 0) {
      lengthSelect.disabled = true;
      return 0;
    }

    lengthSelect.disabled = false;
    const selectedLength = options.includes(desiredLength)
      ? desiredLength
      : options.filter((value) => value <= desiredLength).at(-1) ?? options[options.length - 1];
    lengthSelect.value = String(selectedLength);
    preferredLength = selectedLength;
    return selectedLength;
  }

  const orderLabel = createLabel('Question Order', 'order');
  const orderSelect = createSelect('order', 'order');
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
  availability.setAttribute('aria-live', 'polite');

  const errorText = document.createElement('p');
  errorText.className = 'setup-error';
  errorText.setAttribute('aria-live', 'polite');
  let activeStartError = startError;

  function resolveSelection() {
    return {
      mode: modeSelect.value,
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      length: Number(lengthSelect.value),
      order: orderSelect.value
    };
  }

  function updateAvailability({ clearError = false } = {}) {
    if (clearError) {
      activeStartError = '';
    }

    const selection = resolveSelection();
    const { availableQuestions, counts } = getDifficultyCounts(selection);
    updateDifficultyOptions(counts);

    const selectedDifficulty = difficultySelect.value;
    const available = selectedDifficulty === 'all' ? availableQuestions.length : counts[selectedDifficulty] || 0;
    const requested = updateLengthOptions(available);
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
    errorText.textContent = activeStartError;
  }

  modeSelect.value = initialFilters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal';
  renderCategoryOptions(modeSelect.value, typeof initialFilters.category === 'string' ? initialFilters.category : 'all');
  difficultySelect.value = typeof initialFilters.difficulty === 'string' ? initialFilters.difficulty : 'all';
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

  modeSelect.addEventListener('change', () => {
    renderCategoryOptions(modeSelect.value, categorySelect.value);
    updateAvailability({ clearError: true });
  });

  [categorySelect, difficultySelect, lengthSelect, orderSelect].forEach((select) => {
    select.addEventListener('change', () => updateAvailability({ clearError: true }));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    onStart(resolveSelection());
  });

  updateAvailability();

  return form;
}
