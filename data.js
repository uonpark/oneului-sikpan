// 출처
// - 음식 영양값: 식품의약품안전처 K-FIND 식품영양성분 데이터베이스 (2026-11-05 조회)
// - 섭취기준: 2025 한국인 영양소 섭취기준 요약표 (보건복지부, 2025)

// per100: 100g(또는 100mL)당 값. 단위: kcal, g, g, g, mg, mg
// serving: 1국자 분량(g 또는 mL)
// servingSource: 분량의 근거. "확인 필요"는 공식 자료로 아직 확인하지 못한 값입니다.
const foodSources = [
  {
    id: "rice", name: "쌀밥", icon: "🍚", code: "D601-022000000-0001", serving: 210,
    servingSource: "한국영양학회 1인 1회 분량(밥 1공기)",
    per100: { energy: 120, carb: 25.79, protein: 2.2, fat: 0.34, calcium: 2, vitaminC: 0 },
  },
  {
    id: "seaweed-soup", name: "미역국", icon: "🍲", code: "D605-223000000-0001", serving: 122,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 7, carb: 0.88, protein: 0.8, fat: 0.33, calcium: 31, vitaminC: 0.4 },
  },
  {
    id: "kimchi", name: "배추김치", icon: "🌶️", code: "R121-006060000-0000", serving: 40,
    servingSource: "확인 필요",
    per100: { energy: 38, carb: 6.49, protein: 1.98, fat: 0.43, calcium: 43, vitaminC: 3.59 },
  },
  {
    id: "bulgogi", name: "소불고기", icon: "🥩", code: "D608-386000000-0001", serving: 73.4,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 289, carb: 4.8, protein: 13.4, fat: 22.87, calcium: 14, vitaminC: 1.67 },
  },
  {
    id: "spinach", name: "시금치나물", icon: "🥬", code: "D613-586000000-0001", serving: 60,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 27, carb: 3.11, protein: 1.6, fat: 1.28, calcium: 28, vitaminC: 23.21 },
  },
  {
    id: "mackerel", name: "고등어구이", icon: "🐟", code: "D608-357000000-0001", serving: 90,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 176, carb: 3.9, protein: 12.28, fat: 11.84, calcium: 18, vitaminC: 1.74 },
  },
  {
    id: "apple", name: "사과", icon: "🍎", code: "R108-050000001-0000", serving: 100,
    servingSource: "확인 필요",
    per100: { energy: 52, carb: 13.96, protein: 0.26, fat: 0.07, calcium: 3, vitaminC: 2.03 },
  },
  {
    id: "milk", name: "우유", icon: "🥛", code: "R113-009000000-0000", serving: 200,
    servingSource: "확인 필요",
    per100: { energy: 67, carb: 4.86, protein: 3.09, fat: 3.85, calcium: 118, vitaminC: 0.79 },
  },
];

// 1국자에 들어 있는 영양소 = 100g당 값 × 분량 ÷ 100
const foods = foodSources.map((food) => {
  const perScoop = {};
  for (const [key, value] of Object.entries(food.per100)) {
    perScoop[key] = (value * food.serving) / 100;
  }
  return { ...food, ...perScoop };
});

// 2025 한국인 영양소 섭취기준, 12-14세 (에너지는 필요추정량, 나머지는 권장섭취량)
const dailyReference = {
  male: { energy: 2500, protein: 60, calcium: 950, vitaminC: 90 },
  female: { energy: 2000, protein: 55, calcium: 850, vitaminC: 90 },
};

// 에너지 비율(%). 2025 기준의 적정 범위(탄수화물 50-65, 단백질 10-20, 지방 15-30) 안에서
// 탄수화물과 단백질은 범위의 가운데 값, 지방은 합계가 100이 되는 값입니다.
const idealRatio = { carb: 57.5, protein: 15, fat: 27.5 };

// 한 끼 기준: 남녀 평균의 3분의 1
const MEALS_PER_DAY = 3;
const dailyAverage = (key) => (dailyReference.male[key] + dailyReference.female[key]) / 2;
const mealEnergy = dailyAverage("energy") / MEALS_PER_DAY;

const mealTarget = {
  energy: mealEnergy,
  carb: (mealEnergy * idealRatio.carb) / 100 / 4, // 탄수화물 1g = 4kcal
  protein: dailyAverage("protein") / MEALS_PER_DAY,
  fat: (mealEnergy * idealRatio.fat) / 100 / 9, // 지방 1g = 9kcal
  calcium: dailyAverage("calcium") / MEALS_PER_DAY,
  vitaminC: dailyAverage("vitaminC") / MEALS_PER_DAY,
};

// 예측 화면의 보기. key의 영양소로 부족한 정도를 계산합니다.
const nutrientChoices = [
  { id: "carb", label: "탄수화물", key: "carb", hint: "밥이나 과일을 더 담아 볼까?" },
  { id: "protein", label: "단백질", key: "protein", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "fat", label: "지방", key: "fat", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "mineral", label: "무기질", key: "calcium", hint: "우유나 나물을 더 담아 볼까?" },
  { id: "vitamin", label: "비타민", key: "vitaminC", hint: "채소나 과일을 더 담아 볼까?" },
];
