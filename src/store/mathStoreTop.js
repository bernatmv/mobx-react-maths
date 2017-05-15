import {observable} from 'mobx';
import {appConfigTop, FiguresTop as Figures, FigureTopNames as FigureNames, PrizesTop as Prizes, PrizesTopNames as PrizesNames} from '../config/appConfig';
import EventConstants from '../common/constants/eventConstants';
import SystemConstants from '../common/constants/systemConstants';
import {generateCodeBag, generateAdvancementsCodeBag} from './helpers/codeGenerator';

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
        this.emitter.addListener(EventConstants.CalculateAll, () => this.calculateAll());
        this.emitter.addListener(EventConstants.CalculateAllSpins, () => this.calculateAllSpins());
        this.emitter.addListener(EventConstants.CalculatePrizes, () => this.calculatePrizes());
        this.emitter.addListener(EventConstants.CalculateBonos, () => this.calculateBonos());
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
            this.calculateNoPrize(approved[Prizes.NO_PRIZE], discarded[Prizes.NO_PRIZE]);
            this.calculatePrizesProcess(Figures.SHIP, 1, approved[Prizes.SHIP_x1], discarded[Prizes.SHIP_x1]);
            //TODO: finish
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
        //TODO: refactor generate code to take into account the new prize structure
        this.stats.prizes.code.push(generateCodeBag(`Prizes_${FigureNames[figure]}_x${appearances}`, approved));
    }

    // BONOS

    calculateBonos() {//TODO: change
        this.safeExecution(() => {
            let approved = this.prizes.approved;
            let discarded = this.prizes.discarded;
            this.calculateBonosProcess(Figures.SHIP, 1, approved[Figures.SHIP_x1], discarded[Figures.SHIP_x1]);
            this.calculateBonosProcess(Figures.SHIP, 2, approved[Figures.SHIP_x2], discarded[Figures.SHIP_x2]);
            this.calculateBonosProcess(Figures.SHIP, 3, approved[Figures.SHIP_x3], discarded[Figures.SHIP_x3]);
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
        //TODO: no 3 minigames o 3 jackpots of the same kind in the grid without a prize
        //TODO: no line prizes of different figures
        //TODO: no line prize and bonos prize
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
            if (lineOfSameFigure([
                    grid[line[0]],
                    grid[line[1]],
                    grid[line[2]]
                ])) {
                prizes.push({positions: line, figure: grid[line[0]], type: SystemConstants.Coins, value: this.config.paytable[grid[line[0]]][0]});
            }
        });
        // Bonos
        let bonos = grid.find(figure => figure === this.config.bonos).length;
        if (bonos > 0) {
            let bonosPositions = grid.reduce((prev, curr, currIndex) => curr === this.config.bonos ? [...prev, currIndex] : prev, []);
            prizes.push({positions: bonosPositions, figure: this.config.bonos, type: SystemConstants.Bonos, value: this.config.paytable[this.config.bonos][bonos]});
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