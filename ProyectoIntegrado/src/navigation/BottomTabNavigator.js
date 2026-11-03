// Importamos la función que permite crear una navegación mediante pestañas inferiores.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importamos nuestras pantallas.
import admin1Screen from '../screens/admin1Screen';
import admin2Screen from '../screens/admin2Screen';
import admin3Screen from '../screens/admin3Screen';
// Importamos el Stack de eventos.


//Importamos los iconos

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialIcons2 from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {

    return (

        <Tab.Navigator
             screenOptions={{
                tabBarActiveTintColor: '#e60f0f',
                tabBarInactiveTintColor: '#111f7a',
                tabBarStyle: {
                    backgroundColor: '#c8c8cb'
                },
                tabBarShowLabel: false
            }}
        >

            {/* Primera opción del menú inferior. */}

            <Tab.Screen
                name="admin1"
                component={admin1Screen}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons name="admin-panel-settings" size={24} color="black" />
                    )    
                }}
            />

            <Tab.Screen
                name="Admin2"
                component={admin2Screen}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons2 name="admin-panel-settings" size={24} color="black" />
                    )    
                }}
            />

             <Tab.Screen
                name="Admin3"
                component={admin3Screen}
                options={{
                    tabBarIcon: () => (
                        <AntDesign name="profile" size={24} color="black" />
                    )    
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