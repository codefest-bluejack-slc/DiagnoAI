interface FuzzysortOptions {
  keys?: string[];
  threshold?: number;
}

interface FuzzysortResult {
  score: number;
  obj: any;
}

const fuzzysort = (function() {
  'use strict'

  const fuzzysort = {
    go: (search: string, targets: any[], options?: FuzzysortOptions): FuzzysortResult[] => {
      if (!search) return targets ? targets.map(t => ({obj: t, score: 0})) : []
      
      const searchLower = search.toLowerCase()
      const searchLen = search.length

      const searchResults = []

      const keys = options && options.keys
      const threshold = (options && options.threshold) || -10000

      for (let i = 0; i < targets.length; i++) {
        const obj = targets[i]
        let targetStrs = []
        if(keys) {
          for(let j = 0; j < keys.length; j++) {
            const key = keys[j]
            const value = obj[key]
            if(value != null) targetStrs.push(String(value))
          }
        } else {
          targetStrs.push(String(obj))
        }

        if(targetStrs.length === 0) continue

        let bestScore = -Infinity

        for(let j = 0; j < targetStrs.length; j++) {
          const target = targetStrs[j]
          const targetLower = target.toLowerCase()
          const targetLen = target.length
          
          let score = 0
          let searchI = 0
          let targetI = 0
          let consecutiveMatch = 0

          while (searchI < searchLen && targetI < targetLen) {
            if (searchLower[searchI] === targetLower[targetI]) {
              score += 100 + consecutiveMatch * 20
              consecutiveMatch++
              searchI++
            } else {
              score -= 10
              consecutiveMatch = 0
            }
            targetI++
          }

          if (searchI === searchLen) {
            score -= (targetLen - targetI) * 5
            if (score > bestScore) {
              bestScore = score
            }
          }
        }
        
        if (bestScore > threshold) {
          searchResults.push({score: bestScore, obj: obj})
        }
      }

      searchResults.sort((a, b) => b.score - a.score)
      return searchResults
    }
  }

  return fuzzysort
})();


const symptoms = [
  'Abdominal or back pain',
  'Abdominal or flank pain', 
  'Abdominal pain',
  'Abdominal pain (often in the upper right quadrant)',
  'Abdominal pain or discomfort',
  'Abnormal positioning of the urethral opening on the underside of the penis',
  'Abnormal vaginal bleeding',
  'Abnormal vaginal bleeding outside of the menstrual period',
  'Absence or undescended testicle(s)',
  'Altered perception of reality',
  'Anxiety',
  'Avoidance or restriction of certain foods or entire food groups',
  'Benign tumors in various organs',
  'Blood in urine',
  'Blurred distance vision',
  'Blurred or distorted central vision',
  'Blurred or distorted vision',
  'Blurred or hazy vision',
  'Blurred vision',
  'Bone pain',
  'Breast lump',
  'Bruising',
  'Challenges with social interaction',
  'Chest or back pain',
  'Chest pain',
  'Chest pain (sharp and stabbing)',
  'Chest pain (sharp or dull)',
  'Chest pain or discomfort (angina)',
  'Cholecystectomy',
  'Chronic back pain and stiffness',
  'Chronic constipation',
  'Chronic diarrhea',
  'Cloudy or hazy eyes',
  'Compulsive use of opioids',
  'Confusion',
  'Cough',
  'Cough with phlegm or pus',
  'Cravings for alcohol',
  'Curvature of the penis',
  'Decreased urine output',
  'Deformity',
  'Dehydration',
  'Depends on the specific cranial nerve involved; symptoms can include vision changes',
  'Developmental delays',
  'Difficulty',
  'Difficulty breathing',
  'Difficulty falling asleep or staying asleep',
  'Difficulty moving',
  'Difficulty or poor urinary stream',
  'Difficulty seeing objects up close',
  'Difficulty swallowing',
  'Dizziness',
  'Double vision',
  'Drowsiness',
  'Dry',
  'Dry mouth and eyes',
  'Ear pain',
  'Ear pain (particularly behind the ear)',
  'Easy bruising',
  'Easy or excessive bruising',
  'Elevated intraocular pressure',
  'Elevated intraocular pressure without optic nerve damage',
  'Elevated levels of gamma globulins in the blood',
  'Enlarged',
  'Enlarged thyroid gland in the neck',
  'Euphoria',
  'Excessive bleeding and bruising',
  'Excessive body weight',
  'Excessive daytime sleepiness',
  'Excessive hair growth in women',
  'Excessive sweating (beyond what is necessary for temperature regulation)',
  'Excessive tearing',
  'Excessive worrying',
  'Excessively concentrated urine',
  'Extreme fatigue',
  'Extreme weight loss',
  'Eye fatigue',
  'Eye pain',
  'Eye redness',
  'Facial changes',
  'Facial numbness',
  'Facial pain or pressure',
  'Facial paralysis',
  'Facial weakness',
  'Facial weakness or paralysis',
  'Fatigue',
  'Fear of losing control',
  'Fever',
  'Flank pain',
  'Floaters (spots or cobweb-like shapes in vision)',
  'Floaters in vision',
  'Flu-like symptoms (fever',
  'Foot pain or achiness',
  'Fragile bones',
  'Frequent episodes of stone formation',
  'Frequent or constant dribbling of urine',
  'Frequent urinary tract infections',
  'Frequent urination',
  'Fussiness',
  'Gait disturbances',
  'General malaise',
  'Gonadal dysgenesis',
  'Gradual hearing loss',
  'Gradual loss of peripheral vision',
  'Gradual loss of vision',
  'Gradual vision loss',
  'Growth deficiencies',
  'Growth on the conjunctiva (white part of the eye)',
  'Hair loss or balding',
  'Head tilting',
  'Headache',
  'Headaches',
  'Hearing loss (gradual and progressive)',
  'Heartburn',
  'Heavy or prolonged menstrual periods',
  'Heel pain',
  'Hemangioblastomas (tumors in the brain',
  'High blood pressure',
  'High blood pressure during pregnancy',
  'High blood pressure without proteinuria (preeclampsia)',
  'High blood sugar levels during pregnancy',
  'High fever',
  'High levels of cholesterol in the blood',
  'Hoarseness',
  'Hypocalcemia (low calcium levels)',
  'Impaired memory and cognition',
  'Impulsive behaviors (e.g.',
  'Inability to conceive after one year of unprotected intercourse',
  'Inattention',
  'Increased appetite',
  'Increased blood sugar levels',
  'Increased energy and alertness',
  'Increased hunger',
  'Increased red blood cell count',
  'Increased thirst',
  'Inflammation of blood vessels leading to various symptoms depending on the affected organs',
  'Inflammation of the glans penis (tip of the penis)',
  'Intense burning pain',
  'Intense itching',
  'Intense joint pain',
  'Irregular or rapid heartbeat',
  'Irregular periods',
  'Itching and irritation in the vagina and vulva',
  'Itching and visible presence of lice or nits (eggs) in the hair',
  'Itching around the anus or vagina',
  'Itchy',
  'Itchy skin',
  'Jaw pain or tenderness',
  'Joint pain',
  'Joint swelling',
  'Knee pain',
  'Lack of menstrual periods',
  'Localized muscle pain',
  'Loss of function',
  'Low blood sugar (hypoglycemia) symptoms (e.g.',
  'Lower abdominal pain and discomfort occurring around the time of ovulation',
  'Lower back pain',
  'Lump',
  'Lump or swelling in the testicles',
  'Lymph node enlargement',
  'Lymphedema',
  'Metabolic acidosis',
  'Mild to moderate head pain',
  'Mood swings',
  'Most colonic polyps do not cause symptoms. Some larger polyps or certain types may cause rectal bleeding or changes in bowel habits',
  'Motor',
  'Muscle pain and stiffness',
  'Muscle stiffness',
  'Muscle twitches or cramps',
  'Muscle wasting',
  'Muscle weakness',
  'Muscle weakness or fatigue',
  'Nasal congestion',
  'Nausea',
  'Neck or back pain',
  'Neck pain',
  'Neurological symptoms that cannot be explained by a medical condition or injury',
  'Night blindness',
  'Numbness or tingling in fingers or around the mouth',
  'Obsessive focus on "clean" eating',
  'Optic neuritis (vision loss',
  'Pain',
  'Pain during bowel movements',
  'Pain or discomfort in the tailbone area',
  'Pain or tenderness on the outer side of the elbow',
  'Pain radiating from the lower back to the leg',
  'Painful',
  'Painful blisters on the skin and mucous membranes',
  'Painful intercourse',
  'Painful lump or swelling on the eyelid',
  'Painful ulcers or sores on the genital area',
  'Painful urination',
  'Painless fluid-filled swelling in the oral cavity',
  'Painless lump or swelling',
  'Painless swelling',
  'Palpable mass',
  'Palpitations',
  'Pelvic pain',
  'Pelvic pain (during menstruation',
  'Pelvic pressure or heaviness',
  'Persistent',
  'Persistent consumption of non-food substances',
  'Persistent cough with thick mucus',
  'Persistent cough with yellow or green mucus',
  'Persistent depressive symptoms (low mood',
  'Persistent feelings of sadness',
  'Persistent head pain',
  'Persistent hunger',
  'Persistent knee pain',
  'Persistent pain or discomfort in the vulva',
  'Persistent sore throat',
  'Poor depth perception',
  'Primary stage: painless sores (chancre) at the site of infection',
  'Progressive muscle weakness and degeneration',
  'Raised',
  'Rash',
  "Raynaud's phenomenon",
  'Recurrent',
  'Recurrent episodes of binge eating followed by purging behaviors',
  'Recurrent episodes of binge eating without compensatory behaviors',
  'Recurrent episodes of wheezing',
  'Red',
  'Redness',
  'Reduced hearing sensitivity',
  'Repeated regurgitation and re-chewing of food',
  'Respiratory distress',
  'Rough',
  'Sedation',
  'Sensation of a foreign object stuck in the throat',
  'Severe abdominal or back pain',
  'Severe abdominal pain',
  'Severe and chronic pain',
  'Severe and persistent pain',
  'Severe eye pain',
  'Severe headache',
  'Severe headaches',
  'Severe kidney damage',
  'Severe nausea and vomiting during pregnancy',
  'Severe neck pain',
  'Severe pain',
  'Severe pain in the side or back',
  'Severe sore throat',
  'Severe swelling of the floor of the mouth',
  'Severe upper abdominal pain',
  'Shaking',
  'Sharp',
  'Sharp or aching pain in the lower abdomen or groin',
  'Sharp pain',
  'Shooting or burning pain',
  'Short stature',
  'Shortness of breath',
  'Shoulder pain',
  'Skin changes',
  'Skin sores',
  'Skipped or extra heartbeats',
  'Slow healing of wounds',
  'Slurred speech',
  'Small',
  'Small lump or swelling in the vaginal wall',
  'Sore throat',
  'Sudden',
  'Sudden and severe abdominal or pelvic pain on one side',
  'Sudden numbness or weakness of the face',
  'Sudden onset of neurological symptoms that resolve within 24 hours',
  'Sunburn-like rash',
  'Surgical site pain',
  'Sweating',
  'Swelling',
  'Swelling in arms or legs',
  'Swelling of the scrotum',
  'Swollen',
  'Swollen blood vessels in the esophagus',
  'Swollen lymph nodes',
  'Swollen salivary glands (usually parotid)',
  'Symptoms that do not meet the full criteria for a specific eating disorder',
  'Thickening of the skin',
  'Tingling',
  'Toothache',
  'Trembling',
  'Tremors',
  'Uncomfortable sensation in the legs',
  'Unintentional urine leakage during physical activity',
  'Vaginal bleeding',
  'Vaginal burning',
  'Vaginal dryness',
  'Varies depending on the underlying cause',
  'Various symptoms depending on the specific disorder',
  'Vertigo',
  'Visible bulge or swelling',
  'Visible peristalsis',
  'Vision loss or blurry vision',
  'Vocal Changes',
  'Vocal Fatigue',
  'Weakness',
  'Webbed neck',
  'Weight loss',
  'Wheezing',
  'White patches or plaques in the mouth',
  'Widespread musculoskeletal pain',
  'Yellowing of the skin and eyes',
  "Yellowish or white growth on the conjunctiva (eye's surface)"
];

export const useTemplateSymptoms = () => {
  const searchSymptoms = (query: string): string[] => {
    if (!query) {
      return symptoms;
    }
    const results = fuzzysort.go(query, symptoms);
    return results.map(result => result.obj);
  };

  const findBestMatch = (query: string): string | null => {
    if (!query || query.trim().length < 2) {
      return null;
    }
    const results = fuzzysort.go(query.trim(), symptoms);
    if (results.length > 0 && results[0].score > -3000) {
      return results[0].obj;
    }
    return null;
  };

  const findBestMatches = (queries: string[]): string[] => {
    const matches: string[] = [];
    const usedMatches = new Set<string>();
    
    for (const query of queries) {
      const bestMatch = findBestMatch(query);
      if (bestMatch && !usedMatches.has(bestMatch)) {
        matches.push(bestMatch);
        usedMatches.add(bestMatch);
      }
    }
    
    return matches;
  };

  return {
    symptoms,
    searchSymptoms,
    findBestMatch,
    findBestMatches
  };
};