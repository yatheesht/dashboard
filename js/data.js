/* SEED - demo data. Loaded by Store if localStorage empty. Superset for Track A + Track B. */
(function () {
  // Build 140-day activity map (date -> intensity 0..5), deterministic
  function buildActivity() {
    const map = {};
    const today = new Date("2026-10-01");
    let seed = 42;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 139; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      map[k] = Math.floor(rnd() * 6);
    }
    // guarantee recent streak
    const keys = Object.keys(map).sort();
    keys.slice(-23).forEach(k => { if (map[k] < 1) map[k] = 2 + Math.floor(Math.random() * 0); map[k] = Math.max(map[k], 2); });
    return map;
  }
  const activityMap = buildActivity();
  const activitySeries = Object.values(activityMap).map(v => v * 2); // 0..10 scale for Track A bars/heat

  window.SEED = {
    student: {
      name: "Aarav Mehta",
      email: "aarav.mehta@univ.edu",
      uni: "Northbridge University",
      sem: "Sem 5",
      major: "Computer Science",
      gradYear: 2027,
      bio: "CS undergrad into full-stack + ML. Building in public, shipping every weekend.",
      gpa: 8.74,
      xp: 12480,
      streak: 23,
      avatarHue: 345,
      level: 12
    },
    semesters: [
      {
        id: "Sem1", gpa: 8.2,
        courses: [
          { code: "CS101", subject: "Intro to Programming", credits: 4, marks: 86, grade: "A", status: "Pass" },
          { code: "MA101", subject: "Calculus I", credits: 4, marks: 78, grade: "B+", status: "Pass" },
          { code: "PH101", subject: "Physics I", credits: 3, marks: 81, grade: "A-", status: "Pass" },
          { code: "EN101", subject: "Technical Writing", credits: 2, marks: 88, grade: "A", status: "Pass" },
          { code: "EE101", subject: "Digital Logic", credits: 3, marks: 74, grade: "B", status: "Pass" },
          { code: "WS101", subject: "Workshop Practice", credits: 2, marks: 92, grade: "A+", status: "Pass" }
        ]
      },
      {
        id: "Sem2", gpa: 8.5,
        courses: [
          { code: "CS201", subject: "Data Structures", credits: 4, marks: 89, grade: "A", status: "Pass" },
          { code: "MA201", subject: "Linear Algebra", credits: 4, marks: 82, grade: "A-", status: "Pass" },
          { code: "CS202", subject: "OOP with Java", credits: 3, marks: 90, grade: "A+", status: "Pass" },
          { code: "EC201", subject: "Computer Organisation", credits: 3, marks: 76, grade: "B+", status: "Pass" },
          { code: "HS201", subject: "Economics for Engineers", credits: 2, marks: 84, grade: "A-", status: "Pass" },
          { code: "CS203", subject: "Web Fundamentals Lab", credits: 2, marks: 95, grade: "A+", status: "Pass" }
        ]
      },
      {
        id: "Sem3", gpa: 8.9,
        courses: [
          { code: "CS301", subject: "Algorithms", credits: 4, marks: 91, grade: "A+", status: "Pass" },
          { code: "CS302", subject: "DBMS", credits: 4, marks: 88, grade: "A", status: "Pass" },
          { code: "CS303", subject: "Operating Systems", credits: 4, marks: 85, grade: "A", status: "Pass" },
          { code: "MA301", subject: "Probability & Stats", credits: 3, marks: 87, grade: "A", status: "Pass" },
          { code: "CS304", subject: "CN Basics", credits: 3, marks: 83, grade: "A-", status: "Pass" },
          { code: "EL301", subject: "Open Source Lab", credits: 2, marks: 96, grade: "A+", status: "Pass" }
        ]
      },
      {
        id: "Sem4", gpa: 9.1,
        courses: [
          { code: "CS401", subject: "Machine Learning", credits: 4, marks: 93, grade: "A+", status: "Pass" },
          { code: "CS402", subject: "Full-Stack Engineering", credits: 4, marks: 94, grade: "A+", status: "Pass" },
          { code: "CS403", subject: "Cloud & DevOps", credits: 3, marks: 89, grade: "A", status: "Pass" },
          { code: "CS404", subject: "UI Engineering", credits: 3, marks: 92, grade: "A+", status: "Pass" },
          { code: "MA401", subject: "Discrete Optimisation", credits: 3, marks: 86, grade: "A", status: "Pass" },
          { code: "PR401", subject: "Capstone Phase I", credits: 3, marks: 90, grade: "A", status: "Pass" }
        ]
      }
    ],
    projects: [
      { id: "p1", title: "AttendX — smart attendance", stack: ["Next.js", "Supabase", "ML"], status: "Live", stars: 214, desc: "Face + QR attendance with 98.2% precision. Used by 3 campus clubs.", cat: "AI", updated: "2026-09-18", grad: "linear-gradient(135deg,#1C1C1C,#A90533)" },
      { id: "p2", title: "Notesplice AI", stack: ["Python", "LangChain", "React"], status: "Building", stars: 96, desc: "Lecture notes → flashcards + quizzes. 2k summaries generated.", cat: "AI", updated: "2026-09-02", grad: "linear-gradient(135deg,#3A2B00,#D99A00)" },
      { id: "p3", title: "CampusKart", stack: ["MERN", "Stripe"], status: "Live", stars: 178, desc: "Second-hand marketplace for hostel. 450+ listings, ₹1.2L GMV.", cat: "Web", updated: "2026-08-21", grad: "linear-gradient(135deg,#0B2A4A,#2E7DD1)" },
      { id: "p4", title: "Pathfinder Visualiser", stack: ["TypeScript", "Canvas"], status: "Archived", stars: 64, desc: "A*, Dijkstra, BFS visualised. 40k views on demo video.", cat: "Design", updated: "2026-07-11", grad: "linear-gradient(135deg,#2A0B2E,#9B30D1)" }
    ],
    // Track B expects object map; Track A uses array series. Provide both.
    activity: activityMap,
    activitySeries: activitySeries,
    languages: [
      { label: "Python", v: 38 },
      { label: "JavaScript", v: 27 },
      { label: "C++", v: 15 },
      { label: "SQL", v: 12 },
      { label: "Dart", v: 8 }
    ],
    certs: [
      { id: "c1", title: "AWS Cloud Practitioner", issuer: "Amazon", date: "2026-06-12", url: "#", cat: "Cloud", cred: "AWS-88120" },
      { id: "c2", title: "Meta Front-End Professional", issuer: "Meta / Coursera", date: "2026-04-02", url: "#", cat: "Web", cred: "META-44201" },
      { id: "c3", title: "DeepLearning.AI ML Specialization", issuer: "Stanford", date: "2025-12-18", url: "#", cat: "AI", cred: "DLAI-99012" },
      { id: "c4", title: "Google Data Analytics", issuer: "Google", date: "2025-09-30", url: "#", cat: "Cloud", cred: "GOOG-77310" }
    ],
    deadlines: [
      { id: "d1", title: "ML Assignment 4 — CNNs", course: "CS401", due: "Oct 03", priority: "High" },
      { id: "d2", title: "Capstone Phase I report", course: "PR401", due: "Oct 07", priority: "High" },
      { id: "d3", title: "Cloud lab — CI/CD pipeline", course: "CS403", due: "Oct 09", priority: "Med" },
      { id: "d4", title: "UI Eng prototype v2", course: "CS404", due: "Oct 12", priority: "Med" },
      { id: "d5", title: "Optimisation quiz", course: "MA401", due: "Oct 14", priority: "Low" }
    ],
    pendingUploads: []
  };
})();
