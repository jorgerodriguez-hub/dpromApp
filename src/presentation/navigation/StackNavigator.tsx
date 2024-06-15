import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/form/RegisterScreen';
import { ViewRegister } from '../screens/form/ViewRegister';
import { EditionScreen } from '../screens/form/EditionScreen';
import { PDFViewer } from '../screens/home/PDFViewer';

export type RootStackParams = {
    LoginScreen: undefined;
    HomeScreen: undefined;
    RegisterScreen: undefined;
    EditionScreen: undefined;
    ViewRegister: undefined;
    PDFViewer: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    
      <Stack.Navigator 
      initialRouteName="LoginScreen"
      screenOptions={{
          headerShown: false,
      }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="EditionScreen" component={EditionScreen} />
        <Stack.Screen name="ViewRegister" component={ViewRegister} />
        <Stack.Screen name="PDFViewer" component={PDFViewer} />
      </Stack.Navigator>
    
  );
}