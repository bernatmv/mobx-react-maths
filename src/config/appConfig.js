
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
const SU = 10;
const SH = 11;
const QB = 12;

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
    SU: SU,
    SH: SH,
    QB: QB,
};

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
        [],
        [2],
        [4],
        [8],
        [12],
        [16],
        [20],
        [50],
        [100],
        [500],
        [22],
        [1,2,6],
        []
    ],
    minigame: SU,
    bonos: SH
};

// TOP

export const appConfigTop = {
    reels: [
        [1,2,3],
        [1,2,3],
        [1,2,3]
    ],
    paytable: {
        '1': [1,2,3],
        '2': [5,6,7],
        '3': [10,100,100]
    },
    wild: [],
    minigame: [],
    bonos: []
};