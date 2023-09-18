import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Candidate() {
  const router = useRouter();
  const { id } = router.query;

  const [candidate, setCandidate] = useState({});
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:8080/api/v1/candidates`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      setIsSuccess(true);
      setIsError(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } else {
      setIsError(true);
    }
  }

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
        setError(error.message);
      }
    }

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/candidates/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete Candidate");
      }

      router.push("/candidates/candidates");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <Link href="/candidates/candidates" passHref>
          <button className="btn btn-outline-primary">
            <AiOutlineArrowLeft className="mr-2" />
            Back to Candidates
          </button>
        </Link>
      </div>

      <h1 className="text-center mt-4">Candidate Information</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card mx-auto" style={{ width: "600px" }}>
        <div className="card-body text-center">
          <h5 className="card-title">{candidate.firstName} {candidate.lastName}</h5>
          <p className="card-text">Email: {candidate.email}</p>
          <p className="card-text">Cellphone Number: {candidate.cellphoneNumber}</p>
          <div className="mt-3">
                <Link href={`/candidates/edit/${candidate.id}`} className="btn btn-success btn-sm me-2">
                  <AiOutlineEdit size={16} /> Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                  <AiOutlineDelete size={16} /> Delete
                </button>
            <span className="ml-2"></span> {/* Small space */}
          </div>
        </div>
      </div>
    </div>
  );
}
