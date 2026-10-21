/**
 * Blocklist data for nicknames / aliases (English, Hinglish, Hindi/Devanagari,
 * plus a little Punjabi/Urdu slang). Used by `src/lib/sanitize.ts`.
 *
 * Three kinds of entries:
 *  - SUBSTRING: distinctive terms blocked anywhere, even inside other words or
 *    when spaced/dotted out ("f.u.c.k", "b h e n c h o d").
 *  - WORD: short or ambiguous terms blocked only as a whole word, so innocent
 *    names survive (Gandhi ≠ "gand", chutney ≠ "chut", Nazia ≠ "nazi", Dickens ≠ "dick").
 *  - ALLOW: innocent words/names that contain a SUBSTRING term; they are removed
 *    before substring matching (Sheetal/Shital, Scunthorpe, therapist…).
 *
 * Write entries in plain lowercase. Leetspeak, look-alike letters, repeated
 * letters and separators are handled by the matcher, so you don't need variants
 * like "fvck" or "f*ck" — but common spelling variants (madarchod / maderchod) do
 * need their own entry.
 */

export const SUBSTRING: readonly string[] = [
  // ── English: sexual / slurs / abuse ──
  "fuck", "fuk", "fck", "fvck", "fvk", "phuck", "motherf", "shit", "bullshit", "cunt", "bitch", "biatch", "bastard",
  "asshole", "arsehole", "dickhead", "cocksuck", "pussy", "penis", "vagina", "boob", "titties", "porn",
  "nude", "nudes", "xxx", "dildo", "milf", "blowjob", "handjob", "jerkoff", "wanker", "whore", "slut",
  "hooker", "rapist", "molest", "pedo", "paedo", "incest", "orgasm", "horny", "sexting", "onlyfans",
  "nigg", "nigger", "nigga", "faggot", "retard", "tranny", "kike", "chink", "spastic", "coon",
  "suicide", "killyourself", "killurself", "hitler", "terrorist", "jihadi",
  // ── Hinglish / Hindi (romanised) ──
  "madarchod", "maderchod", "madarchood", "madharchod", "maadarchod", "madrchod", "mdrchod", "madarjaat",
  "behenchod", "bhenchod", "behnchod", "bahenchod", "bahanchod", "benchod", "bhanchod", "bhenchood",
  "behenkelode", "bhenkelode", "behenkelaude", "behenkalauda",
  "chutiya", "chutiye", "chutia", "chootiya", "chutiyapa", "chutmarike", "chutad",
  "chodu", "chudai", "chudne", "chudwa", "chudakkad",
  "gandu", "gaandu", "gaand", "gandmasti", "gandfat", "gandmar",
  "randi", "randwa", "raandi", "randibaaz", "randikhana",
  "bhosdi", "bhosda", "bhosadi", "bhosdike", "bhosdiwale", "bhosdiwala", "bsdk",
  "lauda", "laude", "lawda", "lavda", "lavde", "lawde", "lodu", "lauru", "lundfakir", "lundbaaz",
  "jhaat", "jhatu", "jhantu", "jhaant",
  "harami", "haraami", "haramzada", "haramzadi", "haramkhor",
  "kamina", "kaminey", "kamine", "kaminay",
  "kutiya", "kuttiya", "kuttey", "kuttikamini", "kutteki",
  "chinal", "chhinal", "raand", "tatte", "hijda", "hijra", "chakka", "chhakka",
  "bkl", "bkchod", "bakchod", "tmkc", "tmkb", "mkc",
  "terimaki", "terimaaki", "teribehen", "maakichut", "maakaloda",
  // ── Punjabi / Urdu ──
  "penchod", "pencho", "kanjar", "kanjri", "lulli", "phuddi", "fuddi", "phudi", "dalla", "dalli",
  // ── Spam (links / contact info are also caught by regex in sanitize.ts) ──
  "http", "www",
  // ── Hindi (Devanagari) ──
  "मादरचोद", "मादरचद", "बहनचोद", "बहेनचोद", "भेनचोद", "बेनचोद", "चोद", "चुद", "चूतिया", "चुतिया", "चूत",
  "रंडी", "रण्डी", "गांडू", "गाण्डू", "भोसड", "भोसडी", "लौडा", "लौड़ा", "लोडा", "लवडा", "लण्ड",
  "झाट", "झांट", "हरामी", "हरामज़ादा", "हरामजादा", "हरामखोर", "कमीना", "कमीने", "कुतिया", "कुत्ती",
  "छिनाल", "हिजडा", "हिजड़ा", "छक्का", "भड़वा", "भडवा", "दल्ला", "दल्ली",
];

export const WORD: readonly string[] = [
  // English
  "ass", "arse", "dick", "cock", "tit", "tits", "cum", "anal", "anus", "hoe", "hoes", "rape", "raped",
  "sex", "fag", "fags", "nazi", "nazis", "isis", "kys", "slag", "twat", "prick", "wank",
  "thot", "incel", "lesbo", "homo", "spaz", "piss",
  // Hinglish (short / ambiguous)
  "gand", "chut", "choot", "chuut", "lund", "lun", "loda", "lode", "rand", "mc", "bc", "bhosd",
  "kutta", "kutte", "tatti", "tatty", "suar", "suwar",
  "saala", "saali", "chod", "chud", "jhant", "bhadwa", "bhadwe", "bhadva", "dalle",
  "hijde", "hijre", "chhakke",
  // Hindi (Devanagari)
  "सुअर", "साला", "साली", "कुत्ता", "कुत्ते", "टट्टी", "गांड", "गाँड", "लंड", "रांड", "चोदू",
];

/**
 * Friendly words that would otherwise trip a SUBSTRING term.
 * Removed from the normalised text before substring matching.
 */
export const ALLOW: readonly string[] = [
  "sheetal", "shital", "shitij", "shitiz", "shitanshu", "kshit", "ashit", "akshit", "ishit", "shitake", "shiitake", "matsushita", "hashit",
  "scunthorpe", "therapist", "cockpit", "peacock", "hancock", "babcock", "shuttlecock",
  "dickens", "pussycat", "booboo", "boobear", "coonoor", "raccoon", "cocoon", "tycoon",
  "pedometer", "pedorthic", "encyclopedia", "pedophobia", "torpedo", "fukrey", "abdalla",
  "randip", "randeep", "randhir", "randhawa", "brandi", "brandie", "miranda", "grandi",
  "laudable", "lauderdale", "lodumani",
  "chakkar", "ghanchakkar", "chinku", "kutiyana",
  "nudel",
];
