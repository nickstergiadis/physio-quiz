const CATEGORY_CONFIG = {
  shoulder: {
    slug: 'shoulder',
    tags: ['msk', 'shoulder'],
    topics: [
      {
        title: 'rotator cuff related shoulder pain',
        hallmark: 'load-related lateral shoulder pain with painful arc and preserved passive range',
        initialManagement: 'pain-monitored cuff and scapular strengthening with temporary load modification',
        education: 'temporary pain with exercise is acceptable when symptoms settle within 24 hours',
        progression: 'improved strength/endurance and tolerance to overhead tasks',
        precaution: 'acute traumatic inability to actively elevate after a fall'
      },
      {
        title: 'adhesive capsulitis',
        hallmark: 'progressive pain with marked passive external rotation restriction',
        initialManagement: 'education, graded mobility and strengthening within irritability, and expectation setting',
        education: 'recovery is often prolonged, and pacing helps maintain function',
        progression: 'passive range and functional reach begin to improve',
        precaution: 'new systemic illness symptoms with severe unremitting shoulder pain'
      },
      {
        title: 'subacromial bursitis',
        hallmark: 'painful shoulder elevation and local tenderness after overload',
        initialManagement: 'relative deload, graded range exercise, and progressive reloading',
        education: 'brief unloading followed by progressive loading is better than prolonged rest',
        progression: 'painful arc reduces while strength tasks are better tolerated',
        precaution: 'fever, warmth, and severe resting pain suggesting infection'
      },
      {
        title: 'long head biceps tendinopathy',
        hallmark: 'anterior shoulder pain aggravated by resisted elbow flexion and supination tasks',
        initialManagement: 'modify provocative loading and begin graded tendon loading',
        education: 'tendon recovery is driven by progressive loading, not complete avoidance',
        progression: 'resisted flexion and carrying become less irritable',
        precaution: 'sudden deformity and bruising suggesting tendon rupture'
      },
      {
        title: 'acromioclavicular joint sprain',
        hallmark: 'superior shoulder pain after direct impact and pain with horizontal adduction',
        initialManagement: 'short protection period then progressive shoulder function restoration',
        education: 'early controlled movement helps restore function after acute protection',
        progression: 'cross-body reach and push tasks become tolerable',
        precaution: 'neurovascular compromise after high-energy shoulder trauma'
      },
      {
        title: 'glenohumeral instability',
        hallmark: 'apprehension in abduction-external rotation after prior dislocation episode',
        initialManagement: 'dynamic shoulder stabilization and graded return to provocative positions',
        education: 'graded exposure to apprehension positions is usually required for confidence recovery',
        progression: 'improved control in overhead and perturbation tasks',
        precaution: 'recurrent dislocations with inability to self-reduce'
      },
      {
        title: 'SLAP-related shoulder pain',
        hallmark: 'deep shoulder pain with overhead/cocking activities and reduced throwing tolerance',
        initialManagement: 'kinetic-chain strengthening, load modification, and throwing progression',
        education: 'throwing loads should progress stepwise based on symptom response',
        progression: 'improved tolerance to staged throwing volume and speed',
        precaution: 'acute traumatic locking with major loss of function'
      },
      {
        title: 'scapular dyskinesis in overhead athlete',
        hallmark: 'altered scapular control with fatigue-related shoulder symptoms',
        initialManagement: 'scapular motor control retraining integrated with cuff strengthening',
        education: 'scapular retraining supports shoulder load tolerance when integrated functionally',
        progression: 'better movement quality during repeated overhead effort',
        precaution: 'progressive neurologic weakness in upper limb'
      },
      {
        title: 'posterior shoulder stiffness',
        hallmark: 'limited horizontal adduction/internal rotation with posterior shoulder discomfort',
        initialManagement: 'targeted mobility work plus progressive posterior cuff loading',
        education: 'mobility gains should be paired with strength and task progression',
        progression: 'throwing or pressing is tolerated with less posterior tightness',
        precaution: 'night pain with constitutional symptoms and unexplained weight loss'
      },
      {
        title: 'calcific rotator cuff tendinopathy',
        hallmark: 'episodic severe shoulder pain with painful active elevation',
        initialManagement: 'pain control, graded movement, and staged loading as irritability settles',
        education: 'symptom severity may fluctuate, but function-focused loading remains important',
        progression: 'night pain and elevation tolerance improve over weeks',
        precaution: 'red hot swollen shoulder with fever and severe pain'
      },
      {
        title: 'post-op rotator cuff rehabilitation',
        hallmark: 'post-surgical weakness with healing constraints in early phase',
        initialManagement: 'follow tissue-healing timelines with protected progression to active loading',
        education: 'respecting protocol timing helps protect repair while rebuilding function',
        progression: 'criteria-based progression in ROM, strength, and functional control',
        precaution: 'sudden loss of function after a traumatic post-op incident'
      }
    ]
  },
  knee: {
    slug: 'knee',
    tags: ['msk', 'knee'],
    topics: [
      { title: 'ACL rupture', hallmark: 'non-contact pivot injury with pop, rapid effusion, and instability', initialManagement: 'early swelling control, extension restoration, quadriceps activation, and referral planning', education: 'early impairment restoration improves later outcomes', progression: 'minimal effusion with strong quadriceps control and stable functional tests', precaution: 'locked knee with inability to fully extend after acute trauma' },
      { title: 'PCL injury', hallmark: 'dashboard or hyperflexion mechanism with posterior sag and instability downhill', initialManagement: 'quadriceps-focused strengthening and posterior tibial translation precautions early', education: 'early rehab emphasizes quadriceps function and controlled loading', progression: 'functional stability improves without giving-way episodes', precaution: 'multiligament signs after high-energy trauma' },
      { title: 'patellofemoral pain', hallmark: 'anterior knee pain aggravated by stairs, squats, and prolonged sitting', initialManagement: 'hip-knee strengthening with load management and movement retraining', education: 'pain-monitored exercise is preferred to activity avoidance', progression: 'step and squat tolerance improves with better single-leg control', precaution: 'hot swollen knee with systemic symptoms' },
      { title: 'knee osteoarthritis', hallmark: 'activity-related pain, stiffness after rest, and reduced functional endurance', initialManagement: 'education, progressive strengthening, aerobic activity, and functional practice', education: 'regular exercise is a core treatment for OA', progression: 'walking and stair capacity improve with graded loading', precaution: 'rapid unexplained swelling and constitutional symptoms' },
      { title: 'meniscal injury', hallmark: 'joint line pain with twisting mechanism and episodic catching symptoms', initialManagement: 'symptom-guided strengthening, ROM, and functional progression', education: 'many meniscal presentations respond to structured rehab', progression: 'improved squat and rotation tolerance without locking', precaution: 'true mechanical locking with inability to extend' },
      { title: 'MCL sprain', hallmark: 'valgus stress trauma with medial tenderness and instability symptoms', initialManagement: 'protected loading and progressive strengthening with valgus stress control', education: 'early controlled movement supports ligament healing', progression: 'pain-free valgus challenge and return of cutting confidence', precaution: 'gross instability suggesting combined ligament injury' },
      { title: 'patellar tendinopathy', hallmark: 'localized inferior patellar pain during jumping and deceleration', initialManagement: 'load modification and progressive tendon loading from isometric/isotonic to energy-storage work', education: 'tendon rehab requires staged loading rather than rest alone', progression: 'jump tasks tolerated with acceptable pain response', precaution: 'sudden extensor mechanism failure after explosive movement' },
      { title: 'hamstring strain near knee', hallmark: 'posterolateral knee pain after sprinting with resisted knee flexion pain', initialManagement: 'early protected loading and progressive hamstring strengthening', education: 'graded reloading reduces recurrence risk', progression: 'high-speed running and eccentric tasks become tolerable', precaution: 'large hematoma and severe weakness after acute injury' },
      { title: 'ITB-related lateral knee pain', hallmark: 'lateral knee pain in runners linked to volume spikes and hill work', initialManagement: 'training modification with hip strength and movement retraining', education: 'running load management is central to recovery', progression: 'longer runs tolerated without flare-up', precaution: 'rest pain and night pain inconsistent with load-related pattern' },
      { title: 'post-op ACL reconstruction rehab', hallmark: 'post-surgical swelling and quadriceps inhibition in early phase', initialManagement: 'restore extension, control effusion, and rebuild quadriceps activation', education: 'criteria-based progression is safer than time-only progression', progression: 'strength and hop symmetry with psychological readiness improve', precaution: 'calf pain/swelling suggesting possible DVT after surgery' },
      { title: 'quadriceps tendinopathy', hallmark: 'suprapatellar tendon pain with jumping and deep knee loading', initialManagement: 'progressive tendon loading and temporary reduction of high-strain tasks', education: 'load calibration is key to tendon adaptation', progression: 'pain-monitoring remains stable as load increases', precaution: 'sudden extensor lag after forceful contraction' }
    ]
  },
  'low back': {
    slug: 'lowback',
    tags: ['msk', 'spine'],
    topics: [
      { title: 'acute nonspecific low back pain', hallmark: 'recent onset back pain without neurologic deficit or systemic red flags', initialManagement: 'reassurance, early activity, and graded return to normal movement', education: 'prolonged bed rest delays recovery', progression: 'function improves despite some residual soreness', precaution: 'new bladder dysfunction with saddle anesthesia' },
      { title: 'lumbar radicular pain', hallmark: 'leg-dominant pain in dermatomal pattern with neural mechanosensitivity', initialManagement: 'direction-sensitive exercise, activity modification, and neurologic monitoring', education: 'symptom centralization often guides early exercise direction', progression: 'leg pain retreats proximally and tolerance improves', precaution: 'progressive motor deficit such as worsening foot drop' },
      { title: 'lumbar spinal stenosis', hallmark: 'walking intolerance eased by flexion-based postures and sitting', initialManagement: 'flexion-biased conditioning, lower-limb strength, and walking interval progression', education: 'paced walking with strategic rests can rebuild function', progression: 'longer walking duration before symptom onset', precaution: 'new bowel/bladder symptoms or rapidly worsening neurologic function' },
      { title: 'facet-related lumbar pain', hallmark: 'localized extension-rotation aggravated back pain without major neurologic signs', initialManagement: 'graded movement, trunk endurance training, and load management', education: 'movement confidence and activity pacing are important', progression: 'extension tasks tolerated with less flare', precaution: 'history suggesting inflammatory or malignant cause' },
      { title: 'sacroiliac region pain presentation', hallmark: 'unilateral buttock pain aggravated by transitions and prolonged standing', initialManagement: 'lumbopelvic strength, movement retraining, and gradual exposure', education: 'multi-factorial management works better than single-test diagnosis', progression: 'sit-to-stand and gait tolerance improve', precaution: 'severe night pain and systemic inflammatory signs' },
      { title: 'vertebral compression fracture risk', hallmark: 'sudden focal thoracolumbar pain in older adult with osteoporosis risk', initialManagement: 'urgent medical evaluation and temporary activity modification', education: 'early screening is essential when fracture risk pattern is present', progression: 'after medical clearance, progressive function restoration', precaution: 'progressive neurologic deficits or severe trauma history' },
      { title: 'persistent low back pain with fear avoidance', hallmark: 'ongoing pain with high movement fear and reduced activity participation', initialManagement: 'education with graded exposure and paced conditioning', education: 'hurt does not always equal harm in persistent pain', progression: 'activity confidence improves with stepped exposure', precaution: 'unexplained weight loss, fever, or cancer history with worsening pain' },
      { title: 'lumbar discogenic pain behavior', hallmark: 'pain with sustained flexion and sitting, eased by position change', initialManagement: 'load-management coaching and directional movement strategy', education: 'posture variation and movement breaks can reduce symptom sensitivity', progression: 'sitting and bending tolerance gradually improve', precaution: 'major trauma with severe unremitting pain' },
      { title: 'post-lumbar surgery rehabilitation principle', hallmark: 'deconditioning and movement fear after uncomplicated lumbar surgery', initialManagement: 'progressive walking, trunk conditioning, and function-first goals', education: 'graded return to function is usually preferred over prolonged avoidance', progression: 'functional tasks and endurance improve week to week', precaution: 'new neurologic deficits or wound/infection signs post-op' },
      { title: 'thoracic referred pain masquerading as low back complaint', hallmark: 'back pain pattern inconsistent with lumbar loading and linked to thoracic mobility deficits', initialManagement: 'regional mobility and strengthening with reassessment of symptom behavior', education: 'regional interdependence can influence spinal symptoms', progression: 'symptom behavior normalizes across daily tasks', precaution: 'chest pain or cardiorespiratory warning features' },
      { title: 'cauda equina syndrome screening', hallmark: 'new urinary retention, saddle sensory change, and bilateral neurologic symptoms', initialManagement: 'immediate emergency referral pathway', education: 'this pattern requires urgent medical management, not routine rehab', progression: 'not applicable until emergency care completed', precaution: 'this is itself an emergency red flag cluster' }
    ]
  },
  ankle: {
    slug: 'ankle',
    tags: ['msk', 'ankle-foot'],
    topics: [
      { title: 'lateral ankle sprain', hallmark: 'inversion injury with lateral swelling and tenderness over ATFL region', initialManagement: 'protective loading, early ROM, and progressive balance-strength work', education: 'early rehabilitation lowers recurrence risk', progression: 'single-leg balance and hop tasks normalize', precaution: 'inability to weight-bear with bony tenderness requiring fracture screening' },
      { title: 'Achilles tendinopathy', hallmark: 'midportion Achilles pain and stiffness with running and hopping load', initialManagement: 'load modification plus progressive calf loading program', education: 'tendons adapt to consistent progressive loading', progression: 'calf endurance and hopping tolerance improve', precaution: 'sudden calf snap and plantarflexion weakness suggesting rupture' },
      { title: 'Achilles rupture', hallmark: 'sudden posterior ankle pain with push-off loss and positive Thompson test', initialManagement: 'urgent immobilization/referral and early specialist pathway', education: 'prompt diagnosis enables timely management decisions', progression: 'post-acute rehab progresses from protected loading to strength and plyometrics', precaution: 'delayed diagnosis with persistent plantarflexion deficit' },
      { title: 'posterior tibial tendon dysfunction', hallmark: 'medial ankle pain with progressive arch collapse and reduced single-leg heel raise', initialManagement: 'load management, calf-foot strengthening, and orthotic support when indicated', education: 'early support and strengthening can slow functional decline', progression: 'heel-rise capacity and walking tolerance improve', precaution: 'rapid deformity progression with severe pain' },
      { title: 'plantar heel pain', hallmark: 'first-step plantar medial heel pain and load sensitivity', initialManagement: 'education, plantar fascia/calf loading, and activity modification', education: 'consistent loading and footwear strategy outperform passive-only care', progression: 'morning pain intensity and standing tolerance improve', precaution: 'night/rest pain with neurologic or systemic signs' },
      { title: 'high ankle sprain', hallmark: 'external rotation injury with syndesmotic pain and slower recovery timeline', initialManagement: 'protective phase with staged loading and careful return-to-sport criteria', education: 'syndesmotic injuries often recover slower than lateral sprains', progression: 'pain-free dorsiflexion and cutting tolerance improve', precaution: 'diastasis suspicion after severe trauma needing urgent imaging referral' },
      { title: 'ankle impingement after recurrent sprain', hallmark: 'anterior ankle pain with dorsiflexion and persistent post-sprain stiffness', initialManagement: 'mobility restoration, strength, and functional retraining', education: 'restoring dorsiflexion and control helps reduce recurrent symptoms', progression: 'squat and lunge depth improve without pinch pain', precaution: 'progressive locking/catching suggesting intra-articular pathology' },
      { title: 'peroneal tendinopathy', hallmark: 'lateral retromalleolar pain aggravated by uneven ground and eversion load', initialManagement: 'graded peroneal loading and dynamic balance progression', education: 'lateral ankle muscle capacity supports recurrent sprain prevention', progression: 'single-leg loading on uneven surfaces becomes tolerable', precaution: 'tendon subluxation or suspected retinacular rupture' },
      { title: 'stress fracture risk in foot/ankle athlete', hallmark: 'focal bony pain with training increase and pain progression to daily tasks', initialManagement: 'urgent load reduction and imaging referral pathway', education: 'early stress injury recognition prevents complete fracture', progression: 'return follows pain-free function and staged reloading', precaution: 'navicular or fifth metatarsal high-risk stress fracture signs' },
      { title: 'chronic ankle instability', hallmark: 'recurrent giving-way episodes and balance deficits after prior sprains', initialManagement: 'multidomain rehab including strength, balance, hopping, and confidence training', education: 'balance-only programs are insufficient without strength and exposure', progression: 'functional hop and agility tests show improved symmetry', precaution: 'persistent instability despite quality rehab may need specialist review' },
      { title: 'hallux rigidus functional limitation', hallmark: 'first MTP dorsiflexion pain and reduced push-off during gait', initialManagement: 'footwear modification, mobility where tolerated, and calf-foot strengthening', education: 'mechanical load management can improve walking function', progression: 'improved gait propulsion and reduced forefoot pain', precaution: 'acute red hot swollen MTP joint requiring medical review' }
    ]
  },
  'cervical spine': {
    slug: 'cervical',
    tags: ['msk', 'cervical-spine'],
    topics: [
      { title: 'mechanical neck pain', hallmark: 'localized neck pain aggravated by posture/load without neurologic deficit', initialManagement: 'education, cervical-thoracic mobility, and progressive neck-shoulder strengthening', education: 'regular movement breaks and exercise are first-line care', progression: 'work tolerance and neck ROM improve', precaution: 'major trauma with severe midline tenderness' },
      { title: 'cervical radiculopathy', hallmark: 'neck and arm pain with dermatomal symptoms and possible myotomal weakness', initialManagement: 'symptom-modified exercise, neural interface loading, and close neurologic monitoring', education: 'many cases improve with conservative care and graded activity', progression: 'arm pain decreases and strength improves', precaution: 'progressive neurologic deficit or myelopathic features' },
      { title: 'cervicogenic headache', hallmark: 'unilateral headache linked to neck movement and upper cervical dysfunction', initialManagement: 'neck exercise, manual therapy adjuncts, and posture-load strategies', education: 'headache frequency often improves with cervical rehabilitation', progression: 'reduced headache days and improved neck control', precaution: 'new thunderclap headache or neurologic deficit' },
      { title: 'whiplash-associated disorder', hallmark: 'neck pain and movement sensitivity after acceleration-deceleration trauma', initialManagement: 'reassurance, early activity, and graded neck function restoration', education: 'prolonged immobilization can delay recovery', progression: 'fear and disability scores improve with active rehab', precaution: 'fracture/dislocation signs after trauma' },
      { title: 'cervical myelopathy concern', hallmark: 'gait disturbance, hand clumsiness, hyperreflexia, and bilateral symptoms', initialManagement: 'urgent specialist referral for further assessment', education: 'cord compression signs require medical pathway, not routine exercise only', progression: 'rehab planning follows specialist management', precaution: 'this pattern is an urgent neurologic red flag' },
      { title: 'thoracic outlet related symptom presentation', hallmark: 'upper limb paresthesia provoked by sustained overhead postures', initialManagement: 'posture-load modification and progressive shoulder-neck conditioning', education: 'symptoms are multifactorial and require individualized load strategy', progression: 'overhead tolerance improves with reduced neurovascular irritability', precaution: 'vascular compromise signs such as limb discoloration/coldness' },
      { title: 'neck pain with vestibular interaction', hallmark: 'dizziness linked to neck movement after neck injury with normal central neuro screen', initialManagement: 'combined cervical sensorimotor and balance-focused rehab', education: 'sensorimotor retraining can reduce dizziness and neck disability', progression: 'improved balance and reduced movement-provoked dizziness', precaution: 'acute neurologic signs suggesting central cause' },
      { title: 'cervical facet-mediated pain behavior', hallmark: 'neck pain aggravated by extension-rotation and prolonged static posture', initialManagement: 'movement variability, neck endurance training, and graded exposure', education: 'load tolerance improves with endurance-focused programming', progression: 'sustained posture tasks provoke less pain', precaution: 'fever, unexplained weight loss, or malignancy history' },
      { title: 'post-op cervical fusion rehabilitation principle', hallmark: 'post-surgical stiffness and deconditioning with movement apprehension', initialManagement: 'surgeon-guided staged mobility and progressive function restoration', education: 'timeline and precautions vary by surgical approach and healing stage', progression: 'functional capacity improves with criteria-based progression', precaution: 'new neurologic deficits or wound infection signs' },
      { title: 'ulnar nerve mechanosensitivity at elbow-wrist interface', hallmark: 'medial forearm/hand paresthesia provoked by prolonged elbow flexion and neck loading', initialManagement: 'activity modification, neural loading, and proximal strength/posture work', education: 'combined local and proximal load management is often required', progression: 'reduced paresthesia during work and sleep', precaution: 'progressive intrinsic hand weakness' },
      { title: 'first rib and thoracic contribution to neck-shoulder pain', hallmark: 'neck/shoulder symptoms with restricted upper thoracic mobility and load intolerance', initialManagement: 'thoracic mobility, breathing strategy, and neck-shoulder strengthening', education: 'regional contributors can influence cervical symptom persistence', progression: 'upper quarter endurance and movement confidence improve', precaution: 'new chest pain or unexplained dyspnea' }
    ]
  },
  'exercise prescription': {
    slug: 'exercise',
    tags: ['rehabilitation', 'exercise-prescription'],
    topics: [
      { title: 'acute irritability loading principle', hallmark: 'high symptom reactivity requiring careful dosage', initialManagement: 'begin with tolerable isometrics and low-load movement then progress', education: 'dose-response and symptom recovery guide progression', progression: 'symptoms settle predictably within 24 hours', precaution: 'pain escalation with progressive neurologic signs' },
      { title: 'tendon rehabilitation progression', hallmark: 'load-related tendon pain needing staged loading continuum', initialManagement: 'isometric/isotonic loading progressing to energy-storage and return-to-sport drills', education: 'consistency and progressive overload drive tendon adaptation', progression: 'improved load tolerance across slow and fast tasks', precaution: 'suspected tendon rupture or complete loss of function' },
      { title: 'strength training for chronic MSK pain', hallmark: 'deconditioning and reduced confidence with movement', initialManagement: 'graded resistance training with meaningful functional goals', education: 'strength gains support pain reduction and function over time', progression: 'load capacity and self-efficacy improve', precaution: 'unstable medical condition not yet cleared for training' },
      { title: 'aerobic dosing in rehab', hallmark: 'reduced cardiorespiratory fitness limiting recovery and participation', initialManagement: 'moderate-intensity interval or continuous aerobic training matched to baseline capacity', education: 'aerobic capacity supports pain modulation and general health', progression: 'improved exertion tolerance and daily activity levels', precaution: 'cardiac red flags requiring medical clearance' },
      { title: 'graded exposure for fear-limited function', hallmark: 'avoidance behavior despite stable tissue status', initialManagement: 'hierarchical feared-task exposure with coaching and pacing', education: 'confidence grows through safe repeated exposure', progression: 'reduced fear and improved task participation', precaution: 'actual red flag signs should override exposure approach' },
      { title: 'neuromuscular retraining after injury', hallmark: 'movement variability deficits and poor control under load', initialManagement: 'task-specific motor retraining with progressive complexity', education: 'motor learning benefits from variable context and feedback fading', progression: 'transfer of movement quality to functional tasks', precaution: 'pain flare with swelling indicating overload' },
      { title: 'return-to-running framework', hallmark: 'athlete post-injury with improving baseline strength but low impact tolerance', initialManagement: 'walk-jog intervals with volume progression and symptom monitoring', education: 'progress total load gradually rather than speed alone', progression: 'consecutive running sessions tolerated without symptom escalation', precaution: 'bone stress injury signs requiring further assessment' },
      { title: 'post-op loading calibration', hallmark: 'healing tissue constraints and variable patient confidence', initialManagement: 'criteria-based progression aligned with tissue healing and surgeon guidance', education: 'time and objective milestones both inform progression', progression: 'ROM, strength, and function criteria are met sequentially', precaution: 'wound complications, fever, or DVT signs' },
      { title: 'pain science-informed education', hallmark: 'high threat interpretation and catastrophic beliefs', initialManagement: 'reassuring education plus active self-management and graded activity', education: 'pain reflects protection, not always tissue damage severity', progression: 'reduced fear and improved activity consistency', precaution: 'education should not dismiss true red flags' },
      { title: 'load management during flare-up', hallmark: 'temporary symptom spike after abrupt workload increase', initialManagement: 'short-term load reduction with planned reloading', education: 'flare-ups can be managed without full rest', progression: 'return to baseline function after graded reload', precaution: 'persistent severe night/rest pain with systemic symptoms' },
      { title: 'balance and proprioception dosing', hallmark: 'deficits in postural control affecting function and injury risk', initialManagement: 'progress from static to dynamic and dual-task balance training', education: 'specificity and progression are needed for transfer', progression: 'balance tasks improve under fatigue and complexity', precaution: 'new neurologic signs requiring medical evaluation' }
    ]
  }
};

const QUESTION_TEMPLATES = [
  {
    difficulty: 'easy',
    build: (topic) => ({
      question: `Which presentation is most consistent with ${topic.title}?`,
      correct: topic.hallmark,
      distractors: [
        'isolated imaging change without symptoms and no functional limitation',
        'only vague symptoms with no reproducible aggravating factors',
        'solely psychosocial stress with no movement-related findings'
      ],
      explanation: `${topic.title} is most strongly identified by the described pattern: ${topic.hallmark}. Clinical decisions should still integrate full history, examination, and context.`
    })
  },
  {
    difficulty: 'medium',
    build: (topic) => ({
      question: `For a patient with ${topic.title}, what is the best initial rehabilitation plan?`,
      correct: topic.initialManagement,
      distractors: [
        'complete rest until all pain is absent before any exercise',
        'passive treatment only with no home exercise progression',
        'maximal loading on day one regardless of irritability'
      ],
      explanation: `Initial management should match irritability and function. ${topic.initialManagement} is the most evidence-aligned first step, while prolonged rest or abrupt maximal loading commonly worsens outcomes.`
    })
  },
  {
    difficulty: 'easy',
    build: (topic) => ({
      question: `What is the most appropriate patient education point for ${topic.title}?`,
      correct: topic.education,
      distractors: [
        'all pain during rehabilitation means tissue damage is worsening',
        'imaging findings alone should determine all treatment decisions',
        'long-term avoidance of movement is the safest strategy'
      ],
      explanation: `High-quality education improves adherence and outcomes. For ${topic.title}, the most useful message is: ${topic.education}.`
    })
  },
  {
    difficulty: 'medium',
    build: (topic) => ({
      question: `Which finding best supports progression in a rehabilitation program for ${topic.title}?`,
      correct: topic.progression,
      distractors: [
        'time elapsed alone without objective functional change',
        'completely pain-free status at rest as the only criterion',
        'normal imaging report regardless of ongoing functional deficits'
      ],
      explanation: `Progression should be criteria-based. ${topic.progression} reflects meaningful functional recovery better than time alone or imaging-only decisions.`
    })
  },
  {
    difficulty: 'hard',
    build: (topic) => ({
      question: `Which scenario is the strongest reason to pause routine rehab and prioritize medical review in suspected ${topic.title}?`,
      correct: topic.precaution,
      distractors: [
        'mild exercise soreness that resolves by the next day',
        'temporary uncertainty about diagnosis in a stable patient',
        'slow but steady improvement over several weeks'
      ],
      explanation: `Safety screening is essential. ${topic.precaution} is a higher-priority medical concern than routine symptom fluctuations during rehabilitation.`
    })
  },
  {
    difficulty: 'medium',
    build: (topic) => ({
      question: `A clinician suspects ${topic.title}. Which management principle is most defensible in contemporary practice?`,
      correct: `${topic.initialManagement}; then progress based on symptom response and function`,
      distractors: [
        'rely on a single special test as a definitive diagnosis and treatment guide',
        'delay all activity until imaging completely normalizes',
        'use fixed protocols without adapting to patient response'
      ],
      explanation: `Evidence-oriented care uses multimodal clinical reasoning, progressive loading, and response-based adaptation. For ${topic.title}, staged progression from an appropriate initial plan is most defensible.`
    })
  }
];

function buildOptions(correct, distractors, seed) {
  const options = distractors.slice(0, 3);
  const correctAnswer = seed % 4;
  options.splice(correctAnswer, 0, correct);
  return { options, correctAnswer };
}

function buildCategoryQuestions(category, config) {
  const questions = [];
let sequence = 1;
  let answerSeed = 1;

  config.topics.forEach((topic) => {
    QUESTION_TEMPLATES.forEach((template, templateIndex) => {
      if (category === 'exercise prescription' && templateIndex === 4) return;
      const built = template.build(topic);
      const { options, correctAnswer } = buildOptions(built.correct, built.distractors, answerSeed);
      questions.push({
        id: `${config.slug}-${String(sequence).padStart(3, '0')}`,
        category,
        difficulty: template.difficulty,
        question: built.question,
        options,
        correctAnswer,
        explanation: built.explanation,
        tags: [...config.tags, topic.title]
      });
      sequence += 1;
      answerSeed += 1;
    });
  });

  return questions;
}

export const NORMAL_QUESTION_SETS = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([category, config]) => [category, buildCategoryQuestions(category, config)])
);
