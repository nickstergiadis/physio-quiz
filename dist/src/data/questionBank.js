import { isValidQuestion } from '../types/quizSchema.js';

/** @type {import('../types/quizSchema.js').QuizQuestion[]} */
export const questionBank = [
  {
    id: 'q-001',
    category: 'musculoskeletal',
    difficulty: 'easy',
    stem: 'Which structure is most commonly involved in lateral epicondylalgia?',
    options: [
      { id: 'a', label: 'Flexor carpi radialis tendon' },
      { id: 'b', label: 'Extensor carpi radialis brevis tendon' },
      { id: 'c', label: 'Ulnar collateral ligament' },
      { id: 'd', label: 'Biceps tendon' }
    ],
    correctOptionId: 'b',
    explanation: 'Lateral epicondylalgia most frequently involves the ECRB tendon due to repetitive wrist extension load.',
    tags: ['elbow', 'tendon']
  },
  {
    id: 'q-002',
    category: 'clinical-reasoning',
    difficulty: 'medium',
    stem: 'A patient has acute low back pain with no red flags and high fear of movement. What is the best first approach?',
    options: [
      { id: 'a', label: 'Strict bed rest for 1 week' },
      { id: 'b', label: 'Immediate MRI and specialist referral' },
      { id: 'c', label: 'Reassurance, education, and graded activity exposure' },
      { id: 'd', label: 'Avoid all painful movement indefinitely' }
    ],
    correctOptionId: 'c',
    explanation: 'For uncomplicated acute low back pain, education plus gradual return to movement improves outcomes and confidence.',
    tags: ['lumbar-spine', 'pain-science']
  },
  {
    id: 'q-003',
    category: 'assessment',
    difficulty: 'medium',
    stem: 'Which test cluster is commonly used to increase confidence in ACL injury diagnosis?',
    options: [
      { id: 'a', label: 'Lachman, anterior drawer, pivot shift' },
      { id: 'b', label: 'McMurray, Apley compression, Thessaly' },
      { id: 'c', label: 'Patellar grind and Clarke test' },
      { id: 'd', label: 'Ober and Thomas tests' }
    ],
    correctOptionId: 'a',
    explanation: 'A cluster including Lachman and pivot shift is frequently used to improve diagnostic confidence for ACL rupture.',
    tags: ['knee', 'sports']
  },
  {
    id: 'q-004',
    category: 'exercise-prescription',
    difficulty: 'hard',
    stem: 'In early-stage rotator cuff tendinopathy, which loading strategy is generally appropriate?',
    options: [
      { id: 'a', label: 'High-load eccentric work to failure daily' },
      { id: 'b', label: 'Pain-guided isometric/isotonic loading with progressive volume' },
      { id: 'c', label: 'Immobilization for 6 weeks' },
      { id: 'd', label: 'Only passive modalities' }
    ],
    correctOptionId: 'b',
    explanation: 'Pain-guided progressive loading is commonly used early to restore capacity while managing irritability.',
    tags: ['shoulder', 'load-management']
  }
];

if (!questionBank.every(isValidQuestion)) {
  throw new Error('Question bank contains invalid question schema.');
}

export const quizCategories = [
  'musculoskeletal',
  'clinical-reasoning',
  'assessment',
  'diagnosis',
  'treatment-planning',
  'exercise-prescription'
];

export const difficultyLevels = ['easy', 'medium', 'hard'];
