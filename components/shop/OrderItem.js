import React, { useState } from "react";
import { View, Text,  StyleSheet } from "react-native";
import { Button } from 'react-native-paper';
import { useSelector} from "react-redux";
import CartItem from "./CartItem";
import MyColors from "../../constants/MyColors";
import Card from "../UI/Card";

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);
  const {show,hide} = useSelector(state =>  state.language)

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        mode="contained"
        color={MyColors.primary}
        
        onPress={() => {
          setShowDetails(prevState => !prevState);
        }}
      >{showDetails ? hide : show}</Button>
      {showDetails && (
        <View style={styles.detailItems}>
          {props.items.map(cartItem => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center"
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: "solway-bold",
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: "solway-regular",
    color: "#888"
  },
  detailItems: {
    width: "100%"
  }
});

export default OrderItem;
