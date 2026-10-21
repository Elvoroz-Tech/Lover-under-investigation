/**
 * The preset accusations. No free-text crimes on purpose:
 * presets keep it funny, fast, and impossible to weaponise.
 *
 * `id` values are baked into shared links — NEVER change or reuse an existing id.
 * Add new crimes with new ids only.
 */

export type CrimeCategory = "texting" | "food" | "gaming" | "memory" | "effort" | "social" | "sleep";

export interface Crime {
  id: string;
  emoji: string;
  /** What the sender taps on (the accusation). */
  label: string;
  category: CrimeCategory;
  /** Award title printed on the certificate. */
  award: string;
  /** "For outstanding achievement in …" */
  citation: string;
  /** The "punishment". */
  sentence: string;
  /** Big stamped status line. */
  status: string;
  /** 1–5 red flags. */
  severity: 1 | 2 | 3 | 4 | 5;
}

export const CATEGORY_META: Record<CrimeCategory, { label: string; emoji: string }> = {
  texting: { label: "Texting", emoji: "💬" },
  food: { label: "Food", emoji: "🍟" },
  gaming: { label: "Gaming", emoji: "🎮" },
  memory: { label: "Memory", emoji: "🧠" },
  effort: { label: "Effort", emoji: "🫠" },
  social: { label: "Socials", emoji: "📱" },
  sleep: { label: "Sleep", emoji: "😴" },
};

export const CRIMES: readonly Crime[] = [
  {
    id: "rp3",
    emoji: "🐌",
    label: "Replying after 3 business days",
    category: "texting",
    award: "The Carrier Pigeon Award",
    citation: "replying to a two-word text with the urgency of a government office closed for Diwali.",
    sentence: "Read receipts ON for 30 days. No appeals.",
    status: "Emotionally Delivered, Never Read",
    severity: 4,
  },
  {
    id: "lst",
    emoji: "🎧",
    label: "Saying “I'm listening” while gaming",
    category: "gaming",
    award: "The Selective Hearing Medal",
    citation: "saying “haan haan, I'm listening” while clearly mid-match and actively yelling at a teammate.",
    sentence: "Must repeat the last 3 things I said. Word for word.",
    status: "Respawned, Still Not Listening",
    severity: 3,
  },
  {
    id: "bdy",
    emoji: "🎂",
    label: "Remembering my birthday only because Instagram said so",
    category: "memory",
    award: "The Push-Notification Lover Award",
    citation: "remembering my birthday 4 minutes after the app reminded them and acting like it was intuition.",
    sentence: "One handwritten card. Phones are not allowed near it.",
    status: "Romantically Suspicious",
    severity: 5,
  },
  {
    id: "fod",
    emoji: "🍟",
    label: "Stealing my food after ordering their own",
    category: "food",
    award: "The Fry Thief of the Year",
    citation: "saying “I'm not hungry”, ordering anyway, then eating half of my fries “just to taste”.",
    sentence: "Owes me one full order. Large. With extra dip.",
    status: "Caught Red-Handed (Ketchup)",
    severity: 4,
  },
  {
    id: "bmn",
    emoji: "🫠",
    label: "Giving “bare minimum” a whole new meaning",
    category: "effort",
    award: "The Bare Minimum Award",
    citation: "replying “hmm” after disappearing for 6 hours and calling it communication.",
    sentence: "One apology and unlimited snacks.",
    status: "Romantically Suspicious",
    severity: 5,
  },
  {
    id: "hmm",
    emoji: "🤖",
    label: "Replying “hmm” “ok” “k” to my paragraphs",
    category: "texting",
    award: "The One-Syllable Poet Prize",
    citation: "answering a 14-line emotional paragraph with a single, lowercase “k”.",
    sentence: "Must reply with minimum 3 sentences and 2 emojis. For life.",
    status: "Under Linguistic Review",
    severity: 4,
  },
  {
    id: "onl",
    emoji: "🟢",
    label: "Online but not replying to me",
    category: "texting",
    award: "The Green Dot Mystery Award",
    citation: "being online for 47 minutes while my message sat there, unopened, like it owed them money.",
    sentence: "Full screen-time report submitted to this bureau.",
    status: "Online, Suspiciously",
    severity: 4,
  },
  {
    id: "lol",
    emoji: "💀",
    label: "Liking other people's posts before replying to me",
    category: "social",
    award: "The Double-Tap Traitor Trophy",
    citation: "double-tapping a stranger's reel while my text aged like fine milk.",
    sentence: "Must like my last 12 posts. In order.",
    status: "Evidence Screenshotted",
    severity: 5,
  },
  {
    id: "sns",
    emoji: "🥱",
    label: "Falling asleep mid-conversation",
    category: "sleep",
    award: "The Mid-Sentence Nap Champion",
    citation: "saying “wait I'm not sleepy” and then going offline for 9 hours mid-plan.",
    sentence: "One good-morning text before 9 AM, for a week.",
    status: "Case Asleep, Investigation Awake",
    severity: 2,
  },
  {
    id: "wte",
    emoji: "🍽️",
    label: "Saying “anything” when asked where to eat",
    category: "food",
    award: "The ‘Anything’ But Not That Award",
    citation: "saying “anything is fine” and then rejecting 11 restaurants in a row.",
    sentence: "Must pick dinner, decisively, three times in a row.",
    status: "Indecisive Beyond Reasonable Doubt",
    severity: 3,
  },
  {
    id: "fyi",
    emoji: "🫡",
    label: "Saying “I'll text you when I reach” and never texting",
    category: "texting",
    award: "The Never Reached Award",
    citation: "promising to text on arrival and apparently still being on the road 3 days later.",
    sentence: "Live location, every trip, no excuses.",
    status: "Missing Text Report Filed",
    severity: 4,
  },
  {
    id: "ldn",
    emoji: "📺",
    label: "Watching our show without me",
    category: "effort",
    award: "The Episode Betrayal Award",
    citation: "secretly watching ahead on OUR show and then pretending to be surprised.",
    sentence: "Must rewatch it with me and act shocked again. Convincingly.",
    status: "Spoiler Alert: Guilty",
    severity: 5,
  },
  {
    id: "1mn",
    emoji: "⏳",
    label: "“5 more minutes” that lasts an hour",
    category: "gaming",
    award: "The Time-Bender Badge",
    citation: "saying “one last game” 7 games ago, with zero shame.",
    sentence: "Next match is mine to pick. Couch co-op only.",
    status: "Clock Tampering Detected",
    severity: 3,
  },
  {
    id: "frg",
    emoji: "🫥",
    label: "Forgetting what I told them yesterday",
    category: "memory",
    award: "The Goldfish Memory Medal",
    citation: "hearing a full story yesterday and asking “wait, who is Priya?” today.",
    sentence: "Weekly quiz on my life. Passing marks: 100%.",
    status: "Memory Under Repair",
    severity: 3,
  },
  {
    id: "ldr",
    emoji: "🧊",
    label: "Leaving me on delivered",
    category: "texting",
    award: "The Delivered, Not Delivered Award",
    citation: "letting my message sit at two grey ticks long enough to grow a personality.",
    sentence: "Instant replies only. Typing indicator must be visible.",
    status: "Ghosting In Progress",
    severity: 4,
  },
  {
    id: "mem",
    emoji: "📲",
    label: "Sending reels instead of actually talking",
    category: "social",
    award: "The Reel Communicator Award",
    citation: "replacing every real conversation with 23 reels a day and calling it a love language.",
    sentence: "One actual voice note. Longer than 10 seconds.",
    status: "Communicating Via Algorithm",
    severity: 2,
  },
  {
    id: "nap",
    emoji: "🛌",
    label: "Hogging the blanket like it's their birthright",
    category: "sleep",
    award: "The Blanket Burrito Trophy",
    citation: "wrapping themselves in 100% of the blanket and leaving me 0% and a draft.",
    sentence: "Blanket custody goes to me for 7 nights.",
    status: "Thermal Crimes Confirmed",
    severity: 3,
  },
  {
    id: "spd",
    emoji: "📸",
    label: "Taking 1 photo of me and 47 of themselves",
    category: "social",
    award: "The Front Camera Loyalist Award",
    citation: "taking one blurry photo of me and an entire photoshoot of themselves.",
    sentence: "20 photos of me, from good angles, approved by me.",
    status: "Photographic Evidence Missing",
    severity: 3,
  },
  {
    id: "drm",
    emoji: "🎭",
    label: "Being dramatic about a tiny cold",
    category: "effort",
    award: "The Oscar for Dying of a Cold",
    citation: "announcing their final will and testament over a mild sore throat.",
    sentence: "Will be making me soup next time. Fair is fair.",
    status: "Overacting Confirmed",
    severity: 1,
  },
  {
    id: "lst2",
    emoji: "🫗",
    label: "Saying “I'll do it later” and never doing it",
    category: "effort",
    award: "The Professional Procrastinator Prize",
    citation: "promising “later” so many times that later became a lifestyle.",
    sentence: "One task done TODAY. Proof required.",
    status: "Pending Since Forever",
    severity: 2,
  },
  {
    id: "dsc",
    emoji: "🎮",
    label: "Choosing Discord squad over me",
    category: "gaming",
    award: "The Squad Over Bae Award",
    citation: "saying “just 2 mins, bro is waiting” while I was the one actually waiting.",
    sentence: "Must say “gotta go, bae is calling” on voice chat. Loudly.",
    status: "Disloyal To The Main Quest",
    severity: 4,
  },
  {
    id: "fly",
    emoji: "🍫",
    label: "Eating the last piece without asking",
    category: "food",
    award: "The Last Bite Bandit Award",
    citation: "eating the last piece of chocolate and hiding the wrapper like a professional.",
    sentence: "Owes me a full bar. The big one.",
    status: "Wrapper Recovered, Suspect Identified",
    severity: 4,
  },
  {
    id: "ann",
    emoji: "📅",
    label: "Asking “wait, which anniversary is it?”",
    category: "memory",
    award: "The Calendar Criminal Award",
    citation: "asking which anniversary it was, on the anniversary, in front of the cake.",
    sentence: "Must set 3 reminders and a backup reminder.",
    status: "Date Unknown, Guilt Known",
    severity: 5,
  },
  {
    id: "vnc",
    emoji: "🎙️",
    label: "Sending 4-minute voice notes when I can't listen",
    category: "texting",
    award: "The Podcast Nobody Subscribed To",
    citation: "sending a 4-minute voice note to say something that needed 6 words.",
    sentence: "Text only for a week. Summaries mandatory.",
    status: "Audio Evidence Too Long",
    severity: 2,
  },
  {
    id: "phn",
    emoji: "📵",
    label: "Scrolling their phone on our date",
    category: "social",
    award: "The Screen-Time Spouse Award",
    citation: "scrolling reels during our date like I was the ad break.",
    sentence: "Phone goes face-down for the entire next date.",
    status: "Distracted In The First Degree",
    severity: 4,
  },
] as const;

const BY_ID = new Map(CRIMES.map((c) => [c.id, c]));

export function getCrime(id: string): Crime | undefined {
  return BY_ID.get(id);
}

export function randomCrime(excludeId?: string): Crime {
  const pool = excludeId ? CRIMES.filter((c) => c.id !== excludeId) : CRIMES;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
