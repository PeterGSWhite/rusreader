import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      fontSize: 22,
      fontWidth: 13.20,
      wordSpacing: -5,
      pageMarginHorizontal: 10,
      pageMarginVertical: 10,
      lineSpacing: 0,
    },
    reducers: {
      edit: (state, action) => {
        return {...state, ...action.payload}
      }
    }
  })

  export const { edit } = settingsSlice.actions

  export default settingsSlice.reducer