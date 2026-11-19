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
    "Drupal 11"
  ];

  var DIFFICULTY_TIERS = [
    { level: 1, minScore: 0, maxScore: 9, label: "Level 1", detail: "What the concept is for" },
    { level: 2, minScore: 10, maxScore: 24, label: "Levels 1–2", detail: "Why this approach exists" },
    { level: 3, minScore: 25, maxScore: 44, label: "Levels 1–3", detail: "Which nearby idea it is not" },
    { level: 4, minScore: 45, maxScore: 69, label: "Levels 1–4", detail: "What fails with the tempting alternative" },
    { level: 5, minScore: 70, maxScore: Infinity, label: "Levels 1–5", detail: "Tradeoffs & Drupal 10 vs 11" }
  ];

  var deck = Array.isArray(window.DRUPAL_QUESTIONS) ? window.DRUPAL_QUESTIONS : [];
  var deckValid = false;

  var persisted = loadState();

  var session = {
    screen: "start", // "start" | "question" | "summary"
    roundCards: [],
    roundIndex: 0,
    shuffledAnswers: [],
    answered: false,
    hintOpen: false,
    roundResults: [],
    roundStartScore: 0,
    roundStartCeiling: 1
  };

  var els = {
    headerScore: document.getElementById("header-score"),
    headerCeiling: document.getElementById("header-ceiling"),
    validationBanner: document.getElementById("validation-banner"),

    screenStart: document.getElementById("screen-start"),
    screenQuestion: document.getElementById("screen-question"),
    screenSummary: document.getElementById("screen-summary"),

    startScore: document.getElementById("start-score"),
    startCeiling: document.getElementById("start-ceiling"),
    startPoolCount: document.getElementById("start-pool-count"),
    startNextUnlock: document.getElementById("start-next-unlock"),
    ladderSteps: document.getElementById("ladder-steps"),
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
    summaryCeiling: document.getElementById("summary-ceiling"),
    summaryCeilingNote: document.getElementById("summary-ceiling-note"),
    summaryRecap: document.getElementById("summary-recap"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    btnBackStart: document.getElementById("btn-back-start")
  };

  function defaultState() {
    return {
      score: 0,
      lastOutcomes: {},
      recentIds: []
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultState();
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return defaultState();
      }
      var score = typeof parsed.score === "number" && isFinite(parsed.score)
        ? Math.max(0, Math.floor(parsed.score))
        : 0;
      var lastOutcomes = parsed.lastOutcomes && typeof parsed.lastOutcomes === "object"
        ? parsed.lastOutcomes
        : {};
      var recentIds = Array.isArray(parsed.recentIds)
        ? parsed.recentIds.filter(function (id) { return typeof id === "string"; }).slice(-RECENT_HISTORY_LIMIT)
        : [];
      return {
        score: score,
        lastOutcomes: lastOutcomes,
        recentIds: recentIds
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
    var distanceFromCeiling = ceiling - card.difficulty;
    var ceilingWeight = 0.85;
    if (distanceFromCeiling === 0) {
      ceilingWeight = 3.0;
    } else if (distanceFromCeiling === 1) {
      ceilingWeight = 1.9;
    } else if (distanceFromCeiling === 2) {
      ceilingWeight = 1.25;
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

  function drawRound(ceiling) {
    var pool = deck.filter(function (card) {
      return card.difficulty <= ceiling;
    });

    var remaining = pool.slice();
    var chosen = [];
    var targetCount = Math.min(ROUND_SIZE, remaining.length);

    while (chosen.length < targetCount && remaining.length > 0) {
      var weights = [];
      var totalWeight = 0;

      for (var i = 0; i < remaining.length; i++) {
        var w = computeCardWeight(remaining[i], ceiling);
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
    els.screenStart.hidden = screenName !== "start";
    els.screenQuestion.hidden = screenName !== "question";
    els.screenSummary.hidden = screenName !== "summary";
  }

  function updateHeaderStatus() {
    var tier = tierForScore(persisted.score);
    els.headerScore.textContent = String(persisted.score);
    els.headerCeiling.textContent = tier.label;
  }

  function renderStartScreen() {
    updateHeaderStatus();
    var tier = tierForScore(persisted.score);
    var unlockedCount = deck.filter(function (card) {
      return card.difficulty <= tier.level;
    }).length;

    els.startScore.textContent = String(persisted.score);
    els.startCeiling.textContent = tier.label;
    els.startPoolCount.textContent = unlockedCount + " of " + deck.length + " questions in pool";

    if (tier.level < 5) {
      var nextTier = tierForLevel(tier.level + 1);
      var needed = nextTier.minScore - persisted.score;
      els.startNextUnlock.textContent =
        "Need +" + needed + " more (score " + nextTier.minScore + ") to unlock Level " + nextTier.level;
    } else {
      els.startNextUnlock.textContent = "All 5 difficulty levels unlocked";
    }

    var stepItems = els.ladderSteps.querySelectorAll("li[data-level]");
    for (var i = 0; i < stepItems.length; i++) {
      var itemLevel = Number(stepItems[i].getAttribute("data-level"));
      stepItems[i].classList.toggle("is-unlocked", itemLevel <= tier.level);
      stepItems[i].classList.toggle("is-current", itemLevel === tier.level);
    }

    els.resetConfirmRow.hidden = true;
    showScreen("start");
  }

  function startRound() {
    if (!deckValid) {
      return;
    }

    var startTier = tierForScore(persisted.score);
    session.roundStartScore = persisted.score;
    session.roundStartCeiling = startTier.level;
    session.roundCards = drawRound(startTier.level);
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

    els.questionTags.innerHTML = "";
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

    var previousScore = persisted.score;
    if (isCorrect) {
      persisted.score += 1;
    } else {
      persisted.score = Math.max(0, persisted.score - 1);
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
      els.feedbackDelta.textContent = "+1 score (now " + persisted.score + ")";
      els.feedbackExplanation.textContent = card.explanationShort;
    } else {
      els.feedbackVerdict.textContent = "Not quite";
      els.feedbackDelta.textContent =
        previousScore > 0
          ? "\u22121 score (now " + persisted.score + ")"
          : "Score stays at 0";
      els.feedbackExplanation.textContent = card.explanationLong;
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
    var netDelta = persisted.score - session.roundStartScore;
    var endTier = tierForScore(persisted.score);
    var startTier = tierForLevel(session.roundStartCeiling);

    if (correctCount === totalCount) {
      els.summaryHeadline.textContent = "Clean sweep — 5 out of 5";
    } else if (correctCount >= 4) {
      els.summaryHeadline.textContent = "Strong round";
    } else if (correctCount >= 3) {
      els.summaryHeadline.textContent = "Solid progress";
    } else {
      els.summaryHeadline.textContent = "Good material to revisit";
    }

    els.summaryCorrect.textContent = correctCount + " / " + totalCount;
    els.summaryDelta.textContent = (netDelta > 0 ? "+" : netDelta < 0 ? "\u2212" : "") + Math.abs(netDelta);
    els.summaryDeltaCaption.textContent =
      "From " + session.roundStartScore + " to " + persisted.score;
    els.summaryScore.textContent = String(persisted.score);
    els.summaryCeiling.textContent = "Pool: " + endTier.label;

    if (endTier.level > startTier.level) {
      els.summaryCeilingNote.hidden = false;
      els.summaryCeilingNote.classList.remove("is-down");
      els.summaryCeilingNote.textContent =
        "Difficulty ceiling rose from " +
        startTier.label +
        " to " +
        endTier.label +
        ". Harder questions (" +
        endTier.detail.toLowerCase() +
        ") now join the next round.";
    } else if (endTier.level < startTier.level) {
      els.summaryCeilingNote.hidden = false;
      els.summaryCeilingNote.classList.add("is-down");
      els.summaryCeilingNote.textContent =
        "Difficulty ceiling moved from " +
        startTier.label +
        " back to " +
        endTier.label +
        " so the next round focuses on core concepts before ramping up again.";
    } else {
      els.summaryCeilingNote.hidden = true;
    }

    els.summaryRecap.innerHTML = "";
    for (var r = 0; r < session.roundResults.length; r++) {
      var item = session.roundResults[r];
      var li = document.createElement("li");
      li.className = "recap-item " + (item.correct ? "is-correct" : "is-wrong");

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
      meta.textContent =
        "Difficulty " + item.card.difficulty + " \u00b7 " + item.card.tags.join(", ");

      body.appendChild(qText);
      body.appendChild(meta);
      li.appendChild(mark);
      li.appendChild(body);
      els.summaryRecap.appendChild(li);
    }

    showScreen("summary");
  }

  function resetProgress() {
    persisted = defaultState();
    saveState();
    renderStartScreen();
  }

  function handleKeyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    var key = event.key;

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

      if (session.screen === "start" && els.resetConfirmRow.hidden && deckValid) {
        if (focusedButton && focusedButton !== els.btnStartRound) {
          return;
        }
        if (focusedButton === els.btnStartRound) {
          return;
        }
        event.preventDefault();
        startRound();
      } else if (session.screen === "summary" && deckValid) {
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
      els.btnStartRound.disabled = true;
    } else {
      deckValid = true;
      els.validationBanner.hidden = true;
      els.btnStartRound.disabled = false;
    }

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
