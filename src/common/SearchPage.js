import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';




export default class SearchPage extends Component {

    render () {
        return (
            <View style={styles.viewStyles}>
                <TouchableOpacity
                    style={styles.buttonStyles}
                    onPress={() => this.props.navigation.navigate('ResultsPage')}>


                    <Text style={styles.buttonTextStyles}>Suggest</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    viewStyles: {
        backgroundColor: "red",
        flex: 1,
    },
    buttonStyles: {
        marginTop: 450,
        alignSelf: "center",
        width: 200,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonTextStyles: {
    }
};