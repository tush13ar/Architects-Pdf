import React from 'react';
import {View, Text, PixelRatio, StyleSheet} from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'

const audiornp = new AudioRecorderPlayer()


export default class Ellipse extends React.Component {

  state={
      recorded: false,
      togglePlay: true,
      toggleRecord: true,
      recordSecs: null,
      recordTime: null,
      currentPositionSec: null,
      currentDurationSec: null,
      playTime: null,
      duration: null
  }

  componentWillUnmount(){             //cancel all subscriptions
    audiornp.stopRecorder()
    audiornp.stopPlayer()
    audiornp.removeRecordBackListener()
    audiornp.removePlayBackListener()
  }

  pixelDensity = PixelRatio.get()

  preparePath = () => {                               //path of audio
      const name = `${this.props.name}`
      return `sdcard/${name}${this.props.index}.mp4`
  }

  onStartRecord = async () => {
    console.log('recording started')
    const result = await audiornp.startRecorder(this.preparePath());
    audiornp.addRecordBackListener((e) => {
      this.setState({
        toggleRecord: false,
        recordSecs: e.current_position,
        recordTime: audiornp.mmssss(
          Math.floor(e.current_position),
        ),
      });
      return;
    });
    console.log(result);
  };
      
  onStopRecord = async () => {
      console.log('recording stopped')
    const result = await audiornp.stopRecorder();
    audiornp.removeRecordBackListener();
    this.setState({
        recorded: true,
        toggleRecord: true,
        recordSecs: 0,
    });
    console.log(result);
  };
      
  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audiornp.startPlayer(this.preparePath());
    console.log(msg);
    audiornp.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        this.onStopPlay()
      }
      this.setState({
        togglePlay: false,
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audiornp.mmssss(Math.floor(e.current_position)),
        duration: audiornp.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };
          
      
  onStopPlay = async () => {
    this.setState({
        togglePlay: true
    })
    console.log('onStopPlay');
    audiornp.stopPlayer().catch((err) => {
      this.setState({
          togglePlay: true
      })
      console.log(`promise error: ${err}`)
    })
    audiornp.removePlayBackListener();
    return;
  };

  startStopRecording = () => {                                   // change audio Icon as per recording status
    this.state.toggleRecord?this.onStartRecord(): this.onStopRecord()
  }

  startStopPlay = () => {                                       // change audio Icon as per Player status
    this.state.togglePlay?this.onStartPlay(): this.onStopPlay()
  }

  render(){
    
    return(
      <>
      <View style={this.styles.ellipse} />

      <View 
      style={this.styles.audioIcon} 
      ref={view => {this.Ellipse = view}}
      onLayout={(event) => {
          this.Ellipse.measureInWindow((x,y,w,h) => {
          console.log(x+ ' '+ y + ' ' + w+' '+h)
          })
      }}>
        
        {!this.state.recorded && 
        <Text 
        style={this.styles.audioIconText} 
        onPress={this.startStopRecording}>
          {this.state.toggleRecord?'+':'[]'}
          </Text>
        }

        {this.state.recorded && 
        <Text 
        style={this.styles.audioIconText} 
        onPress={this.startStopPlay}>
          {this.state.togglePlay?'|>':'||'}
        </Text>
        }

      </View>
      </>
      
    )
  }

  size = Number(this.props.details.size)

  styles = StyleSheet.create({
    ellipse:{
      width: this.size,
      height: this.size,
      borderRadius: this.size/2,
      borderWidth: 1,
      position: 'absolute',
      transform: this.props.details.isHorizontal? [{scaleX: 2}]: [{scaleY: 2}], 
      top:this.props.details.Y/this.pixelDensity - this.size/2, 
      left:this.props.details.X/this.pixelDensity - this.size/2 
    },
    audioIcon:{
      position: 'absolute',
      top: this.props.details.Y/this.pixelDensity - 33/2, // 33=predetermined height of audio Icon
      left: this.props.details.X/this.pixelDensity - 14/2 // 14=predetemined height of audio icon 
    },
    audioIconText:{
      color: 'red', 
      fontSize: 25
    }
    
  })

}