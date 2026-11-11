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
  for (const screen of ["start", "tray", "predict", "result"]) {
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

const achievement = (total, key) => total[key] / mealTarget[key];

function findLowestNutrient(total) {
  return nutrientChoices.reduce((lowest, choice) =>
    achievement(total, choice.key) < achievement(total, lowest.key) ? choice : lowest
  );
}

function energyRatio(total) {
  const carb = total.carb * 4;
  const protein = total.protein * 4;
  const fat = total.fat * 9;
  const sum = carb + protein + fat;
  return { carb: (carb / sum) * 100, protein: (protein / sum) * 100, fat: (fat / sum) * 100 };
}

function gaugeStatus(rate) {
  if (rate > 1.2) return "많음";
  if (rate >= 0.9) return "충분";
  if (rate >= 0.6) return "조금 부족";
  return "부족";
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
  tray[index] = { foodId: food.id, scoops: 1 };
  selectedSlot = index;
  renderTray();
}

function changeScoop(delta) {
  tray[selectedSlot].scoops += delta;
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

function renderRatioRows(mine) {
  const rows = [
    { key: "carb", label: "탄수화물" },
    { key: "protein", label: "단백질" },
    { key: "fat", label: "지방" },
  ];
  $("ratio-rows").replaceChildren(
    ...rows.map(({ key, label }) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><i class="dot ${key}"></i>${label}</td><td>${Math.round(mine[key])}%</td><td>${idealRatio[key]}%</td>`;
      return tr;
    })
  );
}

function renderGauges(total) {
  const gauges = [
    { label: "에너지 공급", nutrients: "탄수화물 · 단백질 · 지방", rate: achievement(total, "energy"), color: "var(--gold)" },
    {
      label: "몸의 조직 구성",
      nutrients: "단백질 · 무기질(칼슘)",
      // 한쪽이 넘쳐도 다른 쪽의 부족을 가리지 않도록 각각 100%까지만 셉니다.
      rate: (Math.min(achievement(total, "protein"), 1) + Math.min(achievement(total, "calcium"), 1)) / 2,
      color: "#8e6be8",
    },
    { label: "생리 기능 조절", nutrients: "비타민(비타민 C)", rate: achievement(total, "vitaminC"), color: "var(--green)" },
  ];

  $("gauges").replaceChildren(
    ...gauges.map(({ label, nutrients, rate, color }) => {
      const row = document.createElement("div");
      row.className = "gauge";
      row.innerHTML = `<span class="gauge-name">${label}<small>${nutrients}</small></span>
        <div class="bar"><div class="fill" style="width:${Math.min(rate, 1) * 100}%;background:${color}"></div></div>
        <span>${gaugeStatus(rate)}</span>`;
      return row;
    })
  );
}

function showResult() {
  const total = sumNutrients();
  const lowest = findLowestNutrient(total);
  const predicted = nutrientChoices.find((choice) => choice.id === prediction);
  const correct = predicted.id === lowest.id;

  const mine = energyRatio(total);
  $("donut-mine").style.background = donutStyle(mine);
  $("donut-ideal").style.background = donutStyle(idealRatio);
  renderRatioRows(mine);
  renderGauges(total);

  $("prediction-result").textContent =
    `내 예측: ${predicted.label} · 실제로 가장 부족: ${lowest.label} ${correct ? "(맞았어요!)" : "(아쉬워요!)"}`;
  $("result-speech").textContent = `가장 모자란 건 ${lowest.label}! ${lowest.hint}`;
  showScreen("result");
}

/* ---------- 시작 ---------- */

function resetGame() {
  tray = Array(SLOT_COUNT).fill(null);
  selectedSlot = null;
  prediction = null;
  renderTray();
  showScreen("start");
}

$("start").addEventListener("click", () => showScreen("tray"));
$("counter-prev").addEventListener("click", () => scrollCounter(-1));
$("counter-next").addEventListener("click", () => scrollCounter(1));
$("counter").addEventListener("scroll", updateCounterArrows);
$("scoop-minus").addEventListener("click", () => changeScoop(-SCOOP_STEP));
$("scoop-plus").addEventListener("click", () => changeScoop(SCOOP_STEP));
$("done").addEventListener("click", openPredict);
$("show-result").addEventListener("click", showResult);
$("fix").addEventListener("click", () => showScreen("tray")); // 담은 식판을 그대로 두고 돌아갑니다.
$("finish").addEventListener("click", resetGame);

renderCounter();
resetGame();
