import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

export default class SpinBagCard extends React.Component {
    render() {
        let calculateButton = !this.props.isProcessing && this.props.spins === 0
                    ? <CardActions>
                        <FlatButton label="Calculate" onTouchTap={this.props.action} />
                    </CardActions>
                    : null;
        return (
            <Card>
                <CardHeader
                    title={this.props.title}
                    />
                {calculateButton}
                <CardText>
                    
                </CardText>
            </Card>
        );
    }
}