import React from 'react';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'material-ui/Tabs';
import TopMath from './top/topMath';
import BottomMath from './bottom/bottomMath';

export default class AppContainer extends React.Component {
    render() {
        return (
            <Tabs>
                <Tab label={'Top Maths'}>
                    <BottomMath store={this.props.store.mathBottom} />
                </Tab>
                <Tab label={'Top Maths'}>
                    <TopMath />
                </Tab>
            </Tabs>
        );
    }
}