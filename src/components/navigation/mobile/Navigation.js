import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { MobileMenuButton } from "./MobileMenuButton";
import { NearSocialLogo } from "../../icons/NearSocialLogo";
import { NotificationWidget } from "../NotificationWidget";
import { SignInButton } from "../SignInButton";

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-10);
  z-index: 99;
  padding: 4px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo-link {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
  }

  .nav-notification-widget {
    margin: 0;
  }

  .nav-sign-in-btn {
    background: none;
    border: none;
    padding-right: 0;
  }
`;

export function Navigation(props) {
  return (
    <StyledNavigation>
      <MobileMenuButton
        onClick={props.onClickShowMenu}
        currentPage={props.currentPage}
      />
      <Link to="/" className="logo-link">
        <NearSocialLogo />
      </Link>
      {props.signedIn ? (
        <NotificationWidget
          notificationButtonSrc={props.widgets.notificationButton}
        />
      ) : (
        <SignInButton onSignIn={() => props.requestSignIn()} />
      )}
    </StyledNavigation>
  );
}
