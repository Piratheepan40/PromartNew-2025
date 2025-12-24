import API from "../api/API";

// 🧱 Admin API functions
const adminApi = {
  // ✅ Dashboard Stats
  getStats: async () => {
    const { data } = await API.get("/admin/stats");
    return data;
  },

  // ✅ Get all companies
  getCompanies: async () => {
    const { data } = await API.get("/admin/companies");
    return data;
  },
  // ✅ Reset user password
  resetPassword: async (id) => {
    const res = await API.patch(`/admin/reset-password/${id}`);
    return res.data;
  },
  // ✅ Reactivate user account
  reactivateUser: async (id) => {
    const res = await API.patch(`/admin/reactivate/${id}`);
    return res.data;
  },
  // ✅ Deactivate user account
  deactivateUser: async (id) => {
    const res = await API.patch(`/admin/deactivate/${id}`);
    return res.data;
  },
  // ✅ Get all listings
  // adminService.ts
  getListings: async (params?: any) => {
    const { data } = await API.get("/admin/listings", { params });
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.listings)) return data.listings;
    return [];
  },

  // ✅ Approve listing
  approveListing: async (listingId: string) => {
    const { data } = await API.put(`/admin/listings/${listingId}/approved`);
    return data;
  },

  // ✅ Reject listing
  // In your adminApi service
  rejectListing: async (listingId: string, reason: string) => {
    const res = await API.put(`/admin/listings/${listingId}/reject`, { reason });
    return res.data;
  },

  // ✅ Delete listing
  deleteListing: async (listingId: string) => {
    const { data } = await API.delete(`/admin/listings/${listingId}`);
    return data;
  },

  // ✅ Delete company (and all its listings)
  deleteCompany: async (companyId: string) => {
    const { data } = await API.delete(`/admin/companies/${companyId}`);
    return data;
  },
  // ✅ Get monthly stats for charts
  getMonthlyStats: async () => {
    const { data } = await API.get("/admin/listings/monthly");
    return data;
  },

};


export default adminApi;
