import { useAccountId } from "near-social-vm";
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const NFTGrid = () => {
  const [tokens, setTokens] = useState([]);
  const totalCollectibles = 44;
  const placeholder = "https://shard.dog/v2/img/sharddogcomicicon.jpeg"; // Placeholder image path
  const accountId = useAccountId();
  const fetchTokens = () => {
    fetch("https://graph.mintbase.xyz/mainnet", {
      method: "POST",
      headers: {
        "mb-api-key": "omni-site",
        "Content-Type": "application/json",
        "x-hasura-role": "anonymous",
      },
      body: JSON.stringify({
        query: `
	   query MyQuery($accountId: String!) {
		 mb_views_nft_tokens(
		   where: { nft_contract_id: { _eq: "comic.sharddog.near" }, owner: { _eq: $accountId }}
		   order_by: { minted_timestamp: desc }
		 ) {
		   media
		   token_id
		 }
	   }
	 `,
        variables: { accountId: accountId },
      }),
    })
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => {
        const fetchedTokens = data.data.mb_views_nft_tokens;
        if (fetchedTokens.length > 0) {
          setTokens([...tokens, ...fetchedTokens]); // Update the tokens state
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error as needed
      });
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderPanel = (start, end, columns = 2) => (
    <>
      <div
        className={`panel${columns === 1 ? " single-column" : ""}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: end - start + 1 }, (_, index) => {
          const tokenIndex = start + index - 1;
          const token = tokens.find((_, i) => i === tokenIndex) || {};
          return (
            <div key={index} className="nut">
              <img
                src={token.media || placeholder}
                alt={`Collectible ${tokenIndex + 1}`}
                onClick={() => handleImageClick(token.media || placeholder)}
              />
            </div>
          );
        })}
        <hr className="dashed-2" />
      </div>
    </>
  );

  return (
    <div className="comic-wrapper">
      <div className="dividing-canopy"></div>
      <div className="comic-context-title">
        <div className="context-title-text">ShardDog The Comic</div><br/>
        <small style={{fontSize:"11px", textTransform: "none"}}>Collect them all from @ShardDog posts. <br/>As you collect them, you will see them fill-in the spots below.</small>
      </div>
      <div className="comic-layout">
        <div className="nft-grid">
          {renderPanel(1, 1, 1)}
          {renderPanel(2, 7)}
          {renderPanel(8, 13)}
          {renderPanel(14, 19)}
          {renderPanel(20, 25)}
          {renderPanel(26, 31)}
          {renderPanel(32, 37)}
          {renderPanel(38, 43)}
          {renderPanel(44, 44, 1)}
          {/* Modal */}
          {selectedImage && (
            <div className="comic-modal">
              <div className="comic-modal-content">
                <button onClick={closeModal} className="btn btn-primary">
                  Close
                </button>
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src={selectedImage}
                      alt="Selected Collectible"
                      className="comic-zoomable-image"
                      style={{ width: "100%", height: "100%", maxWidth: "1024px", objectFit: "contain" }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTGrid;
