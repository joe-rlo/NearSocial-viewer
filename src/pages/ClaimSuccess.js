import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";

export default function Claim({ params }) {
  const [isClient, setIsClient] = useState(false);

  const { id } = useParams();

  const [claimData, setClaimData] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);

  const nameCheckRef = useRef(null);

  useEffect(() => {
    if (id) {
      // to avoid fetching when id is undefined
      fetch(`http://localhost:8080/api/getClaimInfo/${id}`)
        .then((response) => response.json())
        .then((data) => setClaimData(data[0]));
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
      <div id="centerCard">
        <div className="center-box">
          <div className="half-image">
            Claim Success for ID: {id}
            <div id="welcome"> Let's get your ShardDog</div>
            <br />
            <img
              src={claimData.image || "https://shard.dog/img/ShardDog.jpg"}
              className="image-div"
              id="poap"
            />
          </div>

          <div id="topBlock">
            <div id="welcome2"> Let's get your ShardDog</div>
            <h2 id="title">
              <span className="owner-div">{claimData.title}</span>
            </h2>
            <p>
              <small id="notice">{claimData.description}</small>
            </p>
            <div id="container"></div>
            <div id="checkin" style={{ display: "none" }}></div>
            <br />

            <br />
            <div id="card-footer">
              <img
                src="/images/built_nomargin.svg"
                alt="Built on NEAR"
                width="100px"
              />{" "}
              | By{" "}
              <a
                href="https://twitter.com/ready_layer_one"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Ready Layer One
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
