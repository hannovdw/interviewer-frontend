import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';

export default function AddCandidate() {
  const router = useRouter();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
  });

  const [initialState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

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
      setState(initialState);
      setIsError(false);
      setIsSubmitClicked(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } else {
      const responseBody = await res.json();
      setIsError(true);
      setError(responseBody.error);
    }
  }

  return (
    <div>
      <br />
      <br />

      <div className="col-md-3 m-auto Auth-form-container border">
        <div className="Auth-form-content p-5 bg-light">
          <div className="form-group mt-3">
            <h2 className="text-center">Add Candidate</h2>
            <br />
          </div>

          {/* First Name */}
          <div className={`form-group mt-3`}>
            <label>First Name</label>
            <input
              name="firstName"
              className={`form-control mt-1`}
              placeholder="Enter First Name"
              value={state.firstName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.firstName.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Last Name */}
          <div className={`form-group mt-3`}>
            <label>Last Name</label>
            <input
              name="lastName"
              className={`form-control mt-1`}
              placeholder="Enter Last Name"
              value={state.lastName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.lastName.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Email */}
          <div className={`form-group mt-3`}>
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className={`form-control mt-1`}
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.email.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Cellphone Number */}
          <div className={`form-group mt-3`}>
            <label>Cellphone Number</label>
            <input
              name="cellphoneNumber"
              className={`form-control mt-1`}
              placeholder="Enter Cellphone Number"
              value={state.cellphoneNumber}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && state.cellphoneNumber.trim() === "" ? "red" : "" }}
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2 mt-3">
            <br />
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Add
            </button>
          </div>


          {/* Button to go back to /candidates */}
          <div className="d-grid gap-2 mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/candidates/candidates')}
            >
              Back to Candidates
            </button>
          </div>

          <br />
          {/* Success Alert */}
          {isSuccess && (
            <Alert key={'success'} variant={'success'}>
              <h6 className="text-center">Success</h6>
            </Alert>
          )}

          <br />
          {/* Error Alert */}
          {isError && (
            <Alert key={'error'} variant={'danger'}>
              <h6 className="text-center">{error}</h6>
            </Alert>
          )}

        </div>
      </div>
    </div>
  );
}
