/* eslint-disable no-unused-vars */

import { createSlice } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotif: (state, action) => action.payload,
    resetNotif: (state, action) => ''
  },

})

export const notifChange = (message, type, duration) => {
  return dispatch => {
    dispatch(setNotif({ message, type }))
    setTimeout(() => {
      dispatch(resetNotif())
    }, duration * 1000)
  }
}

export default notifSlice.reducer
export const { setNotif, resetNotif } = notifSlice.actions