import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {white} from 'material-ui/styles/colors';
import * as styles from './styles.css';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();


ReactDOM.render(
    <MuiThemeProvider>
        <div className={styles.body}>
            <FontIcon className="material-icons" color={white}>home</FontIcon>
            Hi!
        </div>
    </MuiThemeProvider>,
    document.getElementById('root')
);