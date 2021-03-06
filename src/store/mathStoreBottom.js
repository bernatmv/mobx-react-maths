import {observable} from 'mobx';
import {appConfigBottom, Figures, FigureNames} from '../config/appConfig';
import EventConstants from '../common/constants/eventConstants';
import SystemConstants from '../common/constants/systemConstants';
import {generateCodeBag, generateAdvancementsCodeBag} from './helpers/codeGeneratorBottom';

const initialPositions = [0,0,0];
const noPrizeAcceptancePercentage = 0.25;

export default class MathStoreBottom {
    emitter = null;
    config = appConfigBottom;
    // LOCK
    @observable isProcessing = false;
    // STATS
    @observable stats = {
        step: 0,
        all: 0,
        prizes: {
            code: [],
            approved: new Array(15),
            discarded: new Array(15)
        },
        retentions: {
            code: [],
            approved: new Array(15),
            discarded: new Array(15)
        },
        advancements: {
            code: [],
            approved: [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ],
            discarded: [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ]
        }
    };
    // ALL SPINS
    allSpins = { 
        refs: [],
        count: 0 
    };
    prizes = {
        approved: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ],
        discarded: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ]
    };
    advancements = {
        approved: [
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]]
        ],
        discarded: [
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]],
            [[],[],[],[]]
        ]
    };
    retentions = {
        approved: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ],
        discarded: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ]
    };

    constructor(emitter) {
        this.emitter = emitter;
        this.emitter.addListener(EventConstants.CalculateAll, () => this.calculateAll());
        this.emitter.addListener(EventConstants.CalculateAllSpins, () => this.calculateAllSpins());
        this.emitter.addListener(EventConstants.CalculatePrizes, () => this.calculatePrizes());
        this.emitter.addListener(EventConstants.CalculateAvances, () => this.calculateAvances());
        this.emitter.addListener(EventConstants.CalculateRetenciones, () => this.calculateRetenciones());
        this.emitter.addListener(EventConstants.CalculateBonos, () => this.calculateBonos());
        this.emitter.addListener(EventConstants.CalculateMinigames, () => this.calculateMinigames());
    }

    // CALCULATE ALL

    calculateAll() {
        this.calculateAllSpins();
        this.stats.step = 1;
        this.stats.all = this.allSpins.length;
        this.calculatePrizes();
        this.stats.step = 2;
        this.calculateBonos();
        this.stats.step = 3;
        this.calculateMinigames();
        this.stats.step = 4;
        this.prizes.approved.forEach((spins, index) => {
            this.stats.prizes.approved[index] = spins.length;
            this.stats.prizes.discarded[index] = this.prizes.discarded[index].length;
        });
        this.calculateAvances();
        this.stats.step = 5;
        this.advancements.approved.forEach((spins, index) => {
            spins.forEach((advancements, i) => {
                this.stats.advancements.approved[index][i] = advancements.length;
                this.stats.advancements.discarded[index][i] = this.advancements.discarded[index][i].length;
            });
        });
        this.calculateRetenciones();
        this.stats.step = 6;
        this.retentions.approved.forEach((spins, index) => {
            this.stats.retentions.approved[index] = spins.length;
            this.stats.retentions.discarded[index] = this.retentions.discarded[index].length;
        });
    }

    // ALL SPINS

    calculateAllSpins() {
        this.safeExecution(() => this.calculateAllSpinsProcess());
    }

    calculateAllSpinsProcess() {
        let lengthR1 = this.config.reels[0].length;
        let lengthR2 = this.config.reels[1].length;
        let lengthR3 = this.config.reels[2].length;
        let spin;

        for (let x = 0; x < lengthR1; x++) {
            for (let y = 0; y < lengthR2; y++) {
                for (let z = 0; z < lengthR3; z++) {
                    spin = {
                        positions: [x, y, z], 
                        figures: [
                            this.config.reels[0][x], 
                            this.config.reels[1][y], 
                            this.config.reels[2][z]
                        ],
                        prize: this.calculatePrize([this.config.reels[0][x], this.config.reels[1][y], this.config.reels[2][z]])
                    };
                    this.allSpins[this.getId(x,y,z)] = spin;
                    this.allSpins.refs.push(spin)
                    this.allSpins.count++;
                }            
            }            
        }
        this.stats.all = this.allSpins.count;
        this.printResult(this.allSpins);
    }

    // PRIZES

    calculatePrizes() {
        this.safeExecution(() => {
            let approved = this.prizes.approved;
            let discarded = this.prizes.discarded;
            this.calculateNoPrize(approved[Figures.NO_PRIZE], discarded[Figures.NO_PRIZE]);
            this.calculatePrizesProcess(Figures.CH, approved[Figures.CH], discarded[Figures.CH]);
            this.calculatePrizesProcess(Figures.OR, approved[Figures.OR], discarded[Figures.OR]);
            this.calculatePrizesProcess(Figures.PL, approved[Figures.PL], discarded[Figures.PL]);
            this.calculatePrizesProcess(Figures.PE, approved[Figures.PE], discarded[Figures.PE]);
            this.calculatePrizesProcess(Figures.ST, approved[Figures.ST], discarded[Figures.ST]);
            this.calculatePrizesProcess(Figures.ME, approved[Figures.ME], discarded[Figures.ME]);
            this.calculatePrizesProcess(Figures.G7, approved[Figures.G7], discarded[Figures.G7]);
            this.calculatePrizesProcess(Figures.R7, approved[Figures.R7], discarded[Figures.R7]);
            this.calculatePrizesProcess(Figures.B7, approved[Figures.B7], discarded[Figures.B7]);
        });
    }

    calculateNoPrize(approved, discarded) {
        this.allSpins.refs
            .filter(spin => !spin.prize)
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays('NO PRIZE', [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag('NoPrize', approved));
    }

    calculatePrizesProcess(figure, approved, discarded) {
        this.allSpins.refs
            .filter(spin => (spin.prize && spin.prize.figure === figure))
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays(`PRIZES ${FigureNames[figure]}`, [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}`, approved));
    }

    // AVANCES

    calculateAvances() {
        this.safeExecution(() => {
            this.calculateAvancesByFigure(Figures.NO_PRIZE);
            this.calculateAvancesByFigure(Figures.CH);
            this.calculateAvancesByFigure(Figures.OR);
            this.calculateAvancesByFigure(Figures.PL);
            this.calculateAvancesByFigure(Figures.PE);
            this.calculateAvancesByFigure(Figures.ST);
            this.calculateAvancesByFigure(Figures.ME);
            this.calculateAvancesByFigure(Figures.G7);
            this.calculateAvancesByFigure(Figures.R7);
            this.calculateAvancesByFigure(Figures.B7);
            this.calculateAvancesByFigure(Figures.SH_x1);
            this.calculateAvancesByFigure(Figures.SH_x2);
            this.calculateAvancesByFigure(Figures.SH_x3);
            this.calculateAvancesByFigure(Figures.SU);
        });
    }

    calculateAvancesByFigure(figure) {
        let approved = this.advancements.approved[figure];
        let discarded = this.advancements.discarded[figure];
        this.calculateAvancesProcess(this.prizes.approved[figure], 1, approved[0], discarded[0]);
        this.calculateAvancesProcess(this.prizes.approved[figure], 2, approved[1], discarded[1]);
        this.calculateAvancesProcess(this.prizes.approved[figure], 3, approved[2], discarded[2]);
        this.calculateAvancesProcess(this.prizes.approved[figure], 4, approved[3], discarded[3]);
        this.printRawArrays('AVANCES ' + FigureNames[figure], [...approved, ...discarded]);
        this.stats.advancements.code.push(generateAdvancementsCodeBag(`Advancements_${FigureNames[figure]}_x1`, approved[0]));
        this.stats.advancements.code.push(generateAdvancementsCodeBag(`Advancements_${FigureNames[figure]}_x2`, approved[1]));
        this.stats.advancements.code.push(generateAdvancementsCodeBag(`Advancements_${FigureNames[figure]}_x3`, approved[2]));
        this.stats.advancements.code.push(generateAdvancementsCodeBag(`Advancements_${FigureNames[figure]}_x4`, approved[3]));
    }

    /**
     * Sí, la complejidad ciclomátia de esta función es una mierda... si esto fuera medio serio habría que refactorizarlo
     */
    calculateAvancesProcess(spins, avances, approved, discarded) {
        // from all prized spins
            // 1 ->
                // N retrocesos R1 ->
                    // ningún paso tiene premio ->
                        // ugly -> discarded
                        // beautiful -> approved
                    // algún paso tiene premio -> loop
                // N-1 retrocesos R1 + 1 retroceso R2
                    //...
                //...
                // N retroceso R3
                    //...
            // 2 -> ...
        let currentStep1, currentStep2, currentStep3;
        spins.forEach(spin => {
            for (let x = 0; x <= avances; x++) {
                currentStep1 = this.repeatRollBackReel(SystemConstants.Reel_1, spin, x);
                if (x === 0 || !this.havePrize(currentStep1)) {
                    for (let y = 0; y <= (avances - x); y++) {
                        currentStep2 = this.repeatRollBackReel(SystemConstants.Reel_2, currentStep1, y);
                        if (y === 0 || !this.havePrize(currentStep2)) {
                            for (let z = 0; z <= (avances - x - y); z++) {
                                currentStep3 = this.repeatRollBackReel(SystemConstants.Reel_3, currentStep2, z);
                                if ((avances - x - y - z) === 0) {
                                    if (!this.havePrize(currentStep3)) {
                                        if (this.isBeautiful(currentStep3) && this.fitsInPool(spin, currentStep3)) {
                                            approved.push({ 
                                                startSpin: currentStep3, 
                                                prizedSpin: spin, 
                                                movements: [x,y,z] 
                                            });
                                        } else {
                                            discarded.push({ 
                                                startSpin: currentStep3, 
                                                prizedSpin: spin, 
                                                movements: [x,y,z] 
                                            });
                                        }
                                    }
                                } else {
                                    if (this.havePrize(currentStep3)) {
                                        // stop exploring this branch (break from loop)
                                        break;
                                    } else {
                                        // do nothing, continue exploring this branch in the next iteration
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // RETENCIONES

    calculateRetenciones() {
        this.safeExecution(() => {
            let approved = this.retentions.approved;
            let discarded = this.retentions.discarded;
            this.calculateRetencionesProcess(Figures.CH, approved[Figures.CH], discarded[Figures.CH]);
            this.calculateRetencionesProcess(Figures.OR, approved[Figures.OR], discarded[Figures.OR]);
            this.calculateRetencionesProcess(Figures.PL, approved[Figures.PL], discarded[Figures.PL]);
            this.calculateRetencionesProcess(Figures.PE, approved[Figures.PE], discarded[Figures.PE]);
            this.calculateRetencionesProcess(Figures.ST, approved[Figures.ST], discarded[Figures.ST]);
            this.calculateRetencionesProcess(Figures.ME, approved[Figures.ME], discarded[Figures.ME]);
            this.calculateRetencionesProcess(Figures.G7, approved[Figures.G7], discarded[Figures.G7]);
            this.calculateRetencionesProcess(Figures.R7, approved[Figures.R7], discarded[Figures.R7]);
            this.calculateRetencionesProcess(Figures.B7, approved[Figures.B7], discarded[Figures.B7]);
            this.calculateRetencionesProcess(Figures.SU, approved[Figures.SU], discarded[Figures.SU]);
        });
    }

    calculateRetencionesProcess(figure, approved, discarded) {
        this.allSpins.refs
            .filter(spin => spin.figures.filter(fig => fig === figure).length === 2)
            .filter(spin => !spin.prize)
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays('RETENCIONES ' + FigureNames[figure], [approved, discarded]);
        this.stats.retentions.code.push(generateCodeBag(`Retentions_${FigureNames[figure]}`, approved));
    }

    // BONOS

    calculateBonos() {
        this.safeExecution(() => {
            let approved = this.prizes.approved;
            let discarded = this.prizes.discarded;
            this.calculateBonosProcess(Figures.SH, 1, approved[Figures.SH_x1], discarded[Figures.SH_x1]);
            this.calculateBonosProcess(Figures.SH, 2, approved[Figures.SH_x2], discarded[Figures.SH_x2]);
            this.calculateBonosProcess(Figures.SH, 3, approved[Figures.SH_x3], discarded[Figures.SH_x3]);
        });
    }

    calculateBonosProcess(figure, numBonos, approved, discarded) {
        this.allSpins.refs
            .filter(spin => spin.figures.filter(fig => fig === figure).length === numBonos)
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays('BONOS x' + numBonos, [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}_x${numBonos}`, approved));
    }

    // MINIGAMES

    calculateMinigames() {
        this.safeExecution(() => {
            let approved = this.prizes.approved;
            let discarded = this.prizes.discarded;
            this.calculateMinigamesProcess(Figures.SU, approved[Figures.SU], discarded[Figures.SU]);
        });
    }

    calculateMinigamesProcess(figure, approved, discarded) {
        this.allSpins.refs
            .filter(spin => spin.figures.filter(fig => fig === figure).length === 3)
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays('MINIGAME', [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}`, approved));
    }

    // COMMON

    getId(x, y, z) {
        return x + '-' + y + '-' + z;
    }

    normalize(position) {
        let size = this.config.reels[SystemConstants.Reel_1].length;
        if (position < 0) {
            return this.normalize(size - position);
        } else {
            return (position % size);
        }
    }

    isBeautiful(spin) {
        // No prizes > 20 (minigames, G7, R7, B7, 3xBONOS) over line
        if (!this.acceptedPrizeProximity(this.rollBackAllReels(spin))) {
            return false;
        }
        // No prizes > 20 (minigames, G7, R7, B7, 3xBONOS) below line
        if (!this.acceptedPrizeProximity(this.rollForwardAllReels(spin))) {
            return false;
        }
        return true;
    }

    fitsInPool(spin, advancementSpin) {
        // No prized spins have some many occurrences that have to be filtered out
        if (!spin.prize) {
            if (Math.random() > noPrizeAcceptancePercentage) {
                return false;
            }
        }
        return true;
    }

    acceptedPrizeProximity(spin) {
        if (!spin.prize) {
            return true;
        }
        if ((spin.prize.type === SystemConstants.Bonos && spin.prize.value > 5)
            || (spin.prize.type === SystemConstants.Coins && spin.prize.value > 20)
            || (spin.prize.type === SystemConstants.Minigame)) {
            return false;
        }
        return true;
    }

    repeatRollBackReel(reel, spin, times) {
        let currentStep = spin;
        for (let i = 0; i < times; i++) {
            currentStep = this.rollBackReel(reel, currentStep);
        }
        return currentStep;
    }

    rollBackAllReels(spin, numPositions = 1) {
        return this.allSpins[this.getId(this.normalize(spin.positions[SystemConstants.Reel_1] - numPositions), this.normalize(spin.positions[SystemConstants.Reel_2] - numPositions), this.normalize(spin.positions[SystemConstants.Reel_3] - numPositions))];
    }

    rollForwardAllReels(spin, numPositions = 1) {
        return this.allSpins[this.getId(this.normalize(spin.positions[SystemConstants.Reel_1] + numPositions), this.normalize(spin.positions[SystemConstants.Reel_2] + numPositions), this.normalize(spin.positions[SystemConstants.Reel_3] + numPositions))];
    }

    rollBackReel(reel, spin) {
        let posR1 = reel === SystemConstants.Reel_1 ? this.normalize(spin.positions[SystemConstants.Reel_1] - 1) : spin.positions[SystemConstants.Reel_1];
        let posR2 = reel === SystemConstants.Reel_2 ? this.normalize(spin.positions[SystemConstants.Reel_2] - 1) : spin.positions[SystemConstants.Reel_2];
        let posR3 = reel === SystemConstants.Reel_3 ? this.normalize(spin.positions[SystemConstants.Reel_3] - 1) : spin.positions[SystemConstants.Reel_3];
        return this.allSpins[this.getId(posR1, posR2, posR3)];
    }

    rollForwardReel(reel, spin) {
        let posR1 = reel === SystemConstants.Reel_1 ? this.normalize(spin.positions[SystemConstants.Reel_1] + 1) : spin.positions[SystemConstants.Reel_1];
        let posR2 = reel === SystemConstants.Reel_2 ? this.normalize(spin.positions[SystemConstants.Reel_2] + 1) : spin.positions[SystemConstants.Reel_2];
        let posR3 = reel === SystemConstants.Reel_3 ? this.normalize(spin.positions[SystemConstants.Reel_3] + 1) : spin.positions[SystemConstants.Reel_3];
        return this.allSpins[this.getId(posR1, posR2, posR3)];
    }

    havePrize(spin) {
        return !!spin.prize;
    }

    calculatePrize(figures) {
        // Minigame
        if (figures.filter(fig => fig === this.config.minigame).length === 3) {
            return { 
                type: SystemConstants.Minigame, 
                figure: this.config.minigame
            };
        }
        // Line prize
        if (figures[0] === figures[1] && figures[0] === figures[2]) {
            return { 
                type: SystemConstants.Coins, 
                value: this.config.paytable[figures[0]][0],
                figure: figures[0]
            };
        }
        // Bonos
        let bonos = figures.filter(fig => fig === this.config.bonos).length;
        if (bonos > 0) {
            return { 
                type: SystemConstants.Bonos, 
                value: this.config.paytable[this.config.bonos][bonos - 1], 
                figure: this.config.bonos
            };
        }
        // No prize
        return null;
    }

    printRawArrays(title, results) {
        console.log('===== ' + title + ' =====');
        results.forEach(result => {
            console.log(result.map(x => x));
        });
    }

    printResult(result) {
        console.log(result);
    }

    safeExecution(handler) {
        if (!this.isProcessing) {
            this.lockProcess(handler);
        }
    }

    lockProcess(handler) {
        this.isProcessing = true;
        handler();
        this.isProcessing = false;
    }
}