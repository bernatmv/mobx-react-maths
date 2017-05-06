import {observable} from 'mobx';
import {appConfigBottom, Figures} from '../config/appConfig';
import EventConstants from '../common/constants/eventConstants';
import SystemConstants from '../common/constants/systemConstants';

const initialPositions = [0,0,0];

export default class MathStoreBottom {
    emitter = null;
    config = appConfigBottom;
    // LOCK
    @observable isProcessing = false;
    // ALL SPINS
    @observable allSpins = { 
        refs: [],
        count: 0 
    };
    // CH
    @observable prizes_CH = [];
    @observable prizes_CH_discarded = [];
    @observable retenciones_CH = [];
    @observable retenciones_CH_discarded = [];
    @observable avances_CH_1 = [];
    @observable avances_CH_1_discarded = [];
    @observable avances_CH_2 = [];
    @observable avances_CH_2_discarded = [];
    @observable avances_CH_3 = [];
    @observable avances_CH_3_discarded = [];
    @observable avances_CH_4 = [];
    @observable avances_CH_4_discarded = [];

    constructor(emitter) {
        this.emitter = emitter;
        this.emitter.addListener(EventConstants.CalculateAllSpins, () => this.calculateAllSpins());
        this.emitter.addListener(EventConstants.CalculatePrizesCH, () => this.calculatePrizesCH());
        this.emitter.addListener(EventConstants.CalculateAvancesCH, () => this.calculateAvancesCH());
        this.emitter.addListener(EventConstants.CalculateRetencionesCH, () => this.calculateRetencionesCH());
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
        this.printResult(this.allSpins);
    }

    // PRIZES

    calculatePrizesCH() {
        this.safeExecution(() => {
            this.allSpins.refs
                .filter(spin => (spin.prize && spin.prize.figure === Figures.CH))
                .map(spin => {
                    if (this.isBeautiful(spin)) {
                        this.prizes_CH.push(spin);
                    } else {
                        this.prizes_CH_discarded.push(spin);
                    }
                });
            this.printRawArrays('PRIZES CH', [this.prizes_CH, this.prizes_CH_discarded]);
        });
    }

    // AVANCES
    /*
        Calcula avances (crea un array de ID/ref sobre el allSpins)
        Que compleixin premi de CH amb aquests avances en cualsevol combinació de reels sense que per mig hi hagi premi igual o més gran, eliminar casos lletjos
        4: 1-4 avances
        Mostrar % vàlids (acceptats i eliminats per lletjos)
    */

    calculateAvancesCH() {
        this.safeExecution(() => {
            this.calculateAvancesProcess(this.prizes_CH, Figures.CH, 1, this.avances_CH_1, this.avances_CH_1_discarded);
            this.calculateAvancesProcess(this.prizes_CH, Figures.CH, 2, this.avances_CH_2, this.avances_CH_2_discarded);
            this.calculateAvancesProcess(this.prizes_CH, Figures.CH, 3, this.avances_CH_3, this.avances_CH_3_discarded);
            this.calculateAvancesProcess(this.prizes_CH, Figures.CH, 4, this.avances_CH_4, this.avances_CH_4_discarded);
            this.printRawArrays(
                'AVANCES CH',
                [
                    this.avances_CH_1,
                    this.avances_CH_1_discarded,
                    this.avances_CH_2,
                    this.avances_CH_2_discarded,
                    this.avances_CH_3,
                    this.avances_CH_3_discarded,
                    this.avances_CH_4,
                    this.avances_CH_4_discarded,
                ]
            );
        });
    }

    /**
     * Sí, la complejidad ciclomátia de esta función es una mierda... si esto fuera medio serio habría que refactorizarlo
     */
    calculateAvancesProcess(spins, figure, avances, approved, discarded) {
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
                    for (let y = 0; y < (avances - x); y++) {
                        currentStep2 = this.repeatRollBackReel(SystemConstants.Reel_2, currentStep1, y);
                        if (y === 0 || !this.havePrize(currentStep2)) {
                            for (let z = 0; z < (avances - x - y); z++) {
                                currentStep3 = this.repeatRollBackReel(SystemConstants.Reel_3, currentStep2, z);
                                if ((avances - x - y - z) === 0) {
                                    if (this.havePrize(currentStep3)) {
                                        if (this.isBeautiful(currentStep3)) {
                                            approved.push(currentStep3);
                                        } else {
                                            discarded.push(currentStep3);
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

    calculateRetencionesCH() {
        this.safeExecution(() => {
            this.calculateRetencionesProcess(Figures.CH, this.retenciones_CH, this.retenciones_CH_discarded);
        });
        this.printRawArrays('RETENCIONES CH', [this.retenciones_CH, this.retenciones_CH_discarded]);
    }

    calculateRetencionesProcess(figure, approved, discarded) {
        this.allSpins.refs
            .filter(spin => spin.figures.filter(fig => fig === figure).length === 2)
            .map(spin => {
                if (this.isBeautiful(spin)) {
                    approved.push(spin);
                } else {
                    discarded.push(spin);
                }
            });
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
        //TODO: check for ugly spins (jackpots on top or below, etc)
        return true;
    }

    repeatRollBackReel(reel, spin, times) {
        let currentStep = spin;
        for (let i = 0; i < times; i++) {
            currentStep = this.rollBackReel(reel, currentStep);
        }
        return currentStep;
    }

    rollBackReel(reel, spin) {
        let posR1 = reel === SystemConstants.Reel_1 ? this.normalize(spin.positions[SystemConstants.Reel_1] - 1) : spin.positions[SystemConstants.Reel_1];
        let posR2 = reel === SystemConstants.Reel_2 ? this.normalize(spin.positions[SystemConstants.Reel_2] - 1) : spin.positions[SystemConstants.Reel_2];
        let posR3 = reel === SystemConstants.Reel_3 ? this.normalize(spin.positions[SystemConstants.Reel_3] - 1) : spin.positions[SystemConstants.Reel_3];
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