import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCard from '../components/spinBagCard';
import ProgressCardBottom from '../components/progressCardBottom';

@observer
export default class BottomMath extends React.Component {
    calculateSpins = () => {
        this.props.emitter.emit(EventConstants.CalculateAll);
    };

    render() {
        let store = this.props.store;
        return (
            <div className={styles.container}>
                <ProgressCardBottom
                    title={'Calculate all spins'}
                    action={this.calculateSpins}
                    step={store.stats.step}
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCard
                    title={'Prizes'}
                    stats={store.stats.prizes}
                    />

                <SpinBagCard
                    title={'Retentions'}
                    stats={store.stats.retentions}
                    />

                <SpinBagCard
                    title={'Advancements'}
                    stats={store.stats.advancements}
                    />
            </div>
        );
    }
}