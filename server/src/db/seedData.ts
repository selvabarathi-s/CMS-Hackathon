import { Career, Skill, Assessment, Resource, StudentProfile, MentorIntervention, CurriculumGapInsight, UserAccount, NotificationItem } from '../types/shared.js';

export const SEED_SKILLS: Skill[] = [
  // --- Data & Software Skills (Engineering) ---
  {
    id: 'skill-python',
    name: 'Python Programming',
    category: 'Programming',
    discipline: 'engineering',
    difficulty: 'beginner',
    prerequisites: [],
    description: 'Core syntax, control flow, functions, OOP, and data handling libraries (Pandas, NumPy).',
    tags: ['python', 'coding', 'automation', 'backend']
  },
  {
    id: 'skill-sql',
    name: 'SQL & Relational Databases',
    category: 'Data Management',
    discipline: 'engineering',
    difficulty: 'beginner',
    prerequisites: [],
    description: 'Querying, joins, aggregations, window functions, indexing, schema design, and stored procedures.',
    tags: ['sql', 'database', 'queries', 'postgres']
  },
  {
    id: 'skill-stats',
    name: 'Applied Statistics & Probability',
    category: 'Mathematics',
    discipline: 'engineering',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Descriptive statistics, hypothesis testing, probability distributions, regression, and p-values.',
    tags: ['math', 'statistics', 'analytics', 'probability']
  },
  {
    id: 'skill-data-viz',
    name: 'Data Visualization & BI',
    category: 'Visualization',
    discipline: 'engineering',
    difficulty: 'intermediate',
    prerequisites: ['skill-sql'],
    description: 'Designing executive dashboards, charting best practices, PowerBI/Tableau and Python visualization.',
    tags: ['powerbi', 'tableau', 'matplotlib', 'charts']
  },
  {
    id: 'skill-ml',
    name: 'Machine Learning Algorithms',
    category: 'AI & Data Science',
    discipline: 'engineering',
    difficulty: 'advanced',
    prerequisites: ['skill-python', 'skill-stats'],
    description: 'Supervised/unsupervised models, scikit-learn, cross-validation, feature engineering, and metrics.',
    tags: ['ml', 'scikit-learn', 'deep learning', 'predictive']
  },
  {
    id: 'skill-cloud',
    name: 'Cloud Architecture & DevOps',
    category: 'Infrastructure',
    discipline: 'engineering',
    difficulty: 'intermediate',
    prerequisites: ['skill-python'],
    description: 'Docker containers, Kubernetes, CI/CD pipelines, AWS/GCP services, microservices.',
    tags: ['cloud', 'aws', 'docker', 'devops', 'kubernetes']
  },
  {
    id: 'skill-cybersec',
    name: 'Network & Cloud Security',
    category: 'Security',
    discipline: 'engineering',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Network protocols, vulnerability assessment, cryptography, zero-trust architectures, SIEM.',
    tags: ['security', 'network', 'firewall', 'crypto', 'soc']
  },
  {
    id: 'skill-embedded-iot',
    name: 'Embedded Systems & Microcontrollers',
    category: 'Hardware Engineering',
    discipline: 'engineering',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'ARM Cortex, Arduino/ESP32, RTOS, GPIO interfaces, serial communication (I2C, SPI, UART).',
    tags: ['embedded', 'iot', 'c++', 'esp32', 'hardware']
  },
  {
    id: 'skill-biomed-devices',
    name: 'Biomedical Instrumentation & Sensors',
    category: 'Bioengineering',
    discipline: 'engineering',
    difficulty: 'advanced',
    prerequisites: ['skill-embedded-iot'],
    description: 'Biosensors, ECG/EEG telemetry circuits, medical device FDA standards, signal filtering.',
    tags: ['biomedical', 'sensors', 'instrumentation', 'hardware']
  },
  {
    id: 'skill-robotics-control',
    name: 'Robotics Kinematics & Control Systems',
    category: 'Robotics',
    discipline: 'engineering',
    difficulty: 'advanced',
    prerequisites: ['skill-python', 'skill-stats'],
    description: 'PID control, ROS2 (Robot Operating System), inverse kinematics, trajectory planning.',
    tags: ['robotics', 'ros2', 'control-systems', 'automation']
  },

  // --- Agriculture & AgTech Skills ---
  {
    id: 'skill-soil-sensors',
    name: 'Soil Sensor & Telemetry Integration',
    category: 'AgTech',
    discipline: 'agriculture',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Deploying moisture, NPK sensors, LoRaWAN IoT telemetry, and data logging.',
    tags: ['iot', 'sensors', 'agtech', 'hardware', 'lora']
  },
  {
    id: 'skill-crop-analytics',
    name: 'GIS & Crop Yield Predictive Modeling',
    category: 'AgTech Analytics',
    discipline: 'agriculture',
    difficulty: 'advanced',
    prerequisites: ['skill-stats'],
    description: 'Satellite imagery NDVI analysis, QGIS mapping, and climate-yield forecasting models.',
    tags: ['gis', 'ndvi', 'satellite', 'yield-prediction']
  },
  {
    id: 'skill-smart-irrigation',
    name: 'Automated Irrigation & Climate Control',
    category: 'AgTech Engineering',
    discipline: 'agriculture',
    difficulty: 'intermediate',
    prerequisites: ['skill-soil-sensors'],
    description: 'Micro-controller irrigation valves, evapotranspiration algorithms, greenhouse climate loops.',
    tags: ['irrigation', 'automation', 'agtech', 'greenhouse']
  },
  {
    id: 'skill-hydroponics',
    name: 'Hydroponics & Controlled Environment Agriculture',
    category: 'Precision Farming',
    discipline: 'agriculture',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Nutrient film technique (NFT), aeroponics, EC/pH monitoring, vertical farming LED spectrums.',
    tags: ['hydroponics', 'vertical-farming', 'urban-agri', 'nutrients']
  },
  {
    id: 'skill-food-qa',
    name: 'Food Safety & Quality Assurance (HACCP)',
    category: 'Food Technology',
    discipline: 'agriculture',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'HACCP protocols, microbial safety assays, ISO 22000 compliance, nutritional spectrometry.',
    tags: ['food-safety', 'haccp', 'quality-control', 'iso']
  },

  // --- Paramedical & Health Sciences Skills ---
  {
    id: 'skill-ehr-systems',
    name: 'EHR & Health Protocols (HL7/FHIR)',
    category: 'Health Informatics',
    discipline: 'paramedical',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'HL7 v2/v3, FHIR JSON APIs, HIPAA patient privacy standards, medical terminology (SNOMED-CT/ICD-10).',
    tags: ['fhir', 'hl7', 'ehr', 'healthtech', 'hipaa']
  },
  {
    id: 'skill-clinical-stats',
    name: 'Biostatistics & Clinical Trial Analytics',
    category: 'Clinical Research',
    discipline: 'paramedical',
    difficulty: 'intermediate',
    prerequisites: ['skill-stats'],
    description: 'Survival analysis, Kaplan-Meier curves, odds ratios, randomized controlled trial statistical plans.',
    tags: ['biostatistics', 'clinical-trials', 'epidemiology', 'research']
  },
  {
    id: 'skill-biomed-diagnostics',
    name: 'Biomedical Diagnostic Systems & Quality',
    category: 'Laboratory Science',
    discipline: 'paramedical',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Clinical biochemistry auto-analyzers, ELISA, hematology diagnostics, internal quality control (IQC).',
    tags: ['laboratory', 'diagnostics', 'pathology', 'biochemistry']
  },
  {
    id: 'skill-telemed-protocols',
    name: 'Telemedicine & Remote Patient Monitoring (RPM)',
    category: 'Digital Health',
    discipline: 'paramedical',
    difficulty: 'beginner',
    prerequisites: ['skill-ehr-systems'],
    description: 'Remote vital monitoring protocols, virtual consultation triage, telehealth compliance.',
    tags: ['telehealth', 'telemedicine', 'rpm', 'patient-care']
  },
  {
    id: 'skill-physio-biomech',
    name: 'Biomechanics & Movement Analysis',
    category: 'Physiotherapy',
    discipline: 'paramedical',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Gait kinematics, electromyography (EMG) analysis, musculoskeletal rehabilitation protocols.',
    tags: ['biomechanics', 'physiotherapy', 'rehab', 'kinematics']
  },

  // --- Commerce, Finance & Management Skills ---
  {
    id: 'skill-fin-modeling',
    name: 'Financial Modeling & Valuation',
    category: 'Corporate Finance',
    discipline: 'commerce',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'DCF valuation, 3-statement modeling, sensitivity tables, LBO analysis, scenario forecasting.',
    tags: ['excel', 'valuation', 'dcf', 'investment', 'm&a']
  },
  {
    id: 'skill-algo-trading',
    name: 'Quantitative Risk & Algorithmic Trading',
    category: 'FinTech',
    discipline: 'commerce',
    difficulty: 'advanced',
    prerequisites: ['skill-python', 'skill-stats'],
    description: 'VaR calculation, portfolio optimization, backtesting alpha strategies, FIX protocol execution.',
    tags: ['fintech', 'quant', 'trading', 'risk-management', 'python']
  },
  {
    id: 'skill-fin-compliance',
    name: 'Anti-Money Laundering & RegTech Compliance',
    category: 'Regulatory Tech',
    discipline: 'commerce',
    difficulty: 'intermediate',
    prerequisites: ['skill-sql'],
    description: 'KYC workflows, transaction anomaly detection, Basel III compliance, sanctions screening.',
    tags: ['aml', 'regtech', 'compliance', 'fraud', 'risk']
  },
  {
    id: 'skill-supply-chain-erp',
    name: 'Supply Chain Analytics & SAP/ERP',
    category: 'Operations',
    discipline: 'commerce',
    difficulty: 'intermediate',
    prerequisites: ['skill-sql'],
    description: 'Inventory optimization, demand forecasting, logistics routing, SAP S/4HANA workflows.',
    tags: ['supply-chain', 'erp', 'sap', 'logistics', 'operations']
  },
  {
    id: 'skill-growth-analytics',
    name: 'Digital Growth & Customer Analytics',
    category: 'Marketing Analytics',
    discipline: 'commerce',
    difficulty: 'intermediate',
    prerequisites: ['skill-data-viz'],
    description: 'Funnel attribution, churn prediction, CAC/LTV modeling, Google Analytics 4, A/B testing.',
    tags: ['growth', 'marketing-analytics', 'a/b-testing', 'churn']
  },

  // --- Design, Media & Creative Arts Skills ---
  {
    id: 'skill-ux-research',
    name: 'User Research & Journey Mapping',
    category: 'Design Strategy',
    discipline: 'design_media',
    difficulty: 'beginner',
    prerequisites: [],
    description: 'Qualitative user interviews, usability testing, persona definition, empathy mapping.',
    tags: ['ux', 'research', 'personas', 'figma', 'wireframing']
  },
  {
    id: 'skill-design-systems',
    name: 'Figma & Design Systems Engineering',
    category: 'UI/UX Design',
    discipline: 'design_media',
    difficulty: 'intermediate',
    prerequisites: ['skill-ux-research'],
    description: 'Component architecture, responsive tokens, auto-layout, atomic design systems, WCAG accessibility.',
    tags: ['figma', 'design-systems', 'ui', 'prototyping', 'accessibility']
  },
  {
    id: 'skill-3d-modeling',
    name: '3D Spatial Modeling & Shader VFX',
    category: 'Interactive Media',
    discipline: 'design_media',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'Blender 3D modeling, UV unwrapping, PBR material creation, real-time shader pipelines.',
    tags: ['blender', '3d', 'vfx', 'shaders', 'cgi']
  },
  {
    id: 'skill-game-engines',
    name: 'Unity & Unreal Interactive Systems',
    category: 'Game Development',
    discipline: 'design_media',
    difficulty: 'advanced',
    prerequisites: ['skill-python'],
    description: 'C# scripting in Unity, Unreal Blueprints, physics engines, spatial audio, VR/AR interactions.',
    tags: ['unity', 'unreal', 'game-dev', 'c#', 'ar-vr']
  },

  // --- Pure & Applied Sciences Skills (Arts & Science) ---
  {
    id: 'skill-comp-bio',
    name: 'Computational Genomics & Bioinformatics',
    category: 'Life Sciences',
    discipline: 'arts_science',
    difficulty: 'advanced',
    prerequisites: ['skill-python', 'skill-stats'],
    description: 'Next-Generation Sequencing (NGS) analysis, BLAST alignment, Biopython, variant calling.',
    tags: ['bioinformatics', 'genomics', 'ngs', 'biopython']
  },
  {
    id: 'skill-econometrics',
    name: 'Econometric Modeling & Quantitative Policy',
    category: 'Economics',
    discipline: 'arts_science',
    difficulty: 'advanced',
    prerequisites: ['skill-stats', 'skill-python'],
    description: 'Time series forecasting (ARIMA/GARCH), instrumental variables, panel data regression.',
    tags: ['econometrics', 'economics', 'policy', 'stata', 'r']
  },

  // --- Law, Governance & Policy Skills ---
  {
    id: 'skill-cyber-law',
    name: 'Cyber Law, GDPR & Data Privacy Governance',
    category: 'Tech Law',
    discipline: 'law_governance',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'GDPR, CCPA, Digital Personal Data Protection (DPDP), data transfer agreements, breach response.',
    tags: ['privacy', 'gdpr', 'law', 'compliance', 'cyber-law']
  },
  {
    id: 'skill-ai-ethics',
    name: 'AI Ethics, Governance & Model Auditing',
    category: 'AI Policy',
    discipline: 'law_governance',
    difficulty: 'intermediate',
    prerequisites: [],
    description: 'EU AI Act compliance, algorithmic bias mitigation, model explainability, AI risk frameworks.',
    tags: ['ai-ethics', 'governance', 'eu-ai-act', 'bias-auditing']
  },

  // --- Hospitality & Tourism Management Skills ---
  {
    id: 'skill-hospitality-pms',
    name: 'Hospitality PMS & Revenue Yield Management',
    category: 'Hospitality Management',
    discipline: 'hospitality',
    difficulty: 'intermediate',
    prerequisites: ['skill-data-viz'],
    description: 'Property Management Systems (Opera), dynamic pricing algorithms, RevPAR optimization, channel managers.',
    tags: ['pms', 'revenue-management', 'hospitality', 'hotels', 'revpar']
  },
  {
    id: 'skill-event-logistics',
    name: 'Event Operations & Luxury Guest Experience',
    category: 'Event Management',
    discipline: 'hospitality',
    difficulty: 'beginner',
    prerequisites: [],
    description: 'VIP guest workflows, event vendor contract negotiation, crowd management protocols, luxury CX.',
    tags: ['events', 'luxury-management', 'logistics', 'cx']
  }
];

export const SEED_CAREERS: Career[] = [
  // 1. Data Analyst & BI Specialist (Engineering / Data)
  {
    id: 'career-data-analyst',
    title: 'Data Analyst & BI Specialist',
    discipline: 'engineering',
    category: 'Data & Analytics',
    description: 'Extract, clean, analyze, and translate complex datasets into strategic business decisions and executive dashboards.',
    growthRate: '+28% (Very High)',
    medianSalary: '$85,000 / ₹10-18 LPA',
    scope: 'High demand across Tech, Finance, Retail, Healthcare, and Governance.',
    subCareers: ['Business Intelligence Analyst', 'Product Analytics Specialist', 'Operations Data Analyst'],
    roles: [
      {
        id: 'role-da-junior',
        title: 'Junior Data Analyst',
        responsibilities: ['Write SQL queries for reporting', 'Build PowerBI/Tableau dashboards', 'Clean dirty raw data'],
        requiredSkillIds: ['skill-sql', 'skill-data-viz'],
        readinessCriteria: 'Proficiency in SQL joins & basic dashboarding.',
        entrySalary: '$65,000'
      },
      {
        id: 'role-da-senior',
        title: 'Senior BI Engineer',
        responsibilities: ['Architect semantic layers', 'Perform statistical root cause analysis', 'Lead data storytelling'],
        requiredSkillIds: ['skill-sql', 'skill-stats', 'skill-data-viz', 'skill-python'],
        readinessCriteria: 'Complex window queries, statistical modeling, production BI governance.',
        entrySalary: '$110,000'
      }
    ],
    requiredSkillIds: ['skill-sql', 'skill-stats', 'skill-data-viz', 'skill-python'],
    prerequisites: ['Basic mathematics & analytical aptitude'],
    relatedCareerIds: ['career-ai-engineer', 'career-fintech-quant', 'career-agtech-analyst'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'mandatory', targetProficiency: 75 },
        { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'recommended', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Intro to Database Systems', 'Business Statistics'],
      recommendedProjects: ['E-commerce Cohort Retention Analysis', 'Real-time Sales BI Executive Dashboard'],
      emergingSkills: ['dbt Analytics Engineering', 'DuckDB in-browser query engines'],
      readinessThreshold: 75
    },
    iconName: 'Database'
  },

  // 2. AI & Machine Learning Engineer (Engineering)
  {
    id: 'career-ai-engineer',
    title: 'AI & Machine Learning Engineer',
    discipline: 'engineering',
    category: 'Artificial Intelligence',
    description: 'Design, develop, and operationalize predictive machine learning pipelines and modern GenAI solutions.',
    growthRate: '+36% (Extremely High)',
    medianSalary: '$125,000 / ₹16-32 LPA',
    scope: 'Transforming every vertical with automated intelligence, agentic workflows, and deep predictive models.',
    subCareers: ['MLOps Specialist', 'Computer Vision Engineer', 'NLP & LLM Applications Engineer'],
    roles: [
      {
        id: 'role-mle',
        title: 'Machine Learning Engineer',
        responsibilities: ['Train and evaluate ML models', 'Build feature stores and training pipelines', 'Deploy REST inference APIs'],
        requiredSkillIds: ['skill-python', 'skill-stats', 'skill-ml', 'skill-cloud'],
        readinessCriteria: 'Solid theoretical math foundation + scikit-learn/PyTorch deployment.',
        entrySalary: '$95,000'
      }
    ],
    requiredSkillIds: ['skill-python', 'skill-stats', 'skill-ml', 'skill-sql', 'skill-cloud'],
    prerequisites: ['Linear Algebra & Multivariable Calculus', 'Core programming'],
    relatedCareerIds: ['career-data-analyst', 'career-fintech-quant'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-ml', skillName: 'Machine Learning Algorithms', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Data Structures & Algorithms', 'Statistical Machine Learning'],
      recommendedProjects: ['End-to-End Customer Churn Predictor with Docker & FastApi', 'Agentic RAG Search Engine'],
      emergingSkills: ['Small Language Model Fine-Tuning', 'Vector Databases & Embeddings'],
      readinessThreshold: 80
    },
    iconName: 'Cpu'
  },

  // 3. Cloud DevOps & Site Reliability Engineer (Engineering)
  {
    id: 'career-cloud-devops',
    title: 'Cloud DevOps & Site Reliability Engineer',
    discipline: 'engineering',
    category: 'Cloud Infrastructure',
    description: 'Architect resilient multi-region cloud infrastructures, Kubernetes clusters, and automated CI/CD deployment pipelines.',
    growthRate: '+30% (High)',
    medianSalary: '$118,000 / ₹14-26 LPA',
    scope: 'Critical infrastructure backbone across enterprise software, SaaS, banking, and government portals.',
    subCareers: ['Site Reliability Engineer (SRE)', 'Platform Engineer', 'Cloud Infrastructure Architect'],
    roles: [
      {
        id: 'role-devops-eng',
        title: 'Cloud DevOps Engineer',
        responsibilities: ['Maintain Kubernetes workloads', 'Automate Terraform infra', 'Monitor SLA/SLO latency telemetry'],
        requiredSkillIds: ['skill-cloud', 'skill-python', 'skill-cybersec'],
        readinessCriteria: 'Hands-on Dockerization, CI/CD pipeline writing, and cloud IAM security.',
        entrySalary: '$88,000'
      }
    ],
    requiredSkillIds: ['skill-cloud', 'skill-python', 'skill-cybersec', 'skill-sql'],
    prerequisites: ['Operating Systems & Networking fundamentals'],
    relatedCareerIds: ['career-cybersec-architect', 'career-ai-engineer'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'mandatory', targetProficiency: 75 },
        { skillId: 'skill-cybersec', skillName: 'Network & Cloud Security', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Computer Networks', 'Distributed Systems'],
      recommendedProjects: ['Automated Blue-Green Multi-Cluster Kubernetes Deployment', 'Zero-Downtime Terraform Infra'],
      emergingSkills: ['eBPF Observability', 'GitOps with ArgoCD'],
      readinessThreshold: 78
    },
    iconName: 'Cloud'
  },

  // 4. Cybersecurity Architect & SOC Analyst (Engineering)
  {
    id: 'career-cybersec-architect',
    title: 'Cybersecurity Architect & SOC Analyst',
    discipline: 'engineering',
    category: 'Information Security',
    description: 'Defend organizational perimeters, orchestrate threat intelligence, and design zero-trust cyber defense systems.',
    growthRate: '+33% (Critical Need)',
    medianSalary: '$120,000 / ₹15-30 LPA',
    scope: 'Essential security governance for financial networks, defense agencies, and enterprise IT.',
    subCareers: ['Threat Intelligence Analyst', 'Penetration Tester', 'Cloud Security Engineer'],
    roles: [
      {
        id: 'role-soc-analyst',
        title: 'SOC Security Analyst',
        responsibilities: ['Triage SIEM incident alerts', 'Analyze malware packets', 'Execute incident containment'],
        requiredSkillIds: ['skill-cybersec', 'skill-python'],
        readinessCriteria: 'Threat log analysis and network anomaly mitigation.',
        entrySalary: '$82,000'
      }
    ],
    requiredSkillIds: ['skill-cybersec', 'skill-cloud', 'skill-python', 'skill-sql'],
    prerequisites: ['TCP/IP protocols', 'Linux system administration'],
    relatedCareerIds: ['career-cloud-devops', 'career-cyber-law-analyst'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-cybersec', skillName: 'Network & Cloud Security', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', importance: 'recommended', targetProficiency: 75 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Network Security & Cryptography', 'Ethical Hacking'],
      recommendedProjects: ['Automated SIEM Threat Hunter in Python', 'Zero-Trust Bastion Architecture'],
      emergingSkills: ['Quantum-Safe Cryptography', 'AI Adversarial Defense'],
      readinessThreshold: 80
    },
    iconName: 'Shield'
  },

  // 5. Biomedical Devices & Robotics Engineer (Engineering / Medical)
  {
    id: 'career-biomedical-engineer',
    title: 'Biomedical Devices & Robotics Engineer',
    discipline: 'engineering',
    category: 'Medical Technology',
    description: 'Engineer smart prosthetics, robotic surgical actuators, and vital-sign wearable hardware calibrated to clinical standards.',
    growthRate: '+26% (High)',
    medianSalary: '$98,000 / ₹12-24 LPA',
    scope: 'Medical device manufacturers, surgical robotics labs, and diagnostic instrumentation companies.',
    subCareers: ['Prosthetics Automation Engineer', 'Medical Hardware Validation Specialist'],
    roles: [
      {
        id: 'role-biomed-dev',
        title: 'Medical Devices Instrumentation Engineer',
        responsibilities: ['Design sensor circuits for patient monitoring', 'Execute IEC 60601 electrical safety validation'],
        requiredSkillIds: ['skill-biomed-devices', 'skill-embedded-iot'],
        readinessCriteria: 'Sensor circuit design and analog biosignal filtration.',
        entrySalary: '$78,000'
      }
    ],
    requiredSkillIds: ['skill-biomed-devices', 'skill-embedded-iot', 'skill-robotics-control', 'skill-stats'],
    prerequisites: ['Electronic circuits', 'Human anatomy basics'],
    relatedCareerIds: ['career-health-informatics', 'career-diagnostic-lab-spec'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-biomed-devices', skillName: 'Biomedical Instrumentation & Sensors', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-embedded-iot', skillName: 'Embedded Systems & Microcontrollers', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-robotics-control', skillName: 'Robotics Kinematics & Control Systems', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Biosignals & Systems', 'Microcontroller Interfacing'],
      recommendedProjects: ['Wearable LoRa ECG Biosignal Monitor', 'Myoelectric Bionic Hand Controller'],
      emergingSkills: ['Brain-Computer Interfaces (BCI)', 'Implantable Telemetry Sensors'],
      readinessThreshold: 78
    },
    iconName: 'HeartPulse'
  },

  // 6. Precision AgTech & IoT Specialist (Agriculture)
  {
    id: 'career-agtech-analyst',
    title: 'Precision AgTech & IoT Specialist',
    discipline: 'agriculture',
    category: 'Smart Agriculture',
    description: 'Bridge agronomy with IoT sensors, drone multispectral GIS imagery, and automated irrigation systems for climate-resilient farming.',
    growthRate: '+24% (Rapid Growth)',
    medianSalary: '$82,000 / ₹8-16 LPA',
    scope: 'Modern agricultural enterprises, food-tech corporations, drone survey firms, and sustainable farming initiatives.',
    subCareers: ['Drone Agronomy Surveyor', 'Smart Farm Automation Engineer', 'Agronomic Data Strategist'],
    roles: [
      {
        id: 'role-agtech-field',
        title: 'Smart Farm Telemetry Engineer',
        responsibilities: ['Install and calibrate soil moisture IoT nodes', 'Maintain LoRa mesh networks', 'Monitor irrigation telemetry'],
        requiredSkillIds: ['skill-soil-sensors', 'skill-smart-irrigation'],
        readinessCriteria: 'Hands-on sensor calibration and automated control system testing.',
        entrySalary: '$60,000'
      },
      {
        id: 'role-agtech-gis',
        title: 'GIS Crop Analytics Specialist',
        responsibilities: ['Process satellite NDVI indices', 'Build yield estimation heatmaps', 'Advise on fertilizer optimization'],
        requiredSkillIds: ['skill-crop-analytics', 'skill-data-viz', 'skill-stats'],
        readinessCriteria: 'GIS spatial analysis + predictive yield modeling.',
        entrySalary: '$90,000'
      }
    ],
    requiredSkillIds: ['skill-soil-sensors', 'skill-crop-analytics', 'skill-smart-irrigation', 'skill-stats', 'skill-data-viz'],
    prerequisites: ['Agricultural science fundamentals', 'Basic electronics/computing'],
    relatedCareerIds: ['career-data-analyst', 'career-sustainable-agronomy'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-soil-sensors', skillName: 'Soil Sensor & Telemetry Integration', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-smart-irrigation', skillName: 'Automated Irrigation & Climate Control', importance: 'mandatory', targetProficiency: 75 },
        { skillId: 'skill-crop-analytics', skillName: 'GIS & Crop Yield Predictive Modeling', importance: 'mandatory', targetProficiency: 70 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'recommended', targetProficiency: 60 }
      ],
      prerequisiteCourses: ['Soil Physics & Crop Physiology', 'Introduction to Geoinformatics'],
      recommendedProjects: ['Automated LoRa Soil Moisture Telemetry Station', 'NDVI Crop Health Index Dashboard'],
      emergingSkills: ['Hyperspectral Drone Imaging', 'Autonomous Tractor Telematics'],
      readinessThreshold: 72
    },
    iconName: 'Sprout'
  },

  // 7. Sustainable Agronomy & Climate Resilience Specialist (Agriculture)
  {
    id: 'career-sustainable-agronomy',
    title: 'Sustainable Agronomy & Climate Specialist',
    discipline: 'agriculture',
    category: 'Environmental Agronomy',
    description: 'Design regenerative cropping systems, carbon sequestration audits, and hydroponic controlled environment farming.',
    growthRate: '+22% (Steady)',
    medianSalary: '$78,000 / ₹8-15 LPA',
    scope: 'Agri-consultancies, greenhouse operators, organic certification agencies, and carbon credit brokers.',
    subCareers: ['Hydroponics Facility Manager', 'Soil Carbon Verification Auditor'],
    roles: [
      {
        id: 'role-hydro-mgr',
        title: 'Controlled Environment Farm Manager',
        responsibilities: ['Formulate closed-loop nutrient solutions', 'Calibrate LED spectrums for leafy greens', 'Manage biosecurity'],
        requiredSkillIds: ['skill-hydroponics', 'skill-smart-irrigation'],
        readinessCriteria: 'Nutrient formulation calculation and automated climate loop maintenance.',
        entrySalary: '$58,000'
      }
    ],
    requiredSkillIds: ['skill-hydroponics', 'skill-soil-sensors', 'skill-smart-irrigation', 'skill-crop-analytics'],
    prerequisites: ['Plant biochemistry', 'Soil fertility'],
    relatedCareerIds: ['career-agtech-analyst', 'career-food-tech-qa'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-hydroponics', skillName: 'Hydroponics & Controlled Environment Agriculture', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-smart-irrigation', skillName: 'Automated Irrigation & Climate Control', importance: 'mandatory', targetProficiency: 75 },
        { skillId: 'skill-soil-sensors', skillName: 'Soil Sensor & Telemetry Integration', importance: 'recommended', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Plant Nutrition & Metabolism', 'Greenhouse Systems Engineering'],
      recommendedProjects: ['Automated Recirculating Deep Water Culture Hydroponic System'],
      emergingSkills: ['Aeroponic Fogging Systems', 'Biochar Soil Amendment Verification'],
      readinessThreshold: 72
    },
    iconName: 'Sprout'
  },

  // 8. Food Technology & Quality Assurance Engineer (Agriculture / Biotech)
  {
    id: 'career-food-tech-qa',
    title: 'Food Processing & Quality Assurance Engineer',
    discipline: 'agriculture',
    category: 'Food Technology',
    description: 'Ensure food safety standards, microbial quality controls, aseptic packaging lines, and novel nutritional formulation.',
    growthRate: '+20% (Consistent)',
    medianSalary: '$75,000 / ₹7-14 LPA',
    scope: 'FMCG food processing giants, dairy networks, beverage breweries, and food safety regulatory bodies.',
    subCareers: ['HACCP Food Safety Auditor', 'Sensory & Formulation Scientist'],
    roles: [
      {
        id: 'role-food-qa-officer',
        title: 'Quality Assurance Technologist',
        responsibilities: ['Conduct microbial pathogen swabs', 'Verify shelf-life acceleration curves', 'Audit supplier compliance'],
        requiredSkillIds: ['skill-food-qa', 'skill-stats'],
        readinessCriteria: 'ISO 22000 standard adherence and microbial lab assay execution.',
        entrySalary: '$55,000'
      }
    ],
    requiredSkillIds: ['skill-food-qa', 'skill-stats', 'skill-data-viz'],
    prerequisites: ['Food microbiology', 'Organic chemistry'],
    relatedCareerIds: ['career-diagnostic-lab-spec', 'career-sustainable-agronomy'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-food-qa', skillName: 'Food Safety & Quality Assurance (HACCP)', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'mandatory', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Food Microbiology', 'Thermal Processing & Preservation'],
      recommendedProjects: ['Plant-wide HACCP Risk Map & Critical Control Point Dashboard'],
      emergingSkills: ['High-Pressure Processing (HPP)', 'Blockchain Food Traceability'],
      readinessThreshold: 75
    },
    iconName: 'Award'
  },

  // 9. Clinical Health Informatics Specialist (Paramedical)
  {
    id: 'career-health-informatics',
    title: 'Clinical Health Informatics Specialist',
    discipline: 'paramedical',
    category: 'Healthcare Technology',
    description: 'Unify clinical hospital operations with digital health standards (HL7/FHIR), electronic health records, and clinical outcome analytics.',
    growthRate: '+31% (High Demand)',
    medianSalary: '$92,000 / ₹11-22 LPA',
    scope: 'Hospitals, medical diagnostic networks, health-tech startups, and pharma clinical research organizations.',
    subCareers: ['Medical EHR Systems Specialist', 'Clinical Trial Data Manager', 'Telemedicine Systems Engineer'],
    roles: [
      {
        id: 'role-health-ehrs',
        title: 'Hospital Systems Informatics Officer',
        responsibilities: ['Maintain EHR data flow and compliance', 'Ensure FHIR protocol integrations', 'Audit patient data security'],
        requiredSkillIds: ['skill-ehr-systems', 'skill-sql'],
        readinessCriteria: 'HL7/FHIR standard compliance and hospital database query handling.',
        entrySalary: '$72,000'
      }
    ],
    requiredSkillIds: ['skill-ehr-systems', 'skill-clinical-stats', 'skill-sql', 'skill-biomed-diagnostics', 'skill-stats'],
    prerequisites: ['Paramedical / Anatomy fundamentals', 'Information systems basics'],
    relatedCareerIds: ['career-data-analyst', 'career-telemedicine-coord'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-ehr-systems', skillName: 'EHR & Health Protocols (HL7/FHIR)', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-clinical-stats', skillName: 'Biostatistics & Clinical Trial Analytics', importance: 'mandatory', targetProficiency: 70 },
        { skillId: 'skill-biomed-diagnostics', skillName: 'Biomedical Diagnostic Systems & Quality', importance: 'recommended', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Medical Terminology & Ethics', 'Healthcare Data Standards'],
      recommendedProjects: ['FHIR REST API Medical Record Interoperability Bridge', 'Clinical Trial Patient Retention Dashboard'],
      emergingSkills: ['AI-assisted Radiology Triage', 'Genomic Data Pipelines'],
      readinessThreshold: 75
    },
    iconName: 'HeartPulse'
  },

  // 10. Biomedical Diagnostic Lab Specialist (Paramedical)
  {
    id: 'career-diagnostic-lab-spec',
    title: 'Biomedical Diagnostic Lab Specialist',
    discipline: 'paramedical',
    category: 'Diagnostic Medicine',
    description: 'Manage automated clinical pathology laboratories, molecular diagnostic assays, quality control indices, and biomarker interpretation.',
    growthRate: '+25% (High)',
    medianSalary: '$72,000 / ₹7-15 LPA',
    scope: 'Diagnostic lab chains, tertiary hospital pathology departments, blood banks, and clinical CROs.',
    subCareers: ['Molecular Diagnostics Technologist', 'Clinical Biochemistry Lead'],
    roles: [
      {
        id: 'role-mlt-lead',
        title: 'Senior Medical Laboratory Technologist',
        responsibilities: ['Run ELISA & PCR panels', 'Calibrate automated hematology analyzers', 'Sign off on IQC deviations'],
        requiredSkillIds: ['skill-biomed-diagnostics', 'skill-clinical-stats'],
        readinessCriteria: 'Precision pipetting, auto-analyzer troubleshooting, and Westgard rule application.',
        entrySalary: '$52,000'
      }
    ],
    requiredSkillIds: ['skill-biomed-diagnostics', 'skill-clinical-stats', 'skill-ehr-systems'],
    prerequisites: ['Pathology fundamentals', 'Medical biochemistry'],
    relatedCareerIds: ['career-health-informatics', 'career-food-tech-qa'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-biomed-diagnostics', skillName: 'Biomedical Diagnostic Systems & Quality', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-clinical-stats', skillName: 'Biostatistics & Clinical Trial Analytics', importance: 'mandatory', targetProficiency: 70 },
        { skillId: 'skill-ehr-systems', skillName: 'EHR & Health Protocols (HL7/FHIR)', importance: 'recommended', targetProficiency: 60 }
      ],
      prerequisiteCourses: ['Clinical Hematology & Immuno-hematology', 'Molecular Pathology'],
      recommendedProjects: ['Laboratory Westgard QC Deviation & Calibration Tracker'],
      emergingSkills: ['Next-Gen Molecular Diagnostics (ddPCR)', 'Digital Pathology Image Analysis'],
      readinessThreshold: 76
    },
    iconName: 'HeartPulse'
  },

  // 11. Telemedicine & Remote Care Coordinator (Paramedical / Nursing)
  {
    id: 'career-telemedicine-coord',
    title: 'Telemedicine & Remote Care Coordinator',
    discipline: 'paramedical',
    category: 'Digital Health',
    description: 'Orchestrate virtual clinical triage, remote patient physiological telemetry, and chronic disease digital monitoring protocols.',
    growthRate: '+34% (Explosive)',
    medianSalary: '$75,000 / ₹8-16 LPA',
    scope: 'Telehealth providers, health insurance digital programs, home-health agencies, and chronic care networks.',
    subCareers: ['Virtual Health Triage Nurse', 'RPM Device Implementation Specialist'],
    roles: [
      {
        id: 'role-telemed-officer',
        title: 'Remote Patient Monitoring Coordinator',
        responsibilities: ['Monitor daily cardiac & diabetic telemetry feeds', 'Trigger urgent clinician interventions', 'Educate patients on RPM wearables'],
        requiredSkillIds: ['skill-telemed-protocols', 'skill-ehr-systems'],
        readinessCriteria: 'Virtual triage protocols, telemetry alert escalations, and empathetic patient engagement.',
        entrySalary: '$58,000'
      }
    ],
    requiredSkillIds: ['skill-telemed-protocols', 'skill-ehr-systems', 'skill-clinical-stats'],
    prerequisites: ['Clinical nursing / paramedical care', 'Communication'],
    relatedCareerIds: ['career-health-informatics', 'career-physiotherapy-rehab'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-telemed-protocols', skillName: 'Telemedicine & Remote Patient Monitoring (RPM)', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-ehr-systems', skillName: 'EHR & Health Protocols (HL7/FHIR)', importance: 'mandatory', targetProficiency: 75 }
      ],
      prerequisiteCourses: ['Virtual Clinical Care Standards', 'Patient Health Engagement'],
      recommendedProjects: ['Chronic Heart Failure Remote Telemetry Escalation Workflow'],
      emergingSkills: ['AI-driven Symptom Checkers', 'Continuous Glucose Monitor (CGM) Streaming'],
      readinessThreshold: 72
    },
    iconName: 'HeartPulse'
  },

  // 12. Physiotherapy & Movement Rehabilitation Specialist (Paramedical)
  {
    id: 'career-physiotherapy-rehab',
    title: 'Physiotherapy & Movement Rehabilitation Specialist',
    discipline: 'paramedical',
    category: 'Rehabilitation Medicine',
    description: 'Evaluate musculoskeletal kinematics, craft evidence-based physical rehabilitation protocols, and utilize EMG motion feedback.',
    growthRate: '+24% (Strong)',
    medianSalary: '$80,000 / ₹8-18 LPA',
    scope: 'Sports injury clinics, orthopedic hospitals, neuro-rehabilitation centers, and professional sports franchises.',
    subCareers: ['Sports Kinematics Specialist', 'Neuro-Rehabilitation Clinician'],
    roles: [
      {
        id: 'role-physio-lead',
        title: 'Clinical Movement Specialist',
        responsibilities: ['Conduct dynamic gait analysis', 'Design progressive resistance exercise regimens', 'Apply therapeutic modalities'],
        requiredSkillIds: ['skill-physio-biomech', 'skill-clinical-stats'],
        readinessCriteria: 'Biomechanical gait assessment and individualized rehabilitation protocol design.',
        entrySalary: '$60,000'
      }
    ],
    requiredSkillIds: ['skill-physio-biomech', 'skill-clinical-stats', 'skill-telemed-protocols'],
    prerequisites: ['Anatomy & Physiology', 'Exercise Physiology'],
    relatedCareerIds: ['career-telemedicine-coord', 'career-biomedical-engineer'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-physio-biomech', skillName: 'Biomechanics & Movement Analysis', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-clinical-stats', skillName: 'Biostatistics & Clinical Trial Analytics', importance: 'recommended', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Kinesiology & Biomechanics', 'Orthopedic Physical Therapy'],
      recommendedProjects: ['Post-ACL Reconstruction Return-to-Sport Motion Assessment Protocol'],
      emergingSkills: ['Wearable IMU Gait Sensors', 'Virtual Reality Motor Rehabilitation'],
      readinessThreshold: 75
    },
    iconName: 'HeartPulse'
  },

  // 13. FinTech Quantitative Analyst (Commerce)
  {
    id: 'career-fintech-quant',
    title: 'FinTech Quantitative Analyst',
    discipline: 'commerce',
    category: 'Finance & Technology',
    description: 'Apply computational modeling, financial valuation, and regulatory automation to capital markets and digital payment systems.',
    growthRate: '+25% (High)',
    medianSalary: '$115,000 / ₹14-28 LPA',
    scope: 'Investment banking, hedge funds, neobanks, payment gateways, and risk rating institutions.',
    subCareers: ['Credit Risk Modeler', 'Financial Valuation Analyst', 'RegTech & AML Officer'],
    roles: [
      {
        id: 'role-fin-quant',
        title: 'Quantitative Risk Analyst',
        responsibilities: ['Build credit scoring algorithms', 'Perform Monte Carlo simulations', 'Automate regulatory risk reports'],
        requiredSkillIds: ['skill-fin-modeling', 'skill-stats', 'skill-python', 'skill-algo-trading'],
        readinessCriteria: 'Strong DCF + stochastic modeling + algorithmic backtesting.',
        entrySalary: '$90,000'
      }
    ],
    requiredSkillIds: ['skill-fin-modeling', 'skill-algo-trading', 'skill-fin-compliance', 'skill-stats', 'skill-python', 'skill-sql'],
    prerequisites: ['Corporate finance principles', 'Probability and statistics'],
    relatedCareerIds: ['career-data-analyst', 'career-supply-chain-analyst'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-fin-modeling', skillName: 'Financial Modeling & Valuation', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-algo-trading', skillName: 'Quantitative Risk & Algorithmic Trading', importance: 'mandatory', targetProficiency: 75 },
        { skillId: 'skill-fin-compliance', skillName: 'Anti-Money Laundering & RegTech Compliance', importance: 'recommended', targetProficiency: 70 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'mandatory', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Financial Accounting & Statements', 'Derivatives & Risk Analytics'],
      recommendedProjects: ['Dynamic DCF Valuation Engine with Sensitivity Tables', 'Algorithmic Pairs Trading Backtester'],
      emergingSkills: ['High-Frequency Order Routing', 'DeFi Liquidity Pool Modeling'],
      readinessThreshold: 78
    },
    iconName: 'TrendingUp'
  },

  // 14. Global Supply Chain & Operations Analyst (Commerce)
  {
    id: 'career-supply-chain-analyst',
    title: 'Global Supply Chain & Operations Analyst',
    discipline: 'commerce',
    category: 'Operations & Logistics',
    description: 'Optimize global procurement, warehouse throughput, freight cost models, and enterprise SAP inventory allocations.',
    growthRate: '+23% (High)',
    medianSalary: '$84,000 / ₹9-18 LPA',
    scope: 'E-commerce giants, international shipping lines, manufacturing plants, and retail supply chains.',
    subCareers: ['Demand Planning Specialist', 'Logistics Freight Optimization Lead'],
    roles: [
      {
        id: 'role-supply-analyst',
        title: 'Supply Chain Optimization Engineer',
        responsibilities: ['Build safety-stock replenishment models', 'Map supplier lead-time variances', 'Configure SAP inventory modules'],
        requiredSkillIds: ['skill-supply-chain-erp', 'skill-sql', 'skill-data-viz'],
        readinessCriteria: 'Economic Order Quantity (EOQ) modeling, safety stock calculation, and ERP query fluency.',
        entrySalary: '$64,000'
      }
    ],
    requiredSkillIds: ['skill-supply-chain-erp', 'skill-sql', 'skill-data-viz', 'skill-stats'],
    prerequisites: ['Operations management', 'Spreadsheet modeling'],
    relatedCareerIds: ['career-data-analyst', 'career-fintech-quant'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-supply-chain-erp', skillName: 'Supply Chain Analytics & SAP/ERP', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', importance: 'mandatory', targetProficiency: 75 }
      ],
      prerequisiteCourses: ['Operations Research', 'Global Logistics Management'],
      recommendedProjects: ['Multi-Echelon Inventory Optimization Model in Python & SQL'],
      emergingSkills: ['Digital Twin Supply Chains', 'Real-time GPS Freight Telematics'],
      readinessThreshold: 75
    },
    iconName: 'TrendingUp'
  },

  // 15. Digital Growth & Marketing Strategist (Commerce / Media)
  {
    id: 'career-digital-growth-strat',
    title: 'Digital Growth & Customer Analytics Strategist',
    discipline: 'commerce',
    category: 'Digital Strategy',
    description: 'Drive customer acquisition and lifecycle retention through multi-channel attribution modeling, A/B experiments, and user cohort science.',
    growthRate: '+26% (Rapid)',
    medianSalary: '$88,000 / ₹10-20 LPA',
    scope: 'Direct-to-consumer (D2C) brands, SaaS tech startups, digital agencies, and media powerhouses.',
    subCareers: ['Performance Marketing Lead', 'Retention & Lifecycle Manager'],
    roles: [
      {
        id: 'role-growth-lead',
        title: 'Growth Marketing Analyst',
        responsibilities: ['Run statistical A/B test experiments', 'Model customer lifetime value (LTV)', 'Optimize conversion funnels'],
        requiredSkillIds: ['skill-growth-analytics', 'skill-data-viz', 'skill-stats'],
        readinessCriteria: 'Hypothesis testing, multi-touch attribution, and retention cohort analysis.',
        entrySalary: '$66,000'
      }
    ],
    requiredSkillIds: ['skill-growth-analytics', 'skill-data-viz', 'skill-stats', 'skill-sql'],
    prerequisites: ['Principles of marketing', 'Basic data visualization'],
    relatedCareerIds: ['career-data-analyst', 'career-uiux-systems-designer'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-growth-analytics', skillName: 'Digital Growth & Customer Analytics', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Digital Marketing & SEO', 'Applied Marketing Analytics'],
      recommendedProjects: ['SaaS Acquisition Funnel & Churn Predictor Dashboard'],
      emergingSkills: ['AI-driven Copy Personalization', 'First-Party Data Clean Rooms'],
      readinessThreshold: 76
    },
    iconName: 'TrendingUp'
  },

  // 16. Product & UI/UX Systems Designer (Design & Media)
  {
    id: 'career-uiux-systems-designer',
    title: 'Product & UI/UX Systems Designer',
    discipline: 'design_media',
    category: 'Product Design',
    description: 'Architect scalable multi-platform design systems, conduct empirical user research, and craft high-fidelity interactive digital experiences.',
    growthRate: '+22% (High)',
    medianSalary: '$95,000 / ₹11-22 LPA',
    scope: 'Tech companies, digital product studios, consumer software apps, and fin-tech platforms.',
    subCareers: ['Design Systems Engineer', 'UX Researcher', 'Interaction Designer'],
    roles: [
      {
        id: 'role-uiux-senior',
        title: 'Senior Product Designer',
        responsibilities: ['Create multi-brand design tokens in Figma', 'Execute usability test interviews', 'Ensure WCAG AAA accessibility'],
        requiredSkillIds: ['skill-design-systems', 'skill-ux-research'],
        readinessCriteria: 'Figma component variables, interactive prototyping, and empirical user testing.',
        entrySalary: '$75,000'
      }
    ],
    requiredSkillIds: ['skill-design-systems', 'skill-ux-research', 'skill-data-viz'],
    prerequisites: ['Visual design principles', 'Human-computer interaction basics'],
    relatedCareerIds: ['career-digital-growth-strat', 'career-game-vfx-developer'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-design-systems', skillName: 'Figma & Design Systems Engineering', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-ux-research', skillName: 'User Research & Journey Mapping', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', importance: 'recommended', targetProficiency: 60 }
      ],
      prerequisiteCourses: ['Human-Centered Design', 'Information Architecture'],
      recommendedProjects: ['End-to-End Enterprise SaaS Design System & Interactive Prototype in Figma'],
      emergingSkills: ['Spatial UI for Apple Vision Pro', 'Design-to-Code Token Automation'],
      readinessThreshold: 78
    },
    iconName: 'Layout'
  },

  // 17. Game Systems & Interactive VFX Developer (Design & Media)
  {
    id: 'career-game-vfx-developer',
    title: 'Game Systems & Interactive VFX Developer',
    discipline: 'design_media',
    category: 'Interactive Media',
    description: 'Develop physics-driven game mechanics, real-time procedural shaders, and 3D spatial environments in Unity and Unreal Engine.',
    growthRate: '+27% (Surging)',
    medianSalary: '$96,000 / ₹12-25 LPA',
    scope: 'AAA gaming studios, indie game publishers, virtual production film sets, and architectural VR visualization.',
    subCareers: ['Technical Artist', 'Gameplay Systems Programmer', '3D Environment Artist'],
    roles: [
      {
        id: 'role-gameplay-prog',
        title: 'Gameplay Programmer',
        responsibilities: ['Code character movement physics in Unity C#', 'Author Niagara particle systems in Unreal', 'Optimize draw calls'],
        requiredSkillIds: ['skill-game-engines', 'skill-3d-modeling'],
        readinessCriteria: 'Real-time 60fps frame budgeting, C# gameplay architecture, and PBR shader compilation.',
        entrySalary: '$72,000'
      }
    ],
    requiredSkillIds: ['skill-game-engines', 'skill-3d-modeling', 'skill-python'],
    prerequisites: ['Object-oriented programming', '3D math (vectors & quaternions)'],
    relatedCareerIds: ['career-uiux-systems-designer', 'career-ai-engineer'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-game-engines', skillName: 'Unity & Unreal Interactive Systems', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-3d-modeling', skillName: '3D Spatial Modeling & Shader VFX', importance: 'mandatory', targetProficiency: 80 }
      ],
      prerequisiteCourses: ['Computer Graphics & Shaders', 'Game Mechanics Design'],
      recommendedProjects: ['Action-Adventure Game Vertical Slice with Custom HLSL Shaders'],
      emergingSkills: ['Procedural World Generation with Houdini', 'Real-time Raytracing Optimization'],
      readinessThreshold: 78
    },
    iconName: 'Layout'
  },

  // 18. Computational Biologist & Genomics Scientist (Arts & Science)
  {
    id: 'career-computational-biologist',
    title: 'Computational Biologist & Genomics Scientist',
    discipline: 'arts_science',
    category: 'Bioinformatics',
    description: 'Analyze high-throughput DNA sequencing, model macromolecular protein structures, and accelerate drug target discovery using code.',
    growthRate: '+29% (High Growth)',
    medianSalary: '$105,000 / ₹14-26 LPA',
    scope: 'Biotech pharma firms, genome research institutes, precision oncology centers, and agricultural genetics labs.',
    subCareers: ['NGS Pipeline Developer', 'Structural Bioinformatician'],
    roles: [
      {
        id: 'role-comp-bio',
        title: 'Bioinformatics Pipeline Scientist',
        responsibilities: ['Run RNA-seq differential expression', 'Variant call whole-exome sequencing files', 'Model protein-ligand docks'],
        requiredSkillIds: ['skill-comp-bio', 'skill-python', 'skill-stats'],
        readinessCriteria: 'NGS pipeline orchestration, Biopython scripting, and statistical significance testing.',
        entrySalary: '$82,000'
      }
    ],
    requiredSkillIds: ['skill-comp-bio', 'skill-python', 'skill-stats', 'skill-sql'],
    prerequisites: ['Genetics & Molecular Biology', 'Python programming'],
    relatedCareerIds: ['career-ai-engineer', 'career-health-informatics'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-comp-bio', skillName: 'Computational Genomics & Bioinformatics', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'mandatory', targetProficiency: 80 }
      ],
      prerequisiteCourses: ['Molecular Genetics', 'Algorithmic Bioinformatics'],
      recommendedProjects: ['Automated Cancer RNA-Seq Differential Expression & Pathway Enrichment Pipeline'],
      emergingSkills: ['Single-Cell Spatial Transcriptomics', 'AlphaFold Protein Folding Pipelines'],
      readinessThreshold: 80
    },
    iconName: 'Atom'
  },

  // 19. Applied Quantitative Economist & Policy Analyst (Arts & Science)
  {
    id: 'career-applied-math-quant',
    title: 'Applied Quantitative Economist & Policy Analyst',
    discipline: 'arts_science',
    category: 'Quantitative Science',
    description: 'Model macro-economic trends, evaluate public policy impact through econometrics, and forecast monetary market liquidity.',
    growthRate: '+21% (Steady)',
    medianSalary: '$94,000 / ₹11-22 LPA',
    scope: 'Central banks, international development agencies (World Bank/IMF), economic think tanks, and policy consulting.',
    subCareers: ['Macroeconomic Forecaster', 'Public Policy Impact Evaluator'],
    roles: [
      {
        id: 'role-quant-econ',
        title: 'Quantitative Policy Researcher',
        responsibilities: ['Estimate econometric panel regressions', 'Conduct difference-in-differences impact assessments', 'Publish policy briefs'],
        requiredSkillIds: ['skill-econometrics', 'skill-stats', 'skill-python'],
        readinessCriteria: 'Stochastic economic modeling, instrumental variables, and econometric causal inference.',
        entrySalary: '$72,000'
      }
    ],
    requiredSkillIds: ['skill-econometrics', 'skill-stats', 'skill-python', 'skill-data-viz'],
    prerequisites: ['Micro & Macro economics', 'Calculus and linear algebra'],
    relatedCareerIds: ['career-fintech-quant', 'career-data-analyst'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-econometrics', skillName: 'Econometric Modeling & Quantitative Policy', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-python', skillName: 'Python Programming', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Intermediate Econometrics', 'Mathematical Economics'],
      recommendedProjects: ['Empirical Policy Impact Analysis of Renewable Energy Subsidies on Industrial Output'],
      emergingSkills: ['Machine Learning in Causal Inference', 'High-Frequency Inflation Nowcasting'],
      readinessThreshold: 78
    },
    iconName: 'Atom'
  },

  // 20. Cyber Law & AI Governance Analyst (Law & Governance)
  {
    id: 'career-cyber-law-analyst',
    title: 'Cyber Law & AI Governance Analyst',
    discipline: 'law_governance',
    category: 'Technology Law',
    description: 'Ensure corporate compliance with international data privacy statutes (GDPR/DPDP), audit AI models for algorithmic bias, and draft tech IP agreements.',
    growthRate: '+32% (Surging Need)',
    medianSalary: '$110,000 / ₹14-28 LPA',
    scope: 'Tech corporations, international law firms, privacy consulting practices, and regulatory oversight authorities.',
    subCareers: ['Data Protection Officer (DPO)', 'AI Ethics & Model Compliance Auditor'],
    roles: [
      {
        id: 'role-privacy-counsel',
        title: 'Data Privacy Compliance Specialist',
        responsibilities: ['Draft Data Protection Impact Assessments (DPIAs)', 'Audit AI model training datasets for copyright and bias', 'Manage cross-border data transfer compliance'],
        requiredSkillIds: ['skill-cyber-law', 'skill-ai-ethics'],
        readinessCriteria: 'GDPR/DPDP statutory fluency and algorithmic audit framework application.',
        entrySalary: '$85,000'
      }
    ],
    requiredSkillIds: ['skill-cyber-law', 'skill-ai-ethics', 'skill-cybersec'],
    prerequisites: ['Jurisprudence / legal fundamentals', 'Basic understanding of computer systems'],
    relatedCareerIds: ['career-cybersec-architect', 'career-fintech-quant'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-cyber-law', skillName: 'Cyber Law, GDPR & Data Privacy Governance', importance: 'mandatory', targetProficiency: 90 },
        { skillId: 'skill-ai-ethics', skillName: 'AI Ethics, Governance & Model Auditing', importance: 'mandatory', targetProficiency: 85 },
        { skillId: 'skill-cybersec', skillName: 'Network & Cloud Security', importance: 'recommended', targetProficiency: 65 }
      ],
      prerequisiteCourses: ['Cyber Law & Internet Governance', 'Intellectual Property in Digital Age'],
      recommendedProjects: ['Comprehensive GDPR & AI Act Compliance Framework for Generative AI SaaS'],
      emergingSkills: ['Synthetic Data Privacy Licensing', 'Autonomous Agent Liability Audits'],
      readinessThreshold: 78
    },
    iconName: 'Shield'
  },

  // 21. Smart Hospitality & Revenue Manager (Hospitality)
  {
    id: 'career-smart-hospitality-mgr',
    title: 'Smart Hospitality & Revenue Strategy Manager',
    discipline: 'hospitality',
    category: 'Hospitality Management',
    description: 'Leverage property management systems (PMS), dynamic room pricing algorithms, and luxury guest experience analytics to maximize hotel RevPAR.',
    growthRate: '+23% (Strong Rebound)',
    medianSalary: '$82,000 / ₹9-18 LPA',
    scope: 'Luxury hotel chains, integrated mega-resorts, airline hospitality networks, and boutique travel conglomerates.',
    subCareers: ['Hotel Revenue Director', 'Luxury Guest Experience Architect'],
    roles: [
      {
        id: 'role-rev-mgr',
        title: 'Hospitality Revenue Strategist',
        responsibilities: ['Set dynamic room pricing matrices', 'Audit OTA channel commission costs', 'Monitor guest satisfaction Net Promoter Scores'],
        requiredSkillIds: ['skill-hospitality-pms', 'skill-data-viz'],
        readinessCriteria: 'RevPAR optimization, Opera PMS reporting, and yield management forecasting.',
        entrySalary: '$62,000'
      }
    ],
    requiredSkillIds: ['skill-hospitality-pms', 'skill-event-logistics', 'skill-data-viz', 'skill-stats'],
    prerequisites: ['Hospitality operations fundamentals', 'Commercial arithmetic'],
    relatedCareerIds: ['career-digital-growth-strat', 'career-supply-chain-analyst'],
    benchmark: {
      requiredSkills: [
        { skillId: 'skill-hospitality-pms', skillName: 'Hospitality PMS & Revenue Yield Management', importance: 'mandatory', targetProficiency: 88 },
        { skillId: 'skill-event-logistics', skillName: 'Event Operations & Luxury Guest Experience', importance: 'mandatory', targetProficiency: 80 },
        { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', importance: 'recommended', targetProficiency: 70 }
      ],
      prerequisiteCourses: ['Hotel Revenue Management', 'Luxury Brand Customer Experience'],
      recommendedProjects: ['Dynamic Hotel RevPAR Yield Pricing Model with Channel Distribution Matrix'],
      emergingSkills: ['Keyless IoT Mobile Guest Journeys', 'AI Concierge Conversational Agents'],
      readinessThreshold: 75
    },
    iconName: 'Award'
  }
];

export const SEED_ASSESSMENTS: Assessment[] = [
  // 1. SQL Diagnostic
  {
    id: 'assess-sql-diagnostic',
    skillId: 'skill-sql',
    title: 'SQL & Relational Querying Diagnostic',
    type: 'diagnostic',
    discipline: 'engineering',
    passingScore: 70,
    questions: [
      {
        id: 'q-sql-1',
        question: 'Which SQL clause is used to filter aggregated group results rather than individual table rows?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctIndex: 1,
        explanation: 'The HAVING clause filters aggregated rows produced by GROUP BY, while WHERE filters raw rows before grouping.',
        skillTopic: 'Aggregations & Filtering',
        difficulty: 'easy'
      },
      {
        id: 'q-sql-2',
        question: 'What is the key difference between ROW_NUMBER() and DENSE_RANK() window functions when handling ties?',
        options: [
          'ROW_NUMBER assigns distinct consecutive integers, while DENSE_RANK assigns the same rank to ties without skipping subsequent ranks.',
          'DENSE_RANK skips rank numbers after a tie (e.g. 1, 2, 2, 4).',
          'ROW_NUMBER requires a PARTITION BY clause while DENSE_RANK does not.',
          'There is no difference between them.'
        ],
        correctIndex: 0,
        explanation: 'ROW_NUMBER always produces unique consecutive numbers (1, 2, 3), whereas DENSE_RANK gives tied rows identical ranks and proceeds to the next integer without gaps (1, 2, 2, 3).',
        skillTopic: 'Window Functions',
        difficulty: 'medium'
      },
      {
        id: 'q-sql-3',
        question: 'Which index type is best suited for accelerating equality and range queries on high-cardinality primary keys in B-Tree relational storage?',
        options: ['Clustered B-Tree Index', 'Bitmap Index', 'Hash Index (for range queries)', 'Full-text Inverted Index'],
        correctIndex: 0,
        explanation: 'Clustered B-Tree indexes physically organize table data in sorted order, providing optimal O(log N) lookups for both equality and range scans.',
        skillTopic: 'Index Optimization',
        difficulty: 'hard'
      }
    ]
  },

  // 2. Python Diagnostic
  {
    id: 'assess-python-diagnostic',
    skillId: 'skill-python',
    title: 'Python Core & Data Manipulation Diagnostic',
    type: 'diagnostic',
    discipline: 'engineering',
    passingScore: 70,
    questions: [
      {
        id: 'q-py-1',
        question: 'In Pandas, what is the most memory-efficient method to filter and compute a column across a 10M row DataFrame without Python-level iteration overhead?',
        options: ['df.iterrows()', 'df.apply(lambda x: ...)', 'Vectorized NumPy/Pandas boolean indexing and operations', 'for loop with df.iloc[]'],
        correctIndex: 2,
        explanation: 'Vectorized operations leverage underlying C/SIMD instructions, running orders of magnitude faster than Python-level loops or apply.',
        skillTopic: 'Vectorization & Performance',
        difficulty: 'medium'
      },
      {
        id: 'q-py-2',
        question: 'What happens when a mutable default parameter (like a list `def fn(x=[])`) is used in a Python function?',
        options: [
          'A new list is created each time the function is called.',
          'The default list is created once at function definition time and shared across all calls that omit the parameter.',
          'Python raises a SyntaxError at compile time.',
          'The list is automatically cleared after function return.'
        ],
        correctIndex: 1,
        explanation: 'Default argument values in Python are evaluated once when the function definition is executed, mutating across subsequent invocations.',
        skillTopic: 'Object Reference & Functions',
        difficulty: 'medium'
      }
    ]
  },

  // 3. AgTech Telemetry Diagnostic
  {
    id: 'assess-agtech-telemetry',
    skillId: 'skill-soil-sensors',
    title: 'AgTech IoT Sensors & Telemetry Diagnostic',
    type: 'topic',
    discipline: 'agriculture',
    passingScore: 70,
    questions: [
      {
        id: 'q-ag-1',
        question: 'Why is LoRaWAN preferred over standard Wi-Fi or Bluetooth for field-wide agricultural soil moisture telemetry?',
        options: [
          'LoRaWAN provides ultra-high 4K video bandwidth.',
          'LoRaWAN offers long-range (10-15 km) low-power transmission on sub-GHz frequencies, enabling multi-year battery operation in remote farms.',
          'LoRaWAN requires high-voltage AC power.',
          'Wi-Fi has longer physical penetration range through thick soil.'
        ],
        correctIndex: 1,
        explanation: 'LoRaWAN provides long-range sub-GHz RF modulation with minimal power draw, ideal for sending periodic sensor readings across large acreage.',
        skillTopic: 'Wireless Telemetry',
        difficulty: 'easy'
      },
      {
        id: 'q-ag-2',
        question: 'When computing Normalized Difference Vegetation Index (NDVI) from multispectral satellite imagery, which optical bands are combined?',
        options: [
          '(NIR - Red) / (NIR + Red)',
          '(Blue - Green) / (Blue + Green)',
          '(Red - Thermal) / (Red + Thermal)',
          '(Green - NIR) / (Green + NIR)'
        ],
        correctIndex: 0,
        explanation: 'Healthy chlorophyll strongly absorbs Red light and reflects Near-Infrared (NIR), making (NIR - Red) / (NIR + Red) the standardized index for vegetation density.',
        skillTopic: 'GIS Crop Analytics',
        difficulty: 'medium'
      }
    ]
  },

  // 4. Health Informatics FHIR Diagnostic
  {
    id: 'assess-health-fhir',
    skillId: 'skill-ehr-systems',
    title: 'HL7 & FHIR Health Informatics Diagnostic',
    type: 'topic',
    discipline: 'paramedical',
    passingScore: 70,
    questions: [
      {
        id: 'q-hl-1',
        question: 'In modern FHIR (Fast Healthcare Interoperability Resources) architectures, how are clinical entities modeled and exchanged?',
        options: [
          'As discrete RESTful JSON/XML Resources (e.g. Patient, Observation, MedicationRequest) with standard REST verbs (GET, POST, PUT).',
          'As unparsed flat-file pipe-delimited text files over serial cables.',
          'As raw binary memory dumps directly into relational databases.',
          'As proprietary encrypted binary blobs without standard schemas.'
        ],
        correctIndex: 0,
        explanation: 'FHIR defines modular data building blocks (Resources) that can be queried and modified over standard HTTP/REST endpoints with standardized JSON schemas.',
        skillTopic: 'FHIR Standards',
        difficulty: 'medium'
      },
      {
        id: 'q-hl-2',
        question: 'Which medical terminology ontology is primarily used to encode clinical findings, procedures, and anatomical concepts for global EHR interoperability?',
        options: ['SNOMED-CT', 'ASCII-7', 'ISO-9001', 'RGB-Alpha'],
        correctIndex: 0,
        explanation: 'SNOMED-CT is the comprehensive multilingual clinical healthcare terminology used worldwide for structured EHR capture.',
        skillTopic: 'Clinical Ontologies',
        difficulty: 'easy'
      }
    ]
  },

  // 5. FinTech Valuation & Risk Diagnostic
  {
    id: 'assess-fin-quant',
    skillId: 'skill-fin-modeling',
    title: 'Financial Valuation & Risk Analytics Diagnostic',
    type: 'topic',
    discipline: 'commerce',
    passingScore: 70,
    questions: [
      {
        id: 'q-fin-1',
        question: 'In a Discounted Cash Flow (DCF) model, what rate is universally used to discount Unlevered Free Cash Flows to Enterprise Value?',
        options: [
          'Weighted Average Cost of Capital (WACC)',
          'Risk-Free Treasury Yield alone',
          'Cost of Equity without debt weighting',
          'Nominal Inflation Rate'
        ],
        correctIndex: 0,
        explanation: 'Unlevered cash flows belong to both debt and equity providers, requiring the Weighted Average Cost of Capital (WACC) as the blended discount rate.',
        skillTopic: 'DCF Valuation',
        difficulty: 'medium'
      },
      {
        id: 'q-fin-2',
        question: 'What does a 1-day 99% Value at Risk (VaR) of $1,000,000 mean for an investment portfolio?',
        options: [
          'There is a 1% probability that the portfolio will lose more than $1,000,000 over a single trading day under normal market conditions.',
          'The portfolio will definitely lose $1,000,000 tomorrow.',
          'The portfolio maximum profit is capped at $1,000,000.',
          'There is a 99% chance the portfolio will lose $1,000,000.'
        ],
        correctIndex: 0,
        explanation: 'A 99% 1-day VaR measures the maximum expected loss at a 99% confidence level, meaning losses will exceed $1M only on 1 out of 100 trading days.',
        skillTopic: 'Quantitative Risk',
        difficulty: 'medium'
      }
    ]
  },

  // 6. UI/UX Design Systems Diagnostic
  {
    id: 'assess-uiux-systems',
    skillId: 'skill-design-systems',
    title: 'Figma & Design Systems Diagnostic',
    type: 'topic',
    discipline: 'design_media',
    passingScore: 70,
    questions: [
      {
        id: 'q-ux-1',
        question: 'Under WCAG 2.1 Level AA standards, what is the minimum required color contrast ratio for normal body text against its background?',
        options: ['4.5:1', '3:1', '7:1', '2:1'],
        correctIndex: 0,
        explanation: 'WCAG 2.1 Level AA mandates a minimum contrast ratio of 4.5:1 for standard body text (under 18pt regular) and 3:1 for large text.',
        skillTopic: 'Accessibility & WCAG',
        difficulty: 'easy'
      },
      {
        id: 'q-ux-2',
        question: 'What is the primary architectural purpose of utilizing Semantic Design Tokens (e.g. `color.surface.primary`) over Hardcoded Hex Values?',
        options: [
          'Tokens abstract values into logical roles, enabling automated theme swapping (light/dark mode) and cohesive brand synchronization across web and mobile platforms.',
          'Tokens decrease the file size of the React app bundle by 50%.',
          'Tokens prevent users from inspecting the CSS in developer tools.',
          'Tokens force all buttons to remain blue regardless of context.'
        ],
        correctIndex: 0,
        explanation: 'Design tokens provide a platform-agnostic semantic layer connecting design tools (Figma) and codebases (CSS/Tailwind/Swift/Compose).',
        skillTopic: 'Design Tokens',
        difficulty: 'medium'
      }
    ]
  },

  // 7. Cyber Law & GDPR Diagnostic
  {
    id: 'assess-cyber-law',
    skillId: 'skill-cyber-law',
    title: 'Cyber Law, GDPR & Privacy Diagnostic',
    type: 'topic',
    discipline: 'law_governance',
    passingScore: 70,
    questions: [
      {
        id: 'q-law-1',
        question: 'Under GDPR Article 33, within how many hours must an enterprise notify the relevant supervisory authority after becoming aware of a personal data breach posing risk to individuals?',
        options: ['72 hours', '24 hours', '30 days', '7 days'],
        correctIndex: 0,
        explanation: 'GDPR mandates that data controllers notify the supervisory authority without undue delay and, where feasible, not later than 72 hours after becoming aware of the breach.',
        skillTopic: 'Data Breach Governance',
        difficulty: 'easy'
      }
    ]
  },

  // 8. Hospitality Revenue Management Diagnostic
  {
    id: 'assess-hospitality-pms',
    skillId: 'skill-hospitality-pms',
    title: 'Hospitality PMS & RevPAR Optimization Diagnostic',
    type: 'topic',
    discipline: 'hospitality',
    passingScore: 70,
    questions: [
      {
        id: 'q-hosp-1',
        question: 'How is RevPAR (Revenue Per Available Room) calculated in hotel revenue yield management?',
        options: [
          'Occupancy Rate (%) × Average Daily Rate (ADR) OR Total Room Revenue / Total Available Rooms',
          'Total F&B Revenue ÷ Total Number of Guests',
          'Total Booking Inquiries ÷ Marketing Spend',
          'Average Daily Rate ÷ Total Hotel Staff Count'
        ],
        correctIndex: 0,
        explanation: 'RevPAR equals Occupancy % multiplied by ADR, serving as the benchmark metric balancing price and room volume.',
        skillTopic: 'RevPAR Yield Math',
        difficulty: 'easy'
      }
    ]
  }
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: 'res-sql-mastery',
    title: 'Production SQL for Analytics & Data Engineering',
    type: 'interactive',
    provider: 'CareerBridge Interactive Lab',
    url: 'https://sandbox.careerbridge.io/sql-lab',
    durationMinutes: 45,
    difficulty: 'intermediate',
    rating: 4.9,
    whyRecommended: 'Hands-on browser query sandbox with instant feedback on aggregations and window partitions.',
    embedType: 'sandbox'
  },
  {
    id: 'res-py-pandas',
    title: 'Fast-Track Python & Pandas Vectorization',
    type: 'video',
    provider: 'DataCamp & CareerBridge Pro',
    url: 'https://learn.careerbridge.io/python-vectorization',
    durationMinutes: 35,
    difficulty: 'intermediate',
    rating: 4.8,
    whyRecommended: 'Essential for accelerating DataFrame ETL pipelines by 50x without Python loop overhead.'
  },
  {
    id: 'res-agtech-iot',
    title: 'Deploying LoRaWAN Soil Telemetry Nodes in the Field',
    type: 'article',
    provider: 'AgTech Engineering Quarterly',
    url: 'https://research.careerbridge.io/agtech-lora-blueprint',
    durationMinutes: 25,
    difficulty: 'intermediate',
    rating: 4.7,
    whyRecommended: 'Complete wiring schematic, sensor calibration curve formulas, and MQTT gateway code.'
  },
  {
    id: 'res-fhir-starter',
    title: 'Building Modern Health Applications with FHIR REST APIs',
    type: 'repo',
    provider: 'HealthIT Open Source & CareerBridge',
    url: 'https://github.com/careerbridge-templates/fhir-health-bridge',
    durationMinutes: 60,
    difficulty: 'advanced',
    rating: 4.9,
    whyRecommended: 'Production-ready TypeScript FHIR client with SMART-on-FHIR OAuth2 authentication.'
  },
  {
    id: 'res-dcf-valuation',
    title: 'Wall Street 3-Statement & DCF Financial Modeling Masterclass',
    type: 'video',
    provider: 'CFI & FinTech Academy',
    url: 'https://learn.careerbridge.io/fin-modeling-dcf',
    durationMinutes: 50,
    difficulty: 'intermediate',
    rating: 4.9,
    whyRecommended: 'Step-by-step Excel and Python valuation template with sensitivity tables.'
  },
  {
    id: 'res-figma-tokens',
    title: 'Architecting Scalable Design Tokens in Figma & Tailwind',
    type: 'interactive',
    provider: 'Design Systems Collective',
    url: 'https://sandbox.careerbridge.io/design-tokens-sandbox',
    durationMinutes: 40,
    difficulty: 'intermediate',
    rating: 4.8,
    whyRecommended: 'Live playground to configure semantic color, typography, and spacing variables.'
  },
  {
    id: 'res-comp-bio-ngs',
    title: 'RNA-Seq Differential Expression with Biopython & DESeq2',
    type: 'repo',
    provider: 'Genomics Data Science Hub',
    url: 'https://github.com/careerbridge-templates/comp-bio-rnaseq',
    durationMinutes: 55,
    difficulty: 'advanced',
    rating: 4.9,
    whyRecommended: 'End-to-end bioinformatics pipeline from FASTQ alignment to volcano plot visualization.'
  },
  {
    id: 'res-cyber-gdpr',
    title: 'AI Governance & GDPR DPIA Risk Assessment Playbook',
    type: 'article',
    provider: 'International Tech Law Review',
    url: 'https://learn.careerbridge.io/ai-governance-playbook',
    durationMinutes: 30,
    difficulty: 'intermediate',
    rating: 4.8,
    whyRecommended: 'Essential legal risk checklist for launching AI and LLM products in the EU & US.'
  },
  {
    id: 'res-hotel-revpar',
    title: 'Hotel RevPAR Yield Algorithms & Dynamic Pricing Blueprint',
    type: 'article',
    provider: 'Hospitality Analytics Institute',
    url: 'https://learn.careerbridge.io/hotel-revpar-blueprint',
    durationMinutes: 30,
    difficulty: 'intermediate',
    rating: 4.7,
    whyRecommended: 'Learn mathematical optimization for seasonal occupancy curves and OTA channel allocation.'
  }
];

export const SEED_USERS: UserAccount[] = [
  // 7 Male Students
  {
    id: 'user-selva',
    profileId: 'student-selva',
    name: 'Selva',
    email: 'selva@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Artificial Intelligence & Data Science',
    studentId: 'STU-ENG-2024-001',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: 'user-sabari',
    profileId: 'student-sabari',
    name: 'Sabari',
    email: 'sabari@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    studentId: 'STU-ENG-2024-002',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-12T08:00:00.000Z'
  },
  {
    id: 'user-ram',
    profileId: 'student-ram',
    name: 'Ram',
    email: 'ram@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    studentId: 'STU-ENG-2024-003',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 'user-gokul',
    profileId: 'student-gokul',
    name: 'Gokul',
    email: 'gokul@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Electrical & Electronics Engineering (EEE)',
    studentId: 'STU-ENG-2024-004',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-18T08:00:00.000Z'
  },
  {
    id: 'user-sanjay',
    profileId: 'student-sanjay',
    name: 'Sanjay',
    email: 'sanjay@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Mechanical & Robotics Engineering',
    studentId: 'STU-ENG-2024-005',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-20T08:00:00.000Z'
  },
  {
    id: 'user-kishore',
    profileId: 'student-kishore',
    name: 'Kishore',
    email: 'kishore@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Electronics & Communication (ECE)',
    studentId: 'STU-ENG-2024-006',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-22T08:00:00.000Z'
  },
  {
    id: 'user-karthick',
    profileId: 'student-karthick',
    name: 'Karthick',
    email: 'karthick@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    studentId: 'STU-ENG-2024-007',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-25T08:00:00.000Z'
  },

  // 5 Female Students
  {
    id: 'user-kalai',
    profileId: 'student-kalai',
    name: 'Kalai',
    email: 'kalai@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    studentId: 'STU-ENG-2024-008',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-28T08:00:00.000Z'
  },
  {
    id: 'user-deepa',
    profileId: 'student-deepa',
    name: 'Deepa',
    email: 'deepa@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Artificial Intelligence & Data Science',
    studentId: 'STU-ENG-2024-009',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-01T08:00:00.000Z'
  },
  {
    id: 'user-seetha',
    profileId: 'student-seetha',
    name: 'Seetha',
    email: 'seetha@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Electronics & Communication (ECE)',
    studentId: 'STU-ENG-2024-010',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-03T08:00:00.000Z'
  },
  {
    id: 'user-sathya',
    profileId: 'student-sathya',
    name: 'Sathya',
    email: 'sathya@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    studentId: 'STU-ENG-2024-011',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-05T08:00:00.000Z'
  },
  {
    id: 'user-saranya',
    profileId: 'student-saranya',
    name: 'Saranya',
    email: 'saranya@college.edu',
    password: 'password123',
    role: 'student',
    discipline: 'engineering',
    stream: 'Civil & Environmental Engineering',
    studentId: 'STU-ENG-2024-012',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-08T08:00:00.000Z'
  },

  // Faculty Mentor & Admin
  {
    id: 'user-mentor-1',
    profileId: '',
    name: 'Dr. Balu Prasath',
    email: 'balu.prasath@university.edu',
    password: 'password123',
    role: 'mentor',
    discipline: 'engineering',
    stream: 'Department of Computing & Engineering Sciences',
    studentId: 'FAC-ENG-904',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2023-09-01T08:00:00.000Z'
  },
  {
    id: 'user-admin-1',
    profileId: '',
    name: 'Ms. Anjali Govindh',
    email: 'admin@careerbridge.io',
    password: 'password123',
    role: 'admin',
    discipline: 'engineering',
    stream: 'Dean of Academic Intelligence & Curriculum Alignment',
    studentId: 'ADM-EXEC-001',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2023-08-01T08:00:00.000Z'
  }
];

export const SEED_PROFILES: StudentProfile[] = [
  // 1. Selva - AI & Data Science
  {
    id: 'student-selva',
    userId: 'user-selva',
    fullName: 'Selva',
    email: 'selva@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Artificial Intelligence & Data Science',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    yearOfStudy: 3,
    cgpa: 8.85,
    targetCareerId: 'career-ai-engineer',
    interests: ['Deep Learning', 'Generative AI', 'Computer Vision', 'PyTorch Automation'],
    skills: [
      { skillId: 'skill-python', skillName: 'Python Programming', level: 85, verified: true, lastAssessedAt: '2024-03-01' },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 80, verified: true, lastAssessedAt: '2024-03-05' },
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 70, verified: true },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 65, verified: false }
    ],
    projects: [
      {
        id: 'proj-selva-1',
        title: 'Transformer-Based Code Comprehension Engine',
        description: 'Fine-tuned open-source small language models with LoRA and evaluated inference speed with vLLM.',
        technologies: ['Python', 'PyTorch', 'HuggingFace', 'Transformers'],
        verified: true,
        link: 'https://github.com/selva/code-llm'
      }
    ],
    certifications: ['DeepLearning.AI Machine Learning Specialization', 'NVIDIA Deep Learning Institute Certificate'],
    assessmentScores: {
      'assess-python-diagnostic': 88,
      'assess-sql-diagnostic': 70
    },
    uncertaintyScore: 10,
    readinessScore: {
      overallPercentage: 78,
      technicalScore: 82,
      projectScore: 75,
      problemSolvingScore: 80,
      softSkillScore: 75,
      status: 'competent'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 14,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate',
    completedMilestoneIds: ['ms-ai-1', 'ms-ai-2'],
    completedResourceIds: ['res-py-1', 'res-math-1']
  },

  // 2. Sabari - Computer Science & Engineering (Cloud DevOps)
  {
    id: 'student-sabari',
    userId: 'user-sabari',
    fullName: 'Sabari',
    email: 'sabari@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    degree: 'B.Tech in Computer Science & Engineering',
    yearOfStudy: 4,
    cgpa: 8.4,
    targetCareerId: 'career-cloud-devops',
    interests: ['Cloud Architecture', 'Kubernetes Clusters', 'CI/CD Pipelines', 'Site Reliability'],
    skills: [
      { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', level: 85, verified: true, lastAssessedAt: '2024-03-02' },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 78, verified: true },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 72, verified: true },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 60, verified: false }
    ],
    projects: [
      {
        id: 'proj-sabari-1',
        title: 'GitOps Continuous Deployment on Multi-Node K8s',
        description: 'Built zero-downtime Canary release pipelines using ArgoCD, Prometheus alerts, and Terraform.',
        technologies: ['Kubernetes', 'Docker', 'Terraform', 'ArgoCD'],
        verified: true,
        link: 'https://github.com/sabari/gitops-infra'
      }
    ],
    certifications: ['AWS Certified Solutions Architect - Associate', 'Certified Kubernetes Administrator (CKA)'],
    assessmentScores: {
      'assess-cloud-k8s': 86,
      'assess-python-diagnostic': 80
    },
    uncertaintyScore: 12,
    readinessScore: {
      overallPercentage: 82,
      technicalScore: 85,
      projectScore: 84,
      problemSolvingScore: 80,
      softSkillScore: 78,
      status: 'career_ready'
    },
    learningPace: 'steady',
    weeklyHoursCommitted: 12,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate',
    completedMilestoneIds: ['ms-cloud-1'],
    completedResourceIds: ['res-cloud-1']
  },

  // 3. Ram - Cybersecurity & Network Systems
  {
    id: 'student-ram',
    userId: 'user-ram',
    fullName: 'Ram',
    email: 'ram@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    degree: 'B.Tech in Cybersecurity & Network Systems',
    yearOfStudy: 3,
    cgpa: 8.1,
    targetCareerId: 'career-cybersec-architect',
    interests: ['Ethical Hacking', 'SOC Monitoring', 'Incident Triage', 'Cloud Security'],
    skills: [
      { skillId: 'skill-python', skillName: 'Python Programming', level: 70, verified: true },
      { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', level: 60, verified: false },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 55, verified: false },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 50, verified: false }
    ],
    projects: [
      {
        id: 'proj-ram-1',
        title: 'SOC Telemetry Pipeline & Suspicious Packet Analyzer',
        description: 'Developed real-time network traffic sniffer with automated Suricata IDS signature matches.',
        technologies: ['Python', 'Suricata', 'Wireshark', 'Elasticsearch'],
        verified: true
      }
    ],
    certifications: ['CompTIA Security+', 'Cisco Certified CyberOps Associate'],
    assessmentScores: {
      'assess-cyber-soc': 74
    },
    uncertaintyScore: 18,
    readinessScore: {
      overallPercentage: 65,
      technicalScore: 68,
      projectScore: 62,
      problemSolvingScore: 65,
      softSkillScore: 72,
      status: 'building'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 10,
    learningStyle: 'hands_on',
    targetTimeline: 'skill_building'
  },

  // 4. Gokul - Electrical & Electronics Engineering
  {
    id: 'student-gokul',
    userId: 'user-gokul',
    fullName: 'Gokul',
    email: 'gokul@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Electrical & Electronics Engineering (EEE)',
    degree: 'B.Tech in Electrical & Electronics Engineering',
    yearOfStudy: 2,
    cgpa: 7.6,
    targetCareerId: 'career-biomedical-engineer',
    interests: ['Embedded Systems', 'Microcontrollers', 'IoT Sensors', 'Power Electronics'],
    skills: [
      { skillId: 'skill-soil-sensors', skillName: 'Soil Sensor & Telemetry Integration', level: 50, verified: false },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 45, verified: false },
      { skillId: 'skill-smart-irrigation', skillName: 'Automated Irrigation & Climate Control', level: 40, verified: false }
    ],
    projects: [],
    certifications: [],
    assessmentScores: {
      'assess-ee-circuits': 52
    },
    uncertaintyScore: 38,
    readinessScore: {
      overallPercentage: 48,
      technicalScore: 50,
      projectScore: 40,
      problemSolvingScore: 50,
      softSkillScore: 65,
      status: 'starting'
    },
    learningPace: 'steady',
    weeklyHoursCommitted: 8,
    learningStyle: 'interactive',
    targetTimeline: 'skill_building'
  },

  // 5. Sanjay - Mechanical & Robotics Engineering
  {
    id: 'student-sanjay',
    userId: 'user-sanjay',
    fullName: 'Sanjay',
    email: 'sanjay@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Mechanical & Robotics Engineering',
    degree: 'B.Tech in Mechanical & Robotics Engineering',
    yearOfStudy: 3,
    cgpa: 8.2,
    targetCareerId: 'career-ai-engineer',
    interests: ['Autonomous Robotics', 'Kinematics', 'ROS 2', 'Computer Vision'],
    skills: [
      { skillId: 'skill-python', skillName: 'Python Programming', level: 74, verified: true },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 65, verified: true },
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 60, verified: false }
    ],
    projects: [
      {
        id: 'proj-sanjay-1',
        title: '6-DOF Robotic Arm Inverse Kinematics Controller',
        description: 'Simulated Pick-and-Place trajectories in Gazebo with Python kinematic solvers.',
        technologies: ['ROS 2', 'Gazebo', 'Python', 'C++'],
        verified: true
      }
    ],
    certifications: ['Certified SOLIDWORKS Associate (CSWA)'],
    assessmentScores: {
      'assess-python-diagnostic': 76
    },
    uncertaintyScore: 15,
    readinessScore: {
      overallPercentage: 68,
      technicalScore: 70,
      projectScore: 68,
      problemSolvingScore: 72,
      softSkillScore: 70,
      status: 'building'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 12,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate'
  },

  // 6. Kishore - Electronics & Communication Engineering
  {
    id: 'student-kishore',
    userId: 'user-kishore',
    fullName: 'Kishore',
    email: 'kishore@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Electronics & Communication (ECE)',
    degree: 'B.Tech in Electronics & Communication Engineering',
    yearOfStudy: 3,
    cgpa: 8.0,
    targetCareerId: 'career-cloud-devops',
    interests: ['Embedded Linux', 'Edge Computing', 'Wireless Telemetry', 'Docker Containers'],
    skills: [
      { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', level: 62, verified: true },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 68, verified: true },
      { skillId: 'skill-soil-sensors', skillName: 'Soil Sensor & Telemetry Integration', level: 65, verified: false }
    ],
    projects: [
      {
        id: 'proj-kishore-1',
        title: 'LoRaWAN Edge Gateway with Cellular Failover',
        description: 'Deployed an open-source gateway transmitting field telemetry to cloud time-series DB.',
        technologies: ['Raspberry Pi', 'LoRaWAN', 'Python', 'MQTT'],
        verified: true
      }
    ],
    certifications: ['AWS Certified Cloud Practitioner'],
    assessmentScores: {
      'assess-cloud-k8s': 65
    },
    uncertaintyScore: 20,
    readinessScore: {
      overallPercentage: 61,
      technicalScore: 64,
      projectScore: 60,
      problemSolvingScore: 62,
      softSkillScore: 70,
      status: 'building'
    },
    learningPace: 'steady',
    weeklyHoursCommitted: 10,
    learningStyle: 'hands_on',
    targetTimeline: 'skill_building'
  },

  // 7. Karthick - Computer Science & Business Systems
  {
    id: 'student-karthick',
    userId: 'user-karthick',
    fullName: 'Karthick',
    email: 'karthick@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    degree: 'B.Tech in Computer Science & Business Systems',
    yearOfStudy: 4,
    cgpa: 8.6,
    targetCareerId: 'career-data-analyst',
    interests: ['Business Intelligence', 'Enterprise SQL', 'Cohort Retention', 'Financial Modeling'],
    skills: [
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 78, verified: true, lastAssessedAt: '2024-03-04' },
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 75, verified: true },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 70, verified: true },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 68, verified: false }
    ],
    projects: [
      {
        id: 'proj-karthick-1',
        title: 'SaaS Churn and Net Revenue Retention Engine',
        description: 'Constructed recursive SQL views and automated Tableau dashboards to pinpoint churn triggers.',
        technologies: ['PostgreSQL', 'Tableau', 'Python', 'Pandas'],
        verified: true
      }
    ],
    certifications: ['Microsoft Certified: Power BI Data Analyst Associate'],
    assessmentScores: {
      'assess-sql-diagnostic': 82
    },
    uncertaintyScore: 14,
    readinessScore: {
      overallPercentage: 74,
      technicalScore: 76,
      projectScore: 72,
      problemSolvingScore: 75,
      softSkillScore: 78,
      status: 'building'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 12,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate'
  },

  // 8. Kalai - Computer Science & Engineering
  {
    id: 'student-kalai',
    userId: 'user-kalai',
    fullName: 'Kalai',
    email: 'kalai@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    degree: 'B.Tech in Computer Science & Engineering',
    yearOfStudy: 3,
    cgpa: 8.9,
    targetCareerId: 'career-data-analyst',
    interests: ['Data Analytics', 'Business Intelligence', 'Python Automation', 'Executive Dashboards'],
    skills: [
      { skillId: 'skill-python', skillName: 'Python Programming', level: 80, verified: true, lastAssessedAt: '2024-03-01' },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 62, verified: false, lastAssessedAt: '2024-02-15' },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 74, verified: true, lastAssessedAt: '2024-03-05' },
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 68, verified: false }
    ],
    projects: [
      {
        id: 'proj-kalai-1',
        title: 'Customer Churn Analysis in Retail Banking',
        description: 'Exploratory data analysis using Pandas, Matplotlib, and scikit-learn on a Kaggle customer dataset.',
        technologies: ['Python', 'Pandas', 'Matplotlib'],
        verified: true,
        link: 'https://github.com/kalai/churn-analysis'
      }
    ],
    certifications: ['Google Data Analytics Professional Certificate'],
    assessmentScores: {
      'assess-sql-diagnostic': 72,
      'assess-python-diagnostic': 84
    },
    uncertaintyScore: 12,
    readinessScore: {
      overallPercentage: 72,
      technicalScore: 74,
      projectScore: 68,
      problemSolvingScore: 75,
      softSkillScore: 80,
      status: 'building'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 12,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate',
    completedMilestoneIds: ['ms-da-1'],
    completedResourceIds: ['res-sql-1']
  },

  // 9. Deepa - AI & Machine Learning
  {
    id: 'student-deepa',
    userId: 'user-deepa',
    fullName: 'Deepa',
    email: 'deepa@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Artificial Intelligence & Data Science',
    degree: 'B.Tech in Artificial Intelligence & Machine Learning',
    yearOfStudy: 4,
    cgpa: 9.2,
    targetCareerId: 'career-ai-engineer',
    interests: ['Natural Language Processing', 'Computer Vision', 'PyTorch', 'MLOps'],
    skills: [
      { skillId: 'skill-python', skillName: 'Python Programming', level: 90, verified: true, lastAssessedAt: '2024-03-06' },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 88, verified: true },
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 75, verified: true },
      { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', level: 70, verified: false }
    ],
    projects: [
      {
        id: 'proj-deepa-1',
        title: 'Real-Time Medical Image Segmentation with U-Net',
        description: 'Trained neural networks for CT-scan lesion segmentation reaching 0.91 Dice coefficient.',
        technologies: ['PyTorch', 'OpenCV', 'FastAPI', 'Docker'],
        verified: true
      }
    ],
    certifications: ['TensorFlow Developer Certificate', 'AWS Certified Machine Learning - Specialty'],
    assessmentScores: {
      'assess-python-diagnostic': 94
    },
    uncertaintyScore: 8,
    readinessScore: {
      overallPercentage: 86,
      technicalScore: 90,
      projectScore: 85,
      problemSolvingScore: 88,
      softSkillScore: 82,
      status: 'career_ready'
    },
    learningPace: 'intensive',
    weeklyHoursCommitted: 15,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate'
  },

  // 10. Seetha - Biomedical Engineering
  {
    id: 'student-seetha',
    userId: 'user-seetha',
    fullName: 'Seetha',
    email: 'seetha@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Electronics & Communication (ECE)',
    degree: 'B.Tech in Biomedical Engineering',
    yearOfStudy: 3,
    cgpa: 8.5,
    targetCareerId: 'career-biomedical-engineer',
    interests: ['Biosensors', 'Medical Instrumentation', 'Digital Signal Processing', 'Telehealth Devices'],
    skills: [
      { skillId: 'skill-soil-sensors', skillName: 'Soil Sensor & Telemetry Integration', level: 70, verified: true },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 65, verified: false },
      { skillId: 'skill-stats', skillName: 'Applied Statistics & Probability', level: 60, verified: false }
    ],
    projects: [
      {
        id: 'proj-seetha-1',
        title: 'Bluetooth Low Energy PPG Heart-Rate Monitor',
        description: 'Engineered filtering algorithms in Python to suppress motion artifacts in optical pulse readings.',
        technologies: ['C++', 'Python', 'BLE', 'Digital Signal Processing'],
        verified: true
      }
    ],
    certifications: ['Biomedical Device Quality & Regulatory Compliance'],
    assessmentScores: {
      'assess-health-fhir': 70
    },
    uncertaintyScore: 16,
    readinessScore: {
      overallPercentage: 64,
      technicalScore: 66,
      projectScore: 65,
      problemSolvingScore: 62,
      softSkillScore: 74,
      status: 'building'
    },
    learningPace: 'steady',
    weeklyHoursCommitted: 10,
    learningStyle: 'hands_on',
    targetTimeline: 'skill_building'
  },

  // 11. Sathya - Information Technology
  {
    id: 'student-sathya',
    userId: 'user-sathya',
    fullName: 'Sathya',
    email: 'sathya@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Computer Science & Engineering / IT',
    degree: 'B.Tech in Information Technology',
    yearOfStudy: 4,
    cgpa: 8.7,
    targetCareerId: 'career-cybersec-architect',
    interests: ['Cloud Infrastructure Defense', 'Penetration Testing', 'Identity & Access Management', 'DevSecOps'],
    skills: [
      { skillId: 'skill-cloud', skillName: 'Cloud Architecture & DevOps', level: 80, verified: true },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 78, verified: true },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 70, verified: false }
    ],
    projects: [
      {
        id: 'proj-sathya-1',
        title: 'Automated IAM Least Privilege Analyzer in AWS',
        description: 'Parsed CloudTrail access logs to flag over-permissive IAM roles and suggest surgical policies.',
        technologies: ['AWS IAM', 'Python', 'CloudTrail', 'Boto3'],
        verified: true
      }
    ],
    certifications: ['Certified Information Systems Security Professional (Associate)', 'AWS Certified Security - Specialty'],
    assessmentScores: {
      'assess-cloud-k8s': 78
    },
    uncertaintyScore: 11,
    readinessScore: {
      overallPercentage: 79,
      technicalScore: 82,
      projectScore: 78,
      problemSolvingScore: 78,
      softSkillScore: 82,
      status: 'competent'
    },
    learningPace: 'accelerated',
    weeklyHoursCommitted: 12,
    learningStyle: 'hands_on',
    targetTimeline: 'immediate'
  },

  // 12. Saranya - Civil & Environmental Engineering
  {
    id: 'student-saranya',
    userId: 'user-saranya',
    fullName: 'Saranya',
    email: 'saranya@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    discipline: 'engineering',
    stream: 'Civil & Environmental Engineering',
    degree: 'B.Tech in Civil & Smart Infrastructure Technology',
    yearOfStudy: 2,
    cgpa: 7.4,
    targetCareerId: 'career-data-analyst',
    interests: ['Smart City Sensors', 'GIS Mapping', 'Spatial Analytics', 'Infrastructure BI'],
    skills: [
      { skillId: 'skill-data-viz', skillName: 'Data Visualization & BI', level: 55, verified: false },
      { skillId: 'skill-sql', skillName: 'SQL & Relational Databases', level: 40, verified: false },
      { skillId: 'skill-python', skillName: 'Python Programming', level: 42, verified: false }
    ],
    projects: [],
    certifications: ['AutoCAD Certified User'],
    assessmentScores: {
      'assess-sql-diagnostic': 45
    },
    uncertaintyScore: 42,
    readinessScore: {
      overallPercentage: 45,
      technicalScore: 46,
      projectScore: 38,
      problemSolvingScore: 48,
      softSkillScore: 68,
      status: 'starting'
    },
    learningPace: 'steady',
    weeklyHoursCommitted: 8,
    learningStyle: 'visual',
    targetTimeline: 'skill_building'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-selva',
    title: 'New Advanced Milestone Ready',
    message: 'Your Deep Learning & LLM Fine-Tuning roadmap module is waiting. Take the diagnostic drill to benchmark your skills.',
    type: 'milestone',
    read: false,
    createdAt: '10 mins ago',
    link: '/roadmap'
  },
  {
    id: 'notif-2',
    userId: 'user-selva',
    title: 'Faculty Intervention: Advisor Note',
    message: 'Dr. Balu Prasath reviewed your profile and recommended focusing on distributed model inference architectures.',
    type: 'mentor',
    read: false,
    createdAt: '2 hours ago',
    link: '/skills'
  },
  {
    id: 'notif-3',
    userId: 'user-kalai',
    title: 'SQL Milestone Unlocked',
    message: 'Advanced Window Functions & CTE practice is ready in your Adaptive Roadmap.',
    type: 'milestone',
    read: false,
    createdAt: '1 day ago',
    link: '/roadmap'
  }
];

export const SEED_INTERVENTIONS: MentorIntervention[] = [
  {
    id: 'int-1',
    studentId: 'student-gokul',
    studentName: 'Gokul',
    studentEmail: 'gokul@college.edu',
    targetCareer: 'Biomedical Devices & Robotics Engineer',
    reason: 'high_uncertainty',
    status: 'open',
    notes: 'High uncertainty flagged (38) with stalled project building. Scheduled 1-on-1 mentoring to review embedded electronics fundamentals and bridge microcontroller labs into biomedical robotics prototyping.',
    createdAt: '2024-03-08T10:30:00.000Z'
  },
  {
    id: 'int-2',
    studentId: 'student-saranya',
    studentName: 'Saranya',
    studentEmail: 'saranya@college.edu',
    targetCareer: 'Data Analyst & BI Specialist',
    reason: 'persistent_gap',
    status: 'open',
    notes: 'Low readiness score (45%) on foundational SQL and spatial analytics. Assigned the SQL Practice Sandbox and recommended pairing with Kalai for peer-assisted learning.',
    createdAt: '2024-03-09T14:15:00.000Z'
  },
  {
    id: 'int-3',
    studentId: 'student-selva',
    studentName: 'Selva',
    studentEmail: 'selva@college.edu',
    targetCareer: 'AI & Machine Learning Engineer',
    reason: 'persistent_gap',
    status: 'addressed',
    notes: 'Exceptional progress across PyTorch and Deep Learning (78% readiness). Recommended advancing to high-scale model serving and exploring national hackathon challenges.',
    createdAt: '2024-03-10T11:00:00.000Z'
  }
];

export const SEED_CURRICULUM_GAPS: CurriculumGapInsight[] = [
  {
    id: 'gap-1',
    discipline: 'engineering',
    careerTitle: 'Data Analyst & BI Specialist',
    skillName: 'SQL & Relational Databases (Window Functions & dbt)',
    deficiencyPercentage: 42,
    studentCount: 142,
    suggestedIntervention: 'Integrate 3 weeks of hands-on dbt transformation labs into CSE Database Systems course.',
    priority: 'high'
  },
  {
    id: 'gap-2',
    discipline: 'agriculture',
    careerTitle: 'Precision AgTech & IoT Specialist',
    skillName: 'GIS & Crop Yield Predictive Modeling',
    deficiencyPercentage: 58,
    studentCount: 88,
    suggestedIntervention: 'Deploy an on-campus smart farm IoT telemetry bed and introduce a dedicated Geoinformatics elective.',
    priority: 'critical'
  },
  {
    id: 'gap-3',
    discipline: 'paramedical',
    careerTitle: 'Clinical Health Informatics Specialist',
    skillName: 'EHR & Health Protocols (HL7/FHIR)',
    deficiencyPercentage: 48,
    studentCount: 65,
    suggestedIntervention: 'Introduce a modular Digital Health Records seminar for 3rd year paramedical students with hospital IT shadowing.',
    priority: 'high'
  },
  {
    id: 'gap-4',
    discipline: 'commerce',
    careerTitle: 'FinTech Quantitative Analyst',
    skillName: 'Quantitative Risk & Algorithmic Trading',
    deficiencyPercentage: 38,
    studentCount: 110,
    suggestedIntervention: 'Embed computational finance workshops into Corporate Accounting and Valuation curriculum.',
    priority: 'medium'
  },
  {
    id: 'gap-5',
    discipline: 'law_governance',
    careerTitle: 'Cyber Law & AI Governance Analyst',
    skillName: 'AI Ethics, Governance & Model Auditing',
    deficiencyPercentage: 52,
    studentCount: 45,
    suggestedIntervention: 'Offer interdisciplinary joint seminars between Computer Science and Law faculties on algorithmic accountability.',
    priority: 'high'
  }
];

