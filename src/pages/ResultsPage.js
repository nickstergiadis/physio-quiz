import { card } from '../components/ui/card.js';
import { button } from '../components/ui/button.js';

function getOptionLabel(question, answerIndex) {
  if (answerIndex === undefined || answerIndex === null || answerIndex < 0) {
    return 'Not answered';
  }
  return question.options[answerIndex] ?? 'Invalid answer';
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]+>/g, '').trim();
}

function createList(items, type = 'ul') {
  const list = document.createElement(type === 'ol' ? 'ol' : 'ul');
  items.forEach((itemText) => {
    const li = document.createElement('li');
    li.textContent = itemText;
    list.appendChild(li);
  });
  return list;
}

function parseHtmlListBlock(block) {
  const blocks = [];
  const htmlListPattern = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = htmlListPattern.exec(block)) !== null) {
    const listType = match[1].toLowerCase();
    const listBody = match[2];
    const items = Array.from(listBody.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
      .map(([, item]) => stripHtmlTags(item))
      .filter(Boolean);

    if (items.length) {
      blocks.push(createList(items, listType));
    }
  }

  return blocks;
}

function normalizeGuidelineBreaks(text) {
  return text.replace(/([^\n])\s*((?:NICE|NCCN|ACP|WHO)\s+Guideline\s*\d{4}\s*:)/gi, '$1\n$2');
}

function buildExplanationContent(explanationText = '') {
  const container = document.createElement('div');
  container.className = 'explanation-content';

  const normalized = normalizeGuidelineBreaks(String(explanationText).replace(/\r\n?/g, '\n')).trim();
  if (!normalized) {
    return container;
  }

  const blocks = normalized.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);

  blocks.forEach((block) => {
    if (/<(?:ul|ol)\b/i.test(block)) {
      const htmlLists = parseHtmlListBlock(block);
      if (htmlLists.length) {
        htmlLists.forEach((list) => container.appendChild(list));
        return;
      }
    }

    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const listItems = [];

    const appendParagraph = (line) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = stripHtmlTags(line);
      container.appendChild(paragraph);
    };

    const flushList = () => {
      if (!listItems.length) return;
      container.appendChild(createList([...listItems]));
      listItems.length = 0;
    };

    lines.forEach((line) => {
      const listMatch = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
      if (listMatch) {
        listItems.push(stripHtmlTags(listMatch[1].trim()));
        return;
      }

      flushList();
      appendParagraph(line);
    });

    flushList();
  });

  return container;
}

export function resultsPage({ score, review, unansweredCount = 0, onRestart }) {
  const body = document.createElement('div');
  body.className = 'stack';

  const summary = document.createElement('p');
  summary.className = 'score';
  summary.textContent = `Score: ${score.correct}/${score.total} (${score.percent}%)`;

  const unansweredSummary = document.createElement('p');
  unansweredSummary.className = 'question-progress';
  unansweredSummary.textContent = `Unanswered: ${unansweredCount}`;

  body.appendChild(summary);
  body.appendChild(unansweredSummary);

  review.forEach((item) => {
    const result = document.createElement('article');
    result.className = 'result-item';

    const heading = document.createElement('h3');
    heading.textContent = item.question;

    const userAnswer = document.createElement('p');
    const userLabel = document.createElement('strong');
    userLabel.textContent = 'Your answer: ';
    userAnswer.appendChild(userLabel);
    userAnswer.append(`${getOptionLabel(item, item.selectedAnswer)} ${item.isCorrect ? '✅' : '❌'}`);

    const correctAnswer = document.createElement('p');
    const correctLabel = document.createElement('strong');
    correctLabel.textContent = 'Correct answer: ';
    correctAnswer.appendChild(correctLabel);
    correctAnswer.append(getOptionLabel(item, item.correctAnswer));

    const explanationWrap = document.createElement('div');
    explanationWrap.className = 'result-explanation';
    const explanationLabel = document.createElement('strong');
    explanationLabel.textContent = 'Explanation:';
    explanationWrap.append(explanationLabel, buildExplanationContent(item.explanation));

    result.append(heading, userAnswer, correctAnswer, explanationWrap);

    body.appendChild(result);
  });

  body.appendChild(button({ label: 'Start New Quiz', onClick: onRestart }));

  return card({ title: 'Quiz Results', body });
}
