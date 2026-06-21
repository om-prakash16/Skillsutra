import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, XCircle, AlertCircle, User, FileText } from "lucide-react"

export interface TimelineEvent {
  id: string
  type: "created" | "updated" | "approved" | "rejected" | "comment" | "system"
  title: string
  description?: string
  timestamp: string
  actor?: {
    name: string
    avatar?: string
  }
}

export interface EnterpriseTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[]
}

const typeIconMap = {
  created: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  updated: <Clock className="h-4 w-4 text-blue-500" />,
  approved: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
  comment: <User className="h-4 w-4 text-purple-500" />,
  system: <AlertCircle className="h-4 w-4 text-yellow-500" />,
}

export function EnterpriseTimeline({ events, className, ...props }: EnterpriseTimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-sm text-muted-foreground p-4 text-center">No activity recorded yet.</div>
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-6 pb-4">
          {index < events.length - 1 && (
            <span className="absolute left-[11px] top-6 h-full w-[2px] bg-border" />
          )}
          <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
            {typeIconMap[event.type] || <FileText className="h-3 w-3 text-muted-foreground" />}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium leading-none">{event.title}</span>
              <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            )}
            {event.actor && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {event.actor.avatar ? (
                    <img src={event.actor.avatar} alt={event.actor.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-medium">{event.actor.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
