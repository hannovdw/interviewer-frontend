import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Candidate() {

  const router = useRouter();
  const { id } = router.query;

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
  });

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
    setIsSubmitClicked(false);
  }

  async function handleSubmit() {

    setIsSubmitClicked(true);
    if (
      state.firstName.trim() === "" ||
      state.lastName.trim() === "" ||
      state.email.trim() === "" ||
      state.cellphoneNumber.trim() === ""
    ) {
      setIsError(true);
      setError("Please enter required fields.");
      return;
    }

    const res = await fetch(`http://localhost:8080/api/v1/candidates/${id}`, {
      method: "PUT",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      setIsSuccess(true);
      setIsError(false);
      setIsSubmitClicked(false);
      setTimeout(() => {
        setIsSuccess(false);
        router.push('/candidates/candidates');
      }, 1500);
    } else {
      const responseBody = await res.json();
      setIsError(true);
      setError(responseBody.error);
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

        setState({ ...state, ...data });
      } catch (error) {
        console.error(error.message)
        setError(error.message);
      }
    }

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  return (
    <div>
      <br />
      <br />

      <div className="col-md-3 m-auto Auth-form-container border">
        <div className="Auth-form-content p-5 bg-light">
          <div className="form-group mt-3">
            <h2 className="text-center">Edit Candidate</h2>
            <br />
          </div>

          {/* Success Alert */}
          {isSuccess && (
            <Alert key={'success'} variant={'success'}>
              <h6 className="text-center">Success</h6>
            </Alert>
          )}

          {/* Error Alert */}
          {isError && (
            <Alert key={'error'} variant={'danger'}>
              <h6 className="text-center">{error}</h6>
            </Alert>
          )}

          {/* First Name */}
          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              name="firstName"
              className="form-control mt-1"
              value={state.firstName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.firstName.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Last Name */}
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              name="lastName"
              className="form-control mt-1"
              value={state.lastName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.lastName.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Email */}
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              value={state.email}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.email.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Cellphone Number */}
          <div className="form-group mt-3">
            <label>Cellphone Number</label>
            <input
              name="cellphoneNumber"
              className="form-control mt-1"
              value={state.cellphoneNumber}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.cellphoneNumber.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2 mt-3">
            <br />
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Update
            </button>
          </div>


          {/* Button to go back to /candidates */}
          <div className="d-grid gap-2 mt-3">
            <br />
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/candidates/candidates')}
            >
              Back to Candidates
            </button>
          </div>

        </div>
      </div>
    </div>

  );
}
