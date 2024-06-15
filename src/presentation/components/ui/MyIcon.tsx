import { Icon } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

interface Props {
    name: string;
    color?: string;
    white?: boolean;
};

export const MyIcon = ({ name, color }: Props) => {

    return <Icon style={styles.icon} fill={color} name={name} />;
};

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
    },
});
