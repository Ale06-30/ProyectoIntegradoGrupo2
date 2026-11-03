// Importamos la función que permite crear una navegación mediante pestañas inferiores.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importamos nuestras pantallas.
import admin1Screen from '../screens/admin1Screen';
import admin2Screen from '../screens/admin2Screen';
import admin3Screen from '../screens/admin3Screen';
// Importamos el Stack de eventos.


//Importamos los iconos

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {

    return (

        <Tab.Navigator
             screenOptions={{
                tabBarActiveTintColor: '#0284C7',
                tabBarInactiveTintColor: '#71717A',
                tabBarStyle: {
                    backgroundColor: '#18181B'
                },
                tabBarShowLabel: false
            }}
        >

            {/* Primera opción del menú inferior. */}

            <Tab.Screen
                name="admin1"
                component={admin1Screen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name="robot-industrial" size={24} color={focused ? '#38BDF8' : '#71717A'} />
                    ),
                    headerShown: false    
                }}
            />

            <Tab.Screen
                name="Admin2"
                component={admin2Screen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <AntDesign name="stock" size={24} color={focused ? '#38BDF8' : '#71717A'} />
                    ),
                    headerShown: false    
                }}
            />

             <Tab.Screen
                name="Admin3"
                component={admin3Screen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons name="logout" size={24} color={focused ? '#38BDF8' : '#71717A'} />
                    ),
                    headerShown: false    
                }}
            />

            {/* 
                Segunda opción.

                En lugar de colocar directamente EventsScreen, colocamos nuestro EventStackNavigator.
                Esto permite tener un Stack dentro del Bottom Navigation.
            */}

           
           
           

            
            

           

           


        </Tab.Navigator>

    );
}