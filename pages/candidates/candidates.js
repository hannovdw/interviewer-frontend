import React, { useState, useEffect } from "react";
import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import {
  AiOutlineSearch,
  AiOutlinePlus,
} from "react-icons/ai";

export default function Candidates() {

  const router = useRouter();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates(query = "", page = 0, size = 10) {

    setLoading(true);

    const endpoint = `http://localhost:8080/api/v1/candidates/search/abbreviated?query=${query}&page=${page}&size=${size}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCandidates(data.content);
      setTotalPages(data.totalPages);
      setIsError(false);
    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error fetching candidates.");
        }
      }
    }

    setLoading(false);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCandidates(searchQuery, newPage, 10);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    fetchCandidates(event.target.value);
  };

  return (
    <div className="p-5">
      <div className="container mt- bg-light p-4 rounded border">
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="col text-center text-secondary">
            <h1>Candidates</h1>
          </div>

          <Link href="/candidates/add">
            <button className="btn btn-primary">
              <AiOutlinePlus size={16} /> Add
            </button>
          </Link>
        </div>

        <div className="input-group">
          <div className="search-icon" style={{ padding: '10px' }}>
            <SearchIcon />
          </div>
          <input
            className="form-control form-control rounded-pill border border-secondary"
            type="search"
            placeholder="Search..."
            onChange={handleSearchInputChange}
          />
        </div>

        <br />
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" /> Loading...
          </div>
        )}
        <br />

        {isError && (
          <Alert key={'error'} variant={'danger'}>
            <h6 className="text-center">{error}</h6>
          </Alert>
        )}

        <ul className="list-group">

          {candidates.map((candidate) => (

            <li key={candidate.id} className="list-group-item">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h5>{candidate.firstName} {candidate.lastName}</h5>
                  <p>{candidate.email}</p>
                </div>

                <div>
                  <Link href={`/candidates/${candidate.id}`} className="btn btn-info btn-sm me-2 custom-button">
                    <AiOutlineSearch size={16} /> Details
                  </Link>
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

    </div>

  );

}
