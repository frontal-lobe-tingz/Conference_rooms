import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('http://192.168.100.9:5000/api/rooms/getallrooms');
        setRooms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={{ marginBottom: 20 }}
      onPress={() => navigation.navigate('RoomDetails', { roomId: item.id })}
    >
      <Image source={{ uri: item.imageurl }} style={{ width: '100%', height: 200 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Capacity: {item.capacity}</Text>
      <Text>Amenities: {Array.isArray(item.amenities) ? item.amenities.join(', ') : item.amenities}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

export default Rooms;
