import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { Widget } from "near-social-vm";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import Confetti from "react-confetti";
//import "../claim.css";

export default function Claim({ params }) {
  const [isClient, setIsClient] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const r = queryParams.get("r");
  const username = queryParams.get("username");

  const [claimData, setClaimData] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletURL, setWalletURL] = useState("");

  useEffect(() => {
    // Fetch the stored URL from local storage when the component mounts
    setWalletURL(localStorage.getItem("fastWallet"));
  }, []);

  const handleCreateWalletClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Save My New NEAR Wallet",
          text: "I am saving this for the future so I can access my recently claimed NFT and NEAR wallet",
          url: walletURL,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const nameCheckRef = useRef(null);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  };

  const { width, height } = useWindowSize();
  useEffect(() => {
    if (id) {
      // to avoid fetching when id is undefined
      fetch(`http://localhost:8080/api/getClaimInfo/${id}`)
        .then((response) => response.json())
        .then((data) => setClaimData(data[0]), setIsSuccess(true));
    }
  }, [id]);

  if (!claimData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isSuccess && (
        <Confetti
          width={width}
          height={height}
          confettiSource={{ w: 100, h: 10, x: width / 2, y: 20 }}
          initialVelocityX={8}
          initialVelocityY={10}
          recycle={false}
          numberOfPiecess={2000}
          gravity={0.1}
        />
      )}
      <div id="centerCard">
        <div className="center-box">
          <div className="half-image">
            <p>Claim Success for ID: {id}</p>
            <p>{username}</p>
            <h2>{r}</h2>
            <div id="welcome">Let's get your ShardDog</div>
            <br />
            <img
              src={claimData.image || "https://shard.dog/img/ShardDog.jpg"}
              className="image-div"
              id="poap"
              alt="ShardDog"
            />
          </div>

          <div id="topBlock">
            <h2 id="title">
              <span className="owner-div">{claimData.title}</span>
            </h2>
            <br />
            <h4>
              <div id="result"></div>
            </h4>
            <div id="walletLinks">
              <a
                href="https://mailchi.mp/nearweek.com/near-newsletter-123"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn" id="toggleButton">
                  Learn More
                </button>
              </a>
              <br />

              <div id="countdown"></div>
              <br />
              <b>Check out your ShardDogs:</b>
              <br />

              {walletURL && (
                <button id="createWalletBtn" onClick={handleCreateWalletClick}>
                  Save Your New Wallet
                </button>
              )}
              <br />
              <br />
              <b>You can also view on:</b>
              <br />
              <img
                src="https://shard.dog/img/meteor_icon.png"
                style={{
                  width: "25px",
                  marginLeft: "3px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
                alt="Meteor Wallet"
              />
              <a
                href="https://wallet.meteorwallet.app/wallet/nfts"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Meteor Wallet
              </a>
              <br />
              <img
                src="https://shard.dog/img/mintbase-symbol.png"
                style={{
                  width: "25px",
                  marginLeft: "3px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
                alt="Mintbase"
              />
              <a
                href="https://www.mintbase.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                id="mintbase"
              >
                View on Mintbase
              </a>
              <br />
              <img
                src="https://shard.dog/img/TradePort1.png"
                style={{
                  width: "25px",
                  marginLeft: "3px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              <a
                href="https://www.tradeport.xyz/near/"
                target="_blank"
                id="tradeport"
              >
                View on Tradeport
              </a>
              <br />
              <small>
                <i>
                  If you want to learn more about what we are building with{" "}
                  <a
                    href="https://twitter.com/sharddog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ShardDog, follow us on Twitter
                  </a>
                </i>
              </small>
              <br />
              <img
                src="https://shard.dog/img/ShardDogLogo.png"
                width="100px"
                alt="ShardDog Logo"
              />
            </div>
          </div>
        </div>
        <br />
        <div id="card-footer">
          <img
            src="https://shard.dog/v2/images/built_nomargin.svg"
            alt="Built on NEAR"
            width="100px"
          />{" "}
          | By
          <a
            href="https://twitter.com/ready_layer_one"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ready Layer One
          </a>
        </div>
      </div>
    </>
  );
}
