import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Platform, View, SafeAreaView } from "react-native";
import { Button } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { useDispatch,useSelector } from "react-redux";
import * as index from "../store/actions/index";
import {languages} from "../store/reducers/languages"; 

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import MyColors from "../constants/MyColors";
import UserProductsScreen from "../screens/user/UserProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartUpScreen from "../screens/StartUpScreen";
import * as authActions from "../store/actions/auth";




const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? MyColors.primary : ""
  },
  headerTitleStyle: {
    fontFamily: "solway-bold"
  },
  headerBackTitleStyle: {
    fontFamily: "solway-regular"
  },
  headerTintColor: Platform.OS === "android" ? "white" : MyColors.primary
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {

    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen
  },
  {
    navigationOptions: {
    
    
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminNavigator = createStackNavigator(
  {
    Admin: UserProductsScreen,
    EditProduct: EditProductScreen
  },
  {
    navigationOptions: {
    
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
       
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const ShopNavigator = createDrawerNavigator(
  { 
    Posts: ProductsNavigator,
    Orders: OrdersNavigator,
    Add: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: MyColors.primary
    },
    contentComponent: props => {
      const {log_out} = useSelector(state =>  state.language)

      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
      
      mode="contained"
              color={MyColors.primary}
              onPress={() => {
                dispatch(authActions.logOut());
                // props.navigation.navigate("Auth");
              }}
            >{log_out}</Button>
             <View style={{flexDirection: 'row'}}>
            <View style={{flex:1 , marginRight:10, marginTop: 5,}} >
            <Button
            
            
            
              color={MyColors.primary}
              onPress={()=>{
                dispatch(index.selectLanguage(languages.english))
              }}
              >English</Button>
            </View>
            <View style={{flex:1, marginTop: 5,}} >
            <Button
             
            
     
              color={MyColors.primary}
              onPress={()=>{
                dispatch(index.selectLanguage(languages.albanian))
              }}
              >Shqip</Button>
            </View>
 </View>
          </SafeAreaView>
        </View>
      );
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  StartUp: StartUpScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);
