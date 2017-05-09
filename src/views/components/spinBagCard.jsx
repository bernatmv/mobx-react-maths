import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import * as styles from '../appContainer.css';

export default class SpinBagCard extends React.Component {
    render() {
        return (
            <Card className={styles.card}>
                <CardHeader
                    title={this.props.title}
                    />
                <CardText>
                    HERE BE STATS
                </CardText>
            </Card>
        );
    }
}