import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,

  Platform,
  ActivityIndicator,
  StyleSheet,
  RefreshControl
} from "react-native";
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ActionButton from '@logvinme/react-native-action-button';


import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import MyColors from "../../constants/MyColors";




const ProductsOverviewScreen = (props) => {
  const {details_m,nopost,e_2,buy,all_p} = useSelector(state =>  state.language)
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.setParams({all_p});
  },[all_p]);
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadProducts);

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errText}>{e_2} </Text>
        <Button title="Provoni perseri" color={MyColors.accent} onPress={loadProducts} />
        <ActionButton
          buttonColor="#ff4d00"
          onPress={() => {props.navigation.navigate("EditProduct");
        }}/>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={MyColors.accent} />
        <ActionButton
          buttonColor="#ff4d00"
          onPress={() => {
          props.navigation.navigate("EditProduct");
          }}/>
      </View>

    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errText}>{nopost}</Text>
        <ActionButton
        buttonColor="#ff4d00"
        onPress={() => {
        props.navigation.navigate("EditProduct");
        }}/>
      </View>
    );
  }

  return (
    <>
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={loadProducts}
          colors={[MyColors.accent]}
        />
      }
      showsVerticalScrollIndicator={false}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
           mode="contained"
            color={MyColors.primary}

            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >{details_m}</Button>
          <Button
           mode="contained"
            color={MyColors.primary}
         
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          >{buy}</Button>
        </ProductItem>
        
      )}
    />
    <ActionButton
  buttonColor="#ff4d00"

  onPress={() => {
  props.navigation.navigate("EditProduct");
  }}
/>

</>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  const all_p = navData.navigation.getParam("all_p");
  return {
    headerTitle: all_p,
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
          title="Rezervimet"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
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

export default ProductsOverviewScreen;
