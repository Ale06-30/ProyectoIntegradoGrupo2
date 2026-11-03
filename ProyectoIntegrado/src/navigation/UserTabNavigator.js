// Importamos la función que permite crear una navegación mediante pestañas inferiores.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importamos nuestras pantallas.
import ProductosUser from '../screens/ProductosUser';
import SeguimientoUser from '../screens/SeguimientoUser';
import SesionUser from '../screens/SesionUser';

// Importamos los iconos
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function UserTabNavigator() {

    return (

        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#7C3AED',
                tabBarInactiveTintColor: '#71719A',
                tabBarStyle: {
                    backgroundColor: '#13131A'
                },
                tabBarShowLabel: false
            }}
        >

            <Tab.Screen
                name="Productos"
                component={ProductosUser}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                            name="shopping-cart"
                            size={24}
                            // Cambia de color automáticamente según esté seleccionado o no
                            color={focused ? '#FACC15' : '#9CA3AF'}
                        />
                    ),
                    headerShown: false 
                }}
            />

            <Tab.Screen
                name="Seguimiento"
                component={SeguimientoUser}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons name="local-shipping" size={24} color={focused ? '#FACC15' : '#9CA3AF'} />
                    ),
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Sesion"
                component={SesionUser}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons name="logout" size={24} color={focused ? '#FACC15' : '#9CA3AF'}/>
                    ),
                    headerShown: false
                }}
            />

        </Tab.Navigator>

    );
}