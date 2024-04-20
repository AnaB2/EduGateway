import React from 'react';
import { View, Text } from 'react-native';
import AddOpportunity from "../opportunities/AddOpportunity";

const InstitutionHome = () => {
    return (
        <View>
            <Text>Welcome to Institution Home!</Text>
            <AddOpportunity />
        </View>
    );
};

export default InstitutionHome;
