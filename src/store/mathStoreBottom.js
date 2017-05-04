import {observable} from 'mobx';
import {appConfigBottom} from '../config/appConfig';

export default class MathStoreBottom {
    config = appConfigBottom;

    @observable isProcessing = false;
    @observable allSpins = [];

    calculateAllSpins() {
        this.safeExecution(this.calculateAllSpinsProcess);
    }

    calculateAllSpinsProcess() {
        this.allSpins = [];
        let lengthR1 = config.reels[0].length;
        let lengthR2 = config.reels[1].length;
        let lengthR3 = config.reels[2].length;
        for (let x = 0; x < lengthR1; x++) {
            for (let y = 0; y < lengthR2; y++) {
                for (let z = 0; z < lengthR3; z++) {
                    this.allSpins.push({
                        positions: [x, y, z], 
                        figures: [
                            config.reels[0][x], 
                            config.reels[1][y], 
                            config.reels[2][z]
                        ],
                        prize: 0
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