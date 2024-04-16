import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { signUpUser } from '../Api';
import { useNavigation } from '@react-navigation/native'; // Importa el hook useNavigation

const SignupUser = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    // Obtenemos el objeto de navegación utilizando el hook useNavigation
    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            const userData = {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            };

            await signUpUser(userData);
            setSignUpSuccess(true);

            // Utilizamos navigation.navigate para redirigir a la pantalla LoginUser
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
                    placeholder="Nombre"
                    value={firstname} // Usar firstName como valor
                    onChangeText={text => setFirstName(text)} // Usar setFirstName para actualizar el estado
                />
                <TextInput
                    style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    placeholder="Apellido"
                    value={lastname} // Usar lastName como valor
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





