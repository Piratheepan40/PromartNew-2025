import axios from "axios";

const API_URL = "http://localhost:5000/api/inquiries";

export interface InquiryDTO {
    listingId: number | string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface Inquiry extends InquiryDTO {
    id: number;
    companyId: number;
    status: "new" | "read" | "responded" | "archived";
    createdAt: string;
    listing?: {
        title: string;
        category: string;
    };
}

export const sendInquiry = async (inquiryData: InquiryDTO) => {
    const response = await axios.post(API_URL, inquiryData);
    return response.data;
};

export const getMyInquiries = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const updateInquiryStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
        `${API_URL}/${id}`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
