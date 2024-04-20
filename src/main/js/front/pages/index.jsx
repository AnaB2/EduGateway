import React from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook useNavigation

const Index = () => {
    const navigation = useNavigation();

    const handleSignupUser = () => {
        navigation.navigate('SignupUser');
    };

    const handleSignupInstitution = () => {
        navigation.navigate('SignupInstitution');
    };

    return (
        <View>
            <Button title="Registrarse como usuario" onPress={handleSignupUser} />
            <Button title="Registrarse como institución" onPress={handleSignupInstitution} />
            <Button title={"Iniciar sesión"} onPress={() => navigation.navigate('LoginUser')} />
        </View>
    );
};

export default Index;
