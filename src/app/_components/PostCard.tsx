"use client";
import React, { useEffect, useState } from "react";
import PostActions from "./PostActions";
import "draft-js/dist/Draft.css";
import { useStoriesStore } from "~/store/useStoriesStore";
import { StoryVideo } from "../pages/homepage/_components/StoryVideo";
import AdhiStory from "../stories/AdhiStory";
import TTSButton from "./TTSButton";

// AdhiStory text content extracted directly for TTS
const ADHI_STORY_TEXT = `# How I Met God & Got Into Crypto: Based on a True Story

The following is an exclusive preview of the Intro & Preface of my book How I Met God & Got Into Crypto: Based on a True Story

I started writing this book while I was in India and a large part of it was conceptualized and written in India. Parts of the book have been conceived and/or written through my stay in Paris, Amsterdam, Luxembourg, Qatar, UAE, Singapore, Brussels and Berlin. However, the words you are reading right now(and certain other sections of the book) are being written (almost totally by chance!)in a rather interesting place - a Cafe named after a man who married his own cousin, never saw his first daughter, if he ever went to an Indian school, 5th grade bullies would call him "Maggi noodles" over his now iconic hairdo, he refused the Presidency of Israel, was spied on by the FBI for decades and on the side, also made some scientific discoveries - I'm of course talking about Albert Einstein.

The cafe is called - (take a wild guess) - Cafe Einstein! I mean, I would have hoped they were more imaginative than that? For egs, I would perhaps have called it Cafe Spooky Einstein or Cafe Einstainglement(Sounds so German no?) in reference to his dismissive remark on the remarkable concept of "Quantum Entanglement" in Quantum Physics.

I feel one subject that comes closest to life is Quantum Physics. If you truly want to "understand" life, you must "understand" Quantum Physics but there is a problem - you cannot. Quantum Physics cannot be understood - you must keep trying until some day, you just get it. In Quantum Physics, there is a beautiful concept called Quantum Entanglement which basically suggests that the state of one particle has a direct impact on the state of a totally different particle. Confused? Let me explain using a Bollywood movie.

There is a Bollywood classic from the '90s called "Judwaa" (meaning "Twins" in English). The lead star Salman Khan went on to become one of the biggest and most controversial film stars in India and this movie played a huge role in it. It's also funny how Salman came about doing this movie. The then reigning Bollywood superstar Govinda was initially cast for the movie and had even started shooting for it. One night, at roughly 2 am or so, he receives a call from Salman saying "How many hits will you give Chichi Bhaiya? Keep some for us also" and after that call, Govinda handed over the movie to Salman. That's it. It is ridiculous how much impact a perfectly crafted sentence can have on you.

Now in the movie Judwaa, a pair of identical twins separated at birth grow up with totally contrasting upbringing. One grows on to become a sophisticated, rich suave man and the other an uncouth street goon. In the climax, the goon is tragically locked up in with his loving and obedient sidekick and unable to fight while his twin who had perhaps never killed a mosquito his entire life, must now confront a menacing villain who he must defeat in order to save his brother and rest of his family. What happens next? The twin locked up in jail starts beating up his sacrificial sidekick and guess what?! - in what is possibly the earliest demonstration of Quantum Entanglement, his twin's body miraculously responds in the exact same manner as his brother and he ends up beating the villain! Whosoever said that one must leave their brains behind to watch a Bollywood movie was clearly wrong. Einstein found this(this as in Quantum Entanglement and not the movie of course) too ridiculous to be true and called it "spooky action at a distance". Life is so strange, no?

Anyway, coming back to our cafe, as you can see below, they have rather intelligent branding on their cups.

The Cafe is not named Einstein without reason though. The Cafe is located right below the apartment where Einstein lived with his (first) wife and son and more significantly, it is where he developed and wrote the "Theory of Relativity" that as we now know has changed the course of modern day physics and our understanding of the cosmos. Not a bad place to write a book on God(and crypto, given Switzerland's reputation as the world"s bank!).

Now, why is the book titled "How I Met God & Got into Crypto"? Am I being clickbaity? No! I am not. This book will indeed talk about what the title promises - and much more. Now, I know the title sounds ridiculous. If somebody told me this 10 years ago, I would have laughed in disbelief too. In fact, as I rewrite this preface, I still laugh. My views on religion and God is best reflected in this Quora answer I wrote many years ago:

I must now address a standard question and quickly get it out of the way - "Why should you read this book".

This book at its core is about how I found my purpose in life - which involves God & Crypto. Through my journey initially, I thought or was rather made to believe that purpose is something we make up - to make our life more meaningful and that life itself has no purpose and that's when I came to know about a beautiful & forgotten Indian life principle which I believe is long due for revival.

Before I get to what the concept is, let's discuss a rather cute idea that has gained immense popularity in the world these days - Ikigai. For those unaware, Ikigai, a Japanese concept of life, literally translates to "reason for being", recommends a sort of formula for living a life of purpose. The guideline it offers is to find one's purpose is to narrow down on that one thing that - you love (your passion), the world needs (your mission), you are good at (your vocation), and you can get paid for (your profession). Simple, right? Exactly! This is exactly the problem with Ikigai, that it is way too simple to be practical for something much more nuanced and enormous such as life.

Of course, it's a no-brainer - everybody would love to do something they love, that others need, that they are good at and then also make money from it! But the problem with it is two fold:

1. It is highly impractical. Just by sheer probability and market economics there are only so many skill-sets in the world that would fit into these buckets and thereby only a few people could, at least, on paper, lead a purposeful life. What about the others?
2. It relies heavily upon what you do on the outside - in terms of your worldly activity without any consideration for how you feel within yourself.
3. The bigger problem is this - let's say you end up finding your Ikigai - now that your passion is also your means of income, for how long would you continue to remain passionate about it? If your passion now has the added pressure of paying your bills, would you be able to do it as passionately and freely?

What's the solution then? This is where this book comes into the picture. For this coming paragraph, let's act all cool and fancy and deep and stuff ok then get back to business.

In the Indian context, what one does for a living - known as artha - is separate from one's purpose and this brings us to the core theme of our book, to - Swadharma - loosely put - the sheer purpose of your existence. What is Swadharma exactly? You know, I get asked often how my life has changed since my "spiritual journey" or as I prefer calling it - "Cosmic Bigg Brother"(or Bigg Boss depending on which part of the world you live in)- as in you know, living in monasteries, meeting so many "Gurus" and "spiritually evolved" beings and yogis and monks, and all the spiritual practices, yoga, meditation etc - and my answer always baffles people - the bewilderment in their face is too conspicuous to miss - always - I simply tell them that "I am now a better actor" What is this even supposed to mean? The most significant discovery of my life that shook the foundations of my existence is the realization that who I am is different from the role I play(which I assumed to be myself all my life until that moment!). And every great act involves three core aspects - Knowing who you are, Knowing what your role is, and Knowing when to get off your role. Unfortunately, most people don't live with this sense of distinction between who they are and what their role is and end up suffering their role (and in extreme cases, killing themselves like Heath Ledger). Your Swadharma is essentially the unique role you and only you are here to play and are expected to play with perfection. Knowing your Swadharma is only one part of the job, the other and equally important part is how you perform your Swadharama - like an act and nothing more or less - without getting entangled and carried away with it - and that is why knowing who you are and being in touch with yourself is so crucial. Now the grand question is how do we know who we are, how do we be in touch with it, and how do we know what our role in this cosmic drama is? That's why this book, silly! I open my life up to you, for you. We're all eventually passengers in this grand journey - adventurers chartering unknown territories. Here I am just doing my bit for my fellow travelers making it a little easier for them just as those before me have made it easier for me! This entire book is essentially about how I discovered this lost principle, what it is, and how I arrived at my purpose - my Swadharma - which involves God & Crypto - two of the most crucial and misunderstood subjects of our time.

I did this interesting exercise with my friends at the time of writing this book. I reached out to some of them to describe me in a few lines. There was one that particularly caught my attention and till date I don't know why this friend said what he did but there was something striking about it. There are times in my life, I have observed that while words may be coming out from a particular person, it is not them who is speaking. There is a strange and inexplicable wisdom flowing through them. Via them. From a rather strange source. This was one of those moments. He said "You are the guinea pig that has to go through experiences that others can learn from" There! Quantum Entanglement! I feel my life's story could have an impact on yours in so many ways!

You can count me as that one geeky friend in your circle who doesn't shy from going deep into the rabbit hole of a subject so that you don't necessarily have to. Imagine when the internet came out in the '90s, or Bitcoin, in the early 2012 or AI in 2023 - you keep hearing about these things but just don't know where to start so you reach out to this geeky friend of yours who gives you the perfect orientation so that you can then go on and explore the rest by yourself. This is that kind of book. I love going into rabbit holes! My venture into the rabbit hole of Capitalism and Entrepreneurship led me to being listed as one of India's Top Student Entrepreneurs at the age of 19. The rabbit hole of storytelling would lead me to creating crowdfunding history on Kickstarter and then publishing a bestseller that is now being adapted into a Global OTT show. My venture into the state of the global education system would help me find some dramatic insights eventually leading to a TEDx talk that would be watched by over 4M people globally. This book is about me entering the Rabbit holes of God & Crypto.

The book is essentially a two volume adventure. An eternal conflict of Man vs God, Material vs Spiritual. Volume 1 is essentially about Man - me, my journey, and my early exploits in the material world and how it leads me to the doorstep of a strange new mystical world which we will look at more deeply in Volume 2. Volume 2 is less about me. It's about my stay in the monastery - It's about God, Spirituality & the Cosmos. Volume 2 is an audacious and unprecedented endeavour. Most spiritual books in the past have always been mostly about how the writer, a usually flawless person, is such a great spiritual figure and should you want to become like them, you should do what they did too. Such books do a great disservice to the reader - apart from a sense of lopsided worship and admiration towards the writer, nothing much comes out of it for the reader. Volume 2 of How I Met God & Got Into Crypto will make you an absolute geek about this world of God & Spirituality it will acquaint you with the why, how, and what of everything. Now that we would have dabbled into both worlds - via my internal conflict, it will also address for once the eternal conflict - the grand climax - what is the ultimate purpose of life, God or Material success? Is this world better or that? Everything you read in Vol 1 and 2 will then come together in a big way.

Volume 1 may appear Autobiographical but it is not an Autobiography. I've only mentioned those details from my life that add up later to the core theme of the book! Humans are compulsive consumers of stories. From college gossip to Instagram Reels, today, we consume more stories than we ever did. If author Yuval Noah Harari is to be believed, stories have played an unmissable and crucial role in the evolution of man(and woman of course). If you put food on the table of a hungry man, he will start praying to a God of your choice but if you feed him the right story, he will start praying to you. Now, this is essentially a story book. A real story. It is in fact a graphic novel. When I first started writing the book, I had an extremely talented collaborator working on the illustrations. I told her on the first day of her job that there could arise a time in the future when she may want to leave the project and when that day comes, she should be aware. After working for almost a year and completing 40% of the work, she left along with all her illustrations. And in what could be one of the most epic promotions of all time, Lekha, who was then just a gifted intern, took over as the chief illustrator, almost overnight.

In order to make it an active experience and not just a story - there are two things we've done after every chapter - to give you an OG crypto experience, we've added a QR code after every chapter - one you can scan only after completing each chapter (no cheating please) which will give you some free in-house $GIC tokens(We've created our own cryptocurrency for the book, how cool is that?!). You can use these $GIC tokens to access exclusive bonus content from the book and much more.

For the other theme of the book, we've given a few blank pages after every chapter which you can use as a personal diary so that Vol 1 also becomes an introspective journey for yourself. I hope I have satisfactorily addressed why you should be reading this book. Now "Why am I writing this book?". Well, so that I can disappear. There is a deep desire in me to share my life with you and I first explored Social Media as a potential medium to do so but Social Media just lacks the depth and profundity that a book offers. I want this book to be an extremely intimate affair between you and me. Because when I am writing this book, I am lost in talking to you and I hope you can be lost in my world too. This book will relieve me of the burden of having to speak unnecessarily anywhere else because everything I want to say in some way will be in these two volumes. So maybe after publishing these books and later, actively promoting it for a while, I would love to simply disappear and I cannot wait for that day.

Lastly, I feel I must end with a word of caution now that you are going to be hanging out with me over the next few days. Since childhood, It is usual for my friends to fall into trouble because of me. Many of my friends have fallen into great trouble not because they did something wrong. In their conduct, they were all angel-like Their only mistake is that they were friends with me. I was what in India we say a "Gone case". When you hopelessly give up on someone, you call them a "Gone Case". Over the years I had been scolded and beaten by my teachers so much that I developed a thick skin for it but once a teacher came up with an innovative way to embarrass me. My childhood friend and I were sitting for a Physics class. It couldn't hold my attention beyond some time so I cracked a silly joke and everyone including my bestfriend laughed. To everyone's surprise, my teacher picks on him and not me and reprimands him in front of the entire class for something he clearly hadn't done. When my friend protested and insisted that it was me who had made the joke and that she was mistaken, the teacher replied that "Adhitya is a Gone Case, we all know that. There is no point telling him anything. It is your mistake that you sit next to him".

I thought it was a fantastic way of reprimanding someone without telling the person anything. So, just in case reading this book and our friendship gets you into trouble, I told you first!

*O Dear Love,*  
*Now that You have come,*  
*Please sit down,*  
*I have been waiting for this moment*  
*First, let me plant you a kiss*  
*and now,*  
*Let me tell you a story.*

# Introduction

*My Beloved Friend,*  
*In the vast cosmic scheme,*  
*Aren't we all just a brief story?*  
*All your life, you've only lived yours*  
*Let's change that for a bit*  
*For as long as you hold this,*  
*My story is now yours*

On 17th of August 2016, my TEDx talk on "The Interesting Story of our Educational system" was published. While many across the globe have seen the talk, not many know the story behind it. Late in 2015, I published my book on the fascinating story of what could well be India's fifth biggest religion - Engineering. The book, titled The Great Indian Obsession went on to become a bestseller.

By the time I had published the book I also had become a habitual drinker. It was mainly because I just enjoyed drinking and partly because the tragic findings from my first book on the broken state of India's education system had left me disillusioned. Pretty much for 3 years of my life I drank everyday - I used to consume the equivalent of at least 3-4 pints of beer a day. The experience of alcohol feels significantly enhanced with nicotine in the bloodstream so with that, I also smoked around 10-15 cigarettes a day. I can say now that I was pretty much drinking and smoking away my life and just then a girl decided to read my book.

Like many women around the world, this girl grew up with a disturbingly negative image of her body that would leave a few scars on her personality. By the time she entered final year of engineering college, with unwavering discipline and grit, she had chiseled her way into what my MTV Generation would call a "Hot and Sexy" college babe. Abnormally tempramental, she was also exceptionally smart and sort of a financial wiz kid. Even with a degree in Technology, she later managed to secure a banking job with the world's biggest Investment Bank. You may find it surprising but in India, Engineers are interested in doing everything but Engineering so it is not unusual that they become Consultants, Musicians, Marketing Professionals, Bakers, Writers and even Doctors and Lawyers!

So, this girl read my book and fell in love with it. More significantly, she also fell in love with the author. I fell in love with her too but those days I was also hopelessly in love with alcohol. There were very few things I cherished more than the sound of gulping a chilled good glass of beer down my throat soothing its blessed way down to the belly. Ah! So obviously I sought its intoxicating company everyday.

Now, this girl was the founding Chairperson of a local TEDx chapter. TEDx, as you may know, is a globally renowned platform for people of some accomplishment to exchange ideas and inspire others. She insisted I participate as a speaker in the upcoming edition. I wasn't keen because what better do you expect of a man drowned in the enchanting grip of Beauty and Beer? But women usually always have their way with me so I eventually conceded. By now, through my years in school and college I had earned quite a reputation as an orator. A possibly well meaning middle aged member from an audience once told me "You are a dangerous person. People listen to you. You are wasting your time. You must join politics but Alas! I know my words will fall in deaf ears for you will only listen to Him". How I laughed!

We know a car cannot run on mere reputation. It needs fuel. So I am preparing and rehearsing every detail of my talk. The storyline, the content, My clothes, My shoes, I know exactly what I want to wear and where I'd pick it up from. I don't know why but I had this sudden urge to wear a watch. Because I never bothered to own one, I had to borrow. I'm reviewing my talk on call, I'm inviting my friends over for rehearsals. I'm having unsettling performance anxiety so I'm also smoking twice the usual cigarettes. I catch a terrible cold and cough and with just two days to go for my talk, she decides to break-up. Those days I used to be a very emotionally delicate and sensitive person. I didn't even have my presentation in order. As any responsible guy on the cusp of a breakthrough opportunity should, I placed myself together, worked on my presentation, continue my rehearsals right? Wrong. I did none of those. Instead, I chose to drink till 4:00 am. After reaching the venue, to make things exponentially worse, I see her walking around. For some reason, she chooses to ignore the fact that I am a guest speaker at the event and misbehaves with me in front of the other guests. I invite a friend over to help me with the presentation and even at last minute's notice, like an angel, she quickly drops by and just in a few minutes, has my presentation in order. With an awfully broken heart, a presentation that was prepared minutes ago, and totally nervous and dejected, I walk on stage. I don't know what happens to me when I walk on the stage. Something takes over me, words flow and the talk just happens.

As luck may have it, my TEDx talk goes on to become one of the most widely watched talks on education globally and little did I know what life had in store for me. I was suddenly being invited for talks all over the country with so many questions being thrown at me in anticipation of answers but there was one problem. I had no answers! I wasn't in the best of shape and had a whole lot of unanswered questions myself so I found it incredibly ridiculous that I could go around passing any wisdom. By then my TEDx talk and the book in itself became a movement - A movement to transform the global education system. I started receiving multiple emails on my website. My TEDx talk started having thousands of comments and I was set out to take all these enraged people with me to change the education system of the world but then something totally unexpected happened. I walked into my own death…`;

const HARDCODED_CONTENT = {
  id: "1740725593742_pDHykt",
  walletAddres: "6zpDHykt19QBN3VKpZpV9jEAMtYJKwkkYMgiEix8sVky",
  title: "How I Met God and Got Into Crypto",
  content: ADHI_STORY_TEXT, // Now using the directly extracted text
  writerName: "Admin",
};

const PostCard = ({ storyId }: { storyId: string }) => {
  const { getById, stories, isLoading, error } = useStoriesStore();
  const [isContentReady] = useState(true); // Always ready since we have the content directly

  useEffect(() => {
    if (storyId && storyId !== "1740050375765_ffqB3s") {
      getById(storyId).catch(console.error);
    }
  }, [storyId, getById]);

  const story =
    storyId === "1740050375765_ffqB3s"
      ? HARDCODED_CONTENT
      : (stories.find((s) => s.id === storyId) ?? HARDCODED_CONTENT);

  if (isLoading && storyId !== "1740725593742_pDHykt") {
    return (
      <div className="container mx-auto w-full rounded-lg">
        <div className="mb-4 h-12 animate-pulse rounded bg-gray-100" />
        <div className="h-96 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!story) return <p className="p-4 text-gray-500">Story not found</p>;

  return (
    <div className="container mx-auto w-full rounded-lg">
      <h1 className="pb-4 text-xl font-[IBM_Plex_Sans] font-bold md:text-3xl lg:text-4xl">
        {story.title}
      </h1>

      <div className="mb-4">
        {isContentReady ? (
          <TTSButton text={ADHI_STORY_TEXT} />
        ) : (
          <div className="flex items-center text-gray-500">
            <span className="animate-pulse">Preparing audio content...</span>
          </div>
        )}
      </div>

      <div className="bg-[#F6F7F8]">
        <StoryVideo src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/adhi_sample_video.MP4" />
      </div>

      <div className="mt-4">
        <PostActions storyKey={story.id} walletAddress={story.walletAddres} />
      </div>

      <div className="mt-4 font-[IBM_Plex_Sans]" data-tts-content="true">
        <div>
          <AdhiStory />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
