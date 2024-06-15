import { Button, Icon, Input, Layout, Radio, RadioGroup, Select, SelectItem, Text, TopNavigation, TopNavigationAction, ViewPager } from '@ui-kitten/components';
import { API_URL, BASE_DE_DATOS, TABLE_EPSJ } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Image, ScrollView, StyleSheet, PermissionsAndroid, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useEffect, useState } from 'react';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { MyIcon } from '../../components/ui/MyIcon';
import { LoadingScreen } from '../loading/LoadingScreen';
import Geolocation from '@react-native-community/geolocation';

export const EditionScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { canGoBack, goBack } = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [geoPosting, setGeoPosting] = useState(false);
  const [valueSpace, setValueSpace] = useState(0);
  const [valueImplementation, setValueImplementation] = useState(0);
  const [nameEPSJ, setNameEPSJ] = useState('');
  const [directionEPSJ, setDirectionEPSJ] = useState('');
  const [photoPanorama, setPhotoPanorama] = useState(false);
  const [structureOne, setStructureOne] = useState(false);
  const [structureTwo, setStructureTwo] = useState(false);
  const [structureThree, setStructureThree] = useState(false);
  const [establishment, setEstablishment] = useState([]);
  const [data, setData] = useState([]);
  const [espacio, setEspacio] = useState([]);
  const [implementacion, setImplementacion] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [valueSelect, setValueSelect] = useState();
  const [idEdition, setIdEdition] = useState();

  const renderBackAction = () => {
    return (
      <TopNavigationAction
        icon={ <MyIcon name="arrow-back-outline" color="#FFFFFF" /> }
        onPress={goBack}
      />
    );
  };

  const saveRegister = async () => {

    const idValue = await AsyncStorage.getItem("id");
    const password = await AsyncStorage.getItem("password");

    setIsPosting(true);

    try {
      const response = await fetch('https://qpromociondelasalud.minsa.gob.pe/jsonrpc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            service: 'object', 
            method: 'execute', 
            args: [
              BASE_DE_DATOS,
              Number(idValue),
              password,
              TABLE_EPSJ,
              'write',
              [idEdition],
              {
                "name": nameEPSJ,
                "direccion": directionEPSJ,
                "tipo_espacio_id": valueSpace + 1,
                "implementacion_id": valueImplementation + 1,
                "establecimiento_id": establishment,
                "image_1": photoPanorama,
                "image_2": structureOne,
                "image_3": structureTwo,
                "image_4": structureThree,
                "latitud": latitude,
                "longitud": longitude
              }
            ]
          }
        }),
      });
      const json = await response.json();
      if (json.result) {
        Alert.alert('MINSA', 'Editado con éxito.');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('MINSA', 'No se realizó la edición. Contacte a su Administrador.');
      }
    } catch (error) {
      Alert.alert('MINSA', `${error}`);
      setIsPosting(false);
      return;
    }

    setIsPosting(false);

  };

  const handleGeolocation = () => {

    setGeoPosting(true);

    const requestLocationPermission = async () => {

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Get current location once permission is granted
          Geolocation.getCurrentPosition(
            position => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
              Alert.alert('MINSA', 'Geolocalización exitosa');
              setGeoPosting(false);
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
        } else {
          Alert.alert('MINSA', 'Location permission denied');
        }
      } catch (error) {
        Alert.alert('MINSA', `${error}`);
        setGeoPosting(false);
        return;
      }
    };

    requestLocationPermission();

    // Clean up function
    // return () => {
    // Optionally clear watch position if you are using it
    // navigator.geolocation.clearWatch(watchId);
    // };

  };

  useEffect(() => {

    const getEstablishment = async () => {
    
      const allEstablishment = await AsyncStorage.getItem("establishment");
      const dataParsed = JSON.parse(allEstablishment);
      setData(dataParsed);
    
    };

    const getDataEdit = async () => {
    
        const allInformationEdition = await AsyncStorage.getItem("dataEdition");
        const dataParsed = JSON.parse(allInformationEdition);
        const arrayEstablishment = dataParsed[0].establecimiento_id[1].split("- ");
        setIdEdition(dataParsed[0].id);
        setValueSelect(arrayEstablishment[2]);
        setNameEPSJ(dataParsed[0].name);
        setDirectionEPSJ(dataParsed[0].direccion);
        setValueSpace(dataParsed[0].tipo_espacio_id[0] - 1);
        setValueImplementation(dataParsed[0].implementacion_id[0] - 1);
        setEstablishment(dataParsed[0].establecimiento_id[0]);
        setPhotoPanorama(dataParsed[0].image_1);
        setStructureOne(dataParsed[0].image_2);
        setStructureTwo(dataParsed[0].image_3);
        setStructureThree(dataParsed[0].image_4);
        setLatitude(dataParsed[0].latitud);
        setLongitude(dataParsed[0].longitud);
    
    };
  
    getEstablishment();
    getDataEdit();
    
  }, []);

  useEffect(() => {

    const getTipoEspacio = async () => {
    
      const idValue = await AsyncStorage.getItem("id");
      const password = await AsyncStorage.getItem("password");
  
      try {
        const response = await fetch('https://qpromociondelasalud.minsa.gob.pe/jsonrpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: 'object',
              method: 'execute',
              args: [
                BASE_DE_DATOS,
                Number(idValue),
                password,
                'minsa.tipo.espacio',
                'search_read',
                [],
                []
              ]
            }
          }),
        });
        const json = await response.json();
        const dataTipoEspacio = json.result;
        const dataStringify = JSON.stringify(dataTipoEspacio);
        const dataParse = JSON.parse(dataStringify);
        setEspacio(dataParse);
      } catch (error) {
        Alert.alert('MINSA', `${error}`);
        return;
      }
    
    };
  
    getTipoEspacio();
    
  }, []);

  useEffect(() => {

    const getImplementacion = async () => {
    
      const idValue = await AsyncStorage.getItem("id");
      const password = await AsyncStorage.getItem("password");
  
      try {
        const response = await fetch('https://qpromociondelasalud.minsa.gob.pe/jsonrpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: 'object',
              method: 'execute',
              args: [
                BASE_DE_DATOS,
                Number(idValue),
                password,
                'minsa.tipo.implementacion',
                'search_read',
                [],
                []
              ]
            }
          }),
        });
        const json = await response.json();
        const dataImplementacion = json.result;
        const dataStringify = JSON.stringify(dataImplementacion);
        const dataParse = JSON.parse(dataStringify);
        setImplementacion(dataParse);
      } catch (error) {
        Alert.alert('MINSA', `${error}`);
        return;
      }
    
    };
  
    getImplementacion();
    
  }, []);

  useEffect(() => {

    const displayValue = data[selectedIndex.row]?.id;
    setEstablishment(displayValue);
    
  }, [selectedIndex]);

  if (!data || nameEPSJ === '' || espacio.length === 0 || implementacion.length === 0) {
    return (<LoadingScreen />);
  }

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        title={props => <Text style={[{ color: 'white', fontWeight: 'bold' }]}>EDITAR EPSJ</Text>}
        alignment="center"
        accessoryLeft={ canGoBack() ? renderBackAction : undefined }
        style={styles.navigation}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: 30 }}>
        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>I. Tipo de Espacio:</Text>
          <RadioGroup
            selectedIndex={valueSpace}
            onChange={index => setValueSpace(index)}
          >
            {espacio.map(item => 
              <Radio key={item.id} status='info'>{item.name}</Radio>
            )}
          </RadioGroup>
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>II. Implementación Realizada:</Text>
          <RadioGroup
            selectedIndex={valueImplementation}
            onChange={index => setValueImplementation(index)}
          >
            {implementacion.map(item => 
              <Radio key={item.id} status='info'>{item.name}</Radio>
            )}
          </RadioGroup>
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>III. Nombre Espacio Público:</Text>
          <Input
            placeholder="Ingrese el nombre del espacio aquí"
            autoCapitalize="none"
            style={{ marginTop: 10 }}
            value={nameEPSJ}
            onChangeText={nextValue => setNameEPSJ(nextValue)}
          />
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>IV. Establecimiento:</Text>
          <Select
            selectedIndex={selectedIndex}
            style={{ marginTop: 10 }}
            value={valueSelect ? valueSelect : data[selectedIndex.row]?.name}
            onSelect={index => {
              setValueSelect(false);
              setSelectedIndex(index);
            }}
          >      
            {data.map(item => 
              <SelectItem key={item.id} title={item.name} />
            )}
          </Select>
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>V. Dirección Espacio Público:</Text>
          <Input
            placeholder="Ingrese la dirección del espacio aquí"
            autoCapitalize="none"
            style={{ marginTop: 10 }}
            value={directionEPSJ}
            onChangeText={nextValue => setDirectionEPSJ(nextValue)}
          />
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>VI. Panorámica:</Text>
          {photoPanorama === false ? 
            (<ViewPager>
              <Layout style={styles.tab} level='2'>
                <Button
                  style={{ backgroundColor: '#F7F9FC', borderColor: '#F7F9FC' }}
                  onPress={() => {
                    const openGallery = () => {
                      const options: ImageLibraryOptions = {
                        mediaType: 'photo',
                        includeBase64: true,
                      };
                      launchImageLibrary(options, response => {
                        if (response.didCancel) {
                          console.log('Usuario ha cancelado imagePicker');
                        } else if (response.errorCode) {
                          console.log(response.errorCode, 'err');
                        } else {
                          setPhotoPanorama(response.assets[0].base64);
                        }
                      })
                    }
                    openGallery();
                  }}
                >
                  <MyIcon name="camera-outline" />
                </Button>
              </Layout>
            </ViewPager>) : (
            <>
              <Image
                source={{uri: `data:image/png;base64,${photoPanorama}`}}
                style={styles.photo}
              />
              <Button
                style={styles.buttonImg}
                status='primary'
                accessoryLeft={<MyIcon name="trash-outline" color="#FFFFFF" />}
                onPress={() => setPhotoPanorama(false)}
              >
                REMOVER
              </Button>
            </>
            )
          }
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>VII. Áreas/Estructuras Lúdicas 1:</Text>
          {structureOne === false ? 
            (<ViewPager>
              <Layout style={styles.tab} level='2'>
                <Button
                  style={{ backgroundColor: '#F7F9FC', borderColor: '#F7F9FC' }}
                  onPress={() => {
                    const openGallery = () => {
                      const options: ImageLibraryOptions = {
                        mediaType: 'photo',
                        includeBase64: true,
                      };
                      launchImageLibrary(options, response => {
                        if (response.didCancel) {
                          console.log('Usuario ha cancelado imagePicker');
                        } else if (response.errorCode) {
                          console.log(response.errorCode, 'err');
                        } else {
                          setStructureOne(response.assets[0].base64);
                        }
                      })
                    }
                    openGallery();
                  }}
                >
                  <MyIcon name="camera-outline" />
                </Button>
              </Layout>
            </ViewPager>) : (
            <>
              <Image
                source={{uri: `data:image/png;base64,${structureOne}`}}
                style={styles.photo}
              />
              <Button
                style={styles.buttonImg}
                status='primary'
                accessoryLeft={<MyIcon name="trash-outline" color="#FFFFFF" />}
                onPress={() => setStructureOne(false)}
              >
                REMOVER
              </Button>
            </>
            )
          }
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>VIII. Áreas/Estructuras Lúdicas 2:</Text>
          {structureTwo === false ? (
            <ViewPager>
              <Layout style={styles.tab} level='2'>
                <Button
                  style={{ backgroundColor: '#F7F9FC', borderColor: '#F7F9FC' }}
                  onPress={() => {
                    const openGallery = () => {
                      const options: ImageLibraryOptions = {
                        mediaType: 'photo',
                        includeBase64: true,
                      };

                      launchImageLibrary(options, response => {
                        if (response.didCancel) {
                          console.log('Usuario ha cancelado imagePicker');
                        } else if (response.errorCode) {
                          console.log(response.errorCode, 'err');
                        } else {
                          setStructureTwo(response.assets[0].base64);
                        }
                      })

                    }
                    openGallery();
                  }}
                >
                  <MyIcon name="camera-outline" />
                </Button>
              </Layout>
            </ViewPager>) : (
            <>
              <Image
                source={{uri: `data:image/png;base64,${structureTwo}`}}
                style={styles.photo}
              />
              <Button
                style={styles.buttonImg}
                status='primary'
                accessoryLeft={<MyIcon name="trash-outline" color="#FFFFFF" />}
                onPress={() => setStructureTwo(false)}
              >
                REMOVER
              </Button>
            </>
          )
        }
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>IX. Áreas/Estructuras Lúdicas 3:</Text>
          {structureThree === false ? (
            <ViewPager>
              <Layout style={styles.tab} level='2'>
                <Button
                  style={{ backgroundColor: '#F7F9FC', borderColor: '#F7F9FC' }}
                  onPress={() => {
                    const openGallery = () => {
                      const options: ImageLibraryOptions = {
                        mediaType: 'photo',
                        includeBase64: true,
                      };

                      launchImageLibrary(options, response => {
                        if (response.didCancel) {
                          console.log('Usuario ha cancelado imagePicker');
                        } else if (response.errorCode) {
                          console.log(response.errorCode, 'err');
                        } else {
                          setStructureThree(response.assets[0].base64);
                        }
                      })

                    }
                    openGallery();
                  }}
                >
                  <MyIcon name="camera-outline" />
                </Button>
              </Layout>
            </ViewPager>) : (
            <>
              <Image
                source={{uri: `data:image/png;base64,${structureThree}`}}
                style={styles.photo}
              />
              <Button
                style={styles.buttonImg}
                status='primary'
                accessoryLeft={<MyIcon name="trash-outline" color="#FFFFFF" />}
                onPress={() => setStructureThree(false)}
              >
                REMOVER
              </Button>
            </>
          )
        }
        </Layout>

        <Layout style={{ marginTop: 20 }}>
          <Text category='h6'>X. Geolocalización:</Text>

          <Button
            disabled={geoPosting}
            style={{ marginTop: 10, marginBottom: 10 }}
            status='primary'
            accessoryLeft={<Icon name={geoPosting ? "loader-outline" : "pin-outline"} color="#FFFFFF" />}
            onPress={handleGeolocation}
          >{geoPosting ? 'GEOLOCALIZANDO' : 'GEOLOCALIZAR'}</Button>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text category='h6'>Geo Latitud: </Text>
            <Text category='h6'>{latitude}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text category='h6'>Geo Longitud: </Text>
            <Text category='h6'>{longitude}</Text>
          </View>
          
        </Layout>

        <Layout style={{ height: 10 }} />

        <Layout style={{ marginTop: 30, marginBottom: 30 }}>
          <Button
            disabled={isPosting}
            accessoryRight={<MyIcon name="edit-2-outline" color={isPosting ? '#484E59' : '#FFFFFF'} />}
            style={{ backgroundColor: '#191919', borderColor: '#191919' }}
            onPress={saveRegister}>FINALIZAR EDICIÓN</Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tab: {
    height: 180,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    backgroundColor: '#191919',
  },
  photo: {
    width: '100%',
    height: 200,
    marginTop: 5
  },
  buttonImg: {
    borderRadius: 0,
    height: 50
  }
});
