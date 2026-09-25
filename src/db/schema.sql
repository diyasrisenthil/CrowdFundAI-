-- ====================================================================
-- CrowdFundAI+: Intelligent FinTech Crowdfunding Success Prediction
-- MySQL Database Architecture Schema (DDL)
-- Prepared for Final-Year B.Tech IT viva and real MySQL deployment
-- ====================================================================

CREATE DATABASE IF NOT EXISTS crowdfundai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crowdfundai_db;

-- 1. USERS TABLE
-- Handles authenticated campaign creators, researchers, and project admins
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('creator', 'investor', 'researcher', 'admin') DEFAULT 'creator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. CAMPAIGNS TABLE (Module 1: Campaign Information)
-- Holds raw and verified campaign metadata prior to launch
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    category VARCHAR(60) NOT NULL,
    country VARCHAR(10) NOT NULL,
    funding_goal DECIMAL(12, 2) NOT NULL,
    campaign_duration INT NOT NULL COMMENT 'Duration in days',
    creator_experience VARCHAR(50) NOT NULL,
    previous_campaign_count INT DEFAULT 0,
    has_video BOOLEAN DEFAULT FALSE,
    pre_launch_followers INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campaigns_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_campaign_category (category),
    INDEX idx_campaign_user (user_id)
) ENGINE=InnoDB;

-- 3. CAMPAIGN_PERFORMANCE TABLE
-- Stores historical or post-launch performance metrics when supported by dataset
CREATE TABLE IF NOT EXISTS campaign_performance (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    backers INT DEFAULT 0,
    engagement_rate DECIMAL(6, 4) DEFAULT 0.0000,
    funds_raised DECIMAL(12, 2) DEFAULT 0.00,
    outcome ENUM('successful', 'failed', 'canceled', 'live') DEFAULT 'live',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perf_campaign FOREIGN KEY (campaign_id) 
        REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_perf_campaign (campaign_id)
) ENGINE=InnoDB;

-- 4. PREDICTIONS TABLE (Module 3 & 4: Classification & Regression Outputs)
-- Populated strictly by the Python ML service inference pipeline
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    success_probability DECIMAL(5, 4) NULL COMMENT 'Classification probability [0.0000 to 1.0000]',
    predicted_funding DECIMAL(12, 2) NULL COMMENT 'Regression target in USD',
    confidence_score DECIMAL(5, 4) NULL,
    model_version VARCHAR(50) NULL COMMENT 'e.g., XGBoost-v1.0.2',
    prediction_status ENUM('pending_model', 'completed', 'failed') DEFAULT 'pending_model',
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_predictions_campaign FOREIGN KEY (campaign_id) 
        REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_pred_campaign (campaign_id),
    INDEX idx_pred_date (prediction_date)
) ENGINE=InnoDB;

-- 5. RECOMMENDATIONS TABLE (Module 5: Explainable AI & Actionable Insights)
-- Populated based on SHAP feature importance vectors for individual campaigns
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    prediction_id VARCHAR(36) NOT NULL,
    factor VARCHAR(100) NOT NULL COMMENT 'Feature driving the recommendation e.g. campaign_duration',
    recommendation TEXT NOT NULL COMMENT 'Actionable recommendation derived from model insights',
    priority ENUM('High', 'Medium', 'Low') NOT NULL,
    category VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_prediction FOREIGN KEY (prediction_id) 
        REFERENCES predictions(id) ON DELETE CASCADE,
    INDEX idx_rec_prediction (prediction_id)
) ENGINE=InnoDB;
