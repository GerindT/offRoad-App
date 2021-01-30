import React,{useEffect} from "react";
import {
  FlatList,

  Platform,
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from "react-native";
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import MyColors from "../../constants/MyColors";
import * as productsActions from "../../store/actions/products";

const UserProductsScreen = props => {
  const {delete_m,delete_m2,nopost,del,chang,your_p} = useSelector(state =>  state.language);
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();
  

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
  };
  useEffect(() => {
    props.navigation.setParams({your_p});
  },[your_p]);
  
  const deleteHandler = id => {
    Alert.alert(delete_m, delete_m2, [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errText}>{nopost}</Text>
      </View>
    );
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
             mode="contained"
            color={MyColors.primary}
           
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          >{chang}</Button>
          <Button
           mode="contained"
            color={MyColors.primary}
       
            onPress={deleteHandler.bind(this, itemData.item.id)}
          >{del}</Button>
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  const your_p = navData.navigation.getParam("your_p");

  return {
    headerTitle: your_p,
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Shto"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errText: {
    fontFamily: "solway-bold",
    fontSize: 20,
    margin: 20,
    textAlign: "center"
  }
});

export default UserProductsScreen;
