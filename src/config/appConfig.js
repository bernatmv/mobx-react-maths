
// COMMON

const NO_PRIZE = 0;
const CH = 1;
const OR = 2;
const PL = 3;
const PE = 4;
const ST = 5;
const ME = 6;
const G7 = 7;
const R7 = 8;
const B7 = 9;
const SH_x1 = 10;
const SH_x2 = 11;
const SH_x3 = 12;
const SU = 13;
const SH = 14;
const QB = 15;

export const Figures = {
    NO_PRIZE: NO_PRIZE,
    CH: CH,
    OR: OR,
    PL: PL,
    PE: PE,
    ST: ST,
    ME: ME,
    G7: G7,
    R7: R7,
    B7: B7,
    SH_x1: SH_x1,
    SH_x2: SH_x2,
    SH_x3: SH_x3,
    SU: SU,
    SH: SH,
    QB: QB,
};

export const FigureNames = [
    'NO_PRIZE',
    'CH',
    'OR',
    'PL',
    'PE',
    'ST',
    'ME',
    'G7',
    'R7',
    'B7',
    'SH_x1',
    'SH_x2',
    'SH_x3',
    'SU',
    'SH',
    'QB',
];

// BOTTOM

export const appConfigBottom = {
    reels: [
        [
            R7,
            PE,
            SU,
            ME,
            SH,
            OR,
            PL,
            G7,
            ME,
            PL,
            B7,
            OR,
            SU,
            CH,
            G7,
            ST
        ],
        [
            B7,
            PL,
            OR,
            SH,
            CH,
            SH,
            ST,
            R7,
            PE,
            ME,
            SU,
            OR,
            ST,
            G7,
            CH,
            SH
        ],
        [
            SH,
            CH,
            SU,
            PE,
            B7,
            PL,
            ST,
            SH,
            R7,
            CH,
            G7,
            ME,
            SU,
            PE,
            PL,
            OR
        ]
    ],
    paytable: [
        [0],
        [2],
        [4],
        [8],
        [12],
        [16],
        [20],
        [50],
        [100],
        [500],
        [1],
        [2],
        [6],
        [22],
        [1,2,3]
    ],
    minigame: SU,
    bonos: SH
};

// TOP

const TOP_NO_PRIZE = 0;
const SHIP = 1;
const BIRD = 2;
const LEOPARD = 3;
const LADY = 4;
const GREEN_GEM = 5;
const RED_GEM = 6;
const BLUE_GEM = 7;
const RUNE = 8;

export const FiguresTop = {
    TOP_NO_PRIZE: TOP_NO_PRIZE,
    SHIP: SHIP,
    BIRD: BIRD,
    LEOPARD: LEOPARD,
    LADY: LADY,
    GREEN_GEM: GREEN_GEM,
    RED_GEM: RED_GEM,
    BLUE_GEM: BLUE_GEM,
    RUNE: RUNE
};

export const FigureTopNames = [
    'TOP_NO_PRIZE',
    'SHIP',
    'BIRD',
    'LEOPARD',
    'LADY',
    'GREEN_GEM',
    'RED_GEM',
    'BLUE_GEM',
    'RUNE'
];

export const appConfigTop = {
    reels: [
        [
            LEOPARD,
            LEOPARD,
            SHIP,
            GREEN_GEM,
            BIRD,
            BIRD,
            BIRD,
            BLUE_GEM,
            RED_GEM,
            LADY,
            LADY,
            LADY,
            SHIP,
            LEOPARD,
            BIRD,
            GREEN_GEM,
            LEOPARD
        ],
        [
            LEOPARD,
            LEOPARD,
            SHIP,
            RED_GEM,
            LADY,
            LADY,
            LADY,
            RUNE,
            BLUE_GEM,
            BIRD,
            BIRD,
            BIRD,
            LEOPARD,
            RUNE,
            RED_GEM,
            GREEN_GEM,
            LEOPARD
        ],
        [
            LADY,
            LADY,
            LEOPARD,
            GREEN_GEM,
            LEOPARD,
            LEOPARD,
            LEOPARD,
            RED_GEM,
            BIRD,
            BIRD,
            BIRD,
            SHIP,
            GREEN_GEM,
            LADY,
            BLUE_GEM,
            BIRD,
            LADY
        ]
    ],
    paytable: [
        [0],
        [3,6,9],
        [20,40,60,80,100],
        [20,40,60,80,100],
        [20,40,60,80,100],
        [100],
        [200],
        [500],
        [1]
    ],
    bonos: SHIP
};