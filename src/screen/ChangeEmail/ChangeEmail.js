import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { globalStyles } from '../../styles';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa el icono
import { userController } from '../../api/user';

export default function ChangeEmail() {
    const { user, upDateUser } = useAuth();
    const navigation = useNavigation();

    const formik = useFormik({
        initialValues: {
            email: user.email,
        },
        validationSchema: Yup.object({
            email: Yup.string().email(true).required(true),
        }),
        validateOnChange: false,
        onSubmit: async (formData) => {
            try {
                await userController.actualizaUser(user.id, formData);
                upDateUser('email', formData.email);
                navigation.goBack();
                Toast.show('Datos actualizados con éxito.', {
                    position: Toast.positions.CENTER,
                });
            } catch (error) {
                Toast.show('Datos incorrectos.', {
                    position: Toast.positions.CENTER,
                });
            }
        },
    });

    return (
        <View style={styles.container}>
            {/* Sección del icono y nombre */}
            <View style={styles.iconContainer}>
                <Icon marginTop={-35} name='email' size={210} color='#969696' />
            </View>

            {/* Formulario para cambiar el correo electrónico */}
            <View style={{ marginTop: 1 }}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(text) => formik.setFieldValue('email', text)}
                    value={formik.values.email}
                    error={formik.errors.email}
                    underlineColorAndroid='transparent' // Elimina la línea inferior en Android
                />
                <Button
                    mode='contained'
                    style={styles.boton}
                    onPress={formik.handleSubmit}
                    loading={formik.isSubmitting}
                >
                    Guardar Cambios
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        paddingHorizontal: 30,
    },
    iconContainer: {
        alignItems: 'center',
    },
    label: {
        fontSize: 13, // Tamaño de texto más grande para etiquetas
        marginBottom: 5,
        color: '#000',
    },
    textInput: {
        fontSize: 12, // Tamaño de texto más grande para TextInput
        backgroundColor: '#fff',
        borderRadius: 7,
        color: '#969696',
        padding: 0,
        borderWidth: 0.4,
        marginBottom: 10,
    },
    boton: {
        marginVertical: 17,
        padding: 5,
    },
});
