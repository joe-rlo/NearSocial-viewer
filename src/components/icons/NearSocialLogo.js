import React from "react";
import logoImage from "../../assets/img/ShardDogLogo.png"; // Replace with the actual path to your logo image

export function NearSocialLogo() {
  return (
    <div
      style={{ background: "#F3EDE1", borderRadius: "20px", paddingTop: "3px" }}
    >
      <img src={logoImage} alt="ShardDog Social Logo" width="40" height="40" />
    </div>
  );
}
