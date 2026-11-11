// 픽셀 게임 느낌의 8비트 효과음. 음악 파일 없이 브라우저가 직접 소리를 만듭니다.
const Sound = (() => {
  const STORAGE_KEY = "oneului-sikpan-sound";
  let enabled = localStorage.getItem(STORAGE_KEY) !== "off";
  let context = null;

  // 음 하나: 주파수(Hz), 시작 시각(초 뒤), 길이(초)
  function tone(frequency, start, duration, type = "square", volume = 0.06) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const at = context.currentTime + start;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + duration);
  }

  // 효과음 이름마다 [주파수, 시작, 길이] 목록
  const sounds = {
    click: [[660, 0, 0.05]],
    pick: [[520, 0, 0.06]],
    drop: [[440, 0, 0.06], [880, 0.06, 0.1]],
    remove: [[440, 0, 0.06], [220, 0.06, 0.1]],
    up: [[660, 0, 0.05], [990, 0.05, 0.06]],
    down: [[660, 0, 0.05], [440, 0.05, 0.06]],
    select: [[784, 0, 0.08]],
    start: [[523, 0, 0.08], [659, 0.08, 0.08], [784, 0.16, 0.08], [1047, 0.24, 0.16]],
    correct: [[659, 0, 0.1], [784, 0.1, 0.1], [1047, 0.2, 0.25]],
    wrong: [[392, 0, 0.12], [330, 0.12, 0.12], [262, 0.24, 0.22]],
    save: [[880, 0, 0.06], [1175, 0.06, 0.12]],
  };

  function play(name) {
    if (!enabled || !sounds[name]) return;
    context ??= new AudioContext();
    if (context.state === "suspended") context.resume();
    for (const [frequency, start, duration] of sounds[name]) tone(frequency, start, duration);
  }

  function updateButton() {
    const button = document.getElementById("sound-toggle");
    button.textContent = enabled ? "🔊" : "🔇";
    button.setAttribute("aria-label", enabled ? "효과음 끄기" : "효과음 켜기");
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateButton();
    document.getElementById("sound-toggle").addEventListener("click", () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
      updateButton();
      play("click");
    });
  });

  return { play };
})();
