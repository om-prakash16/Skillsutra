export interface Talent {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar?: string;
  location: string;
  experience: string;
  experienceLevel: string;
  skills: string[];
  availability: string;
  completion: number;
  verified: boolean;
}

export const TALENT_DATA: Talent[] = [
  {
    id: "t1",
    name: "Alex Riviera",
    title: "Senior Full Stack Dev",
    role: "Frontend",
    location: "Lisbon, PT",
    experience: "6 Years",
    experienceLevel: "Senior",
    skills: ["React", "TypeScript", "Node.js", "Solana"],
    availability: "Immediate",
    completion: 95,
    verified: true
  },
  {
    id: "t2",
    name: "Sarah Chen",
    title: "AI Research Engineer",
    role: "Backend",
    location: "Singapore",
    experience: "4 Years",
    experienceLevel: "Mid-level",
    skills: ["Python", "PyTorch", "FastAPI", "OpenAI"],
    availability: "2 Weeks",
    completion: 88,
    verified: true
  },
  {
    id: "t3",
    name: "Marcus Thorne",
    title: "Protocol Architect",
    role: "Backend",
    location: "London, UK",
    experience: "8 Years",
    experienceLevel: "Senior",
    skills: ["Rust", "Solana", "Anchor", "Core Rust"],
    availability: "1 Month",
    completion: 100,
    verified: true
  },
  {
    id: "t4",
    name: "Elena Rodriguez",
    title: "Product Designer",
    role: "Design",
    location: "Madrid, ES",
    experience: "3 Years",
    experienceLevel: "Junior",
    skills: ["Figma", "UI/UX", "Tailwind", "Framer"],
    availability: "Immediate",
    completion: 82,
    verified: false
  },
  {
    id: "t5",
    name: "Jordan Smith",
    title: "Data Scientist",
    role: "Data",
    location: "Austin, TX",
    experience: "5 Years",
    experienceLevel: "Mid-level",
    skills: ["SQL", "Pandas", "Scikit-Learn", "Tableau"],
    availability: "Immediate",
    completion: 90,
    verified: true
  }
];
