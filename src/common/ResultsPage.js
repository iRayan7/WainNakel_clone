import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

export default class ResultsPage extends Component {

    render() {
        return (
            <View style={styles.viewStyles}>
                <MapView
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </View>
        )
    }
}

const styles = {
    viewStyles: {
        backgroundColor: "red",
        flex: 1,
    },
}