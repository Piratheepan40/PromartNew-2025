import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import NotificationCenter from "@/components/NotificationCenter";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings as SettingsIcon, ChevronDown, ChevronUp } from "lucide-react";
import DashboardHome from "@/components/CompanyDashboard/dashboardHome";
import Settings from "./Settings";
import LeadManagement from "@/components/CompanyDashboard/LeadManagement";
import type { Notification } from "@/types";
import { getNotifications, markAllAsRead, markAsRead } from "@/services/notificationService";
import Sidebar from "@/components/CompanyDashboard/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "leads" | "settings">("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadData = async () => {
    try {
      // ✅ FIX: Actually call the function with parentheses
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        unreadCount={notifications.filter(n => !n.read).length}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={async (id) => {
            await markAsRead(id); // ✅ This should also be called with parentheses if it takes parameters
            loadData();
          }}
          onMarkAllRead={async () => {
            await markAllAsRead(); // ✅ FIX: Call the function
            loadData();
          }}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2">
                    <Menu className="h-4 w-4" />
                    Dashboard Menu
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{activeSection}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="py-4 h-full">
                  <Sidebar
                    activeSection={activeSection}
                    setActiveSection={(section) => {
                      setActiveSection(section);
                      // Sheet closes automatically on interaction if configured or we rely on user clicking outside
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "dashboard" && <DashboardHome />}
              {activeSection === "leads" && <LeadManagement />}
              {activeSection === "settings" && <Settings />}
            </motion.div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;