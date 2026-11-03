import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserTabNavigator from '../navigation/UserTabNavigator'; // Ajusta la ruta según dónde lo tengas guardado
import AdminTabNavigator from '../navigation/BottomTabNavigator'

const Stack = createNativeStackNavigator();


export default function LoginStackNavigator() {

    return (

        <Stack.Navigator

            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#F39C12'
                }
            }}

        >

            {/* LOGIN */}

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false
                }}
            />


            {/* REGISTRO */}

            <Stack.Screen
                name="Registrar"
                component={RegisterScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="admin"
                component={AdminTabNavigator}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="user"
                component={UserTabNavigator}
                options={{
                    headerShown: false
                }}
            />


        </Stack.Navigator>
    );
}
