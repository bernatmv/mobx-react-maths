import React from 'react';
import {Figures, FigureNames} from '../../config/appConfig';
import Divider from 'material-ui/Divider';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import * as styles from '../appContainer.css';

export default class SpinBagCard extends React.Component {
    buildStats(title, key,approvedNumber, approvedPercentage, discardedNumber) {
        return <div key={key}>
                <Divider />
                <p><b>{title}</b></p>
                <p>Approved: <b>{approvedNumber}</b> ({approvedPercentage}%)</p>
                <p>Discarded: {discardedNumber}</p>
            </div>;
    }

    render() {
        let stats = this.props.stats;
        let statsList = stats.approved
                        .map((spins, index) => {
                            if (spins.length) {
                                return spins.map((advancements, i) => {
                                    return (advancements > 0)
                                        ? this.buildStats(`Avances ${FigureNames[index]}_x${i + 1}`, (index * 100) + i, stats.approved[index][i], Math.ceil((stats.approved[index][i]/(stats.approved[index][i] + stats.discarded[index][i]))*100), stats.discarded[index][i])
                                        : null;
                                });
                            } else {
                                return (spins > 0)
                                    ? this.buildStats(FigureNames[index], index, stats.approved[index], Math.ceil((stats.approved[index]/(stats.approved[index] + stats.discarded[index]))*100), stats.discarded[index])
                                    : null;
                            }
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