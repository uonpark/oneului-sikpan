// 내 식단 기록: 달력 → 날짜별 아침·점심·저녁 식단표. 기록은 이 브라우저(localStorage)에만 저장됩니다.
const RECORD_KEY = "oneului-sikpan-records";
const MEALS = [
  { id: "breakfast", label: "아침" },
  { id: "lunch", label: "점심" },
  { id: "dinner", label: "저녁" },
];
const SERVING_STEP = 0.5;
const MAX_RESULTS = 8;

let calendarMonth = startOfMonth(new Date());
let currentDate = null; // "2026-11-11" 형식

const findRecordFood = (id) => recordFoods.find((food) => food.id === id);

/* ---------- 저장 ---------- */

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveRecords(records) {
  localStorage.setItem(RECORD_KEY, JSON.stringify(records));
}

// 음식 목록에서 빠진 음식이 예전 기록에 있어도 화면이 멈추지 않도록 건너뜁니다.
function dayRecord(records, date) {
  const day = records[date] ?? {};
  const clean = {};
  for (const meal of MEALS) clean[meal.id] = (day[meal.id] ?? []).filter((item) => findRecordFood(item.id));
  return clean;
}

function hasRecord(records, date) {
  const day = records[date];
  return Boolean(day) && MEALS.some((meal) => day[meal.id]?.length);
}

function updateDay(change) {
  const records = loadRecords();
  const day = dayRecord(records, currentDate);
  change(day);
  if (MEALS.some((meal) => day[meal.id].length)) records[currentDate] = day;
  else delete records[currentDate];
  saveRecords(records);
  markSaved();
  renderDay();
}

// 바뀐 내용은 바로 저장됩니다. 저장된 시각을 화면에 보여줍니다.
function markSaved() {
  const time = new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
  $("save-status").textContent = `✓ 저장됨 · ${time}`;
}

function showToast(message, id = "cal-toast") {
  const toast = $(id);
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => (toast.hidden = true), 3000);
}

/* ---------- 날짜 ---------- */

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function dateKey(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dateTitle(key) {
  const [y, m, d] = key.split("-").map(Number);
  const weekday = "일월화수목금토"[new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 (${weekday})`;
}

/* ---------- 달력 화면 ---------- */

function renderCalendar() {
  const records = loadRecords();
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  $("cal-title").textContent = `${year}년 ${month + 1}월`;

  const cells = [];
  for (const name of "일월화수목금토") {
    const head = document.createElement("div");
    head.className = "cal-weekday";
    head.textContent = name;
    cells.push(head);
  }
  for (let i = 0; i < calendarMonth.getDay(); i++) cells.push(document.createElement("div"));

  const today = dateKey(new Date());
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const key = dateKey(new Date(year, month, d));
    const button = document.createElement("button");
    button.className = "cal-day";
    button.classList.toggle("today", key === today);
    button.classList.toggle("has-record", hasRecord(records, key));
    button.innerHTML = `<span>${d}</span>${hasRecord(records, key) ? '<i aria-label="기록 있음">🍚</i>' : ""}`;
    button.addEventListener("click", () => {
      Sound.play("select");
      openDay(key);
    });
    cells.push(button);
  }
  $("cal-grid").replaceChildren(...cells);
}

function moveMonth(delta) {
  Sound.play("click");
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + delta, 1);
  renderCalendar();
}

function openCalendar() {
  renderCalendar();
  showScreen("calendar");
}

/* ---------- 날짜별 식단표 ---------- */

function openDay(key) {
  currentDate = key;
  $("day-title").textContent = dateTitle(key);
  $("save-status").textContent = hasRecord(loadRecords(), key) ? "✓ 저장된 기록" : "";
  for (const input of document.querySelectorAll(".meal-search")) input.value = "";
  closeAllResults();
  renderDay();
  showScreen("day");
}

function renderDay() {
  const day = dayRecord(loadRecords(), currentDate);
  for (const meal of MEALS) {
    const list = document.querySelector(`[data-meal="${meal.id}"] .meal-list`);
    const items = day[meal.id];
    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "meal-empty";
      empty.textContent = "아래에서 음식을 검색해 넣어 보자";
      list.replaceChildren(empty);
    } else {
      list.replaceChildren(...items.map((item, index) => mealItem(meal.id, item, index)));
    }
    const kcal = items.reduce((sum, item) => sum + findRecordFood(item.id).energy * item.servings, 0);
    document.querySelector(`[data-meal="${meal.id}"] .meal-kcal`).textContent = `${Math.round(kcal)} kcal`;
  }
  renderDaySummary(day);
}

function mealItem(mealId, item, index) {
  const food = findRecordFood(item.id);
  const li = document.createElement("li");
  li.className = "meal-item";

  const name = document.createElement("span");
  name.className = "meal-name";
  name.textContent = food.name;

  const amount = document.createElement("span");
  amount.className = "meal-amount";
  const minus = document.createElement("button");
  minus.className = "small";
  minus.textContent = "−";
  minus.setAttribute("aria-label", `${food.name} 양 줄이기`);
  minus.disabled = item.servings <= SERVING_STEP;
  minus.addEventListener("click", () => changeServings(mealId, index, -SERVING_STEP));
  const count = document.createElement("b");
  count.textContent = amountText(food, item.servings);
  const plus = document.createElement("button");
  plus.className = "small";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `${food.name} 양 늘리기`);
  plus.addEventListener("click", () => changeServings(mealId, index, SERVING_STEP));
  amount.append(minus, count, plus);

  const remove = document.createElement("button");
  remove.className = "small remove-item";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `${food.name} 빼기`);
  remove.addEventListener("click", () => {
    Sound.play("remove");
    updateDay((day) => day[mealId].splice(index, 1));
  });

  li.append(name, amount, remove);
  return li;
}

// 1인분 자료가 없는 음식은 100g 단위로 보여줍니다.
function amountText(food, servings) {
  return food.unit === "100g" ? `${servings * 100}g` : `${servings}인분`;
}

function changeServings(mealId, index, delta) {
  Sound.play(delta > 0 ? "up" : "down");
  updateDay((day) => {
    day[mealId][index].servings += delta;
  });
}

function addFood(mealId, food) {
  Sound.play("save");
  updateDay((day) => day[mealId].push({ id: food.id, servings: 1 }));
}

/* ---------- 검색 ---------- */

const CHOSUNG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

// "떡볶이" → "ㄸㅂㅇ". 초성만 입력해도 찾을 수 있게 합니다.
function toChosung(text) {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0) - 0xac00;
      return code >= 0 && code < 11172 ? CHOSUNG[Math.floor(code / 588)] : ch;
    })
    .join("");
}

function searchFoods(query) {
  const q = query.replace(/\s/g, "");
  if (!q) return [];
  const onlyChosung = [...q].every((ch) => CHOSUNG.includes(ch));
  const score = (food) => {
    const names = [food.name, ...(food.aliases ?? [])].map((n) => n.replace(/\s/g, ""));
    if (names.some((n) => n === q)) return 0;
    if (names.some((n) => n.startsWith(q))) return 1;
    if (names.some((n) => n.includes(q))) return 2;
    if (onlyChosung && names.some((n) => toChosung(n).includes(q))) return 3;
    return Infinity;
  };
  return recordFoods
    .map((food) => ({ food, rank: score(food) }))
    .filter((r) => r.rank !== Infinity)
    .sort((a, b) => a.rank - b.rank || a.food.name.localeCompare(b.food.name, "ko"))
    .slice(0, MAX_RESULTS)
    .map((r) => r.food);
}

function renderResults(column) {
  const input = column.querySelector(".meal-search");
  const list = column.querySelector(".search-results");
  const matches = searchFoods(input.value);
  list.hidden = !input.value.trim();
  if (!matches.length) {
    const none = document.createElement("li");
    none.className = "search-none";
    none.textContent = "찾는 음식이 없어요. 비슷한 이름으로 검색해 보자";
    list.replaceChildren(none);
    return;
  }
  list.replaceChildren(
    ...matches.map((food) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.className = "search-item";
      button.innerHTML = `<span></span><small>${amountText(food, 1)} ${Math.round(food.energy)} kcal · ${food.category}</small>`;
      button.querySelector("span").textContent = food.name;
      button.addEventListener("click", () => pick(column, food));
      li.append(button);
      return li;
    })
  );
}

function pick(column, food) {
  addFood(column.dataset.meal, food);
  const input = column.querySelector(".meal-search");
  input.value = "";
  closeAllResults();
  input.focus();
}

function closeAllResults() {
  for (const list of document.querySelectorAll(".search-results")) list.hidden = true;
}

/* ---------- 하루 영양 합계 ---------- */

const SUMMARY_ROWS = [
  { key: "energy", label: "에너지", unit: "kcal", color: "var(--gold)" },
  { key: "carb", label: "탄수화물", unit: "g", color: "var(--carb)" },
  { key: "protein", label: "단백질", unit: "g", color: "var(--protein)" },
  { key: "fat", label: "지방", unit: "g", color: "var(--fat)" },
  { key: "calcium", label: "무기질(칼슘)", unit: "mg", color: "#8e6be8" },
  { key: "vitaminC", label: "비타민(비타민 C)", unit: "mg", color: "var(--green)" },
];

function renderDaySummary(day) {
  const total = { energy: 0, carb: 0, protein: 0, fat: 0, calcium: 0, vitaminC: 0 };
  for (const meal of MEALS) {
    for (const item of day[meal.id]) {
      const food = findRecordFood(item.id);
      for (const key of Object.keys(total)) total[key] += food[key] * item.servings;
    }
  }
  $("day-summary-rows").replaceChildren(
    ...SUMMARY_ROWS.map(({ key, label, unit, color }) => {
      const target = dailyTargets[key];
      const { rate, status } = judge(total[key], target);
      const goal = target.max !== null && unit === "g" ? `${Math.round(target.min)}~${Math.round(target.max)}` : Math.round(target.min);
      const row = document.createElement("div");
      row.className = "gauge";
      row.innerHTML = `<span class="gauge-name">${label}<small>${Math.round(total[key])} / ${goal} ${unit}</small></span>
        <div class="bar"><div class="fill" style="width:${Math.min(rate, 1) * 100}%;background:${color}"></div></div>
        <span class="gauge-status">${Math.round(rate * 100)}% · ${status}</span>`;
      return row;
    })
  );
}

/* ---------- 연결 ---------- */

$("open-record").addEventListener("click", () => {
  Sound.play("start");
  openCalendar();
});
$("record-home").addEventListener("click", () => {
  Sound.play("click");
  showScreen("start");
});
$("cal-prev").addEventListener("click", () => moveMonth(-1));
$("cal-next").addEventListener("click", () => moveMonth(1));
$("day-back").addEventListener("click", () => {
  Sound.play("click");
  openCalendar();
});
$("save-day").addEventListener("click", () => {
  Sound.play("save");
  const [, m, d] = currentDate.split("-").map(Number);
  if (hasRecord(loadRecords(), currentDate)) {
    markSaved();
    showToast(`💾 ${m}월 ${d}일 식단을 저장했어요!`, "day-toast");
  } else {
    showToast(`${m}월 ${d}일에는 아직 기록한 음식이 없어요.`, "day-toast");
  }
});
$("clear-day").addEventListener("click", () => {
  if (!confirm(`${dateTitle(currentDate)} 기록을 모두 지울까요? 지우면 되돌릴 수 없어요.`)) return;
  Sound.play("remove");
  const records = loadRecords();
  delete records[currentDate];
  saveRecords(records);
  $("save-status").textContent = "";
  renderDay();
});
$("clear-all").addEventListener("click", () => {
  if (!confirm("이 브라우저에 저장된 식단 기록을 모두 지울까요? 지우면 되돌릴 수 없어요.")) return;
  Sound.play("remove");
  localStorage.removeItem(RECORD_KEY);
  renderCalendar();
});

for (const column of document.querySelectorAll(".meal-col")) {
  const input = column.querySelector(".meal-search");
  input.addEventListener("input", () => {
    closeAllResults();
    renderResults(column);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      input.value = "";
      closeAllResults();
    }
    if (event.key === "Enter" && !event.isComposing) {
      const first = searchFoods(input.value)[0];
      if (first) pick(column, first);
    }
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".meal-search-area")) closeAllResults();
});
