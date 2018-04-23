import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import MainStack from './common/RootTabs';


export default class App extends Component {

    render () {
        StatusBar.setBarStyle('light-content', true);
        return (
            <MainStack />
        )
    }

}