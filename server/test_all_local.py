import asyncio
import sys
import json
import warnings

warnings.filterwarnings("ignore", module="google.generativeai")
sys.path.append('e:/Project/Ram/server')

# Import our newly localized services
from modules.ai.services.matcher import JobMatcher
from modules.ai.services.resume_service import resume_service
from modules.ai.services.gap_analyzer import SkillGapAnalyzer
from modules.ai.services.recommender import CareerRecommender
from modules.ai.services.evaluation_service import EvaluationService
from modules.ai.services.analyzer import ResumeAnalyzer

# Mock get_db for testing to prevent DB connection errors
import core.db

class MockDB:
    def table(self, name):
        return self
    def select(self, *args, **kwargs):
        return self
    def insert(self, *args, **kwargs):
        return self
    def upsert(self, *args, **kwargs):
        return self
    def delete(self, *args, **kwargs):
        return self
    def eq(self, *args, **kwargs):
        return self
    def single(self, *args, **kwargs):
        return self
    def execute(self):
        class MockData:
            data = {"extracted_skills": ["Python", "SQL", "Docker"], "required_skills": ["Python", "AWS", "SQL"]}
        return MockData()

core.db.get_db = lambda: MockDB()

async def run_tests():
    print("========== 1. Job Matcher (TF-IDF) ==========")
    matcher = JobMatcher()
    job_results = await matcher.match(
        profile_data={"full_name": "Test User", "skills": ["Python", "React", "Docker"]},
        job_list=[
            {"id": "1", "title": "Backend Dev", "skills_required": ["Python", "Docker"]},
            {"id": "2", "title": "Frontend Dev", "skills_required": ["React", "CSS"]}
        ]
    )
    print(json.dumps(job_results, indent=2))

    print("\n========== 2. Resume Parsing & JD Compare ==========")
    analysis = await resume_service.analyze_resume("user123", "Experienced Python developer with 5+ years of experience in Docker.")
    print("Resume Parse:")
    print(json.dumps(analysis, indent=2))
    
    compare = await resume_service.compare_jd_cv("Backend engineer using Python, AWS, and Docker.", "I am a Python developer who uses Docker.")
    print("\nJD Compare Score:")
    print(json.dumps(compare, indent=2))

    print("\n========== 3. Resume Analyzer (Suggestions) ==========")
    analyzer = ResumeAnalyzer()
    res_analysis = await analyzer.analyze("I know Python and Java but my resume has no Github link.")
    print(json.dumps(res_analysis, indent=2))

    print("\n========== 4. Skill Gap Analyzer ==========")
    gap_analyzer = SkillGapAnalyzer()
    gaps = await gap_analyzer.analyze_gap({"skills": ["Python"]}, "Data Scientist")
    print(json.dumps(gaps, indent=2))

    print("\n========== 5. Career Recommender ==========")
    recommender = CareerRecommender()
    recommendation = await recommender.recommend({"skills": ["React", "CSS", "HTML"]})
    print(json.dumps(recommendation, indent=2))

    print("\n========== 6. Evaluation Service (Proof Score) ==========")
    evaluator = EvaluationService()
    profile = {
        "skills": ["Python", "React", "Docker", "AWS", "SQL"],
        "projects": [{}, {}], # 2 projects
        "experience": [{}, {}, {}] # 3 experiences
    }
    proof_score = await evaluator.calculate_proof_score("user123", profile)
    print(proof_score.model_dump_json(indent=2))

    print("\n✅ All Localized AI components tested successfully!")

if __name__ == "__main__":
    asyncio.run(run_tests())
