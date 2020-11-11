import { createReducer, createAction } from '@reduxjs/toolkit';

import requestHandler from "../utils/requests";
import { formatQuotes } from "../utils/helpers";


export const setDisplayList = createAction('table/SET_DISPLAY');
export const setCoinList = createAction('table/SET_COIN_LIST');

const fetchCoinError = createAction('api/FETCH_COIN_ERROR');
const fetchQuoteError = createAction('api/FETCH_QUOTE_ERROR');

export const fetchDisplayList = () => {
    return (dispatch) => {
      requestHandler
        .get("/map?sort=cmc_rank")
        .then((resp) => {
          const [first, second, third, fourth, fifth] = resp.data.data;
          dispatch(setCoinList(resp.data.data));
          const idString = [first, second, third, fourth, fifth]
            .map((ele) => ele.id)
            .join();
          return requestHandler.get(`/quotes?id=${idString}`);
        })
        .catch((err) => dispatch(fetchCoinError(err)))
        .then((resp) => {
          dispatch(setDisplayList(formatQuotes(resp.data.data)));
        })
        .catch((err) => dispatch(fetchQuoteError(err)));
    };
  };

  export const addToDisplay = (id) => {
    return (dispatch, getState) => {
      const displayList = getState().table.displayList;
      requestHandler
          .get(`/quotes?id=${id}`)
          .then((resp) => {
            const formattedArr = formatQuotes(resp.data.data);
            dispatch(setDisplayList(
              [...displayList, ...formattedArr].sort((a, b) => a.rank - b.rank)
            ));
          })
          .catch((err) => dispatch(fetchQuoteError(err)));
    }
  }


const INITIAL_STATE = {
    displayList: null,
    coinList: null,
    currError: null
}

const table = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(setDisplayList, (state, action) => {
            state.displayList = action.payload
        })
        .addCase(setCoinList, (state, action) => {
            state.coinList = action.payload
        })
        .addCase(fetchCoinError, (state, action) => {
            console.log(action.payload)
            state.error = action.payload
        })
        .addCase(fetchQuoteError, (state, action) => {
            console.log(action.payload)
            state.error = action.payload
        })
});

export default table;
