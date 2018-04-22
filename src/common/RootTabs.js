import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SearchPage from './SearchPage';
import ResultsPage from './ResultsPage'


const MainStack = StackNavigator({
    ResultsPage: {
        screen: ResultsPage,
        navigationOptions: {
            header: null,
            headerTitleStyle: {
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: 0,
                width: '100%',
                marginRight: 0,
                marginLeft: 0,
            },
            headerRight: (<View />) // To center the text, you have to put something fake in the header to shift the text on the right.
        }
    },
    SearchPage: {
        screen: SearchPage,
        navigationOptions: {
            header: null,
            headerTitleStyle: {
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: 0,
                width: '100%',
                marginRight: 0,
                marginLeft: 0,
            },
            headerRight: (<View />) // To center the text, you have to put something fake in the header to shift the text on the right.
        }
    },

});

export default MainStack;