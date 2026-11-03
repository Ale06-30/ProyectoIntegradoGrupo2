// NavigationContainer es el contenedor principal de React Navigation.
import { NavigationContainer } from '@react-navigation/native';
<<<<<<< HEAD

// Importamos nuestra navegación inferior.
import LoginStackNavigator from './LoginStackNavigator';
=======
import BottomTabNavigator from './BottomTabNavigator';

>>>>>>> 25f016a494fa67988505977ccdbe8ebb9d33b785

export default function RootNavigator() {

    return (

        // Toda nuestra navegación estará dentro del NavigationContainer.

        <NavigationContainer>

<<<<<<< HEAD
            <LoginStackNavigator />
=======
            <BottomTabNavigator />
>>>>>>> 25f016a494fa67988505977ccdbe8ebb9d33b785
            
        </NavigationContainer>

    );
}