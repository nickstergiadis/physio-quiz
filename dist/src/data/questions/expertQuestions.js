export const EXPERT_QUESTION_SETS = {
  'clinical reasoning': [
    {
      id: 'expert-001',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 28-year-old soccer midfielder is 7 months post-ACL reconstruction. Isokinetic quadriceps strength is 82% limb symmetry, hop tests are 95-97%, and she reports high confidence in straight-line running but hesitation during unanticipated cutting. What is the best next step before unrestricted return to match play?',
      options: [
        'Clear full return because hop symmetry exceeds 90%',
        'Delay all sport exposure until strength and confidence are both addressed with targeted deceleration/change-of-direction progression',
        'Use MRI graft appearance to decide readiness instead of functional testing',
        'Allow unrestricted training if pain remains below 3/10'
      ],
      correctAnswer: 1,
      explanation:
        'Hop symmetry alone can overestimate readiness. Persistent quadriceps deficit and movement-context fear during unanticipated tasks raise reinjury risk, so targeted COD/deceleration progressions and psychological readiness work are indicated before unrestricted match exposure.',
      tags: ['clinical-reasoning', 'return-to-sport', 'knee', 'acl']
    },
    {
      id: 'expert-002',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 64-year-old with lumbar stenosis reports bilateral leg heaviness after 6 minutes of walking that eases quickly with sitting. Neurologic exam is stable, and vascular screen is unremarkable. Which loading strategy is most appropriate initially?',
      options: [
        'Progress extension-biased loading to desensitize symptoms rapidly',
        'Implement flexion-tolerant interval walking with progressive lower-limb/trunk conditioning',
        'Prescribe strict bed rest until leg symptoms are absent for 2 weeks',
        'Refer immediately for surgery because bilateral symptoms are present'
      ],
      correctAnswer: 1,
      explanation:
        'The pattern is classic neurogenic claudication without progressive neurologic red flags. Flexion-tolerant interval walking and graded conditioning improve function while respecting symptom behavior; immediate surgery or bed rest is not the best first step here.',
      tags: ['clinical-reasoning', 'low-back', 'neurogenic-claudication', 'loading']
    },
    {
      id: 'expert-003',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 46-year-old with unilateral shoulder pain has painful arc 70-120°, near-full passive ROM, and mild weakness in external rotation due to pain. MRI ordered by another provider shows partial supraspinatus tearing. Which interpretation is most defensible for management planning?',
      options: [
        'MRI tear severity alone should determine need for surgery',
        'Findings are consistent with rotator cuff-related shoulder pain; integrate imaging as context, not a stand-alone decision driver',
        'Painful arc confirms full-thickness tear requiring urgent operative referral',
        'Shoulder pain with weakness excludes active rehab'
      ],
      correctAnswer: 1,
      explanation:
        'Clinical behavior and exam findings support rotator cuff-related shoulder pain. Partial tearing on MRI is common and must be interpreted with symptoms, function, irritability, and goals; imaging-only decision-making risks overtreatment.',
      tags: ['clinical-reasoning', 'shoulder', 'imaging-appropriateness']
    },
    {
      id: 'expert-004',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 32-year-old runner has focal navicular tenderness and pain that progressed from post-run soreness to pain during daily walking over 3 weeks. What is the best immediate decision?',
      options: [
        'Continue running but reduce intensity by 10%',
        'Begin aggressive plyometrics to improve foot stiffness',
        'Urgently unload from impact and refer for imaging/medical assessment for high-risk bone stress injury',
        'Treat as plantar fasciopathy if first-step pain is present'
      ],
      correctAnswer: 2,
      explanation:
        'Navicular-region progressive bony pain is a high-risk stress injury pattern. Immediate impact unloading and urgent imaging referral are appropriate to prevent progression to complete fracture and prolonged morbidity.',
      tags: ['clinical-reasoning', 'sports', 'bone-stress', 'imaging-appropriateness']
    },
    {
      id: 'expert-005',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 58-year-old with neck pain and arm paresthesia now reports gait imbalance, hand clumsiness, and bilateral hand numbness over 4 months. What is the best next step?',
      options: [
        'Trial 6 weeks of routine cervical strengthening first',
        'Perform repeated cervical traction as first-line management',
        'Urgent specialist referral for suspected cervical myelopathy',
        'Reassure and monitor because bilateral symptoms are common in radiculopathy'
      ],
      correctAnswer: 2,
      explanation:
        'Progressive bilateral symptoms with gait and dexterity changes are red flags for possible cervical cord involvement. This warrants urgent specialist pathway rather than routine conservative MSK progression.',
      tags: ['clinical-reasoning', 'cervical-spine', 'myelopathy', 'red-flags']
    },
    {
      id: 'expert-006',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 41-year-old with persistent lateral hip and thigh pain has allodynia, sleep disturbance, diffuse sensitivity, and disproportionate pain to low-load tests after prior tissue healing. Which pain mechanism classification is most useful to guide treatment emphasis?',
      options: [
        'Predominantly nociceptive only',
        'Predominantly nociplastic contribution requiring broader graded exposure/self-management approach',
        'Pure neuropathic pain requiring immediate nerve surgery referral',
        'Mechanical pain that should be managed with complete rest'
      ],
      correctAnswer: 1,
      explanation:
        'Widespread sensitivity, allodynia, and disproportionate pain with sleep impact suggest meaningful nociplastic contribution. Management should still include loading, but with pacing, threat reduction, and whole-person progression rather than tissue-only framing.',
      tags: ['clinical-reasoning', 'pain-mechanisms', 'rehab']
    },
    {
      id: 'expert-007',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 27-year-old volleyball athlete with patellar tendinopathy reports 2/10 pain during heavy slow resistance that settles within 12 hours and no next-day stiffness increase. What is the best load progression decision?',
      options: [
        'Regress load immediately because any pain is harmful',
        'Maintain current dose indefinitely and avoid progression',
        'Progress load or complexity modestly because response is within acceptable monitoring limits',
        'Switch to passive modalities only until pain is zero'
      ],
      correctAnswer: 2,
      explanation:
        'Symptoms are within acceptable pain-monitoring thresholds (low intensity, rapid recovery, stable next-day response). This supports progressive tendon loading rather than unnecessary regression or passive-only care.',
      tags: ['clinical-reasoning', 'tendinopathy', 'loading-progression', 'sports']
    },
    {
      id: 'expert-008',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 35-year-old after lateral ankle sprain demonstrates persistent giving-way at 4 months despite pain reduction. Y-Balance asymmetry and hop-landing frontal plane collapse persist. What best addresses recurrence risk?',
      options: [
        'Continue only sagittal-plane calf strengthening',
        'Discharge because pain has improved',
        'Add multidomain rehab with perturbation, frontal/transverse control, and sport-specific reactive drills',
        'Rely on bracing alone as the long-term solution'
      ],
      correctAnswer: 2,
      explanation:
        'Chronic ankle instability risk is driven by persistent neuromuscular and sensorimotor deficits, not pain alone. Multiplanar/reactive training better targets recurrence risk than narrow strengthening or bracing-only strategies.',
      tags: ['clinical-reasoning', 'ankle', 'chronic-instability', 'return-to-sport']
    },
    {
      id: 'expert-009',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 62-year-old with knee OA fears that loading will "wear out" the joint. He avoids stairs and sits most of the day. Which clinician response is most evidence-aligned?',
      options: [
        'Confirm that exercise accelerates structural degeneration',
        'Recommend avoiding knee loading until imaging normalizes',
        'Explain that dosed loading is therapeutic and prescribe graded strengthening/functional exposure based on irritability',
        'Focus only on manual therapy to avoid stressing cartilage'
      ],
      correctAnswer: 2,
      explanation:
        'For knee OA, appropriately dosed exercise is core treatment and improves pain/function. Education should reduce fear and support graded activity exposure, not reinforce avoidance beliefs.',
      tags: ['clinical-reasoning', 'knee-oa', 'education', 'loading-progression']
    },
    {
      id: 'expert-010',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 30-year-old has acute vertigo, nausea, spontaneous unidirectional horizontal nystagmus, positive head impulse to the right, and no focal neurologic deficits. Which is the most likely classification?',
      options: [
        'Peripheral unilateral vestibular hypofunction pattern',
        'Posterior circulation stroke pattern requiring no further triage',
        'Cervicogenic dizziness because neck pain is also present',
        'Benign paroxysmal positional vertigo only'
      ],
      correctAnswer: 0,
      explanation:
        'The triad of unidirectional nystagmus, abnormal head impulse, and absence of central neurologic signs supports a peripheral acute vestibular syndrome pattern. Ongoing red-flag screening remains essential if presentation changes.',
      tags: ['clinical-reasoning', 'vestibular', 'neuro', 'differential']
    },
    {
      id: 'expert-011',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 45-year-old with low back and leg pain centralizes from calf to buttock with repeated extension, and neurologic signs are stable. What is the best early exercise decision?',
      options: [
        'Avoid extension because distal pain was initially severe',
        'Use centralizing movement direction as initial self-management anchor and monitor response',
        'Prescribe only core isometrics in neutral regardless of response',
        'Stop all movement until leg pain completely resolves'
      ],
      correctAnswer: 1,
      explanation:
        'Centralization suggests a favorable directional response. Using that direction as an initial anchor with close monitoring is more evidence-consistent than fixed neutral-only or rest-based approaches.',
      tags: ['clinical-reasoning', 'low-back', 'directional-preference']
    },
    {
      id: 'expert-012',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 52-year-old 10 days post-knee arthroplasty reports calf pain, unilateral swelling, and new dyspnea on exertion. What is the best immediate action?',
      options: [
        'Progress strengthening because post-op swelling is expected',
        'Urgent medical escalation for possible thromboembolic event before further rehab',
        'Treat with manual lymphatic techniques and recheck in one week',
        'Continue session but avoid weight-bearing exercises'
      ],
      correctAnswer: 1,
      explanation:
        'Calf swelling/pain plus dyspnea shortly after surgery is a potential thromboembolic emergency. Immediate medical referral supersedes routine rehabilitation progression.',
      tags: ['clinical-reasoning', 'post-op', 'red-flags', 'vascular']
    },
    {
      id: 'expert-013',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 23-year-old overhead athlete has shoulder pain during late cocking. Exam shows glenohumeral internal rotation deficit, thoracic extension restriction, and kinetic-chain fatigue. Which treatment priority is strongest?',
      options: [
        'Isolate shoulder external rotator strengthening only',
        'Address regional kinetic-chain contributors and graded throwing load alongside local shoulder capacity',
        'Stop throwing for 3 months with no cross-training',
        'Use corticosteroid injection as first-line management'
      ],
      correctAnswer: 1,
      explanation:
        'Late-cocking pain in overhead sport is often multifactorial. Integrated kinetic-chain intervention plus staged throwing progression better matches performance demands than isolated local or prolonged deconditioning approaches.',
      tags: ['clinical-reasoning', 'sports', 'shoulder', 'loading-progression']
    },
    {
      id: 'expert-014',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 39-year-old desk worker has neck pain with dizziness during fast head turns after whiplash. Central neurologic screen is normal, but joint position error and gaze stability are impaired. Which plan is most appropriate?',
      options: [
        'Treat only with cervical traction',
        'Combined cervical sensorimotor and vestibulo-ocular retraining with graded exposure to head movement',
        'Avoid head movement entirely until dizziness is gone',
        'Prioritize strengthening lower limbs only'
      ],
      correctAnswer: 1,
      explanation:
        'Findings support cervicovestibular sensorimotor dysfunction rather than isolated structural neck pain. Integrated oculomotor/proprioceptive retraining with graded motion exposure targets the identified deficits.',
      tags: ['clinical-reasoning', 'cervical-spine', 'vestibular', 'sensorimotor']
    },
    {
      id: 'expert-015',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 57-year-old presents with severe night shoulder pain, unexplained weight loss, and rapidly progressive weakness unrelated to loading behavior. What should you do first?',
      options: [
        'Begin cuff strengthening and review in 4 weeks',
        'Order a home exercise program and reassure',
        'Escalate for urgent medical assessment for non-MSK pathology',
        'Perform repeated impingement tests to confirm diagnosis'
      ],
      correctAnswer: 2,
      explanation:
        'Constitutional symptoms plus severe non-mechanical progression are red flags. Immediate medical workup is indicated before routine MSK rehabilitation decisions.',
      tags: ['clinical-reasoning', 'red-flags', 'shoulder', 'referral-threshold']
    },
    {
      id: 'expert-016',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 26-year-old marathon runner has persistent Achilles pain despite 8 weeks of calf loading. You discover he tripled hill-sprint volume while maintaining heavy gym loading. What is the best next step?',
      options: [
        'Conclude exercise therapy failed and stop loading',
        'Recalibrate total tendon load (running + gym) and re-progress with symptom-monitored dosing',
        'Proceed directly to surgery because symptoms persist at 8 weeks',
        'Treat only with soft tissue techniques while keeping training unchanged'
      ],
      correctAnswer: 1,
      explanation:
        'Failure to integrate total external/internal load commonly drives persistent tendon irritability. Load recalibration and staged progression is the highest-value next step before invasive pathways.',
      tags: ['clinical-reasoning', 'achilles', 'load-management', 'sports']
    },
    {
      id: 'expert-017',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 68-year-old with sudden thoracolumbar pain after lifting a light object has known osteoporosis and marked point tenderness. Neurology is intact. Which is the best imaging decision?',
      options: [
        'No imaging is ever indicated in spine pain',
        'Prompt medical pathway with imaging to evaluate possible vertebral compression fracture',
        'Delay imaging for 12 weeks regardless of risk profile',
        'Use MRI only if pain exceeds 8/10'
      ],
      correctAnswer: 1,
      explanation:
        'This is a high-probability vertebral compression fracture pattern. Early medical assessment and appropriate imaging are warranted because management and loading precautions may change materially.',
      tags: ['clinical-reasoning', 'low-back', 'imaging-appropriateness', 'osteoporosis']
    },
    {
      id: 'expert-018',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 21-year-old rugby player had first-time traumatic anterior shoulder dislocation 3 weeks ago and now has recurrent apprehension in abduction-external rotation despite early rehab. Which management discussion is most appropriate?',
      options: [
        'Promise full contact return within 2 weeks regardless of deficits',
        'Continue only passive ROM to avoid instability',
        'Discuss recurrence risk, continue dynamic stabilization, and consider specialist referral based on sport demands and repeated instability',
        'Ignore apprehension because strength is improving'
      ],
      correctAnswer: 2,
      explanation:
        'Young collision athletes have elevated recurrence risk after traumatic instability. Best practice includes shared decision-making, progressive stabilization, and timely referral discussion when recurrent episodes or high-risk demands are present.',
      tags: ['clinical-reasoning', 'shoulder-instability', 'sports', 'shared-decision-making']
    },
    {
      id: 'expert-019',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 47-year-old with radicular symptoms has worsening dorsiflexion weakness from 4/5 to 2/5 over 10 days despite conservative care. Pain intensity is unchanged. What is the best next step?',
      options: [
        'Continue current plan because pain is stable',
        'Urgent medical/specialist referral due to progressive motor deficit',
        'Increase neural tensioning aggressively',
        'Discharge because symptoms are expected to fluctuate'
      ],
      correctAnswer: 1,
      explanation:
        'Progressive myotomal weakness is a referral threshold independent of pain score. Escalation is required to evaluate compressive or other neurologic pathology promptly.',
      tags: ['clinical-reasoning', 'low-back', 'radiculopathy', 'red-flags']
    },
    {
      id: 'expert-020',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 33-year-old post-concussion athlete has normal rest symptoms but dizziness and visual blurring only during high-speed head turns while sprinting. What is the best return-to-sport progression?',
      options: [
        'Clear full return because symptoms are absent at rest',
        'Reintroduce sport in staged progression including high-velocity dual-task head-movement drills before contact clearance',
        'Stop all exertion until entirely symptom free in every context for one month',
        'Focus only on neck strengthening and skip exertional progression'
      ],
      correctAnswer: 1,
      explanation:
        'Return decisions should match sport-specific demand. Exertional, high-velocity oculovestibular provocation indicates incomplete readiness, so staged dual-task progression is needed before unrestricted return.',
      tags: ['clinical-reasoning', 'vestibular', 'return-to-sport', 'neuro']
    },
    {
      id: 'expert-021',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 55-year-old with chronic low back pain reports fear of bending. During graded exposure, pain rises from 3/10 to 5/10 during task practice but returns to baseline by next morning and function improves weekly. What is the best interpretation?',
      options: [
        'This response indicates tissue injury and progression should stop',
        'This is acceptable short-term symptom response; continue progressive exposure with monitoring',
        'Any increase in pain invalidates graded exposure approach',
        'Switch to imaging-led management immediately'
      ],
      correctAnswer: 1,
      explanation:
        'Transient, recoverable symptoms with improving function are compatible with successful graded exposure. Decision-making should prioritize recovery trajectory and capacity gains, not zero-pain criteria alone.',
      tags: ['clinical-reasoning', 'low-back', 'pain-mechanisms', 'graded-exposure']
    },
    {
      id: 'expert-022',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 44-year-old with posterior tibial tendon dysfunction can perform only 2 painful single-leg heel raises and has progressive flatfoot during stance. Which plan is most appropriate now?',
      options: [
        'Immediate high-volume plyometrics to restore tendon power',
        'Rigid rest with no strengthening for 8 weeks',
        'Combine supportive load reduction (orthotic/bracing if needed) with progressive calf-foot strengthening and monitoring deformity progression',
        'Treat only proximal hip strength and ignore foot mechanics'
      ],
      correctAnswer: 2,
      explanation:
        'Symptomatic low capacity with progressive deforming load requires both support and progressive tendon/muscle conditioning. This balances symptom control while addressing functional deficits and progression risk.',
      tags: ['clinical-reasoning', 'ankle', 'pttd', 'loading-progression']
    },
    {
      id: 'expert-023',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 29-year-old powerlifter has acute low back pain after deadlift, normal neurologic exam, no trauma history, and no systemic features. He asks for immediate MRI. What is the best response?',
      options: [
        'Order urgent MRI because pain is severe',
        'Explain imaging is not routinely indicated without red flags and proceed with active, symptom-guided rehab',
        'Refuse all training for 3 months',
        'Use bed rest for one week before reassessment'
      ],
      correctAnswer: 1,
      explanation:
        'In acute nonspecific low back pain without red flags, routine immediate MRI is low value and may increase medicalization. Education plus graded activity and monitored progression is the evidence-aligned path.',
      tags: ['clinical-reasoning', 'imaging-appropriateness', 'low-back', 'shared-decision-making']
    },
    {
      id: 'expert-024',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 37-year-old presents with lateral elbow pain and neck stiffness after a rapid increase in racquet volume. Pain is reproduced by resisted wrist extension and prolonged cervical rotation. What is the best reasoning approach?',
      options: [
        'Classify solely as local tendon pathology and ignore neck findings',
        'Use regional interdependence approach: manage forearm loading while addressing cervical/shoulder contributors and sport load',
        'Stop all upper-limb loading indefinitely',
        'Prioritize elbow MRI before any intervention'
      ],
      correctAnswer: 1,
      explanation:
        'The presentation likely reflects combined local and regional load intolerance. Integrating forearm tendon dosing, cervical/shoulder factors, and racquet load management provides more complete risk modification.',
      tags: ['clinical-reasoning', 'upper-limb', 'differential', 'load-management']
    },
    {
      id: 'expert-025',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 60-year-old with diabetes reports new unilateral foot drop and frequent tripping over 2 weeks. Back pain is mild. Which decision is best?',
      options: [
        'Treat as routine dorsiflexor weakness with home exercise only',
        'Urgent neurologic/medical referral to clarify cause of evolving motor deficit',
        'Delay referral until pain increases',
        'Manage with ankle taping and reassess in a month'
      ],
      correctAnswer: 1,
      explanation:
        'New evolving motor deficit requires urgent diagnostic clarification regardless of pain severity. Timely referral helps distinguish compressive, peripheral nerve, and other neurologic causes that may need rapid intervention.',
      tags: ['clinical-reasoning', 'neuro', 'red-flags', 'referral-threshold']
    },
    {
      id: 'expert-026',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 24-year-old with recurrent hamstring strains meets strength symmetry targets but shows poor trunk-pelvic control and overstriding at top speed. What best reduces reinjury risk?',
      options: [
        'Return immediately because strength symmetry is sufficient',
        'Continue isolated hamstring curls only',
        'Address sprint mechanics, trunk-pelvic control, and high-speed exposure progression in addition to strength metrics',
        'Avoid sprinting for the entire season'
      ],
      correctAnswer: 2,
      explanation:
        'Return-to-sport decisions should integrate task mechanics and high-speed tolerance, not strength numbers alone. Sprint-specific control and progressive exposure target common residual risk factors.',
      tags: ['clinical-reasoning', 'sports', 'return-to-sport', 'hamstring']
    },
    {
      id: 'expert-027',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 66-year-old has unilateral headache, neck pain, brief visual disturbance, and new ataxia after minor neck trauma. What is the most appropriate immediate response?',
      options: [
        'Perform vigorous cervical mobilization to restore range',
        'Treat as benign cervicogenic headache and monitor',
        'Urgent emergency referral for possible cervical arterial/central neurologic event',
        'Begin vestibular habituation exercises first'
      ],
      correctAnswer: 2,
      explanation:
        'Acute headache/neck pain with visual and cerebellar features after trauma is a serious vascular/central red-flag pattern. Emergency referral is required before any MSK treatment.',
      tags: ['clinical-reasoning', 'cervical-spine', 'red-flags', 'neurovascular']
    },
    {
      id: 'expert-028',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 51-year-old with adhesive capsulitis has high irritability and severe night pain in the freezing phase. Which loading strategy is most appropriate initially?',
      options: [
        'Aggressive end-range stretching multiple times daily to force ROM gains',
        'No movement until pain resolves entirely',
        'Symptom-calibrated mobility and strengthening within irritability, prioritizing sleep and function',
        'High-load ballistic shoulder training'
      ],
      correctAnswer: 2,
      explanation:
        'High-irritability adhesive capsulitis responds better to paced loading within tolerance than aggressive end-range forcing. Early priorities include symptom regulation, functional maintenance, and gradual progression.',
      tags: ['clinical-reasoning', 'shoulder', 'loading-progression', 'irritability']
    },
    {
      id: 'expert-029',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 34-year-old with persistent post-op Achilles rehab can do 25 double-leg heel raises but only 2 single-leg raises with marked asymmetry and poor hop confidence at 5 months. What is the best interpretation?',
      options: [
        'Ready for unrestricted plyometrics because pain is low',
        'Insufficient unilateral plantarflexor capacity for full return; continue progressive heavy-slow and later plyometric progression',
        'Single-leg deficits are expected and not clinically relevant',
        'Discontinue strengthening and focus only on gait'
      ],
      correctAnswer: 1,
      explanation:
        'Double-leg performance can mask persistent unilateral deficits after Achilles injury. Return progression should be criteria-based on unilateral calf capacity and dynamic confidence before unrestricted plyometric/sport loads.',
      tags: ['clinical-reasoning', 'achilles', 'return-to-sport', 'test-interpretation']
    },
    {
      id: 'expert-030',
      category: 'clinical reasoning',
      difficulty: 'expert',
      question:
        'A 43-year-old with persistent low back pain has high pain catastrophizing, sleep disruption, and low activity tolerance. Which intervention package is most likely to improve long-term outcomes?',
      options: [
        'Education to reduce threat, graded activity/strength progression, and behavioral pacing with meaningful goals',
        'Passive treatment only with no self-management focus',
        'Imaging-driven diagnosis updates at each flare',
        'Strict avoidance of all pain-provoking movement'
      ],
      correctAnswer: 0,
      explanation:
        'Persistent pain with high psychosocial load benefits from integrated biopsychosocial rehabilitation: threat-reducing education, progressive capacity building, and behavioral pacing tied to goals.',
      tags: ['clinical-reasoning', 'pain-mechanisms', 'low-back', 'rehab']
    }
  ]
};
