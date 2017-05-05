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

    render() {
        let progress = Math.ceil((this.props.store.allSpins.length / MAX_SPINS) * 100);
        return (
            <div className={styles.container}>
                <SpinBagCard
                    title={'Calculate all spins'}
                    subtitle={'Full permutation'}
                    action={this.calculateSpins}
                    spins={this.props.store.allSpins.length}
                    progress={progress}
                    />
            </div>
        );
    }
}