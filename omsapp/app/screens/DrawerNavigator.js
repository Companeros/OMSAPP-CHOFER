import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Perfil from "./PerfilScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      {/* Otras pantallas del menú */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
