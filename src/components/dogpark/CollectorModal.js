import React, { useState, useEffect } from "react";
import axios from "axios";

const CollectorsModal = ({ isOpen, onClose, seriesId }) => {
  const [collectors, setCollectors] = useState([]);
  const [filteredCollectors, setFilteredCollectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (seriesId) {
      const fetchData = async () => {
        const data = JSON.stringify({
          query: `query getCollectors {
			nft_tokens(
			  where: {nft_contract_id: {_eq: "mint.sharddog.near"}, token_id: {_regex: "^${seriesId}:"}}
			) {
			  minted_timestamp
			  token_id
			  owner
			}
		  }`,
          variables: {},
        });
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://graph.mintbase.xyz/mainnet",
          headers: {
            "mb-api-key": "anon",
            "Content-Type": "application/json",
          },
          data: data,
        };

        try {
          const response = await axios(config);
          const collectorsData = response.data.data.nft_tokens;
          setCollectors(collectorsData);
          setFilteredCollectors(collectorsData);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData().catch((error) => console.error(error));
    }
  }, [seriesId]);

  useEffect(() => {
    const searchResults = collectors.filter((collector) =>
      collector.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollectors(searchResults);
  }, [searchTerm, collectors]);

  function formatDateUTC(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function removeNearSuffix(owner) {
    return owner.replace(".near", "");
  }

  function handleUsernameClick(username) {
    alert(`You clicked on username: ${username}`);
  }

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${isOpen ? "" : "hidden"}`}
    >
      {/* ...rest of the component... */}
      {filteredCollectors.map((collector, index) => (
        <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : ""}`}>
          <td className="w-half px-4 py-2">
            <span
              onClick={() =>
                handleUsernameClick(removeNearSuffix(collector.owner))
              }
            >
              {removeNearSuffix(collector.owner).substring(0, 20)}{" "}
              {removeNearSuffix(collector.owner).length >= 20 && "..."}
            </span>
          </td>
          <td className="w-half px-4 py-2">
            {formatDateUTC(collector.minted_timestamp)}
          </td>
        </tr>
      ))}
      {/* ...rest of the component... */}
    </div>
  );
};

export default CollectorsModal;
