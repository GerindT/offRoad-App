import React, { useState, useEffect, useCallback, useReducer } from "react";
import { Button } from 'react-native-paper';
import {
  KeyboardAvoidingView,
  View,
  
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { useDispatch,useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import MyColors from "../../constants/MyColors";

import * as authActions from "../../store/actions/auth";
import * as index from "../../store/actions/index";
import {languages} from "../../store/reducers/languages"; 


const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  

  const {email,error_email,password,error_password,acc,noacc,signup,login,e} = useSelector(state =>  state.language)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignUp, setSignUp] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
     
      Alert.alert(e, error, [{ text: "Ok" }]);
      }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
    } else {
      action = authActions.login(formState.inputValues.email, formState.inputValues.password);
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView keyboardVerticalOffset="50" behavior="height" style={styles.screen}>
    <LinearGradient colors={["#FF8008", "#FFC837"]} style={styles.gradient}>
      <Card style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            id="email"
            label={email}
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText={error_email}
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <Input
            id="password"
            label={password}
            keyboardType="default"
            secureTextEntry
            required
            minLength={6}
            autoCapitalize="none"
            errorText={error_password}
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <View style={styles.btn}>
            {isLoading ? (
              <ActivityIndicator size="small" color={MyColors.accent} />
            ) : (
              <Button
              mode="contained"
                color={MyColors.primary}
                onPress={authHandler}
              >{isSignUp ? signup : login}</Button>
            )}
          </View>
          <Button
        mode="contained"
            color={MyColors.primary}
            onPress={() => {
              setSignUp(prevState => !prevState);
            }}
          >{isSignUp ? acc : noacc}</Button>
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

        </ScrollView>
      </Card>
    </LinearGradient>
  </KeyboardAvoidingView>
);
};


AuthScreen.navigationOptions = {
  headerTitle: "OffRoad"
};
const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btn: {
    marginVertical: 5
  },
  buttonStyleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
     marginTop: 5,
   }
});
export default AuthScreen;
