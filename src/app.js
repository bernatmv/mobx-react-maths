import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TodoList from './view/todoList';
import {white} from 'material-ui/styles/colors';
import * as styles from './styles.css';
import {observableTodoStore} from './store/todoStore';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();


ReactDOM.render(
    <MuiThemeProvider>
        <div className={styles.body}>
            <TodoList store={observableTodoStore} />
        </div>
    </MuiThemeProvider>,
    document.getElementById('root')
);