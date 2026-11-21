// Every question needs: id, category, tags, difficulty (1-5), question, hint,
// answers (2-4, exactly one correct), explanationShort, explanationLong.
// `category` groups questions for the on/off toggles on the start screen.
window.DRUPAL_QUESTIONS = [
  // =========================================================================
  // LEVEL 1 — What the concept is for (20 questions)
  // =========================================================================
  {
    id: "l1-services-purpose",
    category: "Drupal concepts",
    tags: ["Services"],
    difficulty: 1,
    question: "What is the main job of Drupal's service container?",
    hint: "Think about who builds shared helper objects and hands them their dependencies.",
    answers: [
      { text: "Build shared services and pass each one the dependencies it declares.", correct: true },
      { text: "Store site settings so they can be exported and deployed as YAML.", correct: false },
      { text: "Cache rendered output per role so repeat page views skip the work.", correct: false },
      { text: "Map incoming URLs to the controller that should handle each request.", correct: false }
    ],
    explanationShort: "The container centralizes how reusable services are constructed and wired together, so callers ask for behavior instead of building dependencies themselves.",
    explanationLong: "Without a service container, every class that sends mail, logs a message, or loads an entity would have to know how to construct those helpers and everything they depend on. The container centralizes construction and wiring: each service declares what it needs, and Drupal hands ready-to-use collaborators to your class. Exporting settings as YAML is the Configuration API's job, caching rendered output belongs to the render and page cache layers, and mapping URLs to controllers is the router's job."
  },
  {
    id: "l1-routing-purpose",
    category: "Drupal concepts",
    tags: ["Routing", "Security"],
    difficulty: 1,
    question: "What problem does a Drupal route definition solve before your controller ever runs?",
    hint: "Consider what Drupal decides at the doorway of a URL.",
    answers: [
      { text: "It maps a path to a handler and checks access before the handler runs.", correct: true },
      { text: "It tells Drupal which template and theme region the page renders into.", correct: false },
      { text: "It wraps the controller in a transaction so failed saves roll back.", correct: false },
      { text: "It adds the page to the main menu so visitors can find and open it.", correct: false }
    ],
    explanationShort: "Routing pairs a URL with a handler and enforces access rules before controller logic executes.",
    explanationLong: "A route separates 'where this URL goes and who may visit it' from 'what the page builds.' Because Drupal evaluates route access before invoking the controller, unauthorized requests are rejected early and menu links pointing to that route can automatically hide themselves when a user lacks access. A route does not create a menu link on its own, and templates and database transactions are handled elsewhere in the request."
  },
  {
    id: "l1-plugins-purpose",
    category: "Drupal concepts",
    tags: ["Plugins"],
    difficulty: 1,
    question: "When does Drupal use a plugin type instead of a single normal service?",
    hint: "Blocks, field formatters, and image effects are all examples of plugins.",
    answers: [
      { text: "When many modules should each supply a swappable variant of one thing.", correct: true },
      { text: "Whenever a class must be shared and reused across several different modules.", correct: false },
      { text: "When code must run before the service container has been built.", correct: false }
    ],
    explanationShort: "Plugins let core and contrib expose a family of swappable implementations, like blocks or field widgets, that Drupal can discover, configure, and instantiate on demand.",
    explanationLong: "A normal service gives you one shared tool for one job, such as the logger or entity type manager. A plugin type defines a contract where many modules can contribute options (dozens of blocks, queue workers, or text filters), and a site builder or subsystem can pick and configure specific instances without hardcoding a giant list. Simply sharing a class between modules only needs a service or a plain PHP class, and plugins rely on the container rather than running before it."
  },
  {
    id: "l1-entities-vs-tables",
    category: "Drupal concepts",
    tags: ["Entities"],
    difficulty: 1,
    question: "Why does Drupal model nodes, users, and taxonomy terms as entities rather than unrelated database tables?",
    hint: "Think about everything fields, translations, access, and Views expect to work uniformly.",
    answers: [
      { text: "So fields, access, translations, and caching work the same for every type.", correct: true },
      { text: "So every kind of site data can be exported to YAML and deployed through Git.", correct: false },
      { text: "Because one shared storage layout makes database queries faster for every type.", correct: false }
    ],
    explanationShort: "The Entity API gives data a uniform contract, letting fields, Views, translations, access handlers, and cache tags work the same way everywhere.",
    explanationLong: "If users, articles, and media each invented their own CRUD functions and table layouts, every ecosystem feature (field UI, translation, JSON:API, Views, and automatic cache tag invalidation) would need custom glue for each type. Making them entities means subsystems talk to a shared interface regardless of how rows are stored underneath. It is not about query speed: field data often lives in extra tables. And only configuration entities export to YAML; content entities live in the database."
  },
  {
    id: "l1-config-purpose",
    category: "Drupal concepts",
    tags: ["Config"],
    difficulty: 1,
    question: "What is the Configuration API designed to move between development, staging, and production?",
    hint: "Contrast how a new content type travels to production with how a new blog post exists.",
    answers: [
      { text: "Site structure and settings, such as content types, fields, views, and roles.", correct: true },
      { text: "Everything in the database, so staging becomes an exact copy of production.", correct: false },
      { text: "Content created by editors, such as articles, comments, and uploaded media.", correct: false }
    ],
    explanationShort: "Configuration holds deployable site structure and settings, like content types, views, and module options, so environments stay reproducible through Git.",
    explanationLong: "Drupal splits site structure (content types, field definitions, views, roles) from live content and ephemeral runtime state. Configuration is meant to be edited during development, exported to YAML, reviewed in Git, and imported cleanly on production without overwriting the articles or user accounts created there. It is deliberately not a full database copy: content and runtime state stay with each environment."
  },
  {
    id: "l1-render-arrays-purpose",
    category: "Drupal concepts",
    tags: ["Render API", "Caching"],
    difficulty: 1,
    question: "True or false: Drupal controllers return structured render arrays instead of raw HTML strings mainly so output can still be altered, themed, and cached with its metadata intact.",
    hint: "What happens to cache tags and module alterations once something is flattened to a string too early?",
    answers: [
      { text: "True: keeping structure until late lets cache metadata, alters, and theming survive.", correct: true },
      { text: "False: render arrays mainly exist because they render faster than HTML strings.", correct: false }
    ],
    explanationShort: "Delaying HTML rendering lets Drupal bubble cache metadata upward, attach asset libraries, and let themes customize output without string-parsing.",
    explanationLong: "As soon as code turns data into a flat HTML string, Drupal loses track of which entities contributed to it, which CSS/JS libraries it requires, and how a theme might re-style a wrapper. Returning a render array keeps data, presentation hints, attached libraries, and cache metadata structured until the renderer turns the whole tree into HTML at the last responsible moment. Speed is not the reason; building arrays is actually more work than concatenating strings."
  },
  {
    id: "l1-cache-tags-purpose",
    category: "Drupal concepts",
    tags: ["Caching"],
    difficulty: 1,
    question: "What question do Drupal cache tags answer for a cached page or block?",
    hint: "Contrast 'what data does this output depend on?' with 'how does this output vary per visitor?'",
    answers: [
      { text: "Which changes to underlying data should invalidate this cached item?", correct: true },
      { text: "Which visitor traits, like role or language, need separate cached copies?", correct: false },
      { text: "How long, in seconds, the item may stay cached?", correct: false },
      { text: "Which CSS and JavaScript libraries must be attached to the output?", correct: false }
    ],
    explanationShort: "Cache tags name the data dependencies of rendered output so Drupal can purge exact cached items the moment an entity or config object changes.",
    explanationLong: "Drupal separates cache metadata into three questions: cache tags answer 'what data invalidates this?' (for example, editing node 42), cache contexts answer 'who sees a different version?' (role, language, URL), and cache max-age answers 'how long is this valid by time?' Attached libraries are separate render metadata. Because tags track exact dependencies, Drupal can cache pages aggressively without serving stale content after an edit."
  },
  {
    id: "l1-forms-purpose",
    category: "Drupal concepts",
    tags: ["Forms", "Security"],
    difficulty: 1,
    question: "Why does Drupal route user input through the Form API instead of reading raw POST values inside a controller?",
    hint: "Think about everything that must happen consistently between rendering a form, validating mistakes, and trusting a submission.",
    answers: [
      { text: "It runs building, CSRF checks, validation, rebuilds, and submit as one lifecycle.", correct: true },
      { text: "Controllers can't read POST data safely, so Symfony only exposes it to form classes.", correct: false },
      { text: "Only form classes are allowed to save entities, so any input must go through them.", correct: false }
    ],
    explanationShort: "Form API gives every form consistent CSRF protection, structured validation, error re-display with submitted values preserved, and a clean submit step.",
    explanationLong: "Handling raw POST data by hand forces every developer to remember CSRF tokens, re-populate fields when one input fails validation, support multi-step or AJAX rebuilds, and let other modules safely add fields. Form API standardizes that pipeline so submit handlers only run after CSRF checks and all validation rules pass. Controllers can read the request, and any code can save entities; the value of Form API is the lifecycle, not an exclusive permission."
  },
  {
    id: "l1-queues-purpose",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 1,
    question: "What is the Queue API meant for in a Drupal backend?",
    hint: "Imagine syncing 2,000 external records when an editor saves one node.",
    answers: [
      { text: "Running slow or failure-prone work in small retryable items outside the page request.", correct: true },
      { text: "Running heavy work in parallel threads during the request so the page still loads quickly.", correct: false },
      { text: "Controlling the order in which event subscribers and hooks run for each request.", correct: false }
    ],
    explanationShort: "Queues decouple heavy or unreliable tasks from the user's page request and break them into retryable units of work.",
    explanationLong: "If saving an article calls three slow external APIs or updates thousands of related entities inline, the editor stares at a spinner, or worse, hits a PHP timeout mid-way. Pushing small items onto a queue lets the web request finish immediately while cron or a dedicated worker processes each item independently and retries items that temporarily fail. A PHP request does not spin up parallel threads; the queue moves the work out of the request entirely."
  },
  {
    id: "l1-twig-autoescape-purpose",
    category: "Drupal concepts",
    tags: ["Security", "Render API"],
    difficulty: 1,
    question: "Why does Drupal escape plain strings automatically when rendering templates and text output?",
    hint: "Consider where editor or visitor strings eventually end up.",
    answers: [
      { text: "So text from users or editors can't run as script in someone else's browser.", correct: true },
      { text: "So strings with SQL keywords are neutralized before they can reach the database.", correct: false },
      { text: "So special characters display consistently in every browser and every language.", correct: false }
    ],
    explanationShort: "Automatic output escaping prevents cross-site scripting (XSS) by treating strings as literal text unless they come from a trusted sanitization path.",
    explanationLong: "Cross-site scripting happens when user-controlled text is interpreted by a browser as HTML or JavaScript. By making escaping the default at render time, forgetting a filter no longer opens a security hole; developers have to opt in deliberately through sanitized text formats or safe markup objects when HTML is genuinely intended. SQL injection is a separate concern handled by parameterized database queries, and consistent character display is a matter of encoding (UTF-8), not escaping."
  },

  {
    id: "l1-database-api-purpose",
    category: "Drupal concepts",
    tags: ["Database", "Security"],
    difficulty: 1,
    question: "Why does Drupal provide its own Database API instead of having modules talk directly to PHP's PDO?",
    hint: "Think about portability across database engines, table prefixes, and safe parameter binding.",
    answers: [
      { text: "To abstract SQL engines, handle table prefixes, and bind parameters safely.", correct: true },
      { text: "Because PHP's PDO extension doesn't support prepared statements in Drupal.", correct: false },
      { text: "So every SQL query is automatically stored in Drupal's render cache layer.", correct: false }
    ],
    explanationShort: "Drupal's Database API builds on PDO to keep queries portable across MySQL, PostgreSQL, and SQLite while handling table prefixing and placeholders consistently.",
    explanationLong: "Drupal actually uses PDO underneath, and PDO supports prepared statements. Drupal's Database API wraps PDO to smooth out SQL dialect differences across MySQL, PostgreSQL, and SQLite, resolve table prefixes, expose alter hooks for query tags, and provide a consistent placeholder convention. Query results are not placed in the render cache automatically."
  },
  {
    id: "l1-updates-purpose",
    category: "Drupal concepts",
    tags: ["Updates"],
    difficulty: 1,
    question: "What are update hooks for when a module ships a new release?",
    hint: "Consider sites that already have the older version installed and filled with live data.",
    answers: [
      { text: "Running one-time schema or data migrations on sites that already use the module.", correct: true },
      { text: "Reinstalling the module from scratch so its new install files can take effect.", correct: false },
      { text: "Downloading newer releases of the module automatically during each cron run.", correct: false }
    ],
    explanationShort: "Update hooks track a module's schema version and run one-time upgrade steps on existing sites without losing their stored data.",
    explanationLong: "A fresh site gets a module's latest schema and config when the module is first installed. Existing sites already have live tables and content, so reinstalling would wipe their data. Numbered update hooks (and post-updates) record which version each site is on and apply only the pending upgrade steps in order. Downloading code is handled by Composer, never by update hooks."
  },
  {
    id: "l1-testing-purpose",
    category: "Drupal concepts",
    tags: ["Testing"],
    difficulty: 1,
    question: "Why does Drupal split automated tests into tiers such as Unit, Kernel, and Functional instead of booting a full site for every test?",
    hint: "Compare testing a small price-rounding method against testing a full login form.",
    answers: [
      { text: "So each test boots only the Drupal layers it needs, keeping suites fast.", correct: true },
      { text: "Because PHPUnit can't run database and HTTP tests in the same project.", correct: false },
      { text: "Because Unit tests are for core only; custom modules use Functional tests.", correct: false }
    ],
    explanationShort: "Tiered tests let you trade setup cost against realism: Unit tests run in milliseconds, Kernel tests add the container and database, and Functional tests add HTTP.",
    explanationLong: "Booting a full Drupal site, installing themes, and simulating HTTP takes seconds per test. If every tiny helper needed that overhead, a test suite would take hours and developers would stop running it. Splitting tests into Unit, Kernel, Functional, and FunctionalJavascript lets custom and core modules pick the lightest tier that proves the behavior. PHPUnit runs all of them in the same project."
  },
  {
    id: "l1-drupal11-recipes-purpose",
    category: "Drupal concepts",
    tags: ["Drupal 11", "Config"],
    difficulty: 1,
    question: "What problem do Drupal Recipes (introduced in Drupal 10.3 and core in Drupal 11) solve compared to traditional install profiles?",
    hint: "Think about adding a preconfigured blog or media setup to an existing site months after launch.",
    answers: [
      { text: "They let you apply reusable bundles of modules and config to any site at any time.", correct: true },
      { text: "They replace Composer so modules can be downloaded without a composer.json file.", correct: false },
      { text: "They compile Twig templates and CSS into one static bundle for faster page loads.", correct: false }
    ],
    explanationShort: "Recipes are composable building blocks of modules, config, and content actions that can be applied on top of an existing site, not just at install time.",
    explanationLong: "A site can only pick one install profile, and only on day one before the site exists. Recipes break that lock-in: you can apply a 'Blog' recipe today and an 'Events' recipe six months later, mixing and matching features without starting over. Composer still manages PHP packages and downloads, and Recipes have nothing to do with front-end asset bundling."
  },
  {
    id: "l1-cache-bins-purpose",
    category: "Drupal concepts",
    tags: ["Caching"],
    difficulty: 1,
    question: "Why does Drupal divide cached data into separate cache bins (such as render, discovery, and config) instead of putting everything in one table?",
    hint: "Think about what happens when you clear one kind of cache, or when you put hot bins in Redis.",
    answers: [
      { text: "Different data has different lifetimes, backends, and clearing needs.", correct: true },
      { text: "MySQL tables can't hold both rendered HTML strings and serialized PHP arrays.", correct: false },
      { text: "Drupal stores each user role in its own cache bin to keep roles isolated.", correct: false }
    ],
    explanationShort: "Separate bins let Drupal clear or route specific kinds of cache (like plugin discovery or rendered HTML) without wiping everything else.",
    explanationLong: "Rendered page fragments churn constantly, while plugin discovery and configuration change mostly on deployments. Splitting them into bins lets Drupal clear one bin without forcing everything else to rebuild, and lets operations route high-read bins to Redis or Memcache while keeping others in the database. Role separation is handled by cache contexts, and any bin can store serialized PHP values."
  },
  {
    id: "l1-plugin-manager-purpose",
    category: "Drupal concepts",
    tags: ["Plugins", "Services"],
    difficulty: 1,
    question: "What is the role of a plugin manager service in Drupal?",
    hint: "Something has to find every Block or FieldFormatter class across all enabled modules and create one when needed.",
    answers: [
      { text: "It discovers available plugins, caches their definitions, and creates instances.", correct: true },
      { text: "It installs contributed modules automatically when a plugin ID isn't found.", correct: false },
      { text: "It grants user permissions for every plugin placed in the site's interface.", correct: false }
    ],
    explanationShort: "A plugin manager is the central registry and factory for one plugin type: it finds definitions across modules, caches them, and builds configured instances.",
    explanationLong: "Because plugins can come from core, contrib, or any custom module, calling code shouldn't hardcode plugin class names. The plugin manager scans enabled modules (and caches the discovered definitions), lets alter hooks adjust them, and creates a configured plugin object when given a plugin ID and settings. It never installs modules and does not manage user permissions."
  },
  {
    id: "l1-route-param-upcasting-purpose",
    category: "Drupal concepts",
    tags: ["Routing", "Entities"],
    difficulty: 1,
    question: "What does route parameter upcasting do when a URL contains an entity ID such as /node/42?",
    hint: "Look at what the controller method receives as its argument instead of the raw string '42'.",
    answers: [
      { text: "It loads the matching entity before the controller runs and returns 404 if missing.", correct: true },
      { text: "It converts numeric IDs into SEO-friendly URL aliases automatically on every save.", correct: false },
      { text: "It elevates the visitor's permissions so the controller can edit that entity.", correct: false }
    ],
    explanationShort: "Upcasting turns raw path placeholders into loaded entity objects before access checks and controllers run, handling missing IDs with a 404 automatically.",
    explanationLong: "Without upcasting, every controller and route access check would repeat the same boilerplate: load the node by ID, check whether it exists, and throw a 404 if not. Parameter converters handle that once in the routing layer, passing a typed entity object straight into both route access checkers and the controller. URL aliases are handled by path processing, and upcasting never changes permissions."
  },
  {
    id: "l1-entity-bundles-purpose",
    category: "Drupal concepts",
    tags: ["Entities", "Config"],
    difficulty: 1,
    question: "What is an entity bundle in Drupal (such as Article or Basic Page for the Node entity type)?",
    hint: "Compare what Article and Basic Page share versus what differs between them.",
    answers: [
      { text: "A subtype of an entity type that shares base behavior but has its own fields.", correct: true },
      { text: "A group of unrelated modules packaged together so they install at the same time.", correct: false },
      { text: "A cached snapshot of an entity and all of its referenced media saved as JSON.", correct: false }
    ],
    explanationShort: "Bundles are configurable subtypes of an entity type—sharing core storage, access, and publishing logic while each carrying its own fields and display settings.",
    explanationLong: "Articles, Events, and Basic Pages all need titles, authors, revisions, URLs, and publishing status, so they share the Node entity type. Each one is a bundle that attaches its own specific fields (like an Event Date) and form/view displays, exported as configuration. Bundling modules together is what Recipes or distributions do, not entity bundles."
  },
  {
    id: "l1-form-state-purpose",
    category: "Drupal concepts",
    tags: ["Forms"],
    difficulty: 1,
    question: "What is the main job of the FormState object during a Drupal form's lifecycle?",
    hint: "A form method receives both the renderable $form array and $form_state.",
    answers: [
      { text: "It carries submitted values, validation errors, rebuild flags, and redirects.", correct: true },
      { text: "It holds the HTML markup and CSS classes used to render each form widget.", correct: false },
      { text: "It saves every user's submitted form values permanently into the State API.", correct: false }
    ],
    explanationShort: "While the $form array describes structure and presentation, FormState tracks the runtime state of the interaction: values, errors, rebuilds, and where to redirect.",
    explanationLong: "Separating the form's structure ($form) from the current interaction ($form_state) keeps build, validate, and submit methods clean and predictable. FormState holds user values, records field errors, tracks multi-step storage, tells Form API whether to rebuild, and sets the post-submit redirect. Despite the similar name, it is completely separate from the global State API."
  },
  {
    id: "l1-cron-purpose",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 1,
    question: "What is Drupal cron designed to handle for a live site?",
    hint: "Think about routine housekeeping that should happen on a schedule, not while a visitor waits for a page.",
    answers: [
      { text: "Scheduled background maintenance like draining queues, indexing, and cleanup.", correct: true },
      { text: "Compiling PHP classes and Twig templates before every anonymous page request.", correct: false },
      { text: "Deploying configuration YAML from Git into production every hour on a timer.", correct: false }
    ],
    explanationShort: "Cron runs periodic maintenance—processing cron-enabled queues, updating search indexes, expiring stale items, and checking updates—outside normal page requests.",
    explanationLong: "Many backend jobs need to happen regularly without slowing down visitors: draining queued emails, purging expired tempstore entries, refreshing feeds, and indexing new content. Running cron on a system schedule (or CLI) handles those tasks steadily in the background. Template compilation happens on demand, and deploying configuration is an explicit release step, never an automatic cron job."
  },

  // =========================================================================
  // LEVEL 2 — Why this approach exists (20 questions)
  // =========================================================================
  {
    id: "l2-di-over-static-drupal",
    category: "Drupal concepts",
    tags: ["Services", "Testing"],
    difficulty: 2,
    question: "Why do Drupal best practices prefer injecting services into a class constructor over calling the global \\Drupal helper inside methods?",
    hint: "Look at the class from the point of view of a teammate or a unit test reading its constructor.",
    answers: [
      { text: "The constructor lists every dependency, and tests can pass in simple fakes instead.", correct: true },
      { text: "The \\Drupal helper is removed in Drupal 11, so code that calls it stops working.", correct: false },
      { text: "Injected services are cached per class, so they are much faster than \\Drupal lookups.", correct: false },
      { text: "Services fetched through \\Drupal can't read configuration or the current user.", correct: false }
    ],
    explanationShort: "Injecting dependencies documents everything a class relies on and lets unit tests swap collaborators without needing a live global container.",
    explanationLong: "Reaching into \\Drupal::service() deep inside a method hides dependencies: a caller or test has no idea what global state must exist until a line crashes at runtime. Constructor injection puts every collaborator in the class signature, keeps classes decoupled from the global container, and makes isolated unit testing straightforward. Performance is about the same, since both return the same shared instance. \\Drupal still exists in Drupal 10 and 11 for procedural glue code where injection is unavailable, not as the default inside classes."
  },
  {
    id: "l2-route-access-separation",
    category: "Drupal concepts",
    tags: ["Routing", "Security"],
    difficulty: 2,
    question: "Why should permission or role checks live on the route definition rather than as an 'if' statement at the top of a controller method?",
    hint: "Other parts of Drupal inspect routes without calling your controller.",
    answers: [
      { text: "Menus and links ask the route whether a user may enter, without running the controller.", correct: true },
      { text: "Controllers don't have access to the current user, so the route is the only place to check it.", correct: false },
      { text: "A 403 thrown inside a controller is turned into a 500 error by Drupal's kernel.", correct: false }
    ],
    explanationShort: "Declaring access on the route lets Drupal's menu, link, and caching systems know who may visit a URL without running controller code.",
    explanationLong: "If a route says anyone can enter and your controller throws an access-denied exception inside its body, every menu or toolbar rendering a link to that route thinks the link is allowed, so unauthorized users see links that fail with a 403 when clicked. Controllers can inject the current user, and an exception from a controller does produce a proper 403; the problem is that nothing outside the controller knows the rule. Putting access on the route gives Drupal one cacheable source of truth."
  },
  {
    id: "l2-cache-contexts-why",
    category: "Drupal concepts",
    tags: ["Caching", "Render API"],
    difficulty: 2,
    question: "Why must a render array declare a cache context whenever its output changes based on the current user's role, language, or URL query string?",
    hint: "Imagine the first visitor to warm an empty cache is an administrator.",
    answers: [
      { text: "So Drupal keeps one cached copy per variation instead of serving the first copy to all.", correct: true },
      { text: "So Drupal clears the whole render cache whenever someone with a different role logs in.", correct: false },
      { text: "So browsers know to skip CSS and JavaScript files they have already downloaded.", correct: false }
    ],
    explanationShort: "Cache contexts key the cache by the exact factors that change the output, preventing cache poisoning or information leaks across different visitors.",
    explanationLong: "When a block shows extra controls for editors and omits the user permissions or roles cache context, whoever warms the cache wins: if an editor visits first, anonymous visitors may see editor markup; if an anonymous user visits first, editors miss their tools. Declaring the right cache context tells Drupal how to partition variations safely without giving up caching or clearing anything."
  },
  {
    id: "l2-config-schema-why",
    category: "Drupal concepts",
    tags: ["Config"],
    difficulty: 2,
    question: "Why does a custom module need a configuration schema file alongside its YAML configuration?",
    hint: "YAML itself cannot distinguish a translatable human label from a machine name or a boolean.",
    answers: [
      { text: "It defines each value's type and meaning so config can be validated and translated.", correct: true },
      { text: "It creates the database table that stores the module's configuration values on each site.", correct: false },
      { text: "It defines which roles may open the module's settings form and change values.", correct: false },
      { text: "It lists default values so Drupal can fill in settings missing from the YAML.", correct: false }
    ],
    explanationShort: "Config schema teaches Drupal which values are integers, booleans, machine names, or translatable labels so config can be cast, validated, and translated reliably.",
    explanationLong: "Form submissions often start as strings, and YAML files alone do not explain whether 'label' should appear in the translation UI while 'plugin_id' must stay untouched. Config schema provides that metadata: it keeps exported YAML types deterministic (avoiding noisy diffs like '1' versus true), powers config translation, and in Drupal 10 and 11 increasingly enforces validation constraints. Defaults live in the module's config/install YAML, all config shares one storage table, and permissions come from the route."
  },
  {
    id: "l2-form-rebuild-why",
    category: "Drupal concepts",
    tags: ["Forms"],
    difficulty: 2,
    question: "Why does Drupal rebuild a form from form state during multi-step or AJAX interactions instead of only rendering the initial build once?",
    hint: "Consider an 'Add another item' button or a country dropdown that changes which state/province fields exist.",
    answers: [
      { text: "So the server decides which fields exist right now, and validates only those fields.", correct: true },
      { text: "Because browsers drop all typed values after an AJAX response unless Drupal stores them.", correct: false },
      { text: "So every change the user makes is saved right away, even if they never submit.", correct: false }
    ],
    explanationShort: "Rebuilding lets the form's structure evolve with user choices while validation still checks against a trusted server definition.",
    explanationLong: "Drupal never blindly trusts whatever field names arrive in a browser POST, since attackers could forge extra fields. When an interaction changes the form (such as choosing an option that reveals extra settings), Drupal marks the form for rebuild, keeps the current state on the server, and regenerates the authoritative form array so validation knows exactly which elements are allowed and required. Nothing is saved until a real submit succeeds."
  },
  {
    id: "l2-post-update-vs-update-n",
    category: "Drupal concepts",
    tags: ["Updates", "Entities"],
    difficulty: 2,
    question: "Why does Drupal separate numbered update hooks from named post-update functions?",
    hint: "During a deployment, when is every module's schema guaranteed to match its new PHP classes?",
    answers: [
      { text: "Update hooks fix storage first; post-updates run when entities are safe to load.", correct: true },
      { text: "Update hooks run on local environments only, and post-updates run only on production.", correct: false },
      { text: "Post-updates only clear caches, so any data change has to go in an update hook.", correct: false },
      { text: "Update hooks run in the browser via update.php, and post-updates only run via Drush.", correct: false }
    ],
    explanationShort: "Update hooks fix storage while the system may be half-upgraded; post-updates run once all schemas are current and the Entity API can safely operate.",
    explanationLong: "While numbered updates are running, another module's columns or entity definitions may still be mid-migration, so loading or saving full entities inside an update hook can crash against mismatched schemas. Drupal runs all update hooks first, rebuilds definitions, and only then runs post-update functions, making post-updates the safe place for entity data changes. Both kinds run in every environment, through both update.php and Drush."
  },
  {
    id: "l2-plugin-derivatives-why",
    category: "Drupal concepts",
    tags: ["Plugins"],
    difficulty: 2,
    question: "What is a plugin derivative for?",
    hint: "Menus are created in the UI, yet each new menu automatically shows up as its own placeable block.",
    answers: [
      { text: "Letting one plugin class offer many definitions, such as one block per menu.", correct: true },
      { text: "Subclassing a parent plugin so it inherits methods and annotation values from it.", correct: false },
      { text: "Replacing another module's plugin class so your version is used instead of it.", correct: false }
    ],
    explanationShort: "Derivatives let a single plugin class generate a separate discoverable plugin entry for each configured item, such as one block per menu or per View display.",
    explanationLong: "When an administrator creates a new menu in the UI, no PHP file is written, yet site builders expect a block for that menu in Block Layout. A deriver inspects existing menus (or block types, or Views displays) and hands the plugin manager one derived definition per item, all backed by the same plugin class. Inheritance is ordinary PHP subclassing, and replacing a plugin class is done with an alter hook; neither is a derivative."
  },
  {
    id: "l2-kernel-vs-unit-tests",
    category: "Drupal concepts",
    tags: ["Testing"],
    difficulty: 2,
    question: "When is a Kernel test a better tool than a pure Unit test in Drupal?",
    hint: "Think about code whose real behavior depends on entity storage, field definitions, config schemas, or the service container working together.",
    answers: [
      { text: "When the code relies on real entities, schema, or services that mocks would only fake.", correct: true },
      { text: "When you need a real browser to click through pages and run JavaScript on them.", correct: false },
      { text: "Always, because Unit tests can't load classes that live inside a Drupal module at all.", correct: false }
    ],
    explanationShort: "Kernel tests boot a minimal container and test database without HTTP or themes, proving real integration with entities, schemas, and services quickly.",
    explanationLong: "Unit tests excel for self-contained logic with clean interfaces. But if your service builds an entity query, reacts to field storage, or relies on service wiring, mocking five layers of Drupal creates brittle tests that pass even when real field names or schemas are wrong. Kernel tests install only the modules and tables you ask for, staying much faster than browser tests. A real browser with JavaScript is the job of FunctionalJavascript tests, and Unit tests can load module classes just fine."
  },
  {
    id: "l2-entity-query-vs-raw-sql",
    category: "Drupal concepts",
    tags: ["Entities", "Database"],
    difficulty: 2,
    question: "Why should application logic find entities with an entity query instead of writing a direct SQL query against node or field tables?",
    hint: "Think about how multi-value fields, revisions, translations, and access modules store and filter entity data.",
    answers: [
      { text: "It knows how fields, revisions, translations, and access rules are actually stored.", correct: true },
      { text: "Drupal's Database API doesn't support placeholders, so raw SQL is open to injection.", correct: false },
      { text: "Entity queries are always faster, because they read straight from the entity cache.", correct: false }
    ],
    explanationShort: "Entity queries let Drupal translate field, revision, language, and access conditions onto the real storage tables, keeping code portable and secure.",
    explanationLong: "Changing a field from single-value to multi-value or enabling translation can change which tables and joins hold that data, and node access modules add access joins dynamically. Hardcoding table names in raw SQL bypasses access handlers and breaks when storage changes. The Database API does use placeholders, and entity queries still run against the database; only loading entities uses the entity cache. Direct queries remain appropriate for custom non-entity tables or reporting where you manage access yourself."
  },
  {
    id: "l2-drupal11-attributes-why",
    category: "Drupal concepts",
    tags: ["Plugins", "Drupal 11"],
    difficulty: 2,
    question: "Why did Drupal move plugin discovery from docblock annotations toward native PHP attributes in Drupal 10.2+ and Drupal 11?",
    hint: "Compare metadata hidden inside a PHP comment string with metadata that is real PHP code.",
    answers: [
      { text: "Attributes are real PHP, so IDEs, static analysis, and PHP itself can read them.", correct: true },
      { text: "PHP 8.3 dropped support for reading docblock comments through reflection entirely.", correct: false },
      { text: "Attributes let plugins register themselves without needing a plugin manager anymore.", correct: false }
    ],
    explanationShort: "PHP attributes replace custom docblock comment parsing with native, typed PHP metadata that IDEs, static analyzers, and PHP's reflection understand directly.",
    explanationLong: "When Drupal 8 adopted annotations, PHP had no built-in way to attach structured metadata to classes, so Drupal parsed comment strings with a custom parser. Modern PHP introduced native attributes: typos in class names or arguments are caught by IDEs and PHPStan immediately, and PHP's reflection reads them without a docblock parser. Docblocks are still readable in PHP, and plugin managers still do the discovery; only the metadata format changed."
  },

  {
    id: "l2-queue-claim-lease-why",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 2,
    question: "Why does a Drupal queue worker claim an item with a temporary lease instead of deleting it the instant processing starts?",
    hint: "Think about what happens if PHP runs out of memory or an external API drops the connection halfway through.",
    answers: [
      { text: "So if the worker crashes mid-item, the lease expires and another run can retry it.", correct: true },
      { text: "So two workers can process the same item at once and compare their two results.", correct: false },
      { text: "So the queue keeps a permanent audit log of every item that was ever processed.", correct: false }
    ],
    explanationShort: "Leasing hides an item from other workers while it runs, deletes it only on success, and releases it for retry if the worker dies mid-way.",
    explanationLong: "If a worker deleted an item before doing the work, a PHP fatal error, server restart, or timeout would silently lose that job forever. Claiming with a lease prevents another worker from picking up the same item concurrently, and only after the worker finishes cleanly does Drupal delete the item. If the worker crashes, the lease expires and the item becomes claimable again. Completed items are deleted, not kept as an audit log."
  },
  {
    id: "l2-asset-libraries-why",
    category: "Drupal concepts",
    tags: ["Render API", "Caching"],
    difficulty: 2,
    question: "Why does Drupal attach CSS and JavaScript as named libraries on render arrays instead of printing <script> and <link> tags directly inside Twig templates?",
    hint: "Think about a block placed three times on one page, or a library that depends on another script.",
    answers: [
      { text: "Drupal deduplicates them, orders dependencies, aggregates files, and caches them.", correct: true },
      { text: "Twig blocks all <script> and <link> tags and refuses to render templates with them.", correct: false },
      { text: "Browsers ignore inline asset tags whenever Drupal's Dynamic Page Cache is enabled.", correct: false }
    ],
    explanationShort: "Attaching libraries lets Drupal load each asset once in dependency order, aggregate files cleanly, and keep asset requirements intact across render caching.",
    explanationLong: "If a component prints its own <script> tag and appears five times on a page, the script loads five times and may run before its dependencies. Attaching a named library on the render array lets Drupal bubble that requirement up through cached fragments, deduplicate it across the whole page, resolve dependencies, and let themes override or extend the library cleanly."
  },
  {
    id: "l2-cache-max-age-why",
    category: "Drupal concepts",
    tags: ["Caching"],
    difficulty: 2,
    question: "If cache tags already invalidate output whenever Drupal data changes, why does cache max-age still exist?",
    hint: "Think of a countdown widget, a 'today's events' block, or data fetched from an external API.",
    answers: [
      { text: "Some output expires by the clock or external changes where no Drupal save occurs.", correct: true },
      { text: "Cache tags only work for nodes, so other entity types rely on max-age instead.", correct: false },
      { text: "Max-age is required on every render array or Drupal refuses to cache the output.", correct: false }
    ],
    explanationShort: "Max-age covers time-based freshness and external data sources where no local entity save ever fires a cache tag.",
    explanationLong: "Cache tags are ideal for Drupal-managed data because saving any entity or config object fires its tag automatically (and all entity types have tags, not just nodes). But if a block shows 'Events starting today' or weather from a third-party API, nothing in Drupal gets saved at midnight or when the weather changes. Max-age expresses how long the output stays valid by time, defaulting to permanent when no time limit applies."
  },
  {
    id: "l2-tagged-services-why",
    category: "Drupal concepts",
    tags: ["Services"],
    difficulty: 2,
    question: "Why does Drupal use tagged services (service collectors) for systems like route access checks, cache contexts, and path processors?",
    hint: "Think about how a new custom module adds its own path processor without editing core.",
    answers: [
      { text: "So any module can register a participant without editing a central core list.", correct: true },
      { text: "So those services are kept out of the container until an admin enables them.", correct: false },
      { text: "Because services without a tag can't inject dependencies through their constructor.", correct: false }
    ],
    explanationShort: "Service tags let modules opt into a shared pipeline at container build time, so a collector service gathers all participants automatically.",
    explanationLong: "Core's path processor manager or access manager cannot know ahead of time which custom and contrib modules you will install. Instead of forcing you to override a core class to add your own rule, you tag your service. When the container compiles, Drupal discovers every service with that tag, sorts them by priority, and passes them into the collector. Untagged services use constructor injection just the same."
  },
  {
    id: "l2-entity-revisions-why",
    category: "Drupal concepts",
    tags: ["Entities"],
    difficulty: 2,
    question: "Why does Drupal build revisions directly into the Entity API instead of leaving version history to a custom log table per content type?",
    hint: "Think about editing a draft of an already-published page while visitors keep seeing the live version.",
    answers: [
      { text: "So drafts, moderation, previews, and rollbacks work the same across entity types.", correct: true },
      { text: "Because database updates fail unless every content table has a revision table.", correct: false },
      { text: "So old revisions can be exported to Git alongside the site's configuration YAML.", correct: false }
    ],
    explanationShort: "Built-in revisions let Drupal keep a published default revision live while editors work on newer drafts, powering moderation, workspaces, and rollback uniformly.",
    explanationLong: "A simple audit log only records what changed in the past. Entity revisions let Drupal store a full forward draft alongside the live default revision, so Content Moderation, Workspaces, Layout Builder drafts, and revision rollback all work on nodes, media, and custom revisionable entities alike. Revisions are optional per entity type and are content data, never exported as YAML."
  },
  {
    id: "l2-config-dependencies-why",
    category: "Drupal concepts",
    tags: ["Config"],
    difficulty: 2,
    question: "Why do exported configuration entities (like a View or field display) list their module and config dependencies inside their YAML?",
    hint: "Imagine uninstalling a module or deleting a field that a View currently relies on.",
    answers: [
      { text: "So Drupal imports config in order and handles uninstalls or deletions cleanly.", correct: true },
      { text: "So Composer knows which PHP packages to download when you run composer install.", correct: false },
      { text: "So Drupal can tell which cache tags to clear whenever the View is rendered.", correct: false }
    ],
    explanationShort: "Config dependencies let Drupal order imports correctly and either clean up or warn about dependent config when a module, field, or content type is removed.",
    explanationLong: "A View cannot be imported before the content type and fields it queries exist, and uninstalling a module that provides a View's filter plugin would leave broken config behind if Drupal ignored dependencies. Recording dependencies in YAML lets config import sort items topologically and lets module uninstall either remove dependent config or strip the removed dependency cleanly. Composer reads composer.json, not config YAML."
  },
  {
    id: "l2-form-alter-why",
    category: "Drupal concepts",
    tags: ["Forms"],
    difficulty: 2,
    question: "Why does Drupal let modules alter existing forms instead of asking them to subclass or replace the original form class?",
    hint: "Imagine three different modules all wanting to add a setting to the same node edit form.",
    answers: [
      { text: "So several modules can extend the same form without overwriting each other.", correct: true },
      { text: "Because PHP doesn't allow a custom module to extend a form class from core.", correct: false },
      { text: "Because subclassed form classes lose Form API's automatic CSRF protection.", correct: false }
    ],
    explanationShort: "Form alter hooks let many independent modules add fields, validators, and submit handlers to one shared form cleanly without fighting over who owns the class.",
    explanationLong: "On a real Drupal site, Pathauto, Metatag, Scheduler, and your custom module all want to add controls to the Node form. If each one replaced the form class via subclassing, only the last module would win and every upgrade to core's form would risk breaking subclasses. Altering the structured form array lets every module layer its additions safely while keeping the full Form API lifecycle intact."
  },
  {
    id: "l2-update-sandbox-batching-why",
    category: "Drupal concepts",
    tags: ["Updates", "Database"],
    difficulty: 2,
    question: "Why do update hooks and post-updates receive a $sandbox parameter when updating large amounts of data?",
    hint: "Think about migrating 100,000 nodes during a deployment.",
    answers: [
      { text: "So the update can process small chunks across calls without timing out PHP.", correct: true },
      { text: "So the update runs in a dry-run mode first and rolls back every change on test.", correct: false },
      { text: "So the database isolates the update in a copy of the tables until you approve it.", correct: false }
    ],
    explanationShort: "The $sandbox array carries progress between repeated batch invocations, letting large migrations run in safe slices instead of hitting memory or time limits.",
    explanationLong: "Despite the name, $sandbox is not a dry-run or isolated database copy. It is a persistent progress array passed back into your update function on each batch step until you set its '#finished' fraction to 1. Processing 50 or 100 entities per pass keeps memory bounded and prevents HTTP or CLI timeouts during deployment."
  },
  {
    id: "l2-access-result-neutral-why",
    category: "Drupal concepts",
    tags: ["Security", "Routing"],
    difficulty: 2,
    question: "Why does Drupal's access system have three outcomes—allowed, forbidden, and neutral—instead of a simple true or false?",
    hint: "Think about five modules implementing an entity access hook when only one of them cares about this entity.",
    answers: [
      { text: "So modules with no opinion return neutral while any explicit forbid still wins.", correct: true },
      { text: "So neutral access lets logged-in users view a page in read-only mode instead.", correct: false },
      { text: "Because PHP can't combine boolean results from more than one access hook.", correct: false }
    ],
    explanationShort: "Neutral means 'I don't decide here,' allowing other modules to grant access while letting an explicit Forbidden override everything—and defaulting to deny if nobody allows.",
    explanationLong: "With only true and false, a module that has no opinion on a node would have to return false—blocking access—or return true—accidentally granting access to everything. Having Allowed, Forbidden, and Neutral lets unrelated modules stay out of the way (Neutral), grants access if at least one module says Allowed, denies if everyone says Neutral, and lets any single Forbidden hard-deny access."
  },
  {
    id: "l2-drupal11-sdc-why",
    category: "Drupal concepts",
    tags: ["Render API", "Drupal 11"],
    difficulty: 2,
    question: "Why do Single Directory Components (stabilized in Drupal 10.3 and core in Drupal 11) keep a component's Twig template, CSS, JS, and metadata schema in one folder?",
    hint: "Compare hunting across templates/, css/, js/, and *.libraries.yml for one button component.",
    answers: [
      { text: "So UI components are self-contained, discoverable, and validate their props.", correct: true },
      { text: "So Drupal can render those components directly in the browser without Twig.", correct: false },
      { text: "Because Drupal 11 removed theme libraries and requires all CSS to live in SDC.", correct: false }
    ],
    explanationShort: "Single Directory Components co-locate markup, assets, and a prop/slot contract so components are portable, auto-discovered, and automatically attach their own assets.",
    explanationLong: "Traditional Drupal theming splits one UI component across several directories and a manual libraries YAML entry, with no formal contract for the variables a template expects. SDC puts template, styles, scripts, and a component YAML schema in one directory: Drupal discovers the component, auto-attaches its CSS/JS when rendered, and validates prop types. Standard Twig templates and theme libraries still work in Drupal 11."
  },

  // =========================================================================
  // LEVEL 3 — Which nearby idea it is not (20 questions)
  // =========================================================================
  {
    id: "entity-query-access-check",
    category: "Drupal concepts",
    tags: ["Entities", "Security"],
    difficulty: 3,
    question: "Why must an entity query say explicitly whether access should be checked, instead of checking or skipping access on its own?",
    hint: "Think about what a forgotten access decision used to hide.",
    answers: [
      { text: "So a skipped access check is always a deliberate, visible choice in the code.", correct: true },
      { text: "So results can be cached per user without needing extra cache contexts or tags.", correct: false },
      { text: "So the database can pick a faster index depending on whether access joins are added.", correct: false }
    ],
    explanationShort: "Making the choice explicit means an access bypass is visible in code review, not hidden behind a default someone assumed.",
    explanationLong: "Entity queries run both in user-facing listings (where access must apply) and in background jobs (where system-wide results must ignore the current user). When the behavior was an implicit default, developers guessed wrong in both directions: listings leaked content, and maintenance code silently missed rows. Requiring every caller to declare whether access applies turns that easy-to-forget assumption into an explicit, reviewable security choice. Caching and index selection are separate concerns."
  },
  {
    id: "l3-config-vs-state",
    category: "Drupal concepts",
    tags: ["Config"],
    difficulty: 3,
    question: "A module records the timestamp of the last successful external API sync. Why does that value belong in the State API rather than Configuration?",
    hint: "Ask what would happen the next time you deploy configuration from staging to production.",
    answers: [
      { text: "It changes per environment at runtime, so a config import would overwrite it.", correct: true },
      { text: "Configuration values can only hold strings and booleans, not integers or timestamps.", correct: false },
      { text: "State is synced to Git after every cron run, so all environments share it.", correct: false }
    ],
    explanationShort: "State holds environment-local runtime facts that change during normal operation and must never be overwritten by a deployment.",
    explanationLong: "Configuration represents intentional site setup authored upstream and imported on deploy. If runtime values like 'last sync time' are saved into config on production, every deployment either wipes out production's value or reports that active config differs from Git. State stores key-value data for that single environment and is never exported. Config can hold integers just fine; the issue is lifecycle, not data type."
  },
  {
    id: "l3-tags-vs-contexts-vs-max-age",
    category: "Drupal concepts",
    tags: ["Caching", "Render API"],
    difficulty: 3,
    question: "A sidebar block shows '3 articles in your preferred category,' where each user picks a favorite category on their profile. Which combination of cache metadata models why this output changes?",
    hint: "Separate 'who gets a different version right now' from 'what content edit makes that version stale.'",
    answers: [
      { text: "A context for the user's chosen category, plus tags for the articles it lists.", correct: true },
      { text: "A max-age of 60 seconds, so every user sees fresh results within a minute.", correct: false },
      { text: "A cache tag for every user account, so editing any profile clears the block.", correct: false },
      { text: "A context for the user's role, since logged-in roles decide what each user sees.", correct: false }
    ],
    explanationShort: "Contexts split the cache by who is looking (their chosen category), while tags invalidate that cached copy when relevant articles change.",
    explanationLong: "When output both varies across visitors and reflects editable data, contexts and tags work as partners: the context ensures Alice (who picked 'Performance') and Bob (who picked 'Security') do not share one cached block, and the article list tags ensure that publishing a new Security article refreshes Bob's copy immediately instead of guessing with a timer. A role context would wrongly give Alice and Bob the same copy, since they share a role but not a category."
  },
  {
    id: "l3-content-vs-config-entity",
    category: "Drupal concepts",
    tags: ["Entities", "Config"],
    difficulty: 3,
    question: "You are modeling 'Office Locations' for a company with 400 branches that editors update daily, translate into four languages, and keep revisions for. Should this be a content entity or a config entity?",
    hint: "Look at who edits the records in production, how many exist, and whether revisions and fieldable storage matter.",
    answers: [
      { text: "A content entity: it's created in production at scale and needs revisions.", correct: true },
      { text: "A config entity: offices are structured business data, not editorial content.", correct: false }
    ],
    explanationShort: "Content entities fit data authored in production at scale with revisions and fields; config entities fit site-building definitions deployed through YAML.",
    explanationLong: "A common trap is thinking 'content entity means long-form editorial articles.' The real boundary is lifecycle and scale: config entities are meant for tens of structural definitions (roles, image styles, workflows) deployed from Git. Hundreds of production-edited records with revisions, translations, and field queries belong in content entities, no matter how 'structured' the data looks."
  },
  {
    id: "l3-hooks-vs-events",
    category: "Drupal concepts",
    tags: ["Services", "Drupal 11"],
    difficulty: 3,
    question: "How do event subscribers and hooks differ in how a module takes part in Drupal's behavior?",
    hint: "Both let modules react to something happening, but they come from two halves of Drupal's history and handle ordering and stopping differently.",
    answers: [
      { text: "Events go to prioritized subscriber services; hooks call each module's implementation.", correct: true },
      { text: "Hooks run later in a background queue, while event subscribers block the request.", correct: false },
      { text: "Event subscribers only handle routing events and can't be dispatched by modules.", correct: false },
      { text: "Drupal 11 replaced hooks with events, so new code should only use subscribers.", correct: false }
    ],
    explanationShort: "Events pass an event object through prioritized subscribers in the service container; hooks invoke matching implementations across enabled modules.",
    explanationLong: "Request handling, config import, and many contrib modules use Symfony's event dispatcher, where subscribers are services with explicit priorities and can stop propagation. Entity CRUD, form alters, and theme preprocessing remain hooks in core. In Drupal 11.1+, hooks can be written as class methods with a #[Hook] attribute, but they are still hooks, not Symfony events. Both run synchronously in the same request, and any module can dispatch its own events."
  },
  {
    id: "l3-queue-vs-batch-api",
    category: "Drupal concepts",
    tags: ["Queues", "Forms"],
    difficulty: 3,
    question: "Both Batch API and Queue API split large jobs into small chunks so PHP does not time out. How do you choose between them?",
    hint: "Ask whether a human is actively waiting at the screen for this specific operation to finish right now.",
    answers: [
      { text: "Batch when a user starts it and watches progress; queue when it can run unattended.", correct: true },
      { text: "Batch for database writes, and queue for read-only work like calling external APIs.", correct: false },
      { text: "Batch runs in parallel worker processes, while a queue processes one item per request.", correct: false },
      { text: "Batch only exists in Drupal 10; Drupal 11 replaced it with the Queue API.", correct: false }
    ],
    explanationShort: "Batch API ties chunked requests to an active browser progress bar; Queue API decouples work completely from any browser session.",
    explanationLong: "Batch API keeps a user on a progress screen that fires repeated short requests until the job finishes, which suits a one-off admin import where the user wants immediate confirmation. If the user closes the tab, the batch stops. Queue API stores items on the server so cron or a CLI worker processes them with no browser open. Both can write data, neither runs in parallel by default, and both exist in Drupal 11."
  },
  {
    id: "l3-csrf-route-vs-form",
    category: "Drupal concepts",
    tags: ["Routing", "Security", "Forms"],
    difficulty: 3,
    question: "Form API protects submitted forms against Cross-Site Request Forgery (CSRF) automatically. When do you need explicit CSRF protection on a custom route?",
    hint: "Think about an action link like 'Archive item' or 'Toggle bookmark' that hits a controller directly.",
    answers: [
      { text: "When a non-form route changes data for a logged-in user, such as an action link.", correct: true },
      { text: "On public read-only pages, so scrapers can't copy content without a valid token.", correct: false },
      { text: "Never, because a permission requirement on the route already blocks forged requests.", correct: false }
    ],
    explanationShort: "Permissions verify whose session it is, not whether the user intended the action; state-changing non-form routes need a CSRF token requirement.",
    explanationLong: "A permission check asks 'does the logged-in user have permission?' In a CSRF attack, an administrator's browser sends their real session cookie when another site tricks it into requesting your URL, so the permission check passes. Requiring a CSRF token on state-changing routes proves the link was generated by your site for that session. Read-only pages change nothing, so there is nothing to forge."
  },
  {
    id: "l3-functional-vs-functional-js",
    category: "Drupal concepts",
    tags: ["Testing"],
    difficulty: 3,
    question: "Why shouldn't every browser-style test be written as a FunctionalJavascript test 'just in case'?",
    hint: "Consider what extra moving parts a real WebDriver browser introduces compared to Drupal's simulated HTTP browser.",
    answers: [
      { text: "A real browser makes tests slower and flakier when plain HTML checks would do.", correct: true },
      { text: "FunctionalJavascript tests can't create users or nodes during test setup.", correct: false },
      { text: "Standard Functional tests can't submit forms or follow redirects, so they miss bugs.", correct: false }
    ],
    explanationShort: "Standard Functional tests exercise routing, permissions, forms, and Twig over fast simulated HTTP; reserve WebDriver tests for behavior that depends on JavaScript.",
    explanationLong: "Drupal's testing pyramid gives each layer a job: Unit for isolated logic, Kernel for service, entity, and schema wiring, Functional for full HTTP requests, forms, and access rules without JavaScript, and FunctionalJavascript for AJAX, modals, or interactive behavior. Both browser-style test types can create users and content and submit forms. Pushing non-JS checks into WebDriver multiplies CI time and adds timing flakiness for no extra confidence."
  },
  {
    id: "l3-plain-text-vs-markup-render",
    category: "Drupal concepts",
    tags: ["Security", "Render API"],
    difficulty: 3,
    question: "In a render array, what is the conceptual difference between passing a string as plain text versus passing it as markup?",
    hint: "Both output text on the page, but they make very different promises about where that string came from.",
    answers: [
      { text: "Plain text escapes every character; markup keeps HTML but filters dangerous tags.", correct: true },
      { text: "Plain text strips whitespace and line breaks, while markup preserves them exactly.", correct: false },
      { text: "Markup skips XSS filtering entirely and prints the string exactly as given, scripts included.", correct: false }
    ],
    explanationShort: "Plain text guarantees every character is shown literally; markup assumes HTML was intended and runs an admin XSS filter instead of full escaping.",
    explanationLong: "When displaying a title, username, or external API value, you want literal characters: if someone typed '<b>Hello</b>', it should appear as typed, not turn the page bold. Plain text escapes every HTML character. Markup is meant for strings authored as HTML by trusted code; it is still filtered against scripts and other dangerous tags, unless the code wraps it in an explicitly trusted markup object. Using markup on raw user input can allow formatting the user was never meant to control."
  },
  {
    id: "l3-entity-view-builder-vs-template-query",
    category: "Drupal concepts",
    tags: ["Entities", "Render API", "Caching"],
    difficulty: 3,
    question: "Why should a controller render referenced entities through their view builder (or a field formatter) instead of pulling raw field strings into a custom array?",
    hint: "Think about translation, field access, display modes, and cache tags.",
    answers: [
      { text: "It handles translation, field access, view modes, and the entity's cache tags.", correct: true },
      { text: "Reading field values directly removes the entity from Drupal's static entity cache.", correct: false },
      { text: "Twig can't print plain strings from a controller array without a view builder.", correct: false }
    ],
    explanationShort: "Delegating to the view builder keeps translation rules, field access checks, reusable view modes, and automatic cache invalidation when the referenced entity is edited.",
    explanationLong: "Copying field values by hand into a custom template array looks simple on day one, until the site adds a second language (wrong translation shown), restricts a field by role (data leaked), or edits the referenced node (the page never refreshes because that node's cache tags were never added). Reading field values does not affect the entity cache, and Twig prints plain strings fine; the risk is losing those four guarantees."
  },

  {
    id: "l3-plugin-vs-tagged-service",
    category: "Drupal concepts",
    tags: ["Plugins", "Services"],
    difficulty: 3,
    question: "How do you decide whether a new extension point in your module should be a plugin type versus a tagged service?",
    hint: "Compare 'a site builder picks and configures one of several options' with 'every registered class runs as part of a pipeline.'",
    answers: [
      { text: "Plugins for selectable, configurable variants; tagged services for pipeline steps.", correct: true },
      { text: "Plugins when dependencies must be injected; tagged services for static helpers.", correct: false },
      { text: "Plugins for core modules only; tagged services for custom and contrib modules.", correct: false }
    ],
    explanationShort: "Use plugins when callers or site builders pick and configure specific instances (like blocks or payment gateways); use tagged services when all registered implementations participate together.",
    explanationLong: "Both plugins and tagged services are available to custom modules and both can receive injected services. The real choice is how implementations are used: if an administrator selects 'Stripe' or 'PayPal' and saves per-instance settings for it, you want a plugin type. If every registered class should automatically run in priority order (like path processors, route enhancers, or cache context calculators), a tagged service collector is simpler and cleaner."
  },
  {
    id: "l3-tempstore-vs-state-vs-cache",
    category: "Drupal concepts",
    tags: ["Config", "Security"],
    difficulty: 3,
    question: "A multi-step wizard needs to hold one logged-in editor's unfinished draft between requests for a few hours. Why does it belong in Private TempStore instead of State or Cache?",
    hint: "Check who owns the data, whether it can be wiped mid-wizard, and whether it should expire.",
    answers: [
      { text: "TempStore is scoped per user and expires; State is global, and Cache can evict.", correct: true },
      { text: "State can only hold strings, and Cache is disabled for logged-in users in Drupal.", correct: false },
      { text: "Private TempStore exports each editor's draft to YAML so it survives deployments.", correct: false }
    ],
    explanationShort: "Private TempStore isolates temporary user data with an expiration window, avoiding Cache's unpredictable evictions and State's global, permanent storage.",
    explanationLong: "Putting a user's draft in Cache risks losing their work the moment someone runs a cache rebuild or Redis evicts a key. Putting it in State leaves global entries sitting around forever unless you build your own scoping and cleanup. Private TempStore is built for short-lived, per-user work in progress—just like Layout Builder or Views UI—and cleans up expired entries via cron. Cache works for logged-in users too, and TempStore never exports to YAML."
  },
  {
    id: "l3-database-merge-vs-insert",
    category: "Drupal concepts",
    tags: ["Database"],
    difficulty: 3,
    question: "When writing to a custom non-entity table where a key might already exist, why use a Database Merge query instead of a SELECT followed by an INSERT or UPDATE?",
    hint: "Think about two requests checking for the same key at the exact same millisecond.",
    answers: [
      { text: "Merge avoids a check-then-insert race and stays portable across SQL engines.", correct: true },
      { text: "A SELECT followed by an UPDATE is forbidden inside Drupal's Database API.", correct: false },
      { text: "Merge queries automatically create entity revisions for every updated row.", correct: false }
    ],
    explanationShort: "Merge (upsert) lets Drupal handle insert-or-update cleanly across databases without the classic race condition between checking existence and inserting.",
    explanationLong: "If two concurrent requests both run SELECT, both see 'no row yet,' and both try to INSERT the same unique key, one crashes with a duplicate-key error. Drupal's Merge query expresses the upsert intent once and handles it safely across MySQL, PostgreSQL, and SQLite. Separate SELECT and UPDATE queries are allowed in the Database API, and custom tables have no entity revisions."
  },
  {
    id: "l3-hook-update-vs-hook-install",
    category: "Drupal concepts",
    tags: ["Updates"],
    difficulty: 3,
    question: "What is the difference between putting setup logic in an install hook versus an update hook?",
    hint: "Compare a brand-new site enabling your module tomorrow with a site that enabled it last year.",
    answers: [
      { text: "Install runs once on newly enabled sites; update hooks upgrade already-enabled sites.", correct: true },
      { text: "Install hooks run on every deployment, while update hooks only run when forced.", correct: false },
      { text: "Update hooks also run during fresh module installs, so install hooks aren't needed.", correct: false }
    ],
    explanationShort: "Fresh installs run the install hook and skip past update hooks up to the current schema number; existing sites never re-run install and rely on update hooks.",
    explanationLong: "When a site enables your module for the first time, Drupal runs its install hook and marks the module's schema version at the highest existing update hook, so old update hooks do not run on fresh installs. Conversely, sites that already had the module enabled will never re-run the install hook; they depend on new update hooks. That is why new requirements often need both updated install setup and a new update hook."
  },
  {
    id: "l3-route-subscriber-vs-routing-yml",
    category: "Drupal concepts",
    tags: ["Routing"],
    difficulty: 3,
    question: "When should a module use a RouteSubscriber instead of static entries in its *.routing.yml file?",
    hint: "Compare declaring one fixed path with changing an existing route from another module or generating routes from config.",
    answers: [
      { text: "When altering another module's routes or generating routes from dynamic data.", correct: true },
      { text: "Whenever a route needs a dynamic parameter like /article/{node} in its path.", correct: false },
      { text: "Whenever a route requires a custom access checker service instead of a permission.", correct: false }
    ],
    explanationShort: "Static *.routing.yml handles path parameters and custom access checks fine; use a RouteSubscriber to alter existing routes or build routes dynamically at rebuild time.",
    explanationLong: "A common misconception is that any route with a `{parameter}` placeholder or custom access service needs a RouteSubscriber. Both work cleanly in static *.routing.yml files. A RouteSubscriber is an event subscriber that runs when the router rebuilds, making it the right tool for changing another module's route (like tightening access on a core route) or creating routes dynamically based on enabled entity types or configuration."
  },
  {
    id: "l3-plugin-configuration-vs-definition",
    category: "Drupal concepts",
    tags: ["Plugins"],
    difficulty: 3,
    question: "What is the difference between a plugin's definition (its attribute or annotation) and a plugin's configuration?",
    hint: "Think of placing the same 'Recent Content' block twice—once showing 3 articles and once showing 10 events.",
    answers: [
      { text: "The definition describes the plugin type; configuration holds per-instance settings.", correct: true },
      { text: "The definition is editable in the admin UI; configuration is hardcoded in PHP.", correct: false },
      { text: "Definitions exist only in Drupal 10, while Drupal 11 stores everything in config.", correct: false }
    ],
    explanationShort: "One plugin definition registers the class and its metadata globally, while configuration varies for each placed or configured instance of that plugin.",
    explanationLong: "A block plugin's definition (in its PHP attribute or annotation) tells Drupal its ID, admin label, and category—shared by every placement of that block. Each time a site builder places that block in a region, Drupal creates an instance with its own configuration array (like item count or title override), stored in config YAML. Both concepts exist in Drupal 10 and 11."
  },
  {
    id: "l3-entity-validation-vs-form-validation",
    category: "Drupal concepts",
    tags: ["Entities", "Forms"],
    difficulty: 3,
    question: "Why should rules about valid data on a content entity (such as 'end date must be after start date') live as entity validation constraints rather than only in the entity form?",
    hint: "Think about all the ways an entity can be created or updated besides an editor clicking Save in the UI.",
    answers: [
      { text: "Entities also change via JSON:API, migrations, and code, bypassing forms.", correct: true },
      { text: "Entity forms don't support custom validate handlers on fields from other modules.", correct: false },
      { text: "Entity constraints run in the browser first, so they skip a server round trip.", correct: false }
    ],
    explanationShort: "Entity validation enforces data invariants across forms, REST/JSON:API, migrations, and custom PHP—whereas form validation protects only the browser form.",
    explanationLong: "Putting domain rules inside a form validate handler protects only that one UI form. As soon as an import, JSON:API client, or queue worker saves an entity, those form rules never run and invalid data enters the database. Entity and field validation constraints run server-side on the entity model itself, and Drupal's entity forms surface constraint violations right next to the matching fields automatically."
  },
  {
    id: "l3-cache-invalidate-vs-delete",
    category: "Drupal concepts",
    tags: ["Caching"],
    difficulty: 3,
    question: "In Drupal's Cache API, what is the conceptual difference between invalidating a cache item versus deleting it?",
    hint: "Think about whether a caller can still ask for the stale value as a fallback while fresh data is being rebuilt.",
    answers: [
      { text: "Invalidating marks it stale for optional fallback; deleting removes it outright.", correct: true },
      { text: "Invalidating clears only the browser cache; deleting clears the server cache.", correct: false },
      { text: "Deleting works with cache tags, whereas invalidating only works with item IDs.", correct: false }
    ],
    explanationShort: "Invalidating keeps an item marked expired so callers that opt into stale reads can still use it; deleting erases the entry completely.",
    explanationLong: "Normal cache reads ignore invalidated items and recompute fresh data, so invalidation and deletion look identical in the common case. The difference matters under load or upstream outages: a caller can explicitly request an invalidated entry as a stale fallback rather than crashing or stampeding the backend. Deletion removes the data completely. Cache tags work by invalidating, not deleting, and both operate on server-side cache bins."
  },
  {
    id: "l3-queue-cron-vs-manual-worker",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 3,
    question: "What is the difference between a QueueWorker plugin that declares a cron time limit versus one that omits cron configuration?",
    hint: "Consider a queue that should only run on a dedicated CLI worker rather than inside regular site cron.",
    answers: [
      { text: "With cron settings, Drupal drains it during cron; without, an explicit runner must.", correct: true },
      { text: "Without cron settings, items run immediately inside the web request when added.", correct: false },
      { text: "With cron settings, items are deleted automatically if they fail on the first try.", correct: false }
    ],
    explanationShort: "Declaring a cron time budget opts the queue into Drupal's standard cron runner; omitting it leaves processing to explicit runners like Drush or a supervisor daemon.",
    explanationLong: "Not every queue belongs inside general cron—for example, a heavy video-transcoding or ERP-sync queue might belong on a dedicated Drush worker container so it never eats into general cron time. Omitting the cron property on the QueueWorker plugin keeps standard cron from touching that queue while still letting you invoke the worker on demand. Failed items follow the same lease/retry rules either way."
  },
  {
    id: "l3-testing-browser-vs-kernel-config-schema",
    category: "Drupal concepts",
    tags: ["Testing", "Config"],
    difficulty: 3,
    question: "True or false: Drupal's Kernel and Functional tests check saved configuration against its config schema by default, so missing or mistyped schema keys fail the test.",
    hint: "Think about how core catches modules that forget to update config/schema/*.schema.yml.",
    answers: [
      { text: "True: strict schema checks run by default and fail on missing or wrong types.", correct: true },
      { text: "False: schema checks only run when you export configuration with Drush manually.", correct: false }
    ],
    explanationShort: "Strict config schema checking is enabled by default in Kernel and Functional tests, catching missing schema definitions and wrong value types automatically.",
    explanationLong: "When a test saves or installs configuration whose keys are undocumented in config/schema or whose PHP types (such as storing a string where the schema expects an integer) do not match, Drupal's strict schema checker fails the test immediately. That catches drift between code, default YAML, and schema long before configuration reaches translation or production."
  },

  // =========================================================================
  // LEVEL 4 — What fails if you pick the tempting alternative (20 questions)
  // =========================================================================
  {
    id: "l4-uncacheable-max-age-zero-bubbling",
    category: "Drupal concepts",
    tags: ["Caching", "Render API"],
    difficulty: 4,
    question: "A developer puts max-age 0 on a tiny personalized greeting block inside the site header so it is always fresh. What unintended side effect does that have on Dynamic Page Cache?",
    hint: "Cache metadata bubbles upward from child render arrays to their parents.",
    answers: [
      { text: "The max-age bubbles up and makes the whole page uncacheable for Dynamic Page Cache.", correct: true },
      { text: "Drupal ignores max-age 0 on blocks and caches the greeting for a day anyway.", correct: false },
      { text: "Every request clears the cache for all users, since the block can't be stored.", correct: false },
      { text: "Only the header region becomes uncacheable; the rest of the page caches as usual.", correct: false }
    ],
    explanationShort: "Max-age 0 bubbles up the render tree and makes the surrounding page uncacheable unless the dynamic part is isolated with a lazy builder.",
    explanationLong: "Render cache metadata always takes the most restrictive combination of its children: the union of tags, the union of contexts, and the lowest max-age. A single child with max-age 0 (or a high-cardinality context like 'user' or 'session') affects every parent up to the page, not just its own region. Wrapping only the personalized bit in a lazy builder lets Drupal cache the rest of the page once and fill in the placeholder late. Nothing gets cleared; the page simply stops being stored."
  },
  {
    id: "l4-saving-config-during-request",
    category: "Drupal concepts",
    tags: ["Config", "Caching"],
    difficulty: 4,
    question: "What goes wrong if a front-end controller saves a module's editable configuration on normal visitor page views (for example, to increment a view counter)?",
    hint: "Every config object carries cache tags used across pages, menus, or blocks that read that config.",
    answers: [
      { text: "Each save clears every cache that uses that config and drifts production from Git.", correct: true },
      { text: "Editable config can only be saved while the site is in maintenance mode.", correct: false },
      { text: "Nothing serious: Drupal batches frequent config writes and saves them on cron.", correct: false },
      { text: "Config writes are only allowed from admin routes, so the save throws an access exception.", correct: false }
    ],
    explanationShort: "Writing config during normal traffic invalidates everything cached from that config and makes production's active config drift from what's in Git.",
    explanationLong: "Config writes are designed for infrequent admin changes, not visitor traffic. Saving 'my_module.settings' invalidates its cache tag, wiping every cached page, block, or route that read any setting from it, and adds write contention plus export conflicts. Drupal does not batch or block these saves, which is why the mistake is easy to make. Counters and telemetry belong in a custom table, State, or an external analytics store."
  },
  {
    id: "l4-current-user-injected-in-singleton-service",
    category: "Drupal concepts",
    tags: ["Services", "Security", "Testing"],
    difficulty: 4,
    question: "Why does Drupal inject an account proxy for 'current_user' instead of injecting a loaded User entity into services when they are built?",
    hint: "Services live for the whole request, and the active account can change during it (cron, subrequests, tests).",
    answers: [
      { text: "A stored User object would go stale when the active account switches mid-request.", correct: true },
      { text: "Loading a full User entity inside a constructor requires a raw SQL query.", correct: false },
      { text: "Anonymous visitors have no user ID, so there would be no User entity to inject.", correct: false },
      { text: "Services can't hold entity objects, because the container serializes them between requests.", correct: false }
    ],
    explanationShort: "The proxy delegates to whoever the active user is at call time, preventing stale identity bugs when accounts switch and avoiding loading the full User entity until needed.",
    explanationLong: "Container services are created once and reused for the request. If a service stored a concrete account snapshot early on, before the account switcher ran (for example cron temporarily acting as an author, or a subrequest with different authentication), it would check permissions against the wrong person. Keeping the injected proxy, and reading identity when a method runs instead of caching it in a property, avoids both privilege bugs and unnecessary entity loads. Anonymous visitors do have an account (user ID 0)."
  },
  {
    id: "l4-access-result-missing-cacheability",
    category: "Drupal concepts",
    tags: ["Security", "Caching", "Routing"],
    difficulty: 4,
    question: "A custom access check allows access only while an entity's 'Archived' checkbox is unchecked, but returns its allowed/forbidden result without adding the entity as a cacheable dependency. What bug appears?",
    hint: "Drupal caches access results too, not just HTML.",
    answers: [
      { text: "After the item is archived, cached pages and links may still treat access as allowed.", correct: true },
      { text: "Drupal throws an exception whenever an access result has no cache metadata attached.", correct: false },
      { text: "The access check runs again on every database query that loads the entity.", correct: false },
      { text: "Access results are never cached, so the only cost is a little extra processing.", correct: false }
    ],
    explanationShort: "Access decisions are cached alongside routes, menus, and render arrays; leaving out what drove the decision leaves stale allow or deny results in the cache.",
    explanationLong: "Access results carry cache metadata for a reason: if the decision depended on a permission, a role, a field on the entity, or a config setting, Drupal needs those contexts and tags on the result itself. Without adding the entity as a dependency (or caching per permission when that is what matters), Drupal cannot know when a change invalidated yesterday's verdict. Drupal does not throw in this case, which is why the bug stays hidden until someone notices the wrong access."
  },
  {
    id: "l4-config-override-in-form",
    category: "Drupal concepts",
    tags: ["Config", "Forms"],
    difficulty: 4,
    question: "In settings.php, production overrides an API key in configuration with an environment variable. Why do standard Drupal config forms load stored ('editable') config rather than the overridden runtime values?",
    hint: "Imagine an admin clicks 'Save configuration' on an unrelated checkbox in that same settings form.",
    answers: [
      { text: "So saving the form doesn't copy settings.php overrides into stored config and Git.", correct: true },
      { text: "Because settings.php isn't loaded on administrative pages, so overrides don't exist there.", correct: false },
      { text: "Because overridden values are encrypted, and forms can't display encrypted values.", correct: false }
    ],
    explanationShort: "Editing the stored config prevents secret or environment-specific overrides from leaking into the database and version-controlled YAML exports.",
    explanationLong: "Drupal separates runtime reads (which include settings.php and language overrides, so your live API client uses the real production secret) from editable config in admin forms (which loads the stored values). If a form loaded overridden values and an admin clicked Save, the production key from settings.php would be written into the config table and exported into Git on the next export. settings.php loads on every page, and overrides are plain values, not encrypted ones."
  },
  {
    id: "l4-entity-save-inside-presave-hook",
    category: "Drupal concepts",
    tags: ["Entities"],
    difficulty: 4,
    question: "During an entity's presave phase, why must you change fields directly on that entity instead of calling save() on the same entity?",
    hint: "Presave runs inside a save() call that has not finished writing yet.",
    answers: [
      { text: "The entity is already mid-save, so saving again re-enters the save and can loop.", correct: true },
      { text: "Field values are read-only during presave, so changes have to happen in a later hook.", correct: false },
      { text: "Presave runs after the transaction commits, so a second save is needed to store changes.", correct: false }
    ],
    explanationShort: "Presave exists so changes ride along with the save already in progress; calling save() again starts the whole lifecycle over from inside itself.",
    explanationLong: "Entity storage fires presave before writing so modules can compute derived fields, normalize values, or compare against the original entity in one write. Calling save() inside presave starts a nested save before the outer one has written IDs or updated the original state, leading to infinite loops or duplicate revisions. Field values are writable in presave, and it runs before anything is written. Changes made later, in insert or update hooks, are lost unless you deliberately save a different entity."
  },
  {
    id: "l4-cron-heavy-loop-without-queue",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 4,
    question: "Why is looping over thousands of entities directly inside a module's cron implementation risky even if cron runs in the background?",
    hint: "All modules share one cron run, protected by a single lock.",
    answers: [
      { text: "A slow loop holds up other modules' cron work and loses progress if it times out.", correct: true },
      { text: "Cron implementations can't inject services or load entities, so the loop will fail.", correct: false },
      { text: "Drupal stops each module's cron after 30 seconds and discards anything it changed.", correct: false }
    ],
    explanationShort: "Direct cron loops monopolize the shared cron run and lose progress on timeout; enqueuing item IDs during cron lets a queue worker process them in safe slices.",
    explanationLong: "Drupal runs cron implementations one after another under a lock. If your implementation spends minutes calling a slow external service and hits PHP's time or memory limit on item 600, later modules never run their cleanup, and the next run either repeats the first 600 items or skips the rest. Drupal does not cut your cron off cleanly or roll anything back. Using cron only to find work and enqueue IDs, while a queue worker processes bounded slices, isolates failures per item."
  },
  {
    id: "l4-custom-list-missing-list-cache-tag",
    category: "Drupal concepts",
    tags: ["Caching", "Entities", "Render API"],
    difficulty: 4,
    question: "A custom block lists the 5 newest published Event nodes and adds each node's own cache tag (node:10 through node:14), but no list or bundle cache tag. What fails?",
    hint: "Individual tags like node:14 only fire when nodes 10–14 change. What about node:15?",
    answers: [
      { text: "Edits to the five show up, but a newly published event never clears the block.", correct: true },
      { text: "Deleting one of the five leaves a broken link, since node tags don't fire on delete.", correct: false },
      { text: "The block can't be cached at all until a max-age is set alongside the tags.", correct: false },
      { text: "Nothing: node tags also clear when any node of the same bundle is created.", correct: false }
    ],
    explanationShort: "Individual entity tags track items already shown, not new items that should now enter the list; list or bundle tags (like node_list:event) cover new items.",
    explanationLong: "This is one of the most common caching bugs in custom blocks. Individual tags ('node:10') handle edits and deletions of items already in the list, but a new event gets a new ID ('node:99') that no cached block could have known in advance. Adding the bundle list tag ('node_list:event') invalidates the listing when an event is created, without clearing article or page listings the way the broad 'node_list' tag would."
  },
  {
    id: "l4-form-validation-side-effects",
    category: "Drupal concepts",
    tags: ["Forms"],
    difficulty: 4,
    question: "Why must a form's validation handler never save entities, charge an API, or send emails, even after checking that its own field looks valid?",
    hint: "Your validation handler is not the only validator on the form, and AJAX rebuilds also run validation.",
    answers: [
      { text: "Another validator can still fail, or the run may be an AJAX rebuild, not a submit.", correct: true },
      { text: "Database writes are blocked during validation, so the save will silently fail.", correct: false },
      { text: "Validation runs before the CSRF token is checked, so the request isn't trusted yet.", correct: false }
    ],
    explanationShort: "Validation can run several times (including AJAX rebuilds), and another validator can still reject the form afterward; side effects belong in submit handlers.",
    explanationLong: "Form API's contract is strict: validate handlers inspect input and record errors, alongside any validators other modules added through form alters. Only when every validator succeeds on a real submission does Drupal run submit handlers. Writes are not blocked during validation, which is exactly the danger: a side effect there happens even when the user ends up on an error screen, causing duplicate emails, orphaned entities, or charges for a form that was never submitted."
  },
  {
    id: "l4-sql-string-interpolation",
    category: "Drupal concepts",
    tags: ["Database", "Security"],
    difficulty: 4,
    question: "Even when using Drupal's dynamic select query builder, where can SQL injection still sneak in if a developer is careless?",
    hint: "The query builder binds condition values automatically, but not every argument you pass is a value.",
    answers: [
      { text: "Where raw user input becomes SQL text: expressions, operators, or sort columns.", correct: true },
      { text: "In condition values, such as passing user text to a standard equals condition.", correct: false },
      { text: "In joins, since tables combined by a join are never escaped by the builder.", correct: false }
    ],
    explanationShort: "The builder binds condition values safely, but raw SQL snippets and dynamic column or operator names bypass binding unless you check them against an allowlist.",
    explanationLong: "Developers rightly trust a condition like title = user input, because the value becomes a bound parameter. Trouble starts when URL parameters, such as ?sort=price or a filter operator, are inserted directly into a sort, a condition operator, or a raw where expression. Placeholders only bind data values, not column names or SQL syntax, so dynamic sort fields and operators must always be checked against an explicit server-side allowlist. Joins built with the builder's methods are not where the risk lies."
  },

  {
    id: "l4-plugin-discovery-cache-stale",
    category: "Drupal concepts",
    tags: ["Plugins", "Caching"],
    difficulty: 4,
    question: "A developer adds a new Block plugin class—or changes the label in its PHP attribute—reloads the site, and Drupal acts as if the change doesn't exist. Why?",
    hint: "Scanning every PHP class in every module on every HTTP request would be very slow.",
    answers: [
      { text: "Plugin definitions are cached in the discovery bin until caches are rebuilt.", correct: true },
      { text: "New plugin classes aren't active until you run update.php to register them.", correct: false },
      { text: "Block plugins only appear after you export and re-import site configuration.", correct: false }
    ],
    explanationShort: "Plugin managers cache discovered definitions in the discovery cache bin, so new classes or changed attributes do not show up until caches are cleared or rebuilt.",
    explanationLong: "Reflecting over hundreds of PHP files across every module on every page load would crush performance, so Drupal scans plugin directories once and stores the resulting definitions in the discovery cache bin. Adding a plugin class or editing its attribute or annotation requires a cache rebuild (or clearing plugin definitions) before the plugin manager sees the change. No update hook or config export is needed."
  },
  {
    id: "l4-update-hook-using-live-config-service",
    category: "Drupal concepts",
    tags: ["Updates", "Config"],
    difficulty: 4,
    question: "Why is it risky for a numbered update hook to assume a module's current PHP classes, services, or future config shape will stay unchanged across later releases?",
    hint: "Think of a site upgrading across two major or minor versions at once, running update 10001 and 10002 back to back.",
    answers: [
      { text: "Future releases can rename fields or services, breaking older update hooks.", correct: true },
      { text: "Update hooks can't call any PHP code from the same module during an upgrade.", correct: false },
      { text: "Drupal deletes all numbered update hooks automatically after one minor release.", correct: false }
    ],
    explanationShort: "Old update hooks still run when a site skips versions; coupling them to moving application services or future entity fields breaks upgrade paths later.",
    explanationLong: "When a site jumps from release 1.0 straight to 1.4, update 10001 runs with 1.4's PHP codebase on a 1.0 database schema. If update 10001 called a service or relied on a field that 1.3 later renamed or removed, the upgrade crashes before 10002 ever runs. Keeping update hooks self-contained and focused on the storage change they own—and using post-updates for entity work—keeps multi-step upgrades reliable."
  },
  {
    id: "l4-drupal11-deprecated-hook-procedural-collision",
    category: "Drupal concepts",
    tags: ["Drupal 11", "Services"],
    difficulty: 4,
    question: "When converting a module's hooks to Drupal 11.1+ #[Hook] classes while keeping Drupal 10 compatibility, what goes wrong if you leave the old procedural hook in .module without marking it as legacy?",
    hint: "Drupal 11.1+ discovers both OOP hook classes and procedural functions in .module files.",
    answers: [
      { text: "On Drupal 11.1+, both the function and the class method run, firing logic twice.", correct: true },
      { text: "Drupal 11 throws a fatal error on startup whenever a .module file still exists.", correct: false },
      { text: "Drupal 11 ignores #[Hook] classes completely if any function exists in .module.", correct: false }
    ],
    explanationShort: "Without marking the procedural shim as a legacy hook (via #[LegacyHook]), Drupal 11.1+ invokes both the function and the OOP method, running your hook twice.",
    explanationLong: "Because Drupal 11.1+ supports procedural hooks and OOP #[Hook] classes side by side, leaving an unmarked `mymodule_form_alter()` alongside an OOP `#[Hook('form_alter')]` method registers two distinct listeners. On Drupal 10 only the procedural function runs, while on Drupal 11.1+ both fire—duplicating form alters, emails, or entity changes. Marking the procedural wrapper with `#[LegacyHook]` tells Drupal 11 to skip it while Drupal 10 still calls it."
  },
  {
    id: "l4-render-early-in-controller",
    category: "Drupal concepts",
    tags: ["Render API", "Caching"],
    difficulty: 4,
    question: "What goes wrong if a controller renders a child render array into a plain HTML string too early and embeds that string in the page?",
    hint: "Think about what happens to the child's cache tags, cache contexts, and attached asset libraries.",
    answers: [
      { text: "Cache metadata and asset libraries can fail to bubble, causing bugs or errors.", correct: true },
      { text: "Drupal caches the HTML string permanently even if the child had max-age 0.", correct: false },
      { text: "Twig escapes the rendered string twice, showing raw HTML tags to every visitor.", correct: false }
    ],
    explanationShort: "Early rendering outside the main render context can drop or leak cache metadata and asset libraries, causing missing CSS/JS, stale pages, or leaked-metadata exceptions.",
    explanationLong: "Drupal's renderer expects render arrays to stay structured so cache tags, contexts, max-age, placeholders, and attached libraries bubble cleanly from children up to the response. Calling the renderer prematurely (especially via renderInIsolation or outside the active render context) detaches that metadata from the parent—breaking cache invalidation, dropping libraries, or triggering Drupal's early-rendering leaked metadata exception."
  },
  {
    id: "l4-database-transaction-not-saved",
    category: "Drupal concepts",
    tags: ["Database"],
    difficulty: 4,
    question: "In Drupal's Database API, why does starting a transaction without storing the returned transaction object in a variable defeat the transaction?",
    hint: "Drupal ties a transaction's lifetime to PHP's object scope.",
    answers: [
      { text: "The handle goes out of scope and commits right away, before your queries run.", correct: true },
      { text: "Drupal refuses to run any queries until the transaction object is passed to them.", correct: false },
      { text: "Without a variable, Drupal rolls back the transaction as soon as the line ends.", correct: false }
    ],
    explanationShort: "Drupal commits a transaction when its handle object is destroyed at the end of scope, so discarding the return value closes the transaction before your writes start.",
    explanationLong: "Unlike raw SQL BEGIN/COMMIT calls, Drupal represents a transaction as an RAII-style object: while the variable stays in scope, subsequent queries on that connection share the transaction; when the variable leaves scope, its destructor commits (unless you explicitly rolled back). Calling `$connection->startTransaction()` without assigning `$transaction = ...` destroys the object immediately on that line, leaving your following queries running outside any transaction."
  },
  {
    id: "l4-entity-cache-static-memory-leak",
    category: "Drupal concepts",
    tags: ["Entities", "Queues", "Updates"],
    difficulty: 4,
    question: "A long-running Drush post-update or queue worker loads and updates 50,000 nodes in batches inside one PHP process and hits the memory limit. What is the usual culprit?",
    hint: "Entity storage remembers loaded entities in PHP memory so repeated loads in one request are fast.",
    answers: [
      { text: "The entity memory cache keeps every loaded entity until you clear it per batch.", correct: true },
      { text: "PHP can't garbage-collect objects that were loaded from a MySQL database.", correct: false },
      { text: "Saving an entity copies the entire node table into RAM to validate revisions.", correct: false }
    ],
    explanationShort: "Drupal's in-memory entity cache retains loaded entities for the lifetime of the PHP process; long CLI loops must reset it between batches to keep memory flat.",
    explanationLong: "During a short web request, caching loaded entities in PHP memory prevents loading the same node or user five times. In a long-running CLI process looping over tens of thousands of entities, that same memory cache holds references to every entity ever loaded—preventing PHP's garbage collector from freeing them until the process runs out of RAM. Clearing the entity memory cache (or calling storage resetCache()) after each batch solves it cleanly."
  },
  {
    id: "l4-route-without-method-restriction",
    category: "Drupal concepts",
    tags: ["Routing", "Security"],
    difficulty: 4,
    question: "Besides requiring a CSRF token, why is it risky for a custom route that deletes or mutates data to accept plain GET requests?",
    hint: "Think about browser link prefetching, security link scanners, proxies, and accidental reloads.",
    answers: [
      { text: "Prefetchers, scanners, and reloads can fire GET requests without intent.", correct: true },
      { text: "Drupal's CSRF token check doesn't work on GET routes, only POST routes.", correct: false },
      { text: "GET routes skip permission checks so anonymous caches can serve them.", correct: false }
    ],
    explanationShort: "HTTP defines GET as safe and side-effect-free; browsers, proxies, email scanners, and back/reload buttons freely trigger GET URLs without explicit user confirmation.",
    explanationLong: "Even when a GET route checks permissions and a CSRF token, browsers prefetch links, corporate email scanners pre-click URLs, and users hit Refresh—triggering unintended deletes or state changes. Keeping mutations behind POST (or a Drupal ConfirmForm) aligns with HTTP semantics, prevents accidental triggers, and keeps sensitive action parameters out of browser history and server access logs."
  },
  {
    id: "l4-form-state-storage-unserializable",
    category: "Drupal concepts",
    tags: ["Forms", "Services"],
    difficulty: 4,
    question: "Why does storing a live service (such as the database connection or entity type manager) inside a form's $form_state storage break AJAX or multi-step forms?",
    hint: "Think about how Drupal preserves $form_state between one HTTP request and the next.",
    answers: [
      { text: "Form state is serialized between requests, and live services fail to serialize.", correct: true },
      { text: "FormState storage only accepts string keys with numeric or boolean values.", correct: false },
      { text: "Storing a service in form state exposes its credentials inside hidden HTML inputs.", correct: false }
    ],
    explanationShort: "Cached forms serialize $form_state into cache storage between requests; holding live connections or container-wired services breaks serialization or bloats the cache.",
    explanationLong: "Whenever a form uses AJAX or multi-step rebuilds, Drupal serializes the form and $form_state into the form cache so the next request can resume. Services often wrap PDO connections, closures, or the container itself, causing serialization exceptions (and even services that do serialize bloat the cache). Inject services into the form class (using DependencySerializationTrait) and keep $form_state storage to plain data like IDs and flags. FormState stays server-side, not in hidden HTML."
  },
  {
    id: "l4-test-relying-on-real-external-http",
    category: "Drupal concepts",
    tags: ["Testing", "Services"],
    difficulty: 4,
    question: "Why is letting a Kernel or Functional test call a live third-party HTTP API a bad practice even when that API is usually online?",
    hint: "Consider CI reliability, rate limits, and how you would test a 503 outage.",
    answers: [
      { text: "Tests turn flaky when networks or remote data shift, and can't test error cases.", correct: true },
      { text: "Drupal's Kernel tests block all outbound TCP sockets at the PHP level.", correct: false },
      { text: "Calling an external API inside a test clears the test database before assertions.", correct: false }
    ],
    explanationShort: "Live API calls make CI slow and flaky whenever the network or remote data changes, and prevent you from reliably testing timeouts or error responses.",
    explanationLong: "A test suite should fail only when your code breaks, not because a third-party sandbox had maintenance, rate-limited CI, or changed a sample record. Swapping the HTTP client (or your API client service) with a mocked handler in tests makes every run fast, offline-safe, and able to prove how your module handles 404s, 500s, and malformed JSON."
  },
  {
    id: "l4-security-trusted-markup-raw-input",
    category: "Drupal concepts",
    tags: ["Security", "Render API"],
    difficulty: 4,
    question: "A developer wraps raw text from a user-submitted field in a trusted markup object (like Markup::create()) because Twig was escaping quotes and symbols. What goes wrong?",
    hint: "Look at what promise a trusted markup object makes to Drupal's renderer and Twig.",
    answers: [
      { text: "It tells Twig the string is already safe HTML, turning off escaping and opening XSS.", correct: true },
      { text: "Drupal strips every quote and symbol from the string anyway during final rendering.", correct: false },
      { text: "It breaks render caching because trusted markup objects can't carry cache tags.", correct: false }
    ],
    explanationShort: "Trusted markup objects exist specifically to tell Twig 'I already sanitized this HTML'—wrapping untrusted user text in one bypasses autoescape and introduces XSS.",
    explanationLong: "Twig autoescaping is your safety net against cross-site scripting. Calling Markup::create() (or using Twig's `|raw` filter) explicitly tells Drupal that the string is safe, pre-sanitized HTML—so a malicious `<script>` or `onerror` attribute in that field executes in every viewer's browser. To fix double-escaped quotes, fix where escaping happened too early, or pass plain text so Twig escapes it once cleanly."
  },

  // =========================================================================
  // LEVEL 5 — Tradeoffs & why Drupal 11 differs from Drupal 10 (20 questions)
  // =========================================================================
  {
    id: "l5-drupal11-oop-hooks-why",
    category: "Drupal concepts",
    tags: ["Services", "Drupal 11"],
    difficulty: 5,
    question: "Drupal 11.1+ lets you write hooks as class methods with #[Hook] attributes, while Drupal 10 relied on functions in .module files. What problem did hook classes actually solve?",
    hint: "Think beyond syntax: what couldn't a function in a .module file take part in?",
    answers: [
      { text: "Hook classes are services, so they get injected dependencies and live in focused files.", correct: true },
      { text: "Hook classes run in parallel, so many implementations of one hook finish faster.", correct: false },
      { text: "Procedural hooks couldn't alter forms or entity queries, so classes were needed for that.", correct: false },
      { text: "Hook classes turn entity hooks into async webhooks that other systems can subscribe to.", correct: false }
    ],
    explanationShort: "Hook classes let hook code use real dependency injection and domain-focused classes instead of large .module files full of \\Drupal::service() calls.",
    explanationLong: "In Drupal 10, procedural hooks forced two compromises: Drupal loaded every enabled module's .module file on nearly every request, and hook bodies fell back to the static \\Drupal::service() locator because functions have no constructors. In Drupal 11.1+, hook classes are services with autowired constructor injection, organized under src/Hook/, while procedural hooks keep working during the transition. Hooks still run one after another in the same request, and procedural hooks could always alter forms and queries."
  },
  {
    id: "l5-autowiring-tradeoff",
    category: "Drupal concepts",
    tags: ["Services", "Drupal 11"],
    difficulty: 5,
    question: "Modern Drupal supports service autowiring, so a constructor type-hinted with interfaces can get dependencies without listing every argument in YAML. When does autowiring still need explicit configuration?",
    hint: "Consider interfaces implemented by many services, such as cache bins or logger channels.",
    answers: [
      { text: "When several services share one interface, like cache bins or logger channels.", correct: true },
      { text: "When a service has more than two dependencies, since autowiring stops at two.", correct: false },
      { text: "When the class lives in a custom module instead of Drupal core or a contrib module.", correct: false },
      { text: "When the dependency is a core service, since only custom services can be autowired.", correct: false }
    ],
    explanationShort: "Autowiring resolves one-to-one interface mappings, but interfaces with many instances (cache bins, logger channels) need you to say which one you mean.",
    explanationLong: "Autowiring removes boilerplate when one interface maps clearly to one service, like the entity type manager. But the cache backend interface has many bins ('cache.render', 'cache.data', 'cache.discovery'), and the logger interface has one instance per channel. Guessing a default there would hide bugs, so Drupal needs explicit wiring, either in services.yml or with an #[Autowire] attribute, whenever choosing the specific instance matters. The number of dependencies and where the class lives make no difference."
  },
  {
    id: "l5-lazy-builder-granularity-tradeoff",
    category: "Drupal concepts",
    tags: ["Caching", "Render API"],
    difficulty: 5,
    question: "Lazy builders keep personalized or uncacheable fragments from ruining page-level caching. Why shouldn't you wrap every block on a page in its own lazy builder?",
    hint: "Placeholders are not free. Think about what Drupal must do for each placeholder on a cache hit.",
    answers: [
      { text: "Each placeholder adds work, and blocks that already cache well gain nothing from it.", correct: true },
      { text: "Drupal allows at most two lazy builders per page and drops any extra ones silently.", correct: false },
      { text: "Lazy builders turn off Twig autoescaping inside the block, so each one adds XSS risk.", correct: false }
    ],
    explanationShort: "Lazy builders trade a small per-request cost to rescue the surrounding page's cacheability; using them on blocks that already cache well adds overhead for no gain.",
    explanationLong: "A lazy builder isolates poor cacheability: per-user or per-session contexts, or a very short max-age. If a footer or news block varies only by language and is cleared through cache tags, the page caches already serve it inline with no placeholder work. Turning 30 cacheable blocks into 30 placeholders makes Drupal track, fill in, and stream fragments on every hit. There is no fixed limit on placeholders, and escaping works the same inside them."
  },
  {
    id: "l5-base-fields-vs-configurable-fields",
    category: "Drupal concepts",
    tags: ["Entities", "Config", "Database"],
    difficulty: 5,
    question: "On a custom content entity, how do you weigh defining a property as a code-defined base field versus a configurable field exported to YAML?",
    hint: "Compare table storage, guarantees in code, and flexibility per bundle.",
    answers: [
      { text: "Base fields are guaranteed by code; configurable fields can differ from bundle to bundle.", correct: true },
      { text: "Base fields can't appear on forms or in Views, while configurable fields can't be used in PHP.", correct: false },
      { text: "Configurable fields are Drupal 10 only; Drupal 11 replaced them with base fields.", correct: false }
    ],
    explanationShort: "Base fields guarantee domain invariants and compact storage for single-value fields; configurable fields trade extra table joins for per-bundle flexibility managed in the UI.",
    explanationLong: "If your code depends on an Order always having a 'total' and a 'state', base fields guarantee no admin or config change can remove them, and single-value base fields sit as columns on the entity's own table, avoiding joins across millions of rows. Configurable fields shine when bundles need optional fields managed by site builders and deployed as config, at the cost of a dedicated table per field. Both kinds work on forms, in Views, and in PHP, in Drupal 10 and 11 alike."
  },
  {
    id: "l5-broad-vs-targeted-cache-tags",
    category: "Drupal concepts",
    tags: ["Caching", "Entities"],
    difficulty: 5,
    question: "What is the real tradeoff between a broad list tag (like 'node_list'), a bundle list tag (like 'node_list:article'), and a custom tag (like 'featured_homepage_items')?",
    hint: "Weigh cache hit rate on busy sites against the risk of forgetting to clear a tag.",
    answers: [
      { text: "Broad tags are simple but purge too much; narrow tags need every write path to clear them.", correct: true },
      { text: "Custom cache tags aren't sent to reverse proxies like Varnish, so only broad tags purge the CDN.", correct: false },
      { text: "Drupal 11 rewrites broad list tags into narrower custom tags automatically at runtime.", correct: false }
    ],
    explanationShort: "Broad tags guarantee freshness at the cost of needless purges; bundle or custom tags protect hit rates on busy sites but demand strict invalidation discipline.",
    explanationLong: "On a small site where editors publish twice a day, 'node_list' is harmless. On a newsroom saving content every few seconds, 'node_list' keeps purging the CDN site-wide. Bundle tags ('node_list:article') narrow that automatically through core. Custom tags narrow it further, for example clearing only when a node's 'featured' flag is set or was set before saving, which raises the hit rate a lot, provided you handle both becoming featured and being un-featured. Proxies and CDNs that support tag purging treat custom tags like any other."
  },
  {
    id: "l5-decorator-vs-service-provider-swap",
    category: "Drupal concepts",
    tags: ["Services"],
    difficulty: 5,
    question: "When extending a core or contrib service, why is service decoration usually safer than swapping the service class outright in a service provider?",
    hint: "Imagine two different modules both want to enhance the same core service.",
    answers: [
      { text: "Decorators wrap the original, so several modules can stack; a swap lets only one win.", correct: true },
      { text: "Service provider changes only apply on install and are lost on the next cache rebuild.", correct: false },
      { text: "Decorated services can't receive extra dependencies, so they are only for small tweaks.", correct: false }
    ],
    explanationShort: "Decorators compose around an interface and preserve other modules' wrappers; replacing the class outright means only one module's change survives.",
    explanationLong: "If module A swaps a core service class for SubclassA and module B swaps the same service for SubclassB, one silently wipes out the other, and both are tied to the original class's constructor and protected methods. A decorator implements the public interface, receives the inner service as an argument, adds behavior before or after delegating, and lets the container chain several decorators. Service provider changes do persist across rebuilds, and decorators can inject whatever they need."
  },
  {
    id: "l5-internal-page-cache-vs-dynamic-page-cache",
    category: "Drupal concepts",
    tags: ["Caching", "Routing", "Security"],
    difficulty: 5,
    question: "How do Internal Page Cache and Dynamic Page Cache differ in their assumptions, and what breaks if custom code violates Internal Page Cache's assumption?",
    hint: "One serves anonymous traffic keyed by URL; the other understands cache contexts and placeholders.",
    answers: [
      { text: "Internal Page Cache keys anonymous pages by URL only, so other variations leak to everyone.", correct: true },
      { text: "Internal Page Cache stores admin pages, while Dynamic Page Cache only stores JSON responses.", correct: false },
      { text: "Internal Page Cache respects cache contexts, so it only misses tags, which Dynamic handles.", correct: false }
    ],
    explanationShort: "Internal Page Cache keys anonymous responses by URL and ignores other cache contexts for speed, while Dynamic Page Cache honors contexts and placeholders for any user.",
    explanationLong: "Internal Page Cache runs very early to serve anonymous hits fast, and it assumes anonymous output depends only on the URL. Even if your block declares a cookie or region cache context, Internal Page Cache does not split its cache by it. On sites that personalize anonymous pages by cookie or region without disabling Internal Page Cache (letting Dynamic Page Cache handle anonymous requests) or handling it at the edge, anonymous visitors will see each other's variant. Internal Page Cache does honor cache tags."
  },
  {
    id: "l5-plugin-annotation-attribute-transition",
    category: "Drupal concepts",
    tags: ["Plugins", "Drupal 11"],
    difficulty: 5,
    question: "When maintaining a custom plugin manager across Drupal 10.3 and Drupal 11, why did core support both attribute and annotation discovery before dropping annotations?",
    hint: "Think about what happens when a plugin manager upgrades before all contributed plugins do, or the other way round.",
    answers: [
      { text: "So managers find new attribute plugins and older annotated ones during the migration.", correct: true },
      { text: "Because Drupal 11 plugins must declare both an annotation and an attribute permanently.", correct: false },
      { text: "Because attributes only work on interfaces, while annotations only work on classes.", correct: false }
    ],
    explanationShort: "Supporting both discovery methods decouples upgrading a plugin manager from upgrading every third-party plugin at the same moment.",
    explanationLong: "Plugin types are ecosystem contracts: one module defines the manager while many other modules provide plugins for it. If switching a manager to attributes made it blind to annotated plugins, no manager could modernize without breaking downstream modules. Dual discovery lets new plugins use attributes alone while older annotated plugins keep working until annotation discovery is retired. Plugins only need one of the two, and attributes work on classes."
  },
  {
    id: "l5-config-validation-constraints-d11",
    category: "Drupal concepts",
    tags: ["Config", "Forms", "Drupal 11"],
    difficulty: 5,
    question: "Validation for module settings used to live only in a config form's validateForm() method. Why has Drupal 10.2+ and Drupal 11 pushed validation constraints into config schema instead?",
    hint: "Settings forms are no longer the only way configuration enters a Drupal site.",
    answers: [
      { text: "Config also arrives via imports, recipes, and Drush, none of which run the settings form.", correct: true },
      { text: "Drupal 11 removed ConfigFormBase, so forms can no longer validate settings themselves.", correct: false },
      { text: "Form validation can't show errors next to fields, so schema errors give better feedback.", correct: false }
    ],
    explanationShort: "Schema-level validation protects configuration across the CLI, recipes, imports, and forms alike, instead of leaving non-form changes unchecked.",
    explanationLong: "When validation lived only in an admin form, importing malformed YAML, applying a recipe, or changing config with Drush skipped every check and caused errors later. Putting validation constraints on config schema makes validity a property of the configuration itself, and config forms can map those same violations onto form fields without duplicating logic. ConfigFormBase still exists, and form validation shows errors next to fields as it always has."
  },
  {
    id: "l5-entity-storage-load-multiple-vs-loop",
    category: "Drupal concepts",
    tags: ["Entities", "Database", "Caching"],
    difficulty: 5,
    question: "Beyond running fewer SQL queries, why is loading entities in bulk (loadMultiple) after an entity query different from calling load() one by one in a loop?",
    hint: "Think about field storage tables, the entity cache, and storage load hooks.",
    answers: [
      { text: "Caches, field tables, and load hooks are hit once for the batch, not once per entity.", correct: true },
      { text: "A single load() skips access checks, while loadMultiple() applies view access to each entity.", correct: false },
      { text: "loadMultiple() defers configurable fields until Twig renders them, which saves memory.", correct: false }
    ],
    explanationShort: "Entity loading fans out across cache lookups, several field tables, and load hooks; batching turns that per-entity fan-out into one coordinated pass.",
    explanationLong: "Neither load() nor loadMultiple() checks view access; both are pure storage reads, and both load all fields. The difference is fan-out: an entity with 12 configurable fields and 4 modules implementing load hooks triggers cache lookups, table queries, and hook calls on every unbatched load. Passing all 50 IDs from an entity query to one loadMultiple() lets Drupal fetch from the cache backend in one multi-get, read each field table once with an IN() clause, and pass the whole set to load hooks at once."
  },
  {
    id: "l5-update-hook-vs-deploy-hook",
    category: "Drupal concepts",
    tags: ["Updates", "Config"],
    difficulty: 5,
    question: "In a standard Drush deployment (`drush deploy`), why do deploy hooks (`hook_deploy_NAME`) exist separately from both update hooks and post-updates?",
    hint: "Look at the order `drush deploy` runs: database updates first, then config import, then deploy hooks.",
    answers: [
      { text: "Update and post-update run before config import; deploy hooks run after it.", correct: true },
      { text: "Deploy hooks run before database updates so they can back up tables first.", correct: false },
      { text: "Post-updates are deprecated in Drupal 11 and replaced by Drush deploy hooks.", correct: false }
    ],
    explanationShort: "Because `drush deploy` imports configuration *after* update and post-update hooks, data migrations that depend on newly imported fields or bundles belong in a deploy hook.",
    explanationLong: "Suppose your release adds a new configurable field via exported YAML and needs to populate that field on 5,000 existing nodes. During `drush deploy`, update hooks and post-updates run *before* `config:import`, so the new field does not exist on production yet when they run. Drush deploy hooks run *after* `config:import` (once per hook name, tracked like post-updates), making them the right place for content migrations that depend on newly imported configuration. Post-updates are not deprecated; they still serve core and contrib modules that don't assume `drush deploy`."
  },
  {
    id: "l5-queue-requeue-vs-suspend-exception",
    category: "Drupal concepts",
    tags: ["Queues"],
    difficulty: 5,
    question: "Inside a QueueWorker, how do throwing a normal exception, a RequeueException, and a SuspendQueueException tell Drupal to react differently?",
    hint: "Compare one bad record, a record that just needs another try right away, and a downstream API that is completely down.",
    answers: [
      { text: "Normal waits out the lease; Requeue retries now; Suspend pauses the whole queue.", correct: true },
      { text: "Normal deletes the item forever; Requeue logs a warning; Suspend clears the queue.", correct: false },
      { text: "All three behave identically during cron and only differ under Drush queue runs.", correct: false }
    ],
    explanationShort: "A normal exception lets the lease expire while continuing other items, RequeueException releases the item immediately, and SuspendQueueException halts the queue for this run.",
    explanationLong: "Choosing the right exception prevents cascading failures. If one item has a transient conflict and can be retried promptly, `RequeueException` releases its lease immediately. If one item is malformed, a normal exception logs it, leaves it leased until expiry, and lets the worker keep draining healthy items (it does not delete the item). If the external CRM is down with 503s, throwing `SuspendQueueException` stops hammering the failing service with the next 1,000 items until the next run."
  },
  {
    id: "l5-testing-unit-vs-kernel-vs-functional-tradeoff",
    category: "Drupal concepts",
    tags: ["Testing"],
    difficulty: 5,
    question: "A module computes shipping rates (pure math), stores rate rules as config entities, and shows a summary block on checkout. What is the cleanest split across Drupal's test tiers?",
    hint: "Match each risk to the lightest test tier that actually proves it.",
    answers: [
      { text: "Unit for math, Kernel for config and wiring, and a focused Functional check.", correct: true },
      { text: "FunctionalJavascript for all three so every edge case runs in a real browser.", correct: false },
      { text: "Unit tests for all three, mocking entity storage, routing, and Twig rendering.", correct: false }
    ],
    explanationShort: "Keep edge-case permutations in fast Unit tests, prove config schema and container wiring in Kernel tests, and use a small Functional test for HTTP access and output.",
    explanationLong: "Testing 40 shipping-rate edge cases through a browser takes minutes and gives no more confidence about arithmetic than a 20-millisecond Unit test. Conversely, mocking entity storage, config schema, and routing in Unit tests misses real schema typos and permission bugs. Matching each tier to its strength keeps the suite fast while catching real integration failures."
  },
  {
    id: "l5-plugin-manager-container-factory",
    category: "Drupal concepts",
    tags: ["Plugins", "Services"],
    difficulty: 5,
    question: "Why do plugins that need services implement a container-factory interface instead of simply being declared as normal services in services.yml?",
    hint: "Think about what extra arguments a plugin receives when instantiated—like its plugin ID and saved block settings.",
    answers: [
      { text: "Plugins are built dynamically with per-instance config that services.yml lacks.", correct: true },
      { text: "The service container can't inject core services into classes under src/Plugin/.", correct: false },
      { text: "Normal services are recreated on every call, whereas plugins must be singletons.", correct: false }
    ],
    explanationShort: "A plugin needs both container services and runtime per-instance arguments (configuration, plugin ID, definition), which its plugin manager combines via the factory method.",
    explanationLong: "Normal services in `services.yml` are typically shared singletons whose arguments are known when the container compiles. A single Block or FieldFormatter plugin class might be instantiated five times on one page, each with a different saved configuration array and plugin ID. Implementing `ContainerFactoryPluginInterface` lets the plugin manager pull services from the container while passing in each instance's runtime configuration and definition."
  },
  {
    id: "l5-routing-dynamic-vs-path-processor",
    category: "Drupal concepts",
    tags: ["Routing", "Caching"],
    difficulty: 5,
    question: "How do an inbound path processor and a dynamic route differ when mapping human-friendly URLs to Drupal content?",
    hint: "Compare how path aliases (/about-us -> /node/5) work versus registering a brand-new controller path.",
    answers: [
      { text: "A path processor rewrites paths to existing routes; a route defines a new handler.", correct: true },
      { text: "Path processors bypass route access checks, while dynamic routes enforce them.", correct: false },
      { text: "Path processors only run on outbound links; dynamic routes handle inbound URLs.", correct: false }
    ],
    explanationShort: "Inbound path processors translate an incoming path into an internal path that existing routes match (keeping all their access checks), while routes define new endpoints.",
    explanationLong: "Path aliases and language prefixes work as path processors: they rewrite `/nl/over-ons` to `/node/5` before routing matches, so Drupal's existing node route, parameter upcasting, and access checks apply automatically (and outbound processors rewrite `/node/5` back to `/nl/over-ons` when generating links). A dynamic route defines a new URL pattern, controller, and access requirements of its own—which would be the wrong tool if you only wanted friendlier URLs for existing routes."
  },
  {
    id: "l5-entity-reference-vs-computed-field",
    category: "Drupal concepts",
    tags: ["Entities", "Database", "Caching"],
    difficulty: 5,
    question: "For derived entity data (like a count of active registrations on an Event), what is the tradeoff between a stored field updated on save versus a computed field?",
    hint: "Weigh SQL querying and sorting against the risk of stale stored numbers.",
    answers: [
      { text: "Stored fields query in SQL but can drift; computed fields stay fresh in PHP only.", correct: true },
      { text: "Computed fields automatically create SQL indexes, while stored fields can't sort.", correct: false },
      { text: "Stored fields can't appear in Views, whereas computed fields work in every filter.", correct: false }
    ],
    explanationShort: "Stored fields let SQL and Views filter and sort efficiently at the cost of keeping every write path in sync; computed fields are always accurate in PHP but cannot be queried in SQL directly.",
    explanationLong: "A computed field calculates its value on the fly in PHP without a database column—so it can never fall out of sync when registrations change, and requires no schema migration—but you cannot run an entity query or Views SQL sort on a column that does not exist (and heavy computation can slow entity loads if uncached). A stored field makes SQL filtering and sorting trivial, provided you reliably update it on every create, edit, delete, and bulk import path."
  },
  {
    id: "l5-form-ajax-vs-htmx-drupal11",
    category: "Drupal concepts",
    tags: ["Forms", "Render API", "Drupal 11"],
    difficulty: 5,
    question: "Drupal 11.2+ added HTMX support alongside the classic Form API AJAX system. What limitation of Form API AJAX makes lighter HTML-over-the-wire patterns appealing for non-form UI?",
    hint: "Think about what Drupal must build, cache, and serialize on the server every time a Form API AJAX callback fires.",
    answers: [
      { text: "Form AJAX rebuilds and caches full form state even for simple read-only fragments.", correct: true },
      { text: "Form API AJAX can't update DOM elements outside the button that triggered it.", correct: false },
      { text: "Drupal 11 removed Form API AJAX, so all dynamic forms must migrate to HTMX.", correct: false }
    ],
    explanationShort: "Form API AJAX carries the overhead of building, caching, and rebuilding full form state on every click—valuable for validated forms, but heavy for simple UI fragment swaps.",
    explanationLong: "Form API AJAX is great when a dropdown genuinely changes which form inputs exist and must be validated on submit. Using it for simple read-only UI updates (like filtering a preview, loading a tab, or refreshing a small block) forces Drupal to build, cache, and deserialize an entire form state on the server. HTMX lets ordinary routes return small cacheable render fragments directly without form-state overhead, while Form API AJAX stays supported for stateful forms."
  },
  {
    id: "l5-database-replica-read-tradeoff",
    category: "Drupal concepts",
    tags: ["Database", "Caching"],
    difficulty: 5,
    question: "Drupal's Database API lets read queries target a 'replica' database server. Why shouldn't every SELECT query in a module automatically target the replica?",
    hint: "Think about what happens 50 milliseconds after a user saves a form and gets redirected to view it.",
    answers: [
      { text: "Replication lag can serve stale or missing rows right after a recent write.", correct: true },
      { text: "Replica connections don't support JOIN clauses or parameterized conditions.", correct: false },
      { text: "Entity queries can't run against a primary database once a replica is configured.", correct: false }
    ],
    explanationShort: "Replicas lag behind the primary database asynchronously, so read-after-write flows can show outdated or missing data if routed to a replica blindly.",
    explanationLong: "Database replication is usually asynchronous: a write committed on the primary may take milliseconds—or seconds under heavy load—to arrive on a replica. Sending heavy reporting or analytics reads to the replica protects the primary, but routing interactive reads there right after a user creates or edits content causes 'I just saved this, where did it go?' bugs (which is why Drupal's own replica kill-switch temporarily pins a session back to primary after writes)."
  },
  {
    id: "l5-security-access-bypass-vs-account-switcher",
    category: "Drupal concepts",
    tags: ["Security", "Services", "Entities"],
    difficulty: 5,
    question: "A background queue worker generates a report showing only entities and fields a specific customer may view. Why is switching to that user via AccountSwitcher safer than running with access checks disabled?",
    hint: "Compare turning off all access checks with letting Drupal evaluate access as that exact customer.",
    answers: [
      { text: "Switching accounts runs real entity and field access rules for that exact user.", correct: true },
      { text: "AccountSwitcher logs the user in permanently so later cron items reuse them.", correct: false },
      { text: "Queue workers can't run entity queries with access disabled in Drupal 10 or 11.", correct: false }
    ],
    explanationShort: "AccountSwitcher lets every entity, field, and custom access handler evaluate permissions as that user—without leaking unpublished or restricted data—and restores the prior account cleanly.",
    explanationLong: "Disabling access checks turns off node grants, unpublished checks, and custom access handlers all at once, forcing your worker to re-implement security rules by hand (and inevitably miss one). Switching to the target user with `AccountSwitcherInterface::switchTo()`—and always calling `switchBack()` in a `finally` block—runs Drupal's real access stack for that user while guaranteeing the worker never leaves later queue items running as that customer."
  },
  {
    id: "l5-drupal11-recipes-vs-features-config-sync",
    category: "Drupal concepts",
    tags: ["Config", "Drupal 11"],
    difficulty: 5,
    question: "How do Drupal Recipes (Drupal 10.3 and Drupal 11) differ philosophically from the old Features module or ongoing module-managed config?",
    hint: "Ask who owns the configuration on your site the day *after* you apply a Recipe.",
    answers: [
      { text: "A Recipe applies once and steps aside; your site owns and edits the config afterward.", correct: true },
      { text: "A Recipe stays active and reverts any local site-builder edits on every deploy.", correct: false },
      { text: "Recipes replace Drupal's config sync folder so sites no longer export YAML to Git.", correct: false }
    ],
    explanationShort: "Recipes are one-shot starting points: once applied, the resulting configuration belongs completely to your site's own config sync with no ongoing coupling to the recipe.",
    explanationLong: "Traditional module-bundled config or Features-style workflows created constant tension: if a site builder customized a View or content type locally, updating the upstream feature risked reverting or conflicting with local edits. Recipes are applied once via config actions and then get out of the way—your site exports and maintains the resulting YAML in Git as its own configuration, free to evolve without fighting the original recipe."
  },

  // =========================================================================
  // DvO (Drupal voor Overheden) — LEVEL 1: What the concept is for (13 cards)
  // =========================================================================
  {
    id: "dvo-l1-platform-multi-repo-split",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform"],
    difficulty: 1,
    question: "How is code split between the root DvO repository and the folders inside projects/?",
    hint: "Contrast shared platform packages used by dozens of municipalities with one municipality's own site.",
    answers: [
      { text: "The root repo holds shared packages; each folder in projects/ is its own Git repo.", correct: true },
      { text: "One single Git repository tracks both the shared packages and every municipality site.", correct: false },
      { text: "Each project repo holds a full copy of shared modules with no separate root repo.", correct: false },
      { text: "The root repo holds live municipality content, while projects/ holds only themes.", correct: false }
    ],
    explanationShort: "DvO uses a nested multi-repository setup: shared packages live in the root Git repo, while every municipality under projects/ has its own standalone Git repository.",
    explanationLong: "In the DvO workspace, composer-packages/ (such as dvg, io_dvg, and toptasks_base_theme) and platform scripts belong to the root repository. Every directory under projects/<name> has its own .git folder, history, branches, and remote, and is ignored by the root repository's .gitignore so shared platform releases and tenant-specific changes stay cleanly separated."
  },
  {
    id: "dvo-l1-platform-package-symlinks",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 1,
    question: "True or false: Editing a file via a project's symlinked dvg-composer-packages/ or contrib theme path modifies the shared root repository rather than only that project.",
    hint: "Follow where the symlink actually points on disk.",
    answers: [
      { text: "True: the symlink points into composer-packages/ in the shared root repository.", correct: true },
      { text: "False: DDEV copies symlinked packages per project so edits stay isolated locally.", correct: false }
    ],
    explanationShort: "Project checkouts symlink shared packages back to composer-packages/ in the root repo, so edits through those paths touch every municipality.",
    explanationLong: "During local setup, a municipality project links shared packages (such as htdocs/themes/contrib/toptasks_base_theme or dvg-composer-packages/dvg) directly to composer-packages/ in the workspace root. Editing through that path changes the shared package in the root Git repository—never an isolated copy for just one customer."
  },
  {
    id: "dvo-l1-features-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Features", "Plugins"],
    difficulty: 1,
    question: "What problem does the DvO Features system (dvo_core_features) solve on the platform?",
    hint: "Think about optional capabilities in shared modules that only some municipalities want turned on.",
    answers: [
      { text: "It lets administrators toggle optional module functionality per site without uninstalling.", correct: true },
      { text: "It exports content types and views into reusable PHP modules, the way Drupal 7 Features did.", correct: false },
      { text: "It grants editors temporary elevated permissions without changing their user roles.", correct: false },
      { text: "It compiles SCSS and JavaScript bundles conditionally for each municipality theme.", correct: false }
    ],
    explanationShort: "DvO Features provides DvoFeature plugins that let sites switch optional platform capabilities on or off at /admin/dvg/advanced/features.",
    explanationLong: "Because most DvO modules are installed across all municipalities via the shared profile, uninstalling a module per customer is often impractical. Registering a #[DvoFeature] plugin and checking DvoFeatureHelper::isFeatureEnabled() lets shared code ship optional functionality safely disabled by default and toggled per site."
  },
  {
    id: "dvo-l1-dvg-settings-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvgSettings", "Plugins"],
    difficulty: 1,
    question: "What is the purpose of the DvgSettings plugin system in dvg_core?",
    hint: "Think about where site administrators go to configure DvO modules instead of hunting across /admin/config.",
    answers: [
      { text: "Group module settings forms into categorized tabs under /admin/dvg.", correct: true },
      { text: "Store secret API credentials outside the database so they never appear in YAML files.", correct: false },
      { text: "Synchronize environment variables automatically between DDEV and production servers.", correct: false }
    ],
    explanationShort: "DvgSettings centralizes administrator-facing module configuration forms under categorized tabs in the /admin/dvg section (general, advanced, and external services).",
    explanationLong: "Instead of scattering custom configuration routes across disparate parts of the Drupal admin menu, DvO modules define DvgSettings plugins assigned to a DvgSettingsCategory. Administrators get one predictable settings hub, and modules can optionally tie form access to a DvO Feature or expose settings per subsite."
  },
  {
    id: "dvo-l1-subsites-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Entities"],
    difficulty: 1,
    question: "When is DvG Subsite (dvg_subsite) the right tool on a municipality platform?",
    hint: "Think about a district, department, or themed portal hosted inside one municipality's Drupal site.",
    answers: [
      { text: "When one municipality hosts distinct sections with their own navigation and branding.", correct: true },
      { text: "Whenever onboarding a completely separate municipality onto the DvO monorepo.", correct: false },
      { text: "When staging content changes for editors to preview before publishing them to the live site.", correct: false }
    ],
    explanationShort: "DvG Subsite models distinct sections—such as districts, departments, or intranets—inside one municipality's Drupal installation.",
    explanationLong: "A subsite is a content entity within a single Drupal database that scopes content, menus, search, theme choice, and configuration overrides to a logical section of one municipality. Completely separate municipalities never share a subsite installation; each gets its own project repository under projects/."
  },
  {
    id: "dvo-l1-themes-standard-layers",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes"],
    difficulty: 1,
    question: "How are themes typically layered from shared root to active site theme on a standard Toptasks project?",
    hint: "Trace the chain from the shared composer package down to the theme assigned to a site or subsite.",
    answers: [
      { text: "Shared toptasks_base_theme -> project sub-base theme -> site or subsite sub-theme.", correct: true },
      { text: "Drupal Claro -> project sub-theme -> shared toptasks_base_theme at the leaf level.", correct: false },
      { text: "Every site copies toptasks_base_theme directly with no intermediate project theme.", correct: false }
    ],
    explanationShort: "Most projects inherit from shared toptasks_base_theme into a project sub-base theme, with leaf sub-themes below it for individual sites or subsites.",
    explanationLong: "The shared composer-packages/toptasks_base_theme sits at the root for Toptasks projects. Above it, a project usually defines toptasks_sub_base_theme (and sometimes a subsites base layer), while individual sites and subsites use leaf toptasks_sub_theme* themes—unless a project builds on its own standalone SDC design-system base theme."
  },
  {
    id: "dvo-l1-dds-design-agnostic-layer",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 1,
    question: "What role do dds-* CSS classes and --dds-* custom properties play in the DvO Design System (DDS)?",
    hint: "Consider how one shared paragraph grid module can work across municipalities with different design systems.",
    answers: [
      { text: "They give shared modules a design-agnostic layer that themes bind to local tokens.", correct: true },
      { text: "They lock every municipality into identical colors and fonts with no theme overrides.", correct: false },
      { text: "They compile Twig templates into React components inside the browser at runtime.", correct: false }
    ],
    explanationShort: "DDS decouples module markup and layout rules from any single municipality's brand by exposing dds-* classes and --dds-* CSS custom properties.",
    explanationLong: "Modules like dvo_dds emit clean dds-* classes and style them through --dds-* custom properties backed by sensible fallback defaults. A municipality theme—or a future shared DDS/SDC base theme—can map those --dds-* properties to its own NL Design System tokens or replace templates with Single-Directory Components without changing module PHP."
  },
  {
    id: "dvo-l1-config-dvg-basic-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Config"],
    difficulty: 1,
    question: "What is the job of the dvg_basic Config Split in dvg_config_basic?",
    hint: "Think about content types, fields, and workflows that must stay uniform across every municipality.",
    answers: [
      { text: "Ship authoritative platform configuration that stays identical across all projects.", correct: true },
      { text: "Store local DDEV developer overrides that are never committed to any Git repository.", correct: false },
      { text: "Export sample nodes and media items so fresh environments start with demo content.", correct: false }
    ],
    explanationShort: "The dvg_basic split owns shared framework configuration—such as bundles, fields, and workflows—that every DvO site receives identically.",
    explanationLong: "Platform-wide configuration listed in dvg_basic's complete_list lives in composer-packages/dvg/modules/dvg_config_basic/config/dvg_basic. On drush cim, that shared folder is authoritative so core platform structures stay aligned across tenants without each project maintaining diverging copies."
  },
  {
    id: "dvo-l1-push-framework-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Queues"],
    difficulty: 1,
    question: "When should a DvO integration be built on the DvO Push framework (dvo_push)?",
    hint: "Think about sending submitted data to a municipal backoffice or CRM that might briefly go offline.",
    answers: [
      { text: "When sending data asynchronously to external APIs with retries and status tracking.", correct: true },
      { text: "When importing articles from an external knowledge base into Drupal as content nodes.", correct: false },
      { text: "When fetching a live API response needed inline before rendering the current page.", correct: false }
    ],
    explanationShort: "DvO Push handles reliable, asynchronous outbound delivery to external systems with queuing, exponential backoff retries, and admin status visibility.",
    explanationLong: "Municipal backoffice APIs and CRMs can experience downtime or slow responses. dvo_push queues outbound payloads, retries failures with exponential backoff, and gives administrators an overview of pending, sent, and failed items. Inbound syncing belongs in content/event import frameworks, and immediate request-time reads cannot be queued."
  },
  {
    id: "dvo-l1-impact-script-purpose",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 1,
    question: "What question does running npm run impact from the DvO workspace root answer before you finish a task?",
    hint: "Remember that shared modules, base themes, and symlinks can affect far more sites than the one you tested.",
    answers: [
      { text: "Which projects, theme overrides, and CSS rules are affected by your current changes.", correct: true },
      { text: "How many milliseconds your code adds to Time to First Byte on the production servers.", correct: false },
      { text: "Which Composer dependencies have pending security advisories on drupal.org.", correct: false }
    ],
    explanationShort: "npm run impact traces changed modules, symlinked files, template overrides, Sass imports, and CSS specificity shifts across every project.",
    explanationLong: "Because shared code in composer-packages/ reaches dozens of municipalities through module dependencies and theme inheritance chains, guessing the blast radius by eye is error-prone. npm run impact resolves symlinks and inspects project repos to report affected sites, overridden templates, imported partials, and selector specificity changes."
  },
  {
    id: "dvo-l1-io-dvg-package-role",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 1,
    question: "Why does composer-packages/io_dvg exist separately from composer-packages/dvg?",
    hint: "Compare generic distribution modules with hosting glue or rollout hooks that name a specific project.",
    answers: [
      { text: "It holds hosting glue and rare customer-specific logic that must live in shared code.", correct: true },
      { text: "It stores experimental contrib modules before they pass automated PHPStan checks.", correct: false },
      { text: "It provides the frontend Storybook runner used to compile Single-Directory Components.", correct: false }
    ],
    explanationShort: "composer-packages/dvg must remain strictly customer-agnostic, whereas io_dvg is the designated shared package where environment glue and targeted rollout hooks may reference a project.",
    explanationLong: "Generic packages like dvg and toptasks_base_theme must never know about individual municipalities. When shared infrastructure settings or an update hook synchronized with a dvg release genuinely must target a named project (via $_io_dvg_current_project), that code lives in composer-packages/io_dvg."
  },
  {
    id: "dvo-l1-dds-ownership-split",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Config", "Themes"],
    difficulty: 1,
    question: "In the DDS architecture, what is the primary runtime job of the dvo_dds module versus a project or base theme?",
    hint: "Separate default token-driven grid/component markup from brand-specific design-system bindings.",
    answers: [
      { text: "dvo_dds ships grid logic, templates, and --dds-* defaults; themes bridge or override them.", correct: true },
      { text: "dvo_dds stores paragraph field YAML; themes run all PHP preprocess and layout logic.", correct: false },
      { text: "dvo_dds compiles Sass for legacy sites, while themes handle access checks on grid paragraphs.", correct: false }
    ],
    explanationShort: "dvo_dds owns runtime grid rendering, preprocess services, and working --dds-* CSS defaults, while themes bind tokens to their design system or swap templates with SDCs.",
    explanationLong: "DDS splits ownership cleanly across four layers: dvg_config_basic owns paragraph and field config, dvg_paragraphs owns editor form UX, dvo_dds owns runtime templates, services, and consumer CSS using --dds-* defaults, and the theme layer maps those tokens (or overrides templates with SDCs) for its design system."
  },
  {
    id: "dvo-l1-sdc-component-anatomy",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "Render API"],
    difficulty: 1,
    question: "In DvO's modern NL Design System / SDC theme architecture, what lives together inside each directory under components/?",
    hint: "Contrast Drupal core Single-Directory Components with scattering metadata, Twig, and styles across separate trees.",
    answers: [
      { text: "A .component.yml schema for props and slots, a .twig template, and optional .css/.js.", correct: true },
      { text: "A Drupal block plugin PHP class, a database schema install file, and a route YAML file.", correct: false },
      { text: "A Pattern Lab JSON data file, a global SCSS mixin bundle, and an exported View YAML.", correct: false }
    ],
    explanationShort: "Each Single-Directory Component co-locates its .component.yml prop/slot schema, Twig template, and auto-attached component assets in one folder.",
    explanationLong: "Legacy Toptasks themes used Emulsify and Pattern Lab folders (@atoms, @molecules, @organisms) compiled into one global stylesheet. Modern NL Design System themes in DvO use Drupal Single-Directory Components where {name}.component.yml validates props and slots via JSON Schema alongside {name}.twig and co-located CSS."
  },

  // =========================================================================
  // DvO (Drupal voor Overheden) — LEVEL 2: Why this approach exists (13 cards)
  // =========================================================================
  {
    id: "dvo-l2-platform-two-repo-commits",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 2,
    question: "Why does a task that edits both composer-packages/dvg and projects/<name> require two separate Git commits and Merge Requests?",
    hint: "Check what git status at the workspace root sees when projects/ is listed in .gitignore.",
    answers: [
      { text: "projects/ is gitignored at the root because each project has its own .git repository.", correct: true },
      { text: "GitLab blocks any single Merge Request that modifies both PHP and Twig files together.", correct: false },
      { text: "Composer wipes uncommitted files in projects/ whenever a root branch is pushed.", correct: false }
    ],
    explanationShort: "Because projects/ is gitignored by the root repo and each municipality folder has its own .git history, root and project changes live in separate Git repositories.",
    explanationLong: "Running git status or git commit at the workspace root only sees shared platform files; changes inside projects/<name> belong to that municipality's nested Git repository. Whenever work spans shared code (like dvo_dds) and a tenant's theme or config, each part must be committed, reviewed, and merged in its respective repository."
  },
  {
    id: "dvo-l2-features-off-by-default",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Features", "DvO Best practices"],
    difficulty: 2,
    question: "Why must new optional functionality in composer-packages/dvg ship behind a DvO Feature that defaults to off?",
    hint: "Remember that most dvg modules are already enabled across dozens of live municipality websites.",
    answers: [
      { text: "Shared dvg updates go to every site, so existing sites keep current behavior until opted in.", correct: true },
      { text: "Drupal refuses to import configuration splits whenever a newly added plugin defaults to enabled.", correct: false },
      { text: "PHPStan fails static analysis if a module registers routes without a feature attribute.", correct: false }
    ],
    explanationShort: "Defaulting new features to off lets all municipalities safely receive shared package updates without unexpected UX, content, or route changes.",
    explanationLong: "Bugfixes, security fixes, and accessibility fixes belong on every site immediately, so they ship without a toggle. Optional new product capabilities, however, must not surprise dozens of live municipalities on their next update—gating them behind a disabled-by-default DvoFeature keeps existing behavior intact until a site opts in."
  },
  {
    id: "dvo-l2-dvg-settings-feature-key",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvgSettings", "DvO Features"],
    difficulty: 2,
    question: "Why do DvgSettings plugins support a 'feature' key in their definition?",
    hint: "Imagine what an admin sees under /admin/dvg when thirty optional modules are installed in code.",
    answers: [
      { text: "So a module's settings form stays hidden and inaccessible while its DvO Feature is off.", correct: true },
      { text: "So saving the settings form automatically enables the feature on every subsite.", correct: false },
      { text: "So configuration values are stored inside dvo_core_features.settings instead of their own file.", correct: false }
    ],
    explanationShort: "Linking a DvgSettings plugin to a feature ID hides and blocks its configuration page whenever that DvO Feature is disabled on the site.",
    explanationLong: "When a feature is off for a municipality, nothing from that feature should leak into the admin UI—including dead settings forms for inactive functionality. Setting feature = 'my_module' on the DvgSettings plugin keeps its own configName intact while automatically gating access to the settings page on DvoFeatureHelper."
  },
  {
    id: "dvo-l2-config-exclusions-why",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Config"],
    difficulty: 2,
    question: "Why did DvO introduce the dvg_basic_exclusions side split alongside the main dvg_basic Config Split?",
    hint: "What happens on drush cim if a project tries to customize a config file that sits in dvg_basic's complete_list?",
    answers: [
      { text: "dvg_basic overwrites its listed configs on import, so exclusions let tenants override chosen items.", correct: true },
      { text: "dvg_basic_exclusions strips dev-only modules like Devel out of production exports.", correct: false },
      { text: "Config Split cannot export any file larger than 64 KB without splitting it into two separate folders.", correct: false }
    ],
    explanationShort: "Because dvg_basic is authoritative for everything in its complete_list, dvg_basic_exclusions intercepts tunable config names so per-site overrides in the project repo survive drush cim.",
    explanationLong: "Any config in dvg_basic's complete_list ignores edits placed in a project's normal sync folder. Yet some configs (like dvo_core_features.settings or display profiles) need both a shared platform default on install and version-controlled per-site overrides. Because Config Split lacks native per-split exclusions, dvg_basic_exclusions captures those names into projects/<project>/sync/<site>/dvg_exclusions."
  },
  {
    id: "dvo-l2-dds-spotlight-global-vs-on-demand",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Render API"],
    difficulty: 2,
    question: "In dvo_dds, most component CSS libraries attach on demand when their paragraph renders. Why is dvo_dds/spotlight attached globally when the DDS feature is on?",
    hint: "Check where spotlight backgrounds and inverse/contrast classes appear besides dds_grid_row paragraphs.",
    answers: [
      { text: "Spotlights are also used outside grid rows, such as in the page footer and WYSIWYG blocks.", correct: true },
      { text: "CSS custom properties inside spotlight.css fail to parse unless they are loaded in the HTML <head>.", correct: false },
      { text: "Drupal's BigPipe drops any CSS library attached inside a paragraph preprocess hook.", correct: false }
    ],
    explanationShort: "Spotlight backgrounds and inverse/contrast rules apply to page-level regions like the footer as well as grid rows, whereas accordion or gallery CSS is only needed when that component appears.",
    explanationLong: "Attaching accordion, gallery, media, or map CSS on demand avoids shipping unused styles on pages that never render those paragraphs (and BigPipe/render caching bubbles attached libraries fine). Spotlight classes and color modes, however, are shared by template regions like the site footer and companion modules, so dvo_dds attaches spotlight globally whenever DDS is enabled."
  },
  {
    id: "dvo-l2-themes-directory-scope",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DvO Platform"],
    difficulty: 2,
    question: "On a multisite DvO project, what is the practical difference between placing a custom theme in htdocs/themes/custom versus htdocs/sites/<site>/themes/custom?",
    hint: "Think about how Drupal discovers extensions across multisite directories inside one project repository.",
    answers: [
      { text: "htdocs/themes/custom is visible to every site in the project; sites/<site>/ scopes it to one.", correct: true },
      { text: "Drupal 11 ignores sites/<site>/themes/custom entirely unless multisite legacy mode is turned on.", correct: false },
      { text: "Themes in htdocs/themes/custom are shared across every municipality in the root repo.", correct: false }
    ],
    explanationShort: "A theme under projects/<name>/htdocs/themes/custom can be enabled by every multisite instance in that project, whereas sites/<site>/themes/custom restricts it to that single site.",
    explanationLong: "Both paths live inside one municipality's project repo (neither leaks to other municipalities). Within a multisite project, htdocs/themes/custom makes a shared sub-base theme available to every site in that repo, while htdocs/sites/<site>/themes/custom isolates a theme meant strictly for one Drupal site directory."
  },
  {
    id: "dvo-l2-patches-dvo-patch-scheme",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 2,
    question: "Why do shared packages like dvg/dvg reference local patch files via dvo-patch:// URLs instead of relative filesystem paths?",
    hint: "Compare where Composer runs in the root test-project versus inside projects/<project>.",
    answers: [
      { text: "Composer resolves relative paths from the root it runs in, whose depth differs per project.", correct: true },
      { text: "Composer blocks relative file paths over HTTPS for security reasons unless a custom scheme is used.", correct: false },
      { text: "GitLab CI strips .patch files from vendor directories unless fetched through dvo-patch://.", correct: false }
    ],
    explanationShort: "dvo-patch:// resolves patch files through Composer's installation manager by package name, keeping URLs and patches.lock.json hashes identical regardless of directory depth.",
    explanationLong: "cweagans/composer-patches resolves relative paths against the working directory where Composer runs—which sits at a different depth in drupal-voor-gemeenten (test-project/htdocs/...) than in projects/<project> (htdocs/...). The iodigital-com/dvo-patches plugin translates dvo-patch://<package>/<path> via Composer's installation manager so one portable URL works everywhere."
  },
  {
    id: "dvo-l2-subsites-block-per-theme",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Themes", "Config"],
    difficulty: 2,
    question: "Why must a subsite's custom theme have its own block placement configs (for example, for subsite search navigation) even when toptasks_base_theme already places those blocks?",
    hint: "Ask how Drupal's Block module ties block placement entities to the active theme.",
    answers: [
      { text: "Block placements in Drupal are stored per theme and are not inherited at runtime from base themes.", correct: true },
      { text: "dvg_subsite disables all of the base-theme regions whenever a visitor enters a path-prefixed subsite.", correct: false },
      { text: "Config Split deletes base-theme block YAML whenever a subsite entity is created by an editor.", correct: false }
    ],
    explanationShort: "Drupal evaluates block placements strictly for the active theme rendering the page, so placements configured on a base theme do not automatically appear on a subsite's sub-theme.",
    explanationLong: "Templates, libraries, and preprocess hooks inherit along the base theme chain, but block.block.* config entities belong to one specific theme machine name. When a subsite uses its own sub-theme, required DvO blocks (like search_addition_results_navigation, menus, and branding) must be placed for that sub-theme."
  },
  {
    id: "dvo-l2-sdc-isolated-twig-context",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "Render API"],
    difficulty: 2,
    question: "Why do the conventions for DvO's SDC base themes (such as amsterdam_base_theme) require with_context = false on Twig include() calls and 'only' on {% embed %} tags?",
    hint: "Think about what happens when an SDC accidentally relies on an ambient variable from node or page preprocess.",
    answers: [
      { text: "To prevent ambient template variables from leaking in, keeping component inputs explicit.", correct: true },
      { text: "Because Drupal's SDC loader throws a fatal error whenever any ambient Twig context is passed.", correct: false },
      { text: "To stop Drupal's render cache from bubbling cache tags out of child SDC templates.", correct: false }
    ],
    explanationShort: "Blocking ambient Twig context forces every SDC to receive data solely through its declared props and slots, keeping components predictable in Drupal and Storybook alike.",
    explanationLong: "Without with_context = false or only, Twig passes every variable from the calling template into the child component. A component can then silently depend on a variable that happens to exist on a node page, only to break in Views, blocks, or Storybook. Isolating context guarantees the .component.yml contract is complete—while render arrays passed as props or slots still bubble cache metadata normally."
  },
  {
    id: "dvo-l2-adrs-no-code-backlinks",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 2,
    question: "Why does DvO's ADR policy forbid putting 'ADR-NNNN' references inside PHP comments, docblocks, or log messages?",
    hint: "Compare linking from a timestamped decision record to code versus linking from living code back to an ADR.",
    answers: [
      { text: "Code comments should explain 'why' directly; code-to-ADR pointers silently rot when superseded.", correct: true },
      { text: "PHPCS treats uppercase ADR identifiers in docblocks as invalid Drupal @see annotations.", correct: false },
      { text: "ADR numbers reset per feature folder, so ADR-0015 is ambiguous outside docs/adrs/.", correct: false }
    ],
    explanationShort: "Comments in code must explain the reasoning in place so readers don't chase external docs whose decisions may later be superseded.",
    explanationLong: "ADR numbers are globally unique and stable, and ADRs link forward to the classes and hooks they affect. The reverse link—scattering 'see ADR-0031' in PHP—forces maintainers out of the code and rots silently when a later ADR supersedes the original decision. Prose docs, specs, and MR descriptions may cross-link ADRs freely."
  },
  {
    id: "dvo-l2-workflow-merge-not-rebase",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 2,
    question: "When updating a feature branch with recent changes on main in DvO's GitLab Flow, why do the development agreements specify merging main rather than rebasing?",
    hint: "Think about shared review history and conflict resolution on open GitLab Merge Requests.",
    answers: [
      { text: "Merging main preserves commit history and keeps Merge Request review diffs traceable.", correct: true },
      { text: "GitLab branch pipelines skip PHPStan and PHPCS checks whenever a branch is force-pushed.", correct: false },
      { text: "Composer's patches.lock.json file becomes corrupted whenever Git replays commits in a rebase.", correct: false }
    ],
    explanationShort: "Pulling and merging origin/main into your feature branch keeps commit SHAs intact and makes conflict resolution auditable in GitLab's Merge Request view.",
    explanationLong: "In DvO's GitLab Flow, main is the single source of truth. Running git pull origin main merges upstream changes without rewriting pushed commits, preserving reviewer context on open Merge Requests and avoiding force-push hazards across collaborating developers and agents."
  },
  {
    id: "dvo-l2-import-locked-fields",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Entities", "Forms"],
    difficulty: 2,
    question: "Why does dvo_content_import lock externally imported fields on destination nodes against manual edits in the Drupal form?",
    hint: "Ask what happens to an editor's manual wording tweak the next time the external source syncs.",
    answers: [
      { text: "External syncs overwrite mapped fields, so locking prevents edits that would vanish later.", correct: true },
      { text: "Drupal's Entity API cannot save a node revision if both cron and editors touch the same bundle.", correct: false },
      { text: "Locked fields bypass Search API indexing so external content stays out of site search.", correct: false }
    ],
    explanationShort: "Locking source-owned fields makes ownership clear to editors and prevents wasted manual edits that the next scheduled import would silently overwrite.",
    explanationLong: "When a node's body or metadata is synchronized from an upstream source like Salesforce Knowledge, that external system remains the source of truth for its mapped fields. Leaving those inputs editable sets a trap for content editors whose changes disappear on the next import run, while locally owned fields on the same node stay editable."
  },
  {
    id: "dvo-l2-dds-ckeditor-dual-selectors",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 2,
    question: "Why do DDS rich-text CSS bridges pair classes like .dds-heading--2 with .ck.ck-content h2 and load via ckeditor5-stylesheets?",
    hint: "Compare the HTML stored while an editor types in CKEditor 5 with the HTML after Drupal runs text filters on view.",
    answers: [
      { text: "CKEditor holds bare HTML before output filters add .dds-* classes, and skips the global library.", correct: true },
      { text: "CKEditor 5 runs inside a cross-origin iframe that strips every class starting with dds-.", correct: false },
      { text: "Drupal's admin theme automatically converts all .dds-* rules into .ck-content rules at build time.", correct: false }
    ],
    explanationShort: "Because dvo_dds adds .dds-* classes only when rendering filtered output and CKEditor 5 does not load the front-end global library, editor styles need ckeditor5-stylesheets and .ck.ck-content selectors.",
    explanationLong: "Inside CKEditor 5, editors work on plain elements (<h2>, <p>, <ul>) without the .dds-* classes that the output filter injects on the published page, and Drupal only loads stylesheets listed under ckeditor5-stylesheets in the default front-end theme's .info.yml. Pairing both selectors keeps WYSIWYG editing faithful to the published result."
  },

  // =========================================================================
  // DvO (Drupal voor Overheden) — LEVEL 3: Which nearby idea it is not (13 cards)
  // =========================================================================
  {
    id: "dvo-l3-features-vs-settings-vs-subsites",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Features", "DvgSettings", "Subsites"],
    difficulty: 3,
    question: "A new module in dvg needs an optional site-wide capability plus an API timeout value that each subsite may tune differently. How should those two concerns be modeled?",
    hint: "Separate gating the capability itself from exposing a configurable value across subsites.",
    answers: [
      { text: "Gate the capability with a DvoFeature; expose the timeout via DvgSettings + dvg_subsite_settings.", correct: true },
      { text: "Create one DvoFeature per subsite and hardcode the default API timeout in settings.php.", correct: false },
      { text: "Use Drupal permissions for the site toggle and State API for the per-subsite API timeout.", correct: false }
    ],
    explanationShort: "DvO Features toggles optional site capabilities, while DvgSettings (opted into dvg_subsite_settings) handles admin-tunable values that can also vary per subsite.",
    explanationLong: "Each DvO subsystem has a distinct boundary: DvoFeature turns optional functionality on or off per site; DvgSettings provides the admin form (with feature = '...' so it hides when the feature is off); and implementing the dvg_subsite_settings alter hooks lets subsites store per-subsite config overrides via dvg_subsite_config."
  },
  {
    id: "dvo-l3-config-three-buckets",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Config"],
    difficulty: 3,
    question: "When adding configuration in DvO, how do you choose between dvg_basic only, dvg_basic_exclusions, and a project's normal sync directory?",
    hint: "Ask two questions: does every site need a shared platform default, and may individual sites customize it?",
    answers: [
      { text: "Uniform platform config -> dvg_basic; shared default + site override -> exclusions; tenant-only -> sync.", correct: true },
      { text: "Content entities -> dvg_basic; config entities -> exclusions; simple settings -> project sync.", correct: false },
      { text: "Base theme settings -> dvg_basic; module settings -> exclusions; Views -> project sync.", correct: false }
    ],
    explanationShort: "Use dvg_basic when config never varies per site, dvg_basic_exclusions when sites need a shared default they may override in Git, and normal project sync when config is tenant-owned from the start.",
    explanationLong: "Putting tenant-only config into dvg_basic forces it onto every municipality, while putting uniform platform config into dvg_basic_exclusions creates unnecessary maintenance across dozens of project repos. Reserve dvg_basic_exclusions specifically for configs that require both a shared default on install and versioned per-site overrides."
  },
  {
    id: "dvo-l3-subsite-theme-content-vs-config",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Themes", "Config"],
    difficulty: 3,
    question: "How does choosing the theme for the main site differ from choosing the theme for a DvG Subsite?",
    hint: "Compare system.theme.yml in config sync with where a subsite entity lives.",
    answers: [
      { text: "The main site's default theme lives in config; a subsite's chosen theme is stored on content.", correct: true },
      { text: "Both choices live in system.theme.yml under separate multisite keys exported to Git.", correct: false },
      { text: "Subsites cannot choose an installed theme and can only swap a few CSS variables via DvgSettings.", correct: false }
    ],
    explanationShort: "sync/<site>/.../system.theme.yml sets the site's default theme in config, whereas a subsite entity stores its selected theme as content in the database.",
    explanationLong: "A subsite is a content entity created at /admin/content/subsite, so its theme selection lives in the database rather than YAML config—even though the theme's files and block placements are deployed in code and config. That is also why inspecting npm run themes -- <project> or subsite theme labels is essential before editing a theme."
  },
  {
    id: "dvo-l3-dds-token-bridge-vs-class-bridge-vs-sdc",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 3,
    question: "When theming DDS output onto a design system, how do a token bridge, a class bridge, and an SDC template override differ?",
    hint: "Ask whether the module already ships CSS rules using --dds-* variables, ships only .dds-* class names, or needs different HTML.",
    answers: [
      { text: "Token bridges map --dds-* vars; class bridges style bare .dds-* classes; SDC overrides replace HTML.", correct: true },
      { text: "Token bridges run in PHP preprocess; class bridges run in Twig; SDC overrides run in client JavaScript.", correct: false },
      { text: "Token bridges are for Toptasks only; class bridges are for CKEditor only; SDCs replace dvo_dds.", correct: false }
    ],
    explanationShort: "Use a :root token bridge when dvo_dds ships CSS reading --dds-* properties, a class bridge when markup emits .dds-* classes without module CSS, and an SDC override when the design system owns different markup.",
    explanationLong: "DDS minimizes template duplication by grading customization into three steps: if dvo_dds's HTML and layout CSS already match, a :root file mapping --dds-* to design-system tokens is enough (and is the only option for JS-rendered widgets like cookiesjsr). When a filter or template outputs .dds-* classes with no stylesheet (like rich text or mega menu), a class bridge binds those selectors to tokens. Only when a component needs design-system-specific DOM do you override the Twig template with SDCs."
  },
  {
    id: "dvo-l3-customer-code-placement",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Best practices"],
    difficulty: 3,
    question: "One municipality requests a behavior tweak. How do you decide whether the code belongs in composer-packages/dvg, composer-packages/io_dvg, or projects/<name>?",
    hint: "Distinguish reusable opt-in platform features, release-coupled customer hooks, and purely local project work.",
    answers: [
      { text: "Reusable opt-in -> dvg; release-coupled customer hook -> io_dvg; standalone customer code -> project.", correct: true },
      { text: "Backend PHP -> dvg; frontend Twig/CSS -> projects/<name>; automated tests -> io_dvg.", correct: false },
      { text: "Anything requested on a customer Jira ticket always goes exclusively in projects/<name>.", correct: false }
    ],
    explanationShort: "Generic opt-in capabilities belong in dvg, standalone single-tenant customizations belong in projects/<name>, and customer-targeted hooks coupled to a dvg release belong in io_dvg.",
    explanationLong: "A customer ticket ID does not automatically mean project-only code: if other municipalities could benefit, build a generic, customer-agnostic option in dvg or toptasks_base_theme (off by default). If it is truly unique to one customer and independent of a new dvg release, keep it in projects/<name>. Only when customer-specific logic (like an update hook guarded by $_io_dvg_current_project) must roll out simultaneously with new dvg code does it go in io_dvg."
  },
  {
    id: "dvo-l3-dds-gallery-vs-lightbox-split",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 3,
    question: "Why does dvo_dds split its gallery assets into two separate libraries (dvo_dds/gallery and dvo_dds/gallery_lightbox) instead of bundling them as one?",
    hint: "Consider a theme that keeps DDS's 1/2/3-column square thumbnail grid but brings its own Dialog and Image Slider SDCs.",
    answers: [
      { text: "So a theme overriding the template with its own slider/dialog can still reuse the grid CSS alone.", correct: true },
      { text: "Because Drupal core forbids a single asset library from declaring both CSS files and JavaScript files.", correct: false },
      { text: "So anonymous visitors get only the static grid while logged-in editors get the lightbox.", correct: false }
    ],
    explanationShort: "Keeping dvo_dds/gallery purely for the square thumbnail grid lets SDC themes attach that layout without loading duplicate slider and dialog CSS/JS from gallery_lightbox.",
    explanationLong: "NL Design System themes often ship official Image Slider and Modal Dialog SDCs, yet ship no multi-column square gallery grid. Because dvo_dds separates gallery (the 1/2/3-column grid) from gallery_lightbox (the module's own dialog + slider wiring), an overridden paragraph template can attach dvo_dds/gallery for the grid and compose its own SDCs cleanly."
  },
  {
    id: "dvo-l3-dds-spotlight-three-modes",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 3,
    question: "How does DDS's --contrast spotlight mode differ from --inverse and from an unspotlighted grid row?",
    hint: "Think about WCAG contrast when interactive blue links sit on a tinted-but-light background versus a dark background or white.",
    answers: [
      { text: "Unspotlighted keeps defaults; --inverse turns all text light; --contrast darkens interactive elements.", correct: true },
      { text: "--contrast enables high-contrast OS mode globally, whereas --inverse swaps the left and right grid columns.", correct: false },
      { text: "Unspotlighted uses --contrast by default, while --inverse applies only to full-bleed hero images.", correct: false }
    ],
    explanationShort: "On a light colored spotlight (inverse: false), body text is already dark enough, so --contrast darkens interactive elements whose standard blue fails contrast against the tint.",
    explanationLong: "Every DDS row is in one of three states: no spotlight (standard colors on white, where interactive blue passes contrast), dds-spotlight--inverse (dark spotlight where all headings, prose, and links turn light), or dds-spotlight--contrast (light colored spotlight where prose stays dark and interactive links/controls shift to a dark contrast token)."
  },
  {
    id: "dvo-l3-themes-hidden-inheritance-paths",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DvO Best practices"],
    difficulty: 3,
    question: "True or false: Checking 'base theme' in *.info.yml is sufficient to find every theme affected when you change a Twig component or Sass partial.",
    hint: "Think about how @atoms/@other_theme Twig namespaces, Sass @import/@use paths, and library dependencies work.",
    answers: [
      { text: "False: themes also inherit via library dependencies, @theme Twig includes, and Sass imports.", correct: true },
      { text: "True: Drupal isolates Twig namespaces and asset libraries strictly along the base theme key.", correct: false }
    ],
    explanationShort: "Beyond the base theme key in .info.yml, themes can pull in another theme's libraries, Twig namespaces (@atoms, @other_theme/...), and Sass partials directly.",
    explanationLong: "In DvO projects, a theme can depend on another theme's asset library, include Twig files across namespaces, or compile Sass partials from a sibling or parent theme directory. That is why npm run impact and npm run themes inspect library dependencies, Twig includes, and Sass imports rather than only reading base theme keys."
  },
  {
    id: "dvo-l3-themes-edit-lowest-covering-layer",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "Subsites", "DvO Best practices"],
    difficulty: 3,
    question: "A project has toptasks_base_theme -> toptasks_sub_base_theme -> toptasks_sub_base_theme_subsites -> toptasks_sub_theme_parken. Where does a visual tweak meant only for the Parken subsite belong?",
    hint: "Apply the rule 'edit the lowest theme that covers every site or subsite the change is meant for.'",
    answers: [
      { text: "In toptasks_sub_theme_parken, so sibling subsites and the main site stay untouched.", correct: true },
      { text: "In toptasks_sub_base_theme_subsites, gated behind a URL path check in preprocess_page.", correct: false },
      { text: "In toptasks_sub_base_theme, because all custom project SCSS must compile in one bundle.", correct: false }
    ],
    explanationShort: "Always edit the lowest theme in the inheritance tree that covers every target site or subsite—for a single subsite, its own leaf sub-theme.",
    explanationLong: "Putting a single-subsite change into toptasks_sub_base_theme or toptasks_sub_base_theme_subsites silently alters every other subsite (and potentially the main site) inheriting from that layer. Running npm run themes -- <project> shows the full tree so you can target the exact leaf theme."
  },
  {
    id: "dvo-l3-cookies-toptasks-vs-dds-basetheme",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 3,
    question: "dvo_cookies ships token-driven CSS libraries (dds_banner and dds_docs). Why does toptasks_base_theme disable them via libraries-override while a DDS/SDC base theme keeps them enabled?",
    hint: "Remember that cookiesjsr renders the consent banner from JavaScript, and Toptasks predates DDS tokens.",
    answers: [
      { text: "Toptasks already styles cookiesjsr in legacy SCSS; a DDS theme bridges --dds-cookies-* tokens instead.", correct: true },
      { text: "SDC themes cannot use libraries-override in .info.yml, so they must load every module CSS file.", correct: false },
      { text: "dvo_cookies renders server-side SDCs on DDS themes but client-side JavaScript on Toptasks.", correct: false }
    ],
    explanationShort: "toptasks_base_theme predates DDS and has its own cookies-jsr-ui SCSS that would conflict, whereas a modern DDS theme keeps the module CSS and binds --dds-cookies-* to its design tokens.",
    explanationLong: "Because cookiesjsr builds the banner DOM in JavaScript, there is no Twig template or SDC to override on either theme. dvo_cookies therefore exposes --dds-cookies-* custom properties on .cookiesjsr-* selectors. Legacy toptasks_base_theme switches those libraries off to avoid clashing with its older SCSS; new DDS themes simply provide a token bridge."
  },
  {
    id: "dvo-l3-dds-views-gated-chassis",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes", "Render API"],
    difficulty: 3,
    question: "The shared all_content View is used across DvO sites both with and without the DDS feature enabled. How does dvo_dds style it as a DDS sub-grid without altering non-DDS sites?",
    hint: "Look at when dvo_dds registers its views-view*--all-content templates and why it creates a fresh Attribute object.",
    answers: [
      { text: "It gates those View templates on the DDS feature and omits legacy view--* list layout classes.", correct: true },
      { text: "It clones all_content into a separate all_content_dds View entity on every config import.", correct: false },
      { text: "It overrides Views CSS globally with !important rules whenever any dds_views paragraph exists.", correct: false }
    ],
    explanationShort: "dvo_dds registers its all_content View chassis templates only when the DDS feature is on, replacing legacy view--teaser__ul classes with dds-sub-grid markup.",
    explanationLong: "Projects without DDS rely on core/Toptasks View markup and classes like view--teaser__ul (which pre-DDS themes style with their own grid rules). Gating the views-view*--all-content templates on the DDS feature leaves non-DDS sites untouched, while starting a fresh attribute list on DDS sites prevents legacy theme grid rules from colliding with dds-sub-grid."
  },
  {
    id: "dvo-l3-subsite-resolvers-three-ways",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Routing"],
    difficulty: 3,
    question: "Which three signals can SubsiteContextManager use to determine the active subsite for an incoming Drupal request?",
    hint: "Think about how a visitor arrives at a subsite via URL prefix, custom hostname, or viewing a node directly.",
    answers: [
      { text: "First URL path segment, matching request domain, or the subsite field on the routed entity.", correct: true },
      { text: "Logged-in user's assigned subsite role, browser session cookie, or HTTP Referer header.", correct: false },
      { text: "Active theme name in system.theme.yml, language prefix, or Search API index ID.", correct: false }
    ],
    explanationShort: "SubsiteContextManager resolves the active subsite from a URL path prefix, a configured subsite domain, or the routed entity's subsite reference.",
    explanationLong: "A subsite may live at a path prefix (like /parken), on its own domain, or be inferred when viewing a node assigned to that subsite. User-assigned subsites control editorial permissions rather than visitor context, and theme/config overrides are consequences of resolving the active subsite—not inputs to it."
  },
  {
    id: "dvo-l3-push-vs-import-two-queues",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Queues"],
    difficulty: 3,
    question: "How does dvo_content_import's two-queue execution model differ from dvo_push's outbound queue?",
    hint: "Contrast discovering changed remote records and importing them into Drupal with delivering a submitted payload outward.",
    answers: [
      { text: "dvo_content_import splits listing remote IDs from processing items; dvo_push queues outbound sends.", correct: true },
      { text: "dvo_content_import runs synchronously during cron, whereas dvo_push is built on Drupal core Migrate.", correct: false },
      { text: "dvo_content_import pushes local node edits upstream, whereas dvo_push pulls remote webhooks.", correct: false }
    ],
    explanationShort: "dvo_content_import uses a produce queue followed by a process queue (deliberately not core Migrate) to pull external content in, while dvo_push delivers local events/submissions out with backoff.",
    explanationLong: "Per ADR-0003 and ADR-0007, DvO built dvo_content_import as a lightweight two-stage pipeline (the dvo_content_import.produce queue lists changed external items and enqueues individual dvo_content_import.process jobs) rather than using Drupal Migrate. Conversely, dvo_push handles outbound delivery from Drupal (like webform registrations to CRVS or backoffice APIs) with retry backoff."
  },

  // =========================================================================
  // DvO (Drupal voor Overheden) — LEVEL 4: What fails with the shortcut (13 cards)
  // =========================================================================
  {
    id: "dvo-l4-specificity-raising-without-where",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "DvO Best practices"],
    difficulty: 4,
    question: "What breaks across projects if you scope a rule in toptasks_base_theme or dvo_dds by writing .card:not(.card--compact) or .feature-x .teaser instead of wrapping the guard in :where()?",
    hint: "Remember how project theme stylesheets usually win over base-theme and module CSS.",
    answers: [
      { text: "Higher specificity silently beats single-class project overrides that relied on source order.", correct: true },
      { text: "Older browsers drop the entire stylesheet whenever :not() appears in a selector without :where().", correct: false },
      { text: "Drupal's CSS aggregator moves higher-specificity selectors ahead of base resets.", correct: false }
    ],
    explanationShort: "Project themes override base-theme and module CSS using equal-weight single-class selectors that win only by loading later; raising specificity silently breaks their overrides.",
    explanationLong: "Module CSS loads first, base-theme CSS second, and project sub-theme CSS last. Because downstream themes typically style .card or .teaser with a single class, adding a second class or :not() in shared CSS outranks every project's override. Wrapping guards in zero-specificity :where()—such as .card:where(:not(.card--compact))—scopes the rule without raising selector weight."
  },
  {
    id: "dvo-l4-specificity-lowering-trap",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DvO Best practices"],
    difficulty: 4,
    question: "You simplify an existing selector in toptasks_base_theme from .node--full .teaser to .teaser. Why is lowering selector specificity also risky across existing projects?",
    hint: "Think about dormant single-class rules in project themes that previously lost to .node--full .teaser.",
    answers: [
      { text: "Dormant project rules that used to lose to the heavier selector suddenly start winning.", correct: true },
      { text: "Sass compilation fails whenever a base-theme partial reduces the selector depth on a class.", correct: false },
      { text: "Drupal caches CSS selector weights in the database until the theme is reinstalled.", correct: false }
    ],
    explanationShort: "Lowering a shared selector's weight lets weaker project rules that previously had no visible effect suddenly win, causing unintended visual shifts.",
    explanationLong: "Specificity changes cut both ways in a multi-tenant base theme: raising weight overrides intentional project customizations, while lowering weight activates forgotten or broader project rules that used to lose to the base theme's two-class selector. npm run impact flags base-theme and module selectors whose specificity moved in either direction."
  },
  {
    id: "dvo-l4-feature-update-hook-without-exclusions-yaml",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Features", "Config", "Updates"],
    difficulty: 4,
    question: "A developer enables a DvO Feature in a database update hook for a customer, but does not update projects/<name>/sync/<site>/dvg_exclusions/dvo_core_features.settings.yml. What happens on deploy?",
    hint: "Trace the order of drush updb and drush cim in a standard deployment pipeline.",
    answers: [
      { text: "The next drush cim overwrites active config from the YAML file and turns the feature back off.", correct: true },
      { text: "Drupal refuses to run drush cim and aborts the pipeline with a ConfigImporterException.", correct: false },
      { text: "dvg_basic_exclusions automatically exports database changes back into Git during deploy.", correct: false }
    ],
    explanationShort: "Because dvo_core_features.settings is managed as whole-file config in dvg_exclusions, drush cim wipes out any update-hook change not also committed to that YAML file.",
    explanationLong: "Per-site feature state lives in projects/<name>/sync/<site>/dvg_exclusions/dvo_core_features.settings.yml. Unless an automated update pipeline immediately exports the database back to Git, running drush cim after drush updb imports the committed YAML over active config and silently disables the feature again."
  },
  {
    id: "dvo-l4-subsite-hardcoded-search-url",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Themes", "Caching"],
    difficulty: 4,
    question: "A custom theme template renders a search form with a hard-coded action='/search' instead of building the URL from a route and adding the 'subsite' cache context. What goes wrong?",
    hint: "Think about both where /subsite/ pages should submit searches and how Drupal caches the rendered block.",
    answers: [
      { text: "Visitors on path subsites get sent to main-site search, or share cached URLs across subsites.", correct: true },
      { text: "Symfony's router rejects GET forms whose action attribute lacks a CSRF token in the query string.", correct: false },
      { text: "Fast Autocomplete deletes its JSON index whenever a search request lacks a route token.", correct: false }
    ],
    explanationShort: "Hard-coding '/search' bypasses outbound subsite path processors (sending subsite visitors to the main site), and omitting the 'subsite' cache context leaks one cached URL across subsites.",
    explanationLong: "Outbound path processors only add a path subsite's prefix (like /parken/zoeken) when URLs are generated through Url::fromRoute() or internal: URIs. And because the generated URL varies depending on which subsite is active, any render array printing it must declare the 'subsite' cache context."
  },
  {
    id: "dvo-l4-dds-field-wrappers-reset",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes", "Render API"],
    difficulty: 4,
    question: "Why does dvo_dds replace Drupal core's default field.html.twig with field--dds-reset.html.twig on grid and cell fields—and why does toptasks_base_theme put field__text_long back on field_text?",
    hint: "Check how adjacent-sibling selectors like .dds-grid + .dds-grid work, and how Toptasks scopes CKEditor styles.",
    answers: [
      { text: "Core's wrapper divs break sibling grid CSS, while Toptasks scopes prose rules under .text-long.", correct: true },
      { text: "Core's field.html.twig strips paragraph cache tags, while Toptasks needs .text-long for its Views.", correct: false },
      { text: "CSS Grid ignores items inside div tags, while CKEditor 5 crashes without a .text-long wrapper.", correct: false }
    ],
    explanationShort: "Extra field <div> wrappers break adjacent-sibling spotlight/grid selectors and direct grid-cell children, whereas Toptasks still needs .text-long on field_text to scope its legacy WYSIWYG styles.",
    explanationLong: "Consecutive grid rows (.dds-grid) and page grids (.pt-grid) must be DOM siblings so selectors like .dds-grid.dds-spotlight + .dds-grid.dds-spotlight work, and components inside cells expect no stray field <div> in between. field--dds-reset outputs item.content bare. Because legacy toptasks_base_theme scopes rich-text headings and lists under .text-long, it restores field__text_long specifically on field_text while keeping the grid resets."
  },
  {
    id: "dvo-l4-dds-programmatic-paragraph-behaviors",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Entities", "DvO Best practices"],
    difficulty: 4,
    question: "When creating dds_grid_row paragraphs programmatically via Paragraph::create() in a script or migration, what happens if you leave the 'behaviors' field unset?",
    hint: "Compare what the paragraph edit form saves by default with what entity_type_behaviors runs when 'behaviors' is empty.",
    answers: [
      { text: "GridRowAdvancedDisplay::view() never runs, so the row gets no spacing modifier classes.", correct: true },
      { text: "Paragraph::save() automatically populates site-default spacing behaviors from dvo_dds.settings.", correct: false },
      { text: "Drupal throws an EntityStorageException because behaviors is a required base field on paragraphs.", correct: false }
    ],
    explanationShort: "Unlike the editorial form, Paragraph::create() leaves behaviors empty, causing entity_type_behaviors to skip GridRowAdvancedDisplay::view() and render the row with zero padding.",
    explanationLong: "When an editor saves a row through the UI, the behavior plugin form writes default values ('spacing_top' => 'default', etc.). In code, Paragraph::create() saves cleanly with an empty behaviors field—so entity_type_behaviors never invokes the display behavior and not even site-wide default spacing classes are added. Always explicitly set dvo_dds_grid_row_advanced_display (and layout) in code."
  },
  {
    id: "dvo-l4-sdc-editing-imported-component-css",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "DvO Best practices"],
    difficulty: 4,
    question: "In an NL Design System SDC base theme, why must you never put Drupal- or DDS-specific CSS tweaks inside components/<name>/<name>.css?",
    hint: "Check how component .css files are maintained when upstream design-system npm packages are updated.",
    answers: [
      { text: "Component .css files are synced from upstream packages, so sync:css overwrites local edits.", correct: true },
      { text: "Drupal core ignores any CSS file inside components/ unless the theme uses Pattern Lab.", correct: false },
      { text: "SDC JSON Schema validation rejects any component whose .css file contains --dds-* variables.", correct: false }
    ],
    explanationShort: "Upstream SDC .css files are verified by sync:css:check and overwritten on design-system updates; all DvO/Drupal glue styles belong in css/dds/.",
    explanationLong: "To keep upgrades to upstream design-system packages clean and verifiable in CI (npm run check -> sync:css:check), 1:1 component stylesheets in components/ remain untouched upstream imports. Any Drupal integration glue—webform spacing, media modifiers, or token bridges—lives separately under css/dds/ and is attached via the theme's libraries.yml or base.css."
  },
  {
    id: "dvo-l4-dds-mobile-grid-column-overflow",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 4,
    question: "DDS's responsive grid defines 4 columns on mobile, 8 at medium, and 12 at wide. What breaks on phones if a custom layout puts span-12 on the mobile base tier instead of span-4?",
    hint: "Think about what CSS Grid does when an item spans 12 tracks inside a 4-column explicit grid.",
    answers: [
      { text: "CSS Grid creates 8 implicit tracks whose column gaps push the row wider than the viewport.", correct: true },
      { text: "CSS Grid clamps spans to the explicit column count, so span-12 behaves identically to span-4.", correct: false },
      { text: "dvo_dds rewrites span-12 to span-4 on mobile in JavaScript after DOMContentLoaded fires.", correct: false }
    ],
    explanationShort: "Spanning 12 columns in a 4-column mobile grid forces 8 extra implicit tracks; even at 0 width, their column gaps accumulate and push the layout past the phone screen.",
    explanationLong: "CSS Grid does not clamp a grid-column: span 12 declaration to the 4 explicit tracks defined at the mobile tier. Instead, it creates 8 implicit columns and inserts a column-gap between every one of them—causing horizontal overflow on narrow viewports. Full width in DDS is span-4 on mobile, span-8-medium on tablet, and span-12-wide on desktop."
  },
  {
    id: "dvo-l4-feature-off-cache-tag-and-leaks",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Features", "Caching", "Security"],
    difficulty: 4,
    question: "A block checks DvoFeatureHelper::isFeatureEnabled('my_feature') to decide whether to render, but omits config:dvo_core_features.settings from its cache tags. What fails?",
    hint: "Imagine an administrator toggling the checkbox at /admin/dvg/advanced/features on a warm production cache.",
    answers: [
      { text: "Cached pages keep hiding or showing the block after an admin toggles the feature form.", correct: true },
      { text: "DvoFeatureHelper disables Dynamic Page Cache on every page where isFeatureEnabled() runs.", correct: false },
      { text: "Drupal automatically bubbles config tags from every service call into the active render array.", correct: false }
    ],
    explanationShort: "Calling a helper boolean in PHP does not auto-bubble config cache tags; without config:dvo_core_features.settings, cached output stays stale when an admin flips the toggle.",
    explanationLong: "Drupal cannot automatically tell which render array depended on a boolean returned by isFeatureEnabled(). Any block, menu, preprocess, or access result whose output changes with a DvO Feature must attach the config:dvo_core_features.settings cache tag (and routes, permissions, and cron jobs must also check the feature so nothing leaks while off)."
  },
  {
    id: "dvo-l4-patches-missing-relock-hash-mismatch",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Security"],
    difficulty: 4,
    question: "You update a patch file inside composer-packages/dvg/patches/webform/ to apply cleanly to a new Webform release, commit the .patch file, and push without running composer patches-relock. What happens?",
    hint: "Check how Composer verifies patch integrity during CI and project builds.",
    answers: [
      { text: "Composer fails the build with a HashMismatchException because patches.lock.json pins sha256.", correct: true },
      { text: "Composer silently applies the old cached patch from GitHub instead of your updated local file.", correct: false },
      { text: "GitLab CI regenerates patches.lock.json automatically and commits it back to your branch.", correct: false }
    ],
    explanationShort: "patches.lock.json pins the SHA-256 hash of every patch; modifying a .patch file without running composer patches-relock triggers a deliberate HashMismatchException.",
    explanationLong: "Composer Patches v2 locks exact SHA-256 digests in patches.lock.json so upstream or local patch content can never change unnoticed. Whenever you add or edit a patch in composer-packages/dvg or a project repo, you must run composer patches-relock and composer install and commit the updated lockfile alongside the patch."
  },
  {
    id: "dvo-l4-programmatic-node-moderation-and-search-field",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Best practices", "Entities"],
    difficulty: 4,
    question: "When creating DvO content nodes programmatically in a script, which two pitfalls commonly cause either a database error or an unexpectedly unpublished page?",
    hint: "Check field_exclude_from_search's two columns and how Content Moderation treats status => 1.",
    answers: [
      { text: "Omitting value_external on field_exclude_from_search, and setting status=1 without moderation_state.", correct: true },
      { text: "Setting uid=1 on cron imports, and passing a path alias without clearing the router first.", correct: false },
      { text: "Saving paragraphs before the parent node, and omitting the default language code 'nl'.", correct: false }
    ],
    explanationShort: "field_exclude_from_search requires both value and value_external (NOT NULL), and Content Moderation saves new nodes as drafts unless moderation_state is set to 'published'.",
    explanationLong: "The node form fills in defaults that Node::create() does not: leaving value_external empty on field_exclude_from_search triggers a NOT NULL SQL constraint failure, setting status => 1 alone still creates a draft under Content Moderation unless moderation_state => 'published' is set, and custom aliases get overwritten by Pathauto unless 'pathauto' => 0 is passed."
  },
  {
    id: "dvo-l4-exclusions-missing-hook-install-export",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Config", "Updates"],
    difficulty: 4,
    question: "You add a new module's config pattern to dvg_basic_exclusions and ship default YAML in the module's config/install, but do not export it to the dvg_exclusions folder in hook_install(). What happens on the next drush cim?",
    hint: "Remember what Config Split concludes when it owns a wildcard pattern in complete_list and sees no matching file in its split folder.",
    answers: [
      { text: "The split owns the pattern, sees no file in dvg_exclusions, and deletes the config on drush cim.", correct: true },
      { text: "Drupal falls back to reading the module's config/install YAML on every future drush cim.", correct: false },
      { text: "Config Split copies the active database config into sync/dvg_exclusions automatically during import.", correct: false }
    ],
    explanationShort: "Because dvg_basic_exclusions owns every config name matching its complete_list, any matching config missing from the project's dvg_exclusions folder is deleted on the next drush cim.",
    explanationLong: "config/install is only read once when the module is installed. Once a pattern belongs to dvg_basic_exclusions, drush cim expects a file in projects/<project>/sync/<site>/dvg_exclusions/ for every config matching that pattern—missing file means 'deleted.' Exporting the installed default there in hook_install() lets developers commit it so it survives future imports."
  },
  {
    id: "dvo-l4-sdc-bare-region-block-wrapper",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "Render API"],
    difficulty: 4,
    question: "In an SDC base theme, page.html.twig pipes a region directly into a header or footer component slot that renders a flex row or <ul>. What breaks if blocks in that region use core's block.html.twig?",
    hint: "Picture what happens to flex/grid items or valid HTML when Drupal wraps the menu links in an extra <div> or <nav>.",
    answers: [
      { text: "Core's wrapper <div> or <nav> becomes the single child container, collapsing the flex/list layout.", correct: true },
      { text: "Twig throws a slot schema validation error whenever a block render array contains any HTML attributes.", correct: false },
      { text: "Contextual links strip component classes from sibling elements inside the page template.", correct: false }
    ],
    explanationShort: "An extra block <div> or menu <nav> sits between the SDC's flex/grid/<ul> container and its expected items, breaking both layout tracks and HTML structure.",
    explanationLong: "Design-system header and footer SDCs expect direct link items inside their flex, grid, or <ul> slots. Wrapping those items in Drupal's default block <div> turns multiple items into one wrapper box (collapsing rows into a column), which is why SDC themes define bare regions that route blocks through a wrapper-less block--region--* template."
  },

  // =========================================================================
  // DvO (Drupal voor Overheden) — LEVEL 5: Tradeoffs & deep mechanics (13 cards)
  // =========================================================================
  {
    id: "dvo-l5-dds-to-basetheme-evolution",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes", "DvO Platform"],
    difficulty: 5,
    question: "Why does dvo_dds ship working consumer CSS with fallback --dds-* literals alongside module Twig templates while DvO transitions from toptasks_base_theme toward an NL Design System / SDC base-theme model?",
    hint: "Think about supporting legacy Toptasks projects, standalone municipality SDC themes, and a future shared DDS base theme from one shared module.",
    answers: [
      { text: "One module renders out of the box today while letting SDC themes bridge tokens or swap templates.", correct: true },
      { text: "Drupal forbids base themes from defining CSS custom properties unless a module declares them first.", correct: false },
      { text: "Shipping CSS in dvo_dds eliminates the need for any theme layer once Toptasks is retired.", correct: false }
    ],
    explanationShort: "Shipping design-agnostic markup and --dds-* fallback tokens in dvo_dds lets existing Toptasks sites, custom SDC themes, and a future DDS base theme share one editorial and runtime contract.",
    explanationLong: "Across 30+ municipality repos, DvO cannot flip every project from Pattern Lab (toptasks_base_theme) to Single-Directory Components overnight. By putting paragraph layouts, data providers, and --dds-* fallback CSS in dvo_dds—without hardcoding customer specifics—any site renders valid layouts immediately, while NL Design System / SDC base themes cleanly bind --dds-* tokens or override individual templates with SDCs."
  },
  {
    id: "dvo-l5-spotlight-css-var-alias-resolution",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes"],
    difficulty: 5,
    question: "On :root, a design system declares --ds-links-color: blue and --ds-card-link-color: var(--ds-links-color). Inside .dds-spotlight--inverse, why does setting --ds-links-color: white leave card links blue?",
    hint: "Recall at which DOM element CSS resolves var() references inside custom property declarations.",
    answers: [
      { text: "--ds-card-link-color resolved its var() on :root and inherits down already computed as blue.", correct: true },
      { text: "CSS custom properties inside class selectors cannot override custom properties set on :root.", correct: false },
      { text: "Shadow DOM boundaries around Drupal SDCs block inherited custom properties coming from parent rows.", correct: false }
    ],
    explanationShort: "CSS resolves var() at the element where a custom property is declared (:root), so descendants inherit --ds-card-link-color as its resolved value unless you rebind --ds-card-link-color itself.",
    explanationLong: "Drupal SDCs do not use Shadow DOM, and class selectors override :root custom properties fine—provided you override the exact property the component's rule reads. Because --ds-card-link-color is declared on :root, the browser resolves var(--ds-links-color) on :root and passes that resolved color down the tree. Rebinding the upstream alias on .dds-spotlight--inverse never re-evaluates :root declarations; you must rebind --ds-card-link-color directly."
  },
  {
    id: "dvo-l5-deploy-new-subtheme-cache-before-cim",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "Config", "Updates"],
    difficulty: 5,
    question: "A deployment adds a brand-new sub-theme folder in code along with its block.block.* YAML files. Why does running config:import BEFORE drush cr leave every block of that sub-theme disabled—even after a later drush cr?",
    hint: "Trace the cached theme extension list -> the theme's region list -> Block::preSave().",
    answers: [
      { text: "Cached theme info lacks the new theme, so it has no regions and Block::preSave() disables them.", correct: true },
      { text: "Config Split skips all block.block.* files whenever their theme is missing from system.theme.yml.", correct: false },
      { text: "Drupal's theme installer deletes unrecognized block configs from sync/ until drush cr runs.", correct: false }
    ],
    explanationShort: "Before drush cr, the database-cached theme extension list doesn't know the new folder on disk, so the theme has no known regions and Block::preSave() saves every imported block disabled.",
    explanationLong: "ThemeExtensionList caches discovered themes in the database (the bootstrap cache bin), which code deployment alone does not clear. During config:import, Block::preSave() looks up the block's theme through the theme handler and checks its region against that theme's region list; getting no regions for the unknown theme, Drupal resets the region and disables the block in active config. Running drush cr afterward refreshes the theme cache but cannot re-enable already-saved disabled blocks—drush cr must run before config:import (or a second import is needed)."
  },
  {
    id: "dvo-l5-subsite-language-prefix-edge-reordering",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Routing"],
    difficulty: 5,
    question: "Path subsites use URLs like /subsite/en/page rather than /en/subsite/page, yet Drupal core's path processors assume language comes first. How does dvg_subsite reconcile the two without rewriting every processor?",
    hint: "Look at what happens at the outer edges of the inbound/outbound path processor chain and in URL language negotiation.",
    answers: [
      { text: "Edge processors swap /subsite/en <-> /en/subsite around core's chain, plus custom URL negotiation.", correct: true },
      { text: "An Nginx rewrite rule reorders /subsite/en to /en/subsite before PHP ever sees the incoming HTTP request.", correct: false },
      { text: "dvg_subsite creates duplicate path aliases for every language-and-subsite permutation on save.", correct: false }
    ],
    explanationShort: "SubsiteLanguagePathProcessor translates between /subsite/lang at the outer edges and /lang/subsite inside the processor chain, paired with SubsiteLanguageNegotiationUrl.",
    explanationLong: "Inbound at priority 350 (before language processing at 300), SubsiteLanguagePathProcessor rewrites /test/en/page to /en/test/page so core and alias processors work unchanged; outbound at priority 50, it moves the language prefix back behind the subsite. Because core's URL language negotiator inspects the raw request outside path processors, SubsiteLanguageNegotiationUrl also overrides language-url to detect the language segment behind a subsite."
  },
  {
    id: "dvo-l5-dds-theme-registry-alter-when-off",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Themes", "Render API"],
    difficulty: 5,
    question: "dvo_dds defines per-bundle teaser preprocess functions (like dvo_dds_preprocess_node__news__teaser). When the DDS feature is disabled on a site, why must dvo_dds_theme_registry_alter() remove those bundle hooks?",
    hint: "Consider what Drupal's theme registry auto-creates simply because a preprocess function with that name exists in an enabled module.",
    answers: [
      { text: "Drupal auto-registers hooks for preprocess functions, which would override the theme's plain teaser.", correct: true },
      { text: "Leaving unused preprocess functions registered causes fatal TypeErrors when DDS services are off.", correct: false },
      { text: "Views refuses to cache teaser rows whenever multiple modules preprocess the same node bundle.", correct: false }
    ],
    explanationShort: "Drupal's theme registry automatically creates specific node__<bundle>__teaser entries from module preprocess function names, which would hijack template resolution on non-DDS sites unless pruned.",
    explanationLong: "Even when dvo_dds skips registering its own templates while the DDS feature is off, Drupal scans enabled modules for hook_preprocess_HOOK functions and auto-creates registry entries for node__<bundle>__teaser. Without dvo_dds_theme_registry_alter() dropping those auto-created entries when DDS is off, they outrank the active theme's generic node--teaser.html.twig."
  },
  {
    id: "dvo-l5-bare-region-prepend-vs-append-suggestion",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "Render API"],
    difficulty: 5,
    question: "When an SDC base theme adds a bare-region suggestion (block__region__<region>) to strip wrapper divs, why does it prepend the suggestion if a theme template already matched, yet append it if only a module template matched?",
    hint: "Remember that Drupal picks the LAST matching suggestion, and core's system module ships block--system-menu-block.html.twig.",
    answers: [
      { text: "Prepending lets specific theme block templates win, while appending beats core's menu <nav> template.", correct: true },
      { text: "Drupal evaluates theme suggestions first-to-last for themes but last-to-first for core modules.", correct: false },
      { text: "Appending a suggestion when a theme template exists triggers an infinite Twig embed recursion.", correct: false }
    ],
    explanationShort: "Suggestions resolve last-match-wins: prepending preserves intentional plugin/ID overrides from the theme chain, while appending overrides module templates like block--system-menu-block.html.twig.",
    explanationLong: "If the active theme chain intentionally provides a template for a specific block plugin or ID in that region, prepending block__region__<region> keeps it as a fallback so the specific theme template still wins. But if the only existing match comes from a module (registry type not ending in theme_engine)—such as core's block--system-menu-block.html.twig with its <nav> and <h2>—appending ensures the bare wrapper-less template wins instead."
  },
  {
    id: "dvo-l5-dds-spotlight-continues-in-php",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DDS", "Render API", "Config"],
    difficulty: 5,
    question: "Two consecutive DDS spotlight blocks of the exact same color drop the margin between them so they merge visually, while two different spotlight colors keep whitespace. Why does PHP add .dds-spotlight--continues instead of pure CSS?",
    hint: "Remember where spotlight color keys live in DvO and whether CSS selectors can compare two arbitrary configured class names.",
    answers: [
      { text: "Spotlight color keys come from config, and CSS cannot test whether two arbitrary color classes match.", correct: true },
      { text: "Adjacent-sibling (+) selectors fail whenever Drupal's BigPipe streams paragraphs asynchronously.", correct: false },
      { text: "Browsers ignore margin-block-start: 0 rules whenever custom properties are used for spacing.", correct: false }
    ],
    explanationShort: "Because spotlight color machine names are configurable per site, static CSS cannot compare whether two adjacent blocks share the same color without enumerating unknown classes.",
    explanationLong: "Sibling adjacency already works thanks to field--dds-reset, so CSS easily targets .dds-grid.dds-spotlight + .dds-grid.dds-spotlight. However, spotlight colors come from configuration, so static CSS has no selector for 'previous sibling has the same dynamic dds-spotlight--<color> class as me' (especially across nested .pt-grid boundaries). SpotlightHelper::continuesPrevious() inspects adjacent blocks in PHP and marks matching continuations with dds-spotlight--continues."
  },
  {
    id: "dvo-l5-io-dvg-release-coupled-feature-rollout",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "DvO Features", "Updates"],
    difficulty: 5,
    question: "A new DvO Feature in composer-packages/dvg must go live enabled for one specific municipality in the exact same deployment that ships the new dvg release. How is that coordinated cleanly?",
    hint: "Combine the no-customer-code rule in dvg with how drush updb and dvg_exclusions interact during deployment.",
    answers: [
      { text: "Add a project-guarded update hook in io_dvg and ensure the project's dvg_exclusions YAML matches.", correct: true },
      { text: "Check the customer's domain inside dvo_core_features so the feature defaults to true there.", correct: false },
      { text: "Enable the feature in composer-packages/dvg-project-template and run drush cim --partial.", correct: false }
    ],
    explanationShort: "Guarding an update hook with $_io_dvg_current_project in io_dvg_config_settings.install activates the feature with the dvg release, while matching dvg_exclusions YAML keeps drush cim consistent.",
    explanationLong: "composer-packages/dvg cannot name the customer, and editing the project's YAML before dvg ships would reference a feature plugin that doesn't exist yet. Putting the update hook in io_dvg_config_settings.install (checked against $_io_dvg_current_project) lets the AUTO-UPDATE pipeline enable it and export the updated dvo_core_features.settings.yml—and if deployed outside AUTO-UPDATE, updating that YAML in the project repo keeps subsequent config imports aligned."
  },
  {
    id: "dvo-l5-sdc-committed-assets-vs-composer-build",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DvO Platform", "DvO Best practices"],
    difficulty: 5,
    question: "Why does an NL Design System SDC base theme in a project repo commit its copied upstream tokens, icons, and component CSS to Git—and deliberately omit a package.json 'build' script that composer install would run?",
    hint: "Think about what composer-asset-compiler would do on every developer's composer install when an upstream npm minor release lands.",
    answers: [
      { text: "So upstream design-system bumps stay explicit, reviewed steps instead of noisy install diffs.", correct: true },
      { text: "Because GitLab CI runners block Node.js execution during all Drupal deployment pipelines.", correct: false },
      { text: "Because Drupal's asset resolver refuses to serve gitignored CSS files from inside custom themes.", correct: false }
    ],
    explanationShort: "Committing upstream design-system assets and running build:assets/sync:css only during deliberate version bumps prevents unreviewed upstream changes from polluting unrelated composer installs.",
    explanationLong: "If composer-asset-compiler ran an asset copy script inside the SDC theme on every composer install, any routine developer install could rewrite tokens, icons, or component CSS without going through the theme's deviation checks and Storybook review. Committing the synced assets makes every design-system upgrade an explicit, linted Merge Request."
  },
  {
    id: "dvo-l5-sdc-fieldset-min-inline-size-and-prose-img",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "DDS", "Forms"],
    difficulty: 5,
    question: "Why do Drupal forms rendered with design-system FieldSet SDCs overflow horizontally on mobile unless css/dds/ adds min-inline-size: 0 on the FieldSet wrapper?",
    hint: "Combine the browser UA stylesheet's default rule on <fieldset> with Drupal's default size='60' / cols='60' attributes on inputs.",
    answers: [
      { text: "UA fieldsets use min-inline-size: min-content, so Drupal's size='60' inputs lock them near 593px wide.", correct: true },
      { text: "Drupal's Form API injects inline width: 600px styles onto every <fieldset> unless overridden.", correct: false },
      { text: "CSS Grid tracks expand infinitely whenever a <legend> element wraps onto a second text line.", correct: false }
    ],
    explanationShort: "Browsers give <fieldset> min-inline-size: min-content by default, and Drupal's size='60' attributes inflate that intrinsic minimum despite percentage max-width rules—requiring a reset in css/dds/.",
    explanationLong: "Upstream design systems rarely emit HTML size='60' attributes, so they never hit the browser quirk where <fieldset>'s UA min-inline-size: min-content ignores child percentage max-inline-size while computing intrinsic width. Because upstream SDC CSS cannot be edited directly (sync:css would overwrite it), the min-inline-size: 0 reset lives in theme-authored css/dds/dds-forms.css."
  },
  {
    id: "dvo-l5-csp-style-src-attr-inline-styles",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Themes", "Security", "DDS"],
    difficulty: 5,
    question: "When converting upstream React design-system components to Drupal SDCs on DvO, why do patterns that rely on inline style attributes (like style='background-image: ...' thumbnails) break for visitors?",
    hint: "Check how Drupal's Content Security Policy headers treat inline style attributes on rendered markup.",
    answers: [
      { text: "Strict style-src-attr CSP rules block inline style attributes, leaving thumbnails or alignment broken.", correct: true },
      { text: "Twig's autoescape filter strips every style attribute from HTML tags before sending responses.", correct: false },
      { text: "Drupal's CSS aggregator rewrites inline URLs inside style attributes to broken relative paths.", correct: false }
    ],
    explanationShort: "DvO's Content Security Policy restricts inline style attributes (style-src-attr), so SDC adaptations replace inline background-image or alignment styles with real <img> elements or CSS classes.",
    explanationLong: "Twig does not strip style attributes, so inline styles often appear to work in isolated upstream Storybook builds—then silently vanish on the Drupal site when the browser enforces CSP style-src-attr. Replacing inline background thumbnails with semantic <img> tags (and moving inline alignment rules into css/dds/) satisfies CSP and improves accessibility."
  },
  {
    id: "dvo-l5-subsite-alias-manager-main-site-views",
    category: "DvO (Drupal voor Overheden)",
    tags: ["Subsites", "Routing"],
    difficulty: 5,
    question: "A View page at /search has the main-site alias /zoeken. When a visitor opens /parken/zoeken on a path subsite, why must dvg_subsite_alias use a dedicated lookup fallback instead of relying only on the wrapped alias manager?",
    hint: "Ask which aliases the subsite-scoped alias repository can see while a subsite is active.",
    answers: [
      { text: "While a subsite is active, the scoped repository hides main-site aliases unless fallback ignores scope.", correct: true },
      { text: "Views routes bypass Drupal's inbound path alias processor whenever a URL has more than one segment.", correct: false },
      { text: "Pathauto deletes main-site View aliases whenever a new subsite entity is saved in the database.", correct: false }
    ],
    explanationShort: "Because dvg_subsite_alias scopes repository lookups to the active subsite first, resolving shared main-site View aliases like /zoeken on /subsite/zoeken requires an explicit unscoped fallback.",
    explanationLong: "Path aliases in dvg_subsite_alias carry a subsite ID so two subsites can reuse the same slug for their own nodes without colliding. However, shared system/View aliases like /zoeken belong to the main site: once SubsitePathProcessor strips /parken and activates the subsite context, a purely subsite-scoped lookup wouldn't see /zoeken unless AliasManager falls back across scope for shared routes."
  },
  {
    id: "dvo-l5-exclusions-install-syncing-and-existing-file-guards",
    category: "DvO (Drupal voor Overheden)",
    tags: ["DvO Platform", "Config", "Updates"],
    difficulty: 5,
    question: "When a module's hook_install() exports default config into the dvg_basic_exclusions directory, why must it skip the export when $is_syncing is TRUE and never overwrite a file that already exists there?",
    hint: "Consider both installing the module via drush cim on another environment and a tenant that already committed a custom override.",
    answers: [
      { text: "To avoid writing files mid-config-import and avoid clobbering an existing tenant override in Git.", correct: true },
      { text: "Because $is_syncing means cron is running, where filesystem writes to sync/ throw fatal errors.", correct: false },
      { text: "Because overwriting an existing YAML file changes its UUID and then deletes all nodes of that bundle.", correct: false }
    ],
    explanationShort: "Skipping when $is_syncing prevents side-effect writes during config:import, and skipping existing files protects any per-site override a project already committed to dvg_exclusions.",
    explanationLong: "hook_install() runs in two very different contexts: during initial rollout via an update hook (where writing the default YAML into the path configured on config_split.config_split.dvg_basic_exclusions saves manual boilerplate), and during drush cim on downstream environments ($is_syncing === TRUE) or on a tenant that already placed an override file there. Guarding both conditions keeps imports pure and preserves tenant customizations."
  }
];
