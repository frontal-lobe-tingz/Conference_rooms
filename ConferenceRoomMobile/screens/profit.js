import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function profit() {
  return (
    <View>
      <Text style={{fontSize:20}}>Profit Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
    },

});