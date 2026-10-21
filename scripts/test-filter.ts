/**
 * Quick self-test for the nickname filter.  Run:  npx tsx scripts/test-filter.ts
 * Add any false positive / false negative you find to these lists.
 */
import { safeName } from "../src/lib/sanitize";

const SHOULD_BLOCK = [
  "fuck", "F.U.C.K", "fuuuuck", "fvck", "phuck you", "sh1t", "$hit", "b1tch", "a$$hole", "c u n t", "nigga",
  "madarchod", "maderchod", "MC", "bc", "b s d k", "bsdk", "bhosdike", "bh0sdike", "chutiya", "chu.tiya",
  "ch00tiya", "gandu", "g@ndu", "gaand", "gand", "randi", "r4ndi", "lauda", "l0da", "loda", "lund",
  "bhenchod", "b h e n c h o d", "behen ke lode", "harami", "haramzada", "kamina", "kutiya", "kutta",
  "jhaatu", "tatti", "saala", "chut", "choot", "bkl", "tmkc", "penchod", "kanjar", "phuddi",
  "मादरचोद", "बहनचोद", "भेनचोद", "चूतिया", "चुतिया", "रंडी", "गांडू", "गांड", "भोसड़ी", "लौड़ा", "लंड",
  "हरामी", "कमीना", "कुतिया", "कुत्ता", "हरामज़ादा",
  "fuсk", /* cyrillic с */ "ｆｕｃｋ", "porn star", "nudes", "rapist", "rape", "hitler", "nazi",
  "Kaminey Dil", "www.x.com", "insta.com", "@myhandle", "98765 43210", "http://a",
];
const SHOULD_ALLOW = [
  "Bubu", "Babe", "Mr. Hmm", "Sheetal", "Shital", "Akshita", "Kshitij", "Ashit", "Gandhi", "Chutney",
  "Nazia", "Dickens", "Scunthorpe", "Randeep", "Randhir", "Miranda", "Brandi", "Peacock", "Kutti",
  "Pagal", "Sexy", "Cocoon", "Cumin", "Analysis", "Classic", "Grass", "Bob", "Booboo", "Shona",
  "Jaan", "Baby 🥺", "Mera Bachha", "Chotu", "Golu", "Laddoo", "Sona", "Princess", "Detective Cutie",
  "Your Honour", "जान", "बाबू", "सोना", "लड़का", "लड़की", "गाड़ी", "लंदन", "Abdallah", "Fukrey fan",
  "Chandni", "Ishita", "Mohit", "Rohit", "Sumit", "Harmeet", "Kunal", "Shivam", "Mr. Dramatic", "Torpedo",
];

let bad = 0;
for (const s of SHOULD_BLOCK) if (safeName(s) !== null) { bad++; console.log("NOT BLOCKED:", s); }
for (const s of SHOULD_ALLOW) if (safeName(s) === null) { bad++; console.log("WRONGLY BLOCKED:", s); }
console.log(bad === 0 ? "✅ all filter tests passed" : `❌ ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
