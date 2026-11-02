// NavigationContainer es el contenedor principal de React Navigation.
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';


export default function RootNavigator() {

    return (

        // Toda nuestra navegación estará dentro del NavigationContainer.

        <NavigationContainer>

            <BottomTabNavigator />
            
        </NavigationContainer>

    );
}