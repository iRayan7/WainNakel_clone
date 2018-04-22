import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';
import axios from 'react-native-axios';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class ResultsPage extends Component {

    state = {
        mapPosition: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
        },
        markerPosition: {
            latitude: 37.78825,
            longitude: -122.4324,
        },
        restaurantInfo: {
            name: '',
            latitude: 0,
            longitude: 0,
            rating: '',
            category: '',
        }
    }

    watchID: ?number = null;

    fetchAPI () {
        axios.get('http://wainnakel.com/api/v2/Generate.php',
            {
                params: {
                    'lat': 37.392252773939,
                    'lon': -122.07848141439,
                    'lang': 'en',
                    'distance': 5000,
                }
            })
            .then( response => {
                console.log(response);
                if(typeof response.data === "object") {

                    this.setState({mapPosition: new AnimatedRegion({
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        })});
                    this.setState({markerPosition: {
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                        }});
                    this.setState({restaurantInfo: {
                            name: response.data.name,
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                            rating: response.data.rate,
                            category: response.data.cateName,
                        }

                    })

                } else {
                    this.fetchAPI()
                }

            })
            .catch( error => {
                console.log(error);
            });

        // var body = {
        //     'lat': 37.392252773939,
        //     'lon': -122.07848141439,
        //     'lang': 'ar',
        //     'distance': 5000,
        // };
        // fetch('http://wainnakel.com/api/v2/Generate.php?lat=37.36424153&lon=-122.12374717&lang=ar&distance=5000.0')
        //     .then(response => response.json())
        //     .then( (responseData) => { console.log(responseData); } )
        //     .catch(error => console.log(error));


    }



    componentWillMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            this.setState({mapPosition: initialRegion});
            this.setState({markerPosition: initialRegion});

        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var lastRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }

            this.setState({mapPosition: lastRegion});
            this.setState({markerPosition: lastRegion});

        });
        this.fetchAPI();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }



    suggestPressed() {
        // this.setState({mapPosition: {
        //         latitude: 37.78825,
        //         longitude: -122.4324,
        //         latitudeDelta: LATITUDE_DELTA,
        //         longitudeDelta: LONGITUDE_DELTA,
        //     }});
        // this.setState({markerPosition: {
        //         latitude: 37.78825,
        //         longitude: -122.4324,
        //     }});
        this.fetchAPI();
    }

    renderIcons() {
        return (
            <View style={styles.iconsView}>
                <TouchableOpacity
                    onPress={() => Linking.openURL('http://maps.google.com/maps?q='+this.state.restaurantInfo.latitude+','+this.state.restaurantInfo.longitude)}
                >
                    <Image
                        style={{width: 20, height: 20}}
                        source={require('../img/google-maps.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        style={{width: 20, height: 22}}
                        source={require('../img/16410.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        style={{width: 20, height: 20}}
                        source={require('../img/big-heart.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        style={{width: 20, height: 20}}
                        source={require('../img/share-post-symbol.png')}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderCategoryAndRating() {
        if( this.state.restaurantInfo.rating != '')
            return (
                <Text style={styles.categoryAndRating}>
                    {this.state.restaurantInfo.category != ''
                        ? this.state.restaurantInfo.category + ' - ' : ''}
                    {this.state.restaurantInfo.rating}<Text style={{fontSize: 10, color: "#919191"}}>/10</Text>
                </Text>
            )
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <MapView
                    style={styles.viewStyles}
                    region={this.state.mapPosition}
                >
                    <MapView.Marker
                        coordinate={this.state.markerPosition}
                    >

                    </MapView.Marker>
                </MapView>
                <View style={styles.topBar}>

                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.restaurantName}>{this.state.restaurantInfo.name}</Text>
                    {this.renderCategoryAndRating()}
                    {this.renderIcons()}
                </View>
                <TouchableOpacity
                    style={styles.buttonStyles}
                    onPress={() => this.suggestPressed()}
                    >
                    <Text style={styles.buttonTextStyles}>Suggest another</Text>
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
        width: 250,
        height: 45,
        backgroundColor: "rgba(57,124,140,0.9)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: height-90,
        left: (width-250)/2,
    },
    buttonTextStyles: {
        color: "#fff"
    },
    topBar: {
        width: width,
        height: 55,
        backgroundColor: "rgba(57,124,140,0.9)",
        position: "absolute",
    },
    infoSection: {
        top: 55,
        width: width,
        height: 140,
        backgroundColor: "rgba(255,255,255,0.9)",
        position: "absolute",
    },
    restaurantName: {
        alignSelf: 'center',
        color: "rgba(57,124,140,1)",
        fontSize: 25,
        top: 20,

    },
    categoryAndRating: {
        alignSelf: 'center',
        color: "#5b5b5b",
        fontSize: 15,
        top: 30,

    },
    iconsView: {
        alignSelf: 'center',
        width: width -80,
        height: 30,
        flexDirection: 'row',
        top: 110,
        position: 'absolute',
        justifyContent: 'space-between',
    }
}

