import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useAccountId } from "near-social-vm";
import CollectorsModal from "../components/dogpark/CollectorsModal";

const ShardDogLink = ({ linkData }) => {
  const [isCollectorsModalOpen, setIsCollectorsModalOpen] = useState(false);
  const [links, setLinks] = useState([]);

  const accountId = useAccountId();

  const openCollectorsModal = () => {
    setIsCollectorsModalOpen(true);
  };

  const closeCollectorsModal = () => {
    setIsCollectorsModalOpen(false);
  };

  useEffect(() => {
    async function fetchLinks() {
      const response = await fetch(
        `https://my.shard.dog/api/links/${accountId}`
      );
      const data = await response.json();

      console.log("Data received from API:", data);

      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        console.error("Unexpected data format received from API");
      }
    }

    fetchLinks().catch((error) => console.error(error));
  }, [accountId]);

  return (
    <>
      <div className="flex w-full flex-wrap rounded bg-white drop-shadow-xl sm:flex-nowrap linkcard">
        <div className="my-12 w-full sm:w-1/4 sm:px-16 lg:mt-8">
          <img src={linkData.imageuri} alt="ShardDog" />
        </div>
        <div className="w-full sm:w-1/2 sm:flex-col sm:pb-8 lg:mt-8">
          <h4 className="pt-8 text-4xl font-bold sm:pt-0 sm:text-2xl">
            {linkData.name}
          </h4>
          <p className="pt-2">
            {linkData.description && linkData.description.length > 100
              ? linkData.description.substring(0, 100) + "..."
              : linkData.description}
          </p>
          <p className="pt-8 sm:pt-2">
            <span className="text-lg font-bold">ShardDog URL: </span>{" "}
            https://shard.dog/{linkData.urlname}
          </p>
          <div>
            <button
              className="mt-2 rounded-full border-2 border-primary px-2 py-1 text-xl font-bold text-primary sm:rounded-lg sm:text-base"
              onClick={openCollectorsModal}
            >
              View Collectors
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center bg-black pt-8 pb-4 sm:w-1/4 sm:rounded-r lg:pb-0">
          <div className="bg-white p-1 qrbox">
            <QRCode
              value={"https://shard.dog/" + linkData.urlname}
              width="100px"
            />
          </div>
          <button
            className="mt-2 rounded-full border-2 border-white px-2 py-1 text-xl font-bold text-white sm:mt-8 sm:rounded-lg sm:text-base"
            onClick={() => {
              navigator.clipboard
                .writeText("https://shard.dog/" + linkData.urlname)
                .catch((err) => console.log(err));
            }}
          >
            Copy URL
          </button>
          <button
            className="mt-2 rounded-full border-2 border-white px-2 py-1 text-xl font-bold text-white sm:mb-4 sm:rounded-lg sm:text-base"
            onClick={() => {
              navigator.clipboard
                .writeText("https://shard.dog/" + linkData.urlname)
                .catch((err) => console.log(err));
            }}
          >
            Download QR Code
          </button>
        </div>
      </div>
      <br></br>
      <CollectorsModal
        isOpen={isCollectorsModalOpen}
        onClose={closeCollectorsModal}
        seriesId={linkData.series_id}
      />
    </>
  );
};

export default ShardDogLink;
