import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { loginInstitution } from '../Api';

const LoginInstitution = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        try {
            const institutionData = {
                email: email,
                password: password
            };

            await loginInstitution(institutionData);
            setLoginSuccess(true);
            setLoginError('');
        } catch (error) {
            console.error("Failed to login institution:", error);
            setLoginSuccess(false);
            setLoginError('Correo electrónico o contraseña incorrectos');
        }
    };

    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Inicio de sesión para Instituciones</Text>
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Correo Institucional"
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

export default LoginInstitution;