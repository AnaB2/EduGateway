import React from 'react';
import {StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignupUser from "./users/SignupUser";
import LoginUser from "./users/LoginUser";
import HomeUser from "./users/UserHome";
import SignupInstitution from "./institutions/SignupInstitution";
import HomeInstitution from "./institutions/InstitutionHome";
import Index from "./index";
import AddOpportunity from "./opportunities/AddOpportunity";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="EduGateway">
                <Stack.Screen name="EduGateway" component={Index} />
                <Stack.Screen name="SignupUser" component={SignupUser} />
                <Stack.Screen name="SignupInstitution" component={SignupInstitution} />
                <Stack.Screen name="LoginUser" component={LoginUser} />
                <Stack.Screen name="HomeUser" component={HomeUser} />
                <Stack.Screen name="HomeInstitution" component={HomeInstitution} />
                <Stack.Screen name="AddOpportunity" component={AddOpportunity} />


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