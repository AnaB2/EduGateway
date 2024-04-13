import React, { useState } from 'react';
import {View, Text, ScrollView, TextInput, Button} from 'react-native';
import { signUp } from './Api';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const handleSubmit = async () => {
        try {
            const userData = {
                username: username,
                email: email,
                password: password
            };

            await signUp(userData);
            setSignUpSuccess(true);
        } catch (error) {
            console.error("Failed to signup:", error);
        }
    };

    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Registro</Text>
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
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
                <Button
                    onPress={handleSubmit}
                    title="Registrarse"
                    color="#841584"
                />
                {signUpSuccess && <Text style={{ marginTop: 20 }}>Usuario registrado exitosamente</Text>}
            </View>
        </ScrollView>
    );
};

export default Signup;



