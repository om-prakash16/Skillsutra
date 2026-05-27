export interface Company {
    [key: string]: any;
}

export interface Job {
    [key: string]: any;
}

export interface Application {
    [key: string]: any;
}

export interface Article {
    [key: string]: any;
}

export interface Talent {
    [key: string]: any;
}

export interface SavedJob {
    [key: string]: any;
}

export interface UserProfile {
    [key: string]: any;
}

export interface User {
    [key: string]: any;
}

export interface GithubRepo {
    [key: string]: any;
}

export interface GithubPR {
    [key: string]: any;
}

export interface GithubAnalysisReport {
    [key: string]: any;
}

export const COMPANIES: any[] = [];
export const INDUSTRIES: any[] = [];
export const SIZES: any[] = [];
export const JOBS: any[] = [];
export const MOCK_GITHUB_REPOS: any[] = [];
export const MOCK_GITHUB_PRS: any[] = [];
export const MOCK_GITHUB_ANALYSIS: any = {};
export const SAVED_JOBS: any[] = [];
export const CATEGORIES: any[] = [];
export const STATS: any[] = [];
export const CAREER_STAGES: any[] = [];
export const EXPERT_TIPS: any[] = [];
export const getAggregatedInsights = (filters?: any): any => ({ stats: { count: 0, avg: 0, median: 0, min: 0, max: 0 }, distribution: [], byExperience: [], byLocation: [] });
export const fetchArticles = async (...args: any[]) => [];

