import json
from typing import Optional, Dict


class PitchEngine:
    """
    AI Career Pitch Engine
    
    Generates a full, structured startup pitch for the AI Career Operating System.
    Includes methods to generate or refine individual sections and compile a full pitch.
    """

    def __init__(self):
        self.context = {
            "product_name": "AI Career Operating System"
        }

    def _refine_or_generate(self, existing_text: Optional[str], default_content: str) -> str:
        """
        In a production LLM pipeline, this would format a prompt asking the AI
        to refine `existing_text` if it exists. Since no external dependencies 
        are required for this module, it returns the standard structured content.
        """
        # If we had an AI client, we would do:
        # if existing_text: return ai.refine(existing_text, default_content)
        return default_content

    def generate_problem(self, existing_text: Optional[str] = None) -> str:
        content = (
            "1️⃣ PROBLEM\n"
            "---------------------------------\n"
            "“Hiring is broken because we trust resumes, not real skills.”\n\n"
            "👨‍💻 Candidates Problems:\n"
            "- ATS rejection due to keyword mismatch\n"
            "- No proof of real skills before the interview stage\n\n"
            "🏢 Companies Problems:\n"
            "- Too many irrelevant/fake applications\n"
            "- Bad hires increase cost and reduce team velocity\n\n"
            "🧑‍💼 Recruiters Problems:\n"
            "- Manual resume filtering is time-consuming and subjective\n"
            "- Biased or inefficient decisions\n\n"
            "“The real problem is the absence of a trusted skill verification layer in hiring.”"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_idea(self, existing_text: Optional[str] = None) -> str:
        content = (
            "2️⃣ IDEA\n"
            "---------------------------------\n"
            "“We convert resume-based hiring into skill-based verified hiring.”\n\n"
            "- AI-based skill validation to measure real capability\n"
            "- Replace resumes with verified skill profiles\n"
            "- Skill-first matching instead of keyword heuristics"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_solution(self, existing_text: Optional[str] = None) -> str:
        content = (
            "3️⃣ SOLUTION\n"
            "---------------------------------\n"
            "“We analyze real work → generate Proof Score → match jobs → verify candidates.”\n\n"
            "🔍 Pipeline:\n"
            "1. AI project analysis: Analyzes code, repos, and work samples.\n"
            "2. Proof Score: Generates a dynamic trust score based on skill depth.\n"
            "3. Job matching: Maps candidates to jobs using semantic skill intelligence.\n"
            "4. AI interview questions: Auto-generates personalized questions based on real work.\n"
            "5. Verification: Anti-cheating layer to ensure authenticity.\n\n"
            "⚡ Formula:\n"
            "AI → Proof Score → Match → Questions → Hire"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_features(self, existing_text: Optional[str] = None) -> str:
        content = (
            "4️⃣ FEATURES\n"
            "---------------------------------\n"
            "🔹 Core (Hiring Engine):\n"
            "1. AI Skill Analysis\n"
            "2. Proof Score\n"
            "3. Smart Job Matching\n"
            "4. AI Interview Questions\n"
            "5. GitHub Verification\n\n"
            "🔹 Advanced (Big Vision):\n"
            "1. Career Planning\n"
            "2. Skill Gap Analysis\n"
            "3. Public/Private Profiles\n"
            "4. Community & Learning\n"
            "5. Blockchain Verification\n\n"
            "“5 core + 5 advanced = full system.”"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_flow(self, existing_text: Optional[str] = None) -> str:
        content = (
            "5️⃣ FLOW\n"
            "---------------------------------\n"
            "“From profile to hiring decision in seconds.”\n\n"
            "Steps:\n"
            "Profile → AI Analysis → Proof Score → Job Match → Questions → Hiring"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_impact_vision(self, existing_text: Optional[str] = None) -> str:
        content = (
            "6️⃣ IMPACT + VISION\n"
            "---------------------------------\n"
            "🎯 Impact:\n"
            "- Candidates → Get a fair chance based on real skills\n"
            "- Companies → Hire better, faster, and with confidence\n"
            "- Recruiters → Save hours of manual filtering\n\n"
            "“This is not just a hiring tool — it’s a Career Operating System.”"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_final(self, existing_text: Optional[str] = None) -> str:
        content = (
            "7️⃣ FINAL LINE + MEMORY\n"
            "---------------------------------\n"
            "🔥 Final Line:\n"
            "“Hiring should not be based on keywords…\n"
            "it should be based on proof.”\n\n"
            "🧠 Memory Hack:\n"
            "P I S F F V\n"
            "Problem\n"
            "Idea\n"
            "Solution\n"
            "Features\n"
            "Flow\n"
            "Vision"
        )
        return self._refine_or_generate(existing_text, content)

    def generate_full_pitch(self, existing_sections: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """
        Compiles the complete pitch, allowing selective inclusion of existing texts.
        """
        e = existing_sections or {}
        
        problem = self.generate_problem(e.get("problem"))
        idea = self.generate_idea(e.get("idea"))
        solution = self.generate_solution(e.get("solution"))
        features = self.generate_features(e.get("features"))
        flow = self.generate_flow(e.get("flow"))
        impact_vision = self.generate_impact_vision(e.get("impact_vision"))
        final = self.generate_final(e.get("final"))

        full_pitch_text = "\n\n=================================\n\n".join([
            problem, idea, solution, features, flow, impact_vision, final
        ])

        return {
            "problem": problem,
            "idea": idea,
            "solution": solution,
            "features": features,
            "flow": flow,
            "impact_vision": impact_vision,
            "final": final,
            "full_pitch": full_pitch_text
        }

    def export_as_markdown(self, filename: str = "pitch_deck_script.md", existing_sections: Optional[Dict] = None):
        """
        Exports the entire generated pitch into a cleanly formatted markdown file.
        """
        pitch_data = self.generate_full_pitch(existing_sections)
        with open(filename, "w", encoding="utf-8") as f:
            f.write("# AI Career Operating System — Pitch Script\n\n")
            f.write(pitch_data["full_pitch"])
        return filename


# ==========================================
# CLI Usage Example
# ==========================================
if __name__ == "__main__":
    import json
    
    engine = PitchEngine()
    
    # Generate the payload
    pitch_data = engine.generate_full_pitch()
    
    # Save the markdown export
    output_file = engine.export_as_markdown()
    print(f"✅ Marked down script exported to: {output_file}")
    
    # Print a JSON summary showing it meets the output spec
    print("\n📦 Structured Output (JSON Example):")
    print(json.dumps({k: v[:50] + "..." for k, v in pitch_data.items() if k != 'full_pitch'}, indent=2))
