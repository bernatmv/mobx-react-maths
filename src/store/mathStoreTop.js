import {observable} from 'mobx';
import {appConfigTop, FiguresTop as Figures, FigureTopNames as FigureNames, PrizesTop as Prizes, PrizesTopNames as PrizesNames} from '../config/appConfig';
import EventConstants from '../common/constants/eventConstants';
import SystemConstants from '../common/constants/systemConstants';
import {generateCodeBag} from './helpers/codeGeneratorTop';

const initialPositions = [0,0,0];
const noPrizeAcceptancePercentage = 0.25;

export default class MathStoreTop {
    emitter = null;
    config = appConfigTop;
    // LOCK
    @observable isProcessing = false;
    // STATS
    @observable stats = {
        step: 0,
        all: 0,
        prizes: {
            code: [],
            approved: new Array(23),
            discarded: new Array(23)
        }
    };
    // ALL SPINS
    allSpins = { 
        refs: [],
        count: 0 
    };
    prizes = {
        approved: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ],
        discarded: [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ]
    };

    constructor(emitter) {
        this.emitter = emitter;
        this.emitter.addListener(EventConstants.CalculateAllTop, () => this.calculateAll());
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
        this.prizes.approved.forEach((spins, index) => {
            this.stats.prizes.approved[index] = spins.length;
            this.stats.prizes.discarded[index] = this.prizes.discarded[index].length;
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
                    let grid = [
                        this.config.reels[0][this.normalize(x-1)], 
                        this.config.reels[0][x], 
                        this.config.reels[0][this.normalize(x+1)], 
                        this.config.reels[1][this.normalize(y-1)], 
                        this.config.reels[1][y], 
                        this.config.reels[1][this.normalize(y+1)], 
                        this.config.reels[2][this.normalize(z-1)], 
                        this.config.reels[2][z], 
                        this.config.reels[2][this.normalize(z+1)]
                    ];
                    spin = {
                        positions: [x, y, z], 
                        grid: grid,
                        prize: this.calculatePrize(grid)
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
            this.calculateNoPrize(approved[Prizes.TOP_NO_PRIZE], discarded[Prizes.TOP_NO_PRIZE]);
            this.calculatePrizesProcess(Figures.BIRD, 1, approved[Prizes.BIRD_x1], discarded[Prizes.BIRD_x1]);
            this.calculatePrizesProcess(Figures.BIRD, 2, approved[Prizes.BIRD_x2], discarded[Prizes.BIRD_x2]);
            this.calculatePrizesProcess(Figures.BIRD, 3, approved[Prizes.BIRD_x3], discarded[Prizes.BIRD_x3]);
            this.calculatePrizesProcess(Figures.BIRD, 4, approved[Prizes.BIRD_x4], discarded[Prizes.BIRD_x4]);
            this.calculatePrizesProcess(Figures.BIRD, 5, approved[Prizes.BIRD_x5], discarded[Prizes.BIRD_x5]);
            this.calculatePrizesProcess(Figures.LEOPARD, 1, approved[Prizes.LEOPARD_x1], discarded[Prizes.LEOPARD_x1]);
            this.calculatePrizesProcess(Figures.LEOPARD, 2, approved[Prizes.LEOPARD_x2], discarded[Prizes.LEOPARD_x2]);
            this.calculatePrizesProcess(Figures.LEOPARD, 3, approved[Prizes.LEOPARD_x3], discarded[Prizes.LEOPARD_x3]);
            this.calculatePrizesProcess(Figures.LEOPARD, 4, approved[Prizes.LEOPARD_x4], discarded[Prizes.LEOPARD_x4]);
            this.calculatePrizesProcess(Figures.LEOPARD, 5, approved[Prizes.LEOPARD_x5], discarded[Prizes.LEOPARD_x5]);
            this.calculatePrizesProcess(Figures.LADY, 1, approved[Prizes.LADY_x1], discarded[Prizes.LADY_x1]);
            this.calculatePrizesProcess(Figures.LADY, 2, approved[Prizes.LADY_x2], discarded[Prizes.LADY_x2]);
            this.calculatePrizesProcess(Figures.LADY, 3, approved[Prizes.LADY_x3], discarded[Prizes.LADY_x3]);
            this.calculatePrizesProcess(Figures.LADY, 4, approved[Prizes.LADY_x4], discarded[Prizes.LADY_x4]);
            this.calculatePrizesProcess(Figures.LADY, 5, approved[Prizes.LADY_x5], discarded[Prizes.LADY_x5]);
            this.calculatePrizesProcess(Figures.GREEN_GEM, 1, approved[Prizes.GREEN_GEM_x1], discarded[Prizes.GREEN_GEM_x1]);
            this.calculatePrizesProcess(Figures.RED_GEM, 1, approved[Prizes.RED_GEM_x1], discarded[Prizes.RED_GEM_x1]);
            this.calculatePrizesProcess(Figures.BLUE_GEM, 1, approved[Prizes.BLUE_GEM_x1], discarded[Prizes.BLUE_GEM_x1]);
        });
    }

    calculateNoPrize(approved, discarded) {
        this.allSpins.refs
            .filter(spin => spin.prize.length === 0)
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

    calculatePrizesProcess(figure, appearances, approved, discarded) {
        this.allSpins.refs
            .filter(spin => (spin.prize.filter(p => p.figure === figure).length === appearances))
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays(`PRIZES ${FigureNames[figure]}_x${appearances}`, [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}_x${appearances}`, approved));
    }

    // BONOS

    calculateBonos() {
        this.safeExecution(() => {
            let approved = this.prizes.approved;
            let discarded = this.prizes.discarded;
            this.calculateBonosProcess(Figures.SHIP, 1, approved[Prizes.SHIP_x1], discarded[Prizes.SHIP_x1]);
            this.calculateBonosProcess(Figures.SHIP, 2, approved[Prizes.SHIP_x2], discarded[Prizes.SHIP_x2]);
            this.calculateBonosProcess(Figures.SHIP, 3, approved[Prizes.SHIP_x3], discarded[Prizes.SHIP_x3]);
            this.calculateBonosProcess(Figures.RUNE, 1, approved[Prizes.RUNE_x1], discarded[Prizes.RUNE_x1]);
        });
    }

    calculateBonosProcess(figure, appearances, approved, discarded) {
        this.allSpins.refs
            .filter(spin => (spin.grid.filter(f => f === figure).length === appearances))
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
        this.printRawArrays('SCATTER x' + appearances, [approved, discarded]);
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}_x${appearances}`, approved));
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
        //We don't want: 3 jackpots of the same kind in the grid without a prize
        /*
        not to take into account if we are processing a prize for this figure
        if (spin.grid.filter(figure => figure === Figures.BLUE_GEM).length >= 3
            || spin.grid.filter(figure => figure === Figures.RED_GEM).length >= 3
            || spin.grid.filter(figure => figure === Figures.GREEN_GEM).length >= 3) {
            return false;
        }
        */
        //We don't want: prizes of different figures (either line or scatter)
        if (spin.prize.reduce((acc, curr) => acc.includes(curr.figure) ? acc : [...acc, curr.figure], []).length > 1) {
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

    lineOfSameFigure(line, figure = null) {
        let equal =  (line[0] === line[1] && line[0] === line[2]);
        if (figure === null) {
            return equal;
        } else {
            return equal && (line[0] === figure);
        }
    }

    calculatePrize(grid) {
        let prizes = [];
        // Line prize
        this.config.lines.map(line => {
            if (this.lineOfSameFigure([
                    grid[line[0]],
                    grid[line[1]],
                    grid[line[2]]
                ])) {
                if (grid[line[0]] !== this.config.bonos) {
                    prizes.push({positions: line, figure: grid[line[0]], type: SystemConstants.Coins, value: this.config.paytable[grid[line[0]]][0]});
                }
            }
        });
        // Bonos
        let bonos = grid.filter(figure => figure === this.config.bonos).length;
        if (bonos > 0) {
            let bonosPositions = grid.reduce((prev, curr, currIndex) => curr === this.config.bonos ? [...prev, currIndex] : prev, []);
            prizes.push({positions: bonosPositions, figure: this.config.bonos, type: SystemConstants.Bonos, value: this.config.paytable[this.config.bonos][bonos - 1]});
        }
        // Runes
        let runes = grid.filter(figure => figure === Figures.RUNE).length;
        if (runes > 0) {
            let runesPositions = grid.reduce((prev, curr, currIndex) => curr === Figures.RUNE ? [...prev, currIndex] : prev, []);
            prizes.push({positions: runesPositions, figure: Figures.RUNE, type: SystemConstants.Runes, value: this.config.paytable[Figures.RUNE][runes - 1]});
        }
        return prizes;
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