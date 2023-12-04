// FavoritesScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import StackHome from '../components/navigation/StackNavigation/StackHome';
import axios from 'axios';
import { ENV } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';
import { getFavoriteApi } from '../api/favoritos';

export default function FavoritesScreen() {
  const [places, setPlaces] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const fetchPlaces = async (url) => {
    try {
      const response = await axios.get(url);
      const newPlaces = response.data.results;
      setPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);

      if (response.data.info.next) {
        fetchPlaces(response.data.info.next);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlaces(ENV.APIKEY_PLACE);
  }, []);  // Ejecutar solo al montar el componente

  useFocusEffect(
    useCallback(async () => {
      const plFavoritos = await getFavoriteApi();
      setFavoritos(plFavoritos);
    }, [])
  );

  useEffect(() => {
    // Filtrar lugares basados en favoritos cada vez que favoritos cambie
    setPlaces((prevPlaces) => prevPlaces.filter((place) => favoritos.includes(place.id)));
  }, [favoritos]);  // Dependencia de favoritos

  return (
    <StackHome places={places} />
  );
}
