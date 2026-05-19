// ==================== 語言包 ====================
const lang = {
  zh: {
    lblMileage: "每週跑量 (km)", lblDays: "每週訓練日數（例如 4 或 4-6）", lblAge: "年齡",
    lblGender: "性別", genderMale: "男性", genderFemale: "女性", genderPreferNot: "不便透露",
    lblPaceBasis: "配速基準", optTraining: "最近訓練平均配速", optRace: "最近比賽時間",
    lblTrainingPace: "平均配速 (mm:ss)", hintTraining: "💡 建議輸入最近2-3週嘅平均配速（唔係PB），反映當前狀態",
    lblRaceDist: "比賽距離", lblRaceTime: "完成時間", hintRace: "💡 直接輸入數字，系統自動轉換（例如 4530 = 45分30秒）",
    lblMethod: "心率方法", lblMaxHr: "Max HR", lblRestHr: "Rest HR",
    lblSummerMode: "☀️ 夏季模式 (香港夏天)", lblCrossTrain: "🔄 Cross Training (取代 Recovery Run)",
    lblGoal: "目標", lblWeeks: "訓練週數", btnCalculate: "📊 計算訓練計劃",
    recoveryRun: "恢復跑", crossTraining: "交叉訓練",
    easy: "輕鬆跑", tempo: "節奏跑", long: "長課", interval: "間歇跑", rest: "休息",
    hrZones: "心率區間 (bpm)", paceZones: "配速區間 (/km)",
    z1Recovery: "Z1 恢復", z2Easy: "Z2 有氧", z3Aerobic: "Z3 耐力", z4Threshold: "Z4 閾值", z5Max: "Z5 最大",
    paceRecovery: "恢復", paceEasy: "輕鬆", paceLong: "長課", paceTempo: "節奏", paceInterval: "間歇",
    predictTitle: "預測比賽時間", warningFMLowMileage: "每週跑量不足，預測時間可能嚴重低估",
    warningFMGeneral: "全馬受天氣、補給影響大，預測僅供參考",
    planTitle: "訓練計劃 (WU=熱身, T=節奏, CD=緩和)", week: "第", weekSuffix: "週",
    dayMon: "星期一", dayTue: "星期二", dayWed: "星期三", dayThu: "星期四", dayFri: "星期五", daySat: "星期六", daySun: "星期日",
    dayHeader: "星期", typeHeader: "類型", workoutHeader: "訓練內容"
  },
  en: {
    lblMileage: "Weekly Mileage (km)", lblDays: "Training Days/Week (e.g. 4 or 4-6)", lblAge: "Age",
    lblGender: "Gender", genderMale: "Male", genderFemale: "Female", genderPreferNot: "Prefer not to say",
    lblPaceBasis: "Pace Basis", optTraining: "Recent average training pace", optRace: "Recent race time",
    lblTrainingPace: "Average pace (mm:ss)", hintTraining: "💡 Enter your average pace from the last 2-3 weeks (not PB)",
    lblRaceDist: "Race Distance", lblRaceTime: "Finish Time", hintRace: "💡 Enter digits (e.g., 4530 = 45:30)",
    lblMethod: "HR Method", lblMaxHr: "Max HR", lblRestHr: "Rest HR",
    lblSummerMode: "☀️ Summer Mode (Hong Kong summer)", lblCrossTrain: "🔄 Cross Training (replace Recovery Run)",
    lblGoal: "Goal", lblWeeks: "Weeks", btnCalculate: "📊 Generate Plan",
    recoveryRun: "Recovery", crossTraining: "Cross Training",
    easy: "Easy", tempo: "Tempo", long: "Long", interval: "Interval", rest: "Rest",
    hrZones: "HR Zones (bpm)", paceZones: "Pace Zones (/km)",
    z1Recovery: "Z1 Recovery", z2Easy: "Z2 Easy", z3Aerobic: "Z3 Aerobic", z4Threshold: "Z4 Threshold", z5Max: "Z5 Max",
    paceRecovery: "Recovery", paceEasy: "Easy", paceLong: "Long", paceTempo: "Tempo", paceInterval: "Interval",
    predictTitle: "Predicted Race Times", warningFMLowMileage: "Weekly mileage is low, predicted time may be significantly underestimated",
    warningFMGeneral: "Marathon prediction is just a reference, actual time may be 10-20 min slower",
    planTitle: "Training Plan (WU=Warmup, T=Tempo, CD=Cool Down)", week: "Week ", weekSuffix: "",
    dayMon: "Mon", dayTue: "Tue", dayWed: "Wed", dayThu: "Thu", dayFri: "Fri", daySat: "Sat", daySun: "Sun",
    dayHeader: "Day", typeHeader: "Type", workoutHeader: "Workout"
  }
};

let currentLang = "zh";

// ==================== UI 綁定與儲存 ====================
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
document.getElementById("crossTrainMode").addEventListener("change", function() { saveSettings(); autoRecalculate(); });
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
document.getElementById("langBtn").addEventListener("click", toggleLanguage);
document.getElementById("exportIcsBtn").addEventListener("click", exportToIcs);
document.getElementById("resetStorageBtn").addEventListener("click", resetStorage);
document.getElementById("calculateBtn").addEventListener("click", calculate);

function toggleLanguage() {
  currentLang = currentLang === "zh" ? "en" : "zh";
  updateUILanguage();
  saveSettings();
  autoRecalculate();
}

function updateUILanguage() {
  const t = lang[currentLang];
  document.getElementById("lblMileage").innerText = t.lblMileage;
  document.getElementById("lblDays").innerText = t.lblDays;
  document.getElementById("lblAge").innerText = t.lblAge;
  document.getElementById("lblGender").innerText = t.lblGender;
  document.getElementById("genderMale").innerText = t.genderMale;
  document.getElementById("genderFemale").innerText = t.genderFemale;
  document.getElementById("genderPreferNot").innerText = t.genderPreferNot;
  document.getElementById("lblPaceBasis").innerText = t.lblPaceBasis;
  document.getElementById("optTraining").innerText = t.optTraining;
  document.getElementById("optRace").innerText = t.optRace;
  document.getElementById("lblTrainingPace").innerText = t.lblTrainingPace;
  document.getElementById("hintTraining").innerText = t.hintTraining;
  document.getElementById("lblRaceDist").innerText = t.lblRaceDist;
  document.getElementById("lblRaceTime").innerText = t.lblRaceTime;
  document.getElementById("hintRace").innerText = t.hintRace;
  document.getElementById("lblMethod").innerText = t.lblMethod;
  document.getElementById("lblMaxHr").innerText = t.lblMaxHr;
  document.getElementById("lblRestHr").innerText = t.lblRestHr;
  document.getElementById("lblSummerMode").innerText = t.lblSummerMode;
  document.getElementById("lblCrossTrain").innerText = t.lblCrossTrain;
  document.getElementById("lblGoal").innerText = t.lblGoal;
  document.getElementById("lblWeeks").innerText = t.lblWeeks;
  document.getElementById("btnCalculate").innerText = t.btnCalculate;
  document.getElementById("langBtn").innerText = currentLang === "zh" ? "🌐 English" : "🌐 中文";
}

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
    summerMode: document.getElementById("summerMode").checked,
    crossTrainMode: document.getElementById("crossTrainMode").checked,
    lang: currentLang
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
  document.getElementById("crossTrainMode").checked = s.crossTrainMode || false;
  if (s.lang) currentLang = s.lang;
  updateUILanguage();
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
  if (mileage && mileage > 0) {
    calculate();
  }
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
      alert(currentLang === "zh" ? "請輸入正確嘅比賽時間" : "Please enter a valid race time");
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
    z5: [calc(0.9), calc(1.0)]
  };
}

// ==================== Taper 與訓練量 ====================
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

function buildWeek(days, paces, longRunKm, interval, goal, week, totalWeeks, pace10kSec) {
  let t = lang[currentLang];
  let weeksToRace = totalWeeks - week;
  let crossTrain = document.getElementById("crossTrainMode").checked;
  let easyMin = getEasyMinutes(week, totalWeeks, goal);
  let recoveryMin = getRecoveryMinutes(goal);
  let tempoMin = getTempoMinutes(goal, weeksToRace);
  let baseTempoPaceSec = pace10kSec * 1.02;
  let tempoPace = getTempoPace(tempoMin, baseTempoPaceSec);
  let tempoDetail = (weeksToRace === 0) ? "🏁 比賽日" : `10WU + ${tempoMin}T + 10CD @ ${tempoPace}`;
  let crossTrainDetail = currentLang === "zh" ? "游泳30min / 單車45min / 肌力訓練" : "Swim 30min / Bike 45min / Strength";
  let recoveryDetail = crossTrain ? `${t.crossTraining}: ${crossTrainDetail}` : `${recoveryMin}min ${t.recoveryRun} @ ${paces.recovery}`;
  let baseWeek = [
    { day: t.dayMon, type: t.rest, detail: "-" },
    { day: t.dayTue, type: t.interval, detail: interval },
    { day: t.dayWed, type: t.recoveryRun, detail: recoveryDetail },
    { day: t.dayThu, type: t.tempo, detail: tempoDetail },
    { day: t.dayFri, type: t.rest, detail: "-" },
    { day: t.daySat, type: t.easy, detail: `${easyMin}min ${t.easy} @ ${paces.easy}` },
    { day: t.daySun, type: t.long, detail: (weeksToRace === 0) ? "🏁 RACE DAY" : `${longRunKm}km ${t.long} @ ${paces.long}` }
  ];
  if (crossTrain) baseWeek[2].type = t.crossTraining;
  if (weeksToRace === 0) {
    baseWeek[6].type = "🏁 RACE DAY";
    baseWeek[6].detail = `${goal} 比賽日！加油！`;
    return baseWeek;
  }
  let weekPlan = JSON.parse(JSON.stringify(baseWeek));
  if (days <= 2) {
    weekPlan = weekPlan.map(d => ({ day: d.day, type: t.rest, detail: "-" }));
    weekPlan[3] = { day: t.dayThu, type: t.easy, detail: `${easyMin}min ${t.easy} @ ${paces.easy}` };
    weekPlan[6] = { day: t.daySun, type: t.long, detail: `${Math.round(longRunKm * 0.7)}km ${t.long} @ ${paces.long}` };
    return weekPlan;
  }
  let keepTypes = {
    3: [t.interval, t.tempo, t.long],
    4: [t.interval, t.recoveryRun, t.tempo, t.long],
    5: [t.interval, t.recoveryRun, t.tempo, t.easy, t.long]
  };
  if (keepTypes[days]) return weekPlan.map(d => keepTypes[days].includes(d.type) ? d : { day: d.day, type: t.rest, detail: "-" });
  if (days === 6) return weekPlan.map(d => d.day === t.dayFri ? { day: d.day, type: t.easy, detail: `${easyMin}min ${t.easy} @ ${paces.easy}` } : d);
  return weekPlan;
}

function generatePlan(paces, goal, weeks, days, pace10kSec) {
  let plan = [];
  for (let w = 0; w < weeks; w++) {
    let longKm = getLongRunKm(w+1, weeks, goal);
    let interval = getInterval(w, pace10kSec, goal, weeks - w);
    let weekDays = buildWeek(days, paces, longKm, interval, goal, w+1, weeks, pace10kSec);
    plan.push({ week: w+1, days: weekDays });
  }
  return plan;
}

// ==================== 渲染 (無達成度功能) ====================
function renderPlan(plan) {
  let t = lang[currentLang];
  let html = "";
  for (let w of plan) {
    html += `<h4>📆 ${t.week} ${w.week}${t.weekSuffix}</h4>`;
    html += `<div class="table-responsive">`;
    html += `<table class="plan-table">`;
    html += `<thead>`;
    html += `<tr><th>${t.dayHeader}</th><th>${t.typeHeader}</th><th>${t.workoutHeader}</th></tr>`;
    html += `</thead><tbody>`;
    for (let d of w.days) {
      html += `<tr>`;
      html += `<td>${d.day}</td>`;
      html += `<td>${d.type}</td>`;
      html += `<td class="workout-detail">${d.detail || "-"}</td>`;
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
  let plan = window.lastGeneratedPlan;
  if (!plan || plan.length === 0) { alert("請先計算訓練計劃"); return; }
  let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Running Dashboard//EN\n";
  let startDate = new Date();
  startDate.setDate(startDate.getDate() + (1 - startDate.getDay()));
  plan.forEach((week, wi) => {
    week.days.forEach((day, di) => {
      if (day.type === lang[currentLang].rest) return;
      if (day.type.includes("RACE DAY")) return;
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

// ==================== 主要計算 ====================
function calculate() {
  let mileage = Number(document.getElementById("mileage").value);
  let days = Number(document.getElementById("days").value);
  let age = Number(document.getElementById("age").value);
  let method = document.getElementById("method").value;
  let maxHr = document.getElementById("maxHr").value;
  let restHr = Number(document.getElementById("restHr").value);
  if (method === "karvonen" && (!maxHr || !restHr)) { alert("請輸入 Max HR 同 Rest HR"); return; }
  let goal = document.getElementById("goal").value;
  let weeks = Number(document.getElementById("weeks").value) || 8;
  let t = lang[currentLang];

  if (mileage < 15) {
    document.getElementById("result").innerHTML = `<div class="warning">🏃 ${currentLang === "zh" ? "你而家每週跑量" : "Your weekly mileage is"} ${mileage}km，${currentLang === "zh" ? "建議先享受跑步，每週輕鬆跑 2-3 次，每次 20-30 分鐘，慢慢增加到 15km 以上再嚟睇課表啦！" : "focus on enjoying running 2-3 times a week for 20-30 min each, then come back when you reach 15km/week!"}</div>`;
    return;
  }

  let pace10kSec = get10kPaceSec();
  if (!pace10kSec) { alert("請填寫正確配速或比賽時間"); return; }
  let paces = getPaceZonesFrom10k(pace10kSec);
  let hr = getHRZones(age, method, maxHr, restHr);
  let racePred = predictRaceWithMileage(pace10kSec, mileage);
  let displayRace = {};
  if (goal === "5K") displayRace = { "5K": racePred["5K"], "10K": racePred["10K"] };
  else if (goal === "10K") displayRace = { "5K": racePred["5K"], "10K": racePred["10K"], "HM": racePred["HM"] };
  else displayRace = racePred;

  let plan = generatePlan(paces, goal, weeks, days, pace10kSec);
  window.lastGeneratedPlan = plan;

  let hrHtml = `<div class="zone-card"><h3>❤️ ${t.hrZones}</h3>
    <p>${t.z1Recovery}: ${hr.z1[0]}–${hr.z1[1]}</p>
    <p>${t.z2Easy}: ${hr.z2[0]}–${hr.z2[1]}</p>
    <p>${t.z3Aerobic}: ${hr.z3[0]}–${hr.z3[1]}</p>
    <p>${t.z4Threshold}: ${hr.z4[0]}–${hr.z4[1]}</p>
    <p>${t.z5Max}: ${hr.z5[0]}–${hr.z5[1]}</p>
  </div>`;
  let paceHtml = `<div class="zone-card"><h3>🏃 ${t.paceZones}</h3>
    <p>${t.paceRecovery}: ${paces.recovery}</p>
    <p>${t.paceEasy}: ${paces.easy}</p>
    <p>${t.paceLong}: ${paces.long}</p>
    <p>${t.paceTempo}: ${paces.tempo}</p>
    <p>${t.paceInterval}: ${paces.interval}</p>
  </div>`;

  let raceHtml = `<div class="prediction-card"><h3>🏁 ${t.predictTitle}</h3><div class="prediction-grid">`;
  for (let [dist, sec] of Object.entries(displayRace)) {
    raceHtml += `<div class="prediction-item">${dist}: ${formatTime(sec)}</div>`;
  }
  raceHtml += `</div>`;
  if (goal === "FM" && mileage < 50) raceHtml += `<div class="warning">⚠️ ${t.warningFMLowMileage}</div>`;
  else if (goal === "FM") raceHtml += `<div class="warning">⚠️ ${t.warningFMGeneral}</div>`;
  raceHtml += `</div>`;

  let planHtml = `<h3>📅 ${t.planTitle}</h3>${renderPlan(plan)}`;

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