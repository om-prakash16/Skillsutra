import { Metadata } from "next";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export const metadata: Metadata = {
  title: "Notifications | SkillSutra",
  description: "Manage your alerts and activity.",
};

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <NotificationCenter />
    </div>
  );
}
