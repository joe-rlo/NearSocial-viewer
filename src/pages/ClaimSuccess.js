import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import Confetti from 'react-confetti'

export default function Claim({ params }) {
  const [isClient, setIsClient] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { id } = useParams();

  const [claimData, setClaimData] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);

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

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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

  const airDrop = async (username) => {
    const accountIdFull = nameCheckRef.current.value;
    const accountId = accountIdFull.trim().toLowerCase();
    localStorage.setItem("currentUser", accountId);
    setLoading(true);

    try {
      const response = await fetch(claimData.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: accountId,
          seriesId: claimData.series_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.href = `${successPage}?r=${data.body}&accountId=${accountId}`;
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!claimData) {
    return <div>Loading...</div>;
  }

 return (
   <>
    {isSuccess && <Confetti
        width={width}
        height={height}
        confettiSource = { {w: 100,
          h: 10,
          x: width / 2,
          y: 20}}
        initialVelocityX={8}
        initialVelocityY={10}
        recycle={false}
        numberOfPiecess={2000}
        gravity={0.1}
      />}
     <div id="centerCard">
       <div className="center-box">
         <div className="half-image">
           <p>Claim Success for ID: {id}</p>
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
             <b>Read This Edition:</b>
             <br />
             <a href="https://mailchi.mp/nearweek.com/near-newsletter-123" target="_blank" rel="noopener noreferrer">
               <button className="btn" id="toggleButton">
                 NEARWEEK 123
               </button>
             </a>
             <br />
             <a href="https://near.org/achildhoodhero.near/widget/nearweek.editorial.bos" target="_blank" rel="noopener noreferrer">
               <button className="btn" id="toggleButton">
                 NEAR Editorial
               </button>
             </a>
             <br />
             <div id="countdown"></div>
             <br />
             <b>Check out your ShardDogs:</b>
             <br />
             <img src="https://shard.dog/img/mynearwallet.png" style={{ width: "25px", marginLeft: "3px", marginRight: "8px", verticalAlign: "middle" }} alt="My NEAR Wallet" />
             <a href="https://app.mynearwallet.com/?tab=collectibles" target="_blank" rel="noopener noreferrer">
               View on My NEAR Wallet
             </a>
             <br />
             <br />
             <b>You can also view on:</b>
             <br />
             <img src="https://shard.dog/img/meteor_icon.png" style={{ width: "25px", marginLeft: "3px", marginRight: "8px", verticalAlign: "middle" }} alt="Meteor Wallet" />
             <a href="https://wallet.meteorwallet.app/wallet/nfts" target="_blank" rel="noopener noreferrer">
               View on Meteor Wallet
             </a>
             <br />
             <img src="https://shard.dog/img/mintbase-symbol.png" style={{ width: "25px", marginLeft: "3px", marginRight: "8px", verticalAlign: "middle" }} alt="Mintbase" />
             <a href="https://www.mintbase.xyz/" target="_blank" rel="noopener noreferrer" id="mintbase">
               View on Mintbase
             </a>
             <br />
             <img src="https://shard.dog/img/TradePort1.png" style={{width:"25px", marginLeft:"3px", marginRight:"8px", verticalAlign: "middle"}} /><a href='https://www.tradeport.xyz/near/' target="_blank" id="tradeport">View on Tradeport</a>
             <br />
             <small>
               <i>
                 If you want to learn more about what we are building with{" "}
                 <a href="https://twitter.com/sharddog" target="_blank" rel="noopener noreferrer">
                   ShardDog, follow us on Twitter
                 </a>
               </i>
             </small>
             <br />
             <img src="https://shard.dog/img/ShardDogLogo.png" width="100px" alt="ShardDog Logo" />
           </div>
         </div>
       </div>
       <br />
       <div id="card-footer">
         <img src="https://shard.dog/v2/images/built_nomargin.svg" alt="Built on NEAR" width="100px" /> | By<a href="https://twitter.com/ready_layer_one" target="_blank" rel="noopener noreferrer">
           Ready Layer One
         </a>
       </div>
     </div>
   </>
 );

}
