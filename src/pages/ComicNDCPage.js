import { useAccountId } from "near-social-vm";
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const NFTGrid = () => {
  const totalCollectibles = 44;
  const placeholder = "https://shard.dog/v2/img/sharddogcomicicon.jpeg"; // Placeholder image path
  const accountId = useAccountId();
  const initializeTokens = () => {
    return Array.from({ length: totalCollectibles }, (_, index) => ({
      media: placeholder,
      token_id: index + 1,
    }));
  };

  const [tokens, setTokens] = useState(initializeTokens());

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
		   order_by: { token_id: asc }
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
        const updatedTokens = [...tokens];
        fetchedTokens.forEach((token) => {
          const position = parseInt(token.token_id.split(":")[0], 10) - 1; // Extract the number before the colon
          updatedTokens[position] = token;
        });
        setTokens(updatedTokens);
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
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const handleImageClick = (image, tokenId) => {
    setSelectedImage(image);
    setSelectedTokenId(tokenId);
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
        {tokens.slice(start - 1, end).map((token, index) => (
          <div key={index} className="nut">
            <img
              src={token.media}
              alt={`Collectible ${token.token_id}`}
              onClick={() =>
                handleImageClick(
                  token.media,
                  token.token_id.includes(":")
                    ? token.token_id.split(":")[0]
                    : token.token_id
                )
              }
            />
          </div>
        ))}
        <hr className="dashed-2" />
      </div>
    </>
  );

  return (
    <div className="comic-wrapper">
      <div className="dividing-canopy"></div>
      <div className="comic-context-title">
        <div className="context-title-text">
          <h2>NDC The Comic</h2>
        </div>
        <br />
        <small
          style={{
            fontSize: "11px",
            textTransform: "none",
            lineHeight: "12px",
          }}
        >
          Collect all panels from{" "}
          <a
            href="https://shard.dog/comic"
            target="_blank"
            style={{ color: "#fff" }}
          >
            shard.dog/comic
          </a>
          <br />
          Claim new panels daily to fill the spots below
        </small>
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
                </button>{" "}
                <a
                  href={`https://shard.dog/ndccomic?t=${selectedTokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comic-link"
                >
                  Claim on shard.dog/ndccomic?t={selectedTokenId}
                </a>
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src={selectedImage}
                      alt="Selected Collectible"
                      className="comic-zoomable-image"
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: "720px",
                        maxWidth: "1024px",
                        objectFit: "contain",
                      }}
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
