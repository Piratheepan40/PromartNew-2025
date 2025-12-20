import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, Settings as SettingsIcon, MessageSquare } from "lucide-react";

interface SidebarProps {
  activeSection: "dashboard" | "leads" | "settings";
  setActiveSection: (section: "dashboard" | "leads" | "settings") => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => (
  <aside className="w-64 shrink-0">
    <Card className="sticky top-4 p-4">
      <div className="mb-4">
        <h2 className="font-semibold">Company Panel</h2>
        <p className="text-xs text-muted-foreground">Manage your business</p>
      </div>
      <nav className="space-y-1">
        <Button
          variant={activeSection === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </Button>

        <Button
          variant={activeSection === "leads" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("leads")}
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Leads (Inquiries)
        </Button>

        <Button
          variant={activeSection === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("settings")}
        >
          <SettingsIcon className="mr-2 h-4 w-4" /> Account Settings
        </Button>
      </nav>
    </Card>
  </aside>
);

export default Sidebar;
