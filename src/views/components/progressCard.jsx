import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

export default class ProgressCard extends React.Component {
    render() {
        let calculateButton = !this.props.isProcessing
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
                    <Stepper activeStep={this.props.step} orientation="vertical">
                        <Step>
                            <StepLabel>Ready to start</StepLabel>
                            <StepContent>
                                <p>Ready to begin spins calculation</p>
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>All Spins</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Prizes</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Bonos</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Minigames</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Advancements</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Retentions</StepLabel>
                        </Step>
                    </Stepper>
                </CardText>
            </Card>
        );
    }
}