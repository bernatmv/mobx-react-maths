import React from 'react';
import {Figures, FigureNames} from '../../config/appConfig';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as styles from '../appContainer.css';

export default class SpinBagCardBottom extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

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
                                        ? this.buildStats(`${FigureNames[index]}_A${i + 1}`, (index * 100) + i, stats.approved[index][i], Math.ceil((stats.approved[index][i]/(stats.approved[index][i] + stats.discarded[index][i]))*100), stats.discarded[index][i])
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
                <CardText className={styles.card__text}>
                    <FlatButton label='Show C# code' onTouchTap={this.handleOpen} />
                    <CopyToClipboard 
                        text={stats.code.join('\n\n')}
                        onCopy={this.handleClose}
                        >
                        <FlatButton label='Copy to clipboard' />
                    </CopyToClipboard>
                    <Divider />
                    {statsList}
                </CardText>
                <Dialog
                    title='C# code'
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    <pre>
                        {stats.code.join('\n\n')}
                    </pre>
                </Dialog>
            </Card>
        );
    }
}