import { configureStore } from '@reduxjs/toolkit'

import booksReducer from './booksSlice'
import settingsReducer from './settingsSlice'

export default configureStore({
  reducer: {
    books: booksReducer,
    settings: settingsReducer,
  }
})