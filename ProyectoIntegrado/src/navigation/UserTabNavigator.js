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
                tabBarActiveTintColor: '#e60f0f',
                tabBarInactiveTintColor: '#111f7a',
                tabBarStyle: {
                    backgroundColor: '#c8c8cb'
                },
                tabBarShowLabel: false
            }}
        >

            <Tab.Screen
                name="Productos"
                component={ProductosUser}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons name="shopping-cart" size={24} color="black" />
                    )
                }}
            />

            <Tab.Screen
                name="Seguimiento"
                component={SeguimientoUser}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons name="local-shipping" size={24} color="black" />
                    )
                }}
            />

            <Tab.Screen
                name="Sesion"
                component={SesionUser}
                options={{
                    tabBarIcon: () => (
                        <MaterialIcons name="logout" size={24} color="black" />
                    )
                }}
            />

        </Tab.Navigator>

    );
}