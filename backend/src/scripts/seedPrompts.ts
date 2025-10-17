import mongoose from 'mongoose';
import { Prompt } from '../models/Prompt';

const prompts = [
  // Tech Opinions
  { question: "React or Vue? Which would you choose for a new project?", type: "poll", category: "tech", options: ["React", "Vue", "Neither", "Both"], tags: ["frontend", "framework"] },
  { question: "Tabs vs Spaces - which is superior for code formatting?", type: "debate", category: "tech", tags: ["coding", "formatting"] },
  { question: "Should AI write code? Or should developers be worried about job security?", type: "debate", category: "tech", tags: ["ai", "future", "career"] },
  { question: "Is TypeScript worth the extra complexity for small projects?", type: "poll", category: "tech", options: ["Yes, always", "No, overkill", "Depends on team size", "Never used it"], tags: ["typescript", "javascript"] },
  { question: "What's the most overrated programming language?", type: "open", category: "tech", tags: ["languages", "opinion"] },
  { question: "Is pair programming actually effective or just a time sink?", type: "debate", category: "tech", tags: ["collaboration", "productivity"] },
  { question: "Should you always write tests first (TDD) or is it sometimes overkill?", type: "debate", category: "tech", tags: ["testing", "tdd", "methodology"] },
  { question: "What's the worst programming language you've ever used?", type: "open", category: "tech", tags: ["languages", "experience"] },
  { question: "Is Docker essential for every project or just hype?", type: "poll", category: "tech", options: ["Essential", "Overhyped", "Useful but not always", "Never used it"], tags: ["docker", "devops"] },
  { question: "Should developers be responsible for their own deployments?", type: "debate", category: "tech", tags: ["devops", "responsibility"] },

  // Hypotheticals
  { question: "If GitHub didn't exist, how would developers collaborate on code?", type: "open", category: "hypothetical", tags: ["collaboration", "git", "platforms"] },
  { question: "What if JavaScript was never invented? What would web development look like?", type: "open", category: "hypothetical", tags: ["javascript", "web", "history"] },
  { question: "If you could redesign the internet from scratch, what would you change?", type: "open", category: "hypothetical", tags: ["internet", "architecture", "design"] },
  { question: "What if all programming languages disappeared except one? Which would you keep?", type: "poll", category: "hypothetical", options: ["JavaScript", "Python", "C++", "Go", "Rust"], tags: ["languages", "choice"] },
  { question: "If you could add one feature to any programming language, what would it be?", type: "open", category: "hypothetical", tags: ["languages", "features", "improvement"] },
  { question: "What if computers could only understand binary? How would programming change?", type: "open", category: "hypothetical", tags: ["binary", "programming", "fundamentals"] },
  { question: "If you could program in any fictional language from movies/books, which would you choose?", type: "open", category: "hypothetical", tags: ["fiction", "creativity", "fun"] },
  { question: "What if the internet had a maximum speed limit of 56k forever?", type: "open", category: "hypothetical", tags: ["internet", "speed", "constraints"] },
  { question: "If you could only use one IDE for the rest of your career, which would it be?", type: "poll", category: "hypothetical", options: ["VS Code", "IntelliJ", "Vim", "Sublime", "Other"], tags: ["ide", "tools", "choice"] },
  { question: "What if every bug you wrote would physically hurt you? How would coding change?", type: "open", category: "hypothetical", tags: ["bugs", "consequences", "humor"] },

  // Humor & Fun
  { question: "What's the most cursed bug you've ever encountered?", type: "open", category: "humor", tags: ["bugs", "stories", "humor"] },
  { question: "If programming languages were people, which one would be the most annoying roommate?", type: "open", category: "humor", tags: ["languages", "personality", "humor"] },
  { question: "What's the weirdest variable name you've ever seen in production code?", type: "open", category: "humor", tags: ["naming", "code", "humor"] },
  { question: "If you had to explain programming to a 5-year-old using only food analogies, how would you do it?", type: "open", category: "humor", tags: ["explanation", "analogies", "creativity"] },
  { question: "What's the most ridiculous requirement you've ever received from a client?", type: "open", category: "humor", tags: ["clients", "requirements", "stories"] },
  { question: "If you could make one programming concept illegal, which would it be?", type: "open", category: "humor", tags: ["concepts", "frustration", "humor"] },
  { question: "What's the most creative way you've procrastinated while debugging?", type: "open", category: "humor", tags: ["procrastination", "debugging", "creativity"] },
  { question: "If you could rename any programming term to something funnier, what would it be?", type: "open", category: "humor", tags: ["terminology", "humor", "creativity"] },
  { question: "What's the most absurd error message you've ever seen?", type: "open", category: "humor", tags: ["errors", "messages", "humor"] },
  { question: "If you could add one completely useless but fun feature to any programming language, what would it be?", type: "open", category: "humor", tags: ["features", "fun", "useless"] },

  // Philosophy & Future
  { question: "Is being a good developer more about writing clean code or collaborating well with others?", type: "debate", category: "philosophy", tags: ["skills", "collaboration", "code quality"] },
  { question: "Will open source still exist in 2040, or will everything be proprietary?", type: "debate", category: "future", tags: ["open source", "future", "trends"] },
  { question: "Is Stack Overflow still relevant in 2025, or has AI replaced it?", type: "debate", category: "future", tags: ["stack overflow", "ai", "learning"] },
  { question: "Should programming be taught in schools as a core subject like math and science?", type: "debate", category: "philosophy", tags: ["education", "programming", "schools"] },
  { question: "Is the 'move fast and break things' mentality still valid in 2025?", type: "debate", category: "philosophy", tags: ["methodology", "speed", "quality"] },
  { question: "Will we still be writing code in 50 years, or will AI do everything?", type: "debate", category: "future", tags: ["ai", "future", "programming"] },
  { question: "Is remote work the future of software development, or will we return to offices?", type: "debate", category: "future", tags: ["remote work", "office", "trends"] },
  { question: "Should developers be held legally responsible for security vulnerabilities in their code?", type: "debate", category: "philosophy", tags: ["security", "responsibility", "legal"] },
  { question: "Is the 40-hour work week outdated for knowledge workers like developers?", type: "debate", category: "philosophy", tags: ["work life", "hours", "productivity"] },
  { question: "Will traditional universities become obsolete for learning programming?", type: "debate", category: "future", tags: ["education", "universities", "learning"] },

  // Community & Culture
  { question: "What's the most toxic behavior you've seen in the developer community?", type: "open", category: "community", tags: ["toxicity", "community", "behavior"] },
  { question: "Is the 'brogrammer' culture still a problem in tech, or have we moved past it?", type: "debate", category: "culture", tags: ["culture", "diversity", "inclusion"] },
  { question: "Should developers be required to contribute to open source projects?", type: "debate", category: "community", tags: ["open source", "contribution", "requirement"] },
  { question: "What's the best way to onboard a junior developer to your team?", type: "open", category: "community", tags: ["mentoring", "junior", "onboarding"] },
  { question: "Is the 'rockstar developer' mentality helpful or harmful to teams?", type: "debate", category: "culture", tags: ["teamwork", "ego", "culture"] },
  { question: "Should code reviews be mandatory for all changes, even small ones?", type: "debate", category: "community", tags: ["code review", "process", "quality"] },
  { question: "What's the most important skill for a developer that has nothing to do with coding?", type: "open", category: "community", tags: ["skills", "soft skills", "development"] },
  { question: "Is the 'hustle culture' in tech startups actually productive or just burnout waiting to happen?", type: "debate", category: "culture", tags: ["startups", "burnout", "productivity"] },
  { question: "Should developers be involved in product decisions, or should they just build what they're told?", type: "debate", category: "community", tags: ["product", "decision making", "collaboration"] },
  { question: "What's the best way to handle technical debt in a fast-moving startup?", type: "open", category: "community", tags: ["technical debt", "startups", "management"] },

  // Personal & Experience
  { question: "What's one project that completely changed how you think about programming?", type: "open", category: "personal", tags: ["projects", "learning", "growth"] },
  { question: "What's the biggest mistake you made early in your career that you learned from?", type: "open", category: "personal", tags: ["mistakes", "learning", "career"] },
  { question: "If you could go back and give your junior developer self one piece of advice, what would it be?", type: "open", category: "personal", tags: ["advice", "junior", "experience"] },
  { question: "What's the most challenging technical problem you've ever solved?", type: "open", category: "personal", tags: ["challenges", "problem solving", "technical"] },
  { question: "What programming concept took you the longest to understand, and why?", type: "open", category: "personal", tags: ["learning", "concepts", "difficulty"] },
  { question: "What's your favorite 'aha!' moment in programming?", type: "open", category: "personal", tags: ["learning", "breakthrough", "moments"] },
  { question: "If you could master one new technology this year, what would it be?", type: "open", category: "personal", tags: ["learning", "technology", "goals"] },
  { question: "What's the most valuable lesson you've learned from a code review?", type: "open", category: "personal", tags: ["code review", "learning", "feedback"] },
  { question: "What's your biggest programming pet peeve?", type: "open", category: "personal", tags: ["pet peeves", "frustration", "opinions"] },
  { question: "What's the most creative solution you've come up with to solve a problem?", type: "open", category: "personal", tags: ["creativity", "solutions", "innovation"] },

  // More Tech Opinions
  { question: "Is microservices architecture overhyped, or is it genuinely better than monoliths?", type: "debate", category: "tech", tags: ["architecture", "microservices", "monoliths"] },
  { question: "Should you always use a framework, or is vanilla JavaScript sometimes better?", type: "debate", category: "tech", tags: ["frameworks", "vanilla", "javascript"] },
  { question: "Is GraphQL the future of APIs, or is REST still king?", type: "debate", category: "tech", tags: ["graphql", "rest", "apis"] },
  { question: "What's the most overrated JavaScript framework/library?", type: "open", category: "tech", tags: ["javascript", "frameworks", "overrated"] },
  { question: "Is serverless architecture actually cost-effective, or just trendy?", type: "debate", category: "tech", tags: ["serverless", "cost", "architecture"] },
  { question: "Should you always use TypeScript for new projects, or is it sometimes overkill?", type: "debate", category: "tech", tags: ["typescript", "javascript", "projects"] },
  { question: "Is NoSQL always better than SQL, or are relational databases still relevant?", type: "debate", category: "tech", tags: ["nosql", "sql", "databases"] },
  { question: "What's the most underrated programming language that more people should learn?", type: "open", category: "tech", tags: ["languages", "underrated", "learning"] },
  { question: "Is functional programming the future, or is OOP still the way to go?", type: "debate", category: "tech", tags: ["functional", "oop", "paradigms"] },
  { question: "Should you always write your own code, or is copy-pasting from Stack Overflow acceptable?", type: "debate", category: "tech", tags: ["coding", "stack overflow", "best practices"] },

  // More Hypotheticals
  { question: "If you could add one superpower to any programming language, what would it be?", type: "open", category: "hypothetical", tags: ["superpowers", "languages", "creativity"] },
  { question: "What if every line of code you wrote had to be approved by a committee?", type: "open", category: "hypothetical", tags: ["approval", "process", "constraints"] },
  { question: "If you could only use one design pattern for the rest of your career, which would it be?", type: "poll", category: "hypothetical", options: ["Singleton", "Factory", "Observer", "MVC", "Other"], tags: ["patterns", "design", "choice"] },
  { question: "What if you had to explain every algorithm you use to a non-technical person?", type: "open", category: "hypothetical", tags: ["algorithms", "explanation", "communication"] },
  { question: "If you could make one programming concept completely disappear, what would it be?", type: "open", category: "hypothetical", tags: ["concepts", "elimination", "frustration"] },
  { question: "What if you could only debug using print statements forever?", type: "open", category: "hypothetical", tags: ["debugging", "tools", "constraints"] },
  { question: "If you had to program using only emojis as commands, how would you do it?", type: "open", category: "hypothetical", tags: ["emojis", "programming", "creativity"] },
  { question: "What if every variable name had to be exactly 3 characters long?", type: "open", category: "hypothetical", tags: ["naming", "constraints", "variables"] },
  { question: "If you could only use one data structure for the rest of your career, which would it be?", type: "poll", category: "hypothetical", options: ["Array", "Object", "Set", "Map", "Tree"], tags: ["data structures", "choice", "constraints"] },
  { question: "What if you had to write all your code in reverse order?", type: "open", category: "hypothetical", tags: ["order", "constraints", "creativity"] },

  // More Humor
  { question: "What's the most ridiculous comment you've ever seen in code?", type: "open", category: "humor", tags: ["comments", "code", "humor"] },
  { question: "If programming languages were food, which would be which?", type: "open", category: "humor", tags: ["languages", "food", "analogies"] },
  { question: "What's the most creative way you've named a variable when you were tired?", type: "open", category: "humor", tags: ["naming", "tired", "creativity"] },
  { question: "If you could make one programming error message more fun, which would it be?", type: "open", category: "humor", tags: ["errors", "messages", "fun"] },
  { question: "What's the most absurd requirement you've ever had to implement?", type: "open", category: "humor", tags: ["requirements", "absurd", "implementation"] },
  { question: "If you could add one completely useless but hilarious feature to VS Code, what would it be?", type: "open", category: "humor", tags: ["vs code", "features", "humor"] },
  { question: "What's the most creative excuse you've given for a bug?", type: "open", category: "humor", tags: ["bugs", "excuses", "creativity"] },
  { question: "If programming was a sport, what would the rules be?", type: "open", category: "humor", tags: ["sport", "rules", "programming"] },
  { question: "What's the most ridiculous thing you've googled while programming?", type: "open", category: "humor", tags: ["google", "search", "ridiculous"] },
  { question: "If you could make one programming concept into a reality TV show, which would it be?", type: "open", category: "humor", tags: ["reality tv", "concepts", "entertainment"] },

  // More Philosophy
  { question: "Is it better to be a generalist or specialist in programming?", type: "debate", category: "philosophy", tags: ["generalist", "specialist", "career"] },
  { question: "Should developers be involved in business decisions, or should they stick to code?", type: "debate", category: "philosophy", tags: ["business", "decisions", "involvement"] },
  { question: "Is the 'perfect is the enemy of good' philosophy helpful or harmful in software development?", type: "debate", category: "philosophy", tags: ["perfection", "good enough", "philosophy"] },
  { question: "Should code be self-documenting, or are comments always necessary?", type: "debate", category: "philosophy", tags: ["documentation", "comments", "code quality"] },
  { question: "Is it better to fail fast or to be more cautious in development?", type: "debate", category: "philosophy", tags: ["failure", "caution", "methodology"] },
  { question: "Should developers be responsible for the ethical implications of their code?", type: "debate", category: "philosophy", tags: ["ethics", "responsibility", "code"] },
  { question: "Is the 'move fast and break things' mentality still relevant in 2025?", type: "debate", category: "philosophy", tags: ["speed", "breaking", "methodology"] },
  { question: "Should programming be considered an art, a science, or a craft?", type: "debate", category: "philosophy", tags: ["art", "science", "craft"] },
  { question: "Is it better to optimize for performance or for readability?", type: "debate", category: "philosophy", tags: ["performance", "readability", "optimization"] },
  { question: "Should developers be required to understand the business domain they're coding for?", type: "debate", category: "philosophy", tags: ["business", "domain", "understanding"] },

  // More Future
  { question: "Will we still be using Git in 2030, or will something better replace it?", type: "debate", category: "future", tags: ["git", "version control", "future"] },
  { question: "Is the cloud the future, or will we return to on-premise solutions?", type: "debate", category: "future", tags: ["cloud", "on-premise", "trends"] },
  { question: "Will low-code/no-code platforms replace traditional programming?", type: "debate", category: "future", tags: ["low-code", "no-code", "programming"] },
  { question: "Is the traditional CS degree still relevant for becoming a developer?", type: "debate", category: "future", tags: ["education", "degree", "relevance"] },
  { question: "Will we still be writing HTML/CSS in 10 years, or will something replace them?", type: "debate", category: "future", tags: ["html", "css", "web"] },
  { question: "Is the 'full-stack developer' role becoming obsolete?", type: "debate", category: "future", tags: ["full-stack", "specialization", "roles"] },
  { question: "Will AI replace code reviews, or will human oversight always be needed?", type: "debate", category: "future", tags: ["ai", "code review", "human oversight"] },
  { question: "Is the traditional office environment dead for developers?", type: "debate", category: "future", tags: ["office", "remote", "environment"] },
  { question: "Will we still be using databases in 20 years, or will everything be in memory?", type: "debate", category: "future", tags: ["databases", "memory", "storage"] },
  { question: "Is the 'startup culture' sustainable, or will it evolve into something else?", type: "debate", category: "future", tags: ["startups", "culture", "sustainability"] },

  // More Community
  { question: "What's the best way to handle a toxic team member in a development team?", type: "open", category: "community", tags: ["toxicity", "team", "management"] },
  { question: "Should developers be required to mentor junior developers?", type: "debate", category: "community", tags: ["mentoring", "junior", "requirement"] },
  { question: "Is the 'brogrammer' culture still a problem in 2025?", type: "debate", category: "community", tags: ["culture", "diversity", "inclusion"] },
  { question: "What's the most effective way to give constructive feedback in code reviews?", type: "open", category: "community", tags: ["feedback", "code review", "communication"] },
  { question: "Should developers be involved in hiring decisions for their team?", type: "debate", category: "community", tags: ["hiring", "team", "involvement"] },
  { question: "Is pair programming actually effective, or is it just a time sink?", type: "debate", category: "community", tags: ["pair programming", "effectiveness", "collaboration"] },
  { question: "What's the best way to handle knowledge sharing in a distributed team?", type: "open", category: "community", tags: ["knowledge", "sharing", "distributed"] },
  { question: "Should developers be required to write documentation?", type: "debate", category: "community", tags: ["documentation", "requirement", "responsibility"] },
  { question: "Is the 'rockstar developer' mentality helpful or harmful to team dynamics?", type: "debate", category: "community", tags: ["ego", "team", "dynamics"] },
  { question: "What's the most important quality in a development team lead?", type: "open", category: "community", tags: ["leadership", "team", "qualities"] },

  // More Personal
  { question: "What's the most valuable skill you've learned outside of programming?", type: "open", category: "personal", tags: ["skills", "learning", "personal"] },
  { question: "What's your biggest programming fear or insecurity?", type: "open", category: "personal", tags: ["fear", "insecurity", "personal"] },
  { question: "What's the most rewarding part of being a developer?", type: "open", category: "personal", tags: ["reward", "satisfaction", "career"] },
  { question: "What's the most frustrating part of being a developer?", type: "open", category: "personal", tags: ["frustration", "challenges", "career"] },
  { question: "What's one thing you wish you knew when you started programming?", type: "open", category: "personal", tags: ["advice", "beginning", "knowledge"] },
  { question: "What's your favorite way to learn new programming concepts?", type: "open", category: "personal", tags: ["learning", "methods", "education"] },
  { question: "What's the most creative solution you've come up with to solve a problem?", type: "open", category: "personal", tags: ["creativity", "solutions", "innovation"] },
  { question: "What's your biggest programming goal for this year?", type: "open", category: "personal", tags: ["goals", "planning", "growth"] },
  { question: "What's the most interesting bug you've ever debugged?", type: "open", category: "personal", tags: ["bugs", "debugging", "stories"] },
  { question: "What's one programming concept you still don't fully understand?", type: "open", category: "personal", tags: ["understanding", "concepts", "learning"] },

  // Additional Tech Opinions
  { question: "Is the 'JavaScript fatigue' real, or are developers just complaining too much?", type: "debate", category: "tech", tags: ["javascript", "fatigue", "ecosystem"] },
  { question: "Should you always use a linter, or is it sometimes overkill?", type: "debate", category: "tech", tags: ["linting", "code quality", "tools"] },
  { question: "Is the 'mobile-first' approach still relevant in 2025?", type: "debate", category: "tech", tags: ["mobile", "responsive", "design"] },
  { question: "What's the most overrated design pattern?", type: "open", category: "tech", tags: ["patterns", "design", "overrated"] },
  { question: "Is the 'API-first' approach the best way to build applications?", type: "debate", category: "tech", tags: ["api", "architecture", "approach"] },
  { question: "Should you always use a CSS framework, or is custom CSS better?", type: "debate", category: "tech", tags: ["css", "frameworks", "custom"] },
  { question: "Is the 'component-based architecture' the future of frontend development?", type: "debate", category: "tech", tags: ["components", "frontend", "architecture"] },
  { question: "What's the most underrated development tool that more people should use?", type: "open", category: "tech", tags: ["tools", "underrated", "productivity"] },
  { question: "Is the 'test-driven development' approach always beneficial?", type: "debate", category: "tech", tags: ["tdd", "testing", "methodology"] },
  { question: "Should you always use a package manager, or is manual dependency management sometimes better?", type: "debate", category: "tech", tags: ["packages", "dependencies", "management"] },

  // More Hypotheticals
  { question: "If you could add one superpower to any programming language, what would it be?", type: "open", category: "hypothetical", tags: ["superpowers", "languages", "creativity"] },
  { question: "What if every function you wrote had to be exactly 10 lines long?", type: "open", category: "hypothetical", tags: ["functions", "constraints", "length"] },
  { question: "If you could only use one data type for the rest of your career, which would it be?", type: "poll", category: "hypothetical", options: ["String", "Number", "Boolean", "Array", "Object"], tags: ["data types", "choice", "constraints"] },
  { question: "What if you had to program using only your voice?", type: "open", category: "hypothetical", tags: ["voice", "programming", "accessibility"] },
  { question: "If you could make one programming concept completely disappear, what would it be?", type: "open", category: "hypothetical", tags: ["concepts", "elimination", "frustration"] },
  { question: "What if you could only use one loop structure for the rest of your career?", type: "poll", category: "hypothetical", options: ["for", "while", "forEach", "map", "reduce"], tags: ["loops", "choice", "constraints"] },
  { question: "If you had to program using only emojis as commands, how would you do it?", type: "open", category: "hypothetical", tags: ["emojis", "programming", "creativity"] },
  { question: "What if every variable name had to be exactly 3 characters long?", type: "open", category: "hypothetical", tags: ["naming", "constraints", "variables"] },
  { question: "If you could only use one data structure for the rest of your career, which would it be?", type: "poll", category: "hypothetical", options: ["Array", "Object", "Set", "Map", "Tree"], tags: ["data structures", "choice", "constraints"] },
  { question: "What if you had to write all your code in reverse order?", type: "open", category: "hypothetical", tags: ["order", "constraints", "creativity"] },

  // More Humor
  { question: "What's the most ridiculous comment you've ever seen in code?", type: "open", category: "humor", tags: ["comments", "code", "humor"] },
  { question: "If programming languages were food, which would be which?", type: "open", category: "humor", tags: ["languages", "food", "analogies"] },
  { question: "What's the most creative way you've named a variable when you were tired?", type: "open", category: "humor", tags: ["naming", "tired", "creativity"] },
  { question: "If you could make one programming error message more fun, which would it be?", type: "open", category: "humor", tags: ["errors", "messages", "fun"] },
  { question: "What's the most absurd requirement you've ever had to implement?", type: "open", category: "humor", tags: ["requirements", "absurd", "implementation"] },
  { question: "If you could add one completely useless but hilarious feature to VS Code, what would it be?", type: "open", category: "humor", tags: ["vs code", "features", "humor"] },
  { question: "What's the most creative excuse you've given for a bug?", type: "open", category: "humor", tags: ["bugs", "excuses", "creativity"] },
  { question: "If programming was a sport, what would the rules be?", type: "open", category: "humor", tags: ["sport", "rules", "programming"] },
  { question: "What's the most ridiculous thing you've googled while programming?", type: "open", category: "humor", tags: ["google", "search", "ridiculous"] },
  { question: "If you could make one programming concept into a reality TV show, which would it be?", type: "open", category: "humor", tags: ["reality tv", "concepts", "entertainment"] },

  // More Philosophy
  { question: "Is it better to be a generalist or specialist in programming?", type: "debate", category: "philosophy", tags: ["generalist", "specialist", "career"] },
  { question: "Should developers be involved in business decisions, or should they stick to code?", type: "debate", category: "philosophy", tags: ["business", "decisions", "involvement"] },
  { question: "Is the 'perfect is the enemy of good' philosophy helpful or harmful in software development?", type: "debate", category: "philosophy", tags: ["perfection", "good enough", "philosophy"] },
  { question: "Should code be self-documenting, or are comments always necessary?", type: "debate", category: "philosophy", tags: ["documentation", "comments", "code quality"] },
  { question: "Is it better to fail fast or to be more cautious in development?", type: "debate", category: "philosophy", tags: ["failure", "caution", "methodology"] },
  { question: "Should developers be responsible for the ethical implications of their code?", type: "debate", category: "philosophy", tags: ["ethics", "responsibility", "code"] },
  { question: "Is the 'move fast and break things' mentality still relevant in 2025?", type: "debate", category: "philosophy", tags: ["speed", "breaking", "methodology"] },
  { question: "Should programming be considered an art, a science, or a craft?", type: "debate", category: "philosophy", tags: ["art", "science", "craft"] },
  { question: "Is it better to optimize for performance or for readability?", type: "debate", category: "philosophy", tags: ["performance", "readability", "optimization"] },
  { question: "Should developers be required to understand the business domain they're coding for?", type: "debate", category: "philosophy", tags: ["business", "domain", "understanding"] },

  // More Future
  { question: "Will we still be using Git in 2030, or will something better replace it?", type: "debate", category: "future", tags: ["git", "version control", "future"] },
  { question: "Is the cloud the future, or will we return to on-premise solutions?", type: "debate", category: "future", tags: ["cloud", "on-premise", "trends"] },
  { question: "Will low-code/no-code platforms replace traditional programming?", type: "debate", category: "future", tags: ["low-code", "no-code", "programming"] },
  { question: "Is the traditional CS degree still relevant for becoming a developer?", type: "debate", category: "future", tags: ["education", "degree", "relevance"] },
  { question: "Will we still be writing HTML/CSS in 10 years, or will something replace them?", type: "debate", category: "future", tags: ["html", "css", "web"] },
  { question: "Is the 'full-stack developer' role becoming obsolete?", type: "debate", category: "future", tags: ["full-stack", "specialization", "roles"] },
  { question: "Will AI replace code reviews, or will human oversight always be needed?", type: "debate", category: "future", tags: ["ai", "code review", "human oversight"] },
  { question: "Is the traditional office environment dead for developers?", type: "debate", category: "future", tags: ["office", "remote", "environment"] },
  { question: "Will we still be using databases in 20 years, or will everything be in memory?", type: "debate", category: "future", tags: ["databases", "memory", "storage"] },
  { question: "Is the 'startup culture' sustainable, or will it evolve into something else?", type: "debate", category: "future", tags: ["startups", "culture", "sustainability"] },

  // More Community
  { question: "What's the best way to handle a toxic team member in a development team?", type: "open", category: "community", tags: ["toxicity", "team", "management"] },
  { question: "Should developers be required to mentor junior developers?", type: "debate", category: "community", tags: ["mentoring", "junior", "requirement"] },
  { question: "Is the 'brogrammer' culture still a problem in 2025?", type: "debate", category: "community", tags: ["culture", "diversity", "inclusion"] },
  { question: "What's the most effective way to give constructive feedback in code reviews?", type: "open", category: "community", tags: ["feedback", "code review", "communication"] },
  { question: "Should developers be involved in hiring decisions for their team?", type: "debate", category: "community", tags: ["hiring", "team", "involvement"] },
  { question: "Is pair programming actually effective, or is it just a time sink?", type: "debate", category: "community", tags: ["pair programming", "effectiveness", "collaboration"] },
  { question: "What's the best way to handle knowledge sharing in a distributed team?", type: "open", category: "community", tags: ["knowledge", "sharing", "distributed"] },
  { question: "Should developers be required to write documentation?", type: "debate", category: "community", tags: ["documentation", "requirement", "responsibility"] },
  { question: "Is the 'rockstar developer' mentality helpful or harmful to team dynamics?", type: "debate", category: "community", tags: ["ego", "team", "dynamics"] },
  { question: "What's the most important quality in a development team lead?", type: "open", category: "community", tags: ["leadership", "team", "qualities"] },

  // More Personal
  { question: "What's the most valuable skill you've learned outside of programming?", type: "open", category: "personal", tags: ["skills", "learning", "personal"] },
  { question: "What's your biggest programming fear or insecurity?", type: "open", category: "personal", tags: ["fear", "insecurity", "personal"] },
  { question: "What's the most rewarding part of being a developer?", type: "open", category: "personal", tags: ["reward", "satisfaction", "career"] },
  { question: "What's the most frustrating part of being a developer?", type: "open", category: "personal", tags: ["frustration", "challenges", "career"] },
  { question: "What's one thing you wish you knew when you started programming?", type: "open", category: "personal", tags: ["advice", "beginning", "knowledge"] },
  { question: "What's your favorite way to learn new programming concepts?", type: "open", category: "personal", tags: ["learning", "methods", "education"] },
  { question: "What's the most creative solution you've come up with to solve a problem?", type: "open", category: "personal", tags: ["creativity", "solutions", "innovation"] },
  { question: "What's your biggest programming goal for this year?", type: "open", category: "personal", tags: ["goals", "planning", "growth"] },
  { question: "What's the most interesting bug you've ever debugged?", type: "open", category: "personal", tags: ["bugs", "debugging", "stories"] },
  { question: "What's one programming concept you still don't fully understand?", type: "open", category: "personal", tags: ["understanding", "concepts", "learning"] }
];

export async function seedPrompts() {
  try {
    // Clear existing prompts
    await Prompt.deleteMany({});
    
    // Insert new prompts
    await Prompt.insertMany(prompts);
    
    console.log(`✅ Seeded ${prompts.length} prompts successfully!`);
    return prompts.length;
  } catch (error) {
    console.error('❌ Error seeding prompts:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  import('../index').then(() => {
    seedPrompts()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
}
