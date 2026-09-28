import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API } from "../services/api.js";
import "../styles/global.css";
import "../styles/Estimation.css";

function Estimation() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        length: "",
        width: "",
        height: "",
        floors: "1",
        buildingType: "Residential"
    });

    const [estimation, setEstimation] = useState(null);
    const [previousEstimations, setPreviousEstimations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPreviousEstimations();
    }, []);

    const fetchPreviousEstimations = async () => {
        try {
            setHistoryLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                API.estimations,
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
                    "Failed to fetch estimations."
                );
            }

            setPreviousEstimations(data);
        } catch (error) {
            console.error(
                "Failed to fetch estimations:",
                error
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setEstimation(null);

        if (
            !form.length ||
            !form.width ||
            !form.height ||
            !form.floors
        ) {
            setError(
                "Please fill all required fields."
            );
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API.estimations}/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        length: Number(form.length),
                        width: Number(form.width),
                        height: Number(form.height),
                        floors: Number(form.floors),
                        buildingType:
                            form.buildingType
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to generate estimation."
                );
            }

            setEstimation(data);

            setPreviousEstimations(
                (previous) => [
                    data,
                    ...previous
                ]
            );
        } catch (error) {
            console.error(
                "Estimation error:",
                error
            );

            setError(
                error.message ||
                "Unable to generate estimation."
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
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div className="page">
            <div className="estimation-page">
                <div className="estimation-header">
                    <span>
                        CONSTRUCTION PLANNING
                    </span>

                    <h1>
                        Material Estimation
                    </h1>

                    <p>
                        Calculate the approximate
                        materials and construction
                        cost required for your
                        project.
                    </p>
                </div>

                <div className="estimation-layout">
                    <div className="estimation-form-card">
                        <div className="card-heading">
                            <span>
                                PROJECT DETAILS
                            </span>

                            <h2>
                                Enter Building
                                Information
                            </h2>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >
                            <div className="form-section">
                                <label>
                                    Building Type
                                </label>

                                <select
                                    name="buildingType"
                                    value={
                                        form.buildingType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="Residential">
                                        Residential
                                    </option>

                                    <option value="Commercial">
                                        Commercial
                                    </option>

                                    <option value="Industrial">
                                        Industrial
                                    </option>
                                </select>
                            </div>

                            <div className="dimension-grid">
                                <div className="form-section">
                                    <label>
                                        Length
                                    </label>

                                    <div className="input-unit">
                                        <input
                                            type="number"
                                            name="length"
                                            value={
                                                form.length
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="1"
                                            step="0.01"
                                            placeholder="30"
                                        />

                                        <span>
                                            ft
                                        </span>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label>
                                        Width
                                    </label>

                                    <div className="input-unit">
                                        <input
                                            type="number"
                                            name="width"
                                            value={
                                                form.width
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="1"
                                            step="0.01"
                                            placeholder="20"
                                        />

                                        <span>
                                            ft
                                        </span>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label>
                                        Height
                                    </label>

                                    <div className="input-unit">
                                        <input
                                            type="number"
                                            name="height"
                                            value={
                                                form.height
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="1"
                                            step="0.01"
                                            placeholder="10"
                                        />

                                        <span>
                                            ft
                                        </span>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label>
                                        Floors
                                    </label>

                                    <input
                                        type="number"
                                        name="floors"
                                        value={
                                            form.floors
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="1"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="estimation-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="generate-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Generating..."
                                    : "Generate Estimation"}
                            </button>
                        </form>
                    </div>

                    <div className="estimation-info-card">
                        <span>
                            HOW IT WORKS
                        </span>

                        <h2>
                            Plan before you build.
                        </h2>

                        <p>
                            Enter your building
                            dimensions and
                            project type to
                            generate an estimated
                            requirement of major
                            construction materials.
                        </p>

                        <div className="estimation-steps">
                            <div>
                                <strong>
                                    01
                                </strong>

                                <span>
                                    Enter dimensions
                                </span>
                            </div>

                            <div>
                                <strong>
                                    02
                                </strong>

                                <span>
                                    Generate estimate
                                </span>
                            </div>

                            <div>
                                <strong>
                                    03
                                </strong>

                                <span>
                                    Review materials
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {estimation && (
                    <div className="estimation-result">
                        <div className="result-header">
                            <div>
                                <span>
                                    ESTIMATION RESULT
                                </span>

                                <h2>
                                    Project Material
                                    Requirement
                                </h2>
                            </div>

                            <div className="estimated-cost">
                                <span>
                                    Estimated Cost
                                </span>

                                <strong>
                                    ₹
                                    {formatNumber(
                                        estimation.estimatedCost
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="material-grid">
                            <div className="material-card">
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

                            <div className="material-card">
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

                            <div className="material-card">
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
                )}

                <div className="estimation-history">
                    <div className="history-header">
                        <div>
                            <span>
                                ESTIMATION HISTORY
                            </span>

                            <h2>
                                Previous Estimations
                            </h2>
                        </div>
                    </div>

                    {historyLoading ? (
                        <div className="history-empty">
                            Loading estimations...
                        </div>
                    ) : previousEstimations.length ===
                      0 ? (
                        <div className="history-empty">
                            You haven't created any
                            estimations yet.
                        </div>
                    ) : (
                        <div className="history-list">
                            {previousEstimations.map(
                                (item) => (
                                    <div
                                        className="history-item"
                                        key={
                                            item.estimationId
                                        }
                                    >
                                        <div className="history-id">
                                            <span>
                                                ESTIMATION
                                            </span>

                                            <strong>
                                                {
                                                    item.estimationId
                                                }
                                            </strong>
                                        </div>

                                        <div className="history-building">
                                            <strong>
                                                {
                                                    item.buildingType
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    item.length
                                                }{" "}
                                                ×{" "}
                                                {
                                                    item.width
                                                }{" "}
                                                ×{" "}
                                                {
                                                    item.height
                                                }{" "}
                                                ft
                                            </span>
                                        </div>

                                        <div className="history-date">
                                            <span>
                                                DATE
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    item.createdAt
                                                )}
                                            </strong>
                                        </div>

                                        <div className="history-cost">
                                            <span>
                                                ESTIMATED COST
                                            </span>

                                            <strong>
                                                ₹
                                                {formatNumber(
                                                    item.estimatedCost
                                                )}
                                            </strong>
                                        </div>

                                        <button
                                            className="history-view"
                                            onClick={() =>
                                                navigate(
                                                    `/estimation/${item.estimationId}`
                                                )
                                            }
                                        >
                                            View →
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Estimation;