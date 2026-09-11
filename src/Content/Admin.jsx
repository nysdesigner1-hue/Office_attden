import { useEffect, useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    lowestLeaveEmployee: null,
    totalSalaryPaid: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Employees API
      const employeeResponse = await fetch(
        "http://localhost:5000/api/admin/employees"
      );

      const employeeData = await employeeResponse.json();

      setEmployees(employeeData.employees || []);

      // Dashboard summary API
      // Salary calculation server par hoga
      const dashboardResponse = await fetch(
        "http://localhost:5000/api/admin/dashboard"
      );

      const dashboardData = await dashboardResponse.json();

      setDashboard(dashboardData);
    } catch (error) {
      console.error("Admin data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeEmployeeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/employees/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      // Refresh data after status change
      fetchAdminData();
    } catch (error) {
      console.error(error);
      alert("Employee status update nahi ho paya.");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(search.toLowerCase()) ||
      employee.staffId?.toLowerCase().includes(search.toLowerCase()) ||
      employee.department?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || employee.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <div>
          <p className="admin-small-title">ADMIN PANEL</p>
          <h1>Employee Management</h1>
          <p className="admin-subtitle">
            Manage employees, attendance and employee status
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchAdminData}>
          ↻ Refresh
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="admin-cards">

        <div className="admin-card">
          <div className="card-icon employee-icon">
            👥
          </div>

          <div>
            <p>Total Employees</p>
            <h2>{dashboard.totalEmployees}</h2>
          </div>
        </div>

        <div className="admin-card">
          <div className="card-icon active-icon">
            ●
          </div>

          <div>
            <p>Active Employees</p>
            <h2>{dashboard.activeEmployees}</h2>
          </div>
        </div>

        <div className="admin-card">
          <div className="card-icon inactive-icon">
            ●
          </div>

          <div>
            <p>Inactive Employees</p>
            <h2>{dashboard.inactiveEmployees}</h2>
          </div>
        </div>

        <div className="admin-card">
          <div className="card-icon leave-icon">
            ↓
          </div>

          <div>
            <p>Lowest Leave</p>

            <h2>
              {dashboard.lowestLeaveEmployee
                ? dashboard.lowestLeaveEmployee.leaveCount
                : 0}
            </h2>

            {dashboard.lowestLeaveEmployee && (
              <span className="card-extra">
                {dashboard.lowestLeaveEmployee.name}
              </span>
            )}
          </div>
        </div>

        <div className="admin-card salary-card">
          <div className="card-icon salary-icon">
            ₹
          </div>

          <div>
            <p>Total Salary Paid</p>

            <h2>
              ₹
              {Number(dashboard.totalSalaryPaid || 0).toLocaleString(
                "en-IN"
              )}
            </h2>

            <span className="card-extra">
              Calculated by server
            </span>
          </div>
        </div>

      </div>

      {/* Employee Management */}
      <div className="employee-section">

        <div className="section-header">
          <div>
            <h2>Employees</h2>
            <p>Manage your office staff</p>
          </div>
        </div>

        {/* Controls */}
        <div className="employee-controls">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search employee, staff ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-buttons">

            <button
              className={filter === "all" ? "filter-active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={filter === "active" ? "filter-active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              className={filter === "inactive" ? "filter-active" : ""}
              onClick={() => setFilter("inactive")}
            >
              Inactive
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="employee-table-wrapper">

          <table className="employee-table">

            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>STAFF ID</th>
                <th>DEPARTMENT</th>
                <th>LEAVE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (

                  <tr key={employee.id}>

                    <td>
                      <div className="employee-name">
                        <div className="employee-avatar">
                          {employee.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>
                          <small>
                            {employee.email || "No email"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="staff-id">
                        {employee.staffId}
                      </span>
                    </td>

                    <td>
                      {employee.department || "-"}
                    </td>

                    <td>
                      {employee.leaveCount ?? 0} days
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          employee.status === "active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        <span></span>
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className={
                          employee.status === "active"
                            ? "status-btn deactivate"
                            : "status-btn activate"
                        }
                        onClick={() =>
                          changeEmployeeStatus(
                            employee.id,
                            employee.status
                          )
                        }
                      >
                        {employee.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-employees">
                    No employees found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Admin;