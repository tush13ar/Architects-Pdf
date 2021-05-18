import React, {useState, useLayoutEffect} from 'react';
import {View, Button, Dimensions, Text, Modal, StyleSheet} from 'react-native';
import {Switch, TextInput} from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';

import Ellipse from './ellipse';
import Info from './info';

import PinchZoomView from 'react-native-pinch-zoom-view';
// pdf file selected from pdfList with option to add ellipse anywhere

const PDF = ({route, navigation}) => {
  const [addModalVisible, setaddModalVisible] = useState(false);
  const [ellipse, setEllipse] = useState({size: null, isHorizontal: null});
  const [infoModalVisible, setinfoModalVisible] = useState(false);
  const [page, setPage] = useState(null);
  const [canAddEllipse, setCanAddEllipse] = useState(false);
  const [ellipseArray, addToEllipseArray] = useState([]);

  const source = {uri: `${route.params.uri}`, cache: true}; //source of pdf coming through navigation params

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerLeft: () => (
        <Button
          title="info"
          onPress={() => {
            setinfoModalVisible(true);
          }}
        />
      ),
      headerRight: () => (
        <Button
          title="Add"
          onPress={() => {
            setaddModalVisible(true);
            setCanAddEllipse(true);
          }}
        />
      ),
    });
  });

  const onSubmitModal = () => {
    if (ellipse.size) {
      setaddModalVisible(false);
    } else {
      alert("Size can't be null");
    }
  };

  const onPdfPageChanged = (page) => {
    setPage(page);
  };

  const onPdfError = (error) => {
    alert(`${error}`);
  };

  const onPdfPageSingleTap = (page, x, y) => {
    // passes page number, co-ordinates of tap location for a ellipse
    if (canAddEllipse) {
      addToEllipseArray([
        ...ellipseArray,
        {
          X: x,
          Y: y,
          Page: page,
          isHorizontal: ellipse.isHorizontal,
          size: ellipse.size,
        },
      ]);
      setCanAddEllipse(false);
    }
  };

  const SetEllipse = () => (
    // Component on Modal taking ellipse size and orientation as input
    <View style={styles.modalConatiner}>
      <TextInput
        placeholder="Enter size here..."
        value={ellipse.size}
        onChangeText={(val) => {
          setEllipse({...ellipse, size: val});
        }}
      />

      <View style={styles.modalSwitch}>
        <Text>isVertical</Text>
        <Switch
          value={ellipse.isHorizontal}
          onValueChange={(val) => {
            setEllipse({...ellipse, isHorizontal: !ellipse.isHorizontal});
          }}
        />
        <Text>isHorizontal</Text>
      </View>

      <Button title="Done" onPress={onSubmitModal} />

      <Text style={styles.note}>
        Note: After Pressing done tap anywhere on the pdf to draw the ellipse
      </Text>
    </View>
  );

  return (
    <PinchZoomView>
      <View style={styles.container}>
        <Modal
          visible={addModalVisible}
          onRequestClose={() => {
            setaddModalVisible(false);
          }}>
          <SetEllipse />
        </Modal>

        <Modal
          visible={infoModalVisible}
          onRequestClose={() => {
            setinfoModalVisible(false);
          }}>
          <Info />
        </Modal>

        <Pdf
          source={source}
          style={styles.pdf}
          minScale={1}
          maxScale={1}
          // fitPolicy={2}
          enablePaging={false}
          onPageChanged={onPdfPageChanged}
          onError={onPdfError}
          onPageSingleTap={onPdfPageSingleTap}
        />

        {ellipseArray.map((item, index) => {
          if (item.Page === page) {
            return (
              <Ellipse details={item} name={route.params.name} index={index} />
            );
          }
        })}
      </View>
    </PinchZoomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalConatiner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalSwitch: {
    flexDirection: 'row',
  },
  note: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default PDF;
