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

  const todayISO = () => new Date().toISOString().slice(0, 10);

  function defaultState() {
    return {
      startDate: todayISO(),
      attempt: 1,
      days: {},
      prs: [],
      workouts: [],
      bodyweights: [],
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
    empty.style.display = sorted.length ? "block" : "none";

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
  renderPRs();
  renderWorkouts();
  renderBodyStats();
})();
