import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import './App.css';

import Table from './components/Table';
import reducer from './reducer';

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware()
});

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <Table />
        </header>
      </div>
    </Provider>
  );
}

export default App;
