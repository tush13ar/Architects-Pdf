import React from 'react';
import {FlatList, View, Text,Button, TouchableOpacity, PermissionsAndroid, StyleSheet, Modal} from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import { Card } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';

// A list of pdf uploaded to the app, with option to add more

class PdfList extends React.Component{

  state={
      pdfList: [],
      modalVisible: false,
      pdfName: null,
      tempPdfDetails: {
        name: null,
        uri: null
      }
  }

  showModal = () => {
    console.log('modal check again')
    this.setState({
      modalVisible: true
    })
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  askPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(         //Requesting permission for storing audio in external Storage
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(       //Requesting permission for using mic for recording audio message
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for recording audio',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the audio recorder');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }

  componentDidMount(){
    this.askPermission()
  }

  pickDoc = async () => {                           // getting pdf URI using Document Picker (a 3rd party library)
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],       // only PDF type files allowed to upload
      });

      if(res.name === undefined || res.name === null){    // in case pdf selected does not have name field
        this.setState({
          tempPdfDetails: {uri: res.uri}
        })
        this.showModal()
        console.log(this.state.modalVisible)
      }else{
        this.setState({
          pdfList: [...this.state.pdfList, {uri: res.uri, name: res.name}] 
        })
      }

      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      console.log(this.state)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('App may not function properly without media and mic permissions!')
      } else {
        throw err;
      }
    }
  }

  onSubmitPdfName = () => {
    if(!this.state.tempPdfDetails.name){
      alert("PdfName cannot be Empty!")
    }
    else{
      this.setState({
        pdfList: [...this.state.pdfList, this.state.tempPdfDetails]
      })
      console.log(this.state.pdfList)
      this.hideModal()
    }
  }

  PdfNameInput = () => {       // Component on Modal taking input of pdf Name in case it does not exist
    return(
      <View style={styles.modal}>
        <TextInput placeholder="Enter Pdf Name here" value={this.state.tempPdfDetails.name} onChangeText={(val) => {this.setState({tempPdfDetails: {...this.state.tempPdfDetails, name: val}})}} />
        <Button title="submit" onPress={this.onSubmitPdfName} />
        <Text style={styles.noteText}>Note: The Pdf You selected does not have a name field, Please add One.</Text>
      </View>
    )
  }

  renderItem = ({item}) => (           //render individual item of FlatList
      <TouchableOpacity
      onPress={() => {
        console.log(item.uri)
        this.props.navigation.navigate('Pdf',{uri: item.uri, name: item.name})}}>
        <Card>
        <Text style={styles.cardText} numberOfLines={1}>{item.name}</Text>
        </Card>
          
      </TouchableOpacity>
  )
  
  render(){
    return(
      <View style={styles.container}>
        <Modal 
        visible={this.state.modalVisible}
        onRequestClose={this.hideModal}>
          <this.PdfNameInput />
        </Modal>

        <View style={styles.addButton}>
        <Text onPress={this.pickDoc} style={styles.addButtonText}>+</Text> 
        </View>

        <FlatList
        data={this.state.pdfList}
        renderItem={this.renderItem}
        keyExtractor={(item,index) => (`${index}`)}
        />
        
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  addButton: {
    position: 'absolute',
    top: 450,
    right: 10
  },
  addButtonText: {
    fontSize: 80, 
    color: 'blue'
  },
  cardText: {
    fontSize: 30,
    color: 'red'
  },
  noteText: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }

})

export default PdfList;
            
