import { createSlice, nanoid, createEntityAdapter } from '@reduxjs/toolkit'

const booksAdapter = createEntityAdapter({
})

export const {
  selectAll: selectAllBooks,
  selectIds: selectBookIds,
  selectById: selectBookById,
} = booksAdapter.getSelectors((state) => state.books)

// const initialState = [
//   { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     title: 'филосовский камень',
//     author: 'дж к роалинг',
//     currentPage: 403,
//     totalPages: 403 },
//   { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     title: 'орден феникса',
//     author: 'дж к роалинг',
//     currentPage: 42,
//     totalPages: 508 },
//   { id: '58694a0f-3da1-471f-bd96-145571e29d72',
//     title: 'кубок онгня',
//     author: 'дж к роалинг',
//     currentPage: 0,
//     totalPages: 507 }
// ]

const booksSlice = createSlice({
  name: 'books',
  initialState: booksAdapter.getInitialState(),
  reducers: {
    addBook(state, action) {
      booksAdapter.addOne(state, {...action.payload, currentPage: 0, id:nanoid()})
    },
    updateBook(state, action) {
      console.log('udpatebook', action)
      booksAdapter.updateOne(state, action.payload)
    },
  }
})

export const {
  addBook,
  updateBook,
} = booksSlice.actions

export default booksSlice.reducer