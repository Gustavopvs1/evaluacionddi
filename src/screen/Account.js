import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Avatar, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { userController } from '../api/user';
import { getFavoriteApi } from '../api/favoritos';
import { useNavigation } from '@react-navigation/native';
import FavoritesScreen from './Favoritos';

export default function Account() {
    const { logout, user, upDateUser } = useAuth();
    const navigation = useNavigation(); // Obtén el objeto de navegación

    const navigateToChangeProfile = () => {
        // Navegar a la página de cambios de perfil
        navigation.navigate('ChangeProfile');
    };

    const navigateToFavorites = () => {
        // Navegar a la pantalla de favoritos
        navigation.navigate('FavoritesScreen');
    };

    const logoutAlert = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar sesión',
                    onPress: async () => {
                        const pjFavoritos = await getFavoriteApi();
                        const data = {
                            favoritos: pjFavoritos,
                        };
                        await userController.actualizaUser(user.id, data);
                        upDateUser('favoritos', pjFavoritos);
                        logout();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Image
                            source={require('../assets/person1.jpeg')}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.name}>
                        {user.firstname && user.lastname
                            ? `${user.firstname} ${user.lastname}`
                            : user.email}
                        <IconButton
                            icon='open-in-new' // Cambiar a "edit" si es necesario
                            size={22}
                            onPress={navigateToChangeProfile}
                        />
                    </Text>



                    {/* Botón para cerrar sesión */}
                    <Button
                        mode='contained'
                        onPress={logoutAlert}
                        style={styles.button}
                    >
                        Cerrar sesión
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 80,
        marginTop: 30
    },
    title: {
        color: '#000',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    mainContainer: {
        flex: 1,
        paddingTop: 15,
        marginHorizontal: 50,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
        textAlign: 'center',
    },
    button: {
        marginBottom: 20,
        marginTop: 40,
    },
});
