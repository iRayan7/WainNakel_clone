import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, {  } from 'react-native-maps';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class ResultsPage extends Component {

    state = {
        initialPosition: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
        },
        markerPosition: {
            latitude: 37.78825,
            longitude: -122.4324,
        }
    }

    watchID: ?number = null

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            this.setState({initialPosition: initialRegion});
            this.setState({markerPosition: initialRegion});

        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var lastlRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            this.setState({initialPosition: lastlRegion});
            this.setState({markerPosition: lastlRegion});

        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    suggestPressed() {
        this.setState({initialPosition: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }});
        this.setState({markerPosition: {
                latitude: 37.78825,
                longitude: -122.4324,
            }});
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <MapView
                    style={styles.viewStyles}
                    region={this.state.initialPosition}
                >
                    <MapView.Marker
                        coordinate={this.state.markerPosition}
                    >

                    </MapView.Marker>
                </MapView>
                <TouchableOpacity
                    style={styles.buttonStyles}
                    onPress={() => this.suggestPressed()}
                    >
                    <Text style={styles.buttonTextStyles}>Suggest</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    viewStyles: {
        flex: 1,
    },
    buttonStyles: {
        width: 200,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: height-150,
        left: width/4,

    },
    buttonTextStyles: {
    }
}