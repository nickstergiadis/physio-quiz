export function button({ label, onClick, variant = 'primary', type = 'button', className = '' }) {
  const btn = document.createElement('button');
  btn.className = `btn btn-${variant} ${className}`.trim();
  btn.type = type;
  btn.textContent = label;
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}
