import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlinePlus,
} from "react-icons/ai";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const router = useRouter();

  async function fetchCandidates(query = "", page = 0, size = 10) {
    try {
      setSearching(true);
      setLoading(true);

      const endpoint = query
        ? `http://localhost:8080/api/v1/candidates/search?query=${query}&page=${page}&size=${size}`
        : `http://localhost:8080/api/v1/candidates?page=${page}&size=${size}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Candidates");
      }

      const data = await response.json();
      setCandidates(data.content); // Set the list of candidates
      setTotalPages(data.totalPages); // Set the total number of pages
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCandidates(searchQuery, newPage, 10); // Fetch data for the new page
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchButtonClick = () => {
    // Trigger the search when the search button is clicked
    fetchCandidates(searchQuery);
  };

  const handleDelete = async (id) => {
    setSelectedCandidateId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);
    if (selectedCandidateId) {
      console.log(selectedCandidateId)
      const res = await fetch(
        `http://localhost:8080/api/v1/candidates/${selectedCandidateId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.ok) {
        setIsSuccess(true);
        setIsError(false);
        setTimeout(() => {
          setIsSuccess(false);
          window.location.reload();
        }, 1000);
      } else {
        const responseBody = await res.json();
        setIsError(true);
        setError(responseBody.error);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };

  const cancelDelete = () => {
    setSelectedCandidateId(null);
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Candidates</h1>
        <Link href="/candidates/add">
          <button className="btn btn-primary">
            <AiOutlinePlus size={16} /> Add
          </button>
        </Link>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search candidates"
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

      {isSuccess && (
        <Alert key={'success'} variant={'success'}>
          <h6 className="text-center">Success</h6>
        </Alert>
      )}

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
                <p>Email: {candidate.email}</p>
                <p>Cellphone Number: {candidate.cellphoneNumber}</p>
              </div>
              <div>
                <Link href={`/candidates/${candidate.id}`} className="btn btn-info btn-sm me-2">
                  <AiOutlineSearch size={16} /> Details
                </Link>
                <Link href={`/candidates/edit/${candidate.id}`} className="btn btn-success btn-sm me-2">
                  <AiOutlineEdit size={16} /> Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(candidate.id)}>
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

      <Modal show={showDeleteConfirmation} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this candidate?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
