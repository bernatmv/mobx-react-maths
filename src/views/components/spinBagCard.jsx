import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';

export default class SpinBagCard extends React.Component {
    render() {
        let calculateButton = !this.props.isProcessing && this.props.spins === 0
                    ? <CardActions>
                        <FlatButton label="Calculate" onTouchTap={this.props.action} />
                    </CardActions>
                    : null;
        let progress = this.props.progress 
                    ? <div>
                        <div>Progress: {this.props.progress}%</div>
                        <LinearProgress mode="determinate" value={this.props.progress} />
                    </div>
                    : null;
        return (
            <Card>
                <CardHeader
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    />
                {calculateButton}
                <CardText>
                    <div>Spins: {this.props.spins}</div>
                    {progress}
                </CardText>
            </Card>
        );
    }
}