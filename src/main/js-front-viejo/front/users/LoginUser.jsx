import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../auth';

const LoginUser = () => {
    const navigation = useNavigation(); // Obtén el objeto de navegación

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        try {
            const userData = {
                email: email,
                password: password
            };

            await loginUser(userData, navigation);


            setLoginSuccess(true);
            setLoginError('');


        } catch (error) {
            console.error("Failed to login:", error);
            setLoginSuccess(false);
            setLoginError('Correo electrónico o contraseña incorrectos');
        }
    };

    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Inicio de sesión</Text>
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <Pressable
                    onPress={handleSubmit}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#6e6e6e' : '#841584'
                        },
                        {
                            width: '100%',
                            padding: 10,
                            borderRadius: 5
                        }
                    ]}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Iniciar sesión</Text>
                </Pressable>
                {loginError !== '' && <Text style={{ color: 'red', marginTop: 10 }}>{loginError}</Text>}
                {loginSuccess && <Text style={{ marginTop: 10 }}>Inicio de sesión exitoso</Text>}
            </View>
        </ScrollView>
    );
};

export default LoginUser;