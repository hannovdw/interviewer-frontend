import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Candidate() {
  const router = useRouter();
  const { id } = router.query;

  const [candidate, setCandidate] = useState({});
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/candidates/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Candidate");
        }

        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error(error.message)
        setError(error.message);
      }
    }

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleDelete = async (id) => {
    console.log(id);
    setSelectedCandidateId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);
    if (selectedCandidateId) {
      console.log(selectedCandidateId);
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
          router.push('/candidates/candidates');
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
    <div className="container mt-5" >
      <div className="d-flex justify-content-between align-items-center">
        <Link href="/candidates/candidates" passHref>
          <button className="btn btn-outline-primary">
            <AiOutlineArrowLeft className="mr-2" />
            Back to Candidates
          </button>
        </Link>
      </div>

      <h1 className="text-center mt-4">Candidate Information</h1>

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

      <div className="card mx-auto" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
        <div className="card-body text-center">
          <h3 className="card-title">{candidate.firstName} {candidate.lastName}</h3>
          <p className="card-text">Email: {candidate.email}</p>
          <p className="card-text">Cellphone Number: {candidate.cellphoneNumber}</p>
          <div className="mt-3">
            <Link href={`/candidates/edit/${candidate.id}`} className="btn btn-success btn-sm me-2">
              <AiOutlineEdit size={16} /> Edit
            </Link>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(candidate.id)}>
              <AiOutlineDelete size={16} /> Delete
            </button>
            <span className="ml-2"></span> { }
          </div>
        </div>
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
