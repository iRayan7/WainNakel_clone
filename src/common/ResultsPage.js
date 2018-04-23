import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, Linking, Platform } from 'react-native';
import MapView, { AnimatedRegion, Animated, MapViewAnimated, ProviderPropType,  } from 'react-native-maps';
import axios from 'react-native-axios';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class ResultsPage extends Component {

    state = {
        mapPosition: new AnimatedRegion( {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
        }),
        markerPosition: new AnimatedRegion({
            latitude: 37.78825,
            longitude: -122.4324,
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
                    const newCoordinate = {
                            latitude: response.data.lat,
                            longitude: response.data.lon,
                    };
                    this.state.markerPosition.timing(newCoordinate).start();
                    // this.setState({markerPosition: new AnimatedRegion({
                    //         latitude: response.data.lat,
                    //         longitude: response.data.lon,
                    //     })});
                    this.state.mapPosition.timing(newCoordinate).start();
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
                    this.fetchAPI()
                    this.setState({searching: false});
                }

            })
            .catch( error => {
                console.log(error);
            });



    }

    searchingFinished() {
        this.setState({searching: false});
    }

    componentWillMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var initialRegion = new AnimatedRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            });

            this.setState({mapPosition: initialRegion});
            this.setState({markerPosition: initialRegion});

        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var lastRegion = new AnimatedRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })

            this.setState({mapPosition: lastRegion});
            this.setState({markerPosition: lastRegion});

        });
        this.fetchAPI();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }


    // animate() {
    //     const { mapPosition } = this.state;
    //     const newCoordinate = {
    //         latitude: mapPosition.latitude + ((Math.random() - 0.5) * (LATITUDE_DELTA / 2)),
    //         longitude: mapPosition.longitude + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
    //     };
    //
    //     if (Platform.OS === 'android') {
    //         if (this.marker) {
    //             this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
    //         }
    //     } else {
    //         this.state.markerPosition.timing(newCoordinate).start();
    //     }
    // }

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
        this.setState({searching: true});
        this.fetchAPI();

        // this.animate();

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

    render() {
        return (
            <View style={styles.viewStyles}
            >
                <MapView.Animated
                    // provider={this.props.provider}
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

// ResultsPage.propTypes = {
//     provider: ProviderPropType,
// };

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
    },
    topBarLogo: {
        alignSelf: 'center',
        width: 20,
        height: 23,
    },
    topBarText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 15,
        marginRight: 5,
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
    }
}

