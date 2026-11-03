import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';


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


        </Stack.Navigator>
    );
}
