export interface SalaryInsight {
  stats: {
    avg: number;
    median: number;
    min: number;
    max: number;
    count: number;
  };
  distribution: { label: string; value: number }[];
  byExperience: { range: string; avg: number; min: number; max: number }[];
  byLocation: { location: string; avg: number }[];
}

export const getAggregatedInsights = async (filters: any): Promise<SalaryInsight> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    stats: {
      avg: 18.5,
      median: 16.2,
      min: 8.5,
      max: 42.0,
      count: 1250
    },
    distribution: [
      { label: '8-12 LPA', value: 150 },
      { label: '12-18 LPA', value: 450 },
      { label: '18-25 LPA', value: 380 },
      { label: '25-35 LPA', value: 180 },
      { label: '35+ LPA', value: 90 }
    ],
    byExperience: [
      { range: '0-2 Years', avg: 10.5, min: 8.5, max: 15.0 },
      { range: '2-5 Years', avg: 18.2, min: 14.0, max: 28.0 },
      { range: '5+ Years', avg: 32.5, min: 25.0, max: 45.0 }
    ],
    byLocation: [
      { location: 'Bengaluru', avg: 22.4 },
      { location: 'Hyderabad', avg: 19.8 },
      { location: 'Pune', avg: 18.2 },
      { location: 'Remote', avg: 21.5 }
    ]
  };
};
