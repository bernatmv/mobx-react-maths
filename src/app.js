import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {white} from 'material-ui/styles/colors';
import * as styles from './styles.css';
import {observableTodoStore} from './store/todoStore';

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

observableTodoStore.addTodo("read MobX tutorial");
observableTodoStore.addTodo("try MobX");
observableTodoStore.todos[0].completed = true;
observableTodoStore.todos[1].task = "try MobX in own project";
observableTodoStore.todos[0].task = "grok MobX tutorial";