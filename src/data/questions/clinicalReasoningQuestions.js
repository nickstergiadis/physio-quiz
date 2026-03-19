/**
 * Organized question sets by category.
 * Add new questions to the category array that matches your content area.
 */
export const CLINICAL_REASONING_QUESTION_SETS = {
  "shoulder": [
    {
      "id": "reasoning-001",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "Patient scenario: A 42-year-old painter reports 3 months of lateral shoulder pain, worse with overhead work and when lying on that side. AROM is mildly limited by pain and there is pain with resisted abduction, but no traumatic event and no gross weakness.\n\nWhich diagnosis is most likely?",
      "options": [
        "Adhesive capsulitis",
        "Subacromial pain syndrome / rotator cuff related shoulder pain",
        "Acute full-thickness rotator cuff tear",
        "Cervical myelopathy"
      ],
      "correctAnswer": 1,
      "explanation": "This pattern is most consistent with rotator cuff related shoulder pain (often termed subacromial pain syndrome): load-related lateral pain, painful arc/resisted testing, and no clear high-force trauma or major strength loss that would suggest acute full-thickness tear.",
      "tags": [
        "clinical-reasoning",
        "shoulder",
        "diagnosis",
        "chronic"
      ]
    },
    {
      "id": "reasoning-002",
      "category": "shoulder",
      "difficulty": "hard",
      "question": "Patient scenario: A 67-year-old falls onto an outstretched hand and has immediate shoulder pain. They cannot actively elevate the arm above 45° and report marked night pain. Passive elevation is near full but painful.\n\nWhat is the best next clinical step?",
      "options": [
        "Begin heavy overhead strengthening immediately",
        "Treat as minor strain and review in 8 weeks",
        "Urgent medical/orthopedic referral for possible acute traumatic rotator cuff tear",
        "Advise complete shoulder immobilization for 6 weeks with no reassessment"
      ],
      "correctAnswer": 2,
      "explanation": "In older adults, traumatic onset with major active elevation loss but relatively preserved passive range raises concern for acute traumatic cuff tear. Timely referral is appropriate because early surgical opinion may influence outcomes in selected cases.",
      "tags": [
        "clinical-reasoning",
        "shoulder",
        "red-flag response",
        "acute"
      ]
    },
    {
      "id": "reasoning-010",
      "category": "shoulder",
      "difficulty": "hard",
      "question": "Patient scenario: Six weeks after arthroscopic rotator cuff repair, a patient has pain 2/10 at rest, healing incisions, and near-full passive ROM, but active elevation remains weak.\n\nWhich progression is most appropriate now?",
      "options": [
        "Begin pain-monitored active motion and low-load cuff/scapular strengthening per protocol",
        "Start maximal overhead press and pull-ups",
        "Stop all movement for another 6 weeks",
        "Ignore surgeon protocol and test 1RM strength"
      ],
      "correctAnswer": 0,
      "explanation": "At this stage, many protocols progress toward active control and low-load strengthening while protecting the repair and respecting tissue healing timelines and surgeon guidance.",
      "tags": [
        "clinical-reasoning",
        "post-op rehab",
        "exercise progression",
        "shoulder"
      ]
    },
    {
      "id": "reasoning-012",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "Patient scenario: A 47-year-old office worker has 7 months of lateral elbow pain worsened by gripping and keyboard-heavy days. No traumatic event; resisted wrist extension reproduces familiar pain.\n\nWhich diagnosis is most likely?",
      "options": [
        "Cervical radiculopathy",
        "Lateral elbow tendinopathy",
        "Acute radial head fracture",
        "Systemic inflammatory arthritis flare"
      ],
      "correctAnswer": 1,
      "explanation": "Gradual load-related lateral elbow pain with gripping and resisted wrist extension is typical of lateral elbow tendinopathy. Management usually centers on load modification and progressive strengthening.",
      "tags": [
        "clinical-reasoning",
        "tendinopathy",
        "diagnosis",
        "chronic"
      ]
    }
  ],

  "knee": [
    {
      "id": "reasoning-003",
      "category": "knee",
      "difficulty": "medium",
      "question": "Patient scenario: A 19-year-old soccer player felt a pop while cutting, developed rapid knee swelling within 2 hours, and now reports giving way episodes.\n\nWhich assessment finding would most strongly support your leading diagnosis?",
      "options": [
        "Pain only at tibial tuberosity palpation",
        "Positive Lachman with increased anterior translation and soft end feel",
        "Painful resisted knee extension without instability",
        "Posterior sag sign"
      ],
      "correctAnswer": 1,
      "explanation": "Mechanism, rapid effusion, and instability suggest ACL injury. A positive Lachman (increased translation with soft end feel) is one of the strongest clinical exam findings supporting ACL rupture.",
      "tags": [
        "clinical-reasoning",
        "knee",
        "assessment finding",
        "acute"
      ]
    },
    {
      "id": "reasoning-004",
      "category": "knee",
      "difficulty": "medium",
      "question": "Patient scenario: A 28-year-old recreational runner has 6 months of anterior knee pain aggravated by stairs, squats, and prolonged sitting. No locking or traumatic episode. They have reduced single-leg squat control.\n\nWhat is the best initial treatment approach?",
      "options": [
        "Immediate arthroscopy",
        "Progressive hip and knee strengthening with load modification and education",
        "Long-term knee brace use as sole treatment",
        "Avoid all knee flexion tasks indefinitely"
      ],
      "correctAnswer": 1,
      "explanation": "This presentation is typical of patellofemoral pain. Best-supported first-line care includes progressive exercise (hip and knee focus), symptom-guided load management, and education.",
      "tags": [
        "clinical-reasoning",
        "knee",
        "treatment approach",
        "chronic"
      ]
    },
    {
      "id": "reasoning-009",
      "category": "knee",
      "difficulty": "hard",
      "question": "Patient scenario: Four weeks after ACL reconstruction (hamstring graft), a patient has minimal effusion, full passive extension, but quadriceps lag during straight-leg raise and poor terminal knee extension control in gait.\n\nWhat is the best exercise progression priority?",
      "options": [
        "Plyometric hop training",
        "Restore quadriceps activation and terminal extension control before high-load tasks",
        "Max-load open-chain knee extension to failure daily",
        "Return to cutting drills immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Early ACLR progression should prioritize swelling control, full extension, and quadriceps function before introducing advanced power and change-of-direction tasks.",
      "tags": [
        "clinical-reasoning",
        "post-op rehab",
        "exercise progression",
        "knee"
      ]
    },
    {
      "id": "reasoning-014",
      "category": "knee",
      "difficulty": "hard",
      "question": "Patient scenario: A 62-year-old with knee OA reports chronic pain, deconditioning, and fear of stairs. Resting pain is low, but activity pain rises to 4/10 and settles within 24 hours.\n\nWhat progression strategy is most appropriate?",
      "options": [
        "Avoid strengthening because any pain is harmful",
        "Use graded strengthening and functional step tasks with pain-monitoring rules",
        "Prescribe only passive modalities long term",
        "Advise total activity cessation"
      ],
      "correctAnswer": 1,
      "explanation": "For chronic OA presentations, graded loading with clear symptom-monitoring boundaries is effective and helps rebuild function and confidence while minimizing flare risk.",
      "tags": [
        "clinical-reasoning",
        "knee",
        "exercise progression",
        "chronic"
      ]
    }
  ],

  "low back": [
    {
      "id": "reasoning-005",
      "category": "low back",
      "difficulty": "hard",
      "question": "Patient scenario: A 54-year-old presents with severe low back pain and new urinary retention, saddle numbness, and bilateral leg symptoms that progressed over 24 hours.\n\nWhat is the most appropriate response?",
      "options": [
        "Provide routine exercise handout and review in 2 weeks",
        "Refer urgently to emergency medical care for possible cauda equina syndrome",
        "Start only lumbar mobilization and reassess next month",
        "Advise strict bed rest for 7 days"
      ],
      "correctAnswer": 1,
      "explanation": "This is a red-flag cluster for possible cauda equina syndrome. Immediate emergency referral is required; delayed management risks permanent neurologic and bladder/bowel dysfunction.",
      "tags": [
        "clinical-reasoning",
        "low back",
        "red-flag response",
        "acute"
      ]
    },
    {
      "id": "reasoning-006",
      "category": "low back",
      "difficulty": "medium",
      "question": "Patient scenario: A 36-year-old with acute low back pain after lifting has no neurologic deficit, no trauma, and no systemic red flags. They are fearful that movement will worsen damage.\n\nWhich management message is best?",
      "options": [
        "Complete bed rest until fully pain-free",
        "Early return to tolerated movement with reassurance and graded activity",
        "Urgent MRI before any activity",
        "Avoid bending forever"
      ],
      "correctAnswer": 1,
      "explanation": "For uncomplicated acute low back pain, evidence supports reassurance, staying active, and graded return to function. Addressing fear-avoidance early improves recovery and confidence.",
      "tags": [
        "clinical-reasoning",
        "low back",
        "treatment approach",
        "acute"
      ]
    },
    {
      "id": "reasoning-013",
      "category": "low back",
      "difficulty": "medium",
      "question": "Patient scenario: A 45-year-old warehouse worker reports 10 days of low back and right leg pain to the calf. Repeated extension in standing centralizes pain from calf to buttock.\n\nHow should this finding influence treatment?",
      "options": [
        "It has no relevance; use random exercises only",
        "Favor a directional-preference program that continues to centralize symptoms",
        "Immediate surgical referral despite no red flags",
        "Stop all movement because symptoms changed location"
      ],
      "correctAnswer": 1,
      "explanation": "Centralization during repeated movement testing is often a favorable directional response and can guide initial exercise selection and self-management strategy.",
      "tags": [
        "clinical-reasoning",
        "low back",
        "assessment finding",
        "acute vs chronic"
      ]
    },
    {
      "id": "reasoning-015",
      "category": "low back",
      "difficulty": "hard",
      "question": "Patient scenario: A 71-year-old with osteoporosis reports sudden thoracolumbar pain after lifting a light box. Pain is focal, severe, and worse with standing. No neurologic deficits are present.\n\nWhat is the best immediate response?",
      "options": [
        "Initiate high-load spinal flexion strengthening same day",
        "Screen for possible vertebral compression fracture and refer for medical evaluation",
        "Assume nonspecific strain and discharge without follow-up",
        "Start return-to-running program"
      ],
      "correctAnswer": 1,
      "explanation": "Age, osteoporosis, low-load mechanism, and sudden focal severe pain increase suspicion for vertebral compression fracture, which warrants prompt medical assessment.",
      "tags": [
        "clinical-reasoning",
        "low back",
        "red-flag response",
        "acute"
      ]
    }
  ],

  "ankle": [
    {
      "id": "reasoning-007",
      "category": "ankle",
      "difficulty": "medium",
      "question": "Patient scenario: A basketball player lands on an inverted plantarflexed foot 2 days ago. There is lateral ankle swelling, pain with weight-bearing, and tenderness over the ATFL region but no bony tenderness at the malleolar zones.\n\nWhat is the most appropriate early rehab strategy?",
      "options": [
        "8 weeks strict casting for all sprains",
        "Pain-guided protected loading, ROM, and progressive balance training",
        "No weight-bearing until pain is zero regardless of severity",
        "Passive ultrasound only"
      ],
      "correctAnswer": 1,
      "explanation": "For many lateral ankle sprains, early protected loading and progressive mobility/proprioception are preferred over prolonged immobilization, while monitoring irritability.",
      "tags": [
        "clinical-reasoning",
        "ankle",
        "treatment approach",
        "acute"
      ]
    },
    {
      "id": "reasoning-008",
      "category": "ankle",
      "difficulty": "hard",
      "question": "Patient scenario: A runner reports 8 months of repeated ankle “giving way” after an old inversion sprain. They can jog but feel unstable on uneven ground and fail single-leg balance compared with the other side.\n\nWhat diagnosis best fits?",
      "options": [
        "Acute grade III sprain",
        "Chronic ankle instability",
        "Achilles rupture",
        "Isolated plantar fasciitis"
      ],
      "correctAnswer": 1,
      "explanation": "Recurrent instability episodes plus persistent neuromuscular deficits months after initial sprain strongly indicate chronic ankle instability.",
      "tags": [
        "clinical-reasoning",
        "ankle",
        "diagnosis",
        "chronic"
      ]
    },
    {
      "id": "reasoning-011",
      "category": "ankle",
      "difficulty": "medium",
      "question": "Patient scenario: A 33-year-old runner has gradual onset Achilles pain and morning stiffness for 5 months, worse after hill sessions. No rupture signs are present.\n\nWhat is the best first-line loading approach?",
      "options": [
        "Complete rest until all symptoms disappear",
        "Structured progressive calf loading program with symptom monitoring",
        "Immediate corticosteroid injection as sole treatment",
        "Only stretching aggressively into pain multiple times daily"
      ],
      "correctAnswer": 1,
      "explanation": "Mid-portion Achilles tendinopathy responds best to progressive tendon loading programs (e.g., heavy-slow resistance or similar), adjusted to symptom response and activity demands.",
      "tags": [
        "clinical-reasoning",
        "tendinopathy",
        "ankle",
        "treatment approach",
        "chronic"
      ]
    }
  ],

  "clinical reasoning": [
    {
      "id": "reasoning-016",
      "category": "clinical reasoning",
      "difficulty": "medium",
      "question": "Patient scenario: A patient 3 months post-ankle sprain improved pain from 7/10 to 2/10, but still cannot pass single-leg hop and avoids sport due to fear of reinjury.\n\nWhat is the best clinical reasoning next step?",
      "options": [
        "Discharge because pain improved",
        "Reassess functional deficits and confidence, then progress sport-specific exposure",
        "Repeat only passive treatment despite functional limits",
        "Order imaging only and stop rehab"
      ],
      "correctAnswer": 1,
      "explanation": "Pain improvement alone is insufficient for return-to-sport decisions. Persistent functional and psychological barriers should guide ongoing progression and readiness testing.",
      "tags": [
        "clinical-reasoning",
        "exercise progression",
        "acute vs chronic"
      ]
    }
  ]
};
