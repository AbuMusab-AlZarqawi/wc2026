// ─────────────────────────────────────────────────────────────
//  DATA — Players, Formations, Flags
// ─────────────────────────────────────────────────────────────

export type Tier = "ultra" | "legendary" | "epic";

export interface Player {
  id: string;
  name: string;
  key: string;
  tier: Tier;
  rating: number;
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
  // Ultra-only extras
  element?: string;
  glow?: string;
  glowS?: string;
  b1?: string;
  b2?: string;
  b3?: string;
  bg1?: string;
  bg2?: string;
  acc?: string;
  sym?: string;
}

// Avatar image paths — drop files into /public/avatars/<key>.png
export const AVATARS: Record<string, string> = {
  // Ultra
  kash: "/avatars/kash.png",
  val: "/avatars/val.png",
  tamara: "/avatars/tamara.png",
  el_khalil: "/avatars/el_khalil.png",
  josh: "/avatars/josh.png",
  G9D: "/avatars/G9D.png",
  kena: "/avatars/kena.png",
  // Legendary
  tutufly: "/avatars/tutufly.png",
  eren_daddy: "/avatars/eren_daddy.png",
  maharshi: "/avatars/maharshi.png",
  john: "/avatars/john.png",
  evo_yudha: "/avatars/evo_yudha.png",
  oahid: "/avatars/oahid.png",
  tanjiro: "/avatars/tanjiro.png",
  softiee: "/avatars/softiee.png",
  kej: "/avatars/kej.png",
  intuition: "/avatars/intuition.png",
  oluwasegun: "/avatars/oluwasegun.png",
  stanelope: "/avatars/stanelope.png",
  stefan: "/avatars/stefan.png",
  frisco: "/avatars/frisco.png",
  osaragi: "/avatars/osaragi.png",
  dunken: "/avatars/dunken.png",
  jez: "/avatars/jez.png",
  rizan: "/avatars/rizan.png",
  eric: "/avatars/eric.png",
  hinata: "/avatars/hinata.png",
  // Epic
  heat: "/avatars/heat.png",
  bien: "/avatars/bien.png",
  crankyy: "/avatars/crankyy.png",
  flakkyy: "/avatars/flakkyy.png",
  james: "/avatars/james.png",
  momo: "/avatars/momo.png",
  linhlambo: "/avatars/linhlambo.png",
  qazi: "/avatars/qazi.png",
  riyade: "/avatars/riyade.png",
  hemisphere: "/avatars/hemisphere.png",
  mira: "/avatars/mira.png",
  mmorgs: "/avatars/mmorgs.png",
  hammad: "/avatars/hammad.png",
  saintex: "/avatars/saintex.png",
  lightol: "/avatars/lightol.png",
  mantissa: "/avatars/mantissa.png",
  zegna: "/avatars/zegna.png",
  sarthak: "/avatars/sarthak.png",
  hyshow: "/avatars/hyshow.png",
  ehilia: "/avatars/ehilia.png",
  kai: "/avatars/kai.png",
  browny: "/avatars/browny.png",
  grandad: "/avatars/grandad.png",
  oxygen: "/avatars/oxygen.png",
  unbothered: "/avatars/unbothered.png",
};

export const ULTRAS: Player[] = [
  { id:"u1", name:"Kash",      key:"kash",      tier:"ultra", rating:99, pac:99, sho:97, pas:98, dri:99, def:92, phy:95, element:"✨ COSMIC",    glow:"#FFD700", glowS:"#FFD70055", b1:"#FFD700", b2:"#FFF8C0", b3:"#B8860B", bg1:"#1a1200", bg2:"#2d1f00", acc:"#FFE566", sym:"✦" },
  { id:"u2", name:"Val",       key:"val",       tier:"ultra", rating:96, pac:98, sho:88, pas:95, dri:97, def:80, phy:85, element:"🌊 WATER",     glow:"#38BDF8", glowS:"#38BDF855", b1:"#38BDF8", b2:"#BAE6FD", b3:"#0369A1", bg1:"#00111a", bg2:"#001f2e", acc:"#7DD3FC", sym:"◈" },
  { id:"u3", name:"Tamara",    key:"tamara",    tier:"ultra", rating:97, pac:94, sho:96, pas:91, dri:95, def:85, phy:97, element:"🔥 FIRE",      glow:"#F97316", glowS:"#F9731655", b1:"#F97316", b2:"#FED7AA", b3:"#9A3412", bg1:"#1a0800", bg2:"#2d1200", acc:"#FB923C", sym:"🔥" },
  { id:"u4", name:"El-Khalil", key:"el_khalil", tier:"ultra", rating:95, pac:96, sho:90, pas:93, dri:96, def:82, phy:88, element:"⚡ LIGHTNING",  glow:"#A855F7", glowS:"#A855F755", b1:"#A855F7", b2:"#E9D5FF", b3:"#6B21A8", bg1:"#0d001a", bg2:"#1a0033", acc:"#C084FC", sym:"⚡" },
  { id:"u5", name:"Josh",      key:"josh",      tier:"ultra", rating:95, pac:91, sho:93, pas:89, dri:98, def:78, phy:90, element:"🎨 CHAOS",     glow:"#F43F5E", glowS:"#F43F5E55", b1:"#F43F5E", b2:"#FECDD3", b3:"#881337", bg1:"#1a0008", bg2:"#200010", acc:"#FB7185", sym:"✸" },
  { id:"u6", name:"G9D",       key:"G9D",       tier:"ultra", rating:98, pac:97, sho:99, pas:88, dri:94, def:96, phy:99, element:"🩸 DARK FIRE",  glow:"#DC2626", glowS:"#DC262655", b1:"#DC2626", b2:"#FECACA", b3:"#7F1D1D", bg1:"#1a0000", bg2:"#250000", acc:"#F87171", sym:"⬡" },
  { id:"u7", name:"Kena",      key:"kena",      tier:"ultra", rating:96, pac:88, sho:86, pas:97, dri:93, def:84, phy:83, element:"🦋 ARCANE",    glow:"#8B5CF6", glowS:"#8B5CF655", b1:"#8B5CF6", b2:"#DDD6FE", b3:"#4C1D95", bg1:"#0d0014", bg2:"#150020", acc:"#A78BFA", sym:"🦋" },
];

export const LEGENDARIES: Player[] = [
  { id:"l1",  name:"Tutufly",    key:"tutufly",    tier:"legendary", rating:88, pac:85, sho:82, pas:88, dri:86, def:75, phy:80 },
  { id:"l2",  name:"Eren-Daddy", key:"eren_daddy",  tier:"legendary", rating:87, pac:83, sho:86, pas:80, dri:87, def:72, phy:84 },
  { id:"l3",  name:"Maharshi",   key:"maharshi",   tier:"legendary", rating:86, pac:80, sho:78, pas:89, dri:84, def:76, phy:79 },
  { id:"l4",  name:"John",       key:"john",       tier:"legendary", rating:89, pac:87, sho:84, pas:85, dri:88, def:78, phy:86 },
  { id:"l5",  name:"EvoYudha",   key:"evo_yudha",  tier:"legendary", rating:85, pac:82, sho:80, pas:86, dri:83, def:74, phy:81 },
  { id:"l6",  name:"Oahid",      key:"oahid",      tier:"legendary", rating:86, pac:84, sho:81, pas:87, dri:85, def:73, phy:78 },
  { id:"l7",  name:"Tanjiro",    key:"tanjiro",    tier:"legendary", rating:90, pac:92, sho:88, pas:84, dri:91, def:80, phy:89 },
  { id:"l8",  name:"Softiee",    key:"softiee",    tier:"legendary", rating:87, pac:81, sho:83, pas:88, dri:86, def:77, phy:80 },
  { id:"l9",  name:"Kej",        key:"kej",        tier:"legendary", rating:88, pac:86, sho:82, pas:90, dri:87, def:74, phy:82 },
  { id:"l10", name:"Intuition",  key:"intuition",  tier:"legendary", rating:87, pac:85, sho:80, pas:89, dri:86, def:75, phy:79 },
  { id:"l11", name:"Oluwasegun", key:"oluwasegun", tier:"legendary", rating:91, pac:90, sho:89, pas:85, dri:89, def:82, phy:92 },
  { id:"l12", name:"Stanelope",  key:"stanelope",  tier:"legendary", rating:86, pac:83, sho:81, pas:87, dri:85, def:73, phy:80 },
  { id:"l13", name:"Stefan",     key:"stefan",     tier:"legendary", rating:85, pac:80, sho:79, pas:84, dri:83, def:76, phy:78 },
  { id:"l14", name:"Frisco",     key:"frisco",     tier:"legendary", rating:89, pac:86, sho:87, pas:82, dri:88, def:83, phy:87 },
  { id:"l15", name:"Osaragi",    key:"osaragi",    tier:"legendary", rating:87, pac:84, sho:83, pas:88, dri:86, def:74, phy:81 },
  { id:"l16", name:"Dunken",     key:"dunken",     tier:"legendary", rating:88, pac:82, sho:85, pas:86, dri:84, def:80, phy:85 },
  { id:"l17", name:"Jez",        key:"jez",        tier:"legendary", rating:86, pac:83, sho:80, pas:88, dri:85, def:72, phy:79 },
  { id:"l18", name:"Rizan",      key:"rizan",      tier:"legendary", rating:89, pac:87, sho:84, pas:83, dri:89, def:81, phy:88 },
  { id:"l19", name:"Eric",       key:"eric",       tier:"legendary", rating:85, pac:84, sho:78, pas:85, dri:83, def:77, phy:82 },
  { id:"l20", name:"Hinata",     key:"hinata",     tier:"legendary", rating:88, pac:85, sho:83, pas:90, dri:87, def:76, phy:80 },
];

export const EPICS: Player[] = [
  { id:"e1",  name:"Heat",       key:"heat",       tier:"epic", rating:78, pac:80, sho:76, pas:75, dri:79, def:65, phy:74 },
  { id:"e2",  name:"Bien",       key:"bien",       tier:"epic", rating:76, pac:74, sho:72, pas:78, dri:77, def:64, phy:70 },
  { id:"e3",  name:"Crankyy",    key:"crankyy",    tier:"epic", rating:75, pac:76, sho:73, pas:74, dri:76, def:60, phy:68 },
  { id:"e4",  name:"Flakkyy",    key:"flakkyy",    tier:"epic", rating:77, pac:75, sho:74, pas:79, dri:78, def:62, phy:71 },
  { id:"e5",  name:"James",      key:"james",      tier:"epic", rating:74, pac:72, sho:71, pas:75, dri:74, def:63, phy:72 },
  { id:"e6",  name:"Momo",       key:"momo",       tier:"epic", rating:76, pac:78, sho:73, pas:73, dri:77, def:61, phy:69 },
  { id:"e7",  name:"Linhlambo",  key:"linhlambo",  tier:"epic", rating:75, pac:73, sho:70, pas:77, dri:75, def:64, phy:68 },
  { id:"e8",  name:"Qazi",       key:"qazi",       tier:"epic", rating:77, pac:76, sho:75, pas:76, dri:78, def:62, phy:72 },
  { id:"e9",  name:"Riyade",     key:"riyade",     tier:"epic", rating:78, pac:79, sho:74, pas:74, dri:79, def:63, phy:70 },
  { id:"e10", name:"Hemisphere", key:"hemisphere", tier:"epic", rating:76, pac:75, sho:72, pas:78, dri:76, def:65, phy:73 },
  { id:"e11", name:"Mira",       key:"mira",       tier:"epic", rating:75, pac:72, sho:71, pas:79, dri:75, def:61, phy:67 },
  { id:"e12", name:"Mmorgs",     key:"mmorgs",     tier:"epic", rating:79, pac:77, sho:78, pas:73, dri:77, def:68, phy:76 },
  { id:"e13", name:"Hamad",      key:"hammad",     tier:"epic", rating:77, pac:74, sho:76, pas:74, dri:76, def:66, phy:74 },
  { id:"e14", name:"SaintEx",    key:"saintex",    tier:"epic", rating:78, pac:80, sho:75, pas:72, dri:78, def:63, phy:75 },
  { id:"e15", name:"Lightol",    key:"lightol",    tier:"epic", rating:76, pac:73, sho:74, pas:76, dri:75, def:64, phy:71 },
  { id:"e16", name:"Mantissa",   key:"mantissa",   tier:"epic", rating:75, pac:74, sho:70, pas:77, dri:74, def:62, phy:69 },
  { id:"e17", name:"Zegna",      key:"zegna",      tier:"epic", rating:78, pac:76, sho:77, pas:75, dri:77, def:67, phy:73 },
  { id:"e18", name:"Sarthak",    key:"sarthak",    tier:"epic", rating:74, pac:71, sho:72, pas:76, dri:73, def:63, phy:70 },
  { id:"e19", name:"Hyshow",     key:"hyshow",     tier:"epic", rating:76, pac:75, sho:73, pas:74, dri:76, def:64, phy:72 },
  { id:"e20", name:"Ehilia",     key:"ehilia",     tier:"epic", rating:77, pac:73, sho:71, pas:80, dri:76, def:62, phy:68 },
  { id:"e21", name:"Kai",        key:"kai",        tier:"epic", rating:79, pac:81, sho:76, pas:74, dri:80, def:64, phy:74 },
  { id:"e22", name:"Browny",     key:"browny",     tier:"epic", rating:76, pac:77, sho:74, pas:73, dri:77, def:61, phy:70 },
  { id:"e23", name:"Grandad",    key:"grandad",    tier:"epic", rating:74, pac:70, sho:72, pas:75, dri:73, def:65, phy:73 },
  { id:"e24", name:"Oxygen",     key:"oxygen",     tier:"epic", rating:75, pac:74, sho:71, pas:75, dri:74, def:63, phy:70 },
  { id:"e25", name:"Unbothered", key:"unbothered", tier:"epic", rating:78, pac:78, sho:75, pas:74, dri:78, def:64, phy:73 },
];

export const ALL_PLAYERS: Player[] = [...ULTRAS, ...LEGENDARIES, ...EPICS];

// ─── Formations ───────────────────────────────────────────────
export interface Formation {
  id: string;
  name: string;
  slots: { role: string; x: number; y: number }[];
}

export const FORMATIONS: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "LB",  x: 15, y: 72 }, { role: "CB",  x: 35, y: 72 }, { role: "CB",  x: 65, y: 72 }, { role: "RB",  x: 85, y: 72 },
      { role: "CM",  x: 25, y: 50 }, { role: "CDM", x: 50, y: 50 }, { role: "CM",  x: 75, y: 50 },
      { role: "LW",  x: 18, y: 25 }, { role: "ST",  x: 50, y: 20 }, { role: "RW",  x: 82, y: 25 },
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "LB",  x: 15, y: 72 }, { role: "CB",  x: 35, y: 72 }, { role: "CB",  x: 65, y: 72 }, { role: "RB",  x: 85, y: 72 },
      { role: "LM",  x: 15, y: 50 }, { role: "CM",  x: 38, y: 50 }, { role: "CM",  x: 62, y: 50 }, { role: "RM",  x: 85, y: 50 },
      { role: "ST",  x: 35, y: 22 }, { role: "ST",  x: 65, y: 22 },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "CB",  x: 25, y: 72 }, { role: "CB",  x: 50, y: 72 }, { role: "CB",  x: 75, y: 72 },
      { role: "LWB", x: 12, y: 52 }, { role: "CM",  x: 32, y: 52 }, { role: "CDM", x: 50, y: 52 }, { role: "CM",  x: 68, y: 52 }, { role: "RWB", x: 88, y: 52 },
      { role: "ST",  x: 35, y: 22 }, { role: "ST",  x: 65, y: 22 },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "LB",  x: 10, y: 70 }, { role: "CB",  x: 28, y: 74 }, { role: "CB",  x: 50, y: 74 }, { role: "CB",  x: 72, y: 74 }, { role: "RB",  x: 90, y: 70 },
      { role: "CM",  x: 28, y: 50 }, { role: "CDM", x: 50, y: 50 }, { role: "CM",  x: 72, y: 50 },
      { role: "ST",  x: 35, y: 22 }, { role: "ST",  x: 65, y: 22 },
    ],
  },
  {
    id: "4-2-4",
    name: "4-2-4",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "LB",  x: 15, y: 72 }, { role: "CB",  x: 35, y: 72 }, { role: "CB",  x: 65, y: 72 }, { role: "RB",  x: 85, y: 72 },
      { role: "CDM", x: 35, y: 52 }, { role: "CDM", x: 65, y: 52 },
      { role: "LW",  x: 12, y: 22 }, { role: "ST",  x: 35, y: 18 }, { role: "ST",  x: 65, y: 18 }, { role: "RW",  x: 88, y: 22 },
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    slots: [
      { role: "GK",  x: 50, y: 90 },
      { role: "CB",  x: 25, y: 72 }, { role: "CB",  x: 50, y: 72 }, { role: "CB",  x: 75, y: 72 },
      { role: "LM",  x: 15, y: 52 }, { role: "CM",  x: 38, y: 52 }, { role: "CM",  x: 62, y: 52 }, { role: "RM",  x: 85, y: 52 },
      { role: "LW",  x: 18, y: 22 }, { role: "ST",  x: 50, y: 18 }, { role: "RW",  x: 82, y: 22 },
    ],
  },
];

// ─── WC2026 Nations (48) ──────────────────────────────────────
export interface Nation {
  code: string;
  name: string;
  flag: string; // emoji flag
  color: string; // accent color for UI theming
}

export const NATIONS: Nation[] = [
  { code:"AR", name:"Argentina",    flag:"🇦🇷", color:"#74ACDF" },
  { code:"AU", name:"Australia",    flag:"🇦🇺", color:"#00843D" },
  { code:"BE", name:"Belgium",      flag:"🇧🇪", color:"#EF3340" },
  { code:"BR", name:"Brazil",       flag:"🇧🇷", color:"#009C3B" },
  { code:"CA", name:"Canada",       flag:"🇨🇦", color:"#FF0000" },
  { code:"CL", name:"Chile",        flag:"🇨🇱", color:"#D52B1E" },
  { code:"CN", name:"China",        flag:"🇨🇳", color:"#DE2910" },
  { code:"CO", name:"Colombia",     flag:"🇨🇴", color:"#FCD116" },
  { code:"CR", name:"Costa Rica",   flag:"🇨🇷", color:"#002B7F" },
  { code:"HR", name:"Croatia",      flag:"🇭🇷", color:"#FF0000" },
  { code:"DK", name:"Denmark",      flag:"🇩🇰", color:"#C60C30" },
  { code:"EC", name:"Ecuador",      flag:"🇪🇨", color:"#FFD100" },
  { code:"EG", name:"Egypt",        flag:"🇪🇬", color:"#C8102E" },
  { code:"FR", name:"France",       flag:"🇫🇷", color:"#002395" },
  { code:"DE", name:"Germany",      flag:"🇩🇪", color:"#000000" },
  { code:"GH", name:"Ghana",        flag:"🇬🇭", color:"#006B3F" },
  { code:"HU", name:"Hungary",      flag:"🇭🇺", color:"#CE2939" },
  { code:"IN", name:"India",        flag:"🇮🇳", color:"#FF9933" },
  { code:"IR", name:"Iran",         flag:"🇮🇷", color:"#239F40" },
  { code:"JP", name:"Japan",        flag:"🇯🇵", color:"#BC002D" },
  { code:"KZ", name:"Kazakhstan",   flag:"🇰🇿", color:"#00AFCA" },
  { code:"KR", name:"South Korea",  flag:"🇰🇷", color:"#003478" },
  { code:"MX", name:"Mexico",       flag:"🇲🇽", color:"#006847" },
  { code:"MA", name:"Morocco",      flag:"🇲🇦", color:"#C1272D" },
  { code:"NL", name:"Netherlands",  flag:"🇳🇱", color:"#FF6600" },
  { code:"NZ", name:"New Zealand",  flag:"🇳🇿", color:"#00247D" },
  { code:"NG", name:"Nigeria",      flag:"🇳🇬", color:"#008751" },
  { code:"NO", name:"Norway",       flag:"🇳🇴", color:"#EF2B2D" },
  { code:"PA", name:"Panama",       flag:"🇵🇦", color:"#005293" },
  { code:"PY", name:"Paraguay",     flag:"🇵🇾", color:"#D52B1E" },
  { code:"PE", name:"Peru",         flag:"🇵🇪", color:"#D91023" },
  { code:"PH", name:"Philippines",  flag:"🇵🇭", color:"#0038A8" },
  { code:"PL", name:"Poland",       flag:"🇵🇱", color:"#DC143C" },
  { code:"PT", name:"Portugal",     flag:"🇵🇹", color:"#006600" },
  { code:"RO", name:"Romania",      flag:"🇷🇴", color:"#002B7F" },
  { code:"SA", name:"Saudi Arabia", flag:"🇸🇦", color:"#006C35" },
  { code:"SN", name:"Senegal",      flag:"🇸🇳", color:"#00853F" },
  { code:"RS", name:"Serbia",       flag:"🇷🇸", color:"#C6363C" },
  { code:"SK", name:"Slovakia",     flag:"🇸🇰", color:"#0B4EA2" },
  { code:"SI", name:"Slovenia",     flag:"🇸🇮", color:"#003DA5" },
  { code:"ES", name:"Spain",        flag:"🇪🇸", color:"#AA151B" },
  { code:"CH", name:"Switzerland",  flag:"🇨🇭", color:"#FF0000" },
  { code:"TH", name:"Thailand",     flag:"🇹🇭", color:"#003087" },
  { code:"TR", name:"Turkey",       flag:"🇹🇷", color:"#E30A17" },
  { code:"UA", name:"Ukraine",      flag:"🇺🇦", color:"#005BBB" },
  { code:"GB", name:"England",      flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", color:"#CF142B" },
  { code:"US", name:"USA",          flag:"🇺🇸", color:"#3C3B6E" },
  { code:"UY", name:"Uruguay",      flag:"🇺🇾", color:"#5EB6E4" },
];
