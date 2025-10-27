import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
