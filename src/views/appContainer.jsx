import React from 'react';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'material-ui/Tabs';
import TopMath from './top/topMath';
import BottomMath from './bottom/bottomMath';

export default class AppContainer extends React.Component {
    render() {
        return (
            <Tabs>
                <Tab label={'Bottom Maths'}>
                    <BottomMath store={this.props.store.mathBottom} emitter={this.props.emitter} />
                </Tab>
                <Tab label={'Top Maths'}>
                    <TopMath store={this.props.store.mathTop} emitter={this.props.emitter} />
                </Tab>
            </Tabs>
        );
    }
}