import API from "../api/API";

// console.log("🔗 API Base URL:", API.defaults.baseURL);

// ✅ Fetch all contacts (for admin)
export const getContacts = async () => {
  const res = await API.get("/contact");
  return res.data;
};

// ✅ Delete contact (for admin)
export const deleteContact = async (id: string) => {
  const res = await API.delete(`/contact/${id}`);
  return res.data;
};

// ✅ Update status (for admin)
export const updateContactStatus = async (id: string, status: string) => {
  const { data } = await API.patch(`/contact/${id}`, { status });
  return data;
};