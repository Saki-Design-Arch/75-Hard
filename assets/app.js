(function () {
  "use strict";

  const STORAGE_KEY = "75hard-tracker-data";
  const TOTAL_DAYS = 75;
  const RULES = [
    { key: "w1", label: "Workout 1 (45 min)" },
    { key: "w2", label: "Workout 2 – outdoors" },
    { key: "diet", label: "Follow diet" },
    { key: "water", label: "1 gallon water" },
    { key: "reading", label: "Read 10 pages" },
    { key: "photo", label: "Progress photo" },
  ];

  // ---- Foundation Protocol: Heavy Calisthenics / Marine Conditioning ----
  const PROGRAM_START_DEFAULT = "2026-08-16";

  const PHASES = [
    { phase: 1, weeks: [1, 4], name: "Foundation & Ignition", focus: "Relearn movement patterns, protect joints, build the habit, start the deficit, low-impact conditioning." },
    { phase: 2, weeks: [5, 10], name: "Base Building", focus: "Add volume, begin serious pull-up progression, introduce run/walk intervals as weight starts to drop." },
    { phase: 3, weeks: [11, 16], name: "Marine Conditioning Build", focus: "Loaded carries, ruck marches, PT-test-style circuits, tempo running, begin lower-body power progression." },
    { phase: 4, weeks: [17, 24], name: "Performance & Tactical Fitness", focus: "Advanced calisthenics, full plyometrics, agility/cutting drills, pistol squat progression, speed work, swim/bike integration." },
  ];

  const NON_NEGOTIABLES = [
    { key: "steps", label: "Hit step target", detail: "Baseline 2,784/day — build up" },
    { key: "mobility", label: "10-min mobility", detail: "Hamstring / hip / wrist" },
    { key: "sleep", label: "Sleep 7–9 hours", detail: "" },
    { key: "protein", label: "Protein 180–200 g", detail: "" },
    { key: "water", label: "Water 150–180 oz", detail: "" },
  ];

  const NUTRITION_TARGETS = [
    { label: "Calories (Phase 1–2)", value: "2,100–2,250 kcal/day" },
    { label: "Protein", value: "180–200 g/day" },
    { label: "Fat", value: "70–80 g/day minimum" },
    { label: "Water", value: "150–180 oz/day" },
  ];

  const WEEKLY_PROGRAM = [
    {
      day: 1, name: "Push Strength + Core",
      emphasis: "Calisthenics push patterns, wrist-safe pressing, hollow body",
      warmup: ["2 min easy incline walk or bike", "Band pull-aparts x15, arm circles x10/direction", "Gentle wrist circles — stay pain-free on the left wrist"],
      main: [
        { ex: "Push-ups", detail: "4 x max (leave 2 in reserve) — baseline is 10 strict" },
        { ex: "Pike Push-ups", detail: "3 x 8–10 — use bars/parallettes or fists if flat-palm loads the wrist" },
        { ex: "Bench/Chair Dips", detail: "3 x 8 — shallow range early, deepen only if pain-free" },
        { ex: "Hollow Body Hold", detail: "3 x max, build from 25s — target 45–60s by end of Phase 2" },
        { ex: "Incline Push-ups (finisher)", detail: "2 x max — hands elevated, pure volume finisher" },
      ],
      cooldown: ["Chest/shoulder doorway stretch, 30s/side", "Wrist flexor/extensor stretch — gentle, weight-bearing preferred"],
    },
    {
      day: 2, name: "Conditioning A — Engine",
      emphasis: "Row / bike / incline walk — low impact aerobic base",
      warmup: ["2–3 min very easy pace to ramp heart rate gradually", "Ankle circles and hip circles x10/direction, a few bodyweight squats to prime the knee"],
      main: [
        { ex: "Steady state / intervals", detail: "Wks 1–4: 20–25 min steady state, zone 2 · Wks 5–10: add 1x/wk intervals (8 x 1 min hard / 2 min easy) · Wk 11+: alternate steady state & intervals, build steady state to 35–40 min" },
      ],
      cooldown: ["2–3 min easy pace taper", "Standing quad stretch and calf stretch, 30s/side"],
    },
    {
      day: 3, name: "Pull Strength + Posterior Chain",
      emphasis: "Dead hangs, negatives, rows, hamstring/glute work",
      warmup: ["Scapular shrugs on the bar x10", "Dead hangs x2 short holds"],
      main: [
        { ex: "Dead Hang", detail: "4 x max time — baseline 10s → target 30–45s by Phase 2" },
        { ex: "Scapular Pulls", detail: "4 x 5 — from dead hang, pull shoulder blades down/back without bending elbows" },
        { ex: "Negative Pull-ups", detail: "4 x 3–5 — jump/step to chin-over-bar, lower for a full 5 seconds" },
        { ex: "Inverted Rows", detail: "4 x 8–10 — under a bar/table or with rings" },
        { ex: "Band-Assisted Pull-ups", detail: "3 x 5 — introduce once negatives feel controlled (~Phase 2)" },
        { ex: "Glute Bridges", detail: "3 x 12 — posterior chain + knee-safe hip strength" },
        { ex: "Single-Leg RDL (bodyweight)", detail: "3 x 8/side — slow and controlled, builds knee stability" },
      ],
      cooldown: ["Lat stretch on the bar, 30s", "Standing hamstring fold, 45s x2 — don't skip this"],
    },
    {
      day: 4, name: "Marine PT Circuit",
      emphasis: "Full-body tactical circuit — squats, carries, core, controlled tempo",
      warmup: ["5 min easy cardio (bike or incline walk)", "Bodyweight squats x10, gentle leg swings — don't force end range cold"],
      main: [
        { ex: "Squats", detail: "x15 — controlled tempo, knee tracks over 2nd/3rd toe, no inward collapse" },
        { ex: "Push-ups", detail: "x10 — strict, chest to floor" },
        { ex: "Mountain Climbers", detail: "x20 — moderate pace on a mat" },
        { ex: "Step-ups", detail: "x10/leg — sturdy stair, bench, or chair, moderate height" },
        { ex: "Plank Shoulder Taps", detail: "x20 — hips stay square, minimal rock" },
        { ex: "Farmer's Carry", detail: "40m — heavy dumbbells or filled bags" },
      ],
      note: "Run as 4 rounds of 40s work / 20s rest, or a straight AMRAP for 15–20 min. Phase 3+: swap step-ups for stair/bench step-downs, then broad & vertical jumps.",
      cooldown: ["Full-body stretch, 5 min", "Foam roll quads and IT band"],
    },
    {
      day: 5, name: "Conditioning B — Run Progression",
      emphasis: "Run/walk intervals building toward the mile goal",
      warmup: ["5 min brisk walk to raise core temperature", "Dynamic leg swings, ankle circles", "Light high knees / butt kicks x20m, then a couple relaxed 20m strides"],
      main: [
        { ex: "Run/walk progression", detail: "Wks 1–6: 1 min jog / 2 min walk x8, 2x/wk → 20-min continuous walk-jog · Wks 7–12: 2 min jog / 1 min walk + 1 continuous easy jog/wk → sub-9:00 mile · Wks 13–20: tempo runs + 400m repeats → sub-8:00 mile · Wk 21+: structured track intervals → toward sub-6:00" },
      ],
      note: "Stop the running progression and lean on rowing/biking anytime the knee, shins, or hips complain.",
      cooldown: ["5 min easy walk to bring heart rate down", "Standing hamstring fold 45s, calf and hip flexor stretch 30s/side"],
    },
    {
      day: 6, name: "Long Ruck / Hike + Mobility",
      emphasis: "45–60 min loaded walk, full flexibility session",
      warmup: ["5 min easy walk without the pack", "Dynamic leg swings and ankle circles"],
      main: [
        { ex: "Ruck / Hike", detail: "45–60 min walk — start with an empty or light pack (10–15 lb), build to 25–35 lb by Phase 3" },
      ],
      cooldown: ["Deep squat hold work", "Hamstring PNF/contract-relax stretching", "90/90 hip stretch", "Gentle couch stretch", "Wrist flexion/extension within comfortable range"],
    },
    {
      day: 7, name: "Rest / Active Recovery",
      emphasis: "Walk, stretch, foam roll, sleep",
      warmup: [],
      main: [
        { ex: "Easy walk", detail: "20–30 min" },
        { ex: "Light full-body stretch + foam roll", detail: "" },
      ],
      note: "No formal warm-up or close-out needed today — protein and sleep are the actual workout.",
      cooldown: [],
    },
  ];

  const todayISO = () => new Date().toISOString().slice(0, 10);

  function defaultState() {
    return {
      startDate: todayISO(),
      attempt: 1,
      days: {},
      programStartDate: PROGRAM_START_DEFAULT,
      dayTasks: {},
      prs: [
        { id: uid(), exercise: "Push-ups (strict, max)", value: 10, unit: "reps", date: "2026-08-16" },
        { id: uid(), exercise: "Pull-ups", value: 0, unit: "reps", date: "2026-08-16" },
        { id: uid(), exercise: "Dead Hang", value: 10, unit: "sec", date: "2026-08-16" },
        { id: uid(), exercise: "Hollow Hold", value: 25, unit: "sec", date: "2026-08-16" },
        { id: uid(), exercise: "Wall Sit", value: 75, unit: "sec", date: "2026-08-16" },
        { id: uid(), exercise: "1-Mile Run (AssaultRunner)", value: 11.8, unit: "min", date: "2026-08-16" },
        { id: uid(), exercise: "2,000m Row", value: 8.4, unit: "min", date: "2026-08-16" },
        { id: uid(), exercise: "Smith Machine Bench Press (5 reps)", value: 125, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Dumbbell Bench Press (5 reps)", value: 50, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Dumbbell Shoulder Press (5 reps)", value: 40, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Lat Pulldown (5 reps)", value: 100, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Seated Cable Row (5 reps)", value: 135, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Biceps Curl Machine (8 reps)", value: 100, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Leg Extension (8 reps)", value: 80, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Leg Curl (8 reps)", value: 140, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Romanian Deadlift (5 reps)", value: 115, unit: "lb", date: "2026-08-16" },
        { id: uid(), exercise: "Vertical Crunch (max reps)", value: 100, unit: "reps", date: "2026-08-16" },
      ],
      workouts: [],
      bodyweights: [
        { id: uid(), date: "2026-08-21", value: 256.4, unit: "lb" },
      ],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      console.warn("Failed to load saved data, starting fresh.", e);
      return defaultState();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function daysBetween(a, b) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const da = new Date(a + "T00:00:00");
    const db = new Date(b + "T00:00:00");
    return Math.round((db - da) / msPerDay);
  }

  function dayDate(dayNum) {
    const d = new Date(state.startDate + "T00:00:00");
    d.setDate(d.getDate() + (dayNum - 1));
    return d.toISOString().slice(0, 10);
  }

  function isDayComplete(dayNum) {
    const rec = state.days[dayNum];
    if (!rec) return false;
    return RULES.every((r) => !!rec[r.key]);
  }

  function currentDayNumber() {
    const diff = daysBetween(state.startDate, todayISO());
    return Math.min(Math.max(diff + 1, 1), TOTAL_DAYS);
  }

  function computeStats() {
    let completed = 0;
    let streak = 0;
    let streakBroken = false;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const done = isDayComplete(d);
      if (done) completed++;
      if (!streakBroken) {
        if (done) streak++;
        else if (dayDate(d) < todayISO() || d < currentDayNumber()) {
          streakBroken = true;
        }
      }
    }
    return { completed, streak };
  }

  // ---------------- Tabs ----------------
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("view-" + btn.dataset.view).classList.add("active");
  });

  // ---------------- 75 Hard Tracker ----------------
  const startDateInput = document.getElementById("start-date");
  startDateInput.value = state.startDate;
  startDateInput.addEventListener("change", () => {
    state.startDate = startDateInput.value || todayISO();
    save();
    renderTracker();
  });

  document.getElementById("btn-restart").addEventListener("click", () => {
    if (!confirm("Restart the 75 Hard challenge? This clears all day checkmarks and starts a new attempt from today.")) return;
    state.attempt += 1;
    state.startDate = todayISO();
    state.days = {};
    save();
    startDateInput.value = state.startDate;
    renderTracker();
  });

  function toggleDayRule(dayNum, ruleKey) {
    if (!state.days[dayNum]) state.days[dayNum] = {};
    state.days[dayNum][ruleKey] = !state.days[dayNum][ruleKey];
    save();
    renderTracker();
  }

  function renderTracker() {
    const curDay = currentDayNumber();
    const { completed, streak } = computeStats();

    document.getElementById("stat-current-day").textContent = curDay;
    document.getElementById("stat-days-complete").textContent = completed;
    document.getElementById("stat-streak").textContent = streak;
    document.getElementById("stat-attempt").textContent = state.attempt;

    const pct = Math.round((completed / TOTAL_DAYS) * 100);
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-label").textContent = `${completed} / ${TOTAL_DAYS} days complete`;

    const grid = document.getElementById("day-grid");
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const rec = state.days[d] || {};
      const complete = isDayComplete(d);
      const isToday = d === curDay;
      const isFuture = dayDate(d) > todayISO();

      const card = document.createElement("div");
      card.className = "day-card" + (isToday ? " today" : "") + (complete ? " complete" : "") + (isFuture ? " future" : "");

      const head = document.createElement("div");
      head.className = "day-card-head";
      head.innerHTML = `<span class="day-num">Day ${d}</span><span class="day-date">${dayDate(d)}</span>`;
      card.appendChild(head);

      RULES.forEach((rule) => {
        const label = document.createElement("label");
        label.className = "day-check" + (rec[rule.key] ? " checked" : "");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!rec[rule.key];
        input.addEventListener("change", () => toggleDayRule(d, rule.key));
        label.appendChild(input);
        label.appendChild(document.createTextNode(rule.label));
        card.appendChild(label);
      });

      const status = document.createElement("div");
      status.className = "day-status " + (complete ? "complete" : "pending");
      status.textContent = complete ? "Complete" : "Pending";
      card.appendChild(status);

      frag.appendChild(card);
    }
    grid.appendChild(frag);
  }

  // ---------------- Day to Day (Foundation Protocol) ----------------
  const programStartInput = document.getElementById("program-start-date");
  programStartInput.value = state.programStartDate;
  programStartInput.addEventListener("change", () => {
    state.programStartDate = programStartInput.value || PROGRAM_START_DEFAULT;
    save();
    renderDayToDay();
  });

  function programWeekNumber() {
    const diff = daysBetween(state.programStartDate, todayISO());
    return Math.max(Math.floor(diff / 7) + 1, 1);
  }

  function programCycleDay() {
    const diff = daysBetween(state.programStartDate, todayISO());
    return (((diff % 7) + 7) % 7) + 1;
  }

  function currentPhase() {
    const week = programWeekNumber();
    return PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) || PHASES[PHASES.length - 1];
  }

  function getDayTaskRecord(dateKey) {
    if (!state.dayTasks[dateKey]) state.dayTasks[dateKey] = { main: {}, nonNeg: {} };
    return state.dayTasks[dateKey];
  }

  function toggleMainTask(dateKey, idx) {
    const rec = getDayTaskRecord(dateKey);
    rec.main[idx] = !rec.main[idx];
    save();
    renderDayToDay();
  }

  function toggleNonNeg(dateKey, key) {
    const rec = getDayTaskRecord(dateKey);
    rec.nonNeg[key] = !rec.nonNeg[key];
    save();
    renderDayToDay();
  }

  function renderDayToDay() {
    const week = programWeekNumber();
    const cycleDay = programCycleDay();
    const phase = currentPhase();
    const session = WEEKLY_PROGRAM[cycleDay - 1];
    const dateKey = todayISO();
    const rec = getDayTaskRecord(dateKey);

    document.getElementById("phase-status").innerHTML =
      `<strong>Week ${week} · Phase ${phase.phase} — ${escapeHtml(phase.name)}</strong><br>${escapeHtml(phase.focus)}`;

    document.getElementById("today-session-title").textContent = `Today — Day ${session.day}: ${session.name}`;
    document.getElementById("today-session-emphasis").textContent = session.emphasis;

    const body = document.getElementById("today-session-body");
    body.innerHTML = "";

    if (session.warmup.length) {
      const wu = document.createElement("div");
      wu.className = "session-block";
      wu.innerHTML = `<h3>Warm-Up</h3><ul>${session.warmup.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`;
      body.appendChild(wu);
    }

    const main = document.createElement("div");
    main.className = "session-block";
    main.innerHTML = "<h3>Main Work</h3>";
    const checklist = document.createElement("div");
    checklist.className = "checklist";
    session.main.forEach((item, idx) => {
      const checked = !!rec.main[idx];
      const row = document.createElement("label");
      row.className = "check-row" + (checked ? " checked" : "");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = checked;
      input.addEventListener("change", () => toggleMainTask(dateKey, idx));
      row.appendChild(input);
      const label = document.createElement("span");
      label.className = "check-label";
      label.textContent = item.ex;
      row.appendChild(label);
      if (item.detail) {
        const detail = document.createElement("span");
        detail.className = "check-detail";
        detail.textContent = item.detail;
        row.appendChild(detail);
      }
      checklist.appendChild(row);
    });
    main.appendChild(checklist);
    if (session.note) {
      const note = document.createElement("p");
      note.className = "session-note";
      note.textContent = session.note;
      main.appendChild(note);
    }
    body.appendChild(main);

    if (session.cooldown.length) {
      const cd = document.createElement("div");
      cd.className = "session-block";
      cd.innerHTML = `<h3>Cooldown</h3><ul>${session.cooldown.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`;
      body.appendChild(cd);
    }

    const nonNegList = document.getElementById("nonneg-list");
    nonNegList.innerHTML = "";
    NON_NEGOTIABLES.forEach((item) => {
      const checked = !!rec.nonNeg[item.key];
      const row = document.createElement("label");
      row.className = "check-row" + (checked ? " checked" : "");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = checked;
      input.addEventListener("change", () => toggleNonNeg(dateKey, item.key));
      row.appendChild(input);
      const label = document.createElement("span");
      label.className = "check-label";
      label.textContent = item.label;
      row.appendChild(label);
      if (item.detail) {
        const detail = document.createElement("span");
        detail.className = "check-detail";
        detail.textContent = item.detail;
        row.appendChild(detail);
      }
      nonNegList.appendChild(row);
    });

    const nutritionGrid = document.getElementById("nutrition-grid");
    nutritionGrid.innerHTML = "";
    NUTRITION_TARGETS.forEach((n) => {
      const div = document.createElement("div");
      div.className = "nutrition-item";
      div.innerHTML = `<span class="n-label">${escapeHtml(n.label)}</span><span class="n-value">${escapeHtml(n.value)}</span>`;
      nutritionGrid.appendChild(div);
    });

    const weekTbody = document.getElementById("week-tbody");
    weekTbody.innerHTML = "";
    WEEKLY_PROGRAM.forEach((s) => {
      const tr = document.createElement("tr");
      if (s.day === cycleDay) tr.className = "today-row";
      tr.innerHTML = `<td>Day ${s.day}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.emphasis)}</td>`;
      weekTbody.appendChild(tr);
    });
  }

  // ---------------- Fitness Records: PRs ----------------
  document.getElementById("pr-date").value = todayISO();

  document.getElementById("pr-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const exercise = document.getElementById("pr-exercise").value.trim();
    const value = document.getElementById("pr-value").value;
    const unit = document.getElementById("pr-unit").value;
    const date = document.getElementById("pr-date").value || todayISO();
    if (!exercise || !value) return;

    state.prs.push({ id: uid(), exercise, value: parseFloat(value), unit, date });
    save();
    e.target.reset();
    document.getElementById("pr-date").value = todayISO();
    renderPRs();
  });

  function renderPRs() {
    const tbody = document.getElementById("pr-tbody");
    const empty = document.getElementById("pr-empty");
    tbody.innerHTML = "";

    const sorted = [...state.prs].sort((a, b) => (a.date < b.date ? 1 : -1));
    empty.style.display = sorted.length ? "none" : "block";

    sorted.forEach((pr) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(pr.exercise)}</td>
        <td>${pr.value} ${escapeHtml(pr.unit)}</td>
        <td>${pr.date}</td>
        <td></td>
      `;
      const delBtn = document.createElement("button");
      delBtn.className = "btn-icon";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        state.prs = state.prs.filter((p) => p.id !== pr.id);
        save();
        renderPRs();
      });
      tr.lastElementChild.appendChild(delBtn);
      tbody.appendChild(tr);
    });
  }

  // ---------------- Fitness Records: Workout Log ----------------
  document.getElementById("w-date").value = todayISO();

  document.getElementById("workout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("w-date").value || todayISO();
    const type = document.getElementById("w-type").value;
    const duration = document.getElementById("w-duration").value;
    const notes = document.getElementById("w-notes").value.trim();

    state.workouts.push({ id: uid(), date, type, duration: duration ? parseInt(duration, 10) : null, notes });
    save();
    e.target.reset();
    document.getElementById("w-date").value = todayISO();
    renderWorkouts();
  });

  function renderWorkouts() {
    const tbody = document.getElementById("workout-tbody");
    const empty = document.getElementById("workout-empty");
    tbody.innerHTML = "";

    const sorted = [...state.workouts].sort((a, b) => (a.date < b.date ? 1 : -1));
    empty.style.display = sorted.length ? "none" : "block";

    sorted.forEach((w) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${w.date}</td>
        <td>${escapeHtml(w.type)}</td>
        <td>${w.duration ? w.duration + " min" : "—"}</td>
        <td>${escapeHtml(w.notes || "")}</td>
        <td></td>
      `;
      const delBtn = document.createElement("button");
      delBtn.className = "btn-icon";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        state.workouts = state.workouts.filter((x) => x.id !== w.id);
        save();
        renderWorkouts();
      });
      tr.lastElementChild.appendChild(delBtn);
      tbody.appendChild(tr);
    });
  }

  // ---------------- Body Stats ----------------
  document.getElementById("bw-date").value = todayISO();

  document.getElementById("weight-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("bw-date").value || todayISO();
    const value = document.getElementById("bw-value").value;
    const unit = document.getElementById("bw-unit").value;
    if (!value) return;

    state.bodyweights.push({ id: uid(), date, value: parseFloat(value), unit });
    save();
    e.target.reset();
    document.getElementById("bw-date").value = todayISO();
    renderBodyStats();
  });

  function renderBodyStats() {
    const tbody = document.getElementById("weight-tbody");
    const empty = document.getElementById("weight-empty");
    tbody.innerHTML = "";

    const sorted = [...state.bodyweights].sort((a, b) => (a.date < b.date ? 1 : -1));
    empty.style.display = sorted.length ? "none" : "block";

    sorted.forEach((bw) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${bw.date}</td><td>${bw.value} ${escapeHtml(bw.unit)}</td><td></td>`;
      const delBtn = document.createElement("button");
      delBtn.className = "btn-icon";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        state.bodyweights = state.bodyweights.filter((x) => x.id !== bw.id);
        save();
        renderBodyStats();
      });
      tr.lastElementChild.appendChild(delBtn);
      tbody.appendChild(tr);
    });

    drawWeightChart();
  }

  function drawWeightChart() {
    const svg = document.getElementById("weight-chart");
    svg.innerHTML = "";
    const points = [...state.bodyweights].sort((a, b) => (a.date > b.date ? 1 : -1));
    if (points.length < 2) return;

    const w = 600, h = 220, pad = 30;
    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const xStep = (w - pad * 2) / (points.length - 1);
    const coords = points.map((p, i) => {
      const x = pad + i * xStep;
      const y = h - pad - ((p.value - min) / range) * (h - pad * 2);
      return [x, y];
    });

    const pathD = coords.map((c, i) => (i === 0 ? "M" : "L") + c[0] + "," + c[1]).join(" ");

    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff5a3c");
    path.setAttribute("stroke-width", "2.5");
    svg.appendChild(path);

    coords.forEach(([x, y]) => {
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "3.5");
      circle.setAttribute("fill", "#ff5a3c");
      svg.appendChild(circle);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  // ---------------- Init ----------------
  renderTracker();
  renderDayToDay();
  renderPRs();
  renderWorkouts();
  renderBodyStats();
})();
