import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, BookOpen, Heart, Star, Calendar } from 'lucide-react';

export const CommunityHub = () => {
  const supportGroups = [
    {
      name: "Diabetes Support Circle",
      members: 342,
      category: "Diabetes",
      lastActive: "2 hours ago",
      featured: true,
      description: "Share experiences and tips for managing Type 2 diabetes"
    },
    {
      name: "Heart Health Warriors",
      members: 218,
      category: "Cardiovascular",
      lastActive: "4 hours ago",
      featured: false,
      description: "Support for those managing heart conditions and hypertension"
    },
    {
      name: "COPD Care Community",
      members: 156,
      category: "Respiratory",
      lastActive: "1 day ago",
      featured: false,
      description: "Breathing techniques and lifestyle tips for COPD management"
    }
  ];

  const educationalResources = [
    {
      title: "Understanding Your Blood Pressure Numbers",
      category: "Hypertension",
      readTime: "5 min read",
      rating: 4.8,
      views: 2340
    },
    {
      title: "Meal Planning for Diabetes Management",
      category: "Diabetes",
      readTime: "8 min read",
      rating: 4.9,
      views: 3120
    },
    {
      title: "Exercise Safety with Heart Conditions",
      category: "Cardiovascular",
      readTime: "6 min read",
      rating: 4.7,
      views: 1890
    }
  ];

  const upcomingEvents = [
    {
      title: "Virtual Diabetes Workshop",
      date: "Tomorrow, 2:00 PM",
      attendees: 45,
      type: "Workshop"
    },
    {
      title: "Heart-Healthy Cooking Class",
      date: "Friday, 10:00 AM",
      attendees: 28,
      type: "Class"
    },
    {
      title: "COPD Support Group Meeting",
      date: "Saturday, 3:00 PM",
      attendees: 22,
      type: "Support Group"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-accessible-2xl font-bold mb-2">Community & Education Hub</h2>
        <p className="text-accessible-lg text-muted-foreground">
          Connect, learn, and grow with others on similar health journeys
        </p>
      </div>

      {/* Support Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Support Groups
          </CardTitle>
          <CardDescription>Connect with others managing similar conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportGroups.map((group, index) => (
              <Card key={index} className={group.featured ? "border-primary" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-accessible-base">{group.name}</CardTitle>
                    {group.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <Badge variant="outline" className="w-fit">{group.category}</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-accessible-sm text-muted-foreground mb-3">{group.description}</p>
                  <div className="flex justify-between items-center text-accessible-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.members} members
                    </span>
                    <span className="text-muted-foreground">Active {group.lastActive}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Discussion
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            Health Education Library
          </CardTitle>
          <CardDescription>Evidence-based resources for better health management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {educationalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-accessible-base">{resource.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">{resource.category}</Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-accessible-sm mb-3">
                    <span>{resource.readTime}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                  <p className="text-accessible-sm text-muted-foreground mb-3">{resource.views} views</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-health-good" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Join virtual workshops and support sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="text-accessible-base font-semibold">{event.title}</h4>
                  <p className="text-accessible-sm text-muted-foreground">{event.date}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <span className="text-accessible-sm flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                <Button variant="outline">Join Event</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};