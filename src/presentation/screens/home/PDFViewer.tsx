import { Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { MyIcon } from '../../components/ui/MyIcon';
import { useNavigation } from '@react-navigation/native';

export const PDFViewer = () => {

    const { canGoBack, goBack } = useNavigation();
    const source = { uri: 'bundle-assets://pdf/MANUAL_DE_USUARIO_APP_EPSJ.pdf', cache: true };

    const renderBackAction = () => {
        return (
          <TopNavigationAction
            icon={ <MyIcon name="arrow-back-outline" color="#FFFFFF" /> }
            onPress={goBack}
          />
        );
    };

  return (
    <Layout style={{ flex: 1 }}>
        <TopNavigation
            title={props => <Text style={[{ color: 'white', fontWeight: 'bold' }]}>GUÍA / MANUAL DE USO</Text>}
            alignment="center"
            accessoryLeft={ canGoBack() ? renderBackAction : undefined }
            style={styles.navigation}
        />
            <Pdf
                source={source}
                onLoadComplete={(numberOfPages,filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf} />
    </Layout>
  );
};

const styles = StyleSheet.create({
    navigation: {
        backgroundColor: '#191919'
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height
    }
});