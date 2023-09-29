import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from "./app/screens/HomeScreen";
import Login from "./app/screens/Login";
import StartScreen from "./app/screens/StartScreen";
import { PerfilScreen } from './app/screens/PerfilScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from "@expo/vector-icons";
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from "./UserContext"; // Importa el UserProvider
import { enableScreens } from 'react-native-screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

enableScreens();
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue', // Color del ícono activo
        tabBarInactiveTintColor: 'gray', // Color del ícono inactivo
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen" >
      <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    
    </NavigationContainer>
    
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
