import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import * as styles from './styles.css';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();


ReactDOM.render(
    <MuiThemeProvider>
        <RaisedButton label="Default" />
        <div className={styles.body}>Hi!</div>
    </MuiThemeProvider>,
    document.getElementById('root')
);