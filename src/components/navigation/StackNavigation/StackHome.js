import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    TouchableOpacity,
    Image,
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { List, Card, IconButton } from 'react-native-paper';
import { getPlaces, getPlaceDetails } from '../../../api/ApiGoogle';
import PlaceDetailComponent from './PlaceDetailComponent';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const StackHome = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('StackAccount')}
                    >
                        <View
                            style={{
                                backgroundColor: '#24EF2C',
                                borderRadius: 23,
                                padding: 2,
                                marginRight: 3,
                            }}
                        >
                            <Image
                                source={require('../../../assets/person1.jpeg')}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: '#E0E0E0',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name='Home'
                children={() => <HomeScreen navigation={navigation} />}
                options={{
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name='PlaceDetail'
                component={PlaceDetailComponent}
                options={({ route }) => ({
                    title: 'Detalles',
                })}
            />
        </Stack.Navigator>
    );
};

const HomeScreen = ({ navigation }) => {
    const [places, setPlaces] = useState([]);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { status } = await Permissions.askAsync(Permissions.LOCATION);

                if (status === 'granted') {
                    const currentLocation = await Location.getCurrentPositionAsync({});
                    setLocation(currentLocation.coords);
                } else {
                    console.warn('Permiso de ubicación denegado');
                }
            } catch (error) {
                console.error('Error al obtener la ubicación:', error);
            }
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        if (location) {
            const radius = 1000;
            const types = 'restaurant';
            const query = 'food';
            const region = 'mx:qro';
            const maxResults = 10;

            const fetchData = async () => {
                try {
                    const response = await getPlaces(
                        `${location.latitude},${location.longitude}`,
                        radius,
                        types,
                        query,
                        region,
                        maxResults
                    );

                    const detailedPlaces = await Promise.all(
                        response.results.map(async (place, index) => {
                            const details = await getPlaceDetails(place.place_id);
                            return {
                                id: `${place.place_id}_${index}`,
                                name: place.name,
                                detail: details.formatted_address,
                                reviewCount: details.user_ratings_total,
                            };
                        })
                    );

                    setPlaces(detailedPlaces);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [location]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {places.map((place) => (
                <TouchableOpacity
                    key={place.id}
                    onPress={() =>
                        navigation.navigate('PlaceDetail', { place })
                    }
                >
                    <Card key={place.id} style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                <IconButton
                                    icon='hamburger'
                                    size={60}
                                    marginStart={-9}
                                    disabled
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{place.name}</Text>
                                <Text style={styles.detail}>
                                    Reseñas: {place.reviewCount} | Dirección:{' '}
                                    {place.detail}
                                </Text>
                            </View>
                            <List.Icon
                                icon='chevron-right'
                                color='#000'
                                style={styles.rightArrowIcon}
                            />
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        padding: 14,
    },
    textContainer: {
        marginStart: 5,
        width: 220,
        marginTop: -20,
    },
    card: {
        marginBottom: 15,
        height: 160,
        width: 352,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#DAE4F1',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: 80,
        height: 160,
        justifyContent: 'center',
        marginRight: 5,
        marginTop: -16,
        marginLeft: -20,
        paddingVertical: 5,
    },
    title: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        color: '#000',
        fontSize: 14,
    },
    detail: {
        color: '#000',
        fontSize: 12,
        marginTop: 15,
    },
    rightArrowIcon: {
        marginLeft: 'auto',
    },
});

export default StackHome;
