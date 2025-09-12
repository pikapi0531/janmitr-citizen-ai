import { Camera, MapPin, Award, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/civic-hero.jpg";

const Home = () => {
  const navigate = useNavigate();

  const quickStats = [
    { icon: AlertTriangle, label: "Issues Reported", value: "12,847", color: "text-civic-saffron" },
    { icon: TrendingUp, label: "Resolved This Month", value: "9,234", color: "text-civic-green" },
    { icon: Users, label: "Active Citizens", value: "45,678", color: "text-primary" },
  ];

  const recentIssues = [
    { id: 1, type: "Pothole", location: "MG Road", status: "In Progress", priority: "High" },
    { id: 2, type: "Street Light", location: "Gandhi Nagar", status: "Resolved", priority: "Medium" },
    { id: 3, type: "Garbage", location: "City Center", status: "Assigned", priority: "High" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-80 bg-gradient-hero flex items-center justify-center text-center p-6"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
          <div className="relative z-10 text-white max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4">JanMitr</h1>
            <p className="text-lg mb-6 opacity-90">Your voice for a better city. Report, Track, Resolve.</p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300"
                onClick={() => navigate('/report')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white/50 hover:bg-white/10"
                onClick={() => navigate('/map')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Citizen Score */}
        <Card className="mb-6 bg-gradient-card shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-civic-saffron" />
                Your Citizen Score
              </CardTitle>
              <Badge className="bg-civic-green text-white">Level 3</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-primary">2,847</span>
              <span className="text-sm text-muted-foreground">Next: 3,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-success h-2 rounded-full transition-all duration-500" 
                style={{ width: "85%" }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">153 points to next level</p>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Issues in Your Area</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-medium">{issue.type}</div>
                  <div className="text-sm text-muted-foreground">{issue.location}</div>
                </div>
                <div className="text-right">
                  <Badge 
                    className={
                      issue.status === 'Resolved' ? 'bg-civic-green text-white' :
                      issue.status === 'In Progress' ? 'bg-civic-saffron text-white' :
                      'bg-muted text-muted-foreground'
                    }
                  >
                    {issue.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{issue.priority}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Home;