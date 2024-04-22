import React from 'react';
import {View, Text, StyleSheet, Pressable, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Index = () => {
    const navigation = useNavigation();

    const handleSignupUser = () => {
        navigation.navigate('SignupUser');
    };

    const handleSignupInstitution = () => {
        navigation.navigate('SignupInstitution');
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={handleSignupUser}>
                <Text style={styles.buttonText}>Registrarse como Usuario</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleSignupInstitution}>
                <Text style={styles.buttonText}>Registrarse como Institución</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('LoginUser')}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#afafb0',
    },
    button: {
        backgroundColor: '#841584',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginVertical: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Index;

