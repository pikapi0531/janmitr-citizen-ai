import { useState } from "react";
import { MapPin, Filter, Search, Navigation, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MapView = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All", count: 156 },
    { id: "pending", label: "Pending", count: 45 },
    { id: "progress", label: "In Progress", count: 67 },
    { id: "resolved", label: "Resolved", count: 44 },
  ];

  const issues = [
    {
      id: 1,
      type: "Pothole",
      location: "MG Road, Sector 14",
      status: "pending",
      priority: "high",
      distance: "0.2 km",
      reportedBy: "Rajesh K.",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      type: "Street Light",
      location: "Gandhi Nagar Main",
      status: "progress",
      priority: "medium",
      distance: "0.5 km",
      reportedBy: "Priya M.",
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      type: "Garbage Collection",
      location: "City Center Plaza",
      status: "resolved",
      priority: "high",
      distance: "0.8 km",
      reportedBy: "Amit S.",
      timeAgo: "1 day ago",
    },
    {
      id: 4,
      type: "Water Logging",
      location: "Ring Road Junction",
      status: "pending",
      priority: "high",
      distance: "1.2 km",
      reportedBy: "Sunita D.",
      timeAgo: "3 hours ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-civic-green" />;
      case "progress":
        return <Clock className="h-4 w-4 text-civic-saffron" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-civic-orange" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-civic-green text-white">Resolved</Badge>;
      case "progress":
        return <Badge className="bg-civic-saffron text-white">In Progress</Badge>;
      default:
        return <Badge className="bg-civic-orange text-white">Pending</Badge>;
    }
  };

  const filteredIssues = issues.filter(issue => 
    (selectedFilter === "all" || issue.status === selectedFilter) &&
    (issue.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
     issue.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(issue.status)}
                  <div>
                    <h3 className="font-medium">{issue.type}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {issue.location}
                    </p>
                  </div>
                </div>
                {getStatusBadge(issue.status)}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>By {issue.reportedBy}</span>
                  <span>{issue.timeAgo}</span>
                </div>
                <div className="flex items-center">
                  <Navigation className="h-3 w-3 mr-1" />
                  {issue.distance}
                </div>
              </div>
              
              {issue.priority === "high" && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">High Priority</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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