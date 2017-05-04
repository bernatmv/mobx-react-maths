import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as styles from './styles.css';

import {mathStore} from './appContainer';
import AppContainer from './views/appContainer';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider>
        <div className={styles.body}>
            <AppContainer store={mathStore} />
            <DevTools />
        </div>
    </MuiThemeProvider>,
    document.getElementById('root')
);