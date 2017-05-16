import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCardBottom from '../components/spinBagCardBottom';
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

                <SpinBagCardBottom
                    title={'Prizes'}
                    stats={store.stats.prizes}
                    />

                <SpinBagCardBottom
                    title={'Retentions'}
                    stats={store.stats.retentions}
                    />

                <SpinBagCardBottom
                    title={'Advancements'}
                    stats={store.stats.advancements}
                    />
            </div>
        );
    }
}