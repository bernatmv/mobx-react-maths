import React from 'react';
import {Figures, FigureNames} from '../../config/appConfig';
import Divider from 'material-ui/Divider';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import * as styles from '../appContainer.css';

export default class SpinBagCard extends React.Component {
    render() {
        let stats = this.props.stats;
        let statsList = stats.approved
                        .map((spins, index) => {
                            return (spins > 0)
                                ? <div key={index}>
                                    <Divider />
                                    <p><b>{FigureNames[index]}</b></p>
                                    <p>Approved: <b>{spins}</b> ({Math.ceil((stats.approved[index]/(stats.approved[index] + stats.discarded[index]))*100)}%)</p>
                                    <p>Discarded: {stats.discarded[index]}</p>
                                </div>
                                : null;
                        });

        return (
            <Card className={styles.card}>
                <CardHeader
                    title={this.props.title}
                    />
                <CardText>
                    <p>Stats</p>
                    <Divider />
                    {statsList}
                </CardText>
            </Card>
        );
    }
}