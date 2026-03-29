import { card } from '../components/ui/card.js';

function section(title, paragraphs) {
  const wrap = document.createElement('section');
  wrap.className = 'stack';

  const heading = document.createElement('h3');
  heading.textContent = title;
  wrap.appendChild(heading);

  paragraphs.forEach((copy) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = copy;
    wrap.appendChild(paragraph);
  });

  return wrap;
}

export function legalPage({ title, intro, sections }) {
  const body = document.createElement('div');
  body.className = 'stack';

  const introCopy = document.createElement('p');
  introCopy.textContent = intro;
  body.appendChild(introCopy);

  sections.forEach((entry) => {
    body.appendChild(section(entry.title, entry.paragraphs));
  });

  return card({ title, body });
}
