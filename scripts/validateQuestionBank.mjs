import { questionBank } from '../src/data/questionBank.js';
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS, isValidQuestion } from '../src/data/schema/quizSchema.js';

const errors = [];
const warnings = [];

const byCategory = Object.fromEntries(QUIZ_CATEGORIES.map((c) => [c, 0]));
const byDifficulty = Object.fromEntries(DIFFICULTY_LEVELS.map((d) => [d, 0]));
const byAnswerIndex = { 0: 0, 1: 0, 2: 0, 3: 0 };

const ids = new Set();
const stemMap = new Map();
const explanationMap = new Map();

const normalize = (value) => value.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();

for (const question of questionBank) {
  if (!isValidQuestion(question)) {
    errors.push(`Invalid schema: ${question?.id ?? 'unknown-id'}`);
    continue;
  }

  if (ids.has(question.id)) errors.push(`Duplicate id: ${question.id}`);
  ids.add(question.id);

  if (!question.tags || question.tags.length === 0) {
    errors.push(`Missing tags: ${question.id}`);
  }

  if (!question.category || !QUIZ_CATEGORIES.includes(question.category)) {
    errors.push(`Invalid category: ${question.id}`);
  }

  if (question.question.trim().length < 20) {
    errors.push(`Question stem too short: ${question.id}`);
  }

  if (question.explanation.trim().length < 30) {
    errors.push(`Explanation too short: ${question.id}`);
  }

  const normalizedStem = normalize(question.question);
  if (stemMap.has(normalizedStem)) {
    errors.push(`Duplicate question text: ${question.id} duplicates ${stemMap.get(normalizedStem)}`);
  } else {
    stemMap.set(normalizedStem, question.id);
  }

  const normalizedExplanation = normalize(question.explanation);
  if (explanationMap.has(normalizedExplanation) && !question.id.startsWith('reasoning-')) {
    warnings.push(`Potential duplicate explanation: ${question.id} and ${explanationMap.get(normalizedExplanation)}`);
  } else {
    explanationMap.set(normalizedExplanation, question.id);
  }

  const optionSet = new Set(question.options.map((opt) => normalize(opt)));
  if (optionSet.size !== question.options.length) {
    errors.push(`Duplicate options in ${question.id}`);
  }

  byCategory[question.category] += 1;
  byDifficulty[question.difficulty] += 1;
  byAnswerIndex[question.correctAnswer] += 1;
}

const total = questionBank.length;
if (total < 500) errors.push(`Expected at least 500 questions, found ${total}`);

for (const category of QUIZ_CATEGORIES) {
  if (!byCategory[category]) errors.push(`Category has no questions: ${category}`);
}

const easyPct = (byDifficulty.easy || 0) / total;
const mediumPct = (byDifficulty.medium || 0) / total;
const hardPct = (byDifficulty.hard || 0) / total;
const expertPct = (byDifficulty.expert || 0) / total;

if (easyPct < 0.25 || easyPct > 0.4) warnings.push(`Easy difficulty outside target band: ${(easyPct * 100).toFixed(1)}%`);
if (mediumPct < 0.35 || mediumPct > 0.55) warnings.push(`Medium difficulty outside target band: ${(mediumPct * 100).toFixed(1)}%`);
if (hardPct < 0.1 || hardPct > 0.3) warnings.push(`Hard difficulty outside target band: ${(hardPct * 100).toFixed(1)}%`);
if (byDifficulty.expert !== undefined && (expertPct < 0.05 || expertPct > 0.2)) warnings.push(`Expert difficulty outside target band: ${(expertPct * 100).toFixed(1)}%`);

const maxAnswer = Math.max(...Object.values(byAnswerIndex));
const minAnswer = Math.min(...Object.values(byAnswerIndex));
if (maxAnswer - minAnswer > total * 0.2) {
  warnings.push(`Answer-position bias detected: ${JSON.stringify(byAnswerIndex)}`);
}

console.log(`Total questions: ${total}`);
console.log('Category counts:', byCategory);
console.log('Difficulty counts:', byDifficulty);
console.log('Correct-answer index counts:', byAnswerIndex);

if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error('\nErrors:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
