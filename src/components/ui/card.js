export function card({ title, body, footer, className = '' }) {
  const el = document.createElement('section');
  el.className = `card ${className}`.trim();

  if (title) {
    const h = document.createElement('h2');
    h.className = 'card-title';
    h.textContent = title;
    el.appendChild(h);
  }

  if (body) {
    const b = document.createElement('div');
    b.className = 'card-body';
    b.appendChild(body);
    el.appendChild(b);
  }

  if (footer) {
    const f = document.createElement('div');
    f.className = 'card-footer';
    f.appendChild(footer);
    el.appendChild(f);
  }

  return el;
}
