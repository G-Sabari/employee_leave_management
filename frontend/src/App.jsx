

import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activePage, setActivePage] = useState("Dashboard");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingLeaveId, setProcessingLeaveId] = useState(null);


  
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setCurrentUser(null);
        setEmployees([]);
        setLeaves([]);
        setActivePage("Dashboard");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  // Fetch employees and leave requests from Spring Boot
  async function fetchData() {
    try {
      
      const leaveResponse = await fetch(
        "http://localhost:8080/leaves",
        {
          credentials: "include"
        }
      );

      const employeeResponse = await fetch(
        "http://localhost:8080/employees",
        {
          credentials: "include"
        }
      );


      if (!leaveResponse.ok || !employeeResponse.ok) {
        throw new Error("Failed to fetch data from the backend.");
      }

      const leaveData = await leaveResponse.json();
      const employeeData = await employeeResponse.json();

      setLeaves(leaveData);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
  async function checkSession() {
    try {
      const response = await fetch("http://localhost:8080/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    }

    checkSession();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Employees", icon: "♙" },
    { name: "Leave Requests", icon: "▤" },
    { name: "My Leaves", icon: "◷" },
  ];

  // Dashboard statistics
  const pendingCount = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approvedCount = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: "♙",
      color: "blue",
    },
    {
      title: "Total Requests",
      value: leaves.length,
      icon: "▤",
      color: "purple",
    },
    {
      title: "Pending Requests",
      value: pendingCount,
      icon: "◷",
      color: "orange",
    },
    {
      title: "Approved Leaves",
      value: approvedCount,
      icon: "✓",
      color: "green",
    },
  ];

  function openLeaveForm() {
    setActivePage("My Leaves");
    setShowLeaveForm(true);
  }

  function closeLeaveForm() {
    setShowLeaveForm(false);
  }

  // Submit a new leave request
  async function handleLeaveSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const employeeId = formData.get("employeeId");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const reason = formData.get("reason").trim();

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    if (!reason) {
      alert("Please enter a reason for leave.");
      return;
    }

    const leaveData = {
      employeeId: Number(employeeId),
      startDate,
      endDate,
      reason,
    };

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/leaves",
        {
          method: "POST",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leaveData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Failed to submit leave request."
        );
      }

      await fetchData();

      alert("Leave request submitted successfully!");

      form.reset();
      closeLeaveForm();
      setActivePage("Dashboard");
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert(error.message || "Unable to submit leave request.");
    } finally {
      setLoading(false);
    }
  }

  // Approve or reject a leave request
  async function handleLeaveDecision(id, decision) {
    const action =
      decision === "approve" ? "approve" : "reject";

    try {
  setProcessingLeaveId(id);

  const response = await fetch(
    `http://localhost:8080/leaves/${id}/${action}`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || `Failed to ${action} leave request.`
    );
  }

  await fetchData();

  alert(
      `Leave request ${
        action === "approve" ? "approved" : "rejected"
      } successfully!`
    );
  } catch (error) {
  console.error(`Error trying to ${action} leave:`, error);

  alert(error.message || "Something went wrong.");
    } finally {
      setProcessingLeaveId(null);
    }
  }

  // Find employee name using employee ID
  function getEmployeeName(employeeId) {
    const employee = employees.find(
      (item) => Number(item.id) === Number(employeeId)
    );

    return employee?.name || `Employee #${employeeId}`;
  }

  function getEmployeeInitials(employeeId) {
    const name = getEmployeeName(employeeId);

    if (name.startsWith("Employee #")) {
      return String(employeeId);
    }

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  // Reusable leave status badge
  function StatusBadge({ status }) {
    const currentStatus = status || "PENDING";

    return (
      <span
        className={`status-badge ${currentStatus.toLowerCase()}`}
      >
        {currentStatus}
      </span>
    );

  }

  
  if (authChecking) {
    return <div>Checking session...</div>;
    }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }



  return (
    
    
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">EL</div>
          <div>
            <h2>LeaveFlow</h2>
            <span>Management Portal</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setShowLeaveForm(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        

                
        <div className="sidebar-bottom">
          <div className="profile-avatar">AD</div>

          <div>
            <strong>{currentUser.username}</strong>
            <span>{currentUser.role}</span>
          </div>

        </div>

      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Workspace / {activePage}
            </p>
            <h1>{activePage}</h1>
          </div>

          
          <div className="topbar-right">
            <span className="online-dot"></span>
            <span>System Online</span>
            <div className="top-avatar">AD</div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <span>↪</span>
              Sign out
            </button>
          </div>

        </header>

        {/* Dashboard */}
        {activePage === "Dashboard" ? (
          <>
            <section className="welcome-section">
              <div>
                <h2>Welcome back, Sabari! 👋</h2>
                <p>
                  Here is what's happening with your team today.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={openLeaveForm}
              >
                + Apply for Leave
              </button>
            </section>

            <section className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <div className={`stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                  <span className="stat-note">
                    Current overview
                  </span>
                </div>
              ))}
            </section>

            <section className="requests-card">
              <div className="section-heading">
                <div>
                  <h2>Recent Leave Requests</h2>
                  <p>
                    Overview of recent employee applications
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    setActivePage("Leave Requests")
                  }
                >
                  View all →
                </button>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>LEAVE TYPE</th>
                      <th>DATES</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.length === 0 ? (
                      <tr>
                        <td colSpan="4">
                          No leave requests found.
                        </td>
                      </tr>
                    ) : (
                      leaves.map((leave) => (
                        <tr key={leave.id}>
                          <td>
                            <div className="employee-cell">
                              <div className="employee-avatar">
                                {getEmployeeInitials(
                                  leave.employeeId
                                )}
                              </div>
                              <strong>
                                {getEmployeeName(
                                  leave.employeeId
                                )}
                              </strong>
                            </div>
                          </td>

                          <td>{leave.reason}</td>

                          <td>
                            {leave.startDate} - {leave.endDate}
                          </td>

                          <td>
                            <StatusBadge
                              status={leave.status}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer>
              Employee Leave Management System · Built with React
            </footer>
          </>
        ) : activePage === "Leave Requests" ? (
          /* Leave Requests Management */
          <section className="requests-card">
            <div className="section-heading">
              <div>
                <h2>All Leave Requests</h2>
                <p>
                  Review and manage employee leave applications.
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>REASON</th>
                    <th>DATES</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        No leave requests found.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => {
                      const status =
                        leave.status || "PENDING";

                      const isPending = status === "PENDING";
                      const isProcessing =
                        processingLeaveId === leave.id;

                      return (
                        <tr key={leave.id}>
                          <td>
                            <div className="employee-cell">
                              <div className="employee-avatar">
                                {getEmployeeInitials(
                                  leave.employeeId
                                )}
                              </div>
                              <strong>
                                {getEmployeeName(
                                  leave.employeeId
                                )}
                              </strong>
                            </div>
                          </td>

                          <td>{leave.reason}</td>

                          <td>
                            {leave.startDate} - {leave.endDate}
                          </td>

                          <td>
                            <StatusBadge status={status} />
                          </td>

                          <td>
                            {isPending ? (
                              <div className="form-actions">
                                <button
                                  type="button"
                                  className="primary-button"
                                  disabled={processingLeaveId !== null}
                                  onClick={() =>
                                    handleLeaveDecision(
                                      leave.id,
                                      "approve"
                                    )

                                  }
                                >
                                  {isProcessing
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className="cancel-button"
                                  disabled={processingLeaveId !== null}
                                  onClick={() =>
                                    handleLeaveDecision(
                                      leave.id,
                                      "reject"
                                    )
                                  }
                                >
                                  {isProcessing
                                    ? "Processing..."
                                    : "Reject"}
                                </button>
                              </div>
                            ) : (
                              <span>Action completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : activePage === "My Leaves" ? (
          /* My Leaves and Apply Leave Form */
          <section className="requests-card my-leaves-section">
            {showLeaveForm ? (
              <div className="leave-form-card">
                <div className="section-heading">
                  <div>
                    <h2>Apply for Leave</h2>
                    <p>
                      Fill in your details to submit a leave request.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-button"
                    onClick={closeLeaveForm}
                  >
                    Close ✕
                  </button>
                </div>

                <form
                  className="leave-form"
                  onSubmit={handleLeaveSubmit}
                >
                  <label>
                    Employee
                    <select
                      name="employeeId"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select an employee
                      </option>

                      {employees.map((employee) => (
                        <option
                          key={employee.id}
                          value={employee.id}
                        >
                          {employee.name} (ID: {employee.id})
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="form-row">
                    <label>
                      Start Date
                      <input
                        type="date"
                        name="startDate"
                        required
                      />
                    </label>

                    <label>
                      End Date
                      <input
                        type="date"
                        name="endDate"
                        required
                      />
                    </label>
                  </div>

                  <label>
                    Reason for Leave
                    <textarea
                      name="reason"
                      rows="4"
                      placeholder="Explain why you need leave..."
                      required
                    />
                  </label>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeLeaveForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={loading}
                    >
                      {loading
                        ? "Submitting..."
                        : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="section-heading">
                  <div>
                    <h2>My Leave History</h2>
                    <p>
                      View and manage your leave applications.
                    </p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => setShowLeaveForm(true)}
                  >
                    + Apply for Leave
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>EMPLOYEE</th>
                        <th>REASON</th>
                        <th>DATES</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.length === 0 ? (
                        <tr>
                          <td colSpan="4">
                            No leave requests found.
                          </td>
                        </tr>
                      ) : (
                        leaves.map((leave) => (
                          <tr key={leave.id}>
                            <td>
                              {getEmployeeName(
                                leave.employeeId
                              )}
                            </td>

                            <td>{leave.reason}</td>

                            <td>
                              {leave.startDate} - {leave.endDate}
                            </td>

                            <td>
                              <StatusBadge
                                status={leave.status}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        ) : activePage === "Employees" ? (
          /* Employees */
          <section className="requests-card">
            <div className="section-heading">
              <div>
                <h2>Employees</h2>
                <p>Employee records from the database</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          /* Fallback page */
          <section className="placeholder-card">
            <div className="placeholder-icon">▤</div>
            <h2>{activePage}</h2>
            <p>
              This section is ready for development. We will add
              its functionality and connect it to the backend.
            </p>

            <button
              className="primary-button"
              onClick={() => setActivePage("Dashboard")}
            >
              Back to Dashboard
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
