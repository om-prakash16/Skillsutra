"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Send, MessageSquare, Phone, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
           <div className="flex justify-center">
               <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                 Get in Touch
               </Badge>
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
             Let's build the <br />
             <span className="text-primary italic font-black">Future of Hiring</span>
           </h1>
           <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed">
             Whether you're looking to verify your skills, partner with us, or just want to say hello, we're here to listen.
           </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            {/* Left Column: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
                <Card className="glass border-black/5 dark:border-border/50 shadow-premium p-8 rounded-[2rem]">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tight">Direct Connections</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Reach out to the team directly. We typically respond within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground">General Inquiries</p>
                                    <a href="mailto:hello@skillsutra.com" className="text-lg font-medium hover:text-primary transition-colors">hello@skillsutra.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground">Support & Sales</p>
                                    <p className="text-lg font-medium">+1 (555) 000-0000</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground">Headquarters</p>
                                    <p className="text-lg font-medium">100 Innovation Drive<br/>San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
                <Card className="glass border-black/5 dark:border-border/50 shadow-premium p-2 rounded-[2rem] h-full">
                    <CardContent className="p-8 md:p-10 space-y-8 h-full flex flex-col justify-center">
                        {submitted ? (
                            <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <Send className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold">Message Sent!</h3>
                                    <p className="text-muted-foreground">Thank you for reaching out. Our team will get back to you shortly.</p>
                                </div>
                                <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-xl px-8 mt-4">
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                        <MessageSquare className="w-6 h-6 text-primary" /> Drop a Line
                                    </h3>
                                    <p className="text-muted-foreground text-sm">Fill out the form below and we'll route your request to the right node.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                            <Input required placeholder="John Doe" className="h-14 bg-background/50 border-border/50 rounded-xl px-5 focus-visible:ring-primary/20" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                            <Input required type="email" placeholder="john@example.com" className="h-14 bg-background/50 border-border/50 rounded-xl px-5 focus-visible:ring-primary/20" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
                                        <Input required placeholder="How can we help?" className="h-14 bg-background/50 border-border/50 rounded-xl px-5 focus-visible:ring-primary/20" />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                                        <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[160px] bg-background/50 border-border/50 rounded-xl p-5 focus-visible:ring-primary/20 resize-none" />
                                    </div>

                                    <Button disabled={isSubmitting} type="submit" variant="premium" className="w-full h-14 rounded-xl font-bold tracking-widest uppercase text-xs group">
                                        {isSubmitting ? "Sending Transmission..." : "Send Message"}
                                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </div>
  );
}
