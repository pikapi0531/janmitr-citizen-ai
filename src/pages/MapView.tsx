import { useState, useEffect } from "react";
import { MapPin, Filter, Search, Navigation, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIssues } from "@/hooks/useIssues";

const MapView = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { issues, isLoading, upvoteIssue } = useIssues();

  const getFilterCount = (status: string) => {
    if (status === "all") return issues.length;
    return issues.filter(issue => issue.status === status).length;
  };

  const filters = [
    { id: "all", label: "All", count: getFilterCount("all") },
    { id: "reported", label: "Pending", count: getFilterCount("reported") },
    { id: "in_progress", label: "In Progress", count: getFilterCount("in_progress") },
    { id: "resolved", label: "Resolved", count: getFilterCount("resolved") },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-civic-green" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-civic-saffron" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-civic-orange" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-civic-green text-white">Resolved</Badge>;
      case "in_progress":
        return <Badge className="bg-civic-saffron text-white">In Progress</Badge>;
      default:
        return <Badge className="bg-civic-orange text-white">Pending</Badge>;
    }
  };

  const filteredIssues = issues.filter(issue => 
    (selectedFilter === "all" || issue.status === selectedFilter) &&
    (issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (issue.location_address && issue.location_address.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Issue Map</h1>
        <p className="opacity-90">Real-time civic issues in your area</p>
      </div>

      {/* Search */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mx-6 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="h-48 bg-gradient-to-br from-primary/10 to-civic-green/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                <p className="text-sm text-muted-foreground">Heat maps & real-time tracking</p>
              </div>
              
              {/* Animated background pins */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-8 w-3 h-3 bg-civic-orange rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-12 w-3 h-3 bg-civic-saffron rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute bottom-16 left-16 w-3 h-3 bg-civic-green rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1.5s" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Status</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="flex-shrink-0"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          {filteredIssues.length} Issues Found
        </h2>
        
        {isLoading ? (
          <div className="text-center py-8">Loading issues...</div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No issues found matching your criteria
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(issue.status)}
                    <div>
                      <h3 className="font-medium">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {issue.location_address || "Location not specified"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(issue.status)}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Priority: {issue.priority}</span>
                    <span>{formatTimeAgo(issue.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => upvoteIssue(issue.id)}
                      className="text-xs"
                    >
                      👍 {issue.upvotes}
                    </Button>
                  </div>
                </div>
                
                {issue.priority === "critical" && (
                  <div className="mt-2">
                    <Badge variant="destructive" className="text-xs">Critical Priority</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Current Location Button */}
      <div className="fixed bottom-28 right-6">
        <Button className="h-12 w-12 rounded-full bg-gradient-primary shadow-glow">
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MapView;