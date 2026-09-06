/*
Design reminder for this file:
Events page showcases upcoming events and programs with the flyer embedded.
Maintain the same luxury aesthetic with gold accents and clear visual hierarchy.
*/
import BrandShell from "@/components/BrandShell";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentEvents, pastEvents } from "@/content/events";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";

const ITEMS_PER_PAGE = 3;

export default function Events() {
  const [activeTab, setActiveTab] = useState("current");
  const [displayedPastEventsCount, setDisplayedPastEventsCount] = useState(ITEMS_PER_PAGE);

  const displayEvents = activeTab === "current" ? currentEvents : pastEvents;

  // Sort events by date (soonest first for current, most recent first for past)
  const sortedEvents = [...displayEvents].sort((a, b) => {
    if (activeTab === "current") {
      return a.date.getTime() - b.date.getTime(); // Ascending for upcoming
    } else {
      return b.date.getTime() - a.date.getTime(); // Descending for past
    }
  });

  // For past events, apply pagination
  const displayedEvents = activeTab === "past" 
    ? sortedEvents.slice(0, displayedPastEventsCount)
    : sortedEvents;

  const hasMoreEvents = activeTab === "past" && displayedPastEventsCount < sortedEvents.length;

  const handleLoadMore = () => {
    setDisplayedPastEventsCount(prev => prev + ITEMS_PER_PAGE);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "coaching":
        return "bg-purple-100 text-purple-800";
      case "community":
        return "bg-green-100 text-green-800";
      case "intensive":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <BrandShell currentPath="/events">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-brand-plum/30 bg-gradient-to-br from-brand-plum/10 to-brand-gold/5 py-16 md:py-24">
        <div className="container space-y-6">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow text-brand-plum">Upcoming Events</p>
            <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
              Join Us for <span className="text-brand-gold">Transformative Events</span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Experience powerful workshops, coaching intensives, and community gatherings designed to help you find your voice and step into your purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="bg-background py-16 md:py-24">
        <div className="container max-w-6xl space-y-12">
          {/* Tabs Section */}
          <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              // Reset pagination when switching tabs
              if (value === "past") {
                setDisplayedPastEventsCount(ITEMS_PER_PAGE);
              }
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="current" className="text-base">
                  Upcoming Events ({currentEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-base">
                  Past Events ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6">
                {displayedEvents.length === 0 ? (
                  <Card>
                    <CardContent className="pt-8 text-center">
                      <p className="text-muted-foreground">
                        {activeTab === "current"
                          ? "No upcoming events at this time. Check back soon!"
                          : "No past events to display."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayedEvents.map((event) => (
                        <Card
                          key={event.id}
                          className="hover:shadow-lg transition-shadow overflow-hidden border-brand-gold/20"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${getEventTypeColor(
                                  event.type
                                )}`}
                              >
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </span>
                            </div>
                            <CardTitle className="text-xl text-foreground">
                              {event.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {event.description}
                            </p>

                            <div className="space-y-2 pt-2 border-t border-border">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 text-brand-gold" />
                                <span>{formatDate(event.date)}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 text-brand-gold" />
                                <span>{event.time}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-brand-gold" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            {activeTab === "current" && event.registrationUrl && (
                              <Button
                                asChild
                                className="w-full mt-4 bg-brand-gold text-black hover:bg-brand-gold/90"
                              >
                                <a
                                  href={event.registrationUrl}
                                  {...(/^https?:/i.test(event.registrationUrl)
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                >
                                  Register Now
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Load More Button for Past Events */}
                    {hasMoreEvents && (
                      <div className="flex justify-center pt-6">
                        <Button
                          onClick={handleLoadMore}
                          variant="outline"
                          className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
                        >
                          Load More Past Events
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Events Info */}
          <div className="space-y-6 border-t border-brand-gold/20 pt-12">
            <h2 className="section-title">Why Attend?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 rounded-lg border border-brand-gold/20 bg-white/5 p-6">
                <h3 className="font-display text-lg text-foreground">Transform Your Mindset</h3>
                <p className="text-sm text-muted-foreground leading-6">
                  Break through limiting beliefs and discover your true worth and potential.
                </p>
              </div>
              <div className="space-y-3 rounded-lg border border-brand-gold/20 bg-white/5 p-6">
                <h3 className="font-display text-lg text-foreground">Find Your Voice</h3>
                <p className="text-sm text-muted-foreground leading-6">
                  Learn practical frameworks to speak up, share your message, and lead authentically.
                </p>
              </div>
              <div className="space-y-3 rounded-lg border border-brand-gold/20 bg-white/5 p-6">
                <h3 className="font-display text-lg text-foreground">Connect & Grow</h3>
                <p className="text-sm text-muted-foreground leading-6">
                  Join a community of women committed to growth, faith, and purposeful living.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-lg border border-brand-gold/30 bg-gradient-to-r from-brand-plum/10 to-brand-gold/10 p-8 md:p-12 space-y-4 text-center">
            <h3 className="font-display text-2xl text-foreground">Ready to Transform?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Register for an upcoming event and take the first step toward finding your voice and walking boldly into your purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-brand-gold text-black font-semibold hover:bg-brand-gold/90 transition-colors"
              >
                Register Now
              </Link>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-brand-gold text-brand-gold font-semibold hover:bg-brand-gold/10 transition-colors"
              >
                Get More Info
              </a>
            </div>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
