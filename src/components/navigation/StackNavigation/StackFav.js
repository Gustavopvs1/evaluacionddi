import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card, IconButton, List } from 'react-native-paper';
import { getFavoriteApi } from '../../../api/favoritos';
import PlaceDetailComponent from './PlaceDetailComponent';
import { getPlaces, getPlaceDetails } from '../../../api/ApiGoogle';// Ajusta la ruta según sea necesario

const StackFav = ({ navigation }) => {
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
                name='Favoritos'
                component={FavScreen}
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

const FavScreen = ({ navigation }) => {
    const [favoritos, setFavoritos] = useState([]);
    const [lugaresFavoritos, setLugaresFavoritos] = useState([]);

    useEffect(() => {
        const obtenerFavoritos = async () => {
            try {
                const favoritosStorage = await getFavoriteApi();
                setFavoritos(favoritosStorage);

                // Obtén los detalles de los lugares favoritos
                const detailedPlaces = await Promise.all(
                    favoritosStorage.map(async (place, index) => {
                        const details = await getPlaceDetails(place.place_id);
                        return {
                            id: `${place.place_id}_${index}`,
                            name: place.name,
                            detail: details.formatted_address,
                            reviewCount: details.user_ratings_total,
                        };
                    })
                );

                setLugaresFavoritos(detailedPlaces);
            } catch (error) {
                console.log(error);
            }
        };

        obtenerFavoritos();
    }, []);

    return (
      <ScrollView contentContainerStyle={styles.container}>
          {favoritos.map((place) => (
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
                                  icon='heart'
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

export default StackFav;