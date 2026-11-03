// NavigationContainer es el contenedor principal de React Navigation.
import { NavigationContainer } from '@react-navigation/native';
// Importamos nuestra navegación inferior.
import LoginStackNavigator from './LoginStackNavigator';


export default function RootNavigator() {

    return (

        // Toda nuestra navegación estará dentro del NavigationContainer.

        <NavigationContainer>

            <LoginStackNavigator />            
        </NavigationContainer>

    );
}