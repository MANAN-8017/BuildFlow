import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import "../styles/global.css";
import "../styles/Profile.css";

function Profile() {
    const navigate = useNavigate();

    const {
        user,
        fetchUser,
        loading,
        logout
    } = useAuth();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: ""
        }
    });

    useEffect(() => {
        if (!user) return;

        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: {
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                pincode: user.address?.pincode || ""
            }
        });
    }, [user]);

    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleAddressChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            address: {
                ...previous.address,
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!user?.userId) {
            toast.error("User information not available.");
            return;
        }

        if (!formData.name.trim()) {
            toast.error("Name is required.");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required.");
            return;
        }

        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(formData.phone)
        ) {
            toast.error("Enter a valid 10-digit phone number.");
            return;
        }

        if (
            formData.address.pincode &&
            !/^[0-9]{6}$/.test(
                formData.address.pincode
            )
        ) {
            toast.error("Enter a valid 6-digit pincode.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API.users}/${user.userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update profile."
                );
            }

            await fetchUser();

            setEditing(false);

            toast.success(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Profile update failed:",
                error
            );

            toast.error(
                error.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (!user) return;

        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: {
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                pincode: user.address?.pincode || ""
            }
        });

        setEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page">
                <div className="profile-empty">
                    <h1>Profile</h1>

                    <p>
                        Please login to view your profile.
                    </p>

                    <Link
                        to="/login"
                        className="profile-primary-button"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const firstLetter =
        user.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="page">
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-header-content">
                        <div className="large-avatar">
                            {firstLetter}
                        </div>

                        <div>
                            <span>
                                ACCOUNT
                            </span>

                            <h1>
                                {user.name}
                            </h1>

                            <p>
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {!editing ? (
                            <button
                                type="button"
                                className="profile-primary-button"
                                onClick={() =>
                                    setEditing(true)
                                }
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="profile-secondary-button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="profile-primary-button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="profile-grid">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div>
                                <span>
                                    PERSONAL
                                </span>

                                <h2>
                                    Personal Information
                                </h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-field">
                                <label>
                                    User ID
                                </label>

                                <div className="profile-value readonly">
                                    {user.userId}
                                </div>
                            </div>

                            <div className="profile-field">
                                <label>
                                    Full Name
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        value={
                                            formData.name
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "name",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.name ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    Email
                                </label>

                                {editing ? (
                                    <input
                                        type="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.email ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    Phone
                                </label>

                                {editing ? (
                                    <input
                                        type="tel"
                                        value={
                                            formData.phone
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "phone",
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="10 digit phone number"
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.phone ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div>
                                <span>
                                    DELIVERY
                                </span>

                                <h2>
                                    Delivery Address
                                </h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-field full">
                                <label>
                                    Street Address
                                </label>

                                {editing ? (
                                    <textarea
                                        rows="3"
                                        value={
                                            formData.address
                                                .street
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "street",
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your street address"
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.address
                                            ?.street ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    City
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        value={
                                            formData.address
                                                .city
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "city",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.address
                                            ?.city ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    State
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        value={
                                            formData.address
                                                .state
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "state",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.address
                                            ?.state ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    Pincode
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        value={
                                            formData.address
                                                .pincode
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "pincode",
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="6 digit pincode"
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {user.address
                                            ?.pincode ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-bottom">
                    <div>
                        <span>
                            ACCOUNT
                        </span>

                        <h2>
                            BuildFlow Account
                        </h2>

                        <p>
                            Manage your personal information
                            and delivery details.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;