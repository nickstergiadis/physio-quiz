import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from './schema/quizSchema.js';
import { NORMAL_QUESTION_SETS } from './questions/normalQuestions.js';
import { CLINICAL_REASONING_QUESTION_SETS } from './questions/clinicalReasoningQuestions.js';
import { EXPERT_QUESTION_SETS } from './questions/expertQuestions.js';
import {
  dedupeQuestionsById,
  rebalanceAnswerKeyPositions,
  validateQuestionObjects
} from '../utils/questionBankUtils.js';

function flattenQuestionSets(questionSets) {
  return Object.values(questionSets).flat();
}

const rawQuestionBank = [
  ...flattenQuestionSets(NORMAL_QUESTION_SETS),
  ...flattenQuestionSets(CLINICAL_REASONING_QUESTION_SETS),
  ...flattenQuestionSets(EXPERT_QUESTION_SETS)
];

const dedupedQuestionBank = dedupeQuestionsById(rawQuestionBank);
const balancedQuestionBank = rebalanceAnswerKeyPositions(dedupedQuestionBank);

export const questionBank = validateQuestionObjects(balancedQuestionBank);

export const quizCategories = QUIZ_CATEGORIES;
export const difficultyLevels = DIFFICULTY_LEVELS;
