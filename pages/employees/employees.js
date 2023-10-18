import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import Spinner from "react-bootstrap/Spinner";

export default function Employees() {

  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();

  async function fetchEmployees(query = "", page = 0, size = 10) {
    try {
      setSearching(true);
      setLoading(true);

      const endpoint = query
        ? `http://localhost:8080/api/v1/users/search?query=${query}&page=${page}&size=${size}`
        : `http://localhost:8080/api/v1/users?page=${page}&size=${size}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Employees");
      }

      const data = await response.json();
      setEmployees(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchEmployees(searchQuery, newPage, 10);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchButtonClick = () => {
    // Trigger the search when the search button is clicked
    fetchEmployees(searchQuery);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete Employee");
      }

      router.reload("/employees/employees");
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Employees</h1>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search employees"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearchButtonClick}
          disabled={searching}
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" /> Loading...
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <ul className="list-group">
        {employees.map((employee) => (
          <li key={employee.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{employee.firstname} {employee.lastname}</h5>
                <p>Email: {employee.email}</p>
              </div>
              <div>
                <Link href={`/employees/${employee.id}`} className="btn btn-info btn-sm me-2">
                  <AiOutlineSearch size={16} /> Details
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.id)}>
                  <AiOutlineDelete size={16} /> Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination mt-3 justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <span className="page-link">{`Page ${currentPage + 1} of ${totalPages}`}</span>
          </li>
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </li>
        </ul>
      </div>


    </div>
  );
}
