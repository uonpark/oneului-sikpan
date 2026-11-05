// ⚠️ 임시값입니다. 게임 동작을 확인하기 위한 값이라 수업에 쓰기 전에 교체해야 합니다.
// - foods: 식약처 식품영양성분 데이터베이스 값으로 교체
// - mealTarget, idealRatio: 2025 한국인 영양소 섭취기준의 중학생 연령대 값으로 교체

// 1국자(1회 분량) 기준. 단위: kcal, g, g, g, mg, mg
const foods = [
  { id: "rice", name: "쌀밥", icon: "🍚", energy: 300, carb: 65, protein: 5, fat: 0.5, calcium: 5, vitaminC: 0 },
  { id: "seaweed-soup", name: "미역국", icon: "🍲", energy: 40, carb: 3, protein: 3, fat: 2, calcium: 40, vitaminC: 1 },
  { id: "kimchi", name: "김치", icon: "🌶️", energy: 15, carb: 3, protein: 1, fat: 0.3, calcium: 20, vitaminC: 5 },
  { id: "bulgogi", name: "불고기", icon: "🥩", energy: 220, carb: 10, protein: 15, fat: 13, calcium: 15, vitaminC: 1 },
  { id: "spinach", name: "시금치나물", icon: "🥬", energy: 40, carb: 4, protein: 3, fat: 2, calcium: 60, vitaminC: 15 },
  { id: "mackerel", name: "고등어구이", icon: "🐟", energy: 200, carb: 0, protein: 20, fat: 13, calcium: 20, vitaminC: 0 },
  { id: "apple", name: "사과", icon: "🍎", energy: 60, carb: 15, protein: 0.3, fat: 0.2, calcium: 5, vitaminC: 4 },
  { id: "milk", name: "우유", icon: "🥛", energy: 125, carb: 10, protein: 6, fat: 7, calcium: 210, vitaminC: 1 },
];

// 한 끼 기준 (하루 기준의 3분의 1)
const mealTarget = { energy: 730, carb: 100, protein: 20, fat: 20, calcium: 300, vitaminC: 33 };

// 에너지 비율(%)
const idealRatio = { carb: 57.5, protein: 15, fat: 27.5 };

// 예측 화면의 보기. keys의 영양소로 부족한 정도를 계산합니다.
const nutrientChoices = [
  { id: "carb", label: "탄수화물", key: "carb", hint: "밥이나 과일을 더 담아 볼까?" },
  { id: "protein", label: "단백질", key: "protein", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "fat", label: "지방", key: "fat", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "mineral", label: "무기질", key: "calcium", hint: "우유나 나물을 더 담아 볼까?" },
  { id: "vitamin", label: "비타민", key: "vitaminC", hint: "채소나 과일을 더 담아 볼까?" },
];
