import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ExternalLink, Eye, CheckCircle2, Archive } from "lucide-react";
import { getMyInquiries, updateInquiryStatus, Inquiry } from "@/services/inquiryService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const LeadManagement = () => {
    const [leads, setLeads] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);

    const loadLeads = async () => {
        try {
            const data = await getMyInquiries();
            setLeads(data);
        } catch (error) {
            console.error("Failed to load leads:", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await updateInquiryStatus(id, status);
            toast.success(`Lead marked as ${status}`);
            loadLeads();
            if (selectedLead?.id === id) {
                setSelectedLead(null);
            }
        } catch (error) {
            console.error("Failed to update lead status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new":
                return <Badge className="bg-blue-500">New</Badge>;
            case "read":
                return <Badge variant="secondary" className="bg-slate-200 text-slate-700">Read</Badge>;
            case "responded":
                return <Badge className="bg-green-500">Responded</Badge>;
            case "archived":
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Lead Management
                    </h2>
                    <p className="text-slate-600">Track and respond to inquiries from potential clients.</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-lg overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-amber-500" />
                        Recent Inquiries
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead>Contact & Message</TableHead>
                                <TableHead>Listing</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        No inquiries received yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => {
                                        setSelectedLead(lead);
                                        if (lead.status === 'new') handleStatusUpdate(lead.id, 'read');
                                    }}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800">{lead.name}</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[200px]">{lead.message}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                                {lead.listing?.title || "Unknown Listing"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:text-amber-600" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedLead(lead);
                                                if (lead.status === 'new') handleStatusUpdate(lead.id, 'read');
                                            }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Lead Detail Dialog */}
            <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <DialogContent className="sm:max-w-[600px] border-slate-200">
                    {selectedLead && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Inquiry Details
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2">
                                    From: <span className="font-semibold text-slate-700">{selectedLead.name}</span>
                                    {getStatusBadge(selectedLead.status)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> Email
                                        </p>
                                        <p className="text-sm text-slate-700">{selectedLead.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> Phone
                                        </p>
                                        <p className="text-sm text-slate-700">{selectedLead.phone || "Not provided"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Received
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            {new Date(selectedLead.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                                            <ExternalLink className="h-3 w-3" /> Related Listing
                                        </p>
                                        <p className="text-sm font-medium text-amber-600">{selectedLead.listing?.title}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Subject</p>
                                    <p className="text-sm font-bold text-slate-800">{selectedLead.subject}</p>
                                </div>

                                <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                                    <p className="text-xs font-semibold text-slate-500 uppercase not-italic">Message</p>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">"{selectedLead.message}"</p>
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                        onClick={() => handleStatusUpdate(selectedLead.id, 'archived')}
                                    >
                                        <Archive className="mr-2 h-4 w-4" /> Archive
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate(selectedLead.id, 'responded')}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Responded
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LeadManagement;
