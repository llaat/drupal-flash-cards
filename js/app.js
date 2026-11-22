(function () {
  "use strict";

  var STORAGE_KEY = "drupal_flashcards_state_v1";
  var ROUND_SIZE = 5;
  var RECENT_HISTORY_LIMIT = 15;

  var ALLOWED_TAGS = [
    "Caching",
    "Plugins",
    "Routing",
    "Services",
    "Entities",
    "Config",
    "Forms",
    "Security",
    "Render API",
    "Database",
    "Updates",
    "Queues",
    "Testing",
    "Drupal 11",
    "DvO Platform",
    "DvO Features",
    "DvgSettings",
    "Subsites",
    "Themes",
    "DDS",
    "DvO Best practices"
  ];

  var DIFFICULTY_TIERS = [
    { level: 1, minScore: 0, maxScore: 9, label: "Level 1", detail: "What the concept is for" },
    { level: 2, minScore: 10, maxScore: 24, label: "Levels 1–2", detail: "Why this approach exists" },
    { level: 3, minScore: 25, maxScore: 44, label: "Levels 1–3", detail: "Which nearby idea it is not" },
    { level: 4, minScore: 45, maxScore: 69, label: "Levels 1–4", detail: "What fails with the tempting alternative" },
    { level: 5, minScore: 70, maxScore: Infinity, label: "Levels 1–5", detail: "Tradeoffs & Drupal 10 vs 11" }
  ];

  // Category colours. `accent` must keep at least 4.5:1 contrast against white,
  // against `soft`, and with white text on top of it (WCAG AA). `tint` is only
  // used for decoration, never behind or as text.
  var CATEGORY_PALETTE = {
    blue: { accent: "#0b5cab", soft: "#eaf3fc", tint: "#7fb0e0" },
    raspberry: { accent: "#a8174f", soft: "#fcebf1", tint: "#e48aac" },
    teal: { accent: "#0b6b6b", soft: "#e5f4f3", tint: "#6fbcb8" },
    purple: { accent: "#6a3d9a", soft: "#f2ecfa", tint: "#b39ad6" },
    amber: { accent: "#8a4b00", soft: "#fdf1e0", tint: "#e0a85c" },
    slate: { accent: "#3f4f66", soft: "#eef1f5", tint: "#a3afc0" }
  };
  var PALETTE_ORDER = ["blue", "raspberry", "teal", "purple", "amber", "slate"];

  // Categories listed here keep a fixed colour; any other category gets the
  // next colour from PALETTE_ORDER that is not taken yet.
  var CATEGORY_COLOR_NAMES = {
    "Drupal concepts": "blue",
    "DvO (Drupal voor Overheden)": "raspberry"
  };

  var deck = Array.isArray(window.DRUPAL_QUESTIONS) ? window.DRUPAL_QUESTIONS : [];
  var deckValid = false;
  var categories = []; // Unique category names found in the deck, in first-seen order.
  var categoryButtons = {}; // category name -> toggle button element
  var categoryColors = {}; // category name -> CATEGORY_PALETTE entry

  var persisted = loadState();

  var session = {
    screen: "start", // "start" | "question" | "summary"
    roundCards: [],
    roundIndex: 0,
    shuffledAnswers: [],
    answered: false,
    hintOpen: false,
    roundResults: [],
    roundStartScores: {}, // category name -> score when the round began
    settingsOpen: false
  };

  var els = {
    appShell: document.getElementById("app-shell"),
    headerScore: document.getElementById("header-score"),
    headerScoreNote: document.getElementById("header-score-note"),
    btnSettings: document.getElementById("btn-settings"),
    settingsBackdrop: document.getElementById("settings-backdrop"),
    settingsPanel: document.getElementById("settings-panel"),
    btnSettingsClose: document.getElementById("btn-settings-close"),
    btnUnlockAll: document.getElementById("btn-unlock-all"),
    modeLabelScore: document.getElementById("mode-label-score"),
    modeLabelUnlock: document.getElementById("mode-label-unlock"),
    validationBanner: document.getElementById("validation-banner"),

    screenStart: document.getElementById("screen-start"),
    screenQuestion: document.getElementById("screen-question"),
    screenSummary: document.getElementById("screen-summary"),

    startScore: document.getElementById("start-score"),
    startScoreCaption: document.getElementById("start-score-caption"),
    startPool: document.getElementById("start-pool"),
    startPoolCount: document.getElementById("start-pool-count"),
    ladderSteps: document.getElementById("ladder-steps"),
    ladderCaption: document.getElementById("ladder-caption"),
    levelMessage: document.getElementById("level-message"),
    categoryList: document.getElementById("category-list"),
    categoryMessage: document.getElementById("category-message"),
    btnStartRound: document.getElementById("btn-start-round"),
    btnResetRequest: document.getElementById("btn-reset-request"),
    resetConfirmRow: document.getElementById("reset-confirm-row"),
    btnResetConfirm: document.getElementById("btn-reset-confirm"),
    btnResetCancel: document.getElementById("btn-reset-cancel"),

    questionProgressText: document.getElementById("question-progress-text"),
    roundPips: document.getElementById("round-pips"),
    questionTags: document.getElementById("question-tags"),
    questionDifficulty: document.getElementById("question-difficulty"),
    questionText: document.getElementById("question-text"),
    btnHint: document.getElementById("btn-hint"),
    hintPanel: document.getElementById("hint-panel"),
    hintText: document.getElementById("hint-text"),
    answersList: document.getElementById("answers-list"),
    feedbackPanel: document.getElementById("feedback-panel"),
    feedbackVerdict: document.getElementById("feedback-verdict"),
    feedbackDelta: document.getElementById("feedback-delta"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    btnNext: document.getElementById("btn-next"),

    summaryHeadline: document.getElementById("summary-headline"),
    summaryCorrect: document.getElementById("summary-correct"),
    summaryDelta: document.getElementById("summary-delta"),
    summaryDeltaCaption: document.getElementById("summary-delta-caption"),
    summaryScore: document.getElementById("summary-score"),
    summaryCeilingNote: document.getElementById("summary-ceiling-note"),
    summaryRecap: document.getElementById("summary-recap"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    btnBackStart: document.getElementById("btn-back-start")
  };

  function defaultState() {
    return {
      // Each category climbs the difficulty ladder on its own score.
      scores: {},
      lastOutcomes: {},
      recentIds: [],
      // Categories the player switched off. Storing the "off" list means every
      // category, including ones added later, is on by default.
      disabledCategories: [],
      // Practice mode: every difficulty is available and scores stay frozen.
      unlockAll: false,
      // Difficulty tiers switched off while unlockAll is on. Storing the "off"
      // list means every tier is on by default.
      disabledLevels: []
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultState();
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return defaultState();
      }
      var scores = {};
      if (parsed.scores && typeof parsed.scores === "object" && !Array.isArray(parsed.scores)) {
        Object.keys(parsed.scores).forEach(function (name) {
          var value = parsed.scores[name];
          if (typeof value === "number" && isFinite(value)) {
            scores[name] = Math.max(0, Math.floor(value));
          }
        });
      }
      // Older saves kept one score for the whole deck; init() moves it onto categories.
      var legacyScore = !parsed.scores && typeof parsed.score === "number" && isFinite(parsed.score)
        ? Math.max(0, Math.floor(parsed.score))
        : 0;
      var lastOutcomes = {};
      if (parsed.lastOutcomes && typeof parsed.lastOutcomes === "object" && !Array.isArray(parsed.lastOutcomes)) {
        Object.keys(parsed.lastOutcomes).forEach(function (id) {
          var outcome = parsed.lastOutcomes[id];
          if (outcome === "correct" || outcome === "wrong") {
            lastOutcomes[id] = outcome;
          }
        });
      }
      var recentIds = Array.isArray(parsed.recentIds)
        ? parsed.recentIds.filter(function (id) { return typeof id === "string"; }).slice(-RECENT_HISTORY_LIMIT)
        : [];
      var disabledCategories = [];
      if (Array.isArray(parsed.disabledCategories)) {
        parsed.disabledCategories.forEach(function (name) {
          if (typeof name === "string" && disabledCategories.indexOf(name) === -1) {
            disabledCategories.push(name);
          }
        });
      }
      var disabledLevels = [];
      if (Array.isArray(parsed.disabledLevels)) {
        parsed.disabledLevels.forEach(function (level) {
          if (
            typeof level === "number" &&
            isFinite(level) &&
            Math.floor(level) === level &&
            level >= 1 &&
            level <= 5 &&
            disabledLevels.indexOf(level) === -1
          ) {
            disabledLevels.push(level);
          }
        });
      }
      return {
        scores: scores,
        legacyScore: legacyScore,
        lastOutcomes: lastOutcomes,
        recentIds: recentIds,
        disabledCategories: disabledCategories,
        unlockAll: parsed.unlockAll === true,
        disabledLevels: disabledLevels
      };
    } catch (err) {
      return defaultState();
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (err) {
      // Ignore storage errors (e.g. private browsing restrictions).
    }
  }

  function tierForScore(score) {
    for (var i = 0; i < DIFFICULTY_TIERS.length; i++) {
      if (score >= DIFFICULTY_TIERS[i].minScore && score <= DIFFICULTY_TIERS[i].maxScore) {
        return DIFFICULTY_TIERS[i];
      }
    }
    return DIFFICULTY_TIERS[0];
  }

  function tierForLevel(level) {
    for (var i = 0; i < DIFFICULTY_TIERS.length; i++) {
      if (DIFFICULTY_TIERS[i].level === level) {
        return DIFFICULTY_TIERS[i];
      }
    }
    return DIFFICULTY_TIERS[0];
  }

  function scoreFor(categoryName) {
    return persisted.scores[categoryName] || 0;
  }

  function tierForCategory(categoryName) {
    return tierForScore(scoreFor(categoryName));
  }

  function totalScore() {
    var total = 0;
    for (var i = 0; i < categories.length; i++) {
      total += scoreFor(categories[i]);
    }
    return total;
  }

  // Moves a pre-category save's single score onto the categories the player
  // actually answered questions in, so nobody loses earned progress.
  function migrateLegacyScore() {
    var legacyScore = persisted.legacyScore;
    delete persisted.legacyScore;
    if (!legacyScore || Object.keys(persisted.scores).length > 0) {
      return;
    }

    var played = [];
    for (var i = 0; i < deck.length; i++) {
      var card = deck[i];
      if (persisted.lastOutcomes[card.id] && played.indexOf(card.category) === -1) {
        played.push(card.category);
      }
    }
    (played.length > 0 ? played : categories).forEach(function (name) {
      persisted.scores[name] = legacyScore;
    });
    saveState();
  }

  function validateDeck(cards) {
    var errors = [];
    if (!Array.isArray(cards) || cards.length < ROUND_SIZE) {
      errors.push("Question deck must be an array with at least " + ROUND_SIZE + " questions.");
      return errors;
    }

    var allowedTagLookup = {};
    for (var t = 0; t < ALLOWED_TAGS.length; t++) {
      allowedTagLookup[ALLOWED_TAGS[t]] = true;
    }

    var seenIds = {};
    var levelOneCount = 0;
    var seenCategories = [];
    var categoryLevelOneCounts = {};

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var label = card && card.id ? "Card '" + card.id + "'" : "Card at index " + i;

      if (!card || typeof card !== "object") {
        errors.push(label + " is not an object.");
        continue;
      }

      if (typeof card.id !== "string" || !card.id.trim()) {
        errors.push(label + " is missing a non-empty string id.");
      } else if (seenIds[card.id]) {
        errors.push("Duplicate question id '" + card.id + "'.");
      } else {
        seenIds[card.id] = true;
      }

      if (
        typeof card.difficulty !== "number" ||
        Math.floor(card.difficulty) !== card.difficulty ||
        card.difficulty < 1 ||
        card.difficulty > 5
      ) {
        errors.push(label + " must have an integer difficulty from 1 to 5.");
      } else if (card.difficulty === 1) {
        levelOneCount += 1;
      }

      if (!Array.isArray(card.tags) || card.tags.length === 0) {
        errors.push(label + " must include at least one tag.");
      } else {
        var seenCardTags = {};
        for (var j = 0; j < card.tags.length; j++) {
          var tag = card.tags[j];
          if (!allowedTagLookup[tag]) {
            errors.push(label + " uses unsupported tag '" + tag + "'.");
          }
          if (seenCardTags[tag]) {
            errors.push(label + " repeats tag '" + tag + "'.");
          }
          seenCardTags[tag] = true;
        }
      }

      if (typeof card.category !== "string" || !card.category.trim()) {
        errors.push(label + " is missing a category.");
      } else {
        if (seenCategories.indexOf(card.category) === -1) {
          seenCategories.push(card.category);
          categoryLevelOneCounts[card.category] = 0;
        }
        if (card.difficulty === 1) {
          categoryLevelOneCounts[card.category] += 1;
        }
      }

      if (typeof card.question !== "string" || !card.question.trim()) {
        errors.push(label + " is missing question text.");
      }
      if (typeof card.hint !== "string" || !card.hint.trim()) {
        errors.push(label + " is missing a hint.");
      }
      if (typeof card.explanationShort !== "string" || !card.explanationShort.trim()) {
        errors.push(label + " is missing explanationShort.");
      }
      if (typeof card.explanationLong !== "string" || !card.explanationLong.trim()) {
        errors.push(label + " is missing explanationLong.");
      }

      if (!Array.isArray(card.answers) || card.answers.length < 2 || card.answers.length > 4) {
        errors.push(label + " must have between 2 and 4 answers.");
      } else {
        var correctCount = 0;
        for (var a = 0; a < card.answers.length; a++) {
          var ans = card.answers[a];
          if (!ans || typeof ans.text !== "string" || !ans.text.trim()) {
            errors.push(label + " answer " + (a + 1) + " is missing text.");
          }
          if (typeof ans.correct !== "boolean") {
            errors.push(label + " answer " + (a + 1) + " must set boolean correct.");
          } else if (ans.correct) {
            correctCount += 1;
          }
        }
        if (correctCount !== 1) {
          errors.push(label + " must have exactly 1 correct answer (found " + correctCount + ").");
        }
      }
    }

    if (levelOneCount < ROUND_SIZE) {
      errors.push(
        "Deck needs at least " + ROUND_SIZE + " difficulty-1 questions so a new player can draw a full round."
      );
    }

    for (var c = 0; c < seenCategories.length; c++) {
      var catName = seenCategories[c];
      if (categoryLevelOneCounts[catName] < ROUND_SIZE) {
        errors.push(
          "Category '" + catName + "' needs at least " + ROUND_SIZE + " difficulty-1 questions so a new player can draw a full round."
        );
      }
    }

    return errors;
  }

  function shuffleArray(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function computeCardWeight(card, ceiling) {
    // In practice mode every enabled tier is equally "at the ceiling", so a
    // neutral weight keeps level 5 from crowding out the easier cards.
    var ceilingWeight = 1;
    if (!persisted.unlockAll) {
      var distanceFromCeiling = ceiling - card.difficulty;
      ceilingWeight = 0.85;
      if (distanceFromCeiling === 0) {
        ceilingWeight = 3.0;
      } else if (distanceFromCeiling === 1) {
        ceilingWeight = 1.9;
      } else if (distanceFromCeiling === 2) {
        ceilingWeight = 1.25;
      }
    }

    var outcome = persisted.lastOutcomes[card.id];
    var outcomeWeight = 1.35; // Unseen cards get a slight nudge over already-mastered ones.
    if (outcome === "wrong") {
      outcomeWeight = 2.6;
    } else if (outcome === "correct") {
      outcomeWeight = 0.9;
    }

    var recentIds = persisted.recentIds;
    var lastRoundStart = Math.max(0, recentIds.length - ROUND_SIZE);
    var inLastRound = recentIds.slice(lastRoundStart).indexOf(card.id) !== -1;
    var inRecentRounds = recentIds.indexOf(card.id) !== -1;

    var recencyWeight = 1.0;
    if (inLastRound) {
      recencyWeight = 0.14;
    } else if (inRecentRounds) {
      recencyWeight = 0.42;
    }

    return ceilingWeight * outcomeWeight * recencyWeight;
  }

  function collectCategories(cards) {
    var names = [];
    for (var i = 0; i < cards.length; i++) {
      var name = cards[i] && cards[i].category;
      if (typeof name === "string" && name.trim() && names.indexOf(name) === -1) {
        names.push(name);
      }
    }
    return names;
  }

  function assignCategoryColors(names) {
    var colors = {};
    var used = [];
    names.forEach(function (name) {
      var fixed = CATEGORY_COLOR_NAMES[name];
      if (fixed && CATEGORY_PALETTE[fixed]) {
        colors[name] = CATEGORY_PALETTE[fixed];
        used.push(fixed);
      }
    });
    names.forEach(function (name) {
      if (colors[name]) {
        return;
      }
      var free = PALETTE_ORDER.filter(function (key) { return used.indexOf(key) === -1; });
      // With more categories than colours, reuse the palette in order.
      var key = free.length > 0 ? free[0] : PALETTE_ORDER[used.length % PALETTE_ORDER.length];
      colors[name] = CATEGORY_PALETTE[key];
      used.push(key);
    });
    return colors;
  }

  // Exposes the category colour as CSS custom properties on the element, so
  // the stylesheet decides where the colour is used.
  function applyCategoryColor(el, categoryName) {
    var color = categoryColors[categoryName] || CATEGORY_PALETTE.slate;
    el.style.setProperty("--cat-accent", color.accent);
    el.style.setProperty("--cat-soft", color.soft);
    el.style.setProperty("--cat-tint", color.tint);
  }

  function isCategoryEnabled(name) {
    return persisted.disabledCategories.indexOf(name) === -1;
  }

  function enabledCategoryNames() {
    return categories.filter(isCategoryEnabled);
  }

  function setCategoryEnabled(name, enabled) {
    var index = persisted.disabledCategories.indexOf(name);
    if (enabled && index !== -1) {
      persisted.disabledCategories.splice(index, 1);
    } else if (!enabled && index === -1) {
      persisted.disabledCategories.push(name);
    }
    saveState();
  }

  function isLevelEnabled(level) {
    return persisted.disabledLevels.indexOf(level) === -1;
  }

  function enabledLevels() {
    var levels = [];
    for (var i = 0; i < DIFFICULTY_TIERS.length; i++) {
      var level = DIFFICULTY_TIERS[i].level;
      if (isLevelEnabled(level)) {
        levels.push(level);
      }
    }
    return levels;
  }

  function setLevelEnabled(level, enabled) {
    var index = persisted.disabledLevels.indexOf(level);
    if (enabled && index !== -1) {
      persisted.disabledLevels.splice(index, 1);
    } else if (!enabled && index === -1) {
      persisted.disabledLevels.push(level);
    }
    saveState();
  }

  function setUnlockAll(on) {
    if (persisted.unlockAll === on) {
      return;
    }
    persisted.unlockAll = on;
    saveState();
    updateHeaderStatus();
    els.startScore.textContent = String(totalScore());
    els.startScoreCaption.textContent = persisted.unlockAll
      ? "Paused while all difficulties are unlocked"
      : "Sum of your category scores";
    renderStartSelection();
  }

  // Cards the player can actually be asked right now: in a category that is
  // switched on, and either inside that category's difficulty ceiling or, in
  // practice mode, in a difficulty tier that is switched on.
  function availableCards() {
    return deck.filter(function (card) {
      if (!isCategoryEnabled(card.category)) {
        return false;
      }
      if (persisted.unlockAll) {
        return isLevelEnabled(card.difficulty);
      }
      return card.difficulty <= tierForCategory(card.category).level;
    });
  }

  function canStartRound() {
    return deckValid && availableCards().length > 0;
  }

  function drawRound() {
    var pool = availableCards();

    var remaining = pool.slice();
    var chosen = [];
    var targetCount = Math.min(ROUND_SIZE, remaining.length);

    while (chosen.length < targetCount && remaining.length > 0) {
      var weights = [];
      var totalWeight = 0;

      for (var i = 0; i < remaining.length; i++) {
        var w = computeCardWeight(remaining[i], tierForCategory(remaining[i].category).level);
        weights.push(w);
        totalWeight += w;
      }

      var threshold = Math.random() * totalWeight;
      var pickedIndex = remaining.length - 1;

      for (var k = 0; k < remaining.length; k++) {
        threshold -= weights[k];
        if (threshold <= 0) {
          pickedIndex = k;
          break;
        }
      }

      chosen.push(remaining[pickedIndex]);
      remaining.splice(pickedIndex, 1);
    }

    return chosen;
  }

  function showScreen(screenName) {
    session.screen = screenName;
    if (screenName !== "start" && isSettingsOpen()) {
      closeSettings(false);
    }
    els.btnSettings.hidden = screenName !== "start";
    els.screenStart.hidden = screenName !== "start";
    els.screenQuestion.hidden = screenName !== "question";
    els.screenSummary.hidden = screenName !== "summary";
  }

  function updateHeaderStatus() {
    els.headerScore.textContent = String(totalScore());
    els.headerScoreNote.hidden = !persisted.unlockAll;
  }

  function categoryProgressText(name) {
    var score = scoreFor(name);
    if (persisted.unlockAll) {
      return "Score " + score + " (paused)";
    }
    var tier = tierForScore(score);
    var text = "Score " + score + " \u00b7 " + tier.label;
    if (tier.level < 5) {
      var nextTier = tierForLevel(tier.level + 1);
      text += " \u00b7 +" + (nextTier.minScore - score) + " to unlock Level " + nextTier.level;
    }
    return text;
  }

  function buildCategoryButtons() {
    els.categoryList.innerHTML = "";
    categoryButtons = {};

    categories.forEach(function (name) {
      var total = deck.filter(function (card) { return card.category === name; }).length;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-toggle";
      applyCategoryColor(btn, name);

      var text = document.createElement("span");
      text.className = "category-text";

      var nameEl = document.createElement("span");
      nameEl.className = "category-name";
      nameEl.textContent = name;

      var countEl = document.createElement("span");
      countEl.className = "category-count";
      countEl.textContent = total + (total === 1 ? " question" : " questions");

      var progressEl = document.createElement("span");
      progressEl.className = "category-progress";

      var switchEl = document.createElement("span");
      switchEl.className = "category-switch";
      switchEl.setAttribute("aria-hidden", "true");

      text.appendChild(nameEl);
      text.appendChild(countEl);
      text.appendChild(progressEl);
      btn.appendChild(text);
      btn.appendChild(switchEl);

      btn.addEventListener("click", function () {
        setCategoryEnabled(name, !isCategoryEnabled(name));
        renderStartSelection();
      });

      categoryButtons[name] = btn;
      els.categoryList.appendChild(btn);
    });
  }

  // Refreshes everything on the start screen that depends on which categories
  // are on: the toggle buttons, the pool size, and whether Start is allowed.
  // Updates elements in place so keyboard focus stays on the toggled button.
  function renderStartSelection() {
    categories.forEach(function (name) {
      var btn = categoryButtons[name];
      var on = isCategoryEnabled(name);
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.querySelector(".category-switch").textContent = on ? "On" : "Off";
      btn.querySelector(".category-progress").textContent = categoryProgressText(name);
    });

    var selectedTotal = deck.filter(function (card) {
      return isCategoryEnabled(card.category);
    }).length;
    var availableCount = availableCards().length;

    els.startPool.textContent = String(availableCount);
    if (enabledCategoryNames().length === 0) {
      els.startPoolCount.textContent = "No category selected";
    } else {
      els.startPoolCount.textContent =
        "of " + selectedTotal + " questions in the selected categories";
    }

    var categoryMessage = "";
    var levelMessage = "";
    if (deckValid) {
      if (enabledCategoryNames().length === 0) {
        categoryMessage = "Turn on at least one category to start.";
      } else if (persisted.unlockAll && enabledLevels().length === 0) {
        levelMessage = "Turn on at least one difficulty tier to start.";
      } else if (availableCount === 0) {
        levelMessage = persisted.unlockAll
          ? "The selected categories have no questions in the tiers that are on."
          : "";
        categoryMessage = persisted.unlockAll
          ? ""
          : "The selected categories have no questions at your current level yet. Turn on another category.";
      }
    }
    els.categoryMessage.textContent = categoryMessage;
    els.categoryMessage.hidden = categoryMessage === "";
    els.levelMessage.textContent = levelMessage;
    els.levelMessage.hidden = levelMessage === "";

    renderLadder();
    renderModeSwitch();
    els.btnStartRound.disabled = !canStartRound();
  }

  function renderLadder() {
    var tierButtons = els.ladderSteps.querySelectorAll("button[data-level]");
    for (var i = 0; i < tierButtons.length; i++) {
      var btn = tierButtons[i];
      var level = Number(btn.getAttribute("data-level"));
      var on = isLevelEnabled(level);
      btn.disabled = !persisted.unlockAll;
      btn.classList.toggle("is-on", persisted.unlockAll && on);
      if (persisted.unlockAll) {
        btn.setAttribute("aria-label", "Level " + level);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      } else {
        btn.removeAttribute("aria-label");
        btn.removeAttribute("aria-pressed");
      }
      btn.querySelector(".tier-range").hidden = persisted.unlockAll;
      btn.querySelector(".tier-score-label").hidden = persisted.unlockAll;
      btn.querySelector(".tier-practice-label").hidden = !persisted.unlockAll;
      btn.querySelector(".tier-state").hidden = !persisted.unlockAll;
      btn.querySelector(".tier-state").textContent = on ? "On" : "Off";
    }
    els.ladderCaption.textContent = persisted.unlockAll
      ? "Turn tiers on or off. Questions in tiers that are off are not asked."
      : "Each category climbs on its own score: +1 right, \u22121 wrong (min 0)";
  }

  function renderStartScreen() {
    updateHeaderStatus();
    els.startScore.textContent = String(totalScore());
    els.startScoreCaption.textContent = persisted.unlockAll
      ? "Paused while all difficulties are unlocked"
      : "Sum of your category scores";
    renderStartSelection();
    els.resetConfirmRow.hidden = true;
    showScreen("start");
  }

  function startRound() {
    if (!canStartRound()) {
      return;
    }

    session.roundStartScores = {};
    categories.forEach(function (name) {
      session.roundStartScores[name] = scoreFor(name);
    });
    session.roundCards = drawRound();
    session.roundIndex = 0;
    session.roundResults = [];

    showScreen("question");
    renderCurrentQuestion();
  }

  function renderRoundPips() {
    els.roundPips.innerHTML = "";
    for (var i = 0; i < session.roundCards.length; i++) {
      var pip = document.createElement("span");
      pip.className = "round-pip";
      applyCategoryColor(pip, session.roundCards[i].category);
      if (i < session.roundResults.length) {
        pip.classList.add(session.roundResults[i].correct ? "is-correct" : "is-wrong");
      } else if (i === session.roundIndex) {
        pip.classList.add("is-current");
      }
      els.roundPips.appendChild(pip);
    }
  }

  function renderCurrentQuestion() {
    var card = session.roundCards[session.roundIndex];
    session.shuffledAnswers = shuffleArray(card.answers);
    session.answered = false;
    session.hintOpen = false;

    els.questionProgressText.textContent =
      "Question " + (session.roundIndex + 1) + " of " + session.roundCards.length;
    renderRoundPips();

    applyCategoryColor(els.screenQuestion, card.category);
    els.questionTags.innerHTML = "";
    var categoryTag = document.createElement("li");
    categoryTag.className = "tag-pill tag-pill--category";
    categoryTag.textContent = card.category;
    els.questionTags.appendChild(categoryTag);
    for (var t = 0; t < card.tags.length; t++) {
      var tagItem = document.createElement("li");
      tagItem.className = "tag-pill";
      tagItem.textContent = card.tags[t];
      els.questionTags.appendChild(tagItem);
    }

    els.questionDifficulty.textContent = "Difficulty " + card.difficulty + " / 5";
    els.questionText.textContent = card.question;

    els.hintText.textContent = card.hint;
    els.hintPanel.hidden = true;
    els.btnHint.disabled = false;
    els.btnHint.setAttribute("aria-expanded", "false");
    els.btnHint.innerHTML = "Show hint <kbd>H</kbd>";

    els.answersList.innerHTML = "";
    for (var i = 0; i < session.shuffledAnswers.length; i++) {
      (function (answerIndex) {
        var answer = session.shuffledAnswers[answerIndex];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "answer-btn";
        btn.setAttribute("data-index", String(answerIndex));

        var keyBadge = document.createElement("span");
        keyBadge.className = "answer-key";
        keyBadge.setAttribute("aria-hidden", "true");
        keyBadge.textContent = String(answerIndex + 1);

        var label = document.createElement("span");
        label.className = "answer-label";
        label.textContent = answer.text;

        btn.appendChild(keyBadge);
        btn.appendChild(label);

        btn.addEventListener("click", function () {
          chooseAnswer(answerIndex);
        });

        els.answersList.appendChild(btn);
      })(i);
    }

    els.feedbackPanel.hidden = true;
    els.feedbackPanel.classList.remove("is-correct", "is-wrong");
  }

  function toggleHint() {
    if (session.screen !== "question" || session.answered) {
      return;
    }
    session.hintOpen = !session.hintOpen;
    els.hintPanel.hidden = !session.hintOpen;
    els.btnHint.setAttribute("aria-expanded", session.hintOpen ? "true" : "false");
    els.btnHint.innerHTML = session.hintOpen ? "Hide hint <kbd>H</kbd>" : "Show hint <kbd>H</kbd>";
  }

  function appendStatusBadge(buttonEl, text) {
    var badge = document.createElement("span");
    badge.className = "answer-state-tag";
    badge.textContent = text;
    buttonEl.appendChild(badge);
  }

  function chooseAnswer(selectedIndex) {
    if (session.answered || session.screen !== "question") {
      return;
    }
    if (selectedIndex < 0 || selectedIndex >= session.shuffledAnswers.length) {
      return;
    }

    session.answered = true;
    var card = session.roundCards[session.roundIndex];
    var chosen = session.shuffledAnswers[selectedIndex];
    var isCorrect = Boolean(chosen.correct);

    // Keep an opened hint visible alongside the explanation; lock the toggle once answered.
    els.btnHint.disabled = true;

    var buttons = els.answersList.querySelectorAll(".answer-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var ans = session.shuffledAnswers[i];
      if (i === selectedIndex && isCorrect) {
        buttons[i].classList.add("is-correct");
        appendStatusBadge(buttons[i], "Correct");
      } else if (i === selectedIndex && !isCorrect) {
        buttons[i].classList.add("is-wrong");
        appendStatusBadge(buttons[i], "Your pick");
      } else if (ans.correct) {
        buttons[i].classList.add("is-correct");
        appendStatusBadge(buttons[i], "Right answer");
      } else {
        buttons[i].classList.add("is-muted");
      }
    }

    var previousScore = scoreFor(card.category);
    var newScore = previousScore;
    if (!persisted.unlockAll) {
      newScore = isCorrect ? previousScore + 1 : Math.max(0, previousScore - 1);
      persisted.scores[card.category] = newScore;
    }

    persisted.lastOutcomes[card.id] = isCorrect ? "correct" : "wrong";
    persisted.recentIds.push(card.id);
    if (persisted.recentIds.length > RECENT_HISTORY_LIMIT) {
      persisted.recentIds = persisted.recentIds.slice(-RECENT_HISTORY_LIMIT);
    }
    saveState();
    updateHeaderStatus();

    session.roundResults.push({
      card: card,
      correct: isCorrect
    });
    renderRoundPips();

    els.feedbackPanel.classList.remove("is-correct", "is-wrong");
    els.feedbackPanel.classList.add(isCorrect ? "is-correct" : "is-wrong");

    if (isCorrect) {
      els.feedbackVerdict.textContent = "Correct";
      els.feedbackExplanation.textContent = card.explanationShort;
    } else {
      els.feedbackVerdict.textContent = "Not quite";
      els.feedbackExplanation.textContent = card.explanationLong;
    }
    if (persisted.unlockAll) {
      els.feedbackDelta.textContent = "Practice mode: score not tracked";
    } else if (isCorrect) {
      els.feedbackDelta.textContent = "+1 " + card.category + " score (now " + newScore + ")";
    } else {
      els.feedbackDelta.textContent =
        previousScore > 0
          ? "\u22121 " + card.category + " score (now " + newScore + ")"
          : card.category + " score stays at 0";
    }

    var isLastQuestion = session.roundIndex >= session.roundCards.length - 1;
    els.btnNext.innerHTML = isLastQuestion
      ? "See round summary <kbd>Enter</kbd>"
      : "Next question <kbd>Enter</kbd>";

    els.feedbackPanel.hidden = false;
  }

  function advanceQuestion() {
    if (session.screen !== "question" || !session.answered) {
      return;
    }
    if (session.roundIndex < session.roundCards.length - 1) {
      session.roundIndex += 1;
      renderCurrentQuestion();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      renderSummaryScreen();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function renderSummaryScreen() {
    updateHeaderStatus();

    var correctCount = 0;
    for (var i = 0; i < session.roundResults.length; i++) {
      if (session.roundResults[i].correct) {
        correctCount += 1;
      }
    }

    var totalCount = session.roundResults.length;
    var startTotal = 0;
    categories.forEach(function (name) {
      startTotal += session.roundStartScores[name] || 0;
    });
    var endTotal = totalScore();
    var netDelta = endTotal - startTotal;

    if (correctCount === totalCount) {
      els.summaryHeadline.textContent = "Clean sweep — " + totalCount + " out of " + totalCount;
    } else if (correctCount >= 4) {
      els.summaryHeadline.textContent = "Strong round";
    } else if (correctCount >= 3) {
      els.summaryHeadline.textContent = "Solid progress";
    } else {
      els.summaryHeadline.textContent = "Good material to revisit";
    }

    els.summaryCorrect.textContent = correctCount + " / " + totalCount;
    els.summaryScore.textContent = String(endTotal);
    els.summaryDelta.classList.toggle("is-text", persisted.unlockAll);

    if (persisted.unlockAll) {
      els.summaryDelta.textContent = "Not tracked";
      els.summaryDeltaCaption.textContent = "Scores stay where you left them";
      els.summaryCeilingNote.hidden = true;
      els.summaryCeilingNote.textContent = "";
    } else {
      els.summaryDelta.textContent = (netDelta > 0 ? "+" : netDelta < 0 ? "\u2212" : "") + Math.abs(netDelta);
      els.summaryDeltaCaption.textContent =
        "From " + startTotal + " to " + endTotal;

      var ceilingNotes = [];
      var anyRose = false;
      categories.forEach(function (name) {
        var startTier = tierForScore(session.roundStartScores[name] || 0);
        var endTier = tierForCategory(name);
        if (endTier.level > startTier.level) {
          anyRose = true;
          ceilingNotes.push(
            name + ": difficulty ceiling rose from " + startTier.label + " to " + endTier.label +
            ". Harder questions (" + endTier.detail.toLowerCase() + ") now join the next round."
          );
        } else if (endTier.level < startTier.level) {
          ceilingNotes.push(
            name + ": difficulty ceiling moved from " + startTier.label + " back to " + endTier.label +
            " so the next round focuses on core concepts before ramping up again."
          );
        }
      });

      els.summaryCeilingNote.hidden = ceilingNotes.length === 0;
      els.summaryCeilingNote.classList.toggle("is-down", ceilingNotes.length > 0 && !anyRose);
      els.summaryCeilingNote.textContent = ceilingNotes.join(" ");
    }

    els.summaryRecap.innerHTML = "";
    for (var r = 0; r < session.roundResults.length; r++) {
      var item = session.roundResults[r];
      var li = document.createElement("li");
      li.className = "recap-item " + (item.correct ? "is-correct" : "is-wrong");
      applyCategoryColor(li, item.card.category);

      var mark = document.createElement("span");
      mark.className = "recap-mark";
      mark.textContent = item.correct ? "Right" : "Missed";

      var body = document.createElement("div");
      body.className = "recap-body";

      var qText = document.createElement("p");
      qText.className = "recap-question";
      qText.textContent = item.card.question;

      var meta = document.createElement("div");
      meta.className = "recap-meta";
      var metaCategory = document.createElement("span");
      metaCategory.className = "recap-category";
      metaCategory.textContent = item.card.category;
      meta.appendChild(metaCategory);
      meta.appendChild(document.createTextNode(
        " \u00b7 Difficulty " + item.card.difficulty + " \u00b7 " + item.card.tags.join(", ")
      ));

      body.appendChild(qText);
      body.appendChild(meta);
      li.appendChild(mark);
      li.appendChild(body);
      els.summaryRecap.appendChild(li);
    }

    showScreen("summary");
  }

  function resetProgress() {
    // Reset clears score and history but keeps category choices and settings.
    var keptDisabledCategories = persisted.disabledCategories;
    var keptUnlockAll = persisted.unlockAll;
    var keptDisabledLevels = persisted.disabledLevels.slice();
    persisted = defaultState();
    persisted.disabledCategories = keptDisabledCategories;
    persisted.unlockAll = keptUnlockAll;
    persisted.disabledLevels = keptDisabledLevels;
    saveState();
    renderStartScreen();
  }

  var settingsCloseTimer = 0;

  function isSettingsOpen() {
    return session.settingsOpen;
  }

  function renderModeSwitch() {
    els.btnUnlockAll.setAttribute("aria-checked", persisted.unlockAll ? "true" : "false");
    els.btnUnlockAll.classList.toggle("is-on", persisted.unlockAll);
    els.modeLabelScore.classList.toggle("is-active", !persisted.unlockAll);
    els.modeLabelUnlock.classList.toggle("is-active", persisted.unlockAll);
  }

  function openSettings() {
    if (session.settingsOpen) {
      return;
    }
    session.settingsOpen = true;
    window.clearTimeout(settingsCloseTimer);
    els.settingsBackdrop.hidden = false;
    els.settingsPanel.hidden = false;
    els.settingsPanel.inert = false;
    els.settingsPanel.setAttribute("aria-hidden", "false");
    els.appShell.inert = true;
    els.btnSettings.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    // Flush layout so the closed transform is committed before transitioning open.
    void els.settingsPanel.offsetWidth;
    els.settingsBackdrop.classList.add("is-open");
    els.settingsPanel.classList.add("is-open");
    els.btnSettingsClose.focus();
  }

  function closeSettings(restoreFocus) {
    if (!session.settingsOpen && els.settingsPanel.hidden) {
      return;
    }
    session.settingsOpen = false;
    els.settingsBackdrop.classList.remove("is-open");
    els.settingsPanel.classList.remove("is-open");
    els.settingsPanel.setAttribute("aria-hidden", "true");
    els.settingsPanel.inert = true;
    els.appShell.inert = false;
    els.btnSettings.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.clearTimeout(settingsCloseTimer);
    var finish = function () {
      if (session.settingsOpen) {
        return;
      }
      els.settingsBackdrop.hidden = true;
      els.settingsPanel.hidden = true;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
    } else {
      settingsCloseTimer = window.setTimeout(finish, 220);
    }
    if (restoreFocus !== false) {
      els.btnSettings.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    var key = event.key;

    if (isSettingsOpen()) {
      if (key === "Escape") {
        event.preventDefault();
        closeSettings();
        return;
      }
      if (key === "Tab") {
        var focusables = els.settingsPanel.querySelectorAll(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (!els.settingsPanel.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (session.screen === "question") {
      if (!session.answered) {
        if (key === "1" || key === "2" || key === "3" || key === "4") {
          var index = Number(key) - 1;
          if (index < session.shuffledAnswers.length) {
            event.preventDefault();
            chooseAnswer(index);
          }
          return;
        }

        if (key === "h" || key === "H") {
          event.preventDefault();
          toggleHint();
          return;
        }
      } else if (key === "Enter") {
        // Avoid double-triggering if #btn-next already has focus.
        if (document.activeElement === els.btnNext) {
          return;
        }
        event.preventDefault();
        advanceQuestion();
      }
      return;
    }

    if (key === "Enter") {
      var active = document.activeElement;
      var focusedButton = active && active.tagName === "BUTTON" ? active : null;

      if (session.screen === "start" && els.resetConfirmRow.hidden && canStartRound()) {
        if (focusedButton && focusedButton !== els.btnStartRound) {
          return;
        }
        if (focusedButton === els.btnStartRound) {
          return;
        }
        event.preventDefault();
        startRound();
      } else if (session.screen === "summary" && canStartRound()) {
        if (focusedButton && focusedButton !== els.btnPlayAgain) {
          return;
        }
        if (focusedButton === els.btnPlayAgain) {
          return;
        }
        event.preventDefault();
        startRound();
      }
    }
  }

  function init() {
    var errors = validateDeck(deck);
    if (errors.length > 0) {
      deckValid = false;
      els.validationBanner.hidden = false;
      els.validationBanner.textContent =
        "Question deck validation failed (" + errors.length + "): " + errors.slice(0, 3).join(" ");
    } else {
      deckValid = true;
      els.validationBanner.hidden = true;
    }

    // Build the category toggles from the deck. Forget saved "off" choices for
    // categories that no longer exist so they can't hide a future category.
    categories = collectCategories(deck);
    categoryColors = assignCategoryColors(categories);
    persisted.disabledCategories = persisted.disabledCategories.filter(function (name) {
      return categories.indexOf(name) !== -1;
    });
    migrateLegacyScore();
    buildCategoryButtons();
    els.settingsPanel.inert = true;

    var tierButtons = els.ladderSteps.querySelectorAll("button[data-level]");
    for (var t = 0; t < tierButtons.length; t++) {
      tierButtons[t].addEventListener("click", function () {
        if (!persisted.unlockAll) {
          return;
        }
        var level = Number(this.getAttribute("data-level"));
        setLevelEnabled(level, !isLevelEnabled(level));
        renderStartSelection();
      });
    }

    els.btnSettings.addEventListener("click", openSettings);
    els.btnSettingsClose.addEventListener("click", function () {
      closeSettings();
    });
    els.settingsBackdrop.addEventListener("click", function () {
      closeSettings();
    });
    els.btnUnlockAll.addEventListener("click", function () {
      setUnlockAll(!persisted.unlockAll);
    });
    els.modeLabelScore.addEventListener("click", function () {
      setUnlockAll(false);
    });
    els.modeLabelUnlock.addEventListener("click", function () {
      setUnlockAll(true);
    });

    els.btnStartRound.addEventListener("click", startRound);
    els.btnHint.addEventListener("click", toggleHint);
    els.btnNext.addEventListener("click", advanceQuestion);
    els.btnPlayAgain.addEventListener("click", startRound);
    els.btnBackStart.addEventListener("click", renderStartScreen);

    els.btnResetRequest.addEventListener("click", function () {
      els.resetConfirmRow.hidden = false;
    });
    els.btnResetCancel.addEventListener("click", function () {
      els.resetConfirmRow.hidden = true;
    });
    els.btnResetConfirm.addEventListener("click", resetProgress);

    document.addEventListener("keydown", handleKeyDown);

    renderStartScreen();
  }

  init();
})();
