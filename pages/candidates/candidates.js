import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import Spinner from "react-bootstrap/Spinner";

export default function Candidates() {

  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter()

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    async function fetchCandidates() {
      try {
        await sleep(2000)
        const response = await fetch(`http://localhost:8080/api/v1/candidates`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Candidates");
        }

        const data = await response.json();
        setCandidates(data);

      } catch (error) {
        console.error(error.message)
        setError(error.message);
      }finally{
        setLoading(false)
      }
    }

    fetchCandidates();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleDelete = async (id) => {
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

      router.reload("/candidates/candidates");
    } catch (error) {
      console.error(error.message)
      setError(error.message);
    }
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
        <input type="text" className="form-control form-control-sm" placeholder="Search candidates" />
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" /> Loading...
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

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

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li className="page-item active"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
