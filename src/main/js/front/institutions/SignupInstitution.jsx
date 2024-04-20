import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { signUpInstitution } from '../register';
import {useNavigation} from "@react-navigation/native";

const SignupInstitution = () => {
    const [institutionalName, setInstitutionalName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credential, setCredential] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    // Obtenemos el objeto de navegación utilizando el hook useNavigation
    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            const institutionData = {
                email: email,
                password: password,
                institutionalName: institutionalName,
                credential: credential
            };

            await signUpInstitution(institutionData);
            setSignUpSuccess(true);


            navigation.navigate('LoginUser');


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
                    placeholder="Nombre Institucional"
                    value={institutionalName} // Usar institutionalName como valor
                    onChangeText={text => setInstitutionalName(text)} // Usar setInstitutionalName para actualizar el estado
                />
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
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Credencial"
                    value={credential}
                    onChangeText={text => setCredential(text)}
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
                {signUpSuccess && <Text style={{ marginTop: 20 }}>Institución registrada exitosamente</Text>}
            </View>
        </ScrollView>
    );
};

export default SignupInstitution;