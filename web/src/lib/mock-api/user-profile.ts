export const USER_PROFILE = {
  id: "u-999",
  basic: {
    firstName: "Om",
    lastName: "Prakash",
    title: "Full Stack AI Architect",
    avatar: "/avatars/user-999.png",
    location: "Bengaluru, IN",
    experienceLevel: "Senior",
    completion: 100
  },
  skills: [
    { name: "Next.js", level: "Expert" },
    { name: "FastAPI", level: "Advanced" },
    { name: "Solana", level: "Intermediate" },
    { name: "Gemini AI", level: "Advanced" }
  ]
};

export type UserProfile = any;
