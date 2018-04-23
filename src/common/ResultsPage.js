import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';
import MapView, { AnimatedRegion, Animated  } from 'react-native-maps';
import axios from 'react-native-axios';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class ResultsPage extends Component {

    state = {
        userPosition: { // initial values
            latitude: 37.33233141,
            longitude: -122.0312186,
        },
        mapPosition: new AnimatedRegion({ // initial values
            latitude: 37.33233141,
            longitude: -122.0312186,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }),
        markerPosition: new AnimatedRegion({
            latitude: 0,
            longitude: 0,
        }),
        restaurantInfo: {
            name: '',
            latitude: 0,
            longitude: 0,
            rating: '',
            category: '',
        },
        searching: false,

    }


    fetchAPI () {
        var lat = this.state.userPosition.latitude;
        var lon = this.state.userPosition.longitude;
        axios.get('http://wainnakel.com/api/v2/Generate.php',
            {
                params: {
                    'lat': lat,
                    'lon': lon,
                    'lang': 'en',
                    'distance': 5000,
                }
            })
            .then( response => {
                console.log(response);
                if(typeof response.data.name === "string") { // to make sure the response is valid

                    this.setState({mapPosition: new AnimatedRegion({
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        })});

                    const newCoordinate = {
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                    };

                    this.state.markerPosition.timing(newCoordinate).start();

                    this.setState({restaurantInfo: {
                            name: response.data.name,
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                            rating: response.data.rate,
                            category: response.data.cateName,
                        }
                    });

                    this.setState({searching: false});
                } else {
                    this.fetchAPI(); // to recover from API errors.
                    this.setState({searching: false});
                }

            })
            .catch( error => {
                console.log(error);
            });



    }

    watchID: ?number = null;

    componentWillMount() {
        // getting current user's location

        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);
            console.log(lat+'  '+ long);
            var initialRegion = {
                latitude: lat,
                longitude: long,
            };

            this.setState({userPosition: initialRegion});
            // this.setState({markerPosition: initialRegion});

        },
            (error) => console.log(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        this.fetchAPI();
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var lastRegion = {
                latitude: lat,
                longitude: long,
            }

            this.setState({userPosition: lastRegion});
            // this.setState({markerPosition: lastRegion});

        });


    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }


    suggestPressed() {

        this.setState({searching: true});
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

    renderSuggestButton() {
        if (this.state.searching) {
            return (
                <View
                    style={styles.buttonStyles}
                    onPress={this.suggestPressed.bind(this)}
                >
                    {<Image source={require('../img/30.gif')} />}
                </View>
            )
        }

        return (
            <TouchableOpacity
                style={styles.buttonStyles}
                onPress={this.suggestPressed.bind(this)}
            >
                <Text style={styles.buttonTextStyles}>Suggest another</Text>
            </TouchableOpacity>
        )
    }

    renderTopBar() {
        return (
            <View style={styles.topBar}>
                <View style={styles.topBarTitle}>
                    <Text style={styles.topBarText}>Wain Nakel</Text>
                    <Image source={require('../img/logo.png')}
                           style={styles.topBarLogo}
                    />
                </View>
                <TouchableOpacity style={styles.historyButton}>
                    <Image source={require('../img/history-clock-button.png')}
                           style={styles.topBarIcons}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                    <Image source={require('../img/menu.png')}
                           style={styles.topBarIcons}
                    />
                </TouchableOpacity>
            </View>

        )
    }

    renderMap() {
        return (
            <MapView.Animated
                style={styles.viewStyles}
                region={this.state.mapPosition}
            >
                <MapView.Marker.Animated
                    coordinate={this.state.markerPosition}
                    ref={marker => { this.marker = marker; }}
                    image={require('../img/marker.png')}

                >

                </MapView.Marker.Animated>

            </MapView.Animated>
        )
    }

    render() {
        return (
            <View style={styles.viewStyles}
            >
                {this.renderMap()}
                {this.renderTopBar()}
                <View style={styles.infoSection}>
                    <Text style={styles.restaurantName}>{this.state.restaurantInfo.name}</Text>
                    {this.renderCategoryAndRating()}
                    {this.renderIcons()}
                </View>
                {this.renderSuggestButton()}

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
        color: "#fff",
        fontFamily: 'CoconNextArabic-Light',
        fontSize: 16,
    },
    topBar: {
        width: width,
        height: 55,
        backgroundColor: "rgba(57,124,140,0.9)",
        position: "absolute",
        justifyContent: 'flex-end',

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
        fontFamily: 'CoconNextArabic-Light'

    },
    categoryAndRating: {
        alignSelf: 'center',
        color: "#5b5b5b",
        fontSize: 15,
        top: 30,
        fontFamily: 'CoconNextArabic-Light'

    },
    iconsView: {
        alignSelf: 'center',
        width: width -80,
        height: 30,
        flexDirection: 'row',
        top: 110,
        position: 'absolute',
        justifyContent: 'space-between',
    },
    topBarLogo: {
        alignSelf: 'center',
        width: 20,
        height: 23,
    },
    topBarText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 18,
        marginRight: 5,
        fontFamily: 'CoconNextArabic-Light'

    },
    topBarTitle: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 5,
    },
    historyButton: {
        position: 'absolute',
        left:7,
        bottom: 9,
    },
    menuButton: {
        position: 'absolute',
        left: width-27,
        bottom: 9,
    },
    topBarIcons: {
        width: 17,
        height: 17,
    },

}

