"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetch";
import { BookOpen, Search, Filter, ShieldCheck, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LearningCatalogPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock fallback if backend is empty for the demo
  const mockCourses = [
    { id: "c1", title: "Advanced React Patterns", difficulty: "advanced", estimated_duration_minutes: 180, granted_skills: ["React", "TypeScript"] },
    { id: "c2", title: "System Design for Product Engineers", difficulty: "intermediate", estimated_duration_minutes: 360, granted_skills: ["System Design", "Architecture"] },
    { id: "c3", title: "Introduction to Generative AI", difficulty: "beginner", estimated_duration_minutes: 90, granted_skills: ["AI", "LLMs"] },
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetchWrapper(`/learning/courses`);
      if (res.success && res.data.length > 0) {
        setCourses(res.data);
      } else {
        setCourses(mockCourses);
      }
    } catch (e) {
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    const toastId = toast.loading("Enrolling...");
    try {
      const res = await fetchWrapper(`/learning/courses/${courseId}/enroll`, {
        method: "POST",
        body: JSON.stringify({}) // mock profile ID used in backend
      });
      if (res.success) {
        toast.success("Enrollment successful!", { id: toastId });
        router.push(`/admin/learning/courses/${courseId}`);
      }
    } catch (e) {
      toast.error("Enrollment failed", { id: toastId });
    }
  };

  if (loading) return <div className="p-8">Loading Catalog...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 h-full flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-muted-foreground mt-1">Develop verified skills that automatically sync to your Talent Identity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <Card key={i} className="flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 bg-indigo-50 border-b flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-indigo-200" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={course.difficulty === 'advanced' ? 'destructive' : course.difficulty === 'intermediate' ? 'default' : 'secondary'} className="mb-2 uppercase text-[10px]">
                  {course.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" /> {Math.round(course.estimated_duration_minutes / 60)}h
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Skills you will verify:</p>
              <div className="flex flex-wrap gap-2">
                {course.granted_skills.map((skill: string, j: number) => (
                  <Badge key={j} variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleEnroll(course.id)}>Enroll Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
