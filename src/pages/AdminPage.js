import { card } from '../components/ui/card.js';
import { button } from '../components/ui/button.js';
import { DIFFICULTY_LEVELS, QUIZ_CATEGORIES, isValidQuestion } from '../data/schema/quizSchema.js';

const QUIZ_MODES = ['normal', 'clinical-reasoning'];

function fieldLabel(text, htmlFor) {
  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = htmlFor;
  label.textContent = text;
  return label;
}

function makeInput(id, placeholder = '') {
  const input = document.createElement('input');
  input.id = id;
  input.className = 'input';
  input.placeholder = placeholder;
  return input;
}

function makeTextarea(id, placeholder = '') {
  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.className = 'input';
  textarea.placeholder = placeholder;
  textarea.rows = 4;
  return textarea;
}

function makeSelect(id, values, formatLabel = (value) => value) {
  const select = document.createElement('select');
  select.id = id;
  select.className = 'input';
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = formatLabel(value);
    select.appendChild(option);
  });
  return select;
}

function normalizeQuestion(formValues) {
  const tags = formValues.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const normalizedTags = formValues.mode === 'clinical-reasoning'
    ? Array.from(new Set([...tags, 'clinical-reasoning']))
    : tags.filter((tag) => tag !== 'clinical-reasoning');

  return {
    id: `dev-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    category: formValues.category,
    difficulty: formValues.difficulty,
    question: formValues.question.trim(),
    options: formValues.options.map((option) => option.trim()),
    correctAnswer: formValues.correctAnswer,
    explanation: formValues.explanation.trim(),
    tags: normalizedTags
  };
}

function validateFormValues(formValues) {
  const errors = [];

  if (!formValues.category) errors.push('Category is required.');
  if (!formValues.difficulty) errors.push('Difficulty is required.');
  if (!formValues.mode) errors.push('Mode is required.');
  if (!formValues.question.trim()) errors.push('Question text is required.');
  if (!formValues.explanation.trim()) errors.push('Explanation is required.');

  const missingOptions = formValues.options.some((option) => !option.trim());
  if (missingOptions) errors.push('All four options are required.');

  if (!Number.isInteger(formValues.correctAnswer) || formValues.correctAnswer < 0 || formValues.correctAnswer > 3) {
    errors.push('Correct answer must be one of the provided options.');
  }

  if (!formValues.tags.trim()) {
    errors.push('At least one tag is required.');
  }

  return errors;
}

function renderPreview(question) {
  const wrap = document.createElement('div');
  wrap.className = 'stack preview-box';

  const heading = document.createElement('h3');
  heading.textContent = 'Preview';

  const meta = document.createElement('p');
  meta.className = 'question-tags';
  meta.textContent = `${question.category} · ${question.difficulty} · ${question.tags.join(', ') || 'no tags'}`;

  const prompt = document.createElement('p');
  prompt.className = 'question-stem';
  prompt.textContent = question.question;

  const list = document.createElement('ol');
  question.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;
    if (index === question.correctAnswer) {
      li.className = 'preview-correct';
    }
    list.appendChild(li);
  });

  const explanation = document.createElement('p');
  explanation.textContent = `Explanation: ${question.explanation}`;

  wrap.append(heading, meta, prompt, list, explanation);
  return wrap;
}

export function adminPage({ onSaveQuestion, existingQuestions = [] }) {
  const content = document.createElement('div');
  content.className = 'stack';

  const notice = document.createElement('p');
  notice.className = 'dev-notice';
  notice.textContent = 'Dev/Admin page (local only). This is intentionally lightweight and not auth-protected for production.';

  const form = document.createElement('form');
  form.className = 'stack setup-form';

  const grid = document.createElement('div');
  grid.className = 'setup-grid';

  const categorySelect = makeSelect('admin-category', QUIZ_CATEGORIES);
  const difficultySelect = makeSelect('admin-difficulty', DIFFICULTY_LEVELS);
  const modeSelect = makeSelect('admin-mode', QUIZ_MODES, (mode) => (mode === 'normal' ? 'normal' : 'clinical reasoning'));
  const correctAnswerSelect = makeSelect(
    'admin-correct-answer',
    ['0', '1', '2', '3'],
    (value) => `Option ${Number(value) + 1}`
  );

  const questionInput = makeTextarea('admin-question', 'Question stem');
  const explanationInput = makeTextarea('admin-explanation', 'Explain why the answer is correct');
  const tagsInput = makeInput('admin-tags', 'Comma-separated tags (required)');

  const optionInputs = ['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((placeholder, index) => {
    const input = makeInput(`admin-option-${index}`, placeholder);
    return input;
  });

  grid.append(
    fieldLabel('Category', 'admin-category'),
    categorySelect,
    fieldLabel('Difficulty', 'admin-difficulty'),
    difficultySelect,
    fieldLabel('Mode', 'admin-mode'),
    modeSelect,
    fieldLabel('Correct answer', 'admin-correct-answer'),
    correctAnswerSelect
  );

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'stack';
  const optionsHeading = document.createElement('p');
  optionsHeading.className = 'field-label';
  optionsHeading.textContent = 'Options';
  optionsWrap.append(optionsHeading, ...optionInputs);

  const errorBox = document.createElement('p');
  errorBox.className = 'setup-error';

  const statusBox = document.createElement('p');
  statusBox.className = 'question-tags';

  const previewContainer = document.createElement('div');

  let previewedQuestion = null;

  const previewButton = button({ label: 'Preview question', variant: 'secondary' });
  const saveButton = button({ label: 'Save question', variant: 'primary' });

  previewButton.addEventListener('click', () => {
    errorBox.textContent = '';
    statusBox.textContent = '';

    const formValues = {
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      mode: modeSelect.value,
      question: questionInput.value,
      options: optionInputs.map((input) => input.value),
      correctAnswer: Number(correctAnswerSelect.value),
      explanation: explanationInput.value,
      tags: tagsInput.value
    };

    const errors = validateFormValues(formValues);
    if (errors.length) {
      previewedQuestion = null;
      previewContainer.innerHTML = '';
      errorBox.textContent = errors.join(' ');
      return;
    }

    const normalizedQuestion = normalizeQuestion(formValues);
    if (!isValidQuestion(normalizedQuestion)) {
      previewedQuestion = null;
      previewContainer.innerHTML = '';
      errorBox.textContent = 'Preview failed schema validation. Check field values and try again.';
      return;
    }

    previewedQuestion = normalizedQuestion;
    previewContainer.innerHTML = '';
    previewContainer.appendChild(renderPreview(normalizedQuestion));
    statusBox.textContent = 'Preview ready. Save to add this question to local dev state.';
  });

  saveButton.addEventListener('click', () => {
    errorBox.textContent = '';

    if (!previewedQuestion) {
      errorBox.textContent = 'Preview the question first, then save.';
      return;
    }

    onSaveQuestion(previewedQuestion);
    previewedQuestion = null;
    previewContainer.innerHTML = '';
    form.reset();
    categorySelect.value = QUIZ_CATEGORIES[0];
    difficultySelect.value = DIFFICULTY_LEVELS[0];
    modeSelect.value = QUIZ_MODES[0];
    correctAnswerSelect.value = '0';

    statusBox.textContent = `Saved. Local dev question count: ${existingQuestions.length + 1}`;
  });

  const actions = document.createElement('div');
  actions.className = 'quiz-controls';
  actions.append(previewButton, saveButton);

  form.append(
    grid,
    fieldLabel('Question', 'admin-question'),
    questionInput,
    optionsWrap,
    fieldLabel('Explanation', 'admin-explanation'),
    explanationInput,
    fieldLabel('Tags', 'admin-tags'),
    tagsInput,
    actions,
    errorBox,
    statusBox,
    previewContainer
  );

  const existingInfo = document.createElement('p');
  existingInfo.className = 'question-tags';
  existingInfo.textContent = `Saved local dev questions: ${existingQuestions.length}`;

  content.append(notice, existingInfo, form);

  return card({ title: 'Question Admin Tool (Dev)', body: content });
}
