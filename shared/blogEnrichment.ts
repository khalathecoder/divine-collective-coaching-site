/**
 * PROPOSED ADDITIONS to the blog posts. Nancy's approval required.
 *
 * Nothing in shared/blogArticles.ts is edited by this file. Every word she
 * wrote stays exactly as she wrote it. This file holds only *new* material that
 * is appended below each post:
 *
 *   - scripture:  verses she alludes to but never cites, quoted with the
 *                 reference so the post can rank for that verse.
 *   - faq:        questions people actually type into Google, answered in her
 *                 framework. Question-shaped text is what wins featured
 *                 snippets and "People also ask" placements.
 *   - resources:  internal links to the quiz, assessment, programs and shop.
 *                 The posts currently contain zero links, so a reader who
 *                 finishes one has nowhere to go and the pages pass no
 *                 authority to anything.
 *
 * If she wants none of it, delete this file and remove <ArticleEnrichment/>
 * from client/src/pages/BlogArticle.tsx. The posts return to exactly what they
 * are today.
 *
 * Scripture is quoted from the King James Version, which is public domain.
 * Swap the translation freely -- each verse carries its own `translation` field.
 *
 * A deliberate omission: nothing here invents biography. Her posts are personal
 * testimony, and the only person who can add to that story is her. Where a post
 * is thin, the gap is marked in docs/blog-seo-review.md as something she needs
 * to fill, not something this file guesses at.
 */

export interface ScriptureQuote {
  reference: string;
  text: string;
  translation: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ResourceLink {
  label: string;
  href: string;
  description: string;
}

export interface ArticleEnrichment {
  /** Matches BlogArticle.id. */
  slug: string;
  /** Heading for the scripture block. Written to carry the target search term. */
  scriptureHeading?: string;
  scripture?: ScriptureQuote[];
  faq?: FaqEntry[];
  resources?: ResourceLink[];
}

const QUIZ: ResourceLink = {
  label: "Voice Activation Quiz",
  href: "/voice-quiz",
  description: "Five minutes to find the pattern that keeps you quiet. Free.",
};

const ASSESSMENT: ResourceLink = {
  label: "Divine Mindset Assessment",
  href: "/divine-mindset-assessment",
  description: "Assess the beliefs underneath your self-worth and get a roadmap.",
};

const PROGRAMS: ResourceLink = {
  label: "Coaching programs",
  href: "/programs",
  description: "One-to-one and group coaching for women ready to move.",
};

const SHOP: ResourceLink = {
  label: "Divine Mindset Guide",
  href: "/shop",
  description: "The written guide to renewing your mind and rebuilding worth.",
};

export const ARTICLE_ENRICHMENT: ArticleEnrichment[] = [
  {
    slug: "self-worth-vs-confidence",
    scriptureHeading: "Self-Esteem vs Self-Worth in Scripture",
    scripture: [
      {
        reference: "Romans 12:2",
        text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
        translation: "KJV",
      },
      {
        reference: "Psalm 139:14",
        text: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
        translation: "KJV",
      },
      {
        reference: "Ephesians 2:10",
        text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What is the difference between self-esteem and self-worth?",
        answer:
          "Self-esteem is an estimate. It is built on what you do, how you perform, and how others respond, so it rises and falls with your circumstances. Self-worth is a fixed value that was established before you performed anything at all. Esteem is earned and can be lost; worth is given and cannot be.",
      },
      {
        question: "Can you have high self-esteem and low self-worth?",
        answer:
          "Yes, and it is more common than most women realise. A woman can be accomplished, capable and outwardly confident while still believing at the deepest level that she has to keep producing to deserve her place. That is exactly the gap where a voice goes quiet.",
      },
      {
        question: "What does the Bible say about self-worth?",
        answer:
          "Scripture locates worth in God's act of creating and choosing, not in human achievement. Psalm 139:14 calls you fearfully and wonderfully made, and Ephesians 2:10 calls you His workmanship. In both, the value is assigned by the maker before the work begins.",
      },
      {
        question: "How do you build self-worth as a Christian woman?",
        answer:
          "You do not build it. You accept it, and then you renew the internal story that contradicts it. Romans 12:2 calls this the renewing of the mind. In practice that means naming the belief that has kept you silent, setting it beside what God says, and choosing the second one out loud until it becomes the one you believe.",
      },
    ],
    resources: [ASSESSMENT, SHOP, PROGRAMS],
  },

  {
    slug: "appointed-not-nominated",
    scriptureHeading: "Jeremiah 1:5, in Full",
    scripture: [
      {
        reference: "Jeremiah 1:5",
        text: "Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations.",
        translation: "KJV",
      },
      {
        reference: "Jeremiah 1:6-7",
        text: "Then said I, Ah, Lord God! behold, I cannot speak: for I am a child. But the Lord said unto me, Say not, I am a child: for thou shalt go to all that I shall send thee, and whatsoever I command thee thou shalt speak.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What does Jeremiah 1:5 mean?",
        answer:
          "It records God telling Jeremiah that his calling predates his existence. Three verbs carry the meaning: God knew him, set him apart, and appointed him, all before birth. The point is sequence. The calling came first, and Jeremiah's qualifications never entered into it.",
      },
      {
        question: "Is Jeremiah 1:5 about everyone or only about Jeremiah?",
        answer:
          "The verse was spoken to Jeremiah about a specific prophetic office. The pattern it reveals, that God assigns purpose before performance, runs through the whole of scripture and is not limited to him. Read it as a promise about how God works, not as a transfer of Jeremiah's particular job.",
      },
      {
        question: "What is the difference between being appointed and being nominated?",
        answer:
          "A nomination is a suggestion that still needs someone else to approve it. An appointment is settled by the one with the authority to make it. Jeremiah 1:5 is an appointment, which means there is no committee left to convince and no vote still outstanding.",
      },
      {
        question: "How did Jeremiah respond to his calling?",
        answer:
          "He objected. In verse six he says he cannot speak because he is a child. God does not agree with the self-assessment and does not remove the assignment; He answers the objection and sends him anyway. Feeling unqualified is part of the story, not a disqualification from it.",
      },
    ],
    resources: [QUIZ, PROGRAMS],
  },

  {
    slug: "cost-of-silence",
    scriptureHeading: "The Verses Behind This: Proverbs 18:21 and Esther 4:14",
    scripture: [
      {
        reference: "Proverbs 18:21",
        text: "Death and life are in the power of the tongue: and they that love it shall eat the fruit thereof.",
        translation: "KJV",
      },
      {
        reference: "Esther 4:14",
        text: "For if thou altogether holdest thy peace at this time, then shall there enlargement and deliverance arise to the Jews from another place; but thou and thy father's house shall be destroyed: and who knoweth whether thou art come to the kingdom for such a time as this?",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What does Proverbs 18:21 mean?",
        answer:
          "It says words carry consequence in both directions. The tongue can build a life or end one, and whoever uses it will live with what it produces. The second half is the part usually left out: you eat the fruit of your own speech, which means silence has a harvest too.",
      },
      {
        question: "What does it mean that death and life are in the power of the tongue?",
        answer:
          "It means speech is not neutral commentary on reality but something that acts on it. What you say about yourself, to yourself, and to other people sets things in motion. Withholding words is therefore also a choice with consequences, not a way of avoiding them.",
      },
      {
        question: "What is an Esther moment?",
        answer:
          "It is the point where the position you already hold turns out to be the reason you are able to speak. Esther 4:14 puts it as a question rather than a command: who knows whether you have come to this place for such a time as this. The moment is defined by timing and access, not by feeling ready.",
      },
      {
        question: "Is staying silent a sin?",
        answer:
          "Scripture treats silence as a choice with weight rather than a category of sin. Ecclesiastes 3:7 says there is a time to keep silence and a time to speak, so the question is never whether silence is allowed but whether this is the moment for it. Esther's story is what happens when the answer is no.",
      },
    ],
    resources: [QUIZ, PROGRAMS],
  },

  {
    slug: "voice-youve-been-waiting-for",
    scriptureHeading: "Scripture on Finding Your Voice",
    scripture: [
      {
        reference: "1 Peter 2:9",
        text: "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light.",
        translation: "KJV",
      },
      {
        reference: "Proverbs 31:8",
        text: "Open thy mouth for the dumb in the cause of all such as are appointed to destruction.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "How do you find your voice?",
        answer:
          "You start using it before you feel ready, in a room you are already standing in. Finding your voice is not a discovery that happens privately and then gets announced; it is the result of speaking honestly in small settings until the honest version becomes your default. One conversation, one message you have been avoiding, one thing said out loud instead of swallowed.",
      },
      {
        question: "Why is it so hard to speak up?",
        answer:
          "Because most women are not waiting on courage, they are waiting on permission, and permission is the one thing no one else can hand over. The delay usually comes from an internal story about whether your perspective earns a place in the room, and that story does not change by waiting.",
      },
      {
        question: "Do I need a platform to use my voice?",
        answer:
          "No. A platform amplifies a voice that is already in use; it does not create one. The women whose voices carry weight almost always started in ordinary conversations, and the audience arrived afterwards.",
      },
      {
        question: "How do I know if I have something worth saying?",
        answer:
          "If you have lived through something and come out the other side with a perspective on it, you have material. The test is not whether it is original but whether it is true and whether someone further back on the same road needs to hear it.",
      },
    ],
    resources: [QUIZ, ASSESSMENT, PROGRAMS],
  },

  {
    slug: "you-are-worthy",
    scriptureHeading: "What the Bible Says About Self-Worth",
    scripture: [
      {
        reference: "Genesis 1:27",
        text: "So God created man in his own image, in the image of God created he him; male and female created he them.",
        translation: "KJV",
      },
      {
        reference: "Psalm 139:14",
        text: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
        translation: "KJV",
      },
      {
        reference: "Luke 12:7",
        text: "But even the very hairs of your head are all numbered. Fear not therefore: ye are of more value than many sparrows.",
        translation: "KJV",
      },
      {
        reference: "Ephesians 2:10",
        text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What does the Bible say about self-worth?",
        answer:
          "It grounds worth in creation and in God's valuation, never in performance. Genesis 1:27 says you were made in His image, Psalm 139:14 that you were made deliberately and well, and Luke 12:7 that God counts you of great value. In each case the worth is assigned before anything is achieved.",
      },
      {
        question: "Is self-worth biblical?",
        answer:
          "Yes, though scripture frames it differently than self-help does. The Bible does not tell you to generate a high opinion of yourself; it tells you to accept the value God already assigned. That is why worth holds steady when confidence does not: its source is outside your performance.",
      },
      {
        question: "What Bible verses talk about knowing your worth?",
        answer:
          "Genesis 1:27, Psalm 139:14, Luke 12:7, Ephesians 2:10 and 1 Peter 2:9 are the ones that come up most. Read together they say the same thing from five directions: you were made on purpose, made well, counted valuable, prepared for specific work, and chosen.",
      },
      {
        question: "How do I stop feeling unworthy?",
        answer:
          "Stop treating the feeling as evidence. Unworthiness usually arrives as a conclusion drawn from how you were treated, which is a fact about other people rather than about your value. Write the belief down, set the verse beside it, and say the second one until it is the one you reach for first.",
      },
    ],
    resources: [ASSESSMENT, SHOP, PROGRAMS],
  },

  {
    slug: "fear-has-a-name",
    scriptureHeading: "Bible Verses About Fear",
    scripture: [
      {
        reference: "2 Timothy 1:7",
        text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
        translation: "KJV",
      },
      {
        reference: "Isaiah 41:10",
        text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
        translation: "KJV",
      },
      {
        reference: "Proverbs 29:25",
        text: "The fear of man bringeth a snare: but whoso putteth his trust in the Lord shall be safe.",
        translation: "KJV",
      },
      {
        reference: "Psalm 56:3",
        text: "What time I am afraid, I will trust in thee.",
        translation: "KJV",
      },
      {
        reference: "Romans 8:31",
        text: "What shall we then say to these things? If God be for us, who can be against us?",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What does the Bible say about fear?",
        answer:
          "It distinguishes between reverence for God and the fear that paralyses. The second kind is what 2 Timothy 1:7 rules out, naming power, love and a sound mind as what was given instead. Scripture does not promise the absence of fear; it promises presence in it, which is what Isaiah 41:10 says.",
      },
      {
        question: "What does 2 Timothy 1:7 mean?",
        answer:
          "It identifies the source of paralysing fear as something other than God, and then names the three things He did give: power to act, love that turns attention outward, and a sound mind that can think clearly under pressure. It is a verse about origin, which matters because you argue differently with a fear once you know where it came from.",
      },
      {
        question: "What is the fear of man?",
        answer:
          "It is the fear of other people's opinions, and Proverbs 29:25 calls it a snare: something that catches you by using an ordinary human desire to belong. It is the specific fear that keeps a capable woman quiet in a room she has every right to speak in.",
      },
      {
        question: "How do I overcome fear of failure as a Christian?",
        answer:
          "Treat courage as a habit rather than a feeling. Name the fear in writing, ask what the realistic worst case actually is, take one small action while still afraid, and pray through it rather than around it. Every repetition teaches you something the fear denied.",
      },
    ],
    resources: [QUIZ, PROGRAMS],
  },

  {
    slug: "finding-your-voice-framework",
    scriptureHeading: "Scripture Behind the Framework",
    scripture: [
      {
        reference: "Habakkuk 2:2",
        text: "Write the vision, and make it plain upon tables, that he may run that readeth it.",
        translation: "KJV",
      },
      {
        reference: "Philippians 1:6",
        text: "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What is the V.O.I.C.E. framework?",
        answer:
          "It is a five-part sequence for moving from silence into purpose: Vision, Opportunity, Inspiration, Commitment and Elevation. Each element builds on the one before it, so elevation is treated as a result of the first four rather than a starting point.",
      },
      {
        question: "How do you find your purpose?",
        answer:
          "Start with vision, which means seeing yourself as God sees you rather than as your history describes you. Purpose is rarely discovered by introspection alone; it becomes clear as you take opportunities in front of you and notice which ones you were built for.",
      },
      {
        question: "What does the V in V.O.I.C.E. stand for?",
        answer:
          "Vision. It is first because everything after it depends on the picture you hold of who you are becoming. Opportunity, Inspiration, Commitment and Elevation follow in that order.",
      },
      {
        question: "How long does it take to find your voice?",
        answer:
          "There is no fixed timeline, because the framework is practised rather than completed. Most women notice the shift once commitment becomes routine, when speaking honestly stops requiring a decision each time.",
      },
    ],
    resources: [QUIZ, SHOP, PROGRAMS],
  },

  {
    slug: "permission-to-lead",
    scriptureHeading: "Scripture on Leading Without a Title",
    scripture: [
      {
        reference: "Esther 4:14",
        text: "And who knoweth whether thou art come to the kingdom for such a time as this?",
        translation: "KJV",
      },
      {
        reference: "Joshua 1:9",
        text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
        translation: "KJV",
      },
      {
        reference: "1 Timothy 4:12",
        text: "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "Can women be leaders according to the Bible?",
        answer:
          "Scripture records women leading throughout: Deborah judged Israel, Esther acted to save her people, Priscilla taught, and Phoebe carried Paul's letter to Rome. The pattern is that leadership follows conviction and availability rather than title.",
      },
      {
        question: "Do I need a title to be a leader?",
        answer:
          "No. A title assigns authority within an organisation; it does not create the influence that makes someone worth following. Most of the leadership that changes anything happens before a title arrives, and some of it never gets one.",
      },
      {
        question: "How do I stop waiting for permission?",
        answer:
          "Recognise that the permission is not withheld, it is simply not coming from outside. Decide what you would do if someone had already granted it, then do that thing at the smallest scale available to you this week.",
      },
      {
        question: "What does the Bible say about confidence in leadership?",
        answer:
          "Joshua 1:9 ties courage to presence rather than competence: be strong and courageous because God is with you wherever you go. The confidence scripture describes is not certainty about your ability but certainty about who is with you.",
      },
    ],
    resources: [PROGRAMS, QUIZ],
  },

  {
    slug: "silence-costs",
    scriptureHeading: "Scripture on Speaking and Staying Silent",
    scripture: [
      {
        reference: "Ecclesiastes 3:7",
        text: "A time to rend, and a time to sew; a time to keep silence, and a time to speak.",
        translation: "KJV",
      },
      {
        reference: "Proverbs 18:21",
        text: "Death and life are in the power of the tongue: and they that love it shall eat the fruit thereof.",
        translation: "KJV",
      },
    ],
    faq: [
      {
        question: "What is the cost of staying silent?",
        answer:
          "It is paid in three currencies: peace, because unspoken things do not leave; potential, because opportunities go to people who are heard; and connection, because no one can respond to what you never said. The price is real but delayed, which is what makes silence feel free.",
      },
      {
        question: "When should you speak up and when should you stay quiet?",
        answer:
          "Ecclesiastes 3:7 says there is a time for each, so the question is one of discernment rather than rule. A useful test: if you are staying quiet to protect someone else, that may be wisdom, and if you are staying quiet to protect yourself from a reaction, that is usually fear.",
      },
      {
        question: "Why do I struggle to speak my truth?",
        answer:
          "Usually because at some point speaking cost you something and staying quiet did not, so silence became the habit that felt safest. The habit outlives the situation that created it, which is why it keeps operating in rooms that are no longer dangerous.",
      },
    ],
    resources: [QUIZ, PROGRAMS],
  },
];

const ENRICHMENT_INDEX = new Map(
  ARTICLE_ENRICHMENT.map(entry => [entry.slug, entry])
);

export function getArticleEnrichment(slug: string): ArticleEnrichment | undefined {
  return ENRICHMENT_INDEX.get(slug);
}
