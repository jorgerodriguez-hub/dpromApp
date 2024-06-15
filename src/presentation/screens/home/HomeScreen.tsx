import { useEffect, useState } from 'react';
import { API_URL, BASE_DE_DATOS, TABLE_EPSJ } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Divider, Layout, MenuItem, Text } from '@ui-kitten/components';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { RootStackParams } from '../../navigation/StackNavigator';
import { LoadingScreen } from '../loading/LoadingScreen';

export const HomeScreen = () => {

  const [isPosting, setIsPosting] = useState(false);
  const [nameUser, setNameUser] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { height } = useWindowDimensions();

  const handleLogout = () =>
    Alert.alert('Cerrar Sesión', '¿Seguro que desea cerrar sesión?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Aceptar',
        onPress: async () => {
          setIsPosting(true);
          await AsyncStorage.removeItem("id");
          await AsyncStorage.removeItem("password");
          await AsyncStorage.removeItem("registered");
          navigation.navigate('LoginScreen');
          setIsPosting(false);
        }
      }
    ]);

  const viewRegistered = async () => {

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
              TABLE_EPSJ,
              'search_read',
              [["create_uid", "=", Number(idValue)]],
              ["name", "direccion", "create_date"]
            ]
          }
        }),
      });
      const json = await response.json();
      const dataRegistered = json.result;
      const dataStringify = JSON.stringify(dataRegistered);
      await AsyncStorage.setItem('registered', dataStringify);
    } catch (error) {
      Alert.alert('MINSA', `${error}`);
      return;
    }

    navigation.navigate('ViewRegister');

  };

  const formRegister = async () => {

    const idValue = await AsyncStorage.getItem("id");
    const password = await AsyncStorage.getItem("password");
    const ubigeo = await AsyncStorage.getItem("ubigeo");

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
              'renipress.eess',
              'search_read',
              [["ubigeo", "=", ubigeo ]],
              []
            ]
          }
        }),
      });
      const json = await response.json();
      const establishment = json.result;
      const establishmentStringify = JSON.stringify(establishment);
      await AsyncStorage.setItem('establishment', establishmentStringify);
    } catch (error) {
      Alert.alert('MINSA', `${error}`);
      return;
    }

    navigation.navigate('RegisterScreen');

  };

  useEffect( ()=> {

    const getInfoUser = async () => {

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
                'res.users',
                'read',
                [Number(idValue)],
                []
              ]
            }
          }),
        });
        const json = await response.json();
        const infoUser = json.result[0].display_name;
        const ubigeoUser = json.result[0].epsj_ubigeo;
        await AsyncStorage.setItem('ubigeo', ubigeoUser);
        setNameUser(infoUser);
      } catch (error) {
        Alert.alert('MINSA', `${error}`);
        return;
      }

    }

    getInfoUser();

  }, []);

  if ( !nameUser ) {
    return (<LoadingScreen />);
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../assets/images/background.jpg')}
        resizeMode="cover"
        style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: 30 }}>
        <Layout style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <Image
            source={require('../../../assets/images/logo-minsa.jpg')}
            style={styles.image} />
        </Layout>

        <Layout style={{ marginTop: height * 0.10, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
          <Text category="h6" style={{ color: '#FFFFFF' }}>
            Bienvenid@,
          </Text>
          <Text category="h6" style={{ color: '#FFFFFF' }}>
            {nameUser}
          </Text>
        </Layout>

        <Layout style={{ marginTop: height * 0.05, marginBottom: height * 0.05 }}>
          <Divider style={styles.divider} />
        </Layout>

        <Layout style={{ marginTop: height * 0.15 }}>
          <MenuItem
            title='Registrar Espacio Público Juego'
            accessoryLeft={<MyIcon name="save-outline" />}
            style={styles.menuItem}
            onPress={formRegister}
          />
          <MenuItem
            title='Visualizar EPSJ Registrados'
            accessoryLeft={<MyIcon name="eye-outline" />}
            style={styles.menuItem}
            onPress={viewRegistered}
          />
          <MenuItem
            title='Guía / Manual de Uso'
            accessoryLeft={<MyIcon name="file-text-outline" />}
            style={styles.menuItem}
            onPress={() => navigation.navigate('PDFViewer')}
          />
        </Layout>

        <Layout style={{ marginTop: height * 0.05 }}>
          <Button
            disabled={isPosting}
            accessoryRight={<MyIcon name="log-out-outline" color={isPosting ? '#484E59' : '#FFFFFF'} />}
            style={styles.button}
            onPress={handleLogout}>CERRAR SESIÓN</Button>
        </Layout>
      </ScrollView>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: '100%',
    resizeMode: 'contain'
  },
  textInput: {
    color: '#FFFFFF',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#191919',
    borderColor: '#191919',
    borderRadius: 0
  },
  divider: {
    borderTopWidth: 3,
    borderTopColor: '#000000'
  },
  menuItem: {
    backgroundColor: '#D9D9D9',
    borderColor: '#D9D9D9'
  }
});
