'use strict'

/**
 * Body class to manage human body and aging seed data
 * @class Body
 */
class Body {
  constructor() {}

  /**
   * prepare datatypes human body
   * @method prepareDTbodyMessage
   * @returns {Array} List of body datatype contracts
   */
  prepareDTbodyMessage = function () {
    let bodyParts = []
    bodyParts.push({ name: 'Human', description: 'life animal sapien species', wikipedia: 'Human' })
    bodyParts.push({ name: 'Body', description: 'body of life', wikipedia: 'Human_body' })
    // parts
    bodyParts.push({ name: 'Torso', description: 'trunk of body', wikipedia: 'Torso' })
    bodyParts.push({ name: 'Arm', description: 'The upper limb of the body stretching from shoulder to wrist', wikipedia: 'Arm' });
    bodyParts.push({ name: 'Leg', description: 'The lower weight-bearing limb stretching from hip to ankle', wikipedia: 'Human_leg' });
    bodyParts.push({ name: 'Ear', description: 'The sensory organ responsible for hearing and balance', wikipedia: 'Ear' });
    bodyParts.push({ name: 'Nose', description: 'The prominent midline organ for smelling and respiration entry', wikipedia: 'Human_nose' });
    bodyParts.push({ name: 'Hand', description: 'The prehensile terminal organ of the upper limb containing fingers', wikipedia: 'Hand' });
    bodyParts.push({ name: 'Finger', description: 'An individual articulating digit of the hand', wikipedia: 'Finger' });
    bodyParts.push({ name: 'Foot', description: 'The terminal weight-bearing structure of the lower limb', wikipedia: 'Foot' });
    bodyParts.push({ name: 'Toe', description: 'An individual articulating digit of the foot', wikipedia: 'Toe' });
    bodyParts.push({ name: 'Neck', description: 'Cervical region connecting the head to the torso', wikipedia: 'Neck' });
    bodyParts.push({ name: 'Shoulder', description: 'Proximal joint connecting the upper limb to the torso', wikipedia: 'Shoulder' });
    bodyParts.push({ name: 'Elbow', description: 'Hinge joint connecting the upper arm to the forearm', wikipedia: 'Elbow' });
    bodyParts.push({ name: 'Wrist', description: 'Distal joint connecting the forearm to the hand', wikipedia: 'Wrist' });
    bodyParts.push({ name: 'Hip', description: 'Pelvic joint connecting the lower limb to the torso', wikipedia: 'Hip' });
    bodyParts.push({ name: 'Knee', description: 'Central hinge joint of the lower limb connecting the thigh to the leg', wikipedia: 'Knee' });
    bodyParts.push({ name: 'Ankle', description: 'Distal joint connecting the leg to the foot', wikipedia: 'Ankle' });
    bodyParts.push({ name: 'Foot', description: 'Terminal weight-bearing structure of the lower limb', wikipedia: 'Foot' });

    bodyParts.push({ name: 'Eye', description: 'Organ of visual sensory perception', wikipedia: 'Human_eye' });
    bodyParts.push({ name: 'Mouth', description: 'Oral cavity for ingestion, vocalization, and digestion entry', wikipedia: 'Mouth' });
    bodyParts.push({ name: 'Jaw', description: 'Structural framework of the mouth housing teeth and controlling bite force', wikipedia: 'Jaw' });

    bodyParts.push({ name: 'Spine', description: 'Vertebral column providing central structural support and nervous conduit', wikipedia: 'Vertebral_column' });
    bodyParts.push({ name: 'Chest', description: 'Thoracic region of the upper torso housing cardiorespiratory organs', wikipedia: 'Thorax' });
    bodyParts.push({ name: 'Abdomen', description: 'Mid-torso region housing primary digestive systems', wikipedia: 'Abdomen' });
    bodyParts.push({ name: 'Pelvis', description: 'Lower torso framework supporting visceral organs and anchoring locomotion', wikipedia: 'Pelvis' });

    // organs
    bodyParts.push({ name: 'Human organs', description: 'List_of_organs_of_the_human_body', wikipedia: 'List_of_organs_of_the_human_body' })
    bodyParts.push({ name: 'Skeleton system', description: 'Human musculoskeleta system', wikipedia: 'Human_musculoskeletal_system' })
    bodyParts.push({ name: 'Skeleton', description: '', wikipedia: 'Human_skeleton' })
    bodyParts.push({ name: 'Joint', description: '', wikipedia: 'Joint' })
    bodyParts.push({ name: 'Ligament', description: '', wikipedia: 'Ligament' })
    bodyParts.push({ name: 'Muscular system', description: '', wikipedia: 'Muscular_system' })
    bodyParts.push({ name: 'Tendon', description: '', wikipedia: 'Tendon' })

    bodyParts.push({ name: 'Digestive system', description: 'human digetion', wikipedia: 'Human_digestive_system' })
    bodyParts.push({ name: 'Mouth', description: 'breath, talk, taste', wikipedia: 'Human_mouth' })
    bodyParts.push({ name: 'Tooth', description: 'chew, bite', wikipedia: 'Human_tooth' })
    bodyParts.push({ name: 'Tongue', description: 'tatest siliva', wikipedia: 'Tongue' })
    bodyParts.push({ name: 'Lips', description: 'form speech smile', wikipedia: 'Lip' })
    bodyParts.push({ name: 'Salivary system', description: 'saliva', wikipedia: 'Salivary_gland' })
    bodyParts.push({ name: 'Saliva gland', description: 'produce spit', wikipedia: 'Parotid_gland' })
    bodyParts.push({ name: 'Submandibular gland', description: 'produce saliva', wikipedia: 'Submandibular_gland' })
    bodyParts.push({ name: 'Sublingual gland', description: 'produce saliva', wikipedia: 'Sublingual_gland' })
    bodyParts.push({ name: 'Pharynx', description: 'connect mouth to throat', wikipedia: 'Pharynx' })
    bodyParts.push({ name: 'Esophagus', description: 'Esophagus', wikipedia: 'Esophagus' })
    bodyParts.push({ name: 'Stomach', description: 'Stomach', wikipedia: 'Stomach' })
    bodyParts.push({ name: 'Small intestine', description: 'Small intestine', wikipedia: 'Small_intestine' })
    bodyParts.push({ name: 'Duodenum', description: 'Duodenum', wikipedia: 'Duodenum' })
    bodyParts.push({ name: 'Jejunum', description: 'Jejunum', wikipedia: 'Jejunum' })
    bodyParts.push({ name: 'Ileum', description: 'Ileum', wikipedia: 'Ileum' })
    bodyParts.push({ name: 'Large intestine', description: 'Large intestine', wikipedia: 'Large_intestine' })
    bodyParts.push({ name: 'Cecum', description: 'Cecum', wikipedia: 'Cecum' })
    bodyParts.push({ name: 'Ascending colon', description: 'Ascending colon', wikipedia: 'Ascending_colon' })
    bodyParts.push({ name: 'Transverse colon', description: 'Transverse colon', wikipedia: 'Transverse_colon' })
    bodyParts.push({ name: 'Descending colon', description: 'Descending colon', wikipedia: 'Descending_colon' })
    bodyParts.push({ name: 'Sigmoid colon', description: 'Sigmoid colon', wikipedia: 'Sigmoid_colon' })
    bodyParts.push({ name: 'Rectum', description: 'Rectum', wikipedia: 'Rectum' })
    bodyParts.push({ name: 'Liver', description: 'Liver', wikipedia: 'Liver' })
    bodyParts.push({ name: 'Gallbladder', description: 'Gallbladder', wikipedia: 'Gallbladder' })
    bodyParts.push({ name: 'Mesentery', description: 'Mesentery', wikipedia: 'Mesentery' })
    bodyParts.push({ name: 'Anal canal', description: 'Anal canal', wikipedia: 'Anal_canal' })

    bodyParts.push({ name: 'Breathing system', description: 'take in air to lungs', wikipedia: 'Respiratory_system' })
    bodyParts.push({ name: 'Nasal cavity', description: 'Nasal cavity', wikipedia: 'Nasal_cavity' })
    bodyParts.push({ name: 'Larynx', description: 'Larynx', wikipedia: 'Larynx' })
    bodyParts.push({ name: 'Trachea', description: 'Trachea', wikipedia: 'Trachea' })
    bodyParts.push({ name: 'Bronchus', description: 'Bronchus', wikipedia: 'Bronchus' })
    bodyParts.push({ name: 'Bronchiole', description: 'Bronchiole', wikipedia: 'Bronchiole' })
    bodyParts.push({ name: 'Lung', description: 'air oxgyen co2', wikipedia: 'Lung' })
    bodyParts.push({ name: 'Muscles of respiration', description: 'Muscles of respiration', wikipedia: 'Muscles_of_respiration' })

    bodyParts.push({ name: 'Urinary system', description: 'human waste', wikipedia: 'Urinary_system' })
    bodyParts.push({ name: 'Kidney', description: 'Kidney', wikipedia: 'Kidney' })
    bodyParts.push({ name: 'Ureter', description: 'Ureter', wikipedia: 'Ureter' })
    bodyParts.push({ name: 'Bladder', description: 'Bladder', wikipedia: 'Bladder' })
    bodyParts.push({ name: 'Urethra', description: 'Urethra', wikipedia: 'Urethra' })

    bodyParts.push({ name: 'Reproductive system', description: 'human fertility', wikipedia: 'Human_reproductive_system' })
    bodyParts.push({ name: 'Female reproductive system', description: 'Female reproductive system', wikipedia: 'Female_reproductive_system' })
    bodyParts.push({ name: 'Ovary', description: 'Ovary', wikipedia: 'Ovary' })
    bodyParts.push({ name: 'Fallopian tube', description: 'Fallopian tube', wikipedia: 'Fallopian_tube' })
    bodyParts.push({ name: 'Uterus', description: 'Uterus', wikipedia: 'Uterus' })
    bodyParts.push({ name: 'Cervix', description: 'Cervix', wikipedia: 'Cervix' })
    bodyParts.push({ name: 'Placenta', description: 'Placenta', wikipedia: 'Placenta' })
    bodyParts.push({ name: 'Vulva', description: 'Vulva', wikipedia: 'Vulva' })
    bodyParts.push({ name: 'Clitoris', description: 'Clitoris', wikipedia: 'Clitoris' })
    bodyParts.push({ name: 'Vagina', description: 'Vagina', wikipedia: 'Vagina' })

    bodyParts.push({ name: 'Male reproductive system', description: 'Male reproductive system', wikipedia: 'Male_reproductive_system' })
    bodyParts.push({ name: 'Testicle', description: 'Testicle', wikipedia: 'Testicle' })
    bodyParts.push({ name: 'Epididymis', description: 'Epididymis', wikipedia: 'Epididymis' })
    bodyParts.push({ name: 'Vas deferens', description: 'Vas deferens', wikipedia: 'Vas_deferens' })
    bodyParts.push({ name: 'Seminal vesicles', description: 'Seminal vesicles', wikipedia: 'Seminal_vesicles' })
    bodyParts.push({ name: 'Prostate', description: 'Prostate', wikipedia: 'Prostate' })
    bodyParts.push({ name: 'Bulbourethral gland', description: 'Bulbourethral gland', wikipedia: 'Bulbourethral_gland' })
    bodyParts.push({ name: 'Human penis', description: 'Human penis', wikipedia: 'Human_penis' })
    bodyParts.push({ name: 'Scrotum', description: 'Scrotum', wikipedia: 'Scrotum' })

    bodyParts.push({ name: 'Endocrine system', description: 'human hormones', wikipedia: 'Endocrine_system' })
    bodyParts.push({ name: 'Pituitary gland', description: 'Pituitary gland', wikipedia: 'Pituitary_gland' })
    bodyParts.push({ name: 'Pineal gland', description: 'Pineal gland', wikipedia: 'Pineal_gland' })
    bodyParts.push({ name: 'Thyroid', description: 'Thyroid', wikipedia: 'Thyroid' })
    bodyParts.push({ name: 'Parathyroid gland', description: 'Parathyroid gland', wikipedia: 'Parathyroid_gland' })
    bodyParts.push({ name: 'Adrenal gland', description: 'Adrenal gland', wikipedia: 'Adrenal_gland' })
    bodyParts.push({ name: 'Pancreas', description: 'Pancreas', wikipedia: 'Pancreas' })

    bodyParts.push({ name: 'Heart system', description: 'heart beat and blood flow', wikipedia: 'Circulatory_system' })
    bodyParts.push({ name: 'Heart', description: 'Heart', wikipedia: 'Heart' })
    bodyParts.push({ name: 'Artery', description: 'Artery', wikipedia: 'Artery' })
    bodyParts.push({ name: 'Vein', description: 'Vein', wikipedia: 'Vein' })
    bodyParts.push({ name: 'Capillary', description: 'Capillary', wikipedia: 'Capillary' })
    bodyParts.push({ name: 'Lymphatic vessel', description: 'Lymphatic vessel', wikipedia: 'Lymphatic_vessel' })
    bodyParts.push({ name: 'Lymph node', description: 'Lymph node', wikipedia: 'Lymph_node' })
    bodyParts.push({ name: 'Bone marrow', description: 'Bone marrow', wikipedia: 'Bone_marrow' })
    bodyParts.push({ name: 'Thymus', description: 'Thymus', wikipedia: 'Thymus' })
    bodyParts.push({ name: 'Spleen', description: 'Spleen', wikipedia: 'Spleen' })
    bodyParts.push({ name: 'Tonsil', description: 'Tonsil', wikipedia: 'Tonsil' })
    bodyParts.push({ name: 'Interstitium', description: 'Interstitium', wikipedia: 'Interstitium' })

    bodyParts.push({ name: 'Nervous system', description: 'senses and brain', wikipedia: 'Nervous_system' })
    bodyParts.push({ name: 'Human brain', description: 'Human brain', wikipedia: 'Human_brain' })
    bodyParts.push({ name: 'Cerebral hemisphere', description: 'Cerebral hemisphere', wikipedia: 'Cerebral_hemisphere' })
    bodyParts.push({ name: 'Thalamus', description: 'Thalamus', wikipedia: 'Thalamus' })
    bodyParts.push({ name: 'Hypothalamus', description: 'Hypothalamus', wikipedia: 'Hypothalamus' })
    bodyParts.push({ name: 'Midbrain', description: 'Midbrain', wikipedia: 'Midbrain' })
    bodyParts.push({ name: 'Cerebellum', description: 'Cerebellum', wikipedia: 'Cerebellum' })
    bodyParts.push({ name: 'Pons', description: 'Pons', wikipedia: 'Pons' })
    bodyParts.push({ name: 'Medulla oblongata', description: 'Medulla oblongata', wikipedia: 'Medulla_oblongata' })
    bodyParts.push({ name: 'Spinal cord', description: 'Spinal cord', wikipedia: 'Spinal_cord' })
    bodyParts.push({ name: 'Choroid plexus', description: 'Choroid plexus', wikipedia: 'Choroid_plexus' })
    bodyParts.push({ name: 'Nerve', description: 'Nerve', wikipedia: 'Nerve' })
    bodyParts.push({ name: 'Cranial nerves', description: 'Cranial nerves', wikipedia: 'Cranial_nerves' })
    bodyParts.push({ name: 'Spinal nerves', description: 'Spinal nerves', wikipedia: 'Spinal_nerve' })
    bodyParts.push({ name: 'Ganglion', description: 'Ganglion', wikipedia: 'Ganglion' })
    bodyParts.push({ name: 'Enteric nervous system', description: 'Enteric nervous system', wikipedia: 'Enteric_nervous_system' })
    bodyParts.push({ name: 'Head', description: 'Head', wikipedia: 'Head' })
    bodyParts.push({ name: 'Cornea', description: 'Cornea', wikipedia: 'Cornea' })
    bodyParts.push({ name: 'Ear', description: 'Ear', wikipedia: 'Ear' })
    bodyParts.push({ name: 'Nose', description: 'Nose', wikipedia: 'Nose' })

    bodyParts.push({ name: 'Skin system', description: 'skin', wikipedia: 'Integumentary_system' })
    bodyParts.push({ name: 'Mammary gland', description: 'Mammary gland', wikipedia: 'Mammary_gland' })
    bodyParts.push({ name: 'Skin', description: 'Skin', wikipedia: 'Human_skin' })
    bodyParts.push({ name: 'Hair', description: 'Hair', wikipedia: 'Hair' })

    let gaiaJack = []
    for (let wiki of bodyParts) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack
  }


  /**
   * @method prepareBiologyLanguage
   * @returns
  */
  prepareBiologyLanguage = function () {

    let bodyParts = []
    // Cellular Scale
    bodyParts.push({ name: 'Cell', description: 'The basic structural, functional, and biological unit of all known organisms', wikipedia: 'Cell_(biology)' });
    bodyParts.push({ name: 'Organelle', description: 'A specialized subunit within a cell that has a specific cellular function', wikipedia: 'Organelle' });
    bodyParts.push({ name: 'DNA', description: 'Deoxyribonucleic acid; the hereditary material containing genetic instructions', wikipedia: 'DNA' });
    bodyParts.push({ name: 'RNA', description: 'Ribonucleic acid; the essential molecule for translating genetic code into proteins', wikipedia: 'RNA' });
    bodyParts.push({ name: 'Mitochondria', description: 'The double-membrane organelle responsible for generating cellular chemical energy (ATP)', wikipedia: 'Mitochondrion' });
    bodyParts.push({ name: 'Cell Membrane', description: 'The semipermeable biological barrier separating the interior of a cell from the outside environment', wikipedia: 'Cell_membrane' });
    bodyParts.push({ name: 'Nucleus', description: 'The membrane-enclosed organelle harboring the cellular genome', wikipedia: 'Cell_nucleus' });
    bodyParts.push({ name: 'Ribosome', description: 'The cellular machine that catalyzes biological protein synthesis', wikipedia: 'Ribosome' });
    bodyParts.push({ name: 'Stem Cell', description: 'Undifferentiated biological cells capable of turning into specialized cell types', wikipedia: 'Stem_cell' });

    // Somatic Fluids
    bodyParts.push({ name: 'Blood', description: 'The primary circulating fluid delivering oxygen and nutrients throughout the body', wikipedia: 'Blood' });
    bodyParts.push({ name: 'Sweat', description: 'The watery fluid excreted by sweat glands for thermoregulation', wikipedia: 'Perspiration' });
    bodyParts.push({ name: 'Saliva', description: 'The extracellular digestive fluid produced by salivary glands in the mouth', wikipedia: 'Saliva' });
    bodyParts.push({ name: 'Lymph', description: 'The clear interstitial fluid containing white blood cells that flows through the lymphatic system', wikipedia: 'Lymph' });
    bodyParts.push({ name: 'Tears', description: 'The watery protective fluid secreted by lacrimal glands to lubricate the eyes', wikipedia: 'Tears' });
    bodyParts.push({ name: 'Urine', description: 'The liquid metabolic waste stream filtered from the blood by the kidneys', wikipedia: 'Urine' });
    bodyParts.push({ name: 'Bile', description: 'The dark-green fluid produced by the liver that aids lipid digestion in the duodenum', wikipedia: 'Bile' });
    bodyParts.push({ name: 'Interstitial Fluid', description: 'The solution that bathes and surrounds the tissue cells of multicellular animals', wikipedia: 'Interstitial_fluid' });

    // Biomolecular Materials
    bodyParts.push({ name: 'Protein', description: 'Large biomolecules comprised of amino acid chains performing vital biological actions', wikipedia: 'Protein' });
    bodyParts.push({ name: 'Lipid', description: 'Hydrophobic molecules acting as energy stores and structural cell membrane components', wikipedia: 'Lipid' });
    bodyParts.push({ name: 'Glucose', description: 'The primary simple sugar circulating in blood used as metabolic fuel', wikipedia: 'Glucose' });
    bodyParts.push({ name: 'Hormone', description: 'Chemical signaling molecules transported by the circulatory system to regulate physiology', wikipedia: 'Hormone' });
    bodyParts.push({ name: 'Collagen', description: 'The main structural protein found in extracellular matrices and connective tissues', wikipedia: 'Collagen' });

    let gaiaJack = []
    for (let wiki of bodyParts) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack    

  }


    /**
   * @method prepareBiologyLanguage
   * @returns
  */
  prepareMetricLanguage = function () {

    // Define the raw physical and biological metrics with descriptive anchors
    const somaticMetrics = [
      { 
        name: 'Degrees of Freedom', 
        description: 'The number of independent dimensions/planes in which a joint or tissue can move (DOF)', 
        wikipedia: 'Degrees_of_freedom_(mechanics)' 
      },
      { 
        name: 'Volume', 
        description: 'The three-dimensional space occupied by a liquid or solid tissue compartment (cm³)', 
        wikipedia: 'Volume' 
      },
      { 
        name: 'Flexion Limit', 
        description: 'The absolute mechanical boundary for bending movement at a joint segment (degrees)', 
        wikipedia: 'Flexion' 
      },
      { 
        name: 'somaticFlexion', 
        description: 'bending movement at a joint segment (degrees)', 
        wikipedia: 'somaticFlexion' 
      },
      { 
        name: 'Surface Area', 
        description: 'The total outward-facing boundary surface area of an organ or tissue system (m²)', 
        wikipedia: 'Surface_area' 
      },
      { 
        name: 'Extension Limit', 
        description: 'The absolute mechanical boundary for straightening movement at a joint segment (degrees)', 
        wikipedia: 'Extension_(kinesiology)' 
      },
      { 
        name: 'Thickness', 
        description: 'The cross-sectional depth or thickness of a tissue membrane, dermis, or wall (mm)', 
        wikipedia: 'Thickness' 
      },
      { 
        name: 'Torque Threshold', 
        description: 'The rotational force limit before localized structural tissue or joint failure occurs (Nm)', 
        wikipedia: 'Torque' 
      },
      { 
        name: 'Material Density', 
        description: 'The volumetric mass density of bone, muscle, or structural fluid systems (kg/m³)', 
        wikipedia: 'Density' 
      },
      { 
        name: 'Resonance Frequency', 
        description: 'The natural oscillating frequency of target tissue structures under localized vibrational stress (Hz)', 
        wikipedia: 'Resonance' 
      },
      { 
        name: 'Elastic Modulus', 
        description: 'Young\'s Modulus of elasticity; the measure of structural tissue stiffness and recovery under stress (Pa)', 
        wikipedia: 'Young%27s_modulus' 
      },
      {
        name: 'Radius',
        description: 'center circle to edge from center',
        wikipedia: 'Radius'
      },
      {
        name: 'Length',
        description: 'direction of measurement',
        wikipedia: 'Length'
      },
      {
        name: 'Width',
        description: 'direction of measurement',
        wikipedia: 'Width'
      },
      {
        name: 'Height',
        description: 'direction of measurement',
        wikipedia: 'Height'
      },
      {
        name: 'somaticPosture',
        description: 'mesh structure',
        wikipedia: 'somaticPosture'
      },
      {
        name: 'fascialTone',
        description: 'fascial mesh',
        wikipedia: 'fascialTone'
      }


    ];

    let gaiaJack = [];

    for (let metric of somaticMetrics) {
      const refContract = {};
      refContract.type = 'library';
      refContract.action = 'contracts';
      refContract.reftype = 'datatype';
      refContract.task = 'PUT';
      refContract.privacy = 'public';

      let dtSettings = {};
      dtSettings.primary = true;
      dtSettings.name = metric.name;
      dtSettings.description = metric.description;
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + metric.wikipedia;
      dtSettings.rdf = 'https://dbpedia.org/page/' + metric.wikipedia;
      
      // High-precision physical readings are mapped as Float/Decimal rather than simple Integers
      dtSettings.measurement = 'Float'; 
      dtSettings.datatypeType = 'biological_metric'; // Isolated datatype sub-class

      refContract.data = dtSettings;
      gaiaJack.push(refContract);
    }

    return gaiaJack;
  }

  /**
   * @method prepareOrientationLanguage
   * @returns
  */
  prepareOrientationLanguage = function () {

    // Spatial Core Axes
    let bodyParts = []
    // relative body direction  common sense held
    bodyParts.push({ name: 'Left', description: '', wikipedia: 'Body-relative_direction' });
    bodyParts.push({ name: 'Right', description: '', wikipedia: 'Body-relative_direction' });
    bodyParts.push({ name: 'Backward', description: '', wikipedia: 'Body-relative_direction' });
    bodyParts.push({ name: 'Forward', description: '', wikipedia: 'Body-relative_direction' });
    bodyParts.push({ name: 'Up', description: '', wikipedia: 'Body-relative_direction' });
    bodyParts.push({ name: 'Down', description: '', wikipedia: 'Body-relative_direction' });

    // biology direction terms
    bodyParts.push({ name: 'Skyward', description: 'Upward direction toward the head along the vertical axis', wikipedia: 'Anatomical_terms_of_location#Superior_and_inferior' });
    bodyParts.push({ name: 'Earthward', description: 'Downward direction toward the feet along the vertical axis', wikipedia: 'Anatomical_terms_of_location#Superior_and_inferior' });
    bodyParts.push({ name: 'Portside', description: 'The absolute left side from the perspective of the peer', wikipedia: 'Port_and_starboard' });
    bodyParts.push({ name: 'Starboard', description: 'The absolute right side from the perspective of the peer', wikipedia: 'Port_and_starboard' });
    bodyParts.push({ name: 'Outward', description: 'Forward-facing direction toward the gaze and chest', wikipedia: 'Anatomical_terms_of_location#Anterior_and_posterior' });
    bodyParts.push({ name: 'Spineward', description: 'Backward-facing direction toward the support column and spine', wikipedia: 'Anatomical_terms_of_location#Anterior_and_posterior' });

    // Symmetrical Planes
    bodyParts.push({ name: 'Midline', description: 'The vertical plane running down the center splitting port and starboard', wikipedia: 'Sagittal_plane' });
    bodyParts.push({ name: 'Horizon', description: 'The horizontal plane splitting the skyward and earthward halves', wikipedia: 'Transverse_plane' });
    bodyParts.push({ name: 'Depth', description: 'The vertical doorway plane splitting outward front from spineward back', wikipedia: 'Coronal_plane' });

    // Proximity & Depth Layers
    bodyParts.push({ name: 'Anchor', description: 'Proximally located point closest to the central mass or origin', wikipedia: 'Anatomical_terms_of_location#Proximal_and_distal' });
    bodyParts.push({ name: 'Terminal', description: 'Distally located point furthest out along an appendage', wikipedia: 'Anatomical_terms_of_location#Terminal' });
    bodyParts.push({ name: 'Fascial', description: 'Superficial layers closer to the outer surface of the body', wikipedia: 'Anatomical_terms_of_location#Superficial_and_deep' });
    bodyParts.push({ name: 'Core', description: 'Deep structural layers positioned far inside the outer surface', wikipedia: 'Anatomical_terms_of_location#Superficial_and_deep' });
  
    let gaiaJack = []
    for (let wiki of bodyParts) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.reftype = 'datatype'
      refContract.task = 'PUT'
      refContract.privacy = 'public'
      let dtSettings = {}
      dtSettings.primary = true
      dtSettings.name = wiki.name
      dtSettings.description = wiki.description
      dtSettings.wiki = 'https://en.wikipedia.org/wiki/' + wiki.wikipedia
      dtSettings.rdf = 'https://dbpedia.org/page/' + wiki.wikipedia
      dtSettings.measurement = 'Integer'
      dtSettings.datatypeType = 'datatype'
      refContract.data = dtSettings
      gaiaJack.push(refContract)
    }
    return gaiaJack    
  
  }

  /**
   * prepare save contract message for aging
   * @method prepareDTagingMessage
   * @returns {Array} List of aging datatype contracts
   */
  prepareDTagingMessage = function () {
    let gaiaJack = []
    // 
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'Hallmarks of aging'
    dtSettings.description = 'How to categorise aging'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Hallmarks_of_aging'
    dtSettings.rdf = 'https://dbpedia.org/page/Hallmarks_of_aging'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // Genome instability
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'Genome instability'
    dtSettings1.description = 'Genome changes with time'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Genome_instability'
    dtSettings1.rdf = 'https://dbpedia.org/page/Genome_instability'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // Telomere
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'Telomere'
    dtSettings2.description = 'Telomere length over time'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Telomere#Shortening'
    dtSettings2.rdf = 'https://dbpedia.org/page/Telomere#Shortening'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    // Epigenetics
    const refContract3 = {}
    refContract3.type = 'library'
    refContract3.action = 'contracts'
    refContract3.reftype = 'datatype'
    refContract3.task = 'PUT'
    refContract3.privacy = 'public'
    let dtSettings3 = {}
    dtSettings3.primary = true
    dtSettings3.name = 'Epigenetics'
    dtSettings3.description = 'Epigenetics changes with time'
    dtSettings3.wiki = 'https://en.wikipedia.org/wiki/Epigenetics'
    dtSettings3.rdf = 'https://dbpedia.org/page/Epigenetics'
    dtSettings3.measurement = 'Integer'
    dtSettings3.datatypeType = 'datatype'
    refContract3.data = dtSettings3
    gaiaJack.push(refContract3)

    // Proteostasis
    const refContract4 = {}
    refContract4.type = 'library'
    refContract4.action = 'contracts'
    refContract4.reftype = 'datatype'
    refContract4.task = 'PUT'
    refContract4.privacy = 'public'
    let dtSettings4 = {}
    dtSettings4.primary = true
    dtSettings4.name = 'Proteostasis'
    dtSettings4.description = 'Proteostasis changes with time'
    dtSettings4.wiki = 'https://en.wikipedia.org/wiki/Proteostasis#Proteostasis_and_aging'
    dtSettings4.rdf = 'https://dbpedia.org/page/Proteostasis#Proteostasis_and_aging'
    dtSettings4.measurement = 'Integer'
    dtSettings4.datatypeType = 'datatype'
    refContract4.data = dtSettings4
    gaiaJack.push(refContract4)

    // Nutrient sensing
    const refContract5 = {}
    refContract5.type = 'library'
    refContract5.action = 'contracts'
    refContract5.reftype = 'datatype'
    refContract5.task = 'PUT'
    refContract5.privacy = 'public'
    let dtSettings5 = {}
    dtSettings5.primary = true
    dtSettings5.name = 'Nutrient sensing'
    dtSettings5.description = 'Nutrient sensing changes with time'
    dtSettings5.wiki = 'https://en.wikipedia.org/wiki/Nutrient_sensing'
    dtSettings5.rdf = 'https://dbpedia.org/page/Nutrient_sensing'
    dtSettings5.measurement = 'Integer'
    dtSettings5.datatypeType = 'datatype'
    refContract5.data = dtSettings5
    gaiaJack.push(refContract5)

    // Mitochondrion
    const refContract6 = {}
    refContract6.type = 'library'
    refContract6.action = 'contracts'
    refContract6.reftype = 'datatype'
    refContract6.task = 'PUT'
    refContract6.privacy = 'public'
    let dtSettings6 = {}
    dtSettings6.primary = true
    dtSettings6.name = 'Mitochondrion'
    dtSettings6.description = 'Mitochondrion changes with time'
    dtSettings6.wiki = 'https://en.wikipedia.org/wiki/Mitochondrion#Relationships_to_aging'
    dtSettings6.rdf = 'https://dbpedia.org/page/Mitochondrion#Relationships_to_aging'
    dtSettings6.measurement = 'Integer'
    dtSettings6.datatypeType = 'datatype'
    refContract6.data = dtSettings6
    gaiaJack.push(refContract6)

    // Cellular senescence
    const refContract7 = {}
    refContract7.type = 'library'
    refContract7.action = 'contracts'
    refContract7.reftype = 'datatype'
    refContract7.task = 'PUT'
    refContract7.privacy = 'public'
    let dtSettings7 = {}
    dtSettings7.primary = true
    dtSettings7.name = 'Cellular senescence'
    dtSettings7.description = 'Cellular senescence changes with time'
    dtSettings7.wiki = 'https://en.wikipedia.org/wiki/Cellular_senescence'
    dtSettings7.rdf = 'https://dbpedia.org/page/Cellular_senescence'
    dtSettings7.measurement = 'Integer'
    dtSettings7.datatypeType = 'datatype'
    refContract7.data = dtSettings7
    gaiaJack.push(refContract7)

    // Stem cell exhaustion
    const refContract8 = {}
    refContract8.type = 'library'
    refContract8.action = 'contracts'
    refContract8.reftype = 'datatype'
    refContract8.task = 'PUT'
    refContract8.privacy = 'public'
    let dtSettings8 = {}
    dtSettings8.primary = true
    dtSettings8.name = 'Stem cell exhaustion'
    dtSettings8.description = 'Stem cell exhaustion changes with time'
    dtSettings8.wiki = 'https://en.wikipedia.org/wiki/Stem_cell'
    dtSettings8.rdf = 'https://dbpedia.org/page/Stem_cell'
    dtSettings8.measurement = 'Integer'
    dtSettings8.datatypeType = 'datatype'
    refContract8.data = dtSettings8
    gaiaJack.push(refContract8)

    // Inter-cellular communication
    const refContract9 = {}
    refContract9.type = 'library'
    refContract9.action = 'contracts'
    refContract9.reftype = 'datatype'
    refContract9.task = 'PUT'
    refContract9.privacy = 'public'
    let dtSettings9 = {}
    dtSettings9.primary = true
    dtSettings9.name = 'Inter-cellular communication'
    dtSettings9.description = 'Inter-cellular communication changes with time'
    dtSettings9.wiki = 'https://en.wikipedia.org/wiki/Cell_signaling'
    dtSettings9.rdf = 'https://dbpedia.org/page/Cell_signaling'
    dtSettings9.measurement = 'Integer'
    dtSettings9.datatypeType = 'datatype'
    refContract9.data = dtSettings9
    gaiaJack.push(refContract9)

    return gaiaJack
  }

  /**
   * prepare save contract message for life
   * @method prepareDTlifeMessage
   * @returns {Array} List of life datatype contracts
   */
  prepareDTlifeMessage = function () {
    let gaiaJack = []
    // food
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary = true
    dtSettings.name = 'food'
    dtSettings.description = 'eating of nutritious plants and animals'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Food'
    dtSettings.rdf = 'https://dbpedia.org/page/Food'
    dtSettings.measurement = 'Integer'
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)

    // movement
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary = true
    dtSettings1.name = 'movement'
    dtSettings1.description = 'movement of body'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Physical_activity'
    dtSettings1.rdf = 'https://dbpedia.org/page/Physical_activity'
    dtSettings1.measurement = 'Integer'
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)

    // mind
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary = true
    dtSettings2.name = 'mind'
    dtSettings2.description = 'thinking, feeling and sleeping'
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Mind'
    dtSettings2.rdf = 'https://dbpedia.org/page/Mind'
    dtSettings2.measurement = 'Integer'
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)

    return gaiaJack
  }
}

export default Body
