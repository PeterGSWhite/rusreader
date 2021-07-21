import booksReducer from './booksSlice'
import settingsReducer from './settingsSlice'
import { combineReducers } from 'redux'

export default combineReducers({
    booksReducer,
    settingsReducer
})