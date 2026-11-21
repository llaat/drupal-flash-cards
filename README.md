# Drupal 10 / 11 Concept Flashcards

A zero-build, browser-based flashcard quiz for practicing **Drupal 10 and Drupal 11** backend architecture, judgment, and best practices.

## Opening the app

No server, build step, or dependencies are needed:

1. Double-click `index.html` to open it directly in any modern browser (or open it via a local static server if you prefer).
2. Click **Start 5-Question Round** (or press `Enter`).

Progress is saved automatically in your browser's `localStorage` under a single key (`drupal_flashcards_state_v1`). Use **Reset saved progress** on the start screen at any time to return your score and history to `0`.

## Categories

Every question belongs to one category (currently **Drupal concepts**). The start screen lists each category with an On/Off toggle:

- All categories are **on by default**, including any added later.
- You only get questions from categories that are on.
- At least one category must be on before **Start** works; with none on, Start is disabled and a message explains why.
- Your choices are saved with your progress and kept when you reset your score.

## How a round works

- **5 questions per round:** Drawn up front from your unlocked difficulty pool (limited to the categories that are on) without repeating inside the round.
- **Randomized answers:** Each card has 2 to 4 choices (including True/False and multiple choice) shuffled every time the card appears so you cannot memorize button positions.
- **Free hints:** Open a hint before answering (`H` or **Show hint**) for conceptual framing with no score penalty.
- **Reason-focused explanations:**
  - **Correct (`+1` score):** Shows a concise explanation (`explanationShort`) reinforcing the core principle.
  - **Incorrect (`-1` score, minimum `0`):** Highlights your choice alongside the right answer and shows a fuller explanation (`explanationLong`) unpacking why Drupal works this way and why the alternatives fail.
- **Keyboard shortcuts:**
  - `1`–`4` — Pick an answer choice
  - `H` — Show or hide the hint before answering
  - `Enter` — Start a round or advance to the next card / round summary

## Score and difficulty ladder

Your lifetime score moves up on right answers and down on misses (never below `0`). Easier questions stay in the pool, while weights favor questions near your ceiling, questions you missed last time, and questions not seen in the last few rounds:

| Lifetime score | Unlocked pool | Focus of the tier |
| --- | --- | --- |
| `0–9` | Level 1 | What the concept is for |
| `10–24` | Levels 1–2 | Why this approach exists |
| `25–44` | Levels 1–3 | Which nearby idea it is not |
| `45–69` | Levels 1–4 | What fails if you pick the tempting alternative |
| `70+` | Levels 1–5 | Tradeoffs and why Drupal 11 defaults differ from Drupal 10 |

Because the 5 cards in a round are drawn when the round begins, crossing a threshold mid-round takes effect on the **next** round (and is called out on the round summary screen).

## Adding a question

Append an object to `window.DRUPAL_QUESTIONS` in `js/questions.js`. On page load, `js/app.js` validates every card and displays an alert banner if anything is missing or malformed.

### Concept-first authoring rule

Write questions that test **architectural judgment and reasons**, not memorized syntax:

- Ask *why* a practice exists, *when* to pick one subsystem over another, or *what breaks* with a tempting shortcut.
- Keep answer choices in plain language; mention a class or method name only when it names the concept itself.
- Make wrong answers realistic misconceptions so `explanationLong` can teach the mental model.
- Keep all choices on a card about the same length and level of detail, so the right one can't be spotted by being the longest or most careful.
- When Drupal 10 and Drupal 11 differ (such as plugin PHP attributes, `#[Hook]` classes, or config schema validation constraints), name the version in the question and explain the other version's context in `explanationLong`.

### Category

Every card needs a `category` string, for example `"Drupal concepts"`. Using a new category name automatically adds a toggle for it on the start screen (on by default). Tags describe the topic of a card; the category decides which group of cards the player can switch on or off.

### Allowed tags

Every card needs one or more tags from this fixed list:

`Caching`, `Plugins`, `Routing`, `Services`, `Entities`, `Config`, `Forms`, `Security`, `Render API`, `Database`, `Updates`, `Queues`, `Testing`, `Drupal 11`

### Card template

```js
{
  id: "unique-kebab-case-id",
  category: "Drupal concepts",
  tags: ["Entities", "Security"],
  difficulty: 3, // integer 1..5
  question: "Why must an entity query say explicitly whether access should be checked, instead of checking or skipping access on its own?",
  hint: "Think about what a forgotten access decision used to hide.",
  answers: [
    { text: "So a skipped access check is always a deliberate, visible choice in the code.", correct: true },
    { text: "So results can be cached per user without needing extra cache contexts or tags.", correct: false },
    { text: "So the database can pick a faster index depending on whether access joins are added.", correct: false }
  ],
  explanationShort: "Making the choice explicit means an access bypass is visible in code review, not hidden behind a default someone assumed.",
  explanationLong: "Entity queries run both in user-facing listings and in background jobs. Requiring every caller to declare whether access applies turns an easy-to-forget assumption into an explicit, reviewable security choice."
}
```
