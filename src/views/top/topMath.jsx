import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCardTop from '../components/spinBagCardTop';
import ProgressCardTop from '../components/progressCardTop';

@observer
export default class TopMath extends React.Component {
    calculateSpins = () => {
        this.props.emitter.emit(EventConstants.CalculateAllTop);
    };

    render() {
        let store = this.props.store;
        return (
            <div className={styles.container}>
                <ProgressCardTop
                    title={'Calculate all spins'}
                    action={this.calculateSpins}
                    step={store.stats.step}
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCardTop
                    title={'Prizes'}
                    stats={store.stats.prizes}
                    />
            </div>
        );
    }
}