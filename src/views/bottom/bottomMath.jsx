import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCard from '../components/spinBagCard';

let MAX_SPINS = 16*16*16;

@observer
export default class BottomMath extends React.Component {
    calculateSpins = () => {
        this.props.emitter.emit(EventConstants.CalculateAllSpins);
    };

    calculatePrizes = () => {
        this.props.emitter.emit(EventConstants.CalculatePrizes);
    };

    calculateAvances = () => {
        this.props.emitter.emit(EventConstants.CalculateAvances);
    };

    calculateRetenciones = () => {
        this.props.emitter.emit(EventConstants.CalculateRetenciones);
    };

    render() {
        let store = this.props.store;
        let progress = Math.ceil((this.props.store.allSpins.count / MAX_SPINS) * 100);
        return (
            <div className={styles.container}>

                {/* ADD GLOBAL PROGRESSION AND GLOBAL BUTTON */}

                {/* REMOVE BUTTON WHEN EACH PROGRESSION IS DONE */}

                <SpinBagCard
                    title={'Calculate all spins'}
                    subtitle={'Full permutation'}
                    action={this.calculateSpins}
                    spins={0}
                    progress={progress}
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCard
                    title={'Premios'}
                    action={this.calculatePrizes} 
                    spins={0} 
                    isProcessing={this.props.store.isProcessing}
                    />

                {/* RESTA PREMIS */}

                <SpinBagCard
                    title={'Avances'}
                    action={this.calculateAvances} 
                    spins={0}
                    progress={0}
                    isProcessing={this.props.store.isProcessing}
                    />

                {/* RESTA AVANCES */}

                <SpinBagCard
                    title={'Retenciones'}
                    action={this.calculateRetenciones}
                    spins={0}
                    isProcessing={this.props.store.isProcessing}
                    />

                {/* RESTA RETENCIONES */}

                <SpinBagCard
                    title={'Bonos'}
                    action={() => {}} 
                    spins={0} 
                    progress={0} 
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCard
                    title={'Minijuego'}
                    action={() => {}} 
                    spins={0} 
                    isProcessing={this.props.store.isProcessing}
                    />
            </div>
        );
    }
}