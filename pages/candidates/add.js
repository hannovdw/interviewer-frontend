import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/Spinner";
import Select from 'react-select';

export default function AddCandidate() {

  const router = useRouter();

  const [candidateState, setCandidateState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
    title: {
      id: ""
    },
    address: ""
  });

  const [emptyCandidateState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
    title: {
      id: ""
    },
    address: ""
  });

  const [titles, setTitles] = useState([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTitles();
  }, []);

  function handleChange(e) {
    const copy = { ...candidateState };
    copy[e.target.name] = e.target.value;
    setCandidateState(copy);
  }

  function handleTitleChange(selectedTitle) {
    const newTitle = { id: selectedTitle.value }
    setCandidateState({ ...candidateState, title: newTitle });
  }

  async function fetchTitles() {

    setIsLoading(true);

    const response = await fetch(`http://localhost:8080/api/v1/titles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      var titleOptions = data.map((title) => ({
        value: title.id,
        label: title.titleName
      }))
      setTitles(titleOptions);
    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error fetching titles.");
        }
      }
    }

    setIsLoading(false);

  }

  async function handleSubmit() {

    setIsLoading(true);

    setIsSubmitClicked(true);

    if (
      candidateState.firstName.trim() === "" ||
      candidateState.lastName.trim() === "" ||
      candidateState.email.trim() === "" ||
      candidateState.cellphoneNumber.trim() === "" ||
      candidateState.title.id === "" ||
      candidateState.address.trim() === ""
    ) {
      setIsError(true);
      setError("Please enter required fields.");
      setIsLoading(false);
      return;
    }

    const requestBody = JSON.stringify({
      "firstName": candidateState.firstName,
      "lastName": candidateState.lastName,
      "email": candidateState.email,
      "cellphoneNumber": candidateState.cellphoneNumber,
      "address": candidateState.address,
      "title": {
        "id": candidateState.title.id
      }
    });

    const response = await fetch(`http://localhost:8080/api/v1/candidates`, {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      setIsSuccess(true);
      setCandidateState(emptyCandidateState);
      setIsError(false);
      setIsSubmitClicked(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error adding candidate.");
        }
      }
    }

    setIsLoading(false);

  }

  return (

    <div className="p-5 " style={{ minHeight: '100vh' }}>
      <div className=" p-5 m-auto col-md-4">
        <div className="p-4 bg-light rounded border border-secondary">

          <div className="col text-center mt-1 text-secondary">
            <h3>Add Candidate</h3>
          </div>

          <br />
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" /> Loading...
            </div>
          )}
          <br />

          <div className="form-group mt-3">
            <input
              name="firstName"
              value={candidateState.firstName}
              className="form-control mt-1"
              placeholder="First Name"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.firstName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="lastName"
              value={candidateState.lastName}
              className="form-control mt-1"
              placeholder="Last Name"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.lastName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              type="email"
              value={candidateState.email}
              name="email"
              className="form-control mt-1"
              placeholder="Email"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.email.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="cellphoneNumber"
              value={candidateState.cellphoneNumber}
              className="form-control mt-1"
              placeholder="Cellphone Number"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.cellphoneNumber.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="address"
              value={candidateState.address}
              className="form-control mt-1"
              placeholder="Address"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.address.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className={`form-group mt-3 ${isSubmitClicked && candidateState.title.id < 1 ? 'border border-danger rounded' : ''}`}>
            <Select
              value={candidateState.title ? titles.find(title => title.value === candidateState.title.id) : null}
              options={titles}
              placeholder="Current Title"
              onChange={handleTitleChange}
            />
          </div>

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Add
            </button>
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/candidates/candidates')}
            >
              Back to Candidates
            </button>
          </div>

          {isSuccess && (
            <div>
              <br />
              <Alert key={'success'} variant={'success'}>
                <h6 className="text-center">Success</h6>
              </Alert>
            </div>
          )}

          {isError && (
            <div>
              <br />
              <Alert key={'error'} variant={'danger'}>
                <h6 className="text-center">{error}</h6>
              </Alert>
            </div>
          )}

        </div>
      </div>
    </div>

  );
}
