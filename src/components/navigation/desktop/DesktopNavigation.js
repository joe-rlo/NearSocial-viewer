import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Logotype } from "../Logotype";
import { NavigationButton } from "../NavigationButton";
import { ArrowUpRight } from "../../icons/ArrowUpRight";
import { Book } from "../../icons/Book";
import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import { DevActionsDropdown } from "./DevActionsDropdown";
import { NotificationWidget } from "../NotificationWidget";
import { NearSocialLogo } from "../../icons/NearSocialLogo";

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-10);
  z-index: 99;
  padding: 6px 0;
  color: white;

  .user-section {
    margin-left: auto;
    > button {
      font-size: 14px;
    }
  }

  .container {
    display: flex;
    align-items: center;

    .navigation-section {
      margin-left: 50px;
      display: flex;

      > div {
        > a {
          margin-right: 20px;
        }
      }
    }

    .user-section {
      display: flex;
      align-items: center;

      .nav-create-btn {
        margin-left: 10px;
      }

      .nav-sign-in-btn {
        margin-left: 10px;
      }
    }

    .arrow-up-right {
      margin-left: 4px;
    }
  }
`;

export function DesktopNavigation(props) {
  return (
    <StyledNavigation>
      <div className="container">
        <Link to="/" className="logo">
          <NearSocialLogo />
        </Link>
        <div className="navigation-section">
          <NavigationButton route="/">Home</NavigationButton>
          <NavigationButton route={`/${props.widgets.search}`}>
            Search
          </NavigationButton>
          <NavigationButton route={"/theriver"}>The River</NavigationButton>
          <NavigationButton route={"/comic"}>Comic</NavigationButton>
          <NavigationButton route={"/dogpark"}>Dog Park</NavigationButton>
          {props.signedAccountId === "sharddog.near" && (
            <NavigationButton route={"/owner"}>Owner Area</NavigationButton>
          )}
        </div>
        <div className="user-section">
          <NavigationButton route={"/changes"}>Changelog</NavigationButton>
          {!props.signedIn && (
            <SignInButton onSignIn={() => props.requestSignIn()} />
          )}
          {props.signedIn && (
            <>
              <NotificationWidget
                notificationButtonSrc={props.widgets.notificationButton}
              />
              <UserDropdown {...props} />
            </>
          )}
        </div>
      </div>
    </StyledNavigation>
  );
}
