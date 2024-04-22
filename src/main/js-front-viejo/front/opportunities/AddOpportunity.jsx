import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addOpportunity } from '../Api';

const AddOpportunity = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [educationalLevel, setEducationalLevel] = useState('');
    const [deliveryMode, setDeliveryMode] = useState('');
    const [language, setLanguage] = useState('');
    const [capacity, setCapacity] = useState('');
    const [addSuccess, setAddSuccess] = useState(false);

    const handleSubmit = async () => {
        try {
            const opportunityData = {
                name,
                category,
                city,
                educationalLevel,
                deliveryMode,
                language,
                capacity
            };

            await addOpportunity(opportunityData);
            setAddSuccess(true);

            // Lógica adicional después de agregar la oportunidad, si es necesario
        } catch (error) {
            console.error('Failed to add opportunity:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Agregar Oportunidad</Text>
            <TextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Categoría"
                value={category}
                onChangeText={setCategory}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Ciudad"
                value={city}
                onChangeText={setCity}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Nivel Educativo"
                value={educationalLevel}
                onChangeText={setEducationalLevel}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Modo de Entrega"
                value={deliveryMode}
                onChangeText={setDeliveryMode}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Idioma"
                value={language}
                onChangeText={setLanguage}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <TextInput
                placeholder="Capacidad"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}
            />
            <Button title="Agregar Oportunidad" onPress={handleSubmit} />
            {addSuccess && <Text style={{ marginTop: 20 }}>Oportunidad agregada exitosamente</Text>}
        </View>
    );
};

export default AddOpportunity;

