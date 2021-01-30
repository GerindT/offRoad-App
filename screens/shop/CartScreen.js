import React, { useState,useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'react-native-paper';

import MyColors from "../../constants/MyColors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import * as cartActions from "../../store/actions/cart";

import * as index from "../../store/actions/index";
import * as ordersActions from "../../store/actions/orders";
import {languages} from "../../store/reducers/languages"; 

const CartScreen = props => {
  const {buy,rez} = useSelector(state =>  state.language)
  useEffect(() => {
    props.navigation.setParams({rez});
  },[rez]);
  const [isLoading, setIsLoading] = useState(false);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
  });

  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={MyColors.accent} />
        ) : (
          <Button
            color={MyColors.accent}
            mode="contained"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          >{buy}</Button>
        )}
      </Card>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions =navData =>{
  const rez= navData.navigation.getParam("rez");
  return {
  headerTitle: rez
  }
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: "solway-bold",
    fontSize: 18
  },
  amount: {
    color: MyColors.accent
  }
});

export default CartScreen;
