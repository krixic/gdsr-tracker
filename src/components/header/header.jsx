import React, { useState, useEffect } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ handleClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <div className="popupheading">
          <h3>Info</h3>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={handleClose}
            className="closeicon"
          />
        </div>
        <div className="infoinfo">
          <p className="popupp">
            The GDSR Wave Tracker allows you to personally track your GDSR Wave
            progress with in depth stat tracking.
          </p>
          <p className="popupp">
            Clicking once on a level will consider it as currently in progress,
            and you may enter the current percentage of the level you have
            achieved. On refresh, it will be added to your levels with progress.
          </p>
          <p className="popupp">
            Clicking again on the level when it is in progress will make it
            completed, and on refresh, will be added to your completed levels
            and will count towards your rank.
          </p>
          <p className="popupp">
            You may achieve each rank by completing this many levels per rank.
            <ul className="bronze">Bronze - 9</ul>
            <ul className="silver">Silver - 13</ul>
            <ul className="gold">Gold - 7</ul>
            <ul className="emerald">Emerald - 5</ul>
            <ul className="ruby">Ruby - 4</ul>
            <ul className="diamond">Diamond - 3</ul>
            <ul className="amethyst">Amethyst - 2</ul>
            <ul className="legend">Legend - 1</ul>
            <ul className="bonus">Bonus - All</ul>
          </p>
          <p className="popupp">
            Completing all the levels in a rank will grant you a Rank+ and will
            be shown in the achieved ranks section.
          </p>
          <h2 className="popupp">
            <strong>Refresh to see changes.</strong>
          </h2>
        </div>
      </div>
    </div>
  );
};

export const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [top, setTop] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);
  return (
    <div className={`header ${!top ? "headershadow" : ""}`}>
      <div className="header-content">
        <span className="header-text">GDSR Wave Tracker</span>
      </div>
      <div className="nav">
        <button className="home" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="stats" onClick={() => navigate("/progress")}>
          Progress
        </button>
      </div>
      <FontAwesomeIcon
        className="info"
        icon={faCircleInfo}
        onClick={() => setIsPopupOpen(true)}
      />

      {isPopupOpen && (
        <div className="overlay" onClick={() => setIsPopupOpen(false)}>
          <Popup handleClose={() => setIsPopupOpen(false)} />
        </div>
      )}
    </div>
  );
};
