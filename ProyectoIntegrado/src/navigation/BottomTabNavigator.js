
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import admin1Screen from '../screens/admin1Screen';
import IAadminStackNavigator from './IAadminStackNavigator';
import admin3Screen from '../screens/admin3Screen';
import admin4Screen from '../screens/admin4Screen';

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

            {/* Primera opción: Panel principal */}
            <Tab.Screen
                name="admin1"
                component={admin1Screen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons
                            name="robot-industrial"
                            size={24}
                            color={focused ? '#38BDF8' : '#71717A'}
                        />
                    ),
                    headerShown: false
                }}
            />

            {/* Segunda opción: Inventario y análisis con IA */}
            <Tab.Screen
                name="Admin2"
                component={IAadminStackNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="stock"
                            size={24}
                            color={focused ? '#38BDF8' : '#71717A'}
                        />
                    ),
                    headerShown: false
                }}
            />

            {/* Tercera opción: Pedidos */}
            <Tab.Screen
                name="Admin4"
                component={admin4Screen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons
                            name="clipboard-list-outline"
                            size={24}
                            color={focused ? '#38BDF8' : '#71717A'}
                        />
                    ),
                    headerShown: false
                }}
            />

            {/* Cuarta opción: Cerrar sesión */}
            <Tab.Screen
                name="Admin3"
                component={admin3Screen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color={focused ? '#38BDF8' : '#71717A'}
                        />
                    ),
                    headerShown: false
                }}
            />

        </Tab.Navigator>

    );
}
