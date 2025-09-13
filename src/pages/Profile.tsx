import { Star, Award, TrendingUp, MapPin, Camera, Trophy, Target, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useIssues } from "@/hooks/useIssues";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { myIssues } = useIssues();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const userStats = [
    { label: "Issues Reported", value: profile?.total_reports || 0, icon: Camera, color: "text-civic-orange" },
    { label: "Issues Resolved", value: profile?.resolved_reports || 0, icon: Target, color: "text-civic-green" },
    { label: "Citizen Score", value: profile?.citizen_score || 0, icon: Trophy, color: "text-civic-saffron" },
  ];

  const achievements = [
    { id: 1, title: "First Reporter", description: "Reported your first issue", icon: "🎯", earned: true },
    { id: 2, title: "Photo Expert", description: "Added photos to 10 reports", icon: "📸", earned: true },
    { id: 3, title: "Community Hero", description: "Reached 2000 points", icon: "🦸", earned: true },
    { id: 4, title: "Verified Citizen", description: "Profile verified by admin", icon: "✅", earned: false },
    { id: 5, title: "Super Contributor", description: "Report 50 issues", icon: "⭐", earned: false },
    { id: 6, title: "Problem Solver", description: "Help resolve 25 issues", icon: "🔧", earned: false },
  ];

  const recentActivity = myIssues.slice(0, 4).map((issue, index) => ({
    id: issue.id,
    action: `Reported: ${issue.title}`,
    points: 50,
    timeAgo: formatTimeAgo(issue.created_at)
  }));

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-white/20 text-white text-xl">
              {user && profile?.full_name ? getInitials(profile.full_name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {profile?.full_name || user?.email || 'User'}
            </h1>
            <p className="opacity-90">Citizen ID: {user?.id.slice(0, 8).toUpperCase()}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-civic-green text-white">
                Level {Math.floor((profile?.citizen_score || 0) / 1000) + 1} Citizen
              </Badge>
            </div>
          </div>
        </div>

        {/* Citizen Score */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90">Citizen Score</span>
              <span className="text-2xl font-bold">{profile?.citizen_score || 0}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-civic-saffron h-2 rounded-full" 
                style={{ width: `${Math.min(((profile?.citizen_score || 0) % 1000) / 10, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>Level {Math.floor((profile?.citizen_score || 0) / 1000) + 1}</span>
              <span>{1000 - ((profile?.citizen_score || 0) % 1000)} to next level</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {userStats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-civic-saffron" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg text-center transition-all ${
                    achievement.earned
                      ? "bg-gradient-success text-white shadow-card"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium mb-1">{achievement.title}</div>
                  <div className="text-xs opacity-80">{achievement.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.timeAgo}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-civic-green">+{activity.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard Preview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-civic-saffron" />
                Community Leaderboard
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-civic-saffron/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-civic-saffron rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <span className="font-medium">Priya Sharma</span>
                </div>
                <span className="font-bold">4,567 pts</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold text-sm">2</div>
                  <span>Amit Singh</span>
                </div>
                <span>3,234 pts</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-civic-green/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-civic-green rounded-full flex items-center justify-center text-white font-bold text-sm">47</div>
                  <span className="font-medium">You</span>
                </div>
                <span className="font-bold">2,847 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full">
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;