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
      "question": "Which muscle is most associated with initiating shoulder abduction?",
      "options": [
        "Teres major",
        "Supraspinatus",
        "Latissimus dorsi",
        "Subscapularis"
      ],
      "correctAnswer": 1,
      "explanation": "Supraspinatus initiates the first phase of abduction before the deltoid becomes dominant.",
      "tags": [
        "rotator cuff"
      ]
    },
    {
      "id": "shoulder-002",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "A positive painful arc between 60° and 120° most commonly suggests:",
      "options": [
        "Adhesive capsulitis",
        "Subacromial pain syndrome",
        "AC joint instability",
        "Posterior dislocation"
      ],
      "correctAnswer": 1,
      "explanation": "Painful arc in mid-range is classically associated with subacromial pain mechanisms.",
      "tags": [
        "assessment"
      ]
    },
    {
      "id": "shoulder-003",
      "category": "shoulder",
      "difficulty": "medium",
      "question": "Which test is commonly used to assess subscapularis function?",
      "options": [
        "Empty can test",
        "Lift-off test",
        "Sulcus sign",
        "Neer test"
      ],
      "correctAnswer": 1,
      "explanation": "The lift-off test challenges internal rotation strength linked to subscapularis function.",
      "tags": [
        "clinical test"
      ]
    },
    {
      "id": "shoulder-004",
      "category": "shoulder",
      "difficulty": "hard",
      "question": "In early rotator cuff tendinopathy rehab, the best initial loading strategy is:",
      "options": [
        "Complete rest until pain-free",
        "High-load overhead presses daily",
        "Pain-monitored progressive loading",
        "Only passive modalities"
      ],
      "correctAnswer": 2,
      "explanation": "Progressive, pain-monitored loading supports tissue capacity and symptom control.",
      "tags": [
        "rehab"
      ]
    },
    {
      "id": "shoulder-005",
      "category": "shoulder",
      "difficulty": "easy",
      "question": "Scapular upward rotation during elevation is primarily produced by:",
      "options": [
        "Upper and lower trapezius with serratus anterior",
        "Rhomboids only",
        "Pectoralis minor only",
        "Biceps brachii"
      ],
      "correctAnswer": 0,
      "explanation": "A force couple of trapezius and serratus anterior drives normal upward rotation.",
      "tags": [
        "biomechanics"
      ]
    }
  ],

  "knee": [
    {
      "id": "knee-001",
      "category": "knee",
      "difficulty": "easy",
      "question": "Which ligament is most directly assessed with the Lachman test?",
      "options": [
        "PCL",
        "MCL",
        "ACL",
        "LCL"
      ],
      "correctAnswer": 2,
      "explanation": "Lachman is the primary physical exam test for ACL integrity.",
      "tags": [
        "acl"
      ]
    },
    {
      "id": "knee-002",
      "category": "knee",
      "difficulty": "medium",
      "question": "A traumatic non-contact pivot injury with immediate swelling most suggests:",
      "options": [
        "Patellar tendinopathy",
        "ACL rupture",
        "Pes anserine bursitis",
        "ITB syndrome"
      ],
      "correctAnswer": 1,
      "explanation": "Mechanism plus rapid effusion strongly raises suspicion for ACL injury.",
      "tags": [
        "history"
      ]
    },
    {
      "id": "knee-003",
      "category": "knee",
      "difficulty": "medium",
      "question": "Which exercise is often used early after ACL reconstruction to restore quadriceps activation?",
      "options": [
        "Deep jump squats",
        "Open-chain knee extension at max load",
        "Quadriceps sets and straight-leg raises",
        "Heavy leg press below 60° only"
      ],
      "correctAnswer": 2,
      "explanation": "Quad sets and SLRs are common early-stage options to regain control safely.",
      "tags": [
        "post-op"
      ]
    },
    {
      "id": "knee-004",
      "category": "knee",
      "difficulty": "hard",
      "question": "For patellofemoral pain, which factor is most consistently supported in management?",
      "options": [
        "Routine arthroscopy",
        "Exercise therapy targeting hip and knee",
        "Long-term immobilization",
        "Avoiding all squatting forever"
      ],
      "correctAnswer": 1,
      "explanation": "Guidelines emphasize progressive exercise, often including hip and knee strengthening.",
      "tags": [
        "pfp"
      ]
    },
    {
      "id": "knee-005",
      "category": "knee",
      "difficulty": "easy",
      "question": "The meniscus functions primarily to:",
      "options": [
        "Produce knee extension torque",
        "Improve load distribution and joint stability",
        "Limit all tibial rotation",
        "Attach quadriceps to tibia"
      ],
      "correctAnswer": 1,
      "explanation": "Menisci help distribute load, absorb shock, and contribute to stability.",
      "tags": [
        "anatomy"
      ]
    }
  ],

  "low back": [
    {
      "id": "lowback-001",
      "category": "low back",
      "difficulty": "easy",
      "question": "In uncomplicated acute low back pain, first-line advice is generally to:",
      "options": [
        "Remain on strict bed rest for 7 days",
        "Stay active and resume tolerated movement",
        "Get urgent MRI immediately",
        "Stop all exercise permanently"
      ],
      "correctAnswer": 1,
      "explanation": "Early return to movement and activity is linked with better outcomes.",
      "tags": [
        "guidelines"
      ]
    },
    {
      "id": "lowback-002",
      "category": "low back",
      "difficulty": "medium",
      "question": "Which symptom is a red flag requiring urgent medical referral?",
      "options": [
        "Pain with prolonged sitting",
        "Morning stiffness < 15 minutes",
        "New urinary retention with saddle anesthesia",
        "Pain after lifting"
      ],
      "correctAnswer": 2,
      "explanation": "Urinary retention and saddle anesthesia can indicate cauda equina syndrome.",
      "tags": [
        "red flags"
      ]
    },
    {
      "id": "lowback-003",
      "category": "low back",
      "difficulty": "medium",
      "question": "Which intervention has the best evidence for many persistent low back pain presentations?",
      "options": [
        "Passive electrotherapy alone",
        "Education plus graded exercise",
        "Permanent lumbar brace use",
        "Complete avoidance of bending"
      ],
      "correctAnswer": 1,
      "explanation": "Combined education and active rehabilitation is widely recommended.",
      "tags": [
        "management"
      ]
    },
    {
      "id": "lowback-004",
      "category": "low back",
      "difficulty": "hard",
      "question": "Centralization of symptoms during repeated movement testing is often interpreted as:",
      "options": [
        "A poor prognostic sign",
        "Unrelated to treatment response",
        "A potentially favorable directional response",
        "Automatic indication for surgery"
      ],
      "correctAnswer": 2,
      "explanation": "Symptom centralization may guide directional preference-based care.",
      "tags": [
        "mckenzie"
      ]
    },
    {
      "id": "lowback-005",
      "category": "low back",
      "difficulty": "easy",
      "question": "A common goal in early low back rehab is to improve:",
      "options": [
        "Fear and avoidance behaviors",
        "Movement confidence and function",
        "Dependence on imaging",
        "Tolerance to prolonged rest"
      ],
      "correctAnswer": 1,
      "explanation": "Improving confidence and function is central in modern low back management.",
      "tags": [
        "function"
      ]
    }
  ],

  "ankle": [
    {
      "id": "ankle-001",
      "category": "ankle",
      "difficulty": "easy",
      "question": "The most commonly injured ligament in a lateral ankle sprain is:",
      "options": [
        "Deltoid ligament",
        "Calcaneofibular ligament",
        "Anterior talofibular ligament",
        "Spring ligament"
      ],
      "correctAnswer": 2,
      "explanation": "ATFL is typically the first and most frequent structure injured.",
      "tags": [
        "sprain"
      ]
    },
    {
      "id": "ankle-002",
      "category": "ankle",
      "difficulty": "medium",
      "question": "After acute ankle sprain, early rehab should usually include:",
      "options": [
        "Rigid immobilization for 8 weeks",
        "Pain-guided mobility and loading progression",
        "No weight-bearing for all grades",
        "Only ultrasound treatment"
      ],
      "correctAnswer": 1,
      "explanation": "Early protected loading and mobility can reduce chronic instability risk.",
      "tags": [
        "rehab"
      ]
    },
    {
      "id": "ankle-003",
      "category": "ankle",
      "difficulty": "medium",
      "question": "Which test helps assess syndesmotic injury?",
      "options": [
        "Talar tilt test",
        "Thompson test",
        "Squeeze test",
        "Anterior drawer elbow test"
      ],
      "correctAnswer": 2,
      "explanation": "The squeeze test is commonly used in high ankle sprain evaluation.",
      "tags": [
        "assessment"
      ]
    },
    {
      "id": "ankle-004",
      "category": "ankle",
      "difficulty": "hard",
      "question": "Persistent episodes of giving way months after sprain most suggest:",
      "options": [
        "Chronic ankle instability",
        "Tarsal tunnel syndrome",
        "Acute fracture",
        "Plantar fasciitis"
      ],
      "correctAnswer": 0,
      "explanation": "Recurrent instability episodes are characteristic of chronic ankle instability.",
      "tags": [
        "chronic"
      ]
    },
    {
      "id": "ankle-005",
      "category": "ankle",
      "difficulty": "easy",
      "question": "A key return-to-sport criterion after ankle sprain is:",
      "options": [
        "No swelling ever again",
        "Symmetrical hop and balance performance",
        "Normal MRI only",
        "Pain-free at complete rest only"
      ],
      "correctAnswer": 1,
      "explanation": "Functional symmetry and confidence are important readiness markers.",
      "tags": [
        "return to sport"
      ]
    }
  ],

  "cervical spine": [
    {
      "id": "cervical-001",
      "category": "cervical spine",
      "difficulty": "easy",
      "question": "Which muscle group is often targeted for endurance training in neck pain rehab?",
      "options": [
        "Superficial neck extensors only",
        "Deep neck flexors",
        "Upper trapezius only",
        "Masseter"
      ],
      "correctAnswer": 1,
      "explanation": "Deep neck flexor endurance deficits are common in neck pain populations.",
      "tags": [
        "exercise"
      ]
    },
    {
      "id": "cervical-002",
      "category": "cervical spine",
      "difficulty": "medium",
      "question": "Cervical radiculopathy may present with:",
      "options": [
        "Diffuse abdominal pain",
        "Arm pain with dermatomal paresthesia",
        "Isolated ankle swelling",
        "Bilateral knee locking"
      ],
      "correctAnswer": 1,
      "explanation": "Neck-related nerve root irritation often causes radiating arm symptoms.",
      "tags": [
        "neuro"
      ]
    },
    {
      "id": "cervical-003",
      "category": "cervical spine",
      "difficulty": "medium",
      "question": "Which test cluster can improve confidence for cervical radiculopathy?",
      "options": [
        "Lachman + pivot shift",
        "Spurling + distraction + ULTT findings",
        "Thompson + squeeze tests",
        "Apley + McMurray"
      ],
      "correctAnswer": 1,
      "explanation": "A combination of provocation and relief tests can strengthen clinical suspicion.",
      "tags": [
        "cluster"
      ]
    },
    {
      "id": "cervical-004",
      "category": "cervical spine",
      "difficulty": "hard",
      "question": "In WAD grade II management, early best practice usually emphasizes:",
      "options": [
        "Prolonged cervical collar use",
        "Reassurance and graded active movement",
        "Surgical fixation",
        "Strict inactivity"
      ],
      "correctAnswer": 1,
      "explanation": "Active approaches with education are preferred over prolonged immobilization.",
      "tags": [
        "whiplash"
      ]
    },
    {
      "id": "cervical-005",
      "category": "cervical spine",
      "difficulty": "easy",
      "question": "A common ergonomic strategy for desk-related neck pain is:",
      "options": [
        "Monitor below knee level",
        "Frequent posture variation and movement breaks",
        "Locking neck in extension",
        "Only passive manual therapy"
      ],
      "correctAnswer": 1,
      "explanation": "Regular movement breaks and ergonomic setup reduce sustained loading.",
      "tags": [
        "ergonomics"
      ]
    }
  ],

  "exercise prescription": [
    {
      "id": "exrx-001",
      "category": "exercise prescription",
      "difficulty": "easy",
      "question": "The principle of progressive overload means:",
      "options": [
        "Keeping load unchanged forever",
        "Gradually increasing training demand over time",
        "Training only when pain is zero",
        "Avoiding strength work"
      ],
      "correctAnswer": 1,
      "explanation": "Tissues adapt when dose increases are planned and tolerable.",
      "tags": [
        "principles"
      ]
    },
    {
      "id": "exrx-002",
      "category": "exercise prescription",
      "difficulty": "medium",
      "question": "For many strength goals, a practical starting dosage range is:",
      "options": [
        "1 set monthly",
        "2-4 sets of 6-12 reps",
        "100 reps to failure daily",
        "No rest between sessions"
      ],
      "correctAnswer": 1,
      "explanation": "Moderate set-rep ranges are commonly used for strength and hypertrophy progress.",
      "tags": [
        "dosage"
      ]
    },
    {
      "id": "exrx-003",
      "category": "exercise prescription",
      "difficulty": "medium",
      "question": "Using a pain-monitoring model in rehab usually means:",
      "options": [
        "Any pain means tissue damage",
        "Some tolerable pain can be acceptable during loading",
        "Pain should be ignored completely",
        "Only passive care should be used"
      ],
      "correctAnswer": 1,
      "explanation": "Tolerable, non-escalating pain can be acceptable in many rehab contexts.",
      "tags": [
        "pain monitoring"
      ]
    },
    {
      "id": "exrx-004",
      "category": "exercise prescription",
      "difficulty": "hard",
      "question": "When adherence is poor, the best first adjustment is often to:",
      "options": [
        "Increase complexity",
        "Reduce dosage and co-design realistic goals",
        "Stop exercise entirely",
        "Blame motivation only"
      ],
      "correctAnswer": 1,
      "explanation": "A simpler, patient-centered plan often improves adherence and outcomes.",
      "tags": [
        "adherence"
      ]
    },
    {
      "id": "exrx-005",
      "category": "exercise prescription",
      "difficulty": "easy",
      "question": "A SMART rehab goal should be:",
      "options": [
        "Vague and open-ended",
        "Specific, measurable, achievable, relevant, and time-bound",
        "Set only by clinician",
        "Impossible to complete"
      ],
      "correctAnswer": 1,
      "explanation": "SMART goals support shared decision-making and progress tracking.",
      "tags": [
        "goal setting"
      ]
    }
  ]
};
