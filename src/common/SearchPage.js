import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';


const { width, height } = Dimensions.get('window');

export default class SearchPage extends Component {


    state = {
        searching: false,
    }

    renderSuggestButton() {
    if (this.state.searching) {
        return (
            <View
                style={styles.buttonStyles}>
                {<Image source={require('../img/loading_dark.gif')}/>}
            </View>
        )
    }

    return (
        <TouchableOpacity
            style={styles.buttonStyles}
            onPress={this.goToSearchPage.bind(this)}

        >
            <Text style={styles.buttonTextStyles}>Suggest</Text>
        </TouchableOpacity>
    )
    }

    goToSearchPage() {
        this.setState({searching: true})
        setTimeout( (() => this.props.navigation.navigate('ResultsPage')) , 30000) // temporary, pretending to be searching!

    }


    render () {
        return (
            <View style={styles.viewStyles}
            >
                {/*temporary solution to Map as background and gradient View over it. */}
                <Image source={require('../img/search.png')}
                       style={styles.bg}
                ></Image>

                {this.renderSuggestButton()}
            </View>
        )
    }
}

const styles = {
    viewStyles: {
        backgroundColor: "#316b78",
        flex: 1,
    },
    buttonStyles: {
        width: 250,
        height: 45,
        backgroundColor: "#fff",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: height-200,
        left: (width-250)/2,
    },
    buttonTextStyles: {
        color: "#316b78",
        fontFamily: 'CoconNextArabic-Light',
        fontSize: 16,
    },
    bg: {
        width: '100%',
        height: '100%',
    }
};