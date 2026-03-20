const CASES = [
  { scenario: 'A 24-year-old basketball player lands awkwardly from a rebound and reports a knee pop, rapid swelling, and instability episodes.', likely: 'acute ACL rupture pattern', nextStep: 'perform focused ligament exam and refer for imaging/surgical discussion as indicated', management: 'begin prehabilitation: swelling control, extension restoration, quadriceps activation, and education', redFlag: 'locked knee with neurovascular compromise after trauma', categoryTag: 'knee sports injury' },
  { scenario: 'A 52-year-old office worker has gradual lateral shoulder pain with overhead reach and night discomfort when lying on the affected side.', likely: 'rotator cuff related shoulder pain', nextStep: 'assess active/passive ROM, resisted testing, and irritability to guide loading', management: 'use pain-monitored strengthening and temporary overhead load modification', redFlag: 'acute traumatic inability to actively elevate the arm', categoryTag: 'shoulder msk' },
  { scenario: 'A 67-year-old reports sudden thoracolumbar pain after lifting a light bag and has known osteoporosis.', likely: 'possible vertebral compression fracture presentation', nextStep: 'arrange prompt medical assessment and fracture screening pathway', management: 'defer high-load spinal exercise until medical clearance', redFlag: 'new neurologic deficit with severe spinal pain', categoryTag: 'spine red flags' },
  { scenario: 'A 31-year-old runner has first-step heel pain each morning that eases after a few minutes but returns with prolonged standing.', likely: 'plantar heel pain pattern', nextStep: 'screen loading history, calf capacity, and plantar fascia irritability', management: 'provide education, load modification, and progressive plantar fascia/calf loading', redFlag: 'night pain with neurologic signs or systemic illness', categoryTag: 'foot ankle' },
  { scenario: 'A 45-year-old presents with neck and unilateral arm pain in a dermatomal distribution with reduced triceps reflex.', likely: 'cervical radiculopathy pattern', nextStep: 'perform neurologic exam and monitor for progressive deficits', management: 'use symptom-guided exercise and functional activity progression', redFlag: 'progressive myotomal weakness or gait disturbance', categoryTag: 'cervical neuro' },
  { scenario: 'A 19-year-old sprinter has localized inferior patellar pain worsened by jumping and deceleration drills.', likely: 'patellar tendinopathy presentation', nextStep: 'quantify tendon irritability and loading tolerance', management: 'start staged tendon loading progression and training-load adjustment', redFlag: 'sudden inability to extend knee after forceful effort', categoryTag: 'knee tendon' },
  { scenario: 'A 60-year-old with knee OA has pain climbing stairs, reduced activity, and fear that exercise will wear out the joint.', likely: 'deconditioned knee osteoarthritis with fear-avoidance', nextStep: 'assess functional baselines and patient beliefs driving avoidance', management: 'deliver education plus progressive strength and functional exposure', redFlag: 'hot swollen joint with fever and inability to weight-bear', categoryTag: 'knee oa' },
  { scenario: 'A 34-year-old manual worker has acute low back pain after lifting, no neurologic deficits, and high fear of bending.', likely: 'acute nonspecific low back pain with fear-avoidance', nextStep: 'screen red flags and reassure regarding favorable prognosis', management: 'encourage early graded activity and exposure to bending', redFlag: 'new urinary retention with saddle anesthesia', categoryTag: 'low back' },
  { scenario: 'A 27-year-old footballer has recurrent ankle giving-way episodes 8 months after multiple inversion sprains.', likely: 'chronic ankle instability', nextStep: 'evaluate balance, strength, hop control, and confidence', management: 'provide multidomain rehab including balance, strength, and agility progression', redFlag: 'persistent gross instability after quality rehab requiring specialist review', categoryTag: 'ankle instability' },
  { scenario: 'A 56-year-old reports progressive shoulder stiffness and pain, especially with external rotation, without clear trauma.', likely: 'adhesive capsulitis profile', nextStep: 'differentiate from cuff-related pain via passive ROM pattern', management: 'education, pacing, mobility, and strengthening within irritability', redFlag: 'constitutional symptoms with severe unremitting pain', categoryTag: 'shoulder stiffness' },
  { scenario: 'A 22-year-old rugby player reports repeated episodes of shoulder slipping in abduction-external rotation after first dislocation.', likely: 'recurrent traumatic anterior shoulder instability', nextStep: 'assess apprehension and dynamic control and discuss instability risk', management: 'stabilization program with graded exposure and referral discussion for recurrent events', redFlag: 'dislocation that cannot be reduced with neurovascular signs', categoryTag: 'shoulder instability' },
  { scenario: 'A 49-year-old cyclist has neck pain with unilateral headache reproduced by upper cervical movement.', likely: 'cervicogenic headache pattern', nextStep: 'assess cervical mobility, endurance, and headache behavior', management: 'combine neck exercise with load modification and manual adjuncts when appropriate', redFlag: 'sudden thunderclap headache or focal neurologic deficit', categoryTag: 'headache cervical' },
  { scenario: 'A 38-year-old tennis player develops lateral elbow and forearm symptoms plus neck stiffness after training load spikes.', likely: 'upper-quarter load intolerance with cervical and forearm contribution', nextStep: 'assess regional interdependence including neck, shoulder, and forearm loading', management: 'progressive loading across involved regions with task modification', redFlag: 'progressive hand weakness or persistent sensory loss', categoryTag: 'upper limb reasoning' },
  { scenario: 'A 71-year-old reports worsening gait imbalance, hand clumsiness, and bilateral arm symptoms over months.', likely: 'possible cervical myelopathy', nextStep: 'urgent specialist referral for spinal cord evaluation', management: 'defer routine MSK-only management until medical pathway addressed', redFlag: 'this entire symptom cluster is a neurologic red flag', categoryTag: 'myelopathy' },
  { scenario: 'A 25-year-old distance runner has focal navicular region pain that progressed from post-run pain to pain during walking.', likely: 'high-risk bone stress injury pattern', nextStep: 'immediately reduce load and refer for imaging/medical assessment', management: 'avoid impact loading until diagnosis and graded return plan are established', redFlag: 'continued loading despite escalating bony pain', categoryTag: 'bone stress' },
  { scenario: 'A 48-year-old has persistent low back and leg pain; repeated extension centralizes symptoms from calf to buttock.', likely: 'directional preference response with centralization', nextStep: 'use centralizing movement direction as initial exercise guide', management: 'build self-management around centralizing movements and graded function', redFlag: 'new progressive weakness despite conservative care', categoryTag: 'directional preference' },
  { scenario: 'A 35-year-old six weeks after Achilles rupture repair has minimal swelling and can tolerate double-leg calf raises.', likely: 'appropriate transition-phase post-op Achilles rehab', nextStep: 'review healing timeline and objective loading criteria', management: 'progress from bilateral to unilateral calf loading and controlled plyometric preparation', redFlag: 'sudden loss of plantarflexion strength and palpable gap', categoryTag: 'post-op achilles' },
  { scenario: 'A 58-year-old with persistent shoulder pain has MRI findings of partial cuff tearing and believes surgery is mandatory.', likely: 'imaging-pathoanatomy concern with potentially modifiable symptoms', nextStep: 'integrate imaging with clinical findings and goals rather than imaging alone', management: 'initiate structured rehab and shared decision-making before invasive options when appropriate', redFlag: 'acute traumatic pseudoparalysis or systemic red flags', categoryTag: 'shared decision making' },
  { scenario: 'A 42-year-old warehouse worker has medial ankle pain, flattening arch, and poor single-leg heel raise endurance.', likely: 'posterior tibial tendon dysfunction profile', nextStep: 'assess tendon loading capacity and foot control deficits', management: 'combine supportive strategies with progressive calf-foot strengthening', redFlag: 'rapidly progressive deformity with severe pain', categoryTag: 'medial ankle' },
  { scenario: 'A 29-year-old post-ACL reconstruction athlete has 92% hop symmetry but expresses major fear during cutting drills.', likely: 'physical recovery with unresolved psychological readiness', nextStep: 'measure readiness and confidence barriers alongside physical metrics', management: 'continue graded sport exposure and psychological-informed coaching', redFlag: 'recurrent instability or acute new trauma signs', categoryTag: 'return to sport' },
  { scenario: 'A 63-year-old presents with severe unilateral calf pain and swelling one week after knee surgery.', likely: 'possible deep vein thrombosis concern', nextStep: 'urgent medical referral for vascular assessment', management: 'do not continue routine strengthening session before medical clearance', redFlag: 'this presentation itself is a medical red flag', categoryTag: 'post-op screening' },
  { scenario: 'A 40-year-old with chronic neck pain reports dizziness during rapid head movements but normal central neurologic screen.', likely: 'cervical sensorimotor dysfunction possibility', nextStep: 'assess oculomotor, proprioceptive, and balance performance', management: 'use integrated cervical sensorimotor and balance retraining', redFlag: 'new focal neurologic deficits or acute severe headache', categoryTag: 'sensorimotor rehab' },
  { scenario: 'A 33-year-old CrossFit athlete has shoulder pain during kipping pull-ups with reduced thoracic extension and scapular control fatigue.', likely: 'load-related shoulder dysfunction with kinetic-chain contributors', nextStep: 'assess thoracic mobility, scapular control, and pull-up load exposure', management: 'temporarily regress provocative volume and rebuild strength/control progressively', redFlag: 'acute trauma with major strength loss', categoryTag: 'sport shoulder' }
];

const CASE_TEMPLATES = [
  {
    difficulty: 'medium',
    question: (c) => `${c.scenario}\n\nWhat is the most likely clinical interpretation?`,
    correct: (c) => c.likely,
    distractors: [
      'a presentation that can be diagnosed with a single special test alone',
      'a harmless pattern that never requires structured rehabilitation',
      'a condition that should be managed by imaging results only'
    ],
    explanation: (c) => `The vignette is most consistent with ${c.likely}. This should be integrated with full history, examination, and contextual factors before final planning.`
  },
  {
    difficulty: 'medium',
    question: (c) => `${c.scenario}\n\nWhat is the best immediate next clinical step?`,
    correct: (c) => c.nextStep,
    distractors: [
      'start maximal loading immediately without further assessment',
      'delay any decision-making until pain is completely absent for several weeks',
      'base all decisions on one isolated orthopedic test'
    ],
    explanation: (c) => `Best-practice reasoning prioritizes the next step that changes management safely and efficiently. Here, that is to ${c.nextStep}.`
  },
  {
    difficulty: 'medium',
    question: (c) => `${c.scenario}\n\nWhich rehabilitation approach is most appropriate initially?`,
    correct: (c) => c.management,
    distractors: [
      'advise complete rest and avoid all meaningful movement for six weeks',
      'apply passive treatment only and postpone active rehabilitation',
      'use the same non-individualized protocol regardless of irritability'
    ],
    explanation: (c) => `Early management should align with irritability, goals, and risk profile. ${c.management} is the most defensible starting approach.`
  },
  {
    difficulty: 'hard',
    question: (c) => `${c.scenario}\n\nWhich finding would most strongly trigger urgent medical escalation?`,
    correct: (c) => c.redFlag,
    distractors: [
      'temporary post-exercise soreness that settles by the next day',
      'slow but progressive improvement across sessions',
      'a patient preference for slower exercise progression'
    ],
    explanation: (c) => `Urgent escalation is indicated by true red-flag features. In this case, the highest-priority concern is ${c.redFlag}.`
  },
  {
    difficulty: 'easy',
    question: (c) => `${c.scenario}\n\nWhich clinician statement best reflects evidence-informed practice?`,
    correct: (c) => `${c.management}; progress based on function and symptom behavior`,
    distractors: [
      'pain always equals ongoing tissue damage, so avoid loading entirely',
      'special tests are definitive and make broader clinical reasoning unnecessary',
      'imaging severity directly determines disability in every patient'
    ],
    explanation: () => 'Evidence-oriented MSK rehabilitation combines clinical reasoning, graded loading, and ongoing reassessment rather than absolute rules.'
  }
];

function buildOptions(correct, distractors, seed) {
  const options = distractors.slice(0, 3);
  const correctAnswer = seed % 4;
  options.splice(correctAnswer, 0, correct);
  return { options, correctAnswer };
}

const clinicalReasoningQuestions = [];
let idCounter = 1;

CASES.forEach((caseItem) => {
  CASE_TEMPLATES.forEach((template) => {
    const correct = template.correct(caseItem);
    const { options, correctAnswer } = buildOptions(correct, template.distractors, idCounter);
    clinicalReasoningQuestions.push({
      id: `reasoning-${String(idCounter).padStart(3, '0')}`,
      category: 'clinical reasoning',
      difficulty: template.difficulty,
      question: template.question(caseItem),
      options,
      correctAnswer,
      explanation: template.explanation(caseItem),
      tags: ['clinical-reasoning', caseItem.categoryTag]
    });
    idCounter += 1;
  });
});

export const CLINICAL_REASONING_QUESTION_SETS = {
  'clinical reasoning': clinicalReasoningQuestions
};
