import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Megaphone, Plus, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import CreateListingModal from "./CreateListingModal";
import ListingCard from "./ListingCard";
import { getMyListings } from "@/services/listingService";

const DashboardHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const listingsData = await getMyListings();
      setListings(listingsData);
    } catch (error) {
      console.error("Failed to load listings:", error);
      toast({
        title: "Error loading listings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Stats data for better maintainability
  const stats = [
    {
      label: "Total Listings",
      value: listings.length,
      icon: FileText,
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      label: "Active Listings",
      value: listings.filter((l) => l.status === "approved").length,
      icon: Megaphone,
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      label: "Pending Review",
      value: listings.filter((l) => l.status === "pending").length,
      icon: Clock,
      color: "warning",
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
    {
      label: "Rejected",
      value: listings.filter((l) => l.status === "rejected").length,
      icon: AlertCircle,
      color: "destructive",
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Company Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your listings and ads
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Create Listing
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 h-full">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`rounded-full ${stat.bgColor} p-2 sm:p-3 flex-shrink-0`}
                  >
                    <IconComponent
                      className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.textColor}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Listings Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Your Listings</h2>
          {listings.length > 0 && (
            <div className="text-sm text-muted-foreground hidden sm:block">
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 sm:p-12 text-center border-dashed">
              <div className="max-w-md mx-auto space-y-4">
                <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    No listings yet
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Create your first listing to start showcasing your business
                    to potential clients
                  </p>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="lg"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Listing
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="transition-transform duration-200"
              >
                <ListingCard listing={listing} onUpdated={loadData} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Create Listing Modal */}
      <CreateListingModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={loadData}
      />
    </div>
  );
};

export default DashboardHome;
