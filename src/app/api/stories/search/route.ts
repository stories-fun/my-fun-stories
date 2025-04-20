import { NextResponse } from "next/server";
import { VectorSearchService } from "../../../../server/vector-search/vectorSearch";
import type { StoryVector } from "../../../../server/vector-search/types";

const vectorSearch = new VectorSearchService();

// Initialize with sample stories
const sampleStories: StoryVector[] = [
  {
    id: "1",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "How I Switched from Finance to Product Management at 35",
      content: `After spending 12 years in investment banking, I finally admitted to myself that I was deeply unhappy with my career path. The money was great, but the 80-hour weeks had taken a toll on my health and relationships. I was 35 years old and felt trapped in a golden cage.

One evening after a particularly grueling day, I found myself browsing through tech blogs instead of reviewing financial models. I realized I'd been doing this more and more - reading about product launches, UX design, and technology trends. It sparked something in me that I hadn't felt in years: genuine curiosity and excitement.

I decided to take a leap of faith. I enrolled in a part-time product management course while still working my banking job. For six months, I would work all day, then attend classes at night and on weekends. It was exhausting, but for the first time in years, I felt energized rather than drained.

The biggest challenge wasn't learning the technical skills - it was figuring out how to position my experience for a career switch. I had no tech background, and product management roles typically went to people with engineering degrees or startup experience. But I did have strengths: I knew how to work with stakeholders, analyze markets, and understand financial constraints.

I created a strategic plan for my transition. First, I volunteered to work on digital transformation projects within my bank, which gave me relevant experience to talk about. I networked relentlessly, attending tech meetups and product management conferences. I built a portfolio by helping a friend's startup define their MVP and roadmap.

The rejection letters piled up at first. I had 15 interviews over four months with no offers. But each interview taught me more about how to frame my story. Eventually, a fintech company took a chance on me - they needed someone who understood both finance and product development.

The first six months were brutal. I took a 40% pay cut and felt like I was starting over completely. There were days I questioned my decision, especially when I struggled with technical concepts my younger colleagues seemed to grasp effortlessly.

But three years later, I can honestly say it was the best decision I've ever made. I now lead a product team working on financial inclusion tools. I work 45-50 hours a week instead of 80, giving me time to rebuild relationships and focus on my health. Most importantly, I look forward to Monday mornings again.

To anyone considering a major career change in their 30s or beyond: it's not too late. It will be harder than you expect, and at times you'll want to give up. But the alternative - spending decades in a career that doesn't fulfill you - is far worse. Start small, be strategic, leverage your existing strengths, and don't let rejection discourage you. The other side is worth it.`,
      username: "career_shifter",
      createdAt: new Date(),
      walletAddress: "0x123",
    },
  },
  {
    id: "2",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "My Journey Through Grief and Meditation",
      content: `When my wife died unexpectedly three years ago, I thought my life was over. We'd been together for 17 years, and suddenly I was alone, trying to raise our two children while processing a grief so overwhelming that some days I couldn't even get out of bed.

The first six months were a blur of funeral arrangements, legal paperwork, and trying to help my kids process their own grief while barely managing my own. I was functioning on autopilot, moving through necessary tasks while feeling completely hollow inside. At night, after the kids were asleep, I would sit in our bedroom and feel the weight of her absence crushing me. I wasn't eating properly, wasn't sleeping, and was shutting out friends and family who tried to help.

It was my sister who finally intervened. She had been practicing Vipassana meditation for years and suggested I attend a 10-day silent retreat. Initially, I resisted - how could sitting in silence possibly help when my whole world had collapsed? But I was desperate and out of options, so I arranged for my parents to watch the kids, and I went.

Those 10 days changed everything. Vipassana meditation taught me to observe my grief rather than be consumed by it. For hours each day, I sat with my pain, watching it rise and fall without judgment. The silence allowed me to finally hear my own thoughts and begin processing what had happened.

The retreat wasn't a magical cure. I cried every day, sometimes during meditation, sometimes alone in my room at night. But slowly, I began to separate myself from my grief - to understand that I was experiencing grief, but that I was not grief itself.

When I returned home, I committed to a daily practice - just 20 minutes each morning before the kids woke up. On the days I meditated, I found I could be more present with my children. I could talk about their mother without breaking down, which allowed them to share their own memories and feelings.

In the years since, meditation has remained my anchor. Through my practice, I've learned that healing isn't linear. Some days are still unbearably hard, particularly birthdays and anniversaries. But I now have tools to move through these difficult moments with awareness rather than avoidance.

Vipassana also unexpectedly connected me to a community of people on similar journeys. Through meditation groups, I've met others who understand loss and are working to transform their relationship with pain. These connections have been invaluable in making me feel less alone.

Most recently, I've begun exploring how blockchain technology might help create digital legacies for loved ones. My background in computer science led me to discover projects in the crypto space focused on preserving memories and stories. Working on these projects has given new meaning to my grief, allowing me to channel it into something that might help others.

I will always miss my wife. The grief hasn't disappeared - it has transformed. Meditation taught me that I don't need to run from pain or try to "get over it." Instead, I've learned to carry my grief with greater ease and even find moments of joy alongside it. For anyone in the depths of loss, I can only share what helped me: be gentle with yourself, find practices that ground you, and trust that while the pain may never completely disappear, your relationship with it can change.`,
      username: "mindful_journeyer",
      createdAt: new Date(),
      walletAddress: "0x456",
    },
  },
  {
    id: "3",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "From Homeless to Software Engineer at 25",
      content: `At 19, I was homeless, sleeping on friends' couches when I could and in my car when I couldn't. My parents had kicked me out after a series of bad decisions - dropping out of high school, hanging with the wrong crowd, and developing a substance abuse problem. I don't blame them now; they'd tried everything they could to help me, and I'd rejected it all.

Rock bottom came when my car got towed with everything I owned inside it. I didn't have the money to get it back, so I lost my transportation, my shelter, and all my possessions in one day. I spent that night in a park, terrified and completely broken.

The next morning, I walked to the public library because it was raining, and I needed somewhere dry to figure out my next move. I found an empty computer and started searching for homeless shelters. The person next to me was working on something that caught my eye - lines of code on the screen that seemed to be building something.

I asked what he was doing, and he explained he was a self-taught programmer working on a freelance project. He showed me how the code he was writing would turn into a website, and something clicked for me. It seemed like magic - creating something from nothing using just logic and language.

I spent the next few weeks living at a shelter while spending every day at the library. I found free coding tutorials online and worked through them obsessively. The library had a 2-hour computer time limit, so I would cycle between different branches across the city to maximize my learning time. When I couldn't use a computer, I read programming books.

After three months, I could build basic websites. I started finding small gigs on freelance platforms - $50 here, $100 there for simple sites. It wasn't much, but it was enough to rent a room in a shared house and buy a used laptop.

What followed were two years of 16-hour days - working minimum wage jobs to pay rent while coding every spare minute. I treated free online courses like a college education, methodically working through curriculum on algorithms, data structures, and programming languages. I built projects for my portfolio and contributed to open-source to gain experience.

My first break came when a local startup took a chance on me as a junior developer. The salary was below market rate, but I didn't care - it was my entry into the industry. I soaked up knowledge from senior developers and volunteered for the most challenging tasks. Within a year, I was promoted to a mid-level position.

Today, at 25, I'm a senior software engineer at a tech company in Seattle. My salary is in the six figures - something unimaginable to the homeless kid I was six years ago. I've remained sober for five years, repaired my relationship with my parents, and even mentor at-risk youth through a coding program.

The path wasn't easy. I faced plenty of rejections, especially without a degree. I battled imposter syndrome at every step. There were many nights I fell asleep at my keyboard from exhaustion. But technology gave me something I desperately needed: a meritocratic field where my background mattered less than my skills and determination.

If there's anything I've learned, it's that resilience isn't about never falling - it's about getting up one more time than you fall. No matter how dire your circumstances, there's always a path forward if you're willing to work relentlessly and ask for help when you need it. Six years ago, I had nothing. Today, I build the future.`,
      username: "code_phoenix",
      createdAt: new Date(),
      walletAddress: "0x789",
    },
  },
  {
    id: "4",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Building My Design Agency While Battling Chronic Illness",
      content: `When I was diagnosed with Multiple Sclerosis at 28, my neurologist told me I needed to find a "less stressful" career than my job as a graphic designer at a high-pressure advertising agency. The long hours, tight deadlines, and constant client demands were making my symptoms worse. But design wasn't just my career - it was my passion, my identity.

Rather than abandon my profession, I decided to reshape it around my new reality. I left the agency world and started freelancing from home, allowing me to work during my high-energy hours and rest when fatigue hit. This flexibility was life-changing, but freelancing came with its own stresses - inconsistent income, isolation, and the pressure of handling everything alone.

After a year of freelancing, during a particularly bad MS flare-up that left me bedridden for weeks, I had an epiphany: there must be other talented designers with chronic illnesses or disabilities facing similar challenges. What if we could work together, covering for each other during health setbacks while building something sustainable?

That idea became Adaptive Design Collective, a virtual design agency specifically employing designers with chronic illnesses and disabilities. I started by partnering with two other designers I'd met in online support groups - Emma, who has lupus, and Darian, who uses a wheelchair following a spinal cord injury.

Building a business while managing unpredictable health was extraordinarily difficult. I wrote our business plan during hospital stays, sometimes working from my phone when I couldn't sit at a computer. We faced skepticism from potential clients who doubted our reliability given our health challenges. And there were no roadmaps for the kind of company culture we needed to create - one that truly prioritized wellbeing alongside quality work.

We turned our limitations into our unique value proposition. We implemented a collaborative workflow where multiple designers are familiar with each project, ensuring seamless coverage if someone has a health setback. We built longer timelines into our contracts, setting realistic expectations with clients from the start. And we developed a pricing model that allowed us to work fewer hours while maintaining sustainable income.

Three years later, Adaptive Design Collective employs twelve designers across the country, all living with various chronic conditions or disabilities. We've worked with over 50 clients, from small nonprofits to Fortune 500 companies. Our client retention rate is over 90% - turns out that designers who have learned to adapt to unpredictable circumstances are exceptionally good at adapting to changing client needs as well.

We're still figuring things out. Some weeks, half our team might be dealing with health issues simultaneously. We've had to turn down projects we couldn't responsibly take on. But we've created something I couldn't find when I needed it most: a workplace that values both our professional skills and our health needs.

MS hasn't stopped progressing. I have good days and bad days, and I've had to adapt how I work as my symptoms have evolved. I now use adaptive technology and dictation software when hand tremors make design work challenging. But I'm still a designer, still creating work I'm proud of, and now helping others do the same.

If you're facing a health challenge that's affecting your career, know this: sometimes the path forward isn't abandoning what you love, but reimagining how you do it. Your limitations might actually lead you to innovations and opportunities you wouldn't have discovered otherwise. And you don't have to figure it all out alone - finding others navigating similar challenges can be the beginning of something powerful.`,
      username: "adaptive_designer",
      createdAt: new Date(),
      walletAddress: "0xabc",
    },
  },
  {
    id: "5",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Finding Love After 40 in the Digital Age",
      content: `When my 15-year marriage ended at 42, I felt like I'd been catapulted into an alternate universe. The dating landscape had completely transformed during my years of marriage. Apps, swiping, texting etiquette - it all seemed designed for a generation much younger than mine. Add to that being a single dad with two teenagers and having a demanding job as a construction project manager, and dating seemed nearly impossible.

My first attempts were disasters. I used photos that were too old (a major faux pas, I quickly learned). I had no idea how to write a profile that didn't sound either desperate or boring. And the first time someone asked me to "Netflix and chill," I actually showed up with a six-pack of beer thinking we were going to watch a documentary.

After several months of false starts and awkward dates, I was ready to resign myself to permanent singlehood. But my daughter - then 16 and infinitely more socially savvy than me - staged an intervention. "Dad," she said, "your profile needs serious help." She took new photos of me that actually looked like me, helped me write a profile that was authentic rather than trying too hard, and gave me a crash course in modern dating terminology.

Armed with my upgraded dating presence, I shifted my approach. Instead of trying to hide aspects of my life that I thought might be unattractive - like being a dad with limited free time - I put them front and center. My profile openly stated that my kids were my priority and any relationship would need to work around co-parenting schedules. Rather than limiting my options, this honesty actually filtered out incompatible matches.

I also expanded beyond dating apps. I joined a hiking group for singles over 40, took a cooking class, and attended industry networking events with a more open mindset. This diversified approach led to meeting more people who shared my interests and life stage.

About a year into my dating journey, I connected with Elena on a gardening forum of all places. Neither of us was looking for a relationship in that space - we were literally discussing the best way to grow tomatoes. Our conversation naturally evolved from plant care to other aspects of our lives. She was also divorced, with a daughter in college and a career as an environmental consultant.

We emailed for three weeks before moving to phone calls, and talked for another month before meeting in person. This slow pace felt refreshingly counter to the rushed nature of app dating. By the time we had our first date at a local botanical garden, it felt like meeting an old friend.

Dating in my 40s has been nothing like my 20s. The connections are deeper because we both know who we are. We've built careers, raised children, weathered failures, and come out the other side with clarity about what matters. Elena and I have been together for two years now, and we're discussing moving in together once my youngest goes to college next year.

For others finding themselves dating at midlife, I'd offer this: the landscape might seem foreign, but you bring wisdom and self-knowledge that you didn't have decades ago. Be honest about your circumstances and priorities. Don't try to contort yourself to fit what you think others want. Use technology as a tool, but don't forget the value of organic connections. And listen to your teenagers - sometimes they actually know what they're talking about.`,
      username: "second_time_around",
      createdAt: new Date(),
      walletAddress: "0xdef",
    },
  },
  {
    id: "6",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "From Corporate Lawyer to Sustainable Farmer at 40",
      content: `After fifteen years as a corporate attorney in Manhattan, I found myself staring out my corner office window wondering how I'd ended up so far from the environmental idealist I'd been in law school. I was 40, successful by conventional metrics, but deeply unfulfilled.
  
  My wake-up call came during a pro bono case representing indigenous communities fighting against agricultural conglomerates. While researching sustainable farming practices, I discovered regenerative agriculture – a holistic approach that rebuilds soil health while sequestering carbon. Something clicked. I began spending weekends visiting small organic farms outside the city, volunteering and learning everything I could.
  
  My colleagues thought I was having a midlife crisis when I announced I was leaving the firm. My parents were bewildered. My spouse was supportive but concerned about our financial stability. I understood their worries – we had a mortgage, college funds to build, and I was walking away from a seven-figure salary.
  
  I used my savings to purchase 30 acres of depleted farmland in the Hudson Valley. The first two years were brutal. I worked harder physically than I ever had in my life, made countless expensive mistakes, and wondered almost daily if I'd made a catastrophic error. My legal background helped navigate agricultural regulations, but couldn't prepare me for crop failures, equipment breakdowns, and the unpredictability of weather.
  
  Six years later, Silver Creek Farm is now a thriving community-supported agriculture operation serving over 200 families. We run educational programs for schools and host apprenticeships for aspiring young farmers. My legal skills haven't gone to waste – I provide pro bono services to other small farmers navigating land access and regulatory challenges.
  
  My income is a fraction of what it once was, but my life is immeasurably richer. I work alongside my teenage children, who now understand where food comes from and what environmental stewardship truly means. I sleep soundly, with dirt under my fingernails and the satisfaction of growing real value – nutritious food and healthy soil for future generations.`,
      username: "soil_advocate",
      createdAt: new Date(),
      walletAddress: "0x234",
    },
  },
  {
    id: "7",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title:
        "Rebuilding Life After Incarceration: My Path to Software Engineering",
      content: `I spent seven years in prison for a non-violent drug offense I committed at 19. While inside, I was determined to use every minute preparing for a different life upon release. The prison had a limited educational program that offered basic computer skills classes. I took every course available, then convinced the instructor to bring in more advanced materials.
  
  With no internet access, I learned to code from outdated textbooks, writing programs on paper before testing them during my limited computer lab time. I started teaching other inmates, which reinforced my own learning. Prison showed me how many talented people end up incarcerated due to circumstances and poor choices, not lack of potential.
  
  Release day was both exhilarating and terrifying. I had programming knowledge but a seven-year resume gap and a felony record. I stayed with my grandmother while applying for entry-level tech positions, only to face rejection after rejection. Companies that seemed impressed with my phone interviews would ghost me after background checks.
  
  My breakthrough came through a coding bootcamp with a second-chance initiative specifically for formerly incarcerated individuals. Their six-month program provided updated skills, but more importantly, connections to companies open to hiring people with records. The program wasn't charity – it was rigorous and many didn't complete it – but it provided the bridge I desperately needed.
  
  A small tech firm finally took a chance on me as a junior developer. I worked twice as hard as everyone else, afraid any mistake would confirm negative stereotypes about "ex-cons." Gradually, my work spoke for itself. Four years and two promotions later, I now lead a development team and mentor others coming from similar backgrounds.
  
  I recently launched Code Second Chances, a nonprofit that teaches programming in prisons and connects returning citizens with tech opportunities. The recidivism rate for our graduates is under 5%, compared to the national average of over 40%. Technology offered me a path forward when most doors were closed, and I'm determined to hold that door open for others who deserve a second chance.`,
      username: "second_chance_coder",
      createdAt: new Date(),
      walletAddress: "0x345",
    },
  },
  {
    id: "8",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "How Learning to Dance at 60 Saved Me After My Husband's Death",
      content: `When Robert died after 37 years of marriage, I thought my life was essentially over. At 60, I found myself utterly alone for the first time. Our children lived across the country with families of their own. Friends tried to help, but their lives revolved around couple activities that only emphasized my new solitude.
  
  Grief counseling helped somewhat, but I still spent most days in empty silence. Then came the medical wake-up call – borderline diabetes, high blood pressure, and the beginning of osteoporosis. My doctor was blunt: "If you don't start moving, these conditions will worsen rapidly."
  
  I saw a flyer for senior ballroom dancing lessons at the community center and went on a whim, expecting to hate it. That first class was awkward and uncomfortable. I felt conspicuous, uncoordinated, and out of place. But the instructor, Elena, a vibrant woman in her seventies, wouldn't let me slink away. "Come back next week," she insisted. "It gets easier."
  
  She was right. Each week became slightly less intimidating. The physical activity began to lift my depression, and I slowly connected with other people – many also navigating loss and life transitions. Dancing gave me a structured way to interact without the pressure of conversation. Steps had to be learned, patterns followed – it was a language beyond words that gave my body purpose again.
  
  Six months in, I joined the center's performance group. A year later, I was volunteering, teaching beginner steps to newcomers even more terrified than I had been. Dance took me to competitions, weekend workshops, and eventually on a group tour to Argentina to study tango at its source.
  
  Today, at 68, I dance four times a week. My health has improved dramatically – I no longer need medication for diabetes or blood pressure, and my bone density has stabilized. I've developed deep friendships and even had a two-year relationship with a fellow dancer (it didn't last, but it taught me I could open my heart again).
  
  Robert would be proud of the woman I've become. I still miss him every day, but I've discovered that grief and joy can coexist. Movement saved me – not just physically, but by showing me that even in our darkest moments, we can learn new steps and find our way to unexpected joy.`,
      username: "dancing_through_grief",
      createdAt: new Date(),
      walletAddress: "0x456",
    },
  },
  {
    id: "9",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Trading My Silicon Valley Career for Rural Education",
      content: `By age 32, I had checked all the boxes for success in Silicon Valley. Stanford CS degree, early employee at a unicorn startup, enough stock options after our IPO to buy a small condo in the astronomically expensive Bay Area. I worked 70-hour weeks developing algorithms to maximize user engagement on our platform. The technical challenges were interesting, but something felt increasingly hollow about optimizing click-through rates to sell more ads.
  
  A family emergency called me back to my small hometown in Appalachia for what I thought would be a brief visit. My former high school had lost its only computer science teacher, and the principal – my former basketball coach – asked if I'd consider teaching for "just a semester" until they found a replacement.
  
  I agreed reluctantly, arranging a sabbatical from my tech job. Walking into that outdated computer lab with its decade-old hardware was a shock to my system. But watching students light up when they created their first programs – on machines I would have considered unusable – reminded me of my own introduction to coding on my family's shared desktop.
  
  These kids were brilliant but had so few opportunities. Many had never met a software engineer or considered tech careers despite having natural problem-solving abilities. The semester flew by, and when it ended, I made a decision that shocked everyone, including myself: I resigned from my Silicon Valley position and accepted a full-time teaching role.
  
  Four years later, I've never looked back. I've built a computer science program from scratch, secured grants for modern equipment, and established partnerships with regional tech companies for internships. Seventeen of my former students are now pursuing STEM degrees – the first in their families to attend college. I started a summer code camp that brings girls from throughout the region together for intensive project-based learning.
  
  My salary is one-third of what I made in California, but the cost of living is so much lower that I've actually saved enough to buy a small house with land – unimaginable in the Bay Area. More importantly, I'm using my technical skills to address the digital divide rather than widen it.
  
  Silicon Valley talks about changing the world through technology, but that change concentrates wealth and opportunity in already-privileged areas. Real transformation happens when technology skills reach communities that have been left behind. I no longer write code that generates millions in ad revenue, but I'm helping young people write their way toward futures they never imagined possible.`,
      username: "rural_tech_teacher",
      createdAt: new Date(),
      walletAddress: "0x567",
    },
  },
  {
    id: "10",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Becoming a Paralympic Athlete After a Workplace Accident",
      content: `The industrial accident that crushed my legs at 27 should have killed me. I was a construction foreman, used to being physically dominant, taking risks, pushing limits. After the twenty-foot fall and the machinery collapse, doctors said I was lucky to be alive. I didn't feel lucky. I felt destroyed.
  
  The amputation of my right leg below the knee and partial paralysis of my left leg sent me spiraling into depression and opioid dependence. I pushed away my fiancée, ignored friends, and retreated to my parents' basement. Physical therapy appointments were the only times I left the house, and I approached them with minimal effort. What was the point?
  
  My turning point came six months post-accident when my physical therapist, Maya, confronted me. "You're giving up," she said bluntly. "But your body hasn't. Your body is fighting to adapt and recover, and you're drowning it in self-pity and pills." She showed me videos of Paralympic athletes – people with far more significant disabilities than mine performing incredible athletic feats.
  
  Something in me snapped. The next day, I flushed my remaining pills and asked Maya to connect me with adaptive sports programs. She introduced me to a local wheelchair basketball team, but it was when she mentioned a para-cycling group that something clicked. Before my accident, I'd been an avid mountain biker. Maybe I could find my way back to something I loved.
  
  My first attempts were humiliating. I had no balance, no stamina, and fell constantly. But cycling gave me a focus outside my grief. I set incremental goals: ride for five minutes without stopping, then ten, then thirty. Each small victory rebuilt not just my physical strength but my shattered self-image.
  
  Three years of intensive training later, I qualified for national competitions in para-cycling. Two years after that, I represented the United States at the Paralympics, bringing home a bronze medal in the road race. Now I train full-time while running a foundation that provides adaptive sports equipment to newly injured people – equipment that would have been financially out of reach for me without assistance.
  
  I won't pretend my life is without challenges. Phantom pain, chronic inflammation, and the logistical complications of prosthetics are daily realities. But I've reclaimed agency and purpose. The accident forced me to redefine strength, moving from brute force to something more profound – the persistence to adapt, reinvent, and create meaning from circumstances I didn't choose.`,
      username: "adaptive_athlete",
      createdAt: new Date(),
      walletAddress: "0x678",
    },
  },
  {
    id: "11",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Starting Over in a New Country at 45",
      content: `I was a respected literature professor in my home country, with tenure, publications, and a comfortable middle-class life. Then came the political changes, the crackdown on academics, the choice between compromising my principles or facing consequences. At 45, with my teenage daughter, I fled with two suitcases and my doctoral diploma – a document that proved worthless in the country that granted us asylum.
  
  Our first months in America were a blur of bureaucratic appointments, temporary housing, and desperate job searches. My heavily accented English, sufficient for academic papers, marked me as an outsider in everyday interactions. The credentials that had defined my professional identity for decades meant nothing. No university would hire me without U.S. experience or connections.
  
  I took the first job I could find – stocking shelves overnight at a big-box store. The physical labor was exhausting, and the loneliness of working while others slept compounded my isolation. But it paid enough to rent a small apartment near a decent public school for my daughter. Watching her adapt, learn English rapidly, and make friends gave me strength on my darkest days.
  
  A turning point came when I overheard a customer struggling to communicate with a store manager in my native language. I offered to translate, and the grateful manager later asked if I'd be willing to help with other customers from my region. This small moment of using my linguistic skills rather than just my physical labor rekindled something in me.
  
  I began volunteering as a translator at a community center serving immigrants and refugees. There I met others rebuilding lives – doctors working as medical assistants, engineers driving taxis, lawyers working in restaurants. Their resilience inspired me to be more strategic about my own path forward.
  
  I enrolled in night classes to earn a teaching certification, studying after long shifts while my daughter slept. The process took three years, during which I advanced to department manager at the store. When I finally secured a position teaching ESL at a community college, it felt like coming home, even though the setting and students were utterly different from my previous academic life.
  
  Eight years after arriving in this country, I now direct the ESL program at the same college and teach literature courses as an adjunct at a state university. I've published articles on the immigrant academic experience and mentor other displaced scholars. My daughter is studying international relations at university – her English now better than mine.
  
  I'll never reclaim the exact career I lost, but I've built something meaningful from its ashes. In my literature classes, I bring perspectives on exile, identity, and reinvention that I could never have offered before living through them. The students I teach – many immigrants themselves – see in me both the reality of starting over and the possibility of creating a different but worthy future.`,
      username: "professor_in_exile",
      createdAt: new Date(),
      walletAddress: "0x789",
    },
  },
  {
    id: "12",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Overcoming Addiction Through Wilderness Therapy",
      content: `By 29, I had lost everything to opioid addiction – my job as a registered nurse, my apartment, my relationships with family, and nearly my life after two overdoses. When the court mandated treatment after my arrest for possession, I viewed it as just another hurdle in a life that had become an endless series of obstacles.
  
  Traditional rehab programs hadn't worked for me. Sitting in sterile rooms discussing triggers and coping mechanisms felt disconnected from the physical and emotional pain driving my addiction. When my court-appointed counselor suggested a wilderness therapy program as an alternative to jail time, I agreed out of desperation, not hope.
  
  The program placed eight of us – all struggling with various addictions – in the mountains of Colorado with three guides. We carried everything we needed on our backs and hiked miles daily. The first week was pure hell. Withdrawal symptoms while hiking at elevation nearly broke me. I couldn't sleep, couldn't eat, and cursed everyone who had put me in this situation.
  
  Gradually, something shifted. Without access to phones, media, or any distractions, I had to face the thoughts I'd been drowning with drugs. Physical exertion exhausted my body into brief periods of genuine sleep – my first in years without chemical assistance. The guides didn't lecture about addiction; instead, they taught us to build fires, find water sources, identify edible plants, and navigate by stars.
  
  These concrete survival skills became metaphors for recovery. Building a fire required patience, attention, and working with available materials – just like building a sober life. Reading weather patterns to prepare for storms paralleled recognizing emotional triggers before they overwhelmed me.
  
  Most transformative was the wilderness itself. After years of numbing myself to all sensation, I began to feel again – the burn in my muscles climbing a ridge, the satisfaction of reaching a summit, the simple pleasure of drinking from a mountain stream. The natural consequences of poor decisions were immediate and non-negotiable. If I didn't secure my food properly, animals took it – no one rescued me or fixed my mistake.
  
  Three months in the backcountry gave me what years of conventional treatment couldn't: embodied awareness, self-reliance, and connection to something larger than myself. When I returned to society, I trained to become a wilderness therapy guide, working with others while strengthening my own recovery.
  
  Six years sober now, I've reconciled with my family and rebuilt my nursing career, specializing in addiction medicine. I lead weekend wilderness experiences for healthcare workers struggling with substance use disorders. The skills that saved me in those mountains – presence, resilience, community – continue to sustain my recovery one day at a time.`,
      username: "wilderness_healer",
      createdAt: new Date(),
      walletAddress: "0x890",
    },
  },
  {
    id: "13",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Reinventing My Career After Industry Collapse",
      content: `For twenty-three years, I worked at the same newspaper, rising from cub reporter to managing editor. Journalism wasn't just my career – it was my identity, my community, my purpose. When digitization and declining ad revenue hit the industry, our staff shrank from 150 to 35 over five years. I survived eight rounds of layoffs, taking on more responsibilities for the same salary, watching younger colleagues leave for digital media startups or corporate communications.
  
  Then came the merger announcement. Our family-owned paper was being acquired by a national conglomerate known for gutting newsrooms. Despite promises to maintain local coverage, the first act of new management was eliminating a third of remaining positions – including mine. At 51, with a mortgage, two kids in college, and skills seemingly tied to a dying industry, I faced unemployment for the first time since college.
  
  The severance package gave me six months of breathing room, but panic set in immediately. Job searches revealed painful truths: traditional journalism positions were scarce, paid significantly less than my former salary, and often sought "digital natives" – code for young, inexpensive talent comfortable with emerging platforms.
  
  My turning point came during a community meeting about a controversial development project. Habit drew me there – I'd covered such meetings for decades. Taking notes automatically, I realized I understood the issues, players, and subtext better than anyone in the room, including the developer's PR team and the community activists opposing the project. Both sides were missing opportunities to communicate effectively.
  
  This insight sparked an idea. What if I could leverage my journalistic skills – synthesizing complex information, identifying key narratives, communicating clearly to specific audiences – in a new context? I reached out to contacts on both sides of the development dispute and proposed a role as a communication consultant, helping translate technical plans into community-friendly presentations while ensuring resident concerns were properly addressed by developers.
  
  This first consulting project led to others. I created a specialized practice helping organizations navigate contentious community issues – from hospital expansions to school redistricting to environmental disputes. My journalism background provided instant credibility with all stakeholders, and my decades covering local government gave me procedural knowledge no communications graduate could match.
  
  Four years later, my consulting practice generates more income than my newspaper position ever did. I've hired two former journalists facing similar career disruption. We don't just help clients navigate approval processes; we help them genuinely engage communities, incorporating local knowledge into better projects.
  
  I miss daily journalism profoundly – the camaraderie of the newsroom, the public service mission, the constant variety. But I've found a way to repurpose those skills in service of better communication between institutions and communities. The industry I loved disappeared, but the expertise I developed there remains valuable in ways I couldn't have anticipated.`,
      username: "narrative_consultant",
      createdAt: new Date(),
      walletAddress: "0x901",
    },
  },
  {
    id: "14",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Finding My Voice After Decades of Selective Mutism",
      content: `Until age 42, I spoke to fewer than ten people in my life. Diagnosed with selective mutism as a child in the 1980s, I received little effective treatment in our small rural community. Teachers labeled me "painfully shy" or "stubborn," not recognizing the severe anxiety disorder preventing me from speaking outside my immediate family.
  
  I developed elaborate coping mechanisms – communicating through notes, having my parents or sister speak for me, and later, using email and text messages professionally. My intelligence and writing skills allowed me to complete college online and secure a remote graphic design position, but my world remained severely constricted. I avoided any situation requiring verbal communication – doctor's appointments, grocery shopping, social gatherings.
  
  My transformation began when my elderly parents needed increased medical care. As their only local child, I faced an impossible choice: find my voice or fail them when they needed me most. A desperate internet search led me to a therapist specializing in adult selective mutism, offering teletherapy sessions where I could begin treatment without speaking, using chat features while gradually incorporating audio.
  
  Progress was agonizingly slow. My first spoken word to the therapist – "yes" – took sixteen sessions. From there, we built a hierarchy of speaking challenges, beginning with whispering single words and progressing through structured interactions with increasing difficulty. Each step triggered overwhelming physical symptoms – racing heart, sweating, dizziness – but the structured approach slowly desensitized my nervous system.
  
  A breakthrough came during my mother's hospitalization when a medication error occurred. The primal need to protect her overrode my fear, and I spoke clearly to the medical staff. Though I shook uncontrollably afterward, this experience proved my capability in genuinely high-stakes situations, distinguishing fear from actual inability.
  
  Today, at 47, I speak in most situations, though not without continued effort. Some contexts – large groups, public speaking, confrontational scenarios – remain challenging. I've become an advocate for selective mutism awareness, particularly for adults who grew up when the condition was poorly understood. Through video testimonials (a format once unimaginable to me), I help others understand that selective mutism isn't shyness or choice but a treatable anxiety disorder.
  
  My graphic design business has expanded to include direct client consultation rather than just email-based projects. I've developed my first meaningful friendships and even dated, experiences I'd resigned myself to never having. Most meaningful was giving the eulogy at my father's funeral – publicly expressing my love in a way he never heard during his lifetime.
  
  Finding my voice in midlife has meant mourning decades of lost opportunities while embracing new possibilities with the time remaining. For those suffering in silence, whether from selective mutism or other anxiety disorders, know that improvement is possible at any age, with proper treatment and extraordinary persistence.`,
      username: "silent_no_more",
      createdAt: new Date(),
      walletAddress: "0xa12",
    },
  },
  {
    id: "15",
    embedding: [], // Will be filled by OpenAI
    metadata: {
      title: "Pursuing Art After Retirement: My Late-Blooming Creative Journey",
      content: `I spent forty-two years as an accountant – a good one, methodical and precise. Art was something I appreciated in museums but never considered creating myself. My own mother had discouraged my childhood drawing, steering me toward "practical" pursuits. By retirement at 67, I had a solid pension, a paid-off house, and absolutely no idea what to do with myself.
  
  Depression set in quickly. Without client meetings and tax deadlines structuring my days, I felt adrift and purposeless. My wife suggested I "find a hobby" – words that irritated me at the time but ultimately changed my life. To appease her, I reluctantly attended a free drawing workshop at our community center.
  
  That first class was humbling. My hands, so deft with calculators and keyboards, felt clumsy holding charcoal. The instructor asked us to draw an apple, and mine looked like a misshapen blob. The college art student assisting the class gently repositioned my hand, demonstrating how to look at the apple rather than my preconception of an apple. Something clicked in that moment – the realization that I'd spent decades processing numbers but rarely truly seeing what was before me.
  
  I began taking weekly classes, filling sketchbooks with increasingly confident drawings. Six months in, I tried watercolors, finding unexpected joy in the medium's uncontrollable nature – a delightful contrast to my precision-oriented career. For the first time in my life, I embraced imperfection, even failure, as essential to learning.
  
  My spare bedroom became a studio. My accountant's mindset proved surprisingly useful as I methodically studied color theory, perspective, and composition. I watched online tutorials, read art instruction books, and practiced daily. My wife, initially supportive if somewhat bemused, became my greatest champion, framing my better pieces and encouraging me to join a local art association.
  
  At 70, I entered my first juried exhibition and, to my shock, won an honorable mention. By 72, I was teaching beginners' watercolor at the same community center where I'd started. Now, at 75, I've had three small solo shows and sell works through a local gallery and online.
  
  The financial success is modest and irrelevant – what matters is the profound joy of this late-blooming creative practice. I've developed a distinct style focusing on industrial landscapes – factories, bridges, urban infrastructure – perhaps influenced by my analytical background. Critics have noted the "architectural precision" and "mathematical understanding of light" in my work, qualities directly informed by my first career.
  
  For those entering retirement, I offer this: the skills you've honed throughout your working life transfer to new endeavors in unexpected ways. Your professional identity may end, but your capacity for growth does not. It's never too late to develop aspects of yourself that remained dormant during your working years. My only regret is believing for so long that creativity belonged to others – that I was somehow exempt from this fundamental human capacity.`,
      username: "late_blooming_artist",
      createdAt: new Date(),
      walletAddress: "0xb23",
    },
  },
];

// Initialize stories with embeddings
let storiesInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeStories() {
  if (storiesInitialized || initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log(
        "Initializing stories with embeddings and metadata extraction...",
      );
      for (const story of sampleStories) {
        const textToEmbed = `${story.metadata.title} ${story.metadata.content}`;
        const embedding = await vectorSearch.generateEmbedding(textToEmbed);
        story.embedding = embedding.embedding;
      }
      await vectorSearch.addStories(sampleStories);
      storiesInitialized = true;
      console.log("Stories initialized successfully with metadata");
    } catch (error) {
      console.error("Failed to initialize stories:", error);
      throw error;
    }
  })();

  return initializationPromise;
}

export async function POST(request: Request) {
  try {
    console.log("Received search request");
    // Ensure stories are initialized before processing the search
    await initializeStories();
    console.log("Stories initialization complete");

    const { query } = (await request.json()) as { query: string };
    console.log("Search query:", query);

    if (!query || typeof query !== "string") {
      console.log("Invalid query:", query);
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 },
      );
    }

    console.log("Performing advanced vector search with metadata filtering...");
    const results = await vectorSearch.search(query);
    console.log("Search complete, found", results.length, "results");

    // Format the results for the frontend
    const formattedResults = results.map((result) => ({
      id: result.id,
      score: result.score,
      metadata: {
        ...result.metadata,
        // Convert Date objects to ISO strings for JSON serialization
        createdAt:
          result.metadata.createdAt instanceof Date
            ? result.metadata.createdAt.toISOString()
            : result.metadata.createdAt,
      },
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
