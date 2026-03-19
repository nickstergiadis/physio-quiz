/**
 * Organized question sets by category.
 * Add new questions to the category array that matches your content area.
 */
export const NORMAL_QUESTION_SETS = {
  "shoulder": [
    {
      "id": "shoulder-001",
      "category": "shoulder",
      "difficulty": "easy",
      "question": "During shoulder elevation, which movement fault most commonly increases subacromial load in symptomatic rotator cuff presentations?",
      "options": [
        "Early excessive scapular upward rotation",
        "Reduced posterior tilt and upward rotation of the scapula",
        "Excessive thoracic extension",
        "Increased humeral external rotation"
      ],
      "correctAnswer": 1,
      "explanation": "Reduced scapular posterior tilt/upward rotation can reduce clearance and increase tendon compression during elevation.",
      "tags": [
        "anatomy",
        "biomechanics"
      ]
    },
    {
      "id": "shoulder-002",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "A 48-year-old carpenter has lateral shoulder pain for 4 months, painful arc, and pain-limited but nearly full passive ROM. Which finding most strongly shifts your differential toward adhesive capsulitis instead of rotator cuff related shoulder pain?",
      "options": [
        "Pain with resisted abduction",
        "Pain when sleeping on the shoulder",
        "Marked passive external rotation restriction with firm capsular end-feel",
        "Symptoms after overhead work"
      ],
      "correctAnswer": 2,
      "explanation": "Adhesive capsulitis is characterized by substantial passive ROM restriction, especially external rotation, not only pain-provoked active testing.",
      "tags": [
        "assessment",
        "differential diagnosis"
      ]
    },
    {
      "id": "shoulder-003",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "For irritable rotator cuff tendinopathy in week 1-2, which exercise plan is most appropriate?",
      "options": [
        "Daily heavy overhead press to fatigue",
        "Pain-monitored isometrics plus low-load elevation below aggravating range",
        "No shoulder loading for 6 weeks",
        "Only passive modalities and no home program"
      ],
      "correctAnswer": 1,
      "explanation": "Early pain-modulated loading builds tolerance while limiting flare-ups and preserves confidence and function.",
      "tags": [
        "treatment planning",
        "exercise prescription"
      ]
    },
    {
      "id": "shoulder-004",
      "category": "shoulder",
      "difficulty": "hard",
      "question": "A volleyball player 5 months after shoulder instability rehab is pain-free in ADLs but anxious with overhead spikes. Which return-to-sport criterion is most defensible before unrestricted play?",
      "options": [
        "Pain-free rest only",
        "Equal passive ROM only",
        "Symmetrical shoulder strength/endurance with successful sport-specific plyometric progression",
        "Normal ultrasound appearance of the cuff"
      ],
      "correctAnswer": 2,
      "explanation": "Return decisions should include capacity testing and graded sport-specific exposure, not symptoms at rest alone.",
      "tags": [
        "return to sport",
        "sports physio"
      ]
    },
    {
      "id": "shoulder-005",
      "category": "shoulder",
      "difficulty": "easy",
      "question": "Following a traumatic shoulder injury, which presentation is most concerning for urgent medical referral?",
      "options": [
        "Painful arc without trauma",
        "Night pain after increased training volume",
        "Acute loss of active elevation with relatively preserved passive ROM",
        "Mild pain only with end-range stretching"
      ],
      "correctAnswer": 2,
      "explanation": "Major active weakness after trauma can indicate acute full-thickness cuff tear or other structural injury needing timely specialist review.",
      "tags": [
        "red flags",
        "contraindications"
      ]
    }
  ],

  "knee": [
    {
      "id": "knee-001",
      "category": "knee",
      "difficulty": "easy",
      "question": "Which history pattern most strongly supports ACL rupture over isolated MCL sprain?",
      "options": [
        "Direct valgus blow with localized medial tenderness and no effusion",
        "Non-contact pivot with pop, rapid effusion, and early instability",
        "Gradual anterior knee pain with stairs",
        "Pain only after prolonged kneeling"
      ],
      "correctAnswer": 1,
      "explanation": "A pivoting mechanism plus rapid swelling and giving-way is classic for ACL injury.",
      "tags": [
        "assessment",
        "differential diagnosis"
      ]
    },
    {
      "id": "knee-002",
      "category": "knee",
      "difficulty": "medium",
      "question": "In early ACL reconstruction rehab (week 3-6), which objective should usually be prioritized before plyometrics?",
      "options": [
        "Maximal single-leg hop distance",
        "Full extension, minimal effusion, and improved quadriceps activation",
        "Running speed over 20 meters",
        "Deep loaded pivoting drills"
      ],
      "correctAnswer": 1,
      "explanation": "Early phase progression is driven by impairment milestones (extension, swelling, quad control) before high-impact work.",
      "tags": [
        "ortho rehab",
        "treatment planning"
      ]
    },
    {
      "id": "knee-003",
      "category": "knee",
      "difficulty": "medium",
      "question": "A runner with patellofemoral pain reports pain 4/10 during squats that returns to baseline by next morning. How should this guide exercise progression?",
      "options": [
        "Stop all squatting immediately",
        "Continue and progress load gradually within symptom-monitoring limits",
        "Only use passive therapy for 4 weeks",
        "Delay all strengthening until completely pain-free"
      ],
      "correctAnswer": 1,
      "explanation": "Many PFP programs allow tolerable, short-lived pain while load is progressed according to irritability and recovery.",
      "tags": [
        "exercise prescription",
        "sports physio"
      ]
    },
    {
      "id": "knee-004",
      "category": "knee",
      "difficulty": "hard",
      "question": "A 58-year-old with knee OA has fear of stairs and reduced activity tolerance. Which plan best matches evidence-based outpatient physio?",
      "options": [
        "Long-term rest with analgesics only",
        "Progressive strength plus step-down retraining and graded walking exposure",
        "Immediate referral for arthroscopy",
        "Avoid any exercise that reproduces symptoms"
      ],
      "correctAnswer": 1,
      "explanation": "For knee OA, education with progressive strengthening and functional task exposure improves pain and participation.",
      "tags": [
        "treatment planning",
        "exercise-based rehab"
      ]
    },
    {
      "id": "knee-005",
      "category": "knee",
      "difficulty": "hard",
      "question": "After ACL reconstruction, which criterion set is most appropriate for return to cutting sport?",
      "options": [
        "Time since surgery only",
        "No effusion plus >90% limb symmetry on hop and strength tests with psychological readiness",
        "Full ROM only",
        "Surgeon clearance without functional testing"
      ],
      "correctAnswer": 1,
      "explanation": "Return-to-sport decisions should combine physical capacity, knee status, and confidence/readiness measures.",
      "tags": [
        "return to sport",
        "assessment"
      ]
    }
  ],

  "low back": [
    {
      "id": "lowback-001",
      "category": "low back",
      "difficulty": "easy",
      "question": "In an acute nonspecific low back pain case without red flags, what is the most appropriate first-line advice?",
      "options": [
        "Strict bed rest for one week",
        "Stay active, reassure, and resume tolerated function early",
        "Urgent MRI before movement",
        "Avoid trunk flexion permanently"
      ],
      "correctAnswer": 1,
      "explanation": "Guideline-consistent care emphasizes reassurance and early graded activity over rest and routine imaging.",
      "tags": [
        "treatment planning",
        "contraindications"
      ]
    },
    {
      "id": "lowback-002",
      "category": "low back",
      "difficulty": "medium",
      "question": "Which presentation should trigger same-day emergency referral rather than routine rehab?",
      "options": [
        "Back pain aggravated by prolonged sitting",
        "Unilateral leg pain after lifting",
        "New urinary retention with saddle anesthesia and progressive bilateral symptoms",
        "Morning stiffness easing after movement"
      ],
      "correctAnswer": 2,
      "explanation": "This symptom cluster is concerning for cauda equina syndrome and requires urgent medical management.",
      "tags": [
        "red flags",
        "differential diagnosis"
      ]
    },
    {
      "id": "lowback-003",
      "category": "low back",
      "difficulty": "medium",
      "question": "A patient fears bending after an episode of back pain but neurologic screening is normal. What is the best communication strategy?",
      "options": [
        "Confirm bending is dangerous for all patients",
        "Use reassurance and graded exposure to feared movements",
        "Avoid discussing activity until pain is zero",
        "Recommend permanent lumbar bracing"
      ],
      "correctAnswer": 1,
      "explanation": "Reducing fear-avoidance through education and graded exposure supports functional recovery.",
      "tags": [
        "clinical reasoning",
        "exercise-based rehab"
      ]
    },
    {
      "id": "lowback-004",
      "category": "low back",
      "difficulty": "hard",
      "question": "Repeated movement testing centralizes leg pain from calf to buttock. What is the most appropriate interpretation?",
      "options": [
        "Worsening neurologic status requiring immediate surgery",
        "Potentially favorable directional response to guide exercise selection",
        "Finding is clinically irrelevant",
        "Absolute contraindication to exercise"
      ],
      "correctAnswer": 1,
      "explanation": "Centralization can help identify a directional preference and self-management strategy in selected patients.",
      "tags": [
        "assessment",
        "differential diagnosis"
      ]
    },
    {
      "id": "lowback-005",
      "category": "low back",
      "difficulty": "hard",
      "question": "A 72-year-old with known osteoporosis develops sudden focal thoracolumbar pain after lifting a light grocery bag. Best next step?",
      "options": [
        "Start high-load deadlifts immediately",
        "Suspect vertebral compression fracture and arrange prompt medical assessment",
        "Treat as routine muscle strain only",
        "Prescribe running intervals"
      ],
      "correctAnswer": 1,
      "explanation": "Age, osteoporosis, and low-load sudden focal pain are red flags for possible vertebral compression fracture.",
      "tags": [
        "red flags",
        "contraindications"
      ]
    }
  ],

  "ankle": [
    {
      "id": "ankle-001",
      "category": "ankle",
      "difficulty": "easy",
      "question": "What mechanism most commonly causes injury to the anterior talofibular ligament (ATFL)?",
      "options": [
        "Forced dorsiflexion with external rotation",
        "Inversion with plantarflexion",
        "Direct blow to anterior tibia",
        "Hyperextension during sprinting"
      ],
      "correctAnswer": 1,
      "explanation": "ATFL injury is most often associated with inversion and plantarflexion mechanisms.",
      "tags": [
        "anatomy",
        "sports physio"
      ]
    },
    {
      "id": "ankle-002",
      "category": "ankle",
      "difficulty": "medium",
      "question": "In the first week after a lateral ankle sprain, which program is usually most appropriate?",
      "options": [
        "Complete non-weight-bearing until all pain resolves",
        "Protected weight-bearing, ROM, and early balance retraining as tolerated",
        "Heavy plyometrics on day 2",
        "Passive modalities only"
      ],
      "correctAnswer": 1,
      "explanation": "Early progressive loading and neuromuscular work improve recovery compared with prolonged immobilization in many sprains.",
      "tags": [
        "treatment planning",
        "exercise prescription"
      ]
    },
    {
      "id": "ankle-003",
      "category": "ankle",
      "difficulty": "medium",
      "question": "Which finding most increases suspicion of syndesmotic injury rather than isolated lateral sprain?",
      "options": [
        "Tenderness only over ATFL",
        "Pain with squeeze test and external rotation stress",
        "Immediate pain relief with hopping",
        "Isolated plantar heel pain"
      ],
      "correctAnswer": 1,
      "explanation": "Pain provoked by squeeze/external rotation tests supports syndesmotic involvement.",
      "tags": [
        "assessment",
        "differential diagnosis"
      ]
    },
    {
      "id": "ankle-004",
      "category": "ankle",
      "difficulty": "hard",
      "question": "A field athlete is 6 weeks post ankle sprain and wants to return to matches. Which criterion is most useful for readiness decisions?",
      "options": [
        "No tenderness to palpation only",
        "Symmetrical hop, balance, and change-of-direction control with confidence",
        "Ankle circumference equal at rest only",
        "Normal X-ray only"
      ],
      "correctAnswer": 1,
      "explanation": "Functional performance and confidence under sport-like demands are key for return-to-sport decision-making.",
      "tags": [
        "return to sport",
        "sports physio"
      ]
    },
    {
      "id": "ankle-005",
      "category": "ankle",
      "difficulty": "hard",
      "question": "Which finding after ankle trauma should prompt urgent imaging referral based on Ottawa-style screening principles?",
      "options": [
        "Mild swelling with full weight-bearing",
        "Inability to bear weight for four steps plus posterior malleolar tenderness",
        "Pain only during jogging",
        "Pain improved after taping"
      ],
      "correctAnswer": 1,
      "explanation": "Bony tenderness in malleolar zones with inability to bear weight raises fracture suspicion and indicates imaging.",
      "tags": [
        "red flags",
        "contraindications"
      ]
    }
  ],

  "cervical spine": [
    {
      "id": "cervical-001",
      "category": "cervical spine",
      "difficulty": "easy",
      "question": "In persistent neck pain, training which muscle group often improves motor control and endurance?",
      "options": [
        "Masseter",
        "Deep neck flexors",
        "Latissimus dorsi",
        "Gluteus medius"
      ],
      "correctAnswer": 1,
      "explanation": "Deep neck flexor endurance deficits are common and are frequently targeted in exercise-based neck rehab.",
      "tags": [
        "anatomy",
        "exercise-based rehab"
      ]
    },
    {
      "id": "cervical-002",
      "category": "cervical spine",
      "difficulty": "medium",
      "question": "Which clinical picture most supports cervical radiculopathy over rotator cuff pathology?",
      "options": [
        "Pain only with overhead pressing",
        "Arm pain/paresthesia in a dermatomal pattern and positive Spurling test",
        "Night pain when lying on shoulder only",
        "Weakness only during external rotation testing"
      ],
      "correctAnswer": 1,
      "explanation": "Dermatomal sensory symptoms with positive nerve root provocation supports radiculopathy.",
      "tags": [
        "differential diagnosis",
        "assessment"
      ]
    },
    {
      "id": "cervical-003",
      "category": "cervical spine",
      "difficulty": "medium",
      "question": "For desk-related neck pain with low irritability, which initial plan is most appropriate?",
      "options": [
        "Prolonged collar immobilization",
        "Manual therapy only for 6 weeks",
        "Graded cervical/scapular exercise plus workstation and movement-break coaching",
        "Avoid all strengthening"
      ],
      "correctAnswer": 2,
      "explanation": "A multimodal active approach improves capacity and reduces sustained postural load.",
      "tags": [
        "treatment planning",
        "exercise prescription"
      ]
    },
    {
      "id": "cervical-004",
      "category": "cervical spine",
      "difficulty": "hard",
      "question": "Which presentation is most concerning for cervical myelopathy and warrants urgent medical referral?",
      "options": [
        "Unilateral neck pain after poor sleep",
        "Hand clumsiness, gait disturbance, and bilateral upper motor neuron signs",
        "Local tenderness over upper trapezius",
        "Pain with end-range rotation only"
      ],
      "correctAnswer": 1,
      "explanation": "Progressive bilateral neurologic signs and gait/hand dexterity changes are red flags for cord involvement.",
      "tags": [
        "red flags",
        "contraindications"
      ]
    },
    {
      "id": "cervical-005",
      "category": "cervical spine",
      "difficulty": "hard",
      "question": "A contact-sport athlete is returning after neck pain. Which criterion best supports return-to-play?",
      "options": [
        "Pain-free at rest only",
        "Near-normal cervical strength, full painless ROM, and no neurologic deficits during sport-specific loading",
        "Normal MRI alone",
        "One week since symptoms began"
      ],
      "correctAnswer": 1,
      "explanation": "Return-to-play decisions should include symptom resolution plus objective physical and neurologic readiness.",
      "tags": [
        "return to sport",
        "sports physio"
      ]
    }
  ],

  "exercise prescription": [
    {
      "id": "exrx-001",
      "category": "exercise prescription",
      "difficulty": "easy",
      "question": "A patient with rotator cuff pain flares after every session. Which dosage adjustment is most appropriate first?",
      "options": [
        "Double the load and keep frequency unchanged",
        "Reduce volume/intensity and progress using symptom response",
        "Stop all exercise indefinitely",
        "Switch to passive treatment only"
      ],
      "correctAnswer": 1,
      "explanation": "Dose calibration using symptom response is central to adherence and progressive loading in rehab.",
      "tags": [
        "exercise prescription",
        "treatment planning"
      ]
    },
    {
      "id": "exrx-002",
      "category": "exercise prescription",
      "difficulty": "medium",
      "question": "For early strength rebuilding in outpatient rehab, which dosage is generally a practical starting point?",
      "options": [
        "1 set monthly",
        "2-4 sets of 6-12 reps at a tolerable effort",
        "100 reps to failure daily",
        "No rest days"
      ],
      "correctAnswer": 1,
      "explanation": "Moderate set-rep schemes with planned progression are commonly effective and clinically practical.",
      "tags": [
        "dosage",
        "exercise-based rehab"
      ]
    },
    {
      "id": "exrx-003",
      "category": "exercise prescription",
      "difficulty": "medium",
      "question": "Which strategy most improves adherence when a home program feels overwhelming?",
      "options": [
        "Add more exercises to improve variety",
        "Co-design a shorter plan tied to the patient's goals and routine",
        "Delay all exercise until motivation improves",
        "Use generic handouts without discussion"
      ],
      "correctAnswer": 1,
      "explanation": "Shared planning and simplified dosing usually improve follow-through better than increasing complexity.",
      "tags": [
        "adherence",
        "clinical reasoning"
      ]
    },
    {
      "id": "exrx-004",
      "category": "exercise prescription",
      "difficulty": "hard",
      "question": "A post-op knee patient reports pain up to 4/10 during exercise that settles by next day with no increased swelling. Best interpretation?",
      "options": [
        "Automatic sign of tissue damage",
        "Likely acceptable training response within pain-monitoring limits",
        "Absolute contraindication to strengthening",
        "Reason to discharge from rehab"
      ],
      "correctAnswer": 1,
      "explanation": "In many protocols, tolerable pain that settles within 24 hours can be acceptable for progression if joint response remains stable.",
      "tags": [
        "pain monitoring",
        "ortho rehab"
      ]
    },
    {
      "id": "exrx-005",
      "category": "exercise prescription",
      "difficulty": "hard",
      "question": "Which progression model best prepares patients for return-to-function in physically demanding work?",
      "options": [
        "Open-chain isolation only",
        "Stepwise progression from impairment work to task-specific loaded patterns",
        "Manual therapy only",
        "Random exercise selection each session"
      ],
      "correctAnswer": 1,
      "explanation": "Bridging from base strength to specific work tasks supports transfer to real-world performance demands.",
      "tags": [
        "return to function",
        "treatment planning"
      ]
    }
  ]
};
