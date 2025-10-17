export const TECH_SKILLS = {
  'Programming Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'Dart', 'Lua', 'Perl', 'Haskell', 'Clojure',
    'Assembly', 'Shell/Bash', 'PowerShell', 'SQL', 'HTML', 'CSS', 'SASS/SCSS'
  ],
  'Web Development': [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js', 'Backbone.js',
    'jQuery', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI',
    'Webpack', 'Vite', 'Parcel', 'Rollup', 'Babel', 'ESLint', 'Prettier'
  ],
  'Backend Development': [
    'Node.js', 'Express.js', 'Fastify', 'Koa.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
    'ASP.NET Core', 'Laravel', 'Symfony', 'Ruby on Rails', 'Sinatra', 'Gin', 'Fiber',
    'REST APIs', 'GraphQL', 'gRPC', 'WebSockets', 'Server-Sent Events'
  ],
  'Mobile Development': [
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova/PhoneGap', 'NativeScript',
    'iOS Development', 'Android Development', 'Objective-C'
  ],
  'Database Technologies': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
    'SQLite', 'Oracle', 'SQL Server', 'MariaDB', 'CouchDB', 'Neo4j', 'InfluxDB',
    'Database Design', 'SQL Optimization', 'NoSQL', 'Database Migration'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
    'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Vagrant',
    'Linux', 'Ubuntu', 'CentOS', 'Red Hat', 'Windows Server', 'Nginx', 'Apache'
  ],
  'Data Science & AI': [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
    'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'R', 'MATLAB', 'Apache Spark',
    'Hadoop', 'Data Analysis', 'Statistical Analysis', 'Computer Vision', 'NLP'
  ],
  'Cybersecurity': [
    'Network Security', 'Application Security', 'Penetration Testing', 'Ethical Hacking',
    'Cryptography', 'OWASP', 'Security Auditing', 'Vulnerability Assessment', 'Firewall',
    'Intrusion Detection', 'Security Compliance', 'Risk Assessment'
  ],
  'Game Development': [
    'Unity', 'Unreal Engine', 'Godot', 'Cocos2d', 'Phaser', 'Three.js', 'WebGL',
    'OpenGL', 'DirectX', 'Game Design', '2D Graphics', '3D Graphics', 'Physics Engines'
  ],
  'Blockchain & Web3': [
    'Solidity', 'Web3.js', 'Ethers.js', 'Hardhat', 'Truffle', 'Remix', 'MetaMask',
    'IPFS', 'Ethereum', 'Bitcoin', 'Smart Contracts', 'DeFi', 'NFTs', 'DApps'
  ],
  'Testing & QA': [
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'JUnit', 'TestNG',
    'Pytest', 'Unit Testing', 'Integration Testing', 'E2E Testing', 'Performance Testing',
    'Load Testing', 'Security Testing', 'Manual Testing', 'Automated Testing'
  ],
  'Version Control & Tools': [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial', 'VS Code', 'IntelliJ IDEA',
    'Eclipse', 'Vim', 'Emacs', 'Postman', 'Insomnia', 'Figma', 'Adobe XD', 'Sketch'
  ],
  'Other Technologies': [
    'Microservices', 'API Gateway', 'Message Queues', 'RabbitMQ', 'Apache Kafka',
    'Event Sourcing', 'CQRS', 'Serverless', 'Lambda Functions', 'Edge Computing',
    'Progressive Web Apps', 'WebAssembly', 'Electron', 'Tauri'
  ]
};

export const ALL_SKILLS = Object.values(TECH_SKILLS).flat().sort();

export const SKILL_CATEGORIES = Object.keys(TECH_SKILLS);
