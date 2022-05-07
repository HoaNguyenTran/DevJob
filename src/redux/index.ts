import { createWrapper, MakeStore } from 'next-redux-wrapper'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import rootReducer from 'src/redux/rootReducers'
import rootSaga from 'src/redux/rootSagas'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'redux-persist/integration/react'

import { storageConstant } from 'src/constants/storageConstant'

const { persistReducer } = require('redux-persist')

const sagaMiddleware = createSagaMiddleware()

let store

export const makeStore: MakeStore<Store.RootState> = () => {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // store = makeConfiguredStore(rootReducer)
    store = createStore(
      rootReducer,
      undefined,
      composeWithDevTools(applyMiddleware(sagaMiddleware)),
    )
    sagaMiddleware.run(rootSaga)

    return store
  }

  const persistConfig = {
    key: storageConstant.localStorage.persistRoot,
    whitelist: ['initData', 'user', 'notification', 'userCompany'],
    storage: AsyncStorage,
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)
  // store = makeConfiguredStore(persistedReducer)
  store = createStore(
    persistedReducer,
    undefined,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  )
  sagaMiddleware.run(rootSaga)

  return store
}

export const wrapper = createWrapper<Store.RootState>(makeStore)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<Store.RootState> = useSelector
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector



