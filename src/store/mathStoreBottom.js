import {observable} from 'mobx';
import {appConfigBottom} from '../config/appConfig';
import EventConstants from '../common/constants/eventConstants';

export default class MathStoreBottom {
    emitter = null;
    config = appConfigBottom;

    @observable isProcessing = false;
    @observable allSpins = [];

    constructor(emitter) {
        this.emitter = emitter;
        this.emitter.addListener(EventConstants.CalculateAllSpins, () => this.calculateAllSpins());
    }

    calculateAllSpins() {
        this.safeExecution(() => this.calculateAllSpinsProcess());
    }

    calculateAllSpinsProcess() {
        this.allSpins = [];
        let lengthR1 = this.config.reels[0].length;
        let lengthR2 = this.config.reels[1].length;
        let lengthR3 = this.config.reels[2].length;

        for (let x = 0; x < lengthR1; x++) {
            for (let y = 0; y < lengthR2; y++) {
                for (let z = 0; z < lengthR3; z++) {
                    this.allSpins.push({
                        positions: [x, y, z], 
                        figures: [
                            this.config.reels[0][x], 
                            this.config.reels[1][y], 
                            this.config.reels[2][z]
                        ],
                        prize: (this.config.reels[0][x] === this.config.reels[1][y] && this.config.reels[0][x] === this.config.reels[2][z]) 
                                ? this.config.paytable[this.config.reels[0][x]][0] : 0
                    });
                }            
            }            
        }
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