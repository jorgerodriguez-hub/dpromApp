import { launchCamera } from "react-native-image-picker";

export class CameraAdapter {

    static async takePicture(): Promise<string[]> {

        const response = await launchCamera({
            mediaType: 'photo',
            quality: 0.7,
            cameraType: 'back',
            includeBase64: true
        });

        if ( response.assets && response.assets[0].uri ) {
            return [response.assets[0].uri];
        }

        return [];

    }

}