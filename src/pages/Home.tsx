import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, AlertCircle, Users, TrendingUp, Award, Plus, ChevronRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useIssues } from '@/hooks/useIssues';
import civicHeroImage from '@/assets/civic-hero.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const { issues } = useIssues();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statsData = [
    {
      label: "Total Issues",
      value: issues?.length || 0,
      change: "+12%",
      icon: AlertCircle,
      color: "text-orange-600"
    },
    {
      label: "Resolved",
      value: issues?.filter(i => i.status === 'resolved').length || 0,
      change: "+8%", 
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      label: "Your Score",
      value: profile?.citizen_score || 0,
      change: "+5 pts",
      icon: Award,
      color: "text-purple-600"
    },
    {
      label: "Citizens",
      value: "2.4K",
      change: "+15%",
      icon: Users,
      color: "text-blue-600"
    }
  ];

  const recentIssues = issues?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-80 bg-gradient-hero flex items-center justify-center text-center p-6"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${civicHeroImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          <div className="relative z-10 text-white max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4">JanMitr</h1>
            <p className="text-lg mb-6 opacity-90">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
            </p>
            <p className="text-sm mb-6 opacity-75">Your voice for a better city. Report, Track, Resolve.</p>
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

      <div className="p-6 -mt-8 relative z-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-background/95 backdrop-blur-sm border-border/50 shadow-elegant">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Citizen Score */}
        <Card className="mb-6 bg-gradient-primary shadow-elegant text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center text-white">
                <Award className="h-5 w-5 mr-2" />
                Your Citizen Score
              </CardTitle>
              <Badge className="bg-white/20 text-white border-white/30">
                Level {Math.floor((profile?.citizen_score || 0) / 100) + 1}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold">{profile?.citizen_score || 0}</span>
              <span className="text-sm opacity-75">
                Next: {Math.ceil(((profile?.citizen_score || 0) + 100) / 100) * 100}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${((profile?.citizen_score || 0) % 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs opacity-75 mt-2">
              {100 - ((profile?.citizen_score || 0) % 100)} points to next level
            </p>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card className="shadow-elegant bg-background/95 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Issues</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/map')}
                className="text-primary hover:text-primary-hover"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <Card key={issue.id} className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 text-foreground">{issue.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {issue.location_address || 'Location not specified'}
                        </div>
                      </div>
                      <Badge 
                        variant={issue.status === 'resolved' ? 'default' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {issue.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Badge 
                        variant={issue.priority === 'high' || issue.priority === 'critical' ? 'destructive' : 
                                 issue.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs capitalize"
                      >
                        {issue.priority}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No issues reported yet</p>
                <Button onClick={() => navigate('/report')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Report First Issue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 bg-primary/5 border-primary/20"
            onClick={() => navigate('/report')}
          >
            <CardContent className="p-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-primary">Report Issue</p>
              <p className="text-xs text-muted-foreground mt-1">Photo & Location</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 bg-secondary/5 border-secondary/20"
            onClick={() => navigate('/profile')}
          >
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-secondary-foreground" />
              <p className="font-medium text-secondary-foreground">View Profile</p>
              <p className="text-xs text-muted-foreground mt-1">Rewards & Stats</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Home;