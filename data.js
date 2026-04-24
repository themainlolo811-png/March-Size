const PNS_DATA = {

  hq: {
    name: "Headquarters Level",
    category: "hq",
    obtainability: "easy",
    description: "Base march size from upgrading your HQ",
    levels: [
      {level:1,march:2000},{level:2,march:4000},{level:3,march:6000},{level:4,march:8000},
      {level:5,march:10000},{level:6,march:12500},{level:7,march:15000},{level:8,march:17500},
      {level:9,march:20000},{level:10,march:22500},{level:11,march:25500},{level:12,march:28500},
      {level:13,march:31500},{level:14,march:34500},{level:15,march:37500},{level:16,march:41000},
      {level:17,march:44500},{level:18,march:48000},{level:19,march:51500},{level:20,march:55000},
      {level:21,march:59000},{level:22,march:63000},{level:23,march:67000},{level:24,march:71000},
      {level:25,march:75000},{level:26,march:79500},{level:27,march:84000},{level:28,march:88500},
      {level:29,march:93000},{level:30,march:97500},{level:31,march:102000},{level:32,march:106500},
      {level:33,march:111000},{level:34,march:115500},{level:35,march:120000},{level:36,march:130000},
      {level:37,march:140000},{level:38,march:150000},{level:39,march:160000},{level:40,march:170000},
      {level:41,march:180000},{level:42,march:190000},{level:43,march:200000},{level:44,march:210000},
      {level:45,march:220000}
    ]
  },

  nova: {
    name: "Nova Troop Size Skills",
    category: "nova",
    obtainability: "grind",
    description: "March size bonuses from Nova military skill tree",
    levels: [
      {level:1,march:300},{level:2,march:600},{level:3,march:900},{level:4,march:1200},
      {level:5,march:1500},{level:6,march:1800},{level:7,march:2100},{level:8,march:2400},
      {level:9,march:2700},{level:10,march:3000},{level:11,march:3600},{level:12,march:4200},
      {level:13,march:4800},{level:14,march:6000},{level:15,march:7200},{level:16,march:8400},
      {level:17,march:10500},{level:18,march:12600},{level:19,march:14700},{level:20,march:16800},
      {level:21,march:18000},{level:22,march:19200},{level:23,march:20400},{level:24,march:21600},
      {level:25,march:22800},{level:26,march:24000},{level:27,march:25500},{level:28,march:27000},
      {level:29,march:28500},{level:30,march:30000}
    ]
  },

  commanderTalent: {
    name: "Commander Talent (March Cap)",
    category: "talent",
    obtainability: "easy",
    description: "March size from Commander Talent tree — Military/March Cap tiers I, II, III",
    tiers: [
      {
        name: "Military/March Cap I",
        levels: [
          {level:1,march:1000},{level:2,march:2000},{level:3,march:3000},{level:4,march:4000},{level:5,march:5000}
        ]
      },
      {
        name: "Military/March Cap II",
        levels: [
          {level:1,march:1000},{level:2,march:2000},{level:3,march:3000},{level:4,march:4000},{level:5,march:5000}
        ]
      },
      {
        name: "Military/March Cap III",
        levels: [
          {level:1,march:1000},{level:2,march:2000},{level:3,march:3000},{level:4,march:4000},{level:5,march:5000}
        ]
      }
    ],
    maxTotal: 15000
  },

  research: {
    name: "Research (Military Troop Size)",
    category: "research",
    obtainability: "grind",
    description: "March size from Military research tree — Troop Size nodes",
    tiers: [
      {
        name: "Military/Troop Size I",
        levels: [
          {level:1,march:2000},{level:2,march:4000},{level:3,march:6000},{level:4,march:8000},{level:5,march:10000}
        ]
      },
      {
        name: "Military/Troop Size II",
        levels: [
          {level:1,march:2000},{level:2,march:4000},{level:3,march:6000},{level:4,march:8000},{level:5,march:10000}
        ]
      },
      {
        name: "Military/Troop Size III",
        levels: [
          {level:1,march:2000},{level:2,march:4000},{level:3,march:6000},{level:4,march:8000},{level:5,march:10000}
        ]
      },
      {
        name: "Military/Troop Size IV",
        levels: [
          {level:1,march:2000},{level:2,march:4000},{level:3,march:6000},{level:4,march:8000},{level:5,march:10000}
        ]
      }
    ],
    maxTotal: 40000
  },

  heroes: {
    name: "Heroes",
    category: "heroes",
    description: "March size bonuses from hero enhancement levels",
    list: [
      {
        id: "eve",
        name: "Eve",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: null,
        enhancements: [
          {level:"+0",march:4000},{level:"+1",march:6000},{level:"+2",march:8000},
          {level:"+3",march:12000},{level:"+4",march:16000},{level:"+5",march:20000},
          {level:"+6",march:25000},{level:"+7",march:30000},{level:"+8",march:50000}
        ]
      },
      {
        id: "otto",
        name: "Otto",
        stars: 4,
        obtainability: "grind",
        nanoweapon: null,
        enhancements: [
          {level:"+0",march:2000},{level:"+1",march:3000},{level:"+2",march:4000},
          {level:"+3",march:6000},{level:"+4",march:8000},{level:"+5",march:10000}
        ]
      },
      {
        id: "varvara",
        name: "Varvara",
        stars: 4,
        obtainability: "grind",
        nanoweapon: null,
        enhancements: [
          {level:"+0",march:2000},{level:"+1",march:3000},{level:"+2",march:4000},
          {level:"+3",march:6000},{level:"+4",march:8000},{level:"+5",march:10000}
        ]
      },
      {
        id: "ladym",
        name: "Lady M",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: "deathbass",
        enhancements: [
          {level:"+0",march:1600},{level:"+1",march:2400},{level:"+2",march:3200},
          {level:"+3",march:4800},{level:"+4",march:6400},{level:"+5",march:8000},
          {level:"+6",march:10000},{level:"+7",march:12000},{level:"+8",march:18700}
        ]
      },
      {
        id: "scarlett",
        name: "Scarlett",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: "tesla",
        enhancements: [
          {level:"+0",march:2000},{level:"+1",march:3000},{level:"+2",march:4000},
          {level:"+3",march:6000},{level:"+4",march:8000},{level:"+5",march:10000},
          {level:"+6",march:12500},{level:"+7",march:20000},{level:"+8",march:30000}
        ]
      },
      {
        id: "ironclaw",
        name: "Ironclaw",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: "deathclaw",
        enhancements: [
          {level:"+0",march:4000},{level:"+1",march:6000},{level:"+2",march:8000},
          {level:"+3",march:12000},{level:"+4",march:16000},{level:"+5",march:20000},
          {level:"+6",march:25000},{level:"+7",march:37500},{level:"+8",march:55000}
        ]
      },
      {
        id: "leah",
        name: "Leah",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: "ocular",
        enhancements: [
          {level:"+0",march:4000},{level:"+1",march:6000},{level:"+2",march:8000},
          {level:"+3",march:12000},{level:"+4",march:16000},{level:"+5",march:20000},
          {level:"+6",march:25000},{level:"+7",march:37500},{level:"+8",march:55000}
        ]
      },
      {
        id: "beepboop",
        name: "Beepboop No.7",
        stars: 5,
        obtainability: "extreme_grind",
        nanoweapon: "powerdrill",
        enhancements: [
          {level:"+0",march:2000},{level:"+1",march:3000},{level:"+2",march:4000},
          {level:"+3",march:6000},{level:"+4",march:8000},{level:"+5",march:10000},
          {level:"+6",march:12500},{level:"+7",march:20000},{level:"+8",march:30000}
        ]
      }
    ]
  },

  nanoweapons: {
    name: "Nanoweapons",
    category: "nanoweapons",
    description: "March size from nanoweapons — bonus depends on paired hero's enhancement level",
    apexNote: "Apex tier requires paired hero to be at least +6 enhancement",
    list: [
      {
        id: "deathbass",
        name: "Deathbass",
        pairedHero: "ladym",
        obtainability: "grind",
        tiers: [
          {tier:"Common", heroEnh:"0-3", march:0},
          {tier:"Common", heroEnh:"4-5", march:200},
          {tier:"Common", heroEnh:"6-8", march:200},
          {tier:"Uncommon", heroEnh:"0-3", march:0},
          {tier:"Uncommon", heroEnh:"4-5", march:1000},
          {tier:"Uncommon", heroEnh:"6-8", march:1000},
          {tier:"Rare", heroEnh:"0-3", march:0},
          {tier:"Rare", heroEnh:"4-5", march:4000},
          {tier:"Rare", heroEnh:"6-8", march:4000},
          {tier:"Epic", heroEnh:"0-3", march:0},
          {tier:"Epic", heroEnh:"4-5", march:10000},
          {tier:"Epic", heroEnh:"6-8", march:10000},
          {tier:"Apex", heroEnh:"0-3", march:0},
          {tier:"Apex", heroEnh:"4-5", march:0},
          {tier:"Apex", heroEnh:"6-8", march:25000}
        ]
      },
      {
        id: "tesla",
        name: "Tesla Cannon",
        pairedHero: "scarlett",
        obtainability: "grind",
        tiers: [
          {tier:"Common", heroEnh:"0-3", march:0},
          {tier:"Common", heroEnh:"4-5", march:200},
          {tier:"Common", heroEnh:"6-8", march:200},
          {tier:"Uncommon", heroEnh:"0-3", march:0},
          {tier:"Uncommon", heroEnh:"4-5", march:1000},
          {tier:"Uncommon", heroEnh:"6-8", march:1000},
          {tier:"Rare", heroEnh:"0-3", march:0},
          {tier:"Rare", heroEnh:"4-5", march:4000},
          {tier:"Rare", heroEnh:"6-8", march:4000},
          {tier:"Epic", heroEnh:"0-3", march:0},
          {tier:"Epic", heroEnh:"4-5", march:10000},
          {tier:"Epic", heroEnh:"6-8", march:10000},
          {tier:"Apex", heroEnh:"0-3", march:0},
          {tier:"Apex", heroEnh:"4-5", march:0},
          {tier:"Apex", heroEnh:"6-8", march:25000}
        ]
      },
      {
        id: "deathclaw",
        name: "Deathclaw",
        pairedHero: "ironclaw",
        obtainability: "grind",
        tiers: [
          {tier:"Common", heroEnh:"0-3", march:0},
          {tier:"Common", heroEnh:"4-5", march:300},
          {tier:"Common", heroEnh:"6-8", march:300},
          {tier:"Uncommon", heroEnh:"0-3", march:0},
          {tier:"Uncommon", heroEnh:"4-5", march:1500},
          {tier:"Uncommon", heroEnh:"6-8", march:1500},
          {tier:"Rare", heroEnh:"0-3", march:0},
          {tier:"Rare", heroEnh:"4-5", march:6000},
          {tier:"Rare", heroEnh:"6-8", march:6000},
          {tier:"Epic", heroEnh:"0-3", march:0},
          {tier:"Epic", heroEnh:"4-5", march:15000},
          {tier:"Epic", heroEnh:"6-8", march:15000},
          {tier:"Apex", heroEnh:"0-3", march:0},
          {tier:"Apex", heroEnh:"4-5", march:0},
          {tier:"Apex", heroEnh:"6-8", march:40000}
        ]
      },
      {
        id: "ocular",
        name: "Ocular Drone",
        pairedHero: "leah",
        obtainability: "grind",
        tiers: [
          {tier:"Common", heroEnh:"0-3", march:0},
          {tier:"Common", heroEnh:"4-5", march:200},
          {tier:"Common", heroEnh:"6-8", march:200},
          {tier:"Uncommon", heroEnh:"0-3", march:0},
          {tier:"Uncommon", heroEnh:"4-5", march:1000},
          {tier:"Uncommon", heroEnh:"6-8", march:1000},
          {tier:"Rare", heroEnh:"0-3", march:0},
          {tier:"Rare", heroEnh:"4-5", march:4000},
          {tier:"Rare", heroEnh:"6-8", march:4000},
          {tier:"Epic", heroEnh:"0-3", march:0},
          {tier:"Epic", heroEnh:"4-5", march:10000},
          {tier:"Epic", heroEnh:"6-8", march:10000},
          {tier:"Apex", heroEnh:"0-3", march:0},
          {tier:"Apex", heroEnh:"4-5", march:0},
          {tier:"Apex", heroEnh:"6-8", march:25000}
        ]
      },
      {
        id: "powerdrill",
        name: "Power Drill",
        pairedHero: "beepboop",
        obtainability: "grind",
        tiers: [
          {tier:"Common", heroEnh:"0-3", march:0},
          {tier:"Common", heroEnh:"4-5", march:200},
          {tier:"Common", heroEnh:"6-8", march:200},
          {tier:"Uncommon", heroEnh:"0-3", march:0},
          {tier:"Uncommon", heroEnh:"4-5", march:1000},
          {tier:"Uncommon", heroEnh:"6-8", march:1000},
          {tier:"Rare", heroEnh:"0-3", march:0},
          {tier:"Rare", heroEnh:"4-5", march:4000},
          {tier:"Rare", heroEnh:"6-8", march:4000},
          {tier:"Epic", heroEnh:"0-3", march:0},
          {tier:"Epic", heroEnh:"4-5", march:10000},
          {tier:"Epic", heroEnh:"6-8", march:10000},
          {tier:"Apex", heroEnh:"0-3", march:0},
          {tier:"Apex", heroEnh:"4-5", march:0},
          {tier:"Apex", heroEnh:"6-8", march:25000}
        ]
      }
    ]
  },

  mecha: {
    name: "Mecha Skills (Troop Size)",
    category: "mecha",
    obtainability: "grind",
    description: "March size from Super Mecha skill upgrades. Requires HQ 35+.",
    note: "Some values are community-estimated. Help us fill in the gaps!",
    levels: [
      {level:1, march:100, confirmed:true},
      {level:2, march:null, confirmed:false},
      {level:3, march:null, confirmed:false},
      {level:4, march:null, confirmed:false},
      {level:5, march:null, confirmed:false},
      {level:6, march:null, confirmed:false},
      {level:7, march:500, confirmed:true},
      {level:8, march:null, confirmed:false},
      {level:9, march:null, confirmed:false},
      {level:10, march:null, confirmed:false},
      {level:11, march:null, confirmed:false},
      {level:12, march:null, confirmed:false},
      {level:13, march:null, confirmed:false},
      {level:14, march:null, confirmed:false},
      {level:15, march:null, confirmed:false},
      {level:16, march:1200, confirmed:true},
      {level:17, march:1300, confirmed:true},
      {level:18, march:1400, confirmed:false},
      {level:19, march:1500, confirmed:false}
    ],
    maxKnown: 1500
  },

  subscription: {
    name: "Privilege Card (Subscription)",
    category: "other",
    obtainability: "pay_only",
    description: "Permanent +3,000 march size while subscription is active",
    march: 3000
  }
};

const OBTAINABILITY = {
  easy: { label: "Easy", emoji: "🟢", description: "Freely farmable, always available, low effort", canSpeedUp: true },
  grind: { label: "Grind", emoji: "🟡", description: "Earnable F2P with consistent effort", canSpeedUp: true },
  extreme_grind: { label: "Extreme Grind", emoji: "🔴", description: "Technically F2P but realistically very slow", canSpeedUp: true },
  pay_only: { label: "Pay Only", emoji: "💜", description: "No F2P path — spending required", canSpeedUp: false }
};
