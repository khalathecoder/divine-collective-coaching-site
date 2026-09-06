import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { filterSubmissions, getSubmissionTypeLabel } from "@/lib/adminSubmissionUtils";

export default function AdminDashboard() {
  const { user, loading, refresh } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("submissions");

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!user || user.role !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage customers, orders, submissions, and view analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <SubmissionsTab selectedSubmission={selectedSubmission} setSelectedSubmission={setSelectedSubmission} />
          </TabsContent>

          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SubmissionsTab({ selectedSubmission, setSelectedSubmission }: any) {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { data: submissionsData, isLoading, refetch } = trpc.admin.getSubmissions.useQuery({
    limit: 50,
    offset: 0,
  });
  const exportMutation = trpc.admin.exportSubmissionsAsCSV.useQuery();
  const markAsReadMutation = trpc.admin.markAsRead.useMutation();
  const importMutation = trpc.admin.importSFHVAttendees.useMutation();
  const removeDuplicatesMutation = trpc.admin.removeDuplicates.useQuery();
  const [showRemoveDuplicatesConfirm, setShowRemoveDuplicatesConfirm] = useState(false);

  // Filter submissions based on selected type
  const filteredSubmissions = filterSubmissions(submissionsData?.submissions as any[] | undefined, filterType);

  const handleExportCSV = () => {
    if (exportMutation.data?.csv) {
      const element = document.createElement("a");
      const file = new Blob([exportMutation.data.csv], { type: "text/csv" });
      element.href = URL.createObjectURL(file);
      element.download = exportMutation.data.filename || "submissions.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getSubmissionTypeColor = (type: string) => {
    switch (type) {
      case "contact": return "bg-blue-100 text-blue-800";
      case "survey": return "bg-green-100 text-green-800";
      case "assessment": return "bg-purple-100 text-purple-800";
      case "lead_magnet": return "bg-orange-100 text-orange-800";
      case "waitlist": return "bg-yellow-100 text-yellow-800";
      case "bold_out": return "bg-pink-100 text-pink-800";
      case "she_found_her_voice_event": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleImportCSV = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    try {
      await importMutation.mutateAsync({ csvData: text });
      setImportFile(null);
      refetch();
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const handleRemoveDuplicates = async () => {
    try {
      await removeDuplicatesMutation.refetch();
      setShowRemoveDuplicatesConfirm(false);
      refetch();
    } catch (error) {
      console.error("Failed to remove duplicates:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer Submissions</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowRemoveDuplicatesConfirm(true)}
                disabled={removeDuplicatesMutation.isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                Remove Duplicates
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={exportMutation.isLoading || !exportMutation.data}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-900">Import She Found Her Voice Event Attendees</h3>
                <div className="flex items-center gap-3">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                  </label>
                  <Button
                    onClick={handleImportCSV}
                    disabled={!importFile || importMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {importMutation.isPending ? "Importing..." : "Import"}
                  </Button>
                </div>
                {importFile && <p className="text-sm text-blue-700">Selected: {importFile.name}</p>}
                {importMutation.data && <p className="text-sm text-green-700">✓ {importMutation.data.message}</p>}
              </div>
            </CardContent>
          </Card>

          {showRemoveDuplicatesConfirm && (
            <Card className="bg-yellow-50 border-yellow-200 mb-4">
              <CardContent className="pt-6">
                <p className="mb-4 text-yellow-900">This will remove duplicate submissions by email, keeping only the most recent entry for each email address. Continue?</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRemoveDuplicates}
                    disabled={removeDuplicatesMutation.isLoading}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {removeDuplicatesMutation.isLoading ? "Removing..." : "Yes, Remove Duplicates"}
                  </Button>
                  <Button
                    onClick={() => setShowRemoveDuplicatesConfirm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
                {removeDuplicatesMutation.data && <p className="text-sm text-green-700 mt-2">✓ {removeDuplicatesMutation.data.message}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading submissions...</p>
            </CardContent>
          </Card>
        ) : !filteredSubmissions || filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No submissions yet</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-4">
              <Button
                variant={filterType === null ? "default" : "outline"}
                onClick={() => setFilterType(null)}
                size="sm"
              >
                All ({submissionsData?.submissions?.length || 0})
              </Button>
              <Button
                variant={filterType === "bold_out" ? "default" : "outline"}
                onClick={() => setFilterType("bold_out")}
                size="sm"
              >
                B.O.L.D. OUT ({submissionsData?.submissions?.filter((s: any) => s.submissionType === "bold_out").length || 0})
              </Button>
              <Button
                variant={filterType === "waitlist" ? "default" : "outline"}
                onClick={() => setFilterType("waitlist")}
                size="sm"
              >
                Waitlist ({submissionsData?.submissions?.filter((s: any) => s.submissionType === "waitlist").length || 0})
              </Button>
            </div>
            <div className="space-y-4">
              {filteredSubmissions.map((submission: any) => (
              <Card
                key={submission.id}
                className={`cursor-pointer transition-all ${
                  selectedSubmission?.id === submission.id ? "ring-2 ring-brand-gold" : "hover:shadow-md"
                } ${submission.isRead === 0 ? "border-l-4 border-l-brand-gold" : ""}`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{submission.customerName}</CardTitle>
                      <CardDescription>{submission.customerEmail}</CardDescription>
                    </div>
                    <Badge className={getSubmissionTypeColor(submission.submissionType)}>
                      {getSubmissionTypeLabel(submission.submissionType)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{submission.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        {selectedSubmission ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Type</p>
                <Badge className={getSubmissionTypeColor(selectedSubmission.submissionType)}>
                  {getSubmissionTypeLabel(selectedSubmission.submissionType)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Name</p>
                <p className="text-foreground">{selectedSubmission.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Email</p>
                <a href={`mailto:${selectedSubmission.customerEmail}`} className="text-brand-gold hover:underline">
                  {selectedSubmission.customerEmail}
                </a>
              </div>
              {selectedSubmission.customerPhone && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                  <a href={`tel:${selectedSubmission.customerPhone}`} className="text-brand-gold hover:underline">
                    {selectedSubmission.customerPhone}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Submitted</p>
                <p className="text-foreground">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
              </div>
              {selectedSubmission.submissionType === "bold_out" && selectedSubmission.metadata && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Registration Details</p>
                  <div className="bg-muted p-3 rounded text-sm space-y-2">
                    {(() => {
                      try {
                        const metadata = JSON.parse(selectedSubmission.metadata);
                        return (
                          <>
                            <p><span className="font-semibold">Offer:</span> {metadata.historical_tier === "vip" ? "Historical VIP ($97)" : "General Admission ($47)"}</p>
                            <p><span className="font-semibold">GHL Tag:</span> {metadata.ghl_tag}</p>
                            {metadata.stripe_session_id && (
                              <p><span className="font-semibold">Session ID:</span> {metadata.stripe_session_id.substring(0, 20)}...</p>
                            )}
                          </>
                        );
                      } catch {
                        return <p>Unable to parse metadata</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Message</p>
                <div className="bg-muted p-3 rounded text-sm text-foreground max-h-48 overflow-y-auto">
                  {selectedSubmission.content}
                </div>
              </div>
              {selectedSubmission.isRead === 0 && (
                <Button
                  onClick={() => markAsReadMutation.mutate({ submissionId: selectedSubmission.id })}
                  disabled={markAsReadMutation.isPending}
                  className="w-full"
                >
                  {markAsReadMutation.isPending ? "Marking..." : "Mark as Read"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Select a submission to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CustomersTab() {
  const { data: customersData, isLoading } = trpc.admin.getCustomers.useQuery({ limit: 100, offset: 0 });
  const { data: csvData, isLoading: isExporting } = trpc.admin.exportCustomersAsCSV.useQuery();

  const handleExport = () => {
    if (csvData) {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData.csv));
      element.setAttribute("download", csvData.filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customers ({customersData?.customers.length || 0})</CardTitle>
        <Button onClick={handleExport} disabled={isExporting} size="sm">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Phone</th>
                <th className="text-left py-3 px-4 font-semibold">First Contact</th>
              </tr>
            </thead>
            <tbody>
              {customersData?.customers.map((customer: any) => (
                <tr key={customer.email} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{customer.name}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">{customer.phone || "—"}</td>
                  <td className="py-3 px-4">{new Date(customer.firstSubmission).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function OrdersTab() {
  const { data: ordersData, isLoading } = trpc.admin.getOrders.useQuery({ limit: 100, offset: 0 });
  const { data: csvData, isLoading: isExporting } = trpc.admin.exportOrdersAsCSV.useQuery();

  const handleExport = () => {
    if (csvData) {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData.csv));
      element.setAttribute("download", csvData.filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders ({ordersData?.orders.length || 0})</CardTitle>
        <Button onClick={handleExport} disabled={isExporting} size="sm">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.productName}</td>
                  <td className="py-3 px-4">${order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "succeeded" ? "bg-green-100 text-green-800" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.stripeSubscriptionId ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {order.stripeSubscriptionId ? "Subscription" : "One-time"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  const { data: analyticsData, isLoading } = trpc.admin.getAnalytics.useQuery();
  const { data: audienceInsights, isLoading: insightsLoading } = trpc.admin.getAudienceInsights.useQuery();

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analyticsData?.totalCustomers || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${analyticsData?.totalRevenue || "0.00"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analyticsData?.totalOrders || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analyticsData?.totalSubmissions || 0}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Submissions by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analyticsData?.submissionsByType || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analyticsData?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span className="capitalize">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Audience Insights — Aggregate Only</CardTitle>
          <CardDescription>Host-facing patterns from submitted Voice Starting Point surveys. Individual answers remain in submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {insightsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="space-y-4"><p className="font-semibold">Survey responses: {audienceInsights?.surveyCount || 0}</p>{Object.entries(audienceInsights?.responseCounts || {}).slice(0, 6).map(([question, answers]) => <div key={question}><p className="mb-1 text-sm font-semibold">{question}</p><div className="grid gap-1 sm:grid-cols-2">{Object.entries(answers).slice(0, 4).map(([answer, count]) => <div key={answer} className="flex justify-between rounded bg-muted px-3 py-2 text-xs"><span className="truncate pr-3">{answer}</span><span className="font-bold">{count}</span></div>)}</div></div>)}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
