import React, {useState} from 'react';
import {View, Button, Dimensions, ActivityIndicator, Text} from 'react-native'
import Pdf from 'react-native-pdf'

class AddPlus extends React.Component {
  componentDidMount(){
    console.log('mounted')
  }
  render(){
  return(
    <View style={{position: 'absolute'}}>
      <Text style={{fontSize: 100, color: 'red'}}>+</Text>
    </View>
  )
  }
}

const PDF = () => {
  const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true}
  const [toggle,setToggle] = useState(true)
  const [itemCount, setItemCount] = useState(0)
  const [itemObjectArray, setItemObject] = useState([])

  toggleState = () => {
    setToggle(!toggle)
  }

  const addShape = (x,y) => {
    setItemCount(itemCount+1)
    setItemObject([...itemObjectArray,{X: x, Y: y}])
  }

  return(
    <View style={{flex: 1}}>
      {/* <Button title={`${toggle}`} onPress={toggleState} /> */}
      {/* <Button title={add} onPress={addShape} /> */}
      
      {toggle && <Pdf
      source={source}
      activityIndicator={true}
      enableAnnotationRendering={true}
      enablePaging={true}
      onPageSingleTap={(page,x,y) => {addShape(x,y)
      console.log(x + ' '+ y + ' ' + page)
      console.log(Dimensions.get('screen').width, Dimensions.get('screen').height)
      }}
      style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} />}

      {itemCount>0 && <AddPlus coord={itemObjectArray[0]} />}
    </View>
  )

}
export default PDF;