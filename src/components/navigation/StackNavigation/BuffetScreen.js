import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Card, IconButton, List } from 'react-native-paper';
import { getPlaces, getPlaceDetails } from '../../../api/ApiGoogle';
import PlaceDetailComponent from './PlaceDetailComponent';

const BuffetScreen = ({ navigation }) => {
    const [buffets, setBuffets] = useState([]);

    useEffect(() => {
        // Simula la ubicación o utiliza una ubicación por defecto
        const location = { latitude: 20.5881, longitude: -100.3893 };

        const fetchData = async () => {
            try {
                const radius = 5000;
                const types = 'restaurant';
                const query = 'buffet';
                const region = 'mx:qro';
                const maxResults = 10;

                const response = await getPlaces(
                    `${location.latitude},${location.longitude}`,
                    radius,
                    types,
                    query,
                    region,
                    maxResults
                );

                const detailedBuffets = await Promise.all(
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

                setBuffets(detailedBuffets);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {buffets.map((buffet) => (
                <TouchableOpacity
                    key={buffet.id}
                    onPress={() =>
                        navigation.navigate('PlaceDetail', { place: buffet })
                    }
                >
                    <Card key={buffet.id} style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                {/* Cambiado el icono a uno más apropiado para buffet */}
                                <IconButton
                                    icon='food-fork-drink'
                                    size={60}
                                    marginStart={-9}
                                    disabled
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{buffet.name}</Text>
                                <Text style={styles.detail}>
                                    Reseñas: {buffet.reviewCount} | Dirección:{' '}
                                    {buffet.detail}
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
    detail: {
        color: '#000',
        fontSize: 12,
        marginTop: 15,
    },
    rightArrowIcon: {
        marginLeft: 'auto',
    },
});

export default BuffetScreen;
