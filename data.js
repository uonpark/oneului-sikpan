// 출처
// - 음식 영양값: 식품의약품안전처 K-FIND 식품영양성분 데이터베이스 (2026-11-05, 2026-11-11 조회)
// - 섭취기준: 2025 한국인 영양소 섭취기준 요약표 (보건복지부, 2025)

// per100: 100g(또는 100mL)당 값. 단위: kcal, g, g, g, mg, mg
// serving: 1국자 분량(g 또는 mL)
// servingSource: 분량의 근거. "확인 필요"는 공식 자료로 아직 확인하지 못한 값입니다.
const foodSources = [
  {
    id: "rice", name: "쌀밥", code: "D601-022000000-0001", serving: 210,
    servingSource: "한국영양학회 1인 1회 분량(밥 1공기)",
    per100: { energy: 120, carb: 25.79, protein: 2.2, fat: 0.34, calcium: 2, vitaminC: 0 },
  },
  {
    id: "brown-rice", name: "현미밥", code: "D601-050000000-0001", serving: 210,
    servingSource: "쌀밥과 같은 1공기로 정함 (K-FIND 총 내용량은 290mL)",
    per100: { energy: 118, carb: 25.4, protein: 2.2, fat: 0.36, calcium: 2, vitaminC: 0 },
  },
  {
    id: "seaweed-soup", name: "미역국", code: "D605-223000000-0001", serving: 122,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 7, carb: 0.88, protein: 0.8, fat: 0.33, calcium: 31, vitaminC: 0.4 },
  },
  {
    id: "radish-soup", name: "무 된장국", code: "D605-285000000-0001", serving: 198.2,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 18, carb: 2.11, protein: 1.6, fat: 0.41, calcium: 37, vitaminC: 1.99 },
  },
  {
    id: "bulgogi", name: "소불고기", code: "D608-386000000-0001", serving: 73.4,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 289, carb: 4.8, protein: 13.4, fat: 22.87, calcium: 14, vitaminC: 1.67 },
  },
  {
    id: "pork", name: "제육볶음", code: "D610-529000000-0001", serving: 64.9,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 168, carb: 12.19, protein: 15.4, fat: 6.34, calcium: 15, vitaminC: 2.07 },
  },
  {
    id: "mackerel", name: "고등어구이", code: "D608-357000000-0001", serving: 90,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 176, carb: 3.9, protein: 12.28, fat: 11.84, calcium: 18, vitaminC: 1.74 },
  },
  {
    id: "egg-roll", name: "달걀말이", code: "D609-416000000-0001", serving: 49.2,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 169, carb: 1.31, protein: 10.6, fat: 12.78, calcium: 41, vitaminC: 0.33 },
  },
  {
    id: "tofu", name: "두부조림", code: "D611-517000000-0001", serving: 90,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 138, carb: 8.66, protein: 10.51, fat: 6.73, calcium: 71, vitaminC: 0.52 },
  },
  {
    id: "spinach", name: "시금치나물", code: "D613-586000000-0001", serving: 60,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 27, carb: 3.11, protein: 1.6, fat: 1.28, calcium: 28, vitaminC: 23.21 },
  },
  {
    id: "bean-sprouts", name: "콩나물무침", code: "D613-597000000-0001", serving: 100,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 19, carb: 1.45, protein: 1.6, fat: 1.15, calcium: 19, vitaminC: 0.69 },
  },
  {
    id: "potato", name: "감자조림", code: "D611-508000000-0001", serving: 85,
    servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 75, carb: 14.28, protein: 1.8, fat: 1.36, calcium: 10, vitaminC: 6.72 },
  },
  {
    id: "kimchi", name: "배추김치", code: "R121-006060000-0000", serving: 40,
    servingSource: "확인 필요",
    per100: { energy: 38, carb: 6.49, protein: 1.98, fat: 0.43, calcium: 43, vitaminC: 3.59 },
  },
  {
    id: "kkakdugi", name: "깍두기", code: "D115-665000000-0001", serving: 50,
    servingSource: "K-FIND 가정식 총 내용량",
    per100: { energy: 33, carb: 4.24, protein: 1.56, fat: 1.06, calcium: 45, vitaminC: 0.54 },
  },
  {
    id: "apple", name: "사과", code: "R108-050000001-0000", serving: 100,
    servingSource: "확인 필요",
    per100: { energy: 52, carb: 13.96, protein: 0.26, fat: 0.07, calcium: 3, vitaminC: 2.03 },
  },
  {
    id: "tangerine", name: "귤", code: "R108-010020001-0000", serving: 100,
    servingSource: "확인 필요",
    per100: { energy: 39, carb: 10.04, protein: 0.53, fat: 0.1, calcium: 13, vitaminC: 30.69 },
  },
  {
    id: "banana", name: "바나나", code: "R108-037000001-0000", serving: 100,
    servingSource: "확인 필요",
    per100: { energy: 77, carb: 20, protein: 1.11, fat: 0.2, calcium: 6, vitaminC: 6.6 },
  },
  {
    id: "milk", name: "우유", code: "R113-009000000-0000", serving: 200,
    servingSource: "확인 필요",
    per100: { energy: 67, carb: 4.86, protein: 3.09, fat: 3.85, calcium: 118, vitaminC: 0.79 },
  },
  {
    id: "yogurt", name: "요구르트", code: "R121-026060100-0000", serving: 65,
    servingSource: "확인 필요",
    per100: { energy: 65, carb: 15.23, protein: 1.29, fat: 0.02, calcium: 45, vitaminC: 0.46 },
  },
  {
    id: "triangle-kimbap", name: "삼각김밥", code: "D401-019000000-0001", serving: 94.5,
    servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 185, carb: 30.58, protein: 4.8, fat: 4.4, calcium: 11, vitaminC: 1.44 },
  },
];

// 1국자에 들어 있는 영양소 = 100g당 값 × 분량 ÷ 100
const foods = foodSources.map((food) => {
  const perScoop = {};
  for (const [key, value] of Object.entries(food.per100)) {
    perScoop[key] = (value * food.serving) / 100;
  }
  return { ...food, ...perScoop, image: `assets/foods/${food.id}.png` };
});

// 2025 한국인 영양소 섭취기준, 12-14세 (에너지는 필요추정량, 나머지는 권장섭취량)
const dailyReference = {
  male: { energy: 2500, protein: 60, calcium: 950, vitaminC: 90 },
  female: { energy: 2000, protein: 55, calcium: 850, vitaminC: 90 },
};

// 에너지 적정비율(%), 2025 한국인 영양소 섭취기준
const energyRange = { carb: [50, 65], protein: [10, 20], fat: [15, 30] };

// 원형 그래프의 '적정 비율 예시'. 위 범위 안에서 합이 100이 되도록 정한 값입니다.
const idealRatio = { carb: 57.5, protein: 15, fat: 27.5 };

const MEALS_PER_DAY = 3;
const dailyAverage = (key) => (dailyReference.male[key] + dailyReference.female[key]) / 2;

// 영양소마다 판정 기준을 만듭니다.
// - min: 이보다 적으면 부족 쪽 (탄수화물·지방은 적정비율의 아래 끝, 나머지는 권장섭취량)
// - max: 이보다 많으면 '많음' (탄수화물·단백질·지방은 적정비율의 위 끝, 에너지는 필요량의 1.2배)
function makeTargets(energy, protein, calcium, vitaminC) {
  const grams = (percent, kcalPerGram) => (energy * percent) / 100 / kcalPerGram;
  return {
    energy: { min: energy, max: energy * 1.2 },
    carb: { min: grams(energyRange.carb[0], 4), max: grams(energyRange.carb[1], 4) },
    protein: { min: protein, max: grams(energyRange.protein[1], 4) },
    fat: { min: grams(energyRange.fat[0], 9), max: grams(energyRange.fat[1], 9) },
    calcium: { min: calcium, max: null },
    vitaminC: { min: vitaminC, max: null },
  };
}

// 한 끼 기준: 남녀 평균 하루 기준의 3분의 1
const mealTargets = makeTargets(
  dailyAverage("energy") / MEALS_PER_DAY,
  dailyAverage("protein") / MEALS_PER_DAY,
  dailyAverage("calcium") / MEALS_PER_DAY,
  dailyAverage("vitaminC") / MEALS_PER_DAY
);

// 하루 기준: 내 식단 기록에서 씁니다.
const dailyTargets = makeTargets(
  dailyAverage("energy"),
  dailyAverage("protein"),
  dailyAverage("calcium"),
  dailyAverage("vitaminC")
);

// 판정: 기준(min)의 60% 미만 부족, 90% 미만 조금 부족, max 초과 많음, 그 외 충분
function judge(amount, target) {
  const rate = amount / target.min;
  if (target.max !== null && amount > target.max) return { rate, status: "많음" };
  if (rate < 0.6) return { rate, status: "부족" };
  if (rate < 0.9) return { rate, status: "조금 부족" };
  return { rate, status: "충분" };
}

// 예측 화면의 보기. key의 영양소로 부족한 정도를 계산합니다.
const nutrientChoices = [
  { id: "carb", label: "탄수화물", key: "carb", hint: "밥이나 과일을 더 담아 볼까?" },
  { id: "protein", label: "단백질", key: "protein", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "fat", label: "지방", key: "fat", hint: "고기나 생선을 더 담아 볼까?" },
  { id: "mineral", label: "무기질", key: "calcium", hint: "우유나 나물을 더 담아 볼까?" },
  { id: "vitamin", label: "비타민", key: "vitaminC", hint: "채소나 과일을 더 담아 볼까?" },
];

// ---------- 내 식단 기록에서 검색하는 음식 ----------
// 게임 음식 20종에 더해, 급식 · 분식/외식 · 편의점 음식을 넣었습니다.
// unit: "인분"이면 serving이 1인분, "100g"이면 1인분 자료가 없어 100g 단위로 기록합니다.
const extraFoodSources = [
  {
    id: "curry-rice", name: "카레라이스", aliases: ["카레"], category: "급식", unit: "인분",
    code: "D101-044000000-0001", serving: 480, servingSource: "K-FIND 가정식 총 내용량",
    per100: { energy: 108, carb: 20.74, protein: 3.11, fat: 1.4, calcium: 12, vitaminC: 3.16 },
  },
  {
    id: "bibimbap", name: "비빔밥", aliases: [], category: "급식", unit: "인분",
    code: "D601-018000000-0001", serving: 370.8, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 171, carb: 27.21, protein: 5, fat: 4.52, calcium: 23, vitaminC: 4.78 },
  },
  {
    id: "jjajang-rice", name: "짜장밥", aliases: [], category: "급식", unit: "인분",
    code: "D601-036000000-0001", serving: 350, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 140, carb: 26.91, protein: 4.03, fat: 1.38, calcium: 12, vitaminC: 3.15 },
  },
  {
    id: "donkatsu", name: "돈가스", aliases: ["돈까스"], category: "분식·외식", unit: "100g",
    code: "D312-550000000-0002", serving: 100, servingSource: "1인분 자료 없음 · K-FIND 외식 100g 단위",
    per100: { energy: 280, carb: 15.89, protein: 13.85, fat: 17.94, calcium: 34, vitaminC: 1.2 },
  },
  {
    id: "dakgangjeong", name: "닭강정", aliases: ["치킨"], category: "급식", unit: "인분",
    code: "D612-587000000-0001", serving: 80.7, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 146, carb: 12.02, protein: 13.5, fat: 4.3, calcium: 11, vitaminC: 0.07 },
  },
  {
    id: "tangsuyuk", name: "탕수육", aliases: [], category: "급식", unit: "인분",
    code: "D612-566000000-0001", serving: 108.6, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 160, carb: 13.14, protein: 10.6, fat: 6.86, calcium: 8, vitaminC: 3.37 },
  },
  {
    id: "spaghetti", name: "스파게티", aliases: ["파스타"], category: "급식", unit: "인분",
    code: "D603-161000000-0001", serving: 216.9, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 163, carb: 26.23, protein: 5.4, fat: 4.08, calcium: 16, vitaminC: 3.25 },
  },
  {
    id: "japchae", name: "잡채", aliases: [], category: "급식", unit: "인분",
    code: "D110-492000000-0001", serving: 200, servingSource: "K-FIND 가정식 총 내용량",
    per100: { energy: 146, carb: 24.26, protein: 4.71, fat: 3.3, calcium: 36, vitaminC: 0 },
  },
  {
    id: "eomuk-bokkeum", name: "어묵볶음", aliases: ["오뎅볶음"], category: "급식", unit: "인분",
    code: "D610-486000000-0001", serving: 53.3, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 110, carb: 10.49, protein: 4.7, fat: 5.44, calcium: 26, vitaminC: 3.55 },
  },
  {
    id: "anchovy", name: "멸치볶음", aliases: [], category: "급식", unit: "인분",
    code: "D410-472000000-0001", serving: 80, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 114, carb: 5.15, protein: 14.9, fat: 3.41, calcium: 718, vitaminC: 0.06 },
  },
  {
    id: "kimchi-stew", name: "김치찌개", aliases: [], category: "급식", unit: "인분",
    code: "D606-266000000-0001", serving: 200, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 19, carb: 2.33, protein: 1.2, fat: 0.53, calcium: 23, vitaminC: 1.27 },
  },
  {
    id: "doenjang-stew", name: "된장찌개", aliases: [], category: "급식", unit: "인분",
    code: "D606-275000000-0001", serving: 167.78, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 46, carb: 5.63, protein: 3.6, fat: 1.2, calcium: 52, vitaminC: 5.53 },
  },
  {
    id: "egg-soup", name: "달걀국", aliases: ["계란국"], category: "급식", unit: "인분",
    code: "D605-210000000-0001", serving: 150, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 22, carb: 1.12, protein: 2.07, fat: 0.98, calcium: 12, vitaminC: 0.48 },
  },
  {
    id: "sausage", name: "소시지볶음", aliases: ["소세지볶음"], category: "급식", unit: "인분",
    code: "D610-482000000-0001", serving: 170, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 132, carb: 7.75, protein: 6.8, fat: 8.25, calcium: 16, vitaminC: 18.35 },
  },
  {
    id: "squid", name: "오징어볶음", aliases: [], category: "급식", unit: "인분",
    code: "D610-488000000-0001", serving: 250, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 77, carb: 8.19, protein: 8.2, fat: 1.29, calcium: 13, vitaminC: 2.12 },
  },
  {
    id: "cucumber", name: "오이무침", aliases: [], category: "급식", unit: "인분",
    code: "D414-644000000-0001", serving: 108.2, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 35, carb: 5.44, protein: 1.3, fat: 1.28, calcium: 20, vitaminC: 8.49 },
  },
  {
    id: "dakbokkeumtang", name: "닭볶음탕", aliases: ["닭도리탕"], category: "급식", unit: "인분",
    code: "D111-514000000-0001", serving: 300, servingSource: "K-FIND 가정식 총 내용량",
    per100: { energy: 111, carb: 8.52, protein: 11.91, fat: 3.22, calcium: 20, vitaminC: 0.66 },
  },
  {
    id: "tteokbokki", name: "떡볶이", aliases: ["떡뽁이"], category: "분식·외식", unit: "인분",
    code: "D610-467000000-0001", serving: 74.8, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 258, carb: 53.39, protein: 4.3, fat: 3.62, calcium: 21, vitaminC: 3.08 },
  },
  {
    id: "malatang", name: "마라탕", aliases: [], category: "분식·외식", unit: "100g",
    code: "D306-278000000-0002", serving: 100, servingSource: "1인분 자료 없음 · K-FIND 외식 100g 단위",
    per100: { energy: 66, carb: 5.1, protein: 3.91, fat: 3.27, calcium: 21, vitaminC: 0.27 },
  },
  {
    id: "gimbap", name: "김밥", aliases: [], category: "분식·외식", unit: "인분",
    code: "D101-007000000-0001", serving: 230, servingSource: "K-FIND 가정식 총 내용량",
    per100: { energy: 140, carb: 19.98, protein: 4.84, fat: 4.55, calcium: 36, vitaminC: 3.76 },
  },
  {
    id: "ramyeon", name: "라면", aliases: ["라멘"], category: "분식·외식", unit: "인분",
    code: "D603-148000000-0001", serving: 226.6, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 169, carb: 24.49, protein: 4.1, fat: 5.77, calcium: 84, vitaminC: 0.28 },
  },
  {
    id: "sundae", name: "순대", aliases: [], category: "분식·외식", unit: "인분",
    code: "D607-337000000-0001", serving: 69.3, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 165, carb: 20.61, protein: 5.5, fat: 6.55, calcium: 33, vitaminC: 0.86 },
  },
  {
    id: "pizza", name: "피자", aliases: [], category: "분식·외식", unit: "인분",
    code: "D602-120000000-0001", serving: 160, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 219, carb: 23.36, protein: 12.1, fat: 7.94, calcium: 94, vitaminC: 5.75 },
  },
  {
    id: "hamburger", name: "햄버거", aliases: ["버거"], category: "분식·외식", unit: "인분",
    code: "D602-123000000-0001", serving: 210, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 229, carb: 19.35, protein: 8, fat: 12.79, calcium: 18, vitaminC: 1.71 },
  },
  {
    id: "jjajangmyeon", name: "짜장면", aliases: ["자장면"], category: "분식·외식", unit: "인분",
    code: "D603-197000000-0001", serving: 650, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 105, carb: 20.9, protein: 4, fat: 1.25, calcium: 13, vitaminC: 2.01 },
  },
  {
    id: "jjamppong", name: "짬뽕", aliases: [], category: "분식·외식", unit: "인분",
    code: "D603-172000000-0001", serving: 637.46, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 73, carb: 11.93, protein: 2.8, fat: 1.27, calcium: 9, vitaminC: 0.94 },
  },
  {
    id: "naengmyeon", name: "물냉면", aliases: ["냉면"], category: "분식·외식", unit: "인분",
    code: "D603-187000000-0001", serving: 385.1, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 83, carb: 14.21, protein: 4.2, fat: 0.83, calcium: 10, vitaminC: 1.14 },
  },
  {
    id: "udon", name: "우동", aliases: [], category: "분식·외식", unit: "인분",
    code: "D603-164000000-0001", serving: 530, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 61, carb: 11.24, protein: 1.81, fat: 0.8, calcium: 12, vitaminC: 0.21 },
  },
  {
    id: "jjolmyeon", name: "쫄면", aliases: [], category: "분식·외식", unit: "인분",
    code: "D603-173000000-0001", serving: 220, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 113, carb: 23.35, protein: 3.23, fat: 0.71, calcium: 18, vitaminC: 2.06 },
  },
  {
    id: "rabokki", name: "라볶이", aliases: [], category: "분식·외식", unit: "인분",
    code: "D410-468000000-0001", serving: 475, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 113, carb: 18.5, protein: 2, fat: 3.39, calcium: 47, vitaminC: 1.18 },
  },
  {
    id: "hotdog", name: "핫도그", aliases: [], category: "분식·외식", unit: "100g",
    code: "D302-122000000-0001", serving: 100, servingSource: "1인분 자료 없음 · K-FIND 외식 100g 단위",
    per100: { energy: 341, carb: 24.95, protein: 7.98, fat: 23.23, calcium: 29, vitaminC: 0.61 },
  },
  {
    id: "fries", name: "감자튀김", aliases: [], category: "분식·외식", unit: "인분",
    code: "D612-537000000-0001", serving: 81.8, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 114, carb: 15.88, protein: 2.1, fat: 4.78, calcium: 10, vitaminC: 11.04 },
  },
  {
    id: "sandwich", name: "샌드위치", aliases: [], category: "편의점·간식", unit: "인분",
    code: "D302-096000000-0001", serving: 155, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 206, carb: 19.08, protein: 4.27, fat: 12.54, calcium: 35, vitaminC: 0 },
  },
  {
    id: "kimchi-fried-rice", name: "김치볶음밥", aliases: ["볶음밥"], category: "급식", unit: "100g",
    code: "D301-017070000-0002", serving: 100, servingSource: "1인분 자료 없음 · K-FIND 외식 100g 단위",
    per100: { energy: 167, carb: 23.21, protein: 4.18, fat: 6.44, calcium: 27, vitaminC: 0.38 },
  },
  {
    id: "eomuk-soup", name: "어묵국", aliases: ["어묵탕", "오뎅국", "오뎅", "어묵"], category: "급식", unit: "인분",
    code: "D605-310000000-0001", serving: 126.4, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 43, carb: 5.53, protein: 3.3, fat: 0.99, calcium: 47, vitaminC: 1.86 },
  },
  {
    id: "fried-chicken", name: "치킨(닭튀김)", aliases: ["치킨", "후라이드치킨", "프라이드치킨", "닭튀김"], category: "분식·외식", unit: "인분",
    code: "D612-549000000-0001", serving: 89, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 153, carb: 4.56, protein: 15.5, fat: 7.36, calcium: 13, vitaminC: 0.01 },
  },
  {
    id: "toast", name: "토스트", aliases: [], category: "분식·외식", unit: "인분",
    code: "D402-145000000-0001", serving: 230.3, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 84, carb: 15.55, protein: 2.5, fat: 1.33, calcium: 8, vitaminC: 0.57 },
  },
  {
    id: "cream-bread", name: "크림빵", aliases: ["빵"], category: "편의점·간식", unit: "인분",
    code: "D302-113000000-0001", serving: 85, servingSource: "K-FIND 외식 총 내용량",
    per100: { energy: 297, carb: 42.14, protein: 7.84, fat: 10.81, calcium: 57, vitaminC: 0 },
  },
  {
    id: "steamed-egg", name: "달걀찜", aliases: ["계란찜"], category: "급식", unit: "인분",
    code: "D607-317000000-0001", serving: 110, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 119, carb: 1.66, protein: 11.1, fat: 7.01, calcium: 44, vitaminC: 0.4 },
  },
  {
    id: "ham-salad", name: "햄샐러드", aliases: ["샐러드"], category: "급식", unit: "인분",
    code: "D614-724000000-0001", serving: 80.6, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 107, carb: 13.49, protein: 3.6, fat: 4.4, calcium: 15, vitaminC: 8.4 },
  },
  {
    id: "mandu", name: "군만두", aliases: ["만두"], category: "분식·외식", unit: "인분",
    code: "D603-180000000-0001", serving: 257.3, servingSource: "K-FIND 중고등학교급식 총 내용량",
    per100: { energy: 219, carb: 25.22, protein: 8.5, fat: 9.25, calcium: 59, vitaminC: 0 },
  },
  {
    id: "fried-egg", name: "달걀프라이", aliases: ["계란후라이", "계란프라이", "달걀후라이"], category: "급식", unit: "인분",
    code: "R121-032010100-0000", serving: 50, servingSource: "확인 필요 (1개 50g으로 정함)",
    per100: { energy: 206, carb: 3.79, protein: 15.12, fat: 13.46, calcium: 72, vitaminC: 0 },
  },
  {
    id: "seasoned-laver", name: "조미김", aliases: ["김"], category: "급식", unit: "인분",
    code: "R212-813010102-0000", serving: 5, servingSource: "확인 필요 (1봉 5g으로 정함, 비타민 C 자료 없음)",
    per100: { energy: 308, carb: 20.54, protein: 21.5, fat: 49.82, calcium: 180, vitaminC: 0 },
  },
  {
    id: "watermelon", name: "수박", aliases: [], category: "과일·음료", unit: "인분",
    code: "R108-061030001-0001", serving: 200, servingSource: "확인 필요 (1쪽 200g으로 정함)",
    per100: { energy: 30, carb: 7.59, protein: 0.76, fat: 0.06, calcium: 6, vitaminC: 8.64 },
  },
  {
    id: "grape", name: "포도", aliases: ["거봉"], category: "과일·음료", unit: "인분",
    code: "R108-098010001-0000", serving: 100, servingSource: "확인 필요 (100g으로 정함)",
    per100: { energy: 57, carb: 15.3, protein: 0.42, fat: 0.1, calcium: 4, vitaminC: 3.93 },
  },
  {
    id: "strawberry", name: "딸기", aliases: [], category: "과일·음료", unit: "인분",
    code: "R108-019000001-0000", serving: 100, servingSource: "확인 필요 (100g으로 정함)",
    per100: { energy: 33, carb: 8.15, protein: 0.75, fat: 0.14, calcium: 12, vitaminC: 62.95 },
  },
  {
    id: "orange-juice", name: "오렌지주스", aliases: ["주스"], category: "과일·음료", unit: "인분",
    code: "R121-034060000-0000", serving: 200, servingSource: "확인 필요 (1컵 200mL로 정함)",
    per100: { energy: 36, carb: 9.49, protein: 0.58, fat: 0.04, calcium: 22, vitaminC: 51.44 },
  },
  {
    id: "cola", name: "콜라", aliases: ["탄산음료"], category: "과일·음료", unit: "인분",
    code: "R121-045110000-0000", serving: 250, servingSource: "확인 필요 (1캔 250mL로 정함)",
    per100: { energy: 38, carb: 9.46, protein: 0, fat: 0, calcium: 1, vitaminC: 0 },
  },
  {
    id: "cider", name: "사이다", aliases: ["탄산음료"], category: "과일·음료", unit: "인분",
    code: "R121-045040000-0000", serving: 250, servingSource: "확인 필요 (1캔 250mL로 정함)",
    per100: { energy: 40, carb: 9.98, protein: 0, fat: 0, calcium: 2, vitaminC: 0 },
  },
  {
    id: "ion-drink", name: "이온음료", aliases: ["스포츠음료"], category: "과일·음료", unit: "인분",
    code: "R121-029170100-0000", serving: 250, servingSource: "확인 필요 (250mL로 정함)",
    per100: { energy: 37, carb: 9.16, protein: 0, fat: 0, calcium: 0, vitaminC: 4.44 },
  },
  {
    id: "banana-milk", name: "바나나맛우유", aliases: ["바나나우유"], category: "편의점·간식", unit: "인분",
    code: "R121-026010300-0000", serving: 240, servingSource: "확인 필요 (1개 240mL로 정함)",
    per100: { energy: 90, carb: 13.13, protein: 2.63, fat: 3.02, calcium: 89, vitaminC: 0 },
  },
  {
    id: "choco-milk", name: "초코우유", aliases: ["초콜릿우유"], category: "편의점·간식", unit: "인분",
    code: "R121-026010200-0000", serving: 200, servingSource: "확인 필요 (1팩 200mL로 정함)",
    per100: { energy: 71, carb: 12.14, protein: 2.61, fat: 1.41, calcium: 83, vitaminC: 0 },
  },
  {
    id: "strawberry-milk", name: "딸기우유", aliases: [], category: "편의점·간식", unit: "인분",
    code: "R121-026010400-0000", serving: 200, servingSource: "확인 필요 (1팩 200mL로 정함)",
    per100: { energy: 68, carb: 12.34, protein: 2.29, fat: 1.12, calcium: 78, vitaminC: 0.25 },
  },
  {
    id: "potato-chips", name: "감자칩", aliases: ["과자", "포테이토칩"], category: "편의점·간식", unit: "인분",
    code: "R121-004010150-0000", serving: 60, servingSource: "확인 필요 (1봉 60g으로 정함)",
    per100: { energy: 469, carb: 71.4, protein: 5, fat: 18.2, calcium: 125, vitaminC: 0 },
  },
  {
    id: "chocopie", name: "초코파이", aliases: ["과자"], category: "편의점·간식", unit: "인분",
    code: "R121-004200000-0000", serving: 35, servingSource: "확인 필요 (1개 35g으로 정함)",
    per100: { energy: 460, carb: 59.37, protein: 5.63, fat: 22.26, calcium: 91, vitaminC: 0 },
  },
  {
    id: "ice-cream", name: "아이스크림", aliases: ["아이스크림 바닐라"], category: "편의점·간식", unit: "인분",
    code: "R121-015030300-0000", serving: 100, servingSource: "확인 필요 (1개 100g으로 정함)",
    per100: { energy: 179, carb: 22.25, protein: 4.98, fat: 7.83, calcium: 80, vitaminC: 1.69 },
  },
];

// 게임 음식의 검색용 분류와 다른 이름
const gameFoodInfo = {
  rice: { category: "급식", aliases: ["흰쌀밥", "밥", "공기밥"] },
  "brown-rice": { category: "급식", aliases: ["잡곡밥", "밥"] },
  "seaweed-soup": { category: "급식", aliases: [] },
  "radish-soup": { category: "급식", aliases: ["된장국"] },
  bulgogi: { category: "급식", aliases: ["불고기"] },
  pork: { category: "급식", aliases: ["돼지불고기"] },
  mackerel: { category: "급식", aliases: ["생선구이"] },
  "egg-roll": { category: "급식", aliases: ["계란말이"] },
  tofu: { category: "급식", aliases: [] },
  spinach: { category: "급식", aliases: ["나물"] },
  "bean-sprouts": { category: "급식", aliases: ["나물"] },
  potato: { category: "급식", aliases: [] },
  kimchi: { category: "급식", aliases: ["김치"] },
  kkakdugi: { category: "급식", aliases: ["김치"] },
  apple: { category: "과일·음료", aliases: [] },
  tangerine: { category: "과일·음료", aliases: ["감귤", "귤"] },
  banana: { category: "과일·음료", aliases: [] },
  milk: { category: "과일·음료", aliases: ["흰우유"] },
  yogurt: { category: "과일·음료", aliases: ["요거트", "요플레"] },
  "triangle-kimbap": { category: "편의점·간식", aliases: ["주먹밥", "편의점"] },
};

const withPerServing = (food) => {
  const values = {};
  for (const [key, value] of Object.entries(food.per100)) values[key] = (value * food.serving) / 100;
  return { ...food, ...values };
};

const recordFoods = [
  ...foods.map((food) => ({ unit: "인분", ...food, ...gameFoodInfo[food.id] })),
  ...extraFoodSources.map(withPerServing),
];
