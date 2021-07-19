import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      fontSize: 22,
      fontWidth: 13.20,
      wordSpacing: -5,
      pageMarginHorizontal: 0,
      pageMarginVertical: 0,
      lineSpacing: 0,
      currentBookId: 'iii'
    },
    reducers: {
      edit: (state, action) => {
        return {...state, ...action.payload}
      }
    }
  })

  export const { edit } = settingsSlice.actions

  export default settingsSlice.reducer