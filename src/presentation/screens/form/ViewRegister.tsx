import { Divider, Layout, List, ListItem, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { API_URL, BASE_DE_DATOS, TABLE_EPSJ } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, View } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../loading/LoadingScreen';

export const ViewRegister = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { canGoBack, goBack } = useNavigation();
  const [data, setData] = useState([]);

  const renderBackAction = () => {
    return (
      <TopNavigationAction
          icon={ <MyIcon name="arrow-back-outline" color="#FFFFFF" /> }
          onPress={goBack}
      />
    );
  };

  const renderItemRegistered = () => (
    <View style={styles.containerRegistered}>
      <Text style={{ color: 'rgb(0, 149, 255)' }}status='control'>
        Registrado
      </Text>
    </View>
  );

  const renderItem = ({ item, index }: { item: string; index: number }): React.ReactElement => (
    <ListItem
      title={`${item.name}`}
      description={evaProps => 
        <>
          <Text {...evaProps}>{item.direccion}</Text>
          <Text {...evaProps}>{item.create_date}</Text>
        </>
      }
      accessoryLeft={evaProps => <Text>{index + 1}</Text>}
      accessoryRight={renderItemRegistered}
      onPress={() => getItemRegistered(item.id)}
    />
  );

  const getItemRegistered = async (idEdited) => {

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
              [["id", "=", idEdited]], 
              ["name", "direccion", "tipo_espacio_id", "implementacion_id",
                "establecimiento_id", "image_1", "image_2", "image_3", "image_4",
                "latitud", "longitud"]
            ]
          }
        }),
      });
      const json = await response.json();
      console.log('json', json);
      const dataRegistered = json.result;
      const dataStringify = JSON.stringify(dataRegistered);
      await AsyncStorage.setItem('dataEdition', dataStringify);
      navigation.navigate('EditionScreen');
    } catch (error) {
      Alert.alert('MINSA', `${error}`);
      return;
    }

  };

  useEffect(() => {

    const getRegistered = async () => {
    
      const allRegistered = await AsyncStorage.getItem("registered");
      const dataParsed = JSON.parse(allRegistered);
      setData(dataParsed);
    
    };
  
    getRegistered();

  }, []);

  if (!data ) {
    return (<LoadingScreen />);
  }

  return (
    <Layout style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <TopNavigation
          title={props => <Text style={[{ color: 'white', fontWeight: 'bold' }]}>EPSJ REGISTRADOS</Text>}
          alignment="center"
          accessoryLeft={ canGoBack() ? renderBackAction : undefined }
          style={styles.navigation}
      />
        {data.length === 0 ? 
          <Text category="h6" style={{ marginLeft: 20, marginTop: 10 }}>
            NO TIENE REGISTROS.
          </Text>
          : 
          <List
            style={styles.container}
            data={data}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
          />
        }
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    backgroundColor: '#191919',
  },
  containerRegistered: {
    borderRadius: 4,
    margin: 4,
    padding: 8,
    backgroundColor: 'rgba(0, 149, 255, 0.08)',
    borderColor: 'rgb(0, 149, 255)',
    borderWidth: 1,
  },
  containerSent: {
    borderRadius: 4,
    margin: 4,
    padding: 8,
    backgroundColor: 'rgba(0, 149, 255, 0.08)',
    borderColor: 'rgb(0, 149, 255)',
    borderWidth: 1,
  },
});
