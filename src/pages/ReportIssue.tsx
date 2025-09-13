import { useState } from "react";
import { Camera, MapPin, Upload, Trash, FileText, Zap, Car, Lightbulb, Trees, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIssues } from "@/hooks/useIssues";
import { useFileUpload } from "@/hooks/useFileUpload";

const ReportIssue = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createIssue, isCreatingIssue } = useIssues();
  const { uploadFile } = useFileUpload();

  const categories = [
    { id: "roads", label: "Roads & Potholes", icon: Car, color: "bg-civic-orange" },
    { id: "streetlights", label: "Street Lighting", icon: Lightbulb, color: "bg-civic-saffron" },
    { id: "garbage", label: "Waste Management", icon: Trash, color: "bg-civic-green" },
    { id: "water", label: "Water & Drainage", icon: Zap, color: "bg-primary" },
    { id: "parks", label: "Parks & Trees", icon: Trees, color: "bg-accent" },
    { id: "other", label: "Other Issues", icon: AlertTriangle, color: "bg-destructive" },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPhotos(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          toast({
            title: "Location captured",
            description: "Current location has been added to your report",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report issues",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategory || !description || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let photoUrl = '';
      
      // Upload first photo if available
      if (photos.length > 0) {
        photoUrl = await uploadFile(photos[0], 'issue-photos') || '';
      }

      const issueData = {
        title: title || `${categories.find(c => c.id === selectedCategory)?.label} Issue`,
        description,
        category: selectedCategory as any,
        location_address: location,
        location_lat: currentLocation?.lat,
        location_lng: currentLocation?.lng,
        photo_url: photoUrl,
      };

      createIssue(issueData);
      
      // Reset form
      setSelectedCategory("");
      setDescription("");
      setLocation("");
      setTitle("");
      setPhotos([]);
      setCurrentLocation(null);
      
      // Navigate back to home
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Report an Issue</h1>
        <p className="opacity-90">Help make your city better</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Issue Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Brief title for the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Issue Category *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}>
                    <category.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Add Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tap to add photos</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                />
              </label>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter location or landmark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mb-3"
            />
            <Button variant="outline" className="w-full" onClick={getCurrentLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Description *</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
            />
          </CardContent>
        </Card>

        {/* Points Reward */}
        <div className="flex items-center justify-center p-4 bg-gradient-success rounded-lg text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">+50 Points</div>
            <div className="text-sm opacity-90">Reward for reporting</div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={handleSubmit}
          disabled={isCreatingIssue}
        >
          {isCreatingIssue ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );
};

export default ReportIssue;