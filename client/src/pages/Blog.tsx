/*
Design reminder for this file:
Blog page showcases Nancy's articles with a clean, readable layout.
Focus on typography hierarchy, generous whitespace, and easy navigation.
Each article should feel like a personal letter from Nancy to the reader.
*/
import BrandShell from "@/components/BrandShell";
import { ArrowUpRight, Facebook, Linkedin, Instagram } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { currentArticles, pastArticles } from "@/content/blogArticles";

const ARTICLES_PER_PAGE = 3;

const brandingImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/blog-hero-banner-Ey7oUkdmgmokGmsTBrTqrk.webp';
const heroBannerUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/blog-hero-banner-Ey7oUkdmgmokGmsTBrTqrk.webp';
const heroProfileImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/blog-hero-profile-transparent-76aN8Xxo9HUeNaaMywn875.webp';

const backgroundWords = ['POWER', 'OPPORTUNITY', 'PURPOSE', 'VISION', 'INSPIRATION', 'ELEVATION', 'VOICE', 'COURAGE', 'FAITH', 'BOLDNESS', 'TRANSFORMATION', 'STRENGTH'];

const blogIntro = {
  title: "Welcome to <span className='text-brand-gold'>\"Speak From Purpose\"</span>",
  subtitle: "A Blog about Real Talk. Real Faith. Real Transformation.",
  content: `I believe you were born with a voice that the world needs to hear. Not someday. Not when you feel ready. Now.

This blog is a space created for women who are tired of playing small — women who feel something stirring inside them but haven't quite found the words, the courage, or the permission to let it out. Whether you picked up my book, joined one of our coaching programs, or simply stumbled across this page at just the right moment — welcome. You are right where you are supposed to be.

My name is Nancy Dixon, founder of Divine Collective LLC. My mission is simple: to help women like you unlock your true purpose, find your voice, and walk boldly into the life God designed for you. Everything I share here is rooted in faith, fueled by real experience, and written for the woman who is ready — even if she doesn't feel like it yet.

In this blog, you will find honest, faith-rooted articles that speak to the fears you carry, the mindset shifts you need, and the practical steps that will help you rise. No fluff. No performance. Just truth, tools, and a community of women committed to growing together.

I write from my own journey — as a woman who has faced fear, grief, silence, and doubt — and come through it with a fire in my chest and a message to share. My prayer is that something you read here lights that same fire in you.

Your voice matters. Your story matters. And you — yes, you — have something to say.

Start with any of the articles below, share what speaks to you, and come back often. New wisdom is always on the way.

With love and purpose,
Nancy Dixon
Founder, Divine Collective LLC | Author | Coach | Speaker`,
};

export default function Blog() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("current");
  const [displayedPastArticlesCount, setDisplayedPastArticlesCount] = useState(ARTICLES_PER_PAGE);

  const displayArticles = activeTab === "current" ? currentArticles : pastArticles;
  
  // For past articles, apply pagination
  const displayedArticles = activeTab === "past"
    ? pastArticles.slice(0, displayedPastArticlesCount)
    : displayArticles;

  const hasMoreArticles = activeTab === "past" && displayedPastArticlesCount < pastArticles.length;

  const handleLoadMore = () => {
    setDisplayedPastArticlesCount(prev => prev + ARTICLES_PER_PAGE);
  };

  const selectedArticle = selectedArticleId 
    ? displayedArticles.find(a => a.id === selectedArticleId)
    : displayedArticles[0];

  return (
    <BrandShell currentPath="/blog">
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={heroBannerUrl} 
            alt="Blog Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Speak From Purpose</h1>
              <p className="text-lg md:text-xl text-gray-200">Real Talk. Real Faith. Real Transformation.</p>
            </div>
          </div>
        </div>

        {/* Blog Intro Section */}
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Welcome to <span className="text-brand-gold">"Speak From Purpose"</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {blogIntro.content}
            </p>
          </div>
        </div>

        {/* Articles Section with Tabs */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            // Reset pagination when switching tabs
            if (value === "past") {
              setDisplayedPastArticlesCount(ARTICLES_PER_PAGE);
            }
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="current" className="text-base">
                Current Articles ({currentArticles.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="text-base">
                Past Articles ({pastArticles.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Articles List */}
                <div className="md:col-span-1">
                  <div className="space-y-3">
                    {displayedArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticleId(article.id)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          selectedArticle?.id === article.id
                            ? "bg-brand-gold text-black"
                            : "bg-card hover:bg-card/80 text-foreground"
                        }`}
                      >
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs opacity-75">
                          {new Date(article.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </button>
                    ))}

                    {/* Load More Button for Past Articles */}
                    {hasMoreArticles && (
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleLoadMore}
                          variant="outline"
                          size="sm"
                          className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 w-full"
                        >
                          Load More Articles
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Article Display */}
                <div className="md:col-span-2">
                  {selectedArticle && (
                    <article className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          {selectedArticle.category && (
                            <span className="text-xs font-semibold text-brand-gold uppercase">
                              {selectedArticle.category}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                          {selectedArticle.title}
                        </h2>
                        <p className="text-lg text-muted-foreground italic">
                          {selectedArticle.excerpt}
                        </p>
                      </div>

                      <div className="prose prose-invert max-w-none text-foreground">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {selectedArticle.content}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border">
                        <div className="flex items-center gap-4">
                          <img 
                            src={heroProfileImageUrl} 
                            alt="Nancy Dixon" 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-foreground">Nancy Marie Dixon</p>
                            <p className="text-sm text-muted-foreground">
                              Founder of Divine Collective LLC | Author | Coach | Speaker
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Social Share */}
                      <div className="pt-8 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-4">Share this article</p>
                        <div className="flex gap-3">
                          <a href="#" className="p-2 rounded-full bg-card hover:bg-card/80 transition-colors">
                            <Facebook className="w-5 h-5 text-brand-gold" />
                          </a>
                          <a href="#" className="p-2 rounded-full bg-card hover:bg-card/80 transition-colors">
                            <Linkedin className="w-5 h-5 text-brand-gold" />
                          </a>
                          <a href="#" className="p-2 rounded-full bg-card hover:bg-card/80 transition-colors">
                            <Instagram className="w-5 h-5 text-brand-gold" />
                          </a>
                        </div>
                      </div>
                    </article>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BrandShell>
  );
}
