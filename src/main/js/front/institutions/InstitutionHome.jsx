// InstitutionHome.jsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import AddOpportunity from "../opportunities/AddOpportunity";
import DeleteOpportunity from "../opportunities/DeleteOpportunity";
import ModifyOpportunity from "../opportunities/ModifyOpportunity";

const InstitutionHome = () => {
    const handleDeleteOpportunity = () => {
        // Lógica para acceder al componente de eliminación de oportunidades
        // Puedes mostrar el componente en un modal o cambiar la navegación
    };

    const handleModifyOpportunity = () => {
        // Lógica para acceder al componente de modificación de oportunidades
        // Puedes mostrar el componente en un modal o cambiar la navegación
    };

    return (
        <View>
            <Text>Welcome to Institution Home!</Text>
            <AddOpportunity />
            <Button title="Eliminar Oportunidad" onPress={handleDeleteOpportunity} />
            <Button title="Modificar Oportunidad" onPress={handleModifyOpportunity} />
        </View>
    );
};

export default InstitutionHome;

