<div align="center">
  <img src="https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  
  <br />
  <br />

  <h1>🚀 this best hiring tool</h1>
  <h3>The Ultimate AI-Powered Web3 Talent Marketplace</h3>
  
  <p align="center">
    <b>A disruptive decentralized SaaS platform merging Artificial Intelligence (LangChain + OpenAI) with Solana Web3 to guarantee immutable resume verification, dynamic skill NFTs, and flawless job matching.</b>
  </p>

</div>

---

## 🌟 The Vision

**this best hiring tool** bridges the trust gap between elite candidates and world-class companies. By moving resumes from static PDFs into dynamic, AI-verified, on-chain assets, we make the hiring process completely transparent, verifiable, and instantly matched.

> *LinkedIn shows claims. this best hiring tool proves skills.*

## 🏆 Hackathon-Winning Features

### 🚀 Solana Blinks / Actions (Twitter-Native Hiring) ⭐⭐⭐
- **Direct Apply from Socials:** Recruiter shares a job on X (Twitter), and candidates apply directly via the tweet using Solana Actions. No extra clicks.
- **Spec-Compliant Backend:** Full metadata support for Solana Action discovery and transaction serialization.

### 🎭 Dynamic Profile Engine & Templates ⭐⭐⭐
- **Admin-Managed Schema:** Administrators can inject new profile fields (e.g., "LeetCode URL") in real-time without writing code.
- **Industry Templates:** Switch between Developer, Designer, and Student profile blueprints instantly to suit the candidate's career track.
- **NFT Integrity:** `updateProfileCID()` mechanism updates the underlying on-chain profile metadata (IPFS hash) while keeping the same static SBT.

### 🧠 AI Career Evolution Engine
- **Intelligent Job Matching:** Vector embeddings via LangChain score profiles against job descriptions instantly.
- **Career Path Simulator:** AI-driven roadmap predicting the candidate's next 3 professional milestones based on verified on-chain skill NFTs.
- **Skill Timeline:** A holographic, interactive visualization of the developer's growth from intern to senior engineer.

---

## 📁 Professional Monorepo Structure

```text
this best hiring tool/
├── web/                     # Next.js Frontend (Port: 3011)
├── server/                  # FastAPI AI Backend (Port: 8011)
├── programs/                # Rust Anchor Smart Contracts
├── database/                # Schema Migrations
├── Makefile                 # Unified Command Runner
└── .env.example             # Global Environment Template
```

## 🚀 Quick Setup (Professional Isolation)

This project uses **non-default ports** (3011/8011) to prevent conflicts with your other local projects.

### 1. Automated Setup
The easiest way to get started is using the provided **Makefile**:

```bash
# Install all dependencies (Web & Server)
make install

# Start both development servers (Next.js & FastAPI)
make dev
```

### 2. Manual Boot (Specific Ports)

- **AI Backend (8011)**:
  ```bash
  cd server
  uvicorn main:app --reload --port 8011
  ```

- **Client App (3011)**:
  ```bash
  cd web
  npm run dev  # Automatically uses -p 3011
  ```

### 3. Docker Orchestration
```bash
# Start all services with unique container names
make docker-up
```

## 🛡️ Isolation & Conflict Prevention

To maintain a professional multi-project workflow, this best hiring tool follows these rules:
1. **Port 3011**: Reserved for this best hiring tool Web.
2. **Port 8011**: Reserved for this best hiring tool API.
3. **Container Prefix**: All Docker assets use the `the-best-hiring-tool_` prefix.
4. **Network**: Isolated in `the-best-hiring-tool_talent_network`.

---

<p align="center">
  Engineered with ❤️ for decentralized hiring.
</p>
