<div align="center">
  <img src="https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  
  <br />
  <br />

  <h1>🚀 Skillsutra</h1>
  <h3>The Ultimate AI-Powered Web3 Talent Marketplace</h3>
  
  <p align="center">
    <b>A disruptive decentralized SaaS platform merging Artificial Intelligence (LangChain + OpenAI) with Solana Web3 to guarantee immutable resume verification, dynamic skill NFTs, and flawless job matching.</b>
  </p>

</div>

---

## 🌟 The Vision

**Skillsutra** bridges the trust gap between elite candidates and world-class companies. By moving resumes from static PDFs into dynamic, AI-verified, on-chain assets, we make the hiring process completely transparent, verifiable, and instantly matched.

> *LinkedIn shows claims. Skillsutra proves skills.*

## 🏆 Hackathon-Winning Features

### 🧠 Advanced AI Agentic Engine
- **Intelligent Job Matching:** Vector embeddings via LangChain score candidate profiles against job postings instantly (e.g., "94% Match").
- **Resume Parser:** FastAPI + OpenAI pipeline effortlessly converts messy PDF resumes into cleanly structured JSON metadata.
- **AI Mentor Routing:** An embeddings-based recommendation engine connects candidates with senior Web3 mentors based on real-time skill gaps.

### ⛓️ Solana Blockchain Integration
- **Dynamic Skill NFTs:** SBTs (Soulbound Tokens) whose IPFS metadata evolves and updates on-chain as the candidate completes micro-jobs and expands their GitHub repository.
- **On-Chain Project Ledger:** Immutable proof-of-work hashes securely tying candidates to confirmed git commits.
- **Zero-Friction Smart Contracts:** Anchor-based escrow system for micro-jobs, enabling companies to lock USDC bounties and algorithmically disburse them upon task completion.

### 📊 Modern Web3 SaaS Architecture
- **Dual-State Storage:** Immutable cryptographic verification permanently locked on Solana; intensive UI rendering and candidate data flawlessly scaled on Supabase PostgreSQL.
- **Micro-Job Marketplace:** Complete hiring pipeline bridging standard full-time roles with modular, bounty-driven freelance gigs.
- **Proof-of-Work Ranking:** Cumulative scoring algorithms calculating GitHub traction, peer referrals, and Web3 interactions.

---

## 📁 Monorepo Structure

```text
Skillsutra/
├── web/                     # Next.js 14 Frontend (App Router, Tailwind, Shadcn UI)
├── server/                  # Python FastAPI AI Backend (LangChain, Pydantic)
├── programs/                # Rust Anchor Smart Contracts (Solana Web3 state handling)
├── database/                # Supabase PostgreSQL schema migrations
└── docker-compose.yml       # Production-ready orchestration
```

## 🚀 Quick Setup

1. **Deploy the Database**
   Import the dual-state database blueprint via `/database/migrations/001_init.sql` into Supabase.

2. **Boot the AI Backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Launch the Client App**
   ```bash
   cd web
   npm install
   npm run dev
   ```

4. **Deploy Smart Contracts (Localnet)**
   ```bash
   cd programs
   anchor build
   anchor deploy
   ```

---

<p align="center">
  Engineered with ❤️ for decentralized hiring.
</p>
