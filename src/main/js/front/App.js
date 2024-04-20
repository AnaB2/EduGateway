import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignupUser from "./users/SignupUser";
import LoginUser from "./users/LoginUser";
import Index from "./index";
import HomeUser from "./users/UserHome";
import SignupInstitution from "./institutions/SignupInstitution";
import HomeInstitution from "./institutions/InstitutionHome";


const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen name="Index" component={Index} />
                <Stack.Screen name="SignupUser" component={SignupUser} />
                <Stack.Screen name="SignupInstitution" component={SignupInstitution} />
                <Stack.Screen name="LoginUser" component={LoginUser} />
                <Stack.Screen name="HomeUser" component={HomeUser} />
                <Stack.Screen name="HomeInstitution" component={HomeInstitution} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});