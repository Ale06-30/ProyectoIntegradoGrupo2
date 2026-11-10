import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductosUser from '../screens/ProductosUser';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CarritoScreen from '../screens/CarritoScreen';

import CartProvider from './CartContext';

const Stack = createNativeStackNavigator();

export default function ProductStackNavigator() {

    return (
        <CartProvider>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >

                <Stack.Screen
                    name="ProductosUser"
                    component={ProductosUser}
                />

                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                />

                <Stack.Screen
                    name="Carrito"
                    component={CarritoScreen}
                />

            </Stack.Navigator>
        </CartProvider>
    );
}