import { languages } from './languages'
const INITIAL_STATE = languages.albanian;
export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
      case 'language_data':
        return action.payload;
      default: 
       return state;
    }
  };