// ==================== 儲存與讀取 ====================
document.getElementById("method").addEventListener("change", function () {
  document.getElementById("karvonenBox").style.display = this.value === "karvonen" ? "block" : "none";
  saveSettings();
  calculate();
});
document.getElementById("paceBasis").addEventListener("change", function () {
  let isRace = this.value === "race";
  document.getElementById("trainingPaceBox").style.display = isRace ? "none" : "block";
  document.getElementById("racePaceBox").style.display = isRace ? "block" : "none";
  saveSettings();
  calculate();
});
document.getElementById("goal").addEventListener("change", function () {
  document.getElementById("weeks").value = autoFillWeeks(this.value);
  document.getElementById("weeksHint").innerText = getRecommendedWeeks(this.value);
  saveSettings();
  calculate();
});
document.getElementById("mileage").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("days").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("age").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("gender").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("trainingPace").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("raceDist").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("raceTime").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("maxHr").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("restHr").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("weeks").addEventListener("change", function() { saveSettings(); calculate(); });
document.getElementById("exportIcsBtn").addEventListener("click", exportToIcs);
document.getElementById("resetStorageBtn").addEventListener("click", resetStorage);
document.getElementById("calculateBtn").addEventListener("click", calculate);

function saveSettings() {
  let settings = {
    mileage: document.getElementById("mileage").value,
    days: document.getElementById("days").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    paceBasis: document.getElementById("paceBasis").value,
    trainingPace: document.getElementById("trainingPace").value,
    raceDist: document.getElementById("raceDist").value,
    raceTime: document.getElementById("raceTime").value,
    method: document.getElementById("method").value,
    maxHr: document.getElementById("maxHr").value,
    restHr: document.getElementById("restHr").value,
    goal: document.getElementById("goal").value,
    weeks: document.getElementById("weeks").value
  };
  localStorage.setItem("runningSettings", JSON.stringify(settings));
}

function loadSettings() {
  let saved = localStorage.getItem("runningSettings");
  if (!saved) return;
  let s = JSON.parse(saved);
  document.getElementById("mileage").value = s.mileage || 50;
  document.getElementById("days").value = s.days || 5;
  document.getElementById("age").value = s.age || 35;
  document.getElementById("gender").value = s.gender || "male";
  document.getElementById("paceBasis").value = s.paceBasis || "training";
  document.getElementById("trainingPace").value = s.trainingPace || "6:00";
  document.getElementById("raceDist").value = s.raceDist || "10K";
  document.getElementById("raceTime").value = s.raceTime || "48:00";
  document.getElementById("method").value = s.method || "basic";
  document.getElementById("maxHr").value = s.maxHr || "";
  document.getElementById("restHr").value = s.restHr || 60;
  document.getElementById("goal").value = s.goal || "HM";
  document.getElementById("weeks").value = s.weeks || 12;

  let isRace = document.getElementById("paceBasis").value === "race";
  document.getElementById("trainingPaceBox").style.display = isRace ? "none" : "block";
  document.getElementById("racePaceBox").style.display = isRace ? "block" : "none";
  let method = document.getElementById("method").value;
  document.getElementById("karvonenBox").style.display = method === "karvonen" ? "block" : "none";
  document.getElementById("weeksHint").innerText = getRecommendedWeeks(document.getElementById("goal").value);
}

function resetStorage() {
  localStorage.removeItem("runningSettings");
  location.reload();
}

// ==================== 輔助函數 ====================
function paceToSec(p) {
  let parts = p.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function secToPace(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  if (s < 10) s = "0" + s;
  return m + ":" + s;
}

function formatTime(sec) {
  sec = Math.round(sec);
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = sec % 60;
  if (s < 10) s = "0" + s;
  if (m < 10 && h > 0) m = "0" + m;
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function getRecommendedWeeks(goal) {
  if (goal === "5K") return "📌 建議 6–8 週";
  if (goal === "10K") return "📌 建議 8–10 週";
  if (goal === "HM") return "📌 建議 10–14 週";
  if (goal === "FM") return "📌 建議 12–16 週";
  return "";
}

function autoFillWeeks(goal) {
  if (goal === "5K") return 8;
  if (goal === "10K") return 10;
  if (goal === "HM") return 12;
  if (goal === "FM") return 16;
  return 8;
}

function smartParseTime(input) {
  if (!input) return null;
  let str = input.trim();
  if (str.includes(":")) return paceToSec(str);
  let digits = str.replace(/\D/g, '');
  if (digits.length === 4) {
    let m = parseInt(digits.substring(0,2));
    let s = parseInt(digits.substring(2,4));
    if (s < 60) return m * 60 + s;
  } else if (digits.length === 3) {
    let m = parseInt(digits.charAt(0));
    let s = parseInt(digits.substring(1,3));
    if (s < 60) return m * 60 + s;
  } else if (digits.length === 2) {
    return parseInt(digits);
  }
  return null;
}

function get10kPaceSec() {
  let basis = document.getElementById("paceBasis").value;
  let gender = document.getElementById("gender").value;

  if (basis === "training") {
    let trainingPace = paceToSec(document.getElementById("trainingPace").value);
    if (!trainingPace) return null;
    let pace10k = Math.round(trainingPace / 1.15);
    if (gender === "female") pace10k = Math.round(pace10k * 1.03);
    return pace10k;
  } else {
    let dist = document.getElementById("raceDist").value;
    let distKm = { "5K":5, "10K":10, "HM":21.1, "FM":42.2 }[dist];
    let timeSec = smartParseTime(document.getElementById("raceTime").value);
    if (!timeSec) {
      alert("請輸入正確嘅比賽時間");
      return null;
    }
    let avgPace = timeSec / distKm;
    let t10k = avgPace * distKm * Math.pow(10 / distKm, 1.06);
    let pace10k = Math.round(t10k / 10);
    if (gender === "female") pace10k = Math.round(pace10k * 1.03);
    return pace10k;
  }
}

// ==================== 配速區間（連夏季建議）====================
function getPaceZones(pace10k) {
  let normal = {
    recovery: secToPace(Math.round(pace10k * 1.25)),
    easy: secToPace(Math.round(pace10k * 1.15)),
    long: secToPace(Math.round(pace10k * 1.07)),
    tempo: secToPace(Math.round(pace10k * 1.02)),
    interval: secToPace(Math.round(pace10k * 0.92))
  };

  let summerPace = pace10k * 1.04;
  let summer = {
    recovery: secToPace(Math.round(summerPace * 1.25)),
    easy: secToPace(Math.round(summerPace * 1.15)),
    long: secToPace(Math.round(summerPace * 1.07)),
    tempo: secToPace(Math.round(summerPace * 1.02)),
    interval: secToPace(Math.round(summerPace * 0.92))
  };

  return { normal, summer };
}

function renderPaceZones(zones) {
  let types = [
    { name: "恢復", key: "recovery" },
    { name: "輕鬆", key: "easy" },
    { name: "長課", key: "long" },
    { name: "節奏", key: "tempo" },
    { name: "間歇", key: "interval" }
  ];

  return `<div class="zone-card"><h3>🏃 配速區間 (/km)</h3>
    <table style="width:100%; font-size:13px; border-collapse:collapse;">
      <thead><tr><th style="text-align:left">類型</th><th style="text-align:left">正常配速</th><th style="text-align:left">☀️ 夏季建議</th></tr></thead>
      <tbody>
        ${types.map(t => `<tr>
          <td style="padding:4px 0">${t.name}</td>
          <td style="padding:4px 0">${zones.normal[t.key]}</td>
          <td style="padding:4px 0; color:#ff9500">${zones.summer[t.key]}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="hint" style="margin-top:8px;">☀️ 夏季建議配速慢4%，減低心肺負擔</div>
  </div>`;
}

// ==================== 心率區間 ====================
function getHRZones(age, method, maxHr, restHr) {
  let max;
  if (method === "basic") {
    max = 220 - age;
  } else {
    max = Number(maxHr);
    if (isNaN(max)) max = 220 - age;
  }

  let rest = Number(restHr);
  if (isNaN(rest)) rest = 60;

  function calc(p) {
    if (method === "basic") {
      return Math.round(max * p);
    } else {
      return Math.round(rest + (max - rest) * p);
    }
  }

  let z5Max = calc(1.0);
  if (isNaN(z5Max)) z5Max = method === "basic" ? max : Math.round(rest + (max - rest));

  return {
    z1: [calc(0.5), calc(0.6)],
    z2: [calc(0.6), calc(0.7)],
    z3: [calc(0.7), calc(0.8)],
    z4: [calc(0.8), calc(0.9)],
    z5: [calc(0.9), z5Max]
  };
}

// ==================== 預測比賽時間 ====================
function predictRace(pace10k, mileage) {
  let gender = document.getElementById("gender").value;
  let t10k = pace10k * 10;
  function riegel(t1, d1, d2) { return t1 * Math.pow(d2 / d1, 1.06); }
  let raw = {
    "5K": riegel(t10k, 10, 5),
    "10K": t10k,
    "HM": riegel(t10k, 10, 21.1),
    "FM": riegel(t10k, 10, 42.2)
  };

  if (gender === "female") {
    raw["5K"] = Math.round(raw["5K"] * 1.07);
    raw["10K"] = Math.round(raw["10K"] * 1.08);
    raw["HM"] = Math.round(raw["HM"] * 1.10);
    raw["FM"] = Math.round(raw["FM"] * 1.12);
  }

  if (mileage < 40) raw["FM"] = Math.round(raw["FM"] * 1.15);
  else if (mileage < 50) raw["FM"] = Math.round(raw["FM"] * 1.10);
  else if (mileage < 70) raw["FM"] = Math.round(raw["FM"] * 1.05);

  return raw;
}

// ==================== 訓練計劃 ====================
function getTaperMultiplier(weeksToRace) {
  if (weeksToRace >= 3) return 1.0;
  if (weeksToRace === 2) return 0.8;
  if (weeksToRace === 1) return 0.6;
  return 0;
}

function getEasyMinutes(week, totalWeeks, goal) {
  let weeksToRace = totalWeeks - week;
  let progress = Math.min(1, week / totalWeeks);
  let maxMin = goal === "FM" ? 60 : 55;
  let base = Math.round(30 + (maxMin - 30) * progress);
  let taper = getTaperMultiplier(weeksToRace);
  let result = Math.max(20, Math.round(base * taper));
  if (weeksToRace === 1) return Math.min(result, 35);
  return result;
}

function getRecoveryMinutes(goal) {
  return goal === "FM" ? 30 : 25;
}

function getTempoMinutes(goal, weeksToRace) {
  let base = { "5K":15, "10K":20, "HM":30, "FM":40 }[goal] || 20;
  let taper = getTaperMultiplier(weeksToRace);
  let result = Math.round(base * taper);
  if (weeksToRace === 1) return Math.max(8, result);
  return result;
}

function getLongRunKm(week, totalWeeks, goal) {
  let weeksToRace = totalWeeks - week;
  let baseLong = { "5K":6, "10K":8, "HM":12, "FM":16 }[goal];
  let maxLong = { "5K":14, "10K":18, "HM":24, "FM":35 }[goal];
  let progress = Math.min(1, week / totalWeeks);
  let km = Math.round(baseLong + (maxLong - baseLong) * progress);
  if (weeksToRace === 3) return Math.round(km * 0.85);
  if (weeksToRace === 2) return Math.round(km * 0.65);
  if (weeksToRace === 1) return Math.round(km * 0.35);
  return km;
}

function getIntervalPace(dist, pace10k) {
  if (dist === "400m") return secToPace(Math.round(pace10k * 0.89));
  if (dist === "800m") return secToPace(Math.round(pace10k * 0.93));
  return secToPace(Math.round(pace10k * 0.945));
}

function getInterval(w, pace10k, weeksToRace) {
  let sets = [
    { d: "400m x6", rest: 90, dist: "400m" },
    { d: "400m x8", rest: 80, dist: "400m" },
    { d: "800m x5", rest: 120, dist: "800m" },
    { d: "1k x5", rest: 150, dist: "1k" },
    { d: "1.2k x4", rest: 180, dist: "1.2k" }
  ];
  if (weeksToRace === 2) return "4 x 200m 輕快跑";
  if (weeksToRace === 1) return "3 x 100m 放鬆跑";
  let s = sets[w % sets.length];
  let pace = getIntervalPace(s.dist, pace10k);
  let restMin = Math.floor(s.rest / 60);
  let restSec = s.rest % 60;
  let restStr = restMin > 0 ? `${restMin}:${restSec.toString().padStart(2,'0')}` : `${restSec}秒`;
  return `${s.d} @ ${pace} (休 ${restStr})`;
}

function buildWeek(days, paces, longKm, interval, goal, week, totalWeeks, pace10k) {
  let weeksToRace = totalWeeks - week;
  let easyMin = getEasyMinutes(week, totalWeeks, goal);
  let recoveryMin = getRecoveryMinutes(goal);
  let tempoMin = getTempoMinutes(goal, weeksToRace);
  let tempoPace = secToPace(Math.round(pace10k * 1.02));

  let baseWeek = [
    { day: "星期一", type: "休息", detail: "-" },
    { day: "星期二", type: "間歇跑", detail: interval },
    { day: "星期三", type: "恢復跑", detail: `${recoveryMin}分鐘 @ ${paces.recovery}` },
    { day: "星期四", type: "節奏跑", detail: `10熱身 + ${tempoMin}節奏 + 10緩和 @ ${tempoPace}` },
    { day: "星期五", type: "休息", detail: "-" },
    { day: "星期六", type: "輕鬆跑", detail: `${easyMin}分鐘 @ ${paces.easy}` },
    { day: "星期日", type: "長課", detail: `${longKm}公里 @ ${paces.long}` }
  ];

  if (weeksToRace === 0) {
    baseWeek[6] = { day: "星期日", type: "比賽日", detail: `${goal} 加油！` };
  }

  if (days <= 2) {
    return [
      { day: "星期四", type: "輕鬆跑", detail: `${easyMin}分鐘 @ ${paces.easy}` },
      { day: "星期日", type: "長課", detail: `${Math.round(longKm * 0.7)}公里 @ ${paces.long}` }
    ];
  }

  let keep = ["間歇跑", "恢復跑", "節奏跑", "輕鬆跑", "長課"];
  if (days === 3) keep = ["間歇跑", "節奏跑", "長課"];
  if (days === 4) keep = ["間歇跑", "恢復跑", "節奏跑", "長課"];

  return baseWeek.filter(d => keep.includes(d.type) || d.type === "休息");
}

function generatePlan(pace10k, goal, weeks, days) {
  let paces = getPaceZones(pace10k).normal;
  let plan = [];
  for (let w = 0; w < weeks; w++) {
    let longKm = getLongRunKm(w + 1, weeks, goal);
    let interval = getInterval(w, pace10k, weeks - w);
    let weekDays = buildWeek(days, paces, longKm, interval, goal, w + 1, weeks, pace10k);
    plan.push({ week: w + 1, days: weekDays });
  }
  return plan;
}

// ==================== 渲染 ====================
function renderPlan(plan) {
  let html = "";
  for (let w of plan) {
    html += `<h4>📆 第 ${w.week} 週</h4>`;
    html += `<div class="table-responsive">`;
    html += `<table class="plan-table">`;
    html += `<thead>`;
    html += `<tr><th>星期</th><th>類型</th><th>訓練內容</th></tr>`;
    html += `</thead><tbody>`;
    for (let d of w.days) {
      html += `<tr>`;
      html += `<td>${d.day}</td>`;
      html += `<td>${d.type}</td>`;
      html += `<td>${d.detail || "-"}</td>`;
      html += `</tr>`;
    }
    html += `</tbody>`;
    html += `</table>`;
    html += `</div>`;
  }
  return html;
}

// ==================== 匯出日曆 ====================
function exportToIcs() {
  let plan = window.lastPlan;
  if (!plan) { alert("請先計算訓練計劃"); return; }
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\n";
  let startDate = new Date();
  startDate.setDate(startDate.getDate() + (1 - startDate.getDay()));
  plan.forEach((week, wi) => {
    week.days.forEach((day, di) => {
      if (day.type === "休息") return;
      let date = new Date(startDate);
      date.setDate(startDate.getDate() + wi * 7 + di);
      let ds = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      let de = new Date(date);
      de.setHours(de.getHours() + 1);
      let deStr = de.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      ics += `BEGIN:VEVENT\nDTSTART:${ds}\nDTEND:${deStr}\nSUMMARY:${day.type}: ${day.detail}\nEND:VEVENT\n`;
    });
  });
  ics += "END:VCALENDAR";
  let blob = new Blob([ics], { type: "text/calendar" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "training.ics";
  link.click();
}

// ==================== 主函數 ====================
function calculate() {
  let mileage = Number(document.getElementById("mileage").value);
  let days = Number(document.getElementById("days").value);
  let age = Number(document.getElementById("age").value);
  let method = document.getElementById("method").value;
  let maxHr = document.getElementById("maxHr").value;
  let restHr = Number(document.getElementById("restHr").value);

  if (method === "karvonen" && (!maxHr || !restHr)) {
    alert("請輸入 Max HR 同 Rest HR");
    return;
  }

  let goal = document.getElementById("goal").value;
  let weeks = Number(document.getElementById("weeks").value) || 8;

  if (mileage < 15) {
    document.getElementById("result").innerHTML = `<div class="warning">🏃 每週跑量 ${mileage}km，建議先輕鬆跑，每週 2-3 次，每次 20-30 分鐘，達到 15km 以上再使用課表。</div>`;
    return;
  }

  let pace10k = get10kPaceSec();
  if (!pace10k) return;

  let zones = getPaceZones(pace10k);
  let paceHtml = renderPaceZones(zones);

  let hr = getHRZones(age, method, maxHr, restHr);
  let race = predictRace(pace10k, mileage);
  let plan = generatePlan(pace10k, goal, weeks, days);
  window.lastPlan = plan;

  let displayRace = {};
  if (goal === "5K") displayRace = { "5K": race["5K"], "10K": race["10K"] };
  else if (goal === "10K") displayRace = { "5K": race["5K"], "10K": race["10K"], "HM": race["HM"] };
  else displayRace = race;

  let hrHtml = `<div class="zone-card"><h3>❤️ 心率區間 (bpm)</h3>
    <p>Z1 恢復: ${hr.z1[0]}–${hr.z1[1]}</p>
    <p>Z2 有氧: ${hr.z2[0]}–${hr.z2[1]}</p>
    <p>Z3 耐力: ${hr.z3[0]}–${hr.z3[1]}</p>
    <p>Z4 閾值: ${hr.z4[0]}–${hr.z4[1]}</p>
    <p>Z5 最大: ${hr.z5[0]}–${hr.z5[1]}</p>
  </div>`;

  let raceHtml = `<div class="prediction-card"><h3>🏁 預測比賽時間</h3><div class="prediction-grid">`;
  for (let [d, t] of Object.entries(displayRace)) {
    raceHtml += `<div class="prediction-item">${d}: ${formatTime(t)}</div>`;
  }
  raceHtml += `</div>`;
  if (goal === "FM" && mileage < 50) raceHtml += `<div class="warning">⚠️ 跑量不足，全馬預測可能偏快</div>`;
  raceHtml += `</div>`;

  let planHtml = `<h3>📅 訓練計劃</h3>${renderPlan(plan)}`;

  document.getElementById("result").innerHTML = `<div class="two-columns">${hrHtml}${paceHtml}</div>${raceHtml}${planHtml}`;
  saveSettings();
}

window.onload = function() {
  loadSettings();
  calculate();
};