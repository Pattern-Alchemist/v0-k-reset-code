// config/questions.ts
export const questions = [
  { 
    id: "discipline", 
    question: "How consistent are you with routines?",
    options: [
      { value: 1, label: "Rarely follow routines" },
      { value: 2, label: "Sometimes consistent" },
      { value: 3, label: "Usually consistent" },
      { value: 4, label: "Always disciplined" },
    ]
  },
  { 
    id: "pressure", 
    question: "How do you handle stress?",
    options: [
      { value: 1, label: "Overwhelmed easily" },
      { value: 2, label: "Struggle but manage" },
      { value: 3, label: "Handle well most times" },
      { value: 4, label: "Thrive under pressure" },
    ]
  },
  { 
    id: "recovery", 
    question: "How fast do you recover from setbacks?",
    options: [
      { value: 1, label: "Take a long time" },
      { value: 2, label: "Gradual recovery" },
      { value: 3, label: "Bounce back quickly" },
      { value: 4, label: "Immediate recovery" },
    ]
  },
  { 
    id: "consistency", 
    question: "How stable is your daily focus?",
    options: [
      { value: 1, label: "Easily distracted" },
      { value: 2, label: "Inconsistent focus" },
      { value: 3, label: "Mostly focused" },
      { value: 4, label: "Laser-sharp focus" },
    ]
  },
];
