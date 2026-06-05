import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Download, Mail, Briefcase, CheckCircle2, MessageSquare, Github, Figma, Linkedin, Dribbble, Codepen, Twitter, Youtube, Link as LinkIcon, Code2, Globe2, Loader2 } from "lucide-react"
import { UserProfile } from '@/types'
import Link from 'next/link'
import { api } from "@/lib/api/api-client"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

const getBrandConfig = (platform: string) => {
    if (!platform) return { icon: LinkIcon, color: 'bg-primary/10 text-primary hover:bg-primary/20', label: 'Link' };
    const p = platform.toLowerCase();
    if (p.includes('github')) return { icon: Github, color: 'bg-[#24292e] text-white hover:bg-[#24292e]/90', label: 'GitHub' };
    if (p.includes('linkedin')) return { icon: Linkedin, color: 'bg-[#0077b5] text-white hover:bg-[#0077b5]/90', label: 'LinkedIn' };
    if (p.includes('figma')) return { icon: Figma, color: 'bg-[#F24E1E] text-white hover:bg-[#F24E1E]/90', label: 'Figma' };
    if (p.includes('dribbble')) return { icon: Dribbble, color: 'bg-[#ea4c89] text-white hover:bg-[#ea4c89]/90', label: 'Dribbble' };
    if (p.includes('behance')) return { icon: Globe2, color: 'bg-[#1769ff] text-white hover:bg-[#1769ff]/90', label: 'Behance' };
    if (p.includes('twitter') || p.includes('x.com')) return { icon: Twitter, color: 'bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90', label: 'Twitter' };
    if (p.includes('youtube')) return { icon: Youtube, color: 'bg-[#FF0000] text-white hover:bg-[#FF0000]/90', label: 'YouTube' };
    if (p.includes('leetcode')) return { icon: Code2, color: 'bg-[#FFA116] text-white hover:bg-[#FFA116]/90', label: 'LeetCode' };
    if (p.includes('codepen')) return { icon: Codepen, color: 'bg-[#000000] text-white hover:bg-[#000000]/90', label: 'CodePen' };
    return { icon: LinkIcon, color: 'bg-primary/10 text-primary hover:bg-primary/20', label: platform };
};
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PublicProfileHeaderProps {
    user: UserProfile["basic"] & { id: string }
}

export function PublicProfileHeader({ user }: PublicProfileHeaderProps) {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [isSending, setIsSending] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsSending(true);
        try {
            const res = await api.messages.startConversation({
                receiver_id: user.id,
                subject: subject,
                initial_message: message
            });

            if (res) {
                toast.success("Message sent successfully!");
                setIsOpen(false);
                router.push("/user/messages");
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while sending the message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-background border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full md:w-auto">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left space-y-2 flex-1">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-heading">{user.firstName} {user.lastName}</h1>
                        <p className="text-lg text-muted-foreground font-medium">{user.title}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <Briefcase className="w-4 h-4" />
                            <span>{user.experienceLevel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{user.jobType}</span>
                        </div>
                    </div>

                    {/* Themed Social Links */}
                    {(user as any).socialLinks?.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                            {(user as any).socialLinks.map((link: any, idx: number) => {
                                const brand = getBrandConfig(link.platform);
                                const Icon = brand.icon;
                                let href = link.url;
                                if (!href.startsWith('http') && !href.startsWith('https')) {
                                    if (link.platform.toLowerCase() === 'github') href = `https://github.com/${href}`;
                                    else if (link.platform.toLowerCase() === 'leetcode') href = `https://leetcode.com/${href}`;
                                    else if (link.platform.toLowerCase() === 'behance') href = `https://behance.net/${href}`;
                                    else if (link.platform.toLowerCase() === 'linkedin') href = `https://linkedin.com/in/${href}`;
                                    else href = `https://${href}`;
                                }
                                return (
                                    <Link key={idx} href={href} target="_blank" rel="noopener noreferrer">
                                        <Badge className={`px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer shadow-sm ${brand.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold tracking-wide">{brand.label}</span>
                                        </Badge>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Dialog open={isOpen} onOpenChange={(open) => {
                    if (open && !currentUser) {
                        toast.error("You need an account to send a message.");
                        router.push("/auth/login");
                        return;
                    }
                    setIsOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Message {user.firstName}</DialogTitle>
                            <DialogDescription>
                                Send a message directly to their inbox.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Send a message</Label>
                                <Input 
                                    placeholder="Subject (optional)" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                <Textarea 
                                    placeholder="Hi, I'd like to discuss a job opportunity..." 
                                    className="min-h-[100px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSendMessage} disabled={isSending}>
                                {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Send Message
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto" variant="outline">
                            Contact Info
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Contact {user.firstName}</DialogTitle>
                            <DialogDescription>
                                Contact details for {user.firstName} {user.lastName}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-muted-foreground">Email</Label>
                                <div className="col-span-3 font-medium select-all">{user.email || "Not provided"}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-muted-foreground">Phone</Label>
                                <div className="col-span-3 font-medium select-all">{user.phone || "Not provided"}</div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                
                <Button className="w-full sm:w-auto" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                </Button>
            </div>
        </div>
    )
}
