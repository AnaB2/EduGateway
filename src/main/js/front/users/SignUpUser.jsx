import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { signUpUser } from '../Api';

const SignupUser = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const handleSubmit = async () => {
        try {
            const userData = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
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
                    placeholder="Nombre"
                    value={firstName} // Usar firstName como valor
                    onChangeText={text => setFirstName(text)} // Usar setFirstName para actualizar el estado
                />
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Apellido"
                    value={lastName} // Usar lastName como valor
                    onChangeText={text => setLastName(text)} // Usar setLastName para actualizar el estado
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
                    <Text style={{ color: 'white', textAlign: 'center' }}>Registrarse</Text>
                </Pressable>
                {signUpSuccess && <Text style={{ marginTop: 20 }}>Usuario registrado exitosamente</Text>}
            </View>
        </ScrollView>
    );
};

export default SignupUser;





