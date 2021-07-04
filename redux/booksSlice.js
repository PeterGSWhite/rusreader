import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = [
  { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'филосовский камень',
    author: 'дж к роалинг',
    currentPage: 403,
    totalPages: 403 },
  { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'орден феникса',
    author: 'дж к роалинг',
    currentPage: 42,
    totalPages: 508 },
  { id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'кубок онгня',
    author: 'дж к роалинг',
    currentPage: 0,
    totalPages: 507 }
]

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    bookAdded: {
      reducer(state, action) {
        action.payload.currentPage = 0
        state.push(action.payload)
      }
    }
  }
})

export default booksSlice.reducer