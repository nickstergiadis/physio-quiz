import { card } from '../components/ui/card.js';
import { categorySelector } from '../components/CategorySelector.js';

function buildActionButton(text, onClick, disabled = false, className = 'btn btn-secondary') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
}

export function homePage({
  onStart,
  initialFilters,
  startError = '',
  questionSource,
  profile,
  profileMessage = '',
  onCreateProfile,
  onResumeProfile,
  onCopyResumeCode,
  resumeInputValue = ''
}) {
  const content = document.createElement('div');
  content.className = 'stack';

  const intro = document.createElement('p');
  intro.textContent =
    'Choose quiz mode, category, and difficulty, then run through one question at a time with full answer explanations at the end.';

  const highlights = document.createElement('ul');
  highlights.className = 'feature-list';
  highlights.innerHTML = `
    <li>Categories: shoulder, knee, low back, ankle, cervical spine, exercise prescription, and clinical reasoning</li>
    <li>Modes: Normal Quiz (standard recall/application) or Clinical Reasoning (case-based scenarios)</li>
    <li>4-option multiple-choice questions with next/previous navigation</li>
    <li>Automatic scoring, answer review, and local progress history</li>
  `;

  const selector = categorySelector({ onStart, initialFilters, startError, questionSource });

  const profilePanel = document.createElement('section');
  profilePanel.className = 'profile-panel stack';

  const profileTitle = document.createElement('h3');
  profileTitle.className = 'profile-title';
  profileTitle.textContent = 'Saved progress';

  const profileDescription = document.createElement('p');
  profileDescription.className = 'question-progress';
  profileDescription.textContent =
    'Save progress to get a resume code. Keep the code safe—it grants access to your saved quiz history and current session.';

  const status = document.createElement('p');
  status.className = 'question-progress';
  status.textContent = profile?.resumeCode
    ? `Linked resume code: ${profile.resumeCode}`
    : 'No saved profile linked on this device yet.';

  const createButton = buildActionButton(
    profile?.resumeCode ? 'Refresh saved profile' : 'Save progress',
    () => onCreateProfile?.(),
    false,
    'btn btn-secondary'
  );

  const codeWrap = document.createElement('div');
  codeWrap.className = 'profile-code-row';

  const codeBox = document.createElement('code');
  codeBox.className = 'resume-code';
  codeBox.textContent = profile?.resumeCode || 'Not created yet';

  const copyButton = buildActionButton('Copy code', () => onCopyResumeCode?.(), !profile?.resumeCode, 'btn btn-ghost');
  codeWrap.append(codeBox, copyButton);

  const resumeForm = document.createElement('form');
  resumeForm.className = 'stack';

  const resumeLabel = document.createElement('label');
  resumeLabel.className = 'field-label';
  resumeLabel.htmlFor = 'resume-code-input';
  resumeLabel.textContent = 'Resume saved progress';

  const resumeInput = document.createElement('input');
  resumeInput.id = 'resume-code-input';
  resumeInput.className = 'input';
  resumeInput.name = 'resumeCode';
  resumeInput.autocomplete = 'off';
  resumeInput.spellcheck = false;
  resumeInput.placeholder = 'Enter your resume code';
  resumeInput.value = resumeInputValue;

  const resumeButton = document.createElement('button');
  resumeButton.type = 'submit';
  resumeButton.className = 'btn btn-primary';
  resumeButton.textContent = 'Resume saved progress';

  resumeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    onResumeProfile?.(resumeInput.value);
  });

  resumeForm.append(resumeLabel, resumeInput, resumeButton);

  const profileMessageNode = document.createElement('p');
  profileMessageNode.className = profileMessage.toLowerCase().includes('error') ? 'setup-error' : 'question-progress';
  profileMessageNode.textContent = profileMessage;

  profilePanel.append(profileTitle, profileDescription, status, createButton, codeWrap, resumeForm, profileMessageNode);
  content.append(intro, highlights, selector, profilePanel);

  return card({ title: 'Physio Quiz', body: content });
}
