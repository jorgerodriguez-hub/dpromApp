import { useState } from 'react';
import { API_URL, BASE_DE_DATOS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Text, Input, Layout, Icon} from '@ui-kitten/components';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { RootStackParams } from '../../navigation/StackNavigator';

export const LoginScreen = () => {

  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({usuario: '',  password: ''});
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { height } = useWindowDimensions();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry  ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

  const handleLogin = async () => {
    
    if ( form.usuario.length === 0 || form.password.length === 0 ) {
      Alert.alert('MINSA', 'Ingrese usuario y contraseña.');
      return;
    }

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
            service: 'common',
            method: 'login',
            args: [
              BASE_DE_DATOS,
              form.usuario,
              form.password
            ]
          }
        }),
      });
      const json = await response.json();
      if (json.result === false) {
        Alert.alert('MINSA', 'Usuario o contraseña incorrectos.');
      } else {
        const valueId = json.result;
        const valueStringify = JSON.stringify(valueId);
        await AsyncStorage.setItem('id', valueStringify);
        await AsyncStorage.setItem('password', form.password);
        navigation.navigate('HomeScreen');
        setForm({usuario: '', password: ''});
      }
    } catch (error) {
      Alert.alert('MINSA', `${error}`);
      setIsPosting(false);
      return;
    }

    setIsPosting(false);

  };
  
  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground 
        source={require('../../../assets/images/park-wallpaper.jpg')} 
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
          <Text category="h6" style={{ textAlign: 'center', color: '#FFFFFF' }}>
            APLICATIVO MÓVIL PARA EL REPORTE DE ESPACIOS PÚBLICOS SALUDABLES DE 
            JUEGO REGISTRADOS POR LAS MUNICIPALIDADES A NIVEL NACIONAL
          </Text>
        </Layout>

        <Layout style={{ marginTop: height * 0.15, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
          <Text category="h6" style={styles.textInput}>USUARIO</Text>
          <Input
            placeholder="Usuario"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.usuario}
            onChangeText={ usuario => setForm({ ...form, usuario })}
            accessoryLeft={ <MyIcon name="email-outline" /> }
            style={{ marginBottom: 10, color: '#000000' }} />
          <Text category="label" style={styles.textInput}>CONTRASEÑA</Text>
          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            value={form.password}
            onChangeText={ password => setForm({ ...form, password })}
            accessoryLeft={ <MyIcon name="lock-outline" /> }
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            style={{ marginBottom: 10, color: '#000000' }} />
        </Layout>
        
        <Layout style={{ marginTop: height * 0.05 }}>
          <Button
            disabled={isPosting}
            accessoryRight={ <MyIcon name="log-in-outline" color={isPosting ? '#484E59' : '#FFFFFF'} /> }
            style={styles.button}
            onPress={handleLogin}>INGRESAR</Button>
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
  }
});
