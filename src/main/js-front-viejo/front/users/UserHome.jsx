import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { getOpportunities } from '../Api'; // Asegúrate de tener una función getOpportunities en tu archivo de API

const UserHome = () => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        // Llama a la función para obtener las oportunidades al cargar el componente
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const response = await getOpportunities(); // Debes implementar esta función en tu API
            setOpportunities(response);
        } catch (error) {
            console.error("Failed to fetch opportunities:", error);
        }
    };

    const renderOpportunityItem = ({ item }) => (
        <View style={{ marginBottom: 10 }}>
            <Text>Nombre: {item.name}</Text>
            <Text>Categoría: {item.category}</Text>
            <Text>Ciudad: {item.city}</Text>
            <Text>Nivel Educativo: {item.educationalLevel}</Text>
            <Text>Modo de Entrega: {item.deliveryMode}</Text>
            <Text>Idioma: {item.language}</Text>
            <Text>Capacidad: {item.capacity}</Text>
            {/* Puedes mostrar más detalles de la oportunidad aquí si lo deseas */}
        </View>
    );

    return (
        <View>
            <Text>Welcome to User Home!</Text>
            <Button title="Refresh" onPress={fetchOpportunities} />
            <FlatList
                data={opportunities}
                renderItem={renderOpportunityItem}
                keyExtractor={(item) => item.name}
            />
        </View>
    );
};

export default UserHome;
