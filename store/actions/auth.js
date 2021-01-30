import { AsyncStorage } from "react-native";
import { useSelector } from "react-redux";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogOutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userId,
      token
    });
  };
};

export const signup = (email, password) => {
 
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAakK1AQKCjRPy36bkheTDq7QXQJaT0eAA ",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const resError = await response.json();
      const errorId = resError.error.message;
      let message = "Dicka shkoi keq.";
      if (errorId === "EMAIL_EXISTS") {
        message = "Adresa e emailit është tashmë në përdorim nga një llogari tjetër.";
    
      } else if (errorId === "OPERATION_NOT_ALLOWED") {
        message = "Identifikimi me fjalëkalim është çaktivizuar.";
      } else if (errorId === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        message =
          "Ne kemi bllokuar të gjitha kërkesat nga kjo pajisje për shkak të një aktiviteti të pazakontë. Provo përsëri më vonë.";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    const expirationTime = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationTime);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAakK1AQKCjRPy36bkheTDq7QXQJaT0eAA ",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const resError = await response.json();
      const errorId = resError.error.message;
      let message = "Dicka shkoi keq.";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "Nuk ka asnjë rekord përdoruesi që korrespondon me këtë email.";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Fjalëkalim i pasaktë! Ju lutemi kontrolloni përsëri fjalëkalimin tuaj.";
      } else if (errorId === "USER_DISABLED") {
        message = "Llogaria është çaktivizuar.";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    const expirationTime = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationTime);
  };
};

export const logOut = () => {
  clearLogOutTimer();
  AsyncStorage.removeItem("userData");
  return {
    type: LOGOUT
  };
};

const clearLogOutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogOutTimer = time => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logOut());
    }, time);
  };
};

const saveDataToStorage = (token, userId, expirationTime) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationTime.toISOString()
    })
  );
};
