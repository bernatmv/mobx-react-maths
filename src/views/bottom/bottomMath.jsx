import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';

@observer
export default class BottomMath extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <h2 className={styles.headline}>Tab One</h2>
                <p>This is tab one</p>
            </div>
        );
    }
}