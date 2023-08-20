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
    return (
      <div>
        <h2>DogPark coming soon...</h2>
        <br />
      </div>
    );
  }

  return (
    <>
      <div id="centerCard">
        <div className="center-box">
          <div className="half-image"></div>

          <div id="topBlock">
            <br />
            <div id="card-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
}
