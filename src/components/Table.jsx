import { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import requestHandler from "../utils/requests";
import { formatQuotes } from "../utils/helpers";

const StyledTable = styled.table`
  margin-top: 16px;

  td,
  th {
    border: 1px solid #999;
    padding: 0.5rem;
  }
`;

const Table = () => {
  const [blockChainInfo, setblockChainInfo] = useState(null);
  const [displayInfo, setDisplayInfo] = useState(null);

  const addToDisplay = (id) => {
    if (displayInfo.length < 10) {
      requestHandler
        .get(`/quotes?id=${id}`)
        .then((resp) => {
          const formattedArr = formatQuotes(resp.data.data);
          setDisplayInfo(
            [...displayInfo, ...formattedArr].sort((a, b) => a.rank - b.rank)
          );
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    requestHandler
      .get("/map?sort=cmc_rank")
      .then((resp) => {
        const [first, second, third, fourth, fifth] = resp.data.data;
        setblockChainInfo(resp.data.data);
        const idString = [first, second, third, fourth, fifth]
          .map((ele) => ele.id)
          .join();
        return requestHandler.get(`/quotes?id=${idString}`);
      })
      .catch((err) => console.log(err))
      .then((resp) => {
        setDisplayInfo(formatQuotes(resp.data.data));
      })
      .catch((err) => console.log(err));
  }, []);

  if (!blockChainInfo || !displayInfo) {
    return null;
  }

  const filteredCoins = blockChainInfo.filter(
    (info) =>
      displayInfo.findIndex(
        (displayedInfo) => displayedInfo.symbol === info.symbol
      ) === -1
  );

  return (
    <>
      {blockChainInfo && displayInfo ? (
        <select
          onChange={(e) =>
            e.target.value !== -1 && addToDisplay(e.target.value)
          }
        >
          <option selected value={-1}>
            {" "}
            -- select an option --{" "}
          </option>
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
            <th>rank</th>
            <th>name</th>
            <th>symbol</th>
            <th>price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayInfo
            ? displayInfo.map((info) => (
                <tr key={uuidv4()}>
                  <td>{info.rank}</td>
                  <th>{info.name}</th>
                  <td>{info.symbol}</td>
                  <td>{`$${info.price}`}</td>
                  <td
                    onClick={() =>
                      displayInfo.length > 1 &&
                      setDisplayInfo(
                        displayInfo.filter(
                          (displayed) => displayed.symbol !== info.symbol
                        )
                      )
                    }
                  >
                    REMOVE
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </StyledTable>
    </>
  );
};

export default Table;
