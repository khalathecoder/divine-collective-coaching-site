/*
Design reminder for this file:
Blog archive page displays older articles with clean navigation.
Maintains consistent typography and layout with main blog page.
Focus on readability and easy navigation back to blog home.
*/
import BrandShell from "@/components/BrandShell";
import { ArrowLeft, Facebook, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const articles = [
  {
    id: 1,
    title: "You Are Worthy — It's Time to Believe It",
    excerpt: "Break free from the lie of unworthiness and discover why your value has never been based on what others say about you. A powerful first step toward using your voice.",
    category: "Mindset",
    readTime: "8 min read",
    socialCaption: "There is a quiet lie that millions of women carry — not in their words, but in their bones. The lie that says you are not worthy. I know this lie well. I lived with it for decades. Your worth was never based on how others treated you. It comes from God, and it is unshakeable. #YouAreWorthy #DivineCollective #FindYourVoice #WomenOfFaith #Mindset #SelfWorth #NancyDixon",
    content: `There is a quiet, dangerous lie that millions of women carry — not in their words, but in their bones. It doesn't announce itself loudly. It whispers. It shows up in the moment you want to raise your hand in a meeting, but don't. It surfaces when you have a dream in your heart, but talk yourself out of it before you even begin. The lie is simple: You are not worthy.

I know this lie well. I lived with it for decades.

Growing up as the daughter of a civil rights minister, I witnessed courage up close every single day. My father stood in front of crowds, spoke truth to power, and fought for justice with everything he had. And yet — outside our home, the world worked hard to silence me. I was bullied, mocked, and made to feel like my differences disqualified me. Over time, those experiences built a wall between who I was and who God created me to be.

What I didn't realize then — and what I want you to know right now — is that my worthiness was never dependent on how I was treated. And neither is yours.

**The Difference Between Confidence and Worth**

Here is something that changed my life when I finally understood it: self-confidence and self-worth are not the same thing.

Self-confidence is often tied to external things — your accomplishments, how others respond to you, how a presentation went, whether your business is growing. It fluctuates. It can be shaken. Self-worth, on the other hand, comes from the inside. It is the deep, unshakeable belief that you matter — not because of what you do, but because of who you are.

Romans 12:2 reminds us: "Do not conform to the pattern of this world but be transformed by the renewing of your mind." Transformation doesn't begin with a new strategy or a new program. It begins with a renewed mind — one that has accepted, at the core, the truth that God says you are worthy.

**What Happens When You Believe You Are Worthy**

When I began to truly embrace my own worthiness — not just intellectually, but in my heart — everything shifted. I started taking risks I had avoided for years. I said yes to opportunities that once felt too big for me. I began to speak up, show up, and step into the calling that had been waiting for me.

Here is what I've learned: worthiness is not something you earn. It is something you accept. And when you accept it, you will:

- Take more risks because you trust yourself to handle the outcome
- Attract better opportunities because your energy shifts
- Become more resilient because setbacks no longer define you
- Use your voice — because you finally believe it matters

**Your First Step Starts Here**

I want to invite you to do something small but powerful today. Grab a journal or a piece of paper and write down one belief you have held about yourself that has kept you silent. Then, right next to it, write the truth that God says about you.

You are not too much. You are not too little. You are not behind. You are not disqualified. You have something to say — and the world needs to hear it.

You are worthy. Full stop.`,
  },
  {
    id: 2,
    title: "Fear Has a Name — And You Can Face It",
    excerpt: "Rejection. Failure. Judgment. The unknown. Name the fears that have kept you silent — and learn how to move forward anyway with faith, courage, and a practical plan.",
    category: "Courage",
    readTime: "10 min read",
    socialCaption: "Fear of rejection. Fear of failure. Fear of judgment. Fear of the unknown. These four fears have stolen the voices of too many women for too long. But here's the truth: God did not give you a spirit of fear. He gave you power, love, and a sound mind. (2 Timothy 1:7) In my latest blog post, I'm naming these fears AND giving you the tools to face them. #FearHasAName #FaithOverFear #UseYourVoice #DivineCollective #WomenWhoLead #CourageIsAHabit",
    content: `Fear is sneaky. It rarely shows up wearing a name tag. It disguises itself as common sense, practicality, or humility. It says things like, "Who are you to think you could do that?" or "What will people think?" or "What if you fail?" And before you know it, you've talked yourself out of the very thing God placed in your heart.

2 Timothy 1:7 makes it clear: "For God has not given us a spirit of fear, but of power and of love and of a sound mind." That means fear — the kind that paralyzes us, the kind that silences our voice — does not come from God. It comes from the enemy of our purpose.

I've experienced every kind of fear on the list. And I want to name them with you, because a fear you can name is a fear you can face.

**The Four Fears That Steal Your Voice**

Fear of Rejection: This one whispers that if you speak up — if you share your opinion, ask for what you need, or dare to be seen — you will be pushed away. It is rooted in the deeply human longing to belong. But Proverbs 29:25 reminds us: "The fear of man brings a snare, but whoever trusts in the Lord shall be safe." When we place too much weight on others' opinions, we build a cage around our own voice.

Fear of Failure: This fear says that if you try and it doesn't work, you will have confirmed your worst suspicion about yourself — that you are not enough. But Isaiah 41:10 promises: "I will strengthen you and help you." Failure is not the end. It is the teacher that shapes the next chapter.

Fear of Judgment: What will they say? How will they look at me? This fear keeps us performing for an audience that isn't the one that matters. Romans 8:31 asks it perfectly: "If God is for us, who can be against us?"

Fear of the Unknown: Sometimes we don't even know exactly what we're afraid of — we just know that stepping out feels terrifying. Psalm 56:3 gives us the remedy: "When I am afraid, I put my trust in you."

**Courage Is a Habit, Not a Feeling**

Here is the truth about courageous women: they are afraid too. The difference is, they act anyway.

Courage is not the absence of fear. It is the decision to move forward in spite of it. And like any other skill, it grows with practice. Every time you confront a fear instead of retreating from it, your brain learns something new: I can do this.

Some practical ways to start building the courage habit:

- Name your fear out loud or in writing — what you can identify, you can address
- Sit with the discomfort instead of running from it — it will pass
- Ask yourself: What is the realistic worst case? Most fears are far bigger in our minds than in reality
- Take one small courageous action today — even if it feels imperfect
- Pray through it — ask God to replace fear with the power, love, and sound mind He promised you

**Your Voice Is Needed**

Every time you let fear win, the world loses something it was meant to have — your perspective, your wisdom, your experience, your story. Someone is waiting on what only you can say.

You don't have to be fearless. You just have to be faithful — to God, to your calling, and to the voice He placed inside of you.`,
  },
  {
    id: 3,
    title: "Finding Your V.O.I.C.E. — The 5 Elements That Unlock Your Purpose",
    excerpt: "Vision. Opportunity. Inspiration. Commitment. Elevation. Explore the five-part framework at the heart of the book and discover your personal roadmap to speaking boldly and living on purpose.",
    category: "Framework",
    readTime: "12 min read",
    socialCaption: "Vision. Opportunity. Inspiration. Commitment. Elevation. These five words are more than chapter titles in my book — they are a roadmap for every woman who knows she was made for more but isn't quite sure how to get there. My new blog post breaks down the V.O.I.C.E. framework so you can apply it to your own life, right now. Which of the five resonates most with where you are right now? #VOICEFramework #FindYourVoice #YouHaveSomethingToSay #DivineCollective #PurposeDriven #WomenEmpowerment",
    content: `When I wrote You Have Something to Say…Use Your Voice, I wanted the word VOICE to mean more than just speaking. I wanted it to be a blueprint — a framework that women could actually use to find their footing, step into their calling, and live out loud.

So I built the book around it. V.O.I.C.E. is an acronym — and each letter represents one of the five elements you need to truly use your voice. Let me walk you through all five.

**V — Vision: See It Before You Speak It**

You cannot move toward a destination you have not seen. Vision is not daydreaming — it is intentional, faith-filled clarity about where God is calling you and what He is calling you to do.

Habakkuk 2:2 says to write the vision and make it plain. That is your assignment. Not just to think about your vision, but to get it out of your head and onto paper. When you write it down, you make it real. You give yourself something to return to on the days when doubt creeps in.

Ask yourself: What does my life look like when I am fully walking in my purpose? What am I doing? Who am I serving? What am I saying? Let the answers be the beginning of your vision.

**O — Opportunity: Say Yes to the Moment**

Opportunity has a way of arriving in disguise. It often looks like an inconvenient ask, an invitation that feels too big, or a door that seems like it couldn't possibly be for you. But here is what I've learned: opportunity rarely announces itself with a neon sign. You have to be paying attention — and you have to be willing to say yes.

I have missed opportunities in my life by waiting until I felt ready. What I know now is that readiness is something you grow into, not something you arrive at. The moment you say yes is the moment growth begins.

This week, look around at the opportunities in front of you. Is there one you've been avoiding because you didn't feel qualified? Say yes — and trust that God doesn't call the equipped. He equips the called.

**I — Inspiration: Let Your Story Fuel Others**

Your story is not just yours. Every experience you have walked through — the pain, the pivots, the breakthroughs — is material that was meant to move someone else forward. Inspiration is the fuel that keeps your voice burning.

I wrote this book after the passing of my husband. Grief could have silenced me forever. Instead, it became the catalyst that pushed me toward my purpose. What I went through was painful — but what came out of it is now blessing others. The same is true for your story.

Don't wait to inspire until you have it all figured out. Your mess is someone else's message. Your journey is someone else's map.

**C — Commitment: Show Up Even When It's Hard**

Using your voice is not a one-time event. It is a daily decision. And commitment is what keeps you showing up when the excitement fades and the work gets hard.

Commitment means:

- Choosing your purpose over your comfort
- Returning to your vision even after a setback
- Taking action even when you don't feel inspired
- Saying no to the things that don't serve your calling so you can say yes to the things that do

The women who transform their lives are not necessarily the most talented. They are the most committed. They get back up. They keep going. They do not let temporary circumstances write a permanent story.

**E — Elevation: Rise and Bring Others With You**

Elevation is the fruit of everything that came before it. When you commit to your vision, step through your fears, say yes to opportunity, and let your story inspire others — you rise. But elevation in God's economy is never just for you.

The higher you go, the greater your reach. Your voice, amplified, becomes a platform. Your story, shared, becomes a movement. Your breakthrough becomes someone else's starting line.

You were not elevated to stand alone at the top. You were elevated to reach back and bring someone with you. That is the true power of your voice.`,
  },
  {
    id: 4,
    title: "B.O.L.D. Is Not a Personality — It's a Practice",
    excerpt: "You don't have to be born bold. You just have to be willing to begin. Learn why boldness is a daily habit — and get three practical steps to start building it today.",
    category: "Boldness",
    readTime: "9 min read",
    socialCaption: "You don't have to be born bold. You just have to be willing to begin. I used to think boldness was something certain women just had — and I wasn't one of them. I was wrong. Boldness is a practice. A habit. A daily decision to show up, speak up, and step into who God created you to be. My latest blog post is for every woman who has ever talked herself out of her own moment. Read it. Share it. Then go do one bold thing today. #BOLDOut #BoldIsAPractice #DivineCollective #WomenOfGod #VoiceAndVisibility #NancyDixon #Empowerment",
    content: `There is a woman you probably picture when you hear the word "bold." She walks into rooms confidently. She speaks up without hesitation. She seems to have no fear. You look at her and think, "I could never be like that. That's just not who I am."

But here is what that image gets wrong: boldness is not a personality type. It is not something you either have or you don't. Boldness is a practice — a skill you develop, a muscle you build, a habit you cultivate. And like any habit, it starts small.

I designed the B.O.L.D. OUT framework because I knew too many brilliant women who were sitting on their gifts, their voices, and their callings — not because they didn't have what it takes, but because they had never been given permission to practice being bold.

This is that permission.

**What Does B.O.L.D. Really Mean?**

Boldness, in the context of Divine Collective's work, is not about being loud, aggressive, or fearless. It is about:

- Being willing to be seen, even when it feels uncomfortable
- Opening your mouth when silence would be easier
- Letting your God-given calling lead you, even when the path is unclear
- Deciding that your voice matters enough to use it

Bold is the woman who sends the email even though her hands are shaking. Bold is the woman who raises her hand in the meeting even though she's the only one who looks like her. Bold is the woman who launches the business, writes the book, starts the ministry — even before she feels ready.

Bold is you. You just might not know it yet.

**Why Women Stay Silent — And Why That Has to Change**

Women are socialized from a young age to make themselves smaller. To not take up too much space. To defer. To wait their turn — a turn that sometimes never comes. And for women of faith, this conditioning is often wrapped in language that sounds spiritual but keeps us stuck.

I know what it feels like to hold back. I know what it feels like to have something burning in your chest that you swallow down because you are afraid of what might happen if you let it out. I also know the cost of that silence — to your joy, to your purpose, and to the people who needed to hear what you had to say.

The world needs bold women right now. Women who will speak truth. Women who will lead with love. Women who will model for the next generation what it looks like to live without shrinking.

**You Can Build Boldness — Starting Today**

The B.O.L.D. OUT Masterclass was designed as a high-energy activation — a space where women awaken courage, reclaim their speech, and take one bold action before they leave the room. Because boldness does not grow in theory. It grows in action.

Here are three ways to start practicing boldness today:

1. Speak first. The next time you are in a meeting, a conversation, or a group setting, be the first one to share. Don't wait for the "perfect" moment. Say what you think.

2. Ask for what you want. Think of one thing you have been afraid to ask for — a raise, an introduction, an opportunity, support. Ask for it this week.

3. Share something real. Post something on social media, send a voice note to a friend, or start a conversation that requires you to be a little more vulnerable than you usually are.

Boldness is built one brave moment at a time. You don't need a big stage to start. You just need the willingness to begin.

God did not give you a spirit of fear. He gave you power. He gave you love. He gave you a sound mind. And He gave you a voice — unique, necessary, and irreplaceable.

Stop waiting to feel ready. Stop waiting to be chosen. Stop waiting for someone to give you permission to be bold.

You have something to say. Now go say it.`,
  },
];

export default function BlogArchive() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const selectedArticleData = selectedArticle ? articles.find(a => a.id === selectedArticle) : null;

  return (
    <BrandShell currentPath="/blog/archive">
      {/* Archive List View */}
      {!selectedArticle && (
        <section className="bg-background py-20 md:py-28">
          <div className="container max-w-3xl space-y-8">
            <div className="space-y-4">
              <a href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold/80 transition">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </a>
              <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
                Article Archive
              </h1>
              <p className="text-base leading-8 text-muted-foreground">
                Explore all of Nancy's articles. Each piece is crafted to inspire, challenge, and equip you on your journey to finding your voice.
              </p>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article.id)}
                  className="w-full text-left rounded-lg border-2 border-brand-gold bg-white/5 p-6 transition-all hover:bg-white/10 hover:shadow-[0_8px_24px_rgba(200,168,75,0.15)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl text-foreground">{article.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-brand-gold">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article View */}
      {selectedArticleData && (
        <section className="bg-background py-20 md:py-28">
          <div className="container max-w-3xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="mb-8 flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold/80 transition"
            >
              ← Back to archive
            </button>

            <article className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-brand-gold">
                  <span>{selectedArticleData.category}</span>
                  <span>•</span>
                  <span>{selectedArticleData.readTime}</span>
                </div>
                <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  {selectedArticleData.title}
                </h1>
              </div>

              <div className="prose prose-invert max-w-none space-y-6 text-base leading-8 text-muted-foreground">
                {selectedArticleData.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h2 key={index} className="font-display text-2xl text-foreground mt-8">
                        {paragraph.replace(/\*\*/g, '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <ul key={index} className="space-y-2 pl-6">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="list-disc text-muted-foreground">
                            {item.replace(/^- /, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.match(/^\d\./)) {
                    return (
                      <ol key={index} className="space-y-2 pl-6 list-decimal">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="text-muted-foreground">
                            {item.replace(/^\d\. /, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={index} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              <div className="border-t border-brand-border pt-8 mt-12">
                <p className="text-sm text-muted-foreground mb-6">
                  Nancy Dixon is the founder of Divine Collective LLC and the author of You Have Something to Say…Use Your Voice.
                </p>

                {/* Social Sharing Section */}
                <div className="space-y-4 mb-8">
                  <p className="text-sm font-semibold text-foreground">Share this article:</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(selectedArticleData.socialCaption)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-gold bg-white/5 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(200,168,75,0.1)]"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-gold bg-white/5 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(200,168,75,0.1)]"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                    <button
                      onClick={() => {
                        const text = `${selectedArticleData.title}\n\n${selectedArticleData.socialCaption}\n\nRead on Divine Collective blog`;
                        alert(`Copy this text to share on Instagram:\n\n${text}`);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-gold bg-white/5 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(200,168,75,0.1)]"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="brand-button brand-button-primary inline-flex"
                >
                  Back to archive <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          </div>
        </section>
      )}
    </BrandShell>
  );
}
