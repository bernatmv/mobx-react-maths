import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCard from '../components/spinBagCard';
import ProgressCard from '../components/progressCard';

@observer
export default class BottomMath extends React.Component {
    calculateSpins = () => {
        this.props.emitter.emit(EventConstants.CalculateAll);
    };

    render() {
        let store = this.props.store;
        return (
            <div className={styles.container}>
                <ProgressCard
                    title={'Calculate all spins'}
                    action={this.calculateSpins}
                    step={store.stats.step}
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCard
                    title={'Prizes'}
                    step={store.stats.prizes.step}
                    />

                <SpinBagCard
                    title={'Retentions'}
                    step={store.stats.retentions.step}
                    />

                <SpinBagCard
                    title={'Advancements'}
                    step={store.stats.advancements.step}
                    />
            </div>
        );
    }
}