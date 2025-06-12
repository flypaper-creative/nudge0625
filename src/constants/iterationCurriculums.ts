import type { IterationCurriculum } from '../types';

export const ITERATION_CURRICULUMS: IterationCurriculum[] = [
  // Design
  {
    id: 'design-logo-exploration-v1',
    name: 'Logo Concept Exploration',
    description: 'Generates diverse logo concepts then refines a chosen direction.',
    category: 'Design',
    basePrompt: 'Design a logo for a futuristic tech company specializing in AI. The logo should be modern, sleek, and memorable.',
    steps: [
      { stepName: 'Broad Concepts', instruction: 'Generate 5 distinct logo concepts. Focus on variety in style (minimalist, abstract, typographic, emblem).', iterations: 5, outputFileNameTemplate: 'logo_concept_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Color Palettes', instruction: 'For each of the previous concepts, suggest 2-3 color palettes.', iterations: 5, outputFileNameTemplate: 'logo_palette_concept##.txt' },
      { stepName: 'Refine Minimalist', instruction: 'Take the most promising minimalist concept and iterate 3 variations, focusing on subtle changes in line weight and spacing.', iterations: 3, outputFileNameTemplate: 'logo_minimalist_refined_##.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Refine Abstract', instruction: 'Take the most promising abstract concept and iterate 3 variations, exploring different levels of abstraction.', iterations: 3, outputFileNameTemplate: 'logo_abstract_refined_##.txt', guidingEchoBitId: 'guidance-turing-prime' },
    ]
  },
  {
    id: 'design-ui-style-variants-v1',
    name: 'UI Style Variants',
    description: 'Explores different UI aesthetics for a dashboard component.',
    category: 'Design',
    basePrompt: 'Design a user dashboard card component that displays key performance indicators (KPIs).',
    steps: [
      { stepName: 'Neumorphic Style', instruction: 'Design the card using a neumorphic style. Provide HTML/CSS structure.', iterations: 2, outputFileNameTemplate: 'ui_neumorphic_##.html', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Glassmorphism Style', instruction: 'Design the card using glassmorphism. Provide HTML/CSS structure.', iterations: 2, outputFileNameTemplate: 'ui_glassmorphism_##.html' },
      { stepName: 'Material Design Style', instruction: 'Design the card adhering to Material Design principles. Provide HTML/CSS structure.', iterations: 2, outputFileNameTemplate: 'ui_material_##.html', guidingEchoBitId: 'guidance-lovelace-visionary' },
    ]
  },
  // Writing
  {
    id: 'writing-story-arc-v1',
    name: 'Short Story Arc Development',
    description: 'Develops a short story from inciting incident to resolution.',
    category: 'Writing',
    basePrompt: 'Write a short science fiction story about a lone space explorer who discovers an ancient alien artifact.',
    steps: [
      { stepName: 'Inciting Incident', instruction: 'Describe the discovery of the artifact and the immediate mystery it presents.', iterations: 1, outputFileNameTemplate: 'story_part1_incident.txt' },
      { stepName: 'Rising Action', instruction: 'Develop 2-3 challenges or obstacles the explorer faces while trying to understand the artifact.', iterations: 3, outputFileNameTemplate: 'story_part2_rising_##.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Climax', instruction: 'Write the climactic scene where the artifact\'s purpose is revealed or a major confrontation occurs.', iterations: 1, outputFileNameTemplate: 'story_part3_climax.txt' },
      { stepName: 'Resolution', instruction: 'Conclude the story, showing the aftermath and the explorer\'s new understanding or situation.', iterations: 1, outputFileNameTemplate: 'story_part4_resolution.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  },
  {
    id: 'writing-blog-post-v1',
    name: 'Tech Blog Post Creation',
    description: 'Drafts a blog post on a technical topic, from outline to conclusion.',
    category: 'Writing',
    basePrompt: 'Write a blog post about the future of quantum computing.',
    steps: [
      { stepName: 'Outline & Key Points', instruction: 'Generate a detailed outline with 3-5 main sections and key bullet points for each.', iterations: 1, outputFileNameTemplate: 'blog_outline.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Introduction', instruction: 'Write an engaging introduction that hooks the reader.', iterations: 1, outputFileNameTemplate: 'blog_intro.txt' },
      { stepName: 'Section Elaboration', instruction: 'Elaborate on each main section from the outline, providing details and examples.', iterations: 3, outputFileNameTemplate: 'blog_section_##.txt' },
      { stepName: 'Conclusion & Call to Action', instruction: 'Write a summary conclusion and a call to action (e.g., share thoughts, read more).', iterations: 1, outputFileNameTemplate: 'blog_conclusion.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
    ]
  },
  // Coding
  {
    id: 'coding-python-script-v1',
    name: 'Python Utility Script',
    description: 'Generates a Python script for a common task, with error handling.',
    category: 'Coding',
    basePrompt: 'Create a Python script that reads a CSV file, filters rows based on a condition, and writes the output to a new CSV.',
    steps: [
      { stepName: 'Core Logic (Read & Write)', instruction: 'Write the basic Python code to read a CSV and write to another, without filtering yet.', iterations: 1, outputFileNameTemplate: 'script_core_rw.py', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Filtering Logic', instruction: 'Add a function to filter rows where a specific column value is greater than 50.', iterations: 1, outputFileNameTemplate: 'script_filter.py' },
      { stepName: 'Command-line Arguments', instruction: 'Modify the script to accept input/output file paths and the filter column/value via command-line arguments using argparse.', iterations: 1, outputFileNameTemplate: 'script_cli_args.py' },
      { stepName: 'Error Handling & Comments', instruction: 'Add try-except blocks for file operations and include comments explaining the code.', iterations: 1, outputFileNameTemplate: 'script_final.py', guidingEchoBitId: 'guidance-lovelace-visionary' },
    ]
  },
  {
    id: 'coding-js-component-v1',
    name: 'React Component (Conceptual)',
    description: 'Generates a conceptual React component with props and state.',
    category: 'Coding',
    basePrompt: 'Create a simple React functional component for a "UserProfileCard" that displays user name, email, and avatar.',
    steps: [
      { stepName: 'Component Structure', instruction: 'Define the component function and its props (name, email, avatarUrl).', iterations: 1, outputFileNameTemplate: 'component_structure.jsx' },
      { stepName: 'Basic JSX Rendering', instruction: 'Add JSX to render the name, email, and an image tag for the avatar.', iterations: 1, outputFileNameTemplate: 'component_jsx.jsx', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Add Basic Styling (Inline)', instruction: 'Add some conceptual inline styles for basic layout and appearance.', iterations: 1, outputFileNameTemplate: 'component_styled.jsx' },
    ]
  },
  // Research
  {
    id: 'research-topic-summary-v1',
    name: 'Topic Summary & Key Questions',
    description: 'Researches a topic and identifies key questions for further study.',
    category: 'Research',
    basePrompt: 'Provide a summary of current advancements in renewable energy sources.',
    steps: [
      { stepName: 'Initial Overview', instruction: 'Give a broad overview of the main types of renewable energy (solar, wind, hydro, geothermal).', iterations: 1, outputFileNameTemplate: 'research_overview.txt' },
      { stepName: 'Deep Dive: Solar', instruction: 'Focus on recent advancements in solar panel technology and efficiency.', iterations: 1, outputFileNameTemplate: 'research_solar.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Deep Dive: Wind', instruction: 'Focus on recent advancements in wind turbine design and offshore wind farms.', iterations: 1, outputFileNameTemplate: 'research_wind.txt' },
      { stepName: 'Key Challenges & Open Questions', instruction: 'Identify 3-5 key challenges and open research questions in the field of renewable energy.', iterations: 1, outputFileNameTemplate: 'research_questions.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
    ]
  },
  // Branding
  {
    id: 'branding-voice-dev-v1',
    name: 'Brand Voice Development',
    description: 'Develops a brand voice from keywords to sample copy.',
    category: 'Branding',
    basePrompt: 'Develop a brand voice for a new eco-friendly coffee shop. Target audience: environmentally conscious millennials.',
    steps: [
      { stepName: 'Keywords & Attributes', instruction: 'List 5-7 keywords and attributes that should define the brand voice (e.g., warm, authentic, sustainable, witty).', iterations: 1, outputFileNameTemplate: 'brand_keywords.txt' },
      { stepName: 'Tone Guidelines', instruction: 'Describe the appropriate tone (e.g., conversational, slightly informal, positive). Provide do\'s and don\'ts.', iterations: 1, outputFileNameTemplate: 'brand_tone.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Sample Slogan/Tagline', instruction: 'Generate 3 sample taglines reflecting the brand voice.', iterations: 3, outputFileNameTemplate: 'brand_taglines_##.txt' },
      { stepName: 'Sample Social Media Post', instruction: 'Write a sample social media post (e.g., Instagram caption) in the defined brand voice announcing a new seasonal drink.', iterations: 1, outputFileNameTemplate: 'brand_social_post.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  },
  // Creative Ideation
  {
    id: 'ideation-product-features-v1',
    name: 'New Product Feature Brainstorm',
    description: 'Generates a list of innovative features for a hypothetical product.',
    category: 'Creative Ideation',
    basePrompt: 'Brainstorm innovative features for a smart notebook that combines physical note-taking with digital integration.',
    steps: [
      { stepName: 'Core Digital Features', instruction: 'List 5 core digital integration features (e.g., OCR, cloud sync, tagging).', iterations: 1, outputFileNameTemplate: 'features_digital.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Unique Hardware Features', instruction: 'Suggest 3 unique hardware features for the physical notebook itself (e.g., erasable pages, embedded sensors).', iterations: 1, outputFileNameTemplate: 'features_hardware.txt' },
      { stepName: 'AI-Powered Enhancements', instruction: 'Propose 3 AI-powered features that could enhance the user experience (e.g., automatic summarization, related note suggestions).', iterations: 1, outputFileNameTemplate: 'features_ai.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Wildcard Ideas', instruction: 'Generate 2 "wildcard" or highly experimental feature ideas.', iterations: 2, outputFileNameTemplate: 'features_wildcard_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  },
  // Learning
  {
    id: 'learning-concept-explainer-v1',
    name: 'Complex Concept Explainer',
    description: 'Explains a complex concept in stages, from simple to advanced.',
    category: 'Learning',
    basePrompt: 'Explain the concept of blockchain technology.',
    steps: [
      { stepName: 'Simple Analogy', instruction: 'Explain blockchain using a simple analogy a non-technical person can understand.', iterations: 1, outputFileNameTemplate: 'concept_analogy.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Key Components', instruction: 'Describe the key components: blocks, chains, hashing, distributed ledger.', iterations: 1, outputFileNameTemplate: 'concept_components.txt' },
      { stepName: 'Core Principles', instruction: 'Explain the core principles: decentralization, immutability, transparency.', iterations: 1, outputFileNameTemplate: 'concept_principles.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Use Cases', instruction: 'List 3 diverse real-world use cases beyond cryptocurrency.', iterations: 1, outputFileNameTemplate: 'concept_usecases.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  },
  // --- 10 More Curriculums ---
  {
    id: 'design-infographic-flow-v1',
    name: 'Infographic Content Flow',
    description: 'Structures the content and narrative for an infographic.',
    category: 'Design',
    basePrompt: 'Create the content structure for an infographic about the benefits of remote work.',
    steps: [
      { stepName: 'Main Title & Hook', instruction: 'Propose a compelling title and a short introductory hook.', iterations: 1, outputFileNameTemplate: 'infographic_title.txt' },
      { stepName: 'Key Benefit Sections (3-4)', instruction: 'Identify 3-4 main benefit categories and list key data points/facts for each.', iterations: 4, outputFileNameTemplate: 'infographic_benefit_##.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Visual Metaphor Ideas', instruction: 'Suggest 2-3 visual metaphors or themes that could tie the infographic together.', iterations: 1, outputFileNameTemplate: 'infographic_visuals.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Call to Action/Conclusion', instruction: 'Draft a concluding statement and a potential call to action.', iterations: 1, outputFileNameTemplate: 'infographic_conclusion.txt' },
    ]
  },
  {
    id: 'writing-poetry-styles-v1',
    name: 'Poetry Style Exploration',
    description: 'Writes short poems on a theme, exploring different poetic forms.',
    category: 'Writing',
    basePrompt: 'Write poems about "the changing seasons".',
    steps: [
      { stepName: 'Haiku (Spring)', instruction: 'Write a haiku about spring.', iterations: 2, outputFileNameTemplate: 'poem_haiku_spring_##.txt' },
      { stepName: 'Sonnet (Summer)', instruction: 'Write a short sonnet (or quatrains in sonnet style) about summer.', iterations: 1, outputFileNameTemplate: 'poem_sonnet_summer.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Free Verse (Autumn)', instruction: 'Write a short free verse poem about autumn.', iterations: 2, outputFileNameTemplate: 'poem_freeverse_autumn_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Limerick (Winter)', instruction: 'Write a humorous limerick about winter.', iterations: 1, outputFileNameTemplate: 'poem_limerick_winter.txt' },
    ]
  },
  {
    id: 'coding-api-endpoints-v1',
    name: 'REST API Endpoint Design (Conceptual)',
    description: 'Designs conceptual REST API endpoints for a resource.',
    category: 'Coding',
    basePrompt: 'Design REST API endpoints for managing "Book" resources (title, author, ISBN).',
    steps: [
      { stepName: 'List Books (GET)', instruction: 'Define the GET endpoint for listing all books, including potential query parameters (e.g., author).', iterations: 1, outputFileNameTemplate: 'api_get_all.txt' },
      { stepName: 'Create Book (POST)', instruction: 'Define the POST endpoint for creating a new book, including request body schema.', iterations: 1, outputFileNameTemplate: 'api_post.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Get Book (GET by ID)', instruction: 'Define the GET endpoint for retrieving a single book by its ID.', iterations: 1, outputFileNameTemplate: 'api_get_id.txt' },
      { stepName: 'Update Book (PUT by ID)', instruction: 'Define the PUT endpoint for updating a book, including request body schema.', iterations: 1, outputFileNameTemplate: 'api_put.txt' },
      { stepName: 'Delete Book (DELETE by ID)', instruction: 'Define the DELETE endpoint for deleting a book.', iterations: 1, outputFileNameTemplate: 'api_delete.txt' },
    ]
  },
  {
    id: 'research-competitor-analysis-v1',
    name: 'Competitor Feature Analysis',
    description: 'Analyzes features of 2-3 competitors for a given product type.',
    category: 'Research',
    basePrompt: 'Analyze the key features of 2-3 leading project management software (e.g., Asana, Trello, Monday.com).',
    steps: [
      { stepName: 'Identify Key Competitors', instruction: 'List 2-3 top competitors in the project management space.', iterations: 1, outputFileNameTemplate: 'competitors_list.txt' },
      { stepName: 'Core Features Comparison', instruction: 'For each competitor, list 5-7 core features (e.g., task management, collaboration, reporting). Create a comparison table outline.', iterations: 1, outputFileNameTemplate: 'competitors_features_core.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Unique Selling Propositions (USPs)', instruction: 'Identify 1-2 unique selling propositions for each competitor.', iterations: 1, outputFileNameTemplate: 'competitors_usps.txt' },
      { stepName: 'Potential Gaps/Opportunities', instruction: 'Based on the analysis, suggest 2-3 potential feature gaps or opportunities for a new entrant.', iterations: 1, outputFileNameTemplate: 'competitors_gaps.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
    ]
  },
  {
    id: 'branding-mission-statement-v1',
    name: 'Mission Statement Crafting',
    description: 'Iteratively crafts a company mission statement.',
    category: 'Branding',
    basePrompt: 'Craft a mission statement for a startup that provides personalized AI-driven educational tools for K-12 students.',
    steps: [
      { stepName: 'Core Values Identification', instruction: 'Identify 3-5 core values the company stands for (e.g., accessibility, innovation, student success).', iterations: 1, outputFileNameTemplate: 'mission_values.txt' },
      { stepName: 'Target Audience & Impact', instruction: 'Define the primary target audience and the desired impact on them.', iterations: 1, outputFileNameTemplate: 'mission_audience_impact.txt' },
      { stepName: 'Draft Version 1 (Concise)', instruction: 'Draft a concise mission statement (1-2 sentences).', iterations: 2, outputFileNameTemplate: 'mission_draft1_##.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Draft Version 2 (Elaborated)', instruction: 'Expand on the concise version, adding more detail about how the mission is achieved.', iterations: 2, outputFileNameTemplate: 'mission_draft2_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Refine & Polish', instruction: 'Refine the best draft for clarity, impact, and memorability.', iterations: 1, outputFileNameTemplate: 'mission_final.txt' },
    ]
  },
  {
    id: 'ideation-story-prompts-v1',
    name: 'Creative Story Prompts',
    description: 'Generates diverse story prompts based on a theme.',
    category: 'Creative Ideation',
    basePrompt: 'Generate creative story prompts around the theme of "unexpected journeys".',
    steps: [
      { stepName: 'Sci-Fi Prompts', instruction: 'Generate 3 sci-fi story prompts.', iterations: 3, outputFileNameTemplate: 'prompts_scifi_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Fantasy Prompts', instruction: 'Generate 3 fantasy story prompts.', iterations: 3, outputFileNameTemplate: 'prompts_fantasy_##.txt' },
      { stepName: 'Mystery Prompts', instruction: 'Generate 3 mystery story prompts.', iterations: 3, outputFileNameTemplate: 'prompts_mystery_##.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Slice-of-Life Prompts', instruction: 'Generate 3 slice-of-life story prompts with an unexpected journey element.', iterations: 3, outputFileNameTemplate: 'prompts_sliceoflife_##.txt' },
    ]
  },
  {
    id: 'problem-solving-scenarios-v1',
    name: 'Scenario-Based Problem Solving',
    description: 'Analyzes a problem scenario and proposes solutions.',
    category: 'Problem Solving',
    basePrompt: 'A small e-commerce business is experiencing a sudden drop in sales. Analyze potential causes and suggest solutions.',
    steps: [
      { stepName: 'Identify Potential Causes (Internal)', instruction: 'List 3-5 potential internal causes (e.g., website issues, pricing changes, stock problems).', iterations: 1, outputFileNameTemplate: 'problem_causes_internal.txt', guidingEchoBitId: 'guidance-turing-prime' },
      { stepName: 'Identify Potential Causes (External)', instruction: 'List 3-5 potential external causes (e.g., new competitor, market trend shift, economic factors).', iterations: 1, outputFileNameTemplate: 'problem_causes_external.txt' },
      { stepName: 'Propose Solutions (Short-Term)', instruction: 'Suggest 2-3 short-term solutions to mitigate the sales drop.', iterations: 1, outputFileNameTemplate: 'problem_solutions_shortterm.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Propose Solutions (Long-Term)', instruction: 'Suggest 2-3 long-term strategies to prevent future occurrences and improve resilience.', iterations: 1, outputFileNameTemplate: 'problem_solutions_longterm.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  },
  {
    id: 'game-design-mechanic-v1',
    name: 'Game Mechanic Ideation',
    description: 'Brainstorms a core game mechanic and its implications.',
    category: 'Game Design',
    basePrompt: 'Design a unique core game mechanic for a puzzle-adventure game.',
    steps: [
      { stepName: 'Core Mechanic Concept', instruction: 'Describe the core game mechanic in 1-2 sentences.', iterations: 3, outputFileNameTemplate: 'game_mechanic_concept_##.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
      { stepName: 'Player Interaction', instruction: 'How does the player interact with this mechanic? What are the inputs and outputs?', iterations: 1, outputFileNameTemplate: 'game_mechanic_interaction.txt' },
      { stepName: 'Potential Puzzles', instruction: 'List 3 types of puzzles that could be designed around this mechanic.', iterations: 1, outputFileNameTemplate: 'game_mechanic_puzzles.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Progression/Evolution', instruction: 'How could this mechanic evolve or become more complex as the game progresses?', iterations: 1, outputFileNameTemplate: 'game_mechanic_progression.txt' },
    ]
  },
  {
    id: 'general-pros-cons-v1',
    name: 'Pros & Cons Analysis',
    description: 'Analyzes the pros and cons of a given topic or decision.',
    category: 'General',
    basePrompt: 'Analyze the pros and cons of adopting a four-day work week.',
    steps: [
      { stepName: 'Identify Pros', instruction: 'List 5-7 potential benefits or advantages.', iterations: 1, outputFileNameTemplate: 'analysis_pros.txt' },
      { stepName: 'Identify Cons', instruction: 'List 5-7 potential drawbacks or disadvantages.', iterations: 1, outputFileNameTemplate: 'analysis_cons.txt' },
      { stepName: 'Mitigation for Cons', instruction: 'For 2-3 major cons, suggest potential mitigation strategies.', iterations: 1, outputFileNameTemplate: 'analysis_mitigation.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Overall Recommendation/Considerations', instruction: 'Provide a balanced summary and key considerations for implementation.', iterations: 1, outputFileNameTemplate: 'analysis_summary.txt', guidingEchoBitId: 'guidance-turing-prime' },
    ]
  },
  {
    id: 'writing-email-campaign-v1',
    name: 'Email Campaign Sequence',
    description: 'Drafts a sequence of emails for a marketing campaign.',
    category: 'Writing',
    basePrompt: 'Draft a 3-email sequence to promote a new online course on "Digital Marketing Fundamentals".',
    steps: [
      { stepName: 'Email 1: Introduction & Value Proposition', instruction: 'Introduce the course, highlight its main benefits, and create intrigue.', iterations: 1, outputFileNameTemplate: 'email_campaign_1_intro.txt', guidingEchoBitId: 'guidance-lovelace-visionary' },
      { stepName: 'Email 2: Deep Dive & Social Proof', instruction: 'Detail key modules/content, include a testimonial or social proof element.', iterations: 1, outputFileNameTemplate: 'email_campaign_2_details.txt' },
      { stepName: 'Email 3: Scarcity & Call to Action', instruction: 'Create urgency (e.g., early bird discount ending) and a clear call to action to enroll.', iterations: 1, outputFileNameTemplate: 'email_campaign_3_cta.txt', guidingEchoBitId: 'guidance-davinci-nexus' },
    ]
  }
];