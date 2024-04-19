import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectRole = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                title="User"
                onPress={() => navigation.navigate('User')}
            />
            <Button
                title="Institution"
                onPress={() => navigation.navigate('Institution')}
            />
        </View>
    );
};

export default SelectRole;
