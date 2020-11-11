import { useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";

import {
  removeFromDisplayList,
  fetchDisplayList,
  addToDisplay,
} from "../reducer/table";

const StyledTable = styled.table`
  margin-top: 16px;

  td,
  th {
    border: 1px solid #999;
    padding: 0.5rem;
  }
`;

const Table = ({
  displayList,
  coinList,
  removeFromDisplayListAction,
  fetchDisplayListAction,
  addToDisplayAction,
}) => {
  const addToDisplay = (id) => {
    if (displayList.length < 10) {
      addToDisplayAction(id);
    }
  };

  const removeFromDisplay = (symbol) => {
    if (displayList.length > 1) {
      removeFromDisplayListAction(symbol);
    }
  };

  useEffect(() => {
    if (displayList === null) {
      fetchDisplayListAction();
    }
  });

  if (!displayList || !coinList) {
    return null;
  }

  const filteredCoins = coinList.filter(
    (info) =>
      displayList.findIndex(
        (displayedInfo) => displayedInfo.symbol === info.symbol
      ) === -1
  );

  return (
    <>
      {coinList && displayList ? (
        <select
          defaultValue={-1}
          onChange={(e) =>
            e.target.value !== -1 && addToDisplay(e.target.value)
          }
        >
          <option value={-1}> -- select an option -- </option>
          {filteredCoins.map((info) => (
            <option key={uuidv4()} value={info.id}>
              {info.name}
            </option>
          ))}
        </select>
      ) : null}
      <StyledTable>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayList
            ? displayList.map((info) => (
                <tr key={uuidv4()}>
                  <td>{info.rank}</td>
                  <th>{info.name}</th>
                  <td>{info.symbol}</td>
                  <td>{`$${info.price}`}</td>
                  <td>
                    <button onClick={() => removeFromDisplay(info.symbol)}>
                      REMOVE
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </StyledTable>
    </>
  );
};

export default connect(
  (state) => ({
    displayList: state.table.displayList,
    coinList: state.table.coinList,
  }),
  (dispatch) => ({
    removeFromDisplayListAction: (symbol) =>
      dispatch(removeFromDisplayList(symbol)),
    fetchDisplayListAction: () => dispatch(fetchDisplayList()),
    addToDisplayAction: (id) => dispatch(addToDisplay(id)),
  })
)(Table);
