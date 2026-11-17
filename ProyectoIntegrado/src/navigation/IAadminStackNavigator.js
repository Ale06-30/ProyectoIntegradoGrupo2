
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import admin2Screen from '../screens/admin2Screen';
import AnalisisIAScreen from '../screens/AnalisisIAScreen';

const Stack = createNativeStackNavigator();

export default function IAadminStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Inventario"
                component={admin2Screen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="AnalisisIA"
                component={AnalisisIAScreen}
                options={{
                    title: 'Análisis con IA',
                    headerTintColor: '#FFFFFF',
                    headerStyle: {
                        backgroundColor: '#18181B'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }}
            />
        </Stack.Navigator>
    );
}
