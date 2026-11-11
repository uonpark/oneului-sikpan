const SLOT_COUNT = 5;
const MIN_SCOOP = 0.5;
const MAX_SCOOP = 3;
const SCOOP_STEP = 0.5;
const COUNTER_GAP = 8; // style.css의 .counter gap과 같은 값
const COUNTER_STEP = 3; // 화살표를 한 번 누를 때 넘어가는 음식 수

// 게임의 현재 상태. 화면은 항상 이 값을 보고 다시 그립니다.
let tray = Array(SLOT_COUNT).fill(null); // 칸마다 null 또는 { foodId, scoops }
let selectedSlot = null;
let prediction = null;
let lastResult = null; // 고치기 전 결과. 고친 뒤 결과와 비교할 때 씁니다.
let attempt = 0; // 이번 판에서 결과를 본 횟수

const $ = (id) => document.getElementById(id);
const findFood = (id) => foods.find((food) => food.id === id);
const filledSlots = () => tray.filter(Boolean);

function foodImage(food) {
  const image = document.createElement("img");
  image.className = "icon";
  image.src = food.image;
  image.alt = "";
  image.draggable = false;
  return image;
}

function showScreen(name) {
  for (const screen of ["start", "tray", "predict", "result", "calendar", "day"]) {
    $(`screen-${screen}`).hidden = screen !== name;
  }
  if (name === "tray") updateCounterArrows();
}

/* ---------- 계산 ---------- */

// 담은 음식 × 양을 모두 더합니다.
function sumNutrients() {
  const total = { energy: 0, carb: 0, protein: 0, fat: 0, calcium: 0, vitaminC: 0 };
  for (const item of filledSlots()) {
    const food = findFood(item.foodId);
    for (const key of Object.keys(total)) {
      total[key] += food[key] * item.scoops;
    }
  }
  return total;
}

const achievement = (total, key) => total[key] / mealTargets[key].min;

// '부족' 판정을 받은 영양소를 모두 찾습니다. 없으면 '조금 부족'을 찾습니다.
function findLacking(total) {
  const judged = nutrientChoices.map((choice) => ({ choice, ...judge(total[choice.key], mealTargets[choice.key]) }));
  const lacking = judged.filter((n) => n.status === "부족");
  const partly = judged.filter((n) => n.status === "조금 부족");
  const tooMuch = judged.filter((n) => n.status === "많음");
  return { lacking: lacking.length ? lacking : partly, severe: lacking.length > 0, tooMuch };
}

function energyRatio(total) {
  const carb = total.carb * 4;
  const protein = total.protein * 4;
  const fat = total.fat * 9;
  const sum = carb + protein + fat;
  return { carb: (carb / sum) * 100, protein: (protein / sum) * 100, fat: (fat / sum) * 100 };
}

// 게이지 상태. 표와 같은 기준(60% 미만 부족, 90% 미만 조금 부족)을 씁니다.
// '많음'은 에너지 게이지에만 씁니다 (한 끼 필요량의 1.2배 초과).
function gaugeStatus(rate, index) {
  if (index === 0 && rate > 1.2) return "많음";
  if (rate >= 0.9) return "충분";
  if (rate >= 0.6) return "조금 부족";
  return "부족";
}

// 받침이 있으면 "은", 없으면 "는"
function topicParticle(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code < 11172 && code % 28 !== 0 ? "은" : "는";
}

/* ---------- 화면 1: 식판 담기 ---------- */

function renderCounter() {
  $("counter").replaceChildren(
    ...foods.map((food) => {
      const el = document.createElement("div");
      el.className = "food";
      el.dataset.foodId = food.id;
      el.append(foodImage(food), food.name);
      el.addEventListener("pointerdown", (event) => startDrag(event, food));
      return el;
    })
  );
}

// 배식대 화살표. 숨겨졌던 화면이 다시 나타나면 위치가 처음으로 돌아갑니다.
function scrollCounter(direction) {
  const counter = $("counter");
  const itemWidth = counter.firstElementChild.offsetWidth + COUNTER_GAP;
  counter.scrollBy({ left: direction * itemWidth * COUNTER_STEP, behavior: "smooth" });
}

function updateCounterArrows() {
  const counter = $("counter");
  const end = counter.scrollWidth - counter.clientWidth;
  $("counter-prev").disabled = counter.scrollLeft <= 1;
  $("counter-next").disabled = counter.scrollLeft >= end - 1;
}

function renderTray() {
  $("tray").replaceChildren(
    ...tray.map((item, index) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.index = index;
      slot.classList.toggle("selected", index === selectedSlot);

      if (item) {
        const food = findFood(item.foodId);
        const content = document.createElement("div");
        content.append(foodImage(food), food.name);
        slot.append(content);
        slot.addEventListener("click", () => {
          selectedSlot = index;
          renderTray();
        });

        const remove = document.createElement("button");
        remove.className = "remove";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `${food.name} 빼기`);
        remove.addEventListener("click", (event) => {
          event.stopPropagation();
          tray[index] = null;
          Sound.play("remove");
          if (selectedSlot === index) selectedSlot = null;
          renderTray();
        });
        slot.append(remove);
      }
      return slot;
    })
  );

  const selected = selectedSlot === null ? null : tray[selectedSlot];
  $("scoop").style.visibility = selected ? "visible" : "hidden";
  if (selected) {
    $("scoop-name").textContent = findFood(selected.foodId).name;
    $("scoop-amount").textContent = `${selected.scoops}국자`;
    $("scoop-minus").disabled = selected.scoops <= MIN_SCOOP;
    $("scoop-plus").disabled = selected.scoops >= MAX_SCOOP;
  }
  $("done").disabled = filledSlots().length === 0;
}

function placeFood(food, index) {
  Sound.play("drop");
  tray[index] = { foodId: food.id, scoops: 1 };
  selectedSlot = index;
  renderTray();
}

function changeScoop(delta) {
  tray[selectedSlot].scoops += delta;
  Sound.play(delta > 0 ? "up" : "down");
  renderTray();
}

// 끌어다 놓기. 움직이지 않고 클릭만 하면 첫 빈칸에 담습니다.
function startDrag(event, food) {
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  let ghost = null;
  let overSlot = null;

  const slotAt = (x, y) => document.elementFromPoint(x, y)?.closest(".slot") ?? null;

  function onMove(moveEvent) {
    const moved = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 5;
    if (!ghost && moved) {
      ghost = document.createElement("div");
      ghost.className = "ghost";
      ghost.append(foodImage(food));
      document.body.append(ghost);
      Sound.play("pick");
    }
    if (!ghost) return;

    ghost.style.left = `${moveEvent.clientX}px`;
    ghost.style.top = `${moveEvent.clientY}px`;
    overSlot?.classList.remove("over");
    overSlot = slotAt(moveEvent.clientX, moveEvent.clientY);
    overSlot?.classList.add("over");
  }

  function onUp(upEvent) {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);

    if (ghost) {
      ghost.remove();
      const slot = slotAt(upEvent.clientX, upEvent.clientY);
      if (slot) placeFood(food, Number(slot.dataset.index));
      else renderTray();
      return;
    }
    const empty = tray.indexOf(null);
    if (empty !== -1) placeFood(food, empty);
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

/* ---------- 화면 2: 예측하기 ---------- */

function openPredict() {
  prediction = null;
  $("tray-summary").replaceChildren(...filledSlots().map((item) => foodImage(findFood(item.foodId))));
  renderChoices();
  showScreen("predict");
}

function renderChoices() {
  $("choices").replaceChildren(
    ...nutrientChoices.map((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.label;
      button.classList.toggle("chosen", prediction === choice.id);
      button.addEventListener("click", () => {
        prediction = choice.id;
        Sound.play("select");
        renderChoices();
      });
      return button;
    })
  );
  $("show-result").disabled = prediction === null;
}

/* ---------- 화면 3: 결과 확인 ---------- */

function donutStyle(ratio) {
  const proteinEnd = ratio.carb + ratio.protein;
  return `conic-gradient(var(--carb) 0 ${ratio.carb}%, var(--protein) 0 ${proteinEnd}%, var(--fat) 0 100%)`;
}

function renderRatioRows(mine, previous) {
  const rows = [
    { key: "carb", label: "탄수화물" },
    { key: "protein", label: "단백질" },
    { key: "fat", label: "지방" },
  ];
  $("ratio-prev-head").hidden = !previous;
  $("ratio-rows").replaceChildren(
    ...rows.map(({ key, label }) => {
      const tr = document.createElement("tr");
      const prevCell = previous ? `<td class="prev">${Math.round(previous[key])}%</td>` : "";
      tr.innerHTML = `<td><i class="dot ${key}"></i>${label}</td>${prevCell}<td>${Math.round(mine[key])}%</td><td>${energyRange[key][0]}~${energyRange[key][1]}%</td>`;
      return tr;
    })
  );
}

function gaugeRates(total) {
  return [
    achievement(total, "energy"),
    // 한쪽이 넘쳐도 다른 쪽의 부족을 가리지 않도록 각각 100%까지만 셉니다.
    (Math.min(achievement(total, "protein"), 1) + Math.min(achievement(total, "calcium"), 1)) / 2,
    achievement(total, "vitaminC"),
  ];
}

function renderGauges(rates, previousRates) {
  const gauges = [
    { label: "에너지 공급", nutrients: "탄수화물 · 단백질 · 지방", color: "var(--gold)" },
    { label: "몸의 조직 구성", nutrients: "단백질 · 무기질(칼슘)", color: "#8e6be8" },
    { label: "생리 기능 조절", nutrients: "비타민(비타민 C)", color: "var(--green)" },
  ];

  $("gauges").replaceChildren(
    ...gauges.map(({ label, nutrients, color }, i) => {
      const rate = rates[i];
      const row = document.createElement("div");
      row.className = "gauge";
      let status = gaugeStatus(rate, i);
      let marker = "";
      if (previousRates) {
        const before = previousRates[i];
        marker = `<div class="prev-mark" style="left:${Math.min(before, 1) * 100}%" title="고치기 전"></div>`;
        status = `${gaugeStatus(before, i)} → ${status} ${changeArrow(before, rate)}`;
      }
      row.innerHTML = `<span class="gauge-name">${label}<small>${nutrients}</small></span>
        <div class="bar"><div class="fill" style="width:${Math.min(rate, 1) * 100}%;background:${color}"></div>${marker}</div>
        <span class="gauge-status">${status}</span>`;
      return row;
    })
  );
}

// 기준(100%)에 가까워졌으면 ▲, 멀어졌으면 ▼
function changeArrow(before, after) {
  const distance = (rate) => Math.abs(1 - Math.min(rate, 1.2));
  const diff = distance(before) - distance(after);
  if (Math.abs(diff) < 0.02) return "＝";
  return diff > 0 ? "▲" : "▼";
}

function showResult() {
  const total = sumNutrients();
  const { lacking, severe, tooMuch } = findLacking(total);
  const predicted = nutrientChoices.find((choice) => choice.id === prediction);
  const correct = lacking.some((n) => n.choice.id === predicted.id);
  const lackingNames = lacking.map((n) => n.choice.label).join(" · ");

  const mine = energyRatio(total);
  const rates = gaugeRates(total);
  const previous = lastResult;
  attempt += 1;

  $("donut-mine").style.background = donutStyle(mine);
  $("donut-ideal").style.background = donutStyle(idealRatio);
  $("donut-mine-caption").textContent = attempt > 1 ? `고친 식판 (${attempt}번째)` : "내 식판";
  renderRatioRows(mine, previous?.ratio);
  renderGauges(rates, previous?.rates);
  renderNutrientRows(total);
  $("compare-note").hidden = !previous;
  $("compare-note").textContent = previous ? `고치기 전과 비교: ${compareSummary(previous.rates, rates)}` : "";

  const word = severe ? "부족" : "조금 부족";
  $("prediction-result").textContent = lacking.length
    ? `내 예측: ${predicted.label} · ${word}한 영양소: ${lackingNames} ${correct ? "(맞았어요!)" : "(아쉬워요!)"}`
    : `내 예측: ${predicted.label} · 부족한 영양소가 없어요!`;
  const muchNames = tooMuch.map((n) => n.choice.label).join(" · ");
  const extra = tooMuch.length ? ` ${muchNames}${topicParticle(muchNames)} 너무 많아.` : "";
  $("result-speech").textContent = lacking.length
    ? `${word}한 건 ${lackingNames}! ${lacking[0].choice.hint}${extra}`
    : `5대 영양소를 모두 챙긴 균형 잡힌 식판이야!${extra}`;
  lastResult = { ratio: mine, rates };
  showScreen("result");
  Sound.play(correct ? "correct" : "wrong");
}

// 결과 화면의 5대 영양소 표: 담은 양, 한 끼 기준, 상태
const NUTRIENT_ROWS = [
  { key: "carb", label: "탄수화물", unit: "g" },
  { key: "protein", label: "단백질", unit: "g" },
  { key: "fat", label: "지방", unit: "g" },
  { key: "calcium", label: "무기질(칼슘)", unit: "mg" },
  { key: "vitaminC", label: "비타민(비타민 C)", unit: "mg" },
];

function targetText(target, unit) {
  const min = Math.round(target.min);
  return target.max !== null && unit === "g" ? `${min}~${Math.round(target.max)} ${unit}` : `${min} ${unit} 이상`;
}

function amountText1(value) {
  return value < 10 ? value.toFixed(1) : String(Math.round(value));
}

function renderNutrientRows(total) {
  $("nutrient-rows").replaceChildren(
    ...NUTRIENT_ROWS.map(({ key, label, unit }) => {
      const { rate, status } = judge(total[key], mealTargets[key]);
      const tr = document.createElement("tr");
      tr.className = `status-${status.replace(" ", "-")}`;
      tr.innerHTML = `<td>${label}</td><td>${amountText1(total[key])} ${unit}</td><td>${targetText(mealTargets[key], unit)}</td><td>${Math.round(rate * 100)}% · <b>${status}</b></td>`;
      return tr;
    })
  );
}

function compareSummary(before, after) {
  const better = after.filter((rate, i) => changeArrow(before[i], rate) === "▲").length;
  if (better === 3) return "세 게이지가 모두 기준에 가까워졌어요! 👍";
  if (better > 0) return `게이지 ${better}개가 기준에 가까워졌어요. 표시선(┃)이 고치기 전 위치예요.`;
  return "아직 나아진 게이지가 없어요. 표시선(┃)이 고치기 전 위치예요.";
}

/* ---------- 시작 ---------- */

function resetGame() {
  tray = Array(SLOT_COUNT).fill(null);
  selectedSlot = null;
  prediction = null;
  lastResult = null;
  attempt = 0;
  renderTray();
  showScreen("start");
}

$("start").addEventListener("click", () => {
  Sound.play("start");
  showScreen("tray");
});
$("counter-prev").addEventListener("click", () => {
  Sound.play("click");
  scrollCounter(-1);
});
$("counter-next").addEventListener("click", () => {
  Sound.play("click");
  scrollCounter(1);
});
$("counter").addEventListener("scroll", updateCounterArrows);
$("scoop-minus").addEventListener("click", () => changeScoop(-SCOOP_STEP));
$("scoop-plus").addEventListener("click", () => changeScoop(SCOOP_STEP));
$("done").addEventListener("click", () => {
  Sound.play("click");
  openPredict();
});
$("show-result").addEventListener("click", showResult);
$("fix").addEventListener("click", () => {
  Sound.play("click");
  showScreen("tray"); // 담은 식판을 그대로 두고 돌아갑니다.
});
$("finish").addEventListener("click", () => {
  Sound.play("click");
  resetGame();
});

renderCounter();
resetGame();
