import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AddOpportunity from "../opportunities/AddOpportunity";
import { getOpportunities, deleteOpportunity } from '../Api';

const InstitutionHome = ({ navigation }) => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOpportunities().then(() => {
            console.log('fetchOpportunities completado');
        }).catch(error => {
            console.error('Error en fetchOpportunities:', error);
        });
    }, []);


    const fetchOpportunities = async () => {
        try {
            const opportunitiesData = await getOpportunities();
            setOpportunities(opportunitiesData);
            setLoading(false); // Establecer loading en false cuando la solicitud se complete
        } catch (error) {
            setError(error); // Capturar cualquier error y establecerlo en el estado de error
            setLoading(false); // Asegurarse de que loading se establezca en false incluso si hay un error
        }
    };

    const handleDeleteOpportunity = async (opportunityName) => {
        try {
            await deleteOpportunity(opportunityName);
            // Actualizar la lista de oportunidades después de eliminar una
            await fetchOpportunities();
        } catch (error) {
            console.error('Error deleting opportunity:', error);
        }
    };

    const handleModifyOpportunity = () => {
        // Lógica para acceder al componente de modificación de oportunidades
        // Puedes mostrar el componente en un modal o cambiar la navegación
    };

    const renderOpportunityItem = ({ item }) => (
        <View style={{ marginBottom: 20 }}>
            <Text>Nombre: {item.name}</Text>
            <Text>Categoría: {item.category}</Text>
            <Text>Ciudad: {item.city}</Text>
            {/* Agregar más detalles de la oportunidad si es necesario */}
            <Button title="Eliminar" onPress={() => handleDeleteOpportunity(item.name)} />
        </View>
    );

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View>
            <Text>Welcome to Institution Home!</Text>
            <Button title="Agregar Oportunidad" onPress={() => navigation.navigate('AddOpportunity')} />
            <FlatList
                data={opportunities}
                renderItem={renderOpportunityItem}
                keyExtractor={(item) => item.name} // Utilizar el nombre como clave única
            />
            <Button title="Modificar Oportunidad" onPress={handleModifyOpportunity} />
        </View>
    );
};

export default InstitutionHome;


