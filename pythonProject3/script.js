let currentPlanId = null;

// ===== UI 元素綁定 =====
document.getElementById("method").addEventListener("change", function () {
  document.getElementById("karvonenBox").style.display = this.value === "karvonen" ? "block" : "none";
  saveSettings();
  autoRecalculate();
});
document.getElementById("paceBasis").addEventListener("change", function () {
  let isRace = this.value === "race";
  document.getElementById("trainingPaceBox").style.display = isRace ? "none" : "block";
  document.getElementById("racePaceBox").style.display = isRace ? "block" : "none";
  saveSettings();
  autoRecalculate();
});
document.getElementById("goal").addEventListener("change", function () {
  let goal = this.value;
  document.getElementById("weeks").value = autoFillWeeks(goal);
  document.getElementById("weeksHint").innerText = getRecommendedWeeks(goal);
  saveSettings();
  autoRecalculate();
});
document.getElementById("summerMode").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("mileage").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("days").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("age").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("gender").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("trainingPace").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("raceDist").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("raceTime").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("maxHr").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("restHr").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
document.getElementById("weeks").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
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
    weeks: document.getElementById("weeks").value,
    summerMode: document.getElementById("summerMode").checked
  };
  localStorage.setItem("runningDashboardSettings", JSON.stringify(settings));
}

function loadSettings() {
  let saved = localStorage.getItem("runningDashboardSettings");
  if (!saved) return;
  let s = JSON.parse(saved);
  document.getElementById("mileage").value = s.mileage || 50;
  document.getElementById("days").value = s.days || 5;
  document.getElementById("age").value = s.age || 35;
  if (document.getElementById("gender")) document.getElementById("gender").value = s.gender || "male";
  document.getElementById("paceBasis").value = s.paceBasis || "training";
  document.getElementById("trainingPace").value = s.trainingPace || "6:00";
  document.getElementById("raceDist").value = s.raceDist || "10K";
  document.getElementById("raceTime").value = s.raceTime || "48:00";
  document.getElementById("method").value = s.method || "basic";
  document.getElementById("maxHr").value = s.maxHr || "";
  document.getElementById("restHr").value = s.restHr || 60;
  document.getElementById("goal").value = s.goal || "HM";
  document.getElementById("weeks").value = s.weeks || 12;
  document.getElementById("summerMode").checked = s.summerMode || false;
  let isRace = document.getElementById("paceBasis").value === "race";
  document.getElementById("trainingPaceBox").style.display = isRace ? "none" : "block";
  document.getElementById("racePaceBox").style.display = isRace ? "block" : "none";
  let method = document.getElementById("method").value;
  document.getElementById("karvonenBox").style.display = method === "karvonen" ? "block" : "none";
  let goal = document.getElementById("goal").value;
  document.getElementById("weeksHint").innerText = getRecommendedWeeks(goal);
}

function resetStorage() {
  localStorage.removeItem("runningDashboardSettings");
  location.reload();
}

function autoRecalculate() {
  let mileage = document.getElementById("mileage").value;
  if (mileage && mileage > 0) calculate();
}

// ===== 輔助函數 =====
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

function applySummerAdjustment(pace10kSec, isSummer) {
  if (!isSummer) return pace10kSec;
  return Math.round(pace10kSec * 1.04);
}

function smartParseRaceTime(input) {
  if (!input || input.trim() === "") return null;
  let str = input.trim();
  if (str.includes(":")) return paceToSec(str);
  let digits = str.replace(/\D/g, '');
  if (digits.length === 0) return null;
  if (digits.length === 4) {
    let m = parseInt(digits.substring(0,2));
    let s = parseInt(digits.substring(2,4));
    if (s < 60) return m*60 + s;
  } else if (digits.length === 3) {
    let m = parseInt(digits.charAt(0));
    let s = parseInt(digits.substring(1,3));
    if (s < 60) return m*60 + s;
  } else if (digits.length === 2) {
    return parseInt(digits);
  }
  return null;
}

function get10kPaceSec() {
  let basis = document.getElementById("paceBasis").value;
  let isSummer = document.getElementById("summerMode").checked;
  let gender = document.getElementById("gender").value;
  if (basis === "training") {
    let trainingPaceSec = paceToSec(document.getElementById("trainingPace").value);
    if (!trainingPaceSec) return null;
    let pace10k = Math.round(trainingPaceSec / 1.15);
    let adjusted = applySummerAdjustment(pace10k, isSummer);
    if (gender === "female") adjusted = Math.round(adjusted * 1.03);
    return adjusted;
  } else {
    let raceDist = document.getElementById("raceDist").value;
    let distKm = { "5K":5, "10K":10, "HM":21.1, "FM":42.2 }[raceDist];
    let rawTime = document.getElementById("raceTime").value;
    let raceTimeSec = smartParseRaceTime(rawTime);
    if (!raceTimeSec) {
      alert("請輸入正確嘅比賽時間");
      return null;
    }
    let avgPaceSec = raceTimeSec / distKm;
    let t10k = avgPaceSec * distKm * Math.pow(10 / distKm, 1.06);
    let pace10k = Math.round(t10k / 10);
    let adjusted = applySummerAdjustment(pace10k, isSummer);
    if (gender === "female") adjusted = Math.round(adjusted * 1.03);
    return adjusted;
  }
}

function getPaceZonesFrom10k(pace10kSec) {
  return {
    recovery: secToPace(Math.round(pace10kSec * 1.25)),
    easy: secToPace(Math.round(pace10kSec * 1.15)),
    long: secToPace(Math.round(pace10kSec * 1.07)),
    tempo: secToPace(Math.round(pace10kSec * 1.02)),
    interval: secToPace(Math.round(pace10kSec * 0.92))
  };
}

function predictRaceWithMileage(pace10kSec, mileage, goalFilter = null) {
  let gender = document.getElementById("gender").value;
  let t10kSec = pace10kSec * 10;
  function riegel(t1, d1, d2) { return t1 * Math.pow(d2 / d1, 1.06); }
  let raw = {
    "5K": riegel(t10kSec, 10, 5),
    "10K": t10kSec,
    "HM": riegel(t10kSec, 10, 21.1),
    "FM": riegel(t10kSec, 10, 42.2)
  };
  if (gender === "female") {
    let factor = { "5K": 1.07, "10K": 1.08, "HM": 1.10, "FM": 1.12 };
    raw["5K"] = Math.round(raw["5K"] * factor["5K"]);
    raw["10K"] = Math.round(raw["10K"] * factor["10K"]);
    raw["HM"] = Math.round(raw["HM"] * factor["HM"]);
    raw["FM"] = Math.round(raw["FM"] * factor["FM"]);
  }
  let adj = { ...raw };
  if (mileage < 30) { adj.HM = raw.HM * 1.15; adj.FM = raw.FM * 1.25; }
  else if (mileage < 40) { adj.HM = raw.HM * 1.10; adj.FM = raw.FM * 1.15; }
  else if (mileage < 50) { adj.HM = raw.HM * 1.05; adj.FM = raw.FM * 1.10; }
  else if (mileage < 70) { adj.HM = raw.HM * 1.00; adj.FM = raw.FM * 1.05; }
  else if (mileage < 90) { adj.HM = raw.HM * 0.98; adj.FM = raw.FM * 1.00; }
  else { adj.HM = raw.HM * 0.96; adj.FM = raw.FM * 0.98; }
  for (let k in adj) adj[k] = Math.round(adj[k]);
  if (goalFilter === "5K") return { "5K": adj["5K"], "10K": adj["10K"] };
  if (goalFilter === "10K") return { "5K": adj["5K"], "10K": adj["10K"], "HM": adj["HM"] };
  return adj;
}

function getHRZones(age, method, maxHr, restHr) {
  let max = method === "basic" ? 220 - age : Number(maxHr);
  let calc = (p) => method === "basic" ? Math.round(max * p) : Math.round(restHr + (max - restHr) * p);
  return {
    z1: [calc(0.5), calc(0.6)],
    z2: [calc(0.6), calc(0.7)],
    z3: [calc(0.7), calc(0.8)],
    z4: [calc(0.8), calc(0.9)],
    z5: [calc(0.9), 1.0]
  };
}

// ===== Taper 與訓練量 =====
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

function getRecoveryMinutes(goal) { return goal === "FM" ? 30 : 25; }

function getTempoMinutes(goal, weeksToRace) {
  let base = { "5K":15, "10K":20, "HM":30, "FM":40 }[goal] || 20;
  let taper = getTaperMultiplier(weeksToRace);
  let result = Math.round(base * taper);
  if (weeksToRace === 1) return Math.max(8, result);
  if (weeksToRace === 0) return 0;
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
  if (weeksToRace === 0) return 0;
  return km;
}

function getIntervalPace(distance, pace10kSec) {
  let multiplier;
  if (distance === "400m") multiplier = 0.89;
  else if (distance === "800m") multiplier = 0.93;
  else multiplier = 0.945;
  return secToPace(Math.round(pace10kSec * multiplier));
}

function getTempoPace(tempoMinutes, baseTempoPaceSec) {
  if (tempoMinutes <= 15) return secToPace(Math.round(baseTempoPaceSec * 0.98));
  if (tempoMinutes <= 25) return secToPace(baseTempoPaceSec);
  if (tempoMinutes <= 35) return secToPace(Math.round(baseTempoPaceSec * 1.02));
  return secToPace(Math.round(baseTempoPaceSec * 1.04));
}

function getInterval(w, pace10kSec, goal, weeksToRace) {
  let sets = [
    { d: "400m x6", rest: 90, dist: "400m" },
    { d: "400m x8", rest: 80, dist: "400m" },
    { d: "800m x5", rest: 120, dist: "800m" },
    { d: "1k x5", rest: 150, dist: "1k" },
    { d: "1.2k x4", rest: 180, dist: "1.2k" }
  ];
  if (weeksToRace === 2) return `4 x 200m strides (輕快) @ ${secToPace(Math.round(pace10kSec * 0.95))}`;
  if (weeksToRace === 1) return `3 x 100m strides (放鬆) @ 接近比賽配速`;
  if (weeksToRace === 0) return `🏁 比賽日`;
  let s = sets[w % sets.length];
  let pace = getIntervalPace(s.dist, pace10kSec);
  let restMin = Math.floor(s.rest / 60);
  let restSec = s.rest % 60;
  let restStr = restMin > 0 ? `${restMin}:${restSec.toString().padStart(2,'0')}` : `${restSec}秒`;
  return `${s.d} @ ${pace} (休 ${restStr})`;
}

// 計算每週跑量（用於判斷 Cross Training 建議）
function getWeeklyMileage(week, totalWeeks, baseMileage) {
  let progress = week / totalWeeks;
  let peakMileage = baseMileage * 1.3;
  return Math.round(baseMileage + (peakMileage - baseMileage) * progress);
}

function buildWeek(days, paces, longRunKm, interval, goal, week, totalWeeks, pace10kSec, baseMileage) {
  let weeksToRace = totalWeeks - week;
  let easyMin = getEasyMinutes(week, totalWeeks, goal);
  let recoveryMin = getRecoveryMinutes(goal);
  let tempoMin = getTempoMinutes(goal, weeksToRace);
  let baseTempoPaceSec = pace10kSec * 1.02;
  let tempoPace = getTempoPace(tempoMin, baseTempoPaceSec);
  let tempoDetail = (weeksToRace === 0) ? "🏁 比賽日" : `10WU + ${tempoMin}T + 10CD @ ${tempoPace}`;

  // 判斷是否建議 Cross Training
  let weeklyMileage = getWeeklyMileage(week, totalWeeks, baseMileage);
  let suggestCross = weeklyMileage >= 70;

  // Cross Training 選項
  let recoveryDetail = `
    <div class="workout-choice" data-week="${week}" data-day="星期三">
      <label><input type="radio" name="wed_choice_${week}" value="run" ${suggestCross ? '' : 'checked'}> 恢復跑 ${recoveryMin}min @ ${paces.recovery}</label>
      <label><input type="radio" name="wed_choice_${week}" value="cross" ${suggestCross ? 'checked' : ''}> 交叉訓練（游泳/單車/肌力）30min</label>
    </div>
  `;

  let baseWeek = [
    { day: "星期一", type: "休息", detail: "-" },
    { day: "星期二", type: "間歇跑", detail: interval },
    { day: "星期三", type: "恢復跑 / 交叉訓練", detail: recoveryDetail },
    { day: "星期四", type: "節奏跑", detail: tempoDetail },
    { day: "星期五", type: "休息", detail: "-" },
    { day: "星期六", type: "輕鬆跑", detail: `${easyMin}min 輕鬆跑 @ ${paces.easy}` },
    { day: "星期日", type: "長課", detail: (weeksToRace === 0) ? "🏁 比賽日" : `${longRunKm}km 長課 @ ${paces.long}` }
  ];

  if (weeksToRace === 0) {
    baseWeek[6].type = "🏁 比賽日";
    baseWeek[6].detail = `${goal} 比賽日！加油！`;
    return baseWeek;
  }

  let weekPlan = JSON.parse(JSON.stringify(baseWeek));
  if (days <= 2) {
    weekPlan = weekPlan.map(d => ({ day: d.day, type: "休息", detail: "-" }));
    weekPlan[3] = { day: "星期四", type: "輕鬆跑", detail: `${easyMin}min 輕鬆跑 @ ${paces.easy}` };
    weekPlan[6] = { day: "星期日", type: "長課", detail: `${Math.round(longRunKm * 0.7)}km 長課 @ ${paces.long}` };
    return weekPlan;
  }
  let keepTypes = {
    3: ["間歇跑", "節奏跑", "長課"],
    4: ["間歇跑", "恢復跑 / 交叉訓練", "節奏跑", "長課"],
    5: ["間歇跑", "恢復跑 / 交叉訓練", "節奏跑", "輕鬆跑", "長課"]
  };
  if (keepTypes[days]) return weekPlan.map(d => keepTypes[days].includes(d.type) ? d : { day: d.day, type: "休息", detail: "-" });
  if (days === 6) return weekPlan.map(d => d.day === "星期五" ? { day: "星期五", type: "輕鬆跑", detail: `${easyMin}min 輕鬆跑 @ ${paces.easy}` } : d);
  return weekPlan;
}

function generatePlan(paces, goal, weeks, days, pace10kSec, baseMileage) {
  let plan = [];
  for (let w = 0; w < weeks; w++) {
    let longKm = getLongRunKm(w+1, weeks, goal);
    let interval = getInterval(w, pace10kSec, goal, weeks - w);
    let weekDays = buildWeek(days, paces, longKm, interval, goal, w+1, weeks, pace10kSec, baseMileage);
    plan.push({ week: w+1, days: weekDays });
  }
  return plan;
}

function renderPlan(plan) {
  let html = "";
  for (let w of plan) {
    html += `<h4>📆 第 ${w.week} 週</h4>`;
    html += `<div class="table-responsive">`;
    html += `<table class="plan-table">`;
    html += `<thead>`;
    html += `<tr><th>星期</th><th>類型</th><th>訓練內容</th>`;
    html += `</thead><tbody>`;
    for (let d of w.days) {
      html += `<tr>`;
      html += `<td>${d.day}</td>`;
      html += `<td>${d.type}</td>`;
      html += `<td class="workout-detail">${d.detail || "-"}侧`;
      html += `</tr>`;
    }
    html += `</tbody>`;
    html += ` licensierad`;
    html += `</div>`;
  }
  return html;
}

// 綁定 radio 選擇事件（儲存到 localStorage，簡化版唔儲存，只係 UI）
// 簡化版：唔儲存用戶選擇，每次重新整理回復預設

function exportToIcs() {
  let plan = window.lastGeneratedPlan;
  if (!plan || plan.length === 0) { alert("請先計算訓練計劃"); return; }
  let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Running Dashboard//EN\n";
  let startDate = new Date();
  startDate.setDate(startDate.getDate() + (1 - startDate.getDay()));
  plan.forEach((week, wi) => {
    week.days.forEach((day, di) => {
      if (day.type === "休息") return;
      if (day.type.includes("比賽日")) return;
      let eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + (wi * 7) + di);
      let summary = `${day.type}: ${day.detail}`;
      let dtStart = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      let dtEnd = new Date(eventDate);
      dtEnd.setHours(dtEnd.getHours() + 1);
      let dtEndStr = dtEnd.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      icsContent += `BEGIN:VEVENT\nDTSTART:${dtStart}\nDTEND:${dtEndStr}\nSUMMARY:${summary}\nEND:VEVENT\n`;
    });
  });
  icsContent += "END:VCALENDAR";
  let blob = new Blob([icsContent], { type: "text/calendar" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "training_plan.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function calculate() {
  let baseMileage = Number(document.getElementById("mileage").value);
  let days = Number(document.getElementById("days").value);
  let age = Number(document.getElementById("age").value);
  let method = document.getElementById("method").value;
  let maxHr = document.getElementById("maxHr").value;
  let restHr = Number(document.getElementById("restHr").value);
  if (method === "karvonen" && (!maxHr || !restHr)) { alert("請輸入 Max HR 同 Rest HR"); return; }
  let goal = document.getElementById("goal").value;
  let weeks = Number(document.getElementById("weeks").value) || 8;

  if (baseMileage < 15) {
    document.getElementById("result").innerHTML = `<div class="warning">🏃 你而家每週跑量 ${baseMileage}km，建議先享受跑步，每週輕鬆跑 2-3 次，每次 20-30 分鐘，慢慢增加到 15km 以上再嚟睇課表啦！</div>`;
    return;
  }

  let pace10kSec = get10kPaceSec();
  if (!pace10kSec) { alert("請填寫正確配速或比賽時間"); return; }
  let paces = getPaceZonesFrom10k(pace10kSec);
  let hr = getHRZones(age, method, maxHr, restHr);
  let racePred = predictRaceWithMileage(pace10kSec, baseMileage);
  let displayRace = {};
  if (goal === "5K") displayRace = { "5K": racePred["5K"], "10K": racePred["10K"] };
  else if (goal === "10K") displayRace = { "5K": racePred["5K"], "10K": racePred["10K"], "HM": racePred["HM"] };
  else displayRace = racePred;

  let plan = generatePlan(paces, goal, weeks, days, pace10kSec, baseMileage);
  window.lastGeneratedPlan = plan;

  let hrHtml = `<div class="zone-card"><h3>❤️ 心率區間 (bpm)</h3>
    <p>Z1 恢復: ${hr.z1[0]}–${hr.z1[1]}</p>
    <p>Z2 有氧: ${hr.z2[0]}–${hr.z2[1]}</p>
    <p>Z3 耐力: ${hr.z3[0]}–${hr.z3[1]}</p>
    <p>Z4 閾值: ${hr.z4[0]}–${hr.z4[1]}</p>
    <p>Z5 最大: ${hr.z5[0]}–${hr.z5[1]}</p>
  </div>`;
  let paceHtml = `<div class="zone-card"><h3>🏃 配速區間 (/km)</h3>
    <p>恢復: ${paces.recovery}</p>
    <p>輕鬆: ${paces.easy}</p>
    <p>長課: ${paces.long}</p>
    <p>節奏: ${paces.tempo}</p>
    <p>間歇: ${paces.interval}</p>
  </div>`;

  let raceHtml = `<div class="prediction-card"><h3>🏁 預測比賽時間</h3><div class="prediction-grid">`;
  for (let [dist, sec] of Object.entries(displayRace)) {
    raceHtml += `<div class="prediction-item">${dist}: ${formatTime(sec)}</div>`;
  }
  raceHtml += `</div>`;
  if (goal === "FM" && baseMileage < 50) raceHtml += `<div class="warning">⚠️ 每週跑量不足，預測時間可能嚴重低估</div>`;
  else if (goal === "FM") raceHtml += `<div class="warning">⚠️ 全馬受天氣、補給影響大，預測僅供參考</div>`;
  raceHtml += `</div>`;

  let planHtml = `<h3>📅 訓練計劃 (WU=熱身, T=節奏, CD=緩和)</h3>${renderPlan(plan)}`;

  document.getElementById("result").innerHTML = `<div class="two-columns">${hrHtml}${paceHtml}</div>${raceHtml}${planHtml}`;
  saveSettings();
}

window.onload = function () {
  loadSettings();
  let method = document.getElementById("method").value;
  document.getElementById("karvonenBox").style.display = method === "karvonen" ? "block" : "none";
  let goal = document.getElementById("goal").value;
  document.getElementById("weeksHint").innerText = getRecommendedWeeks(goal);
  autoRecalculate();
};