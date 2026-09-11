import { useEffect, useRef, useState } from "react";
import "./Home.css";

const Home = ({name}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Example staff data
  console.log(name)
  const staff = {
    staffId: name,
    totalAttendance: 24,
  };

  // Open camera
  const openCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      setShowCamera(true);
    } catch (error) {
      console.error("Camera Error:", error);

      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Please allow camera access."
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else {
        setCameraError("Unable to access the camera.");
      }
    }
  };

  // Attach camera stream to video
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  // Stop camera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setShowCamera(false);
  };

  // Capture photo
  const captureAttendance = () => {
    alert("Attendance captured successfully!");

    closeCamera();
  };

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div className="home-page">

      {/* Header */}
      <header className="home-header">
        <div>
          <p className="home-welcome">Welcome back</p>
          <h1>Staff Home</h1>
        </div>

        <div className="staff-profile">
          <span className="profile-circle">S</span>
          <span>{staff.staffId}</span>
        </div>
      </header>


      {/* Main Content */}
      <main className="home-content">

        {/* Staff Attendance Card */}
        <section className="attendance-card">

          <div className="attendance-card-top">

            <div>
              <p className="card-label">Staff ID</p>

              <h2>{staff.staffId}</h2>
            </div>

            <div className="staff-id-icon">
              ID
            </div>

          </div>


          <div className="attendance-divider"></div>


          <div className="attendance-info">

            <div className="attendance-stat">
              <span className="stat-label">
                Total Attendance
              </span>

              <strong>
                {staff.totalAttendance}
              </strong>

              <span className="stat-small">
                Days
              </span>
            </div>


            <div className="attendance-stat">
              <span className="stat-label">
                Attendance Status
              </span>

              <strong className="status-present">
                Active
              </strong>

              <span className="stat-small">
                Staff Account
              </span>
            </div>

          </div>

        </section>


        {/* Make Attendance */}
        <section className="make-attendance-section">

          <div className="attendance-action-icon">
            ✓
          </div>

          <div className="attendance-action-content">
            <h3>Make Attendance</h3>

            <p>
              Verify your identity using your device camera
              to mark today's attendance.
            </p>
          </div>

          <button
            type="button"
            className="make-attendance-button"
            onClick={openCamera}
          >
            Make Attendance
          </button>

        </section>


        {/* Camera Error */}
        {cameraError && (
          <div className="camera-error">
            <strong>Camera Access Error</strong>
            <p>{cameraError}</p>
          </div>
        )}

      </main>


      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-overlay">

          <div className="camera-modal">

            <div className="camera-header">
              <div>
                <h2>Verify Attendance</h2>
                <p>Position your face inside the frame</p>
              </div>

              <button
                type="button"
                className="camera-close"
                onClick={closeCamera}
              >
                ×
              </button>
            </div>


            <div className="camera-container">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />

              <div className="face-frame"></div>

            </div>


            <div className="camera-actions">

              <button
                type="button"
                className="camera-cancel-button"
                onClick={closeCamera}
              >
                Cancel
              </button>

              <button
                type="button"
                className="capture-button"
                onClick={captureAttendance}
              >
                Capture Attendance
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Home;