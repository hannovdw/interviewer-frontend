import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Select from 'react-select';
import Link from "next/link";

export default function Candidate() {

  const router = useRouter();

  const { id } = router.query;

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTitlesLoading, setisTitlesLoading] = useState(true);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [titles, setTitles] = useState([]);
  const [candidateState, setCandidateState] = useState({});

  useEffect(() => {
    if (id) {
      fetchCandidate();
      fetchTitles();
    }
  }, [id]);

  function handleChange(e) {
    const copy = { ...candidateState };
    copy[e.target.name] = e.target.value;
    setCandidateState(copy);
  }

  function handleTitleChange(selectedTitle) {
    const newTitle = { id: selectedTitle.value }
    setCandidateState({ ...candidateState, title: newTitle });

  }

  async function fetchCandidate() {

    setIsLoading(true);

    const response = await fetch(`http://localhost:8080/api/v1/candidates/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCandidateState(data);
    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error fetching candidate.");
        }
      }
    }

    setIsLoading(false);

  }

  async function fetchTitles() {

    setisTitlesLoading(true);

    const response = await fetch(`http://localhost:8080/api/v1/titles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
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

    setisTitlesLoading(false);
  }

  async function handleSubmit() {

    setIsLoading(true);
    setIsSubmitClicked(true);

    if (
      candidateState.firstName.trim() === "" ||
      candidateState.lastName.trim() === "" ||
      candidateState.email.trim() === "" ||
      candidateState.cellphoneNumber.trim() === "" ||
      candidateState.titleId === "" ||
      candidateState.address.trim() === ""
    ) {
      setIsError(true);
      setIsLoading(false);
      setError("Please enter required fields.");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/v1/candidates/${id}`, {
      method: "PUT",
      body: JSON.stringify(candidateState),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {

      setIsSuccess(true);
      setIsError(false);
      setIsSubmitClicked(false);
      setTimeout(() => {
        setIsSuccess(false);
        router.push('/candidates/candidates');
      }, 1500);

    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error updating candidate.");
        }
      }
    }

    setIsLoading(false);

  }

  return (
    <div className="p-4" style={{ minHeight: '100vh' }}>

      <div>
        <Link href="/candidates/candidates">
          <button className="btn btn-outline-secondary">
            <AiOutlineArrowLeft />
            Back
          </button>
        </Link>
      </div>

      <div className=" p-5 m-auto col-md-4 ">

        <div className="p-4 bg-light rounded border border-secondary">

          <div className="col text-center mt-1 text-secondary">
            <h3>Edit Candidate</h3>
          </div>

          <br />
          {(isLoading || isTitlesLoading) && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" /> Loading...
            </div>
          )}
          <br />

          <div className="form-group mt-3">
            <input
              name="firstName"
              className="form-control mt-1"
              value={candidateState.firstName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.firstName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="lastName"
              className="form-control mt-1"
              value={candidateState.lastName}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.lastName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="email"
              className="form-control mt-1"
              value={candidateState.email}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.email.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="cellphoneNumber"
              className="form-control mt-1"
              value={candidateState.cellphoneNumber}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.cellphoneNumber.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="address"
              className="form-control mt-1"
              value={candidateState.address}
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && candidateState.address.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <Select
              value={candidateState.title ? titles.find(title => title.value === candidateState.title.id) : null}
              options={titles}
              onChange={handleTitleChange}
              name="searchTitle"
              id="searchTitle"
            />
          </div>

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Update
            </button>
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/candidates/candidates')}
            >
              Back
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
