import { images } from "@/img/images";
import { asset } from "@/lib/utils";
import { BASE_INCLUSIONS, VIDEO_INCLUSION } from "@/lib/format";
import type { Article, Faq, Package } from "./types";

export const TAGLINE = "Airshow Thrills · Real Flight · Pure Adrenaline";
export const HERO = "Fly like an Airshow Pilot";

export const HERO_VIDEO = asset("media/hero-bg.mp4");
export const KIDS_VIDEO = asset("media/kids-step5.mp4");

export const packages: Package[] = [
  {
    id: "xtreme",
    name: "Xtreme Flight",
    minutes: "15–20 minutes",
    price: 600,
    badge: undefined,
    video: false,
    pilotControl: false,
    bestFor: "A first real aerobatic flight",
    blurb:
      "Step into a high-performance unlimited aerobatic aircraft and experience real aerobatic flight and instruction from the front seat.",
  },
  {
    id: "video",
    name: "Xtreme Flight + Video",
    minutes: "15–20 minutes",
    price: 780,
    badge: "Most Popular",
    video: true,
    pilotControl: false,
    bestFor: "Keeping and sharing the flight",
    blurb:
      "Includes the full flight plus a professionally edited, HD video to keep and share.",
  },
  {
    id: "youfly",
    name: "Xtreme Flight – You Fly",
    minutes: "30–40 minutes",
    price: 1200,
    badge: "Ultimate",
    video: true,
    pilotControl: true,
    bestFor: "Taking the controls yourself",
    blurb:
      "Take control and fly the aircraft yourself while also experiencing the instructor's high-energy maneuvers. Video included.",
  },
];

export const PARACHUTE = {
  name: "Special Parachute Add-On",
  price: 100,
  blurb:
    "Required for passengers under 5 feet tall. Specialized parachutes and harnesses for smaller passengers.",
};

export function packageById(id: string) {
  return packages.find((p) => p.id === id);
}

export function inclusionsFor(id: string) {
  const pkg = packageById(id);
  const items = [...BASE_INCLUSIONS];
  if (pkg?.video) items.push(VIDEO_INCLUSION);
  if (pkg?.pilotControl) items.push("You take the controls for part of the flight");
  return items;
}

export const galleryFor: Record<string, { src: string; alt: string }[]> = {
  xtreme: [
    { src: images.xa42Flight, alt: "XA-42 in flight" },
    { src: images.cockpitInterior, alt: "Cockpit interior of the XA-42" },
    { src: images.xa42Ramp, alt: "XA-42 on the ramp" },
  ],
  video: [
    { src: images.cockpitView, alt: "View from the XA-42 cockpit" },
    { src: images.xa42Flight, alt: "XA-42 aerobatic pass" },
    { src: images.kidInverted, alt: "Passenger inverted in flight" },
  ],
  youfly: [
    { src: images.cockpitInterior, alt: "Front seat of the XA-42" },
    { src: images.xa42Hangar, alt: "XA-42 in the hangar" },
    { src: images.xa42Maintenance, alt: "XA-42 maintenance" },
  ],
};

export const intensities = [
  {
    id: "mild",
    name: "Mild",
    g: 2,
    summary: "Smooth and comfortable",
    detail:
      "Gentle climbs, turns, and a calm first look at the XA-42. Built for anyone who wants the feeling of flight without aggressive aerobatics.",
  },
  {
    id: "adventurous",
    name: "Adventurous",
    g: 6,
    summary: "Rolls and loops",
    detail: "Aileron rolls, loops, and wingovers once you have settled in. The middle of mild to Xtreme.",
  },
  {
    id: "xtreme",
    name: "Xtreme",
    g: 10,
    summary: "Full unlimited aerobatics",
    detail: "Unlimited aerobatics up to ±10 G, and only as far as you want to go.",
  },
];

export const specs = [
  { value: "±10", unit: "G", label: "Certified load" },
  { value: "540", unit: "°/sec", label: "Roll rate" },
  { value: "720", unit: "°/sec", label: "Snap roll rate" },
  { value: "259", unit: "mph", label: "Never-exceed speed" },
];

export const aircraftFacts = [
  "Fully composite unlimited aerobatic aircraft",
  "FAA and EASA certified",
  "Fastest-rolling, fastest snap-rolling unlimited aerobatic aircraft in the world",
  "The only XA-42 aerobatic experience in the U.S.",
  "Instructional flights under 14 CFR Part 61",
  "Maintained in accordance with FAA regulations",
];

export const flightDaySteps = [
  {
    n: 1,
    title: "Arrival and Paperwork",
    image: images.stepArrival,
    body: "A short waiver form and a brief instructional video when you arrive at Wings Field.",
  },
  {
    n: 2,
    title: "Briefing and Gear",
    image: images.stepBriefing,
    body: "Parachute, headset, and 5-point harness. Tell your instructor any special requests before you walk to the aircraft.",
  },
  {
    n: 3,
    title: "Engine Start and Taxi",
    image: images.stepEngine,
    body: "Preflight checks, a communications check, and the engine run-up. You stay on headset the whole time.",
  },
  {
    n: 4,
    title: "Takeoff and Flight",
    image: images.xa42Flight,
    body: "Gentle first, then progressively more intense, up to 10 Gs, only as far as you are comfortable. You stop, we stop.",
  },
  {
    n: 5,
    title: "After Landing",
    image: images.stepAfter,
    body: "Decompress, gear comes off, and you receive an FAA-legal logbook entry. Your video is delivered after the flight.",
  },
];

export const checklistItems = [
  { id: "id", label: "Government ID packed" },
  { id: "clothes", label: "Comfortable clothes and flat shoes" },
  { id: "hair", label: "Tight hair tie if you have long hair" },
  { id: "jewelry", label: "Jewelry, watch, and pocket items ready to remove" },
  { id: "phone", label: "Phone will stay with the crew — no hand-held cameras in flight" },
  { id: "waiver", label: "Waiver and risk acknowledgment reviewed" },
  { id: "time", label: "Plan on about 4 hours on site" },
  { id: "emergency", label: "Emergency contact shared" },
];

export const faqs: Faq[] = [
  {
    id: "hurt",
    category: "Safety",
    q: "Does it hurt?",
    a: "Only if you want it to. While the XA-42 is capable of +10 / -10 Gs, we want this to be an enjoyable experience for everyone. We specifically design every flight to start with gentler maneuvers and gradually move toward more aggressive ones, depending on what you're comfortable with.",
  },
  {
    id: "sick",
    category: "Safety",
    q: "Will I get sick?",
    a: "Maybe. In our experience, it doesn't seem to matter whether you're a qualified pilot or it's your first flight — we can't predict who will get sick and who won't. If you start to feel sick, your instructor can have the aircraft on the ground in about a minute and a half. While this is not medical advice, our experience has shown best results with Meclizine.",
  },
  {
    id: "long",
    category: "Flight Day",
    q: "How long should I plan to be there?",
    a: "Please plan on being with us for approximately 4 hours. There are factors outside of our control, such as weather and mechanical issues, that we cannot predict. If we foresee any delays with your flight, we will do our best to contact you. If you are unable to fly, you will not be charged.",
  },
  {
    id: "cancel",
    category: "Payments and Cancellations",
    q: "What's your cancellation policy?",
    a: "We require a 48-hour cancellation notice. Cancellations made inside of 48 hours will incur a $200 cancellation fee. No-shows will also be charged $200. If weather, mechanical, or other issues prevent the flight, you are not charged and you are offered rescheduling.",
  },
  {
    id: "availability",
    category: "Booking",
    q: "How do I check availability?",
    a: "Open Book and choose a date on the calendar. Dates are posted 1–6 weeks in advance. We periodically add dates. You can also call 601-XFLIGHT.",
  },
  {
    id: "gifts",
    category: "Booking",
    q: "Do you sell gift certificates?",
    a: "Yes. Buy a digital certificate in the app, or email info@xtreme-flight.com or call 601-XFLIGHT.",
  },
  {
    id: "video",
    category: "Video",
    q: "When will I get my video?",
    a: "Your professionally edited video will be electronically delivered within 1 to 7 business days after your flight.",
  },
  {
    id: "wear",
    category: "Flight Day",
    q: "What should I wear?",
    a: "No high heels. If you have long hair, bring a tight hair tie. Wear comfortable clothes and flat shoes. You will be asked to remove all jewelry, watches, and anything in your pockets (including cell phones) before the flight. Bring a government ID.",
  },
  {
    id: "safe",
    category: "Safety",
    q: "Is it safe?",
    a: "We cannot guarantee your safety. No form of aviation — or any adventurous activity — is without risk. By choosing to fly with us, you acknowledge and accept these inherent risks, which include the risk of injury or death. Flights are conducted by certified instructors under 14 CFR Part 61, in an FAA and EASA certified aircraft maintained to FAA regulations.",
  },
  {
    id: "limits",
    category: "Eligibility",
    q: "Is there a height and weight limit?",
    a: "Yes. Maximum weight: 250 lbs. Maximum height: 6'1\". Maximum trunk circumference: 44\". Passengers under 5 feet tall require the Special Parachute Add-On.",
  },
  {
    id: "physical",
    category: "Eligibility",
    q: "What are the physical requirements?",
    a: "You must be able to get into and out of the aircraft and fit properly in the seat with the harness secured.",
  },
  {
    id: "injury",
    category: "Eligibility",
    q: "What if I have back or neck injuries?",
    a: "We cannot give medical advice. Please contact your physician to see if this type of flight is appropriate for you.",
  },
  {
    id: "headset",
    category: "Flight Day",
    q: "Do you provide headsets? Can I talk to the instructor during the flight?",
    a: "Yes. You will be provided with a headset so you can communicate with your instructor throughout the entire flight.",
  },
  {
    id: "camera",
    category: "Video",
    q: "Can I bring my own camera or GoPro?",
    a: "Yes, feel free to bring your own camera or GoPro to take as many pictures as you'd like on the ground. Due to the nature of the flight, you will not be allowed to hold a camera or GoPro in your hands during the flight. We have GoPros securely mounted in the aircraft.",
  },
  {
    id: "pregnant",
    category: "Eligibility",
    q: "Can I fly if I'm pregnant?",
    a: "No. Flights are not available if you are pregnant.",
  },
  {
    id: "shape",
    category: "Eligibility",
    q: "Do I need to be in good physical shape?",
    a: "No. As long as you meet the height, weight, and trunk circumference requirements, no special physical fitness is required.",
  },
  {
    id: "trunk",
    category: "Eligibility",
    q: "How do you define trunk circumference?",
    a: "Trunk circumference is the largest circumference from below the chest to the waist.",
  },
];

export const FAQ_CATEGORIES = [
  "All",
  "Booking",
  "Safety",
  "Eligibility",
  "Flight Day",
  "Video",
  "Payments and Cancellations",
];

export const crew = [
  {
    id: "charlie",
    name: "Charlie Mullins",
    role: "Certified Flight Instructor",
    photo: images.crewCharlie,
    points: [
      "Airline captain",
      "32+ years flying",
      "15,000+ hours",
      "11 jet type ratings",
      "14,000+ skydives",
      "Embry-Riddle Aeronautical University, B.S.",
    ],
    bio: "Charlie leads the flight experience. You brief with him, fly with him, and he builds the profile only as far as you want to go.",
  },
  {
    id: "carla",
    name: "Carla",
    role: "Social Media and Production Manager",
    photo: images.crewCarla,
    points: ["Flight video and photo production", "Bilingual English / Spanish", "Guest communication"],
    bio: "Carla produces the films and photos you take home and helps guests in English and Spanish.",
  },
];

export const stories = [
  {
    id: "jennifer",
    name: "Jennifer M.",
    role: "Parent",
    location: "Memphis, TN",
    stars: 5,
    title: "He hasn't stopped talking about it",
    text: "My 9-year-old hasn't stopped talking about it. He went from nervous to begging to go back — all in one flight.",
    photo: images.kidInverted,
  },
  {
    id: "marcus",
    name: "Marcus Hale",
    role: "First-time passenger",
    location: "Nashville, TN",
    stars: 5,
    title: "Mild first, then I asked for more",
    text: "They started smooth, checked in after every maneuver, and only went harder when I said so. The video showed up on my phone a few days later.",
    photo: images.xa42Ramp,
  },
  {
    id: "priya",
    name: "Priya Shah",
    role: "Gift giver",
    location: "Little Rock, AR",
    stars: 5,
    title: "The gift that actually landed",
    text: "I sent a digital certificate for a birthday. Booking was clear, the price on the screen was the price we paid, and the day felt looked after.",
    photo: images.giftCertificate,
  },
];

export const communityPhotos = [
  { src: images.xa42Flight, alt: "XA-42 climbing out" },
  { src: images.kidInverted, alt: "Young passenger inverted" },
  { src: images.cockpitInterior, alt: "Cockpit before start" },
  { src: images.xa42Hangar, alt: "Hangar at Wings Field" },
  { src: images.xa42Bw, alt: "XA-42 black and white portrait" },
  { src: images.stepBriefing, alt: "Gear briefing on the ramp" },
];

const RISK_LINE =
  "No form of aviation or adventurous activity is without risk, including the risk of injury or death.";

export const articles: Article[] = [
  {
    slug: "safety-prep",
    title: "Safety and flight preparation",
    minutes: "3 min",
    paragraphs: [
      "Flights are instructional operations with a Certified Flight Instructor under 14 CFR Part 61. The XA-42 is FAA and EASA certified and maintained to FAA regulations.",
      "Every flight starts gentle. You and your instructor talk the whole time on a headset. If you want to stop, you stop. If you feel unwell, the instructor can land in about 90 seconds.",
      "Wear comfortable clothes and flat shoes. No high heels. Tie long hair back. Remove jewelry, watches, and everything in your pockets, including your phone, before you fly. Bring a government ID.",
      "Own cameras are welcome on the ground. Hand-held cameras and phones stay out of the cockpit. GoPros are mounted in the aircraft.",
      RISK_LINE,
    ],
  },
  {
    slug: "payments",
    title: "Payments and cancellations",
    minutes: "2 min",
    paragraphs: [
      "The price you see is the price you pay. No upsells. No fuel surcharges. If your package includes video, it is already the premium edit.",
      "We require a 48-hour cancellation notice. Cancellations inside 48 hours incur a $200 fee. No-shows are charged $200.",
      "If weather, mechanical, or other issues prevent the flight, you are not charged and you are offered rescheduling.",
      "Gift certificates can be bought in the app or by calling 601-XFLIGHT or emailing info@xtreme-flight.com.",
    ],
  },
];

export const wearRules = [
  "No high heels",
  "Tight hair tie for long hair",
  "Comfortable clothes and flat shoes",
  "Remove jewelry, watches, and pocket items, including phones, before flying",
  "Bring a government ID",
];

export const socials = [
  { id: "instagram", label: "Instagram", handle: "@xtreme.flight", href: "https://www.instagram.com/xtreme.flight/" },
  { id: "facebook", label: "Facebook", handle: "Xtreme Flight", href: "https://www.facebook.com/" },
  { id: "tiktok", label: "TikTok", handle: "@xtremeflight", href: "https://www.tiktok.com/@xtremeflight" },
  { id: "youtube", label: "YouTube", handle: "@xtremeflight", href: "https://www.youtube.com/@xtremeflight" },
];

export const onboardingSlides = [
  {
    image: images.onboarding1,
    title: "Fly Like an Airshow Pilot",
    body: "Real aerobatic flight in the XA-42, from mild to Xtreme, for ages 7 and up.",
  },
  {
    image: images.onboarding2,
    title: "You Choose the Throttle",
    body: "We start gentle and build only as far as you want. Up to ±10 Gs. You decide, you stop, we stop.",
  },
  {
    image: images.onboarding3,
    title: "Book. Fly. Relive.",
    body: "Pick your package, choose your date, and get your professionally edited flight video delivered to your phone.",
  },
  {
    image: images.onboarding4,
    title: "The Perfect Gift",
    body: "Give the gift of flight with digital gift certificates and group or event flights.",
  },
];

export const eventTypes = ["Corporate event", "Birthday", "Team outing", "Airshow-style flights", "Kids' group"];
export const budgetRanges = ["Under $2,000", "$2,000–$5,000", "$5,000–$10,000", "$10,000+"];
export const contactTopics = ["Booking", "Payment", "Cancellation", "Gift Certificate", "Video", "Other"];
export const cancelReasons = ["Schedule conflict", "Weather concern", "Feeling unwell", "Other"];
