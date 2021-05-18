import React from 'react';
import {View, Text,StyleSheet} from 'react-native'

const Info = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Ellipse Size reference:</Text>
            <View style={styles.row} >
                <Text>Size=20</Text>
                <View style={[styles.genEllipse, styles.smallEllipse]} />
            </View>
            <View style={styles.row} >
                <Text>Size=50</Text>
                <View style={[styles.genEllipse, styles.mediumEllipse]} />
            </View>
            <View style={styles.row} >
                <Text>Size=80</Text>
                <View style={[styles.genEllipse, styles.largeEllipse]} />
            </View>
            <Text style={styles.heading}>Legends:</Text>
            <Text>+ - Start recording your audio by pressing on this icon</Text>
            <Text>[] - When done recording, press this icon to save your audio</Text>
            <Text>|{'>'} - Start playing your recorded audio</Text>
            <Text> || - Stop Playing your recorded audio</Text>
             
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        borderWidth: 1,
        margin: 10,
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    genEllipse:{
        borderWidth: 1,
        borderColor: 'black',
        transform: [{scaleX: 2}]
    },
    smallEllipse:{
        width: 20,
        height: 20,
        borderRadius: 20/2   
    },
    mediumEllipse:{
        width: 50,
        height: 50,
        borderRadius: 50/2
    },
    largeEllipse:{
        width: 80,
        height: 80,
        borderRadius: 80/2
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'teal'
    }
})

export default Info