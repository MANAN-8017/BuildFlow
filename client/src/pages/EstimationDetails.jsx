import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../services/api.js";
import "../styles/global.css";
import "../styles/EstimationDetails.css";

function EstimationDetails() {
    const { estimationId } = useParams();

    const [estimation, setEstimation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEstimation();
    }, [estimationId]);

    const fetchEstimation = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API.estimations}/${estimationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch estimation."
                );
            }

            setEstimation(data);
        } catch (error) {
            console.error(
                "Failed to fetch estimation:",
                error
            );

            setError(
                error.message ||
                "Unable to load estimation."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString(
            "en-IN"
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    if (loading) {
        return (
            <div className="page">
                <div className="estimation-details-loading">
                    Loading estimation...
                </div>
            </div>
        );
    }

    if (error || !estimation) {
        return (
            <div className="page">
                <div className="estimation-details-error">
                    <span>
                        ESTIMATION
                    </span>

                    <h1>
                        Estimation not found
                    </h1>

                    <p>
                        {error ||
                            "Unable to load this estimation."}
                    </p>

                    <Link
                        to="/estimation"
                        className="estimation-back-button"
                    >
                        Back to Estimations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="estimation-details-page">
                <Link
                    to="/estimation"
                    className="estimation-back"
                >
                    ← Back to Estimations
                </Link>

                <div className="estimation-details-header">
                    <div>
                        <span>
                            ESTIMATION
                        </span>

                        <h1>
                            {estimation.estimationId}
                        </h1>

                        <p>
                            Created on{" "}
                            {formatDate(
                                estimation.createdAt
                            )}
                        </p>
                    </div>

                    <div className="building-type-badge">
                        {
                            estimation.buildingType
                        }
                    </div>
                </div>

                <div className="project-overview">
                    <div className="overview-item">
                        <span>
                            LENGTH
                        </span>

                        <strong>
                            {estimation.length} ft
                        </strong>
                    </div>

                    <div className="overview-item">
                        <span>
                            WIDTH
                        </span>

                        <strong>
                            {estimation.width} ft
                        </strong>
                    </div>

                    <div className="overview-item">
                        <span>
                            HEIGHT
                        </span>

                        <strong>
                            {estimation.height} ft
                        </strong>
                    </div>

                    <div className="overview-item">
                        <span>
                            FLOORS
                        </span>

                        <strong>
                            {estimation.floors}
                        </strong>
                    </div>
                </div>

                <div className="estimation-details-grid">
                    <div className="materials-section">
                        <div className="section-heading">
                            <span>
                                MATERIAL REQUIREMENT
                            </span>

                            <h2>
                                Construction Materials
                            </h2>
                        </div>

                        <div className="materials-details-grid">
                            <div className="material-detail-card">
                                <div className="material-number">
                                    01
                                </div>

                                <span>
                                    CEMENT
                                </span>

                                <strong>
                                    {formatNumber(
                                        estimation.cement
                                    )}
                                </strong>

                                <small>
                                    bags
                                </small>
                            </div>

                            <div className="material-detail-card">
                                <div className="material-number">
                                    02
                                </div>

                                <span>
                                    SAND
                                </span>

                                <strong>
                                    {formatNumber(
                                        estimation.sand
                                    )}
                                </strong>

                                <small>
                                    cubic ft
                                </small>
                            </div>

                            <div className="material-detail-card">
                                <div className="material-number">
                                    03
                                </div>

                                <span>
                                    STEEL
                                </span>

                                <strong>
                                    {formatNumber(
                                        estimation.steel
                                    )}
                                </strong>

                                <small>
                                    kg
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="cost-card">
                        <span>
                            ESTIMATED COST
                        </span>

                        <h2>
                            ₹
                            {formatNumber(
                                estimation.estimatedCost
                            )}
                        </h2>

                        <p>
                            Approximate construction
                            material cost based on the
                            provided project dimensions.
                        </p>
                    </div>
                </div>

                {estimation.aiResponse && (
                    <div className="ai-estimation-card">
                        <div className="section-heading">
                            <span>
                                AI ANALYSIS
                            </span>

                            <h2>
                                Project Insights
                            </h2>
                        </div>

                        <div className="ai-estimation-content">
                            {typeof estimation.aiResponse ===
                            "string" ? (
                                <p>
                                    {
                                        estimation.aiResponse
                                    }
                                </p>
                            ) : (
                                <p>
                                    {JSON.stringify(
                                        estimation.aiResponse,
                                        null,
                                        2
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EstimationDetails;