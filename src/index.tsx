import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import { createFirestoreInstance } from 'redux-firestore'
import { store } from './store'
import firebase, { auth, firestore } from './firebase'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'

const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true
}

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
}

ReactDOM.render(
    <>
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <React.StrictMode>
                </React.StrictMode>
                <App />
            </ReactReduxFirebaseProvider>
        </Provider>
    </>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
