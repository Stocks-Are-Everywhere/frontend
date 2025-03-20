import React from "react";
import AccountInfo from "../../components/personal/AccountInfo";
import AssetList from "../../components/personal/AssetList";
import SavedStockList from "../../components/personal/SavedStockList";

import "../../styles/PersonalPage.css";

const PersonalPage: React.FC = () => {
    return (
        <div className="personal-page">
            <h1>Personal Page in construction</h1>
            <div className="content-container">
                {/* Left Column */}
                <div className="left-panel">
                    <div className="section-box"><AccountInfo /></div>
                    <div className="section-box"><AssetList /></div>
                </div>
                {/* Right Column */}
                <div className="right-panel section-box">
                    <SavedStockList />
                </div>
            </div>
        </div>
    )
}

export default PersonalPage;

