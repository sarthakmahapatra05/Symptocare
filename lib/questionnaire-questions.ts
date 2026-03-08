/**
 * Predefined questionnaire questions for different medical conditions
 */

export interface Question {
  id: number
  text: string
  answer: string
}

export const conditionQuestions: Record<string, Question[]> = {
  diabetes: [
    { id: 1, text: "Do you experience excessive thirst?", answer: "" },
    { id: 2, text: "Do you urinate more frequently than usual?", answer: "" },
    { id: 3, text: "Have you experienced unexplained weight loss?", answer: "" },
    { id: 4, text: "Do you feel constantly tired or fatigued?", answer: "" },
    { id: 5, text: "Have you noticed blurred vision?", answer: "" },
    { id: 6, text: "Do wounds or cuts heal slowly?", answer: "" },
    { id: 7, text: "Do you experience frequent infections?", answer: "" },
    { id: 8, text: "Have you noticed tingling or numbness in your hands or feet?", answer: "" },
    { id: 9, text: "Do you have a family history of diabetes?", answer: "" },
    { id: 10, text: "Have you experienced increased hunger even after eating?", answer: "" }
  ],
  hypertension: [
    { id: 1, text: "Do you experience frequent headaches?", answer: "" },
    { id: 2, text: "Do you feel dizzy or lightheaded?", answer: "" },
    { id: 3, text: "Have you experienced chest pain or tightness?", answer: "" },
    { id: 4, text: "Do you have shortness of breath?", answer: "" },
    { id: 5, text: "Have you noticed vision problems?", answer: "" },
    { id: 6, text: "Do you experience nosebleeds?", answer: "" },
    { id: 7, text: "Do you have a family history of high blood pressure?", answer: "" },
    { id: 8, text: "Do you consume a high-salt diet?", answer: "" },
    { id: 9, text: "Do you experience irregular heartbeat?", answer: "" },
    { id: 10, text: "Have you been under significant stress recently?", answer: "" }
  ],
  asthma: [
    { id: 1, text: "Do you experience wheezing when breathing?", answer: "" },
    { id: 2, text: "Do you have shortness of breath?", answer: "" },
    { id: 3, text: "Do you feel tightness in your chest?", answer: "" },
    { id: 4, text: "Do you have a persistent cough, especially at night?", answer: "" },
    { id: 5, text: "Do symptoms worsen during exercise or physical activity?", answer: "" },
    { id: 6, text: "Do you have a family history of asthma or allergies?", answer: "" },
    { id: 7, text: "Do symptoms worsen in certain environments (dust, pollen, etc.)?", answer: "" },
    { id: 8, text: "Have you experienced asthma attacks in the past?", answer: "" },
    { id: 9, text: "Do you use any inhalers or breathing medications?", answer: "" },
    { id: 10, text: "Do symptoms interfere with your daily activities?", answer: "" }
  ],
  "common-cold": [
    { id: 1, text: "Do you have a runny or stuffy nose?", answer: "" },
    { id: 2, text: "Are you sneezing frequently?", answer: "" },
    { id: 3, text: "Do you have a sore throat?", answer: "" },
    { id: 4, text: "Do you have a cough?", answer: "" },
    { id: 5, text: "Do you have a mild fever?", answer: "" },
    { id: 6, text: "Do you feel generally unwell or fatigued?", answer: "" },
    { id: 7, text: "Have symptoms lasted less than 2 weeks?", answer: "" },
    { id: 8, text: "Do you have body aches or headaches?", answer: "" },
    { id: 9, text: "Have you been in contact with someone who has a cold?", answer: "" },
    { id: 10, text: "Are symptoms mild and manageable?", answer: "" }
  ],
  migraine: [
    { id: 1, text: "Do you experience severe, throbbing headaches?", answer: "" },
    { id: 2, text: "Do you have sensitivity to light during headaches?", answer: "" },
    { id: 3, text: "Do you have sensitivity to sound during headaches?", answer: "" },
    { id: 4, text: "Do you experience nausea or vomiting with headaches?", answer: "" },
    { id: 5, text: "Do headaches affect one side of your head?", answer: "" },
    { id: 6, text: "Do you experience visual disturbances (aura) before headaches?", answer: "" },
    { id: 7, text: "Do headaches last for several hours or days?", answer: "" },
    { id: 8, text: "Do headaches worsen with physical activity?", answer: "" },
    { id: 9, text: "Do you have a family history of migraines?", answer: "" },
    { id: 10, text: "Do headaches interfere with your daily activities?", answer: "" }
  ],
  anemia: [
    { id: 1, text: "Do you feel constantly tired or fatigued?", answer: "" },
    { id: 2, text: "Do you experience weakness?", answer: "" },
    { id: 3, text: "Do you have pale or yellowish skin?", answer: "" },
    { id: 4, text: "Do you experience shortness of breath?", answer: "" },
    { id: 5, text: "Do you feel dizzy or lightheaded?", answer: "" },
    { id: 6, text: "Do you have cold hands and feet?", answer: "" },
    { id: 7, text: "Do you have an irregular heartbeat?", answer: "" },
    { id: 8, text: "Do you experience chest pain?", answer: "" },
    { id: 9, text: "Have you noticed changes in your hair or nails?", answer: "" },
    { id: 10, text: "Do you have heavy menstrual periods (if applicable)?", answer: "" }
  ],
  allergy: [
    { id: 1, text: "Do you experience sneezing frequently?", answer: "" },
    { id: 2, text: "Do you have a runny or stuffy nose?", answer: "" },
    { id: 3, text: "Do your eyes itch or water?", answer: "" },
    { id: 4, text: "Do you have skin rashes or hives?", answer: "" },
    { id: 5, text: "Do symptoms occur in specific seasons or environments?", answer: "" },
    { id: 6, text: "Do you have a family history of allergies?", answer: "" },
    { id: 7, text: "Do symptoms worsen around pets, pollen, or dust?", answer: "" },
    { id: 8, text: "Do you experience swelling of the face or throat?", answer: "" },
    { id: 9, text: "Do you have food allergies?", answer: "" },
    { id: 10, text: "Do symptoms respond to antihistamines?", answer: "" }
  ],
  bronchitis: [
    { id: 1, text: "Do you have a persistent cough?", answer: "" },
    { id: 2, text: "Do you produce mucus or phlegm when coughing?", answer: "" },
    { id: 3, text: "Do you feel fatigued?", answer: "" },
    { id: 4, text: "Do you experience shortness of breath?", answer: "" },
    { id: 5, text: "Do you have chest discomfort or tightness?", answer: "" },
    { id: 6, text: "Do you have a low-grade fever?", answer: "" },
    { id: 7, text: "Have symptoms lasted for more than a week?", answer: "" },
    { id: 8, text: "Do you have a history of smoking or exposure to irritants?", answer: "" },
    { id: 9, text: "Do symptoms worsen in the morning?", answer: "" },
    { id: 10, text: "Do you experience wheezing?", answer: "" }
  ],
  flu: [
    { id: 1, text: "Do you have a fever (above 100.4°F)?", answer: "" },
    { id: 2, text: "Do you experience chills?", answer: "" },
    { id: 3, text: "Do you have muscle aches or body pain?", answer: "" },
    { id: 4, text: "Do you feel extremely fatigued?", answer: "" },
    { id: 5, text: "Do you have a cough?", answer: "" },
    { id: 6, text: "Do you have a sore throat?", answer: "" },
    { id: 7, text: "Do you have a headache?", answer: "" },
    { id: 8, text: "Have you been in contact with someone who has the flu?", answer: "" },
    { id: 9, text: "Did symptoms come on suddenly?", answer: "" },
    { id: 10, text: "Do you have nasal congestion or runny nose?", answer: "" }
  ],
  gastroenteritis: [
    { id: 1, text: "Do you experience nausea?", answer: "" },
    { id: 2, text: "Have you been vomiting?", answer: "" },
    { id: 3, text: "Do you have diarrhea?", answer: "" },
    { id: 4, text: "Do you have stomach pain or cramps?", answer: "" },
    { id: 5, text: "Do you have a low-grade fever?", answer: "" },
    { id: 6, text: "Have you been exposed to contaminated food or water?", answer: "" },
    { id: 7, text: "Have symptoms lasted less than a week?", answer: "" },
    { id: 8, text: "Do you feel dehydrated?", answer: "" },
    { id: 9, text: "Have you been in contact with someone with similar symptoms?", answer: "" },
    { id: 10, text: "Do you have loss of appetite?", answer: "" }
  ]
}

export function getQuestionsForCondition(condition: string): Question[] {
  const normalizedCondition = condition.toLowerCase().replace(/\s+/g, "-")
  return conditionQuestions[normalizedCondition] || [
    { id: 1, text: "Please describe your symptoms in detail.", answer: "" },
    { id: 2, text: "When did these symptoms first appear?", answer: "" },
    { id: 3, text: "Have these symptoms worsened over time?", answer: "" },
    { id: 4, text: "Do you have any existing medical conditions?", answer: "" },
    { id: 5, text: "Are you currently taking any medications?", answer: "" },
    { id: 6, text: "Do you have a family history of this condition?", answer: "" },
    { id: 7, text: "Have you experienced similar symptoms before?", answer: "" },
    { id: 8, text: "Do symptoms interfere with your daily activities?", answer: "" },
    { id: 9, text: "Have you tried any treatments or medications?", answer: "" },
    { id: 10, text: "Is there anything else you'd like to mention?", answer: "" }
  ]
}

