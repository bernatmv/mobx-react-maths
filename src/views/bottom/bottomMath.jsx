import React from 'react';
import {observer} from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';

@observer
export default class BottomMath extends React.Component {
    calculateSpins = () => {
        this.props.store.calculateAllSpins();
    };

    render() {
        let spins = this.props.store.allSpins.map(spin => 
                    <ListItem
                        primaryText={spin.positions[0] + ' - ' + spin.positions[1] + ' - ' + spin.positions[2]}
                        secondaryText={spin.figures[0] + ',' + spin.figures[1] + ',' + spin.figures[2] + ' => ' + spin.prize}
                    />);
        let calculateButton = !this.props.store.isProcessing 
                    ? <RaisedButton label="Calculate" onTouchTap={this.calculateSpins} />
                    : <div>Calculating...</div>;

        return (
            <div className={styles.container}>
                <h2 className={styles.headline}>Calculate all spins</h2>
                {calculateButton}
                
                <List>
                    <Subheader>Calculate all spins</Subheader>
                    {spins}
                </List>
            </div>
        );
    }
}