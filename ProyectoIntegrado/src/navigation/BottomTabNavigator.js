// Importamos la función que permite crear una navegación mediante pestañas inferiores.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importamos nuestras pantallas.
import admin1Screen from '../screens/admin1Screen';
import admin2Screen from '../screens/admin2Screen';

// Importamos el Stack de eventos.


//Importamos los iconos

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialIcons2 from '@expo/vector-icons/MaterialIcons';
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
                name="Admin1"
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


            {/* 
                Segunda opción.

                En lugar de colocar directamente EventsScreen, colocamos nuestro EventStackNavigator.
                Esto permite tener un Stack dentro del Bottom Navigation.
            */}

           
           
           

            
            

           

           


        </Tab.Navigator>

    );
}