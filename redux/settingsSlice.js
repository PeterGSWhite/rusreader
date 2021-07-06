import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      fontSize: 22,
      fontWidth: 11.97,
      wordSpacing: 0,
      realWordSpacing: 5.46,
      pageMarginHorizontal: 10,
      pageMarginVertical: 10
    },
    reducers: {
      edit: (state, action) => {
        return {...state, ...action.payload}
      }
    }
  })

  export const { edit } = settingsSlice.actions

  export default settingsSlice.reducer