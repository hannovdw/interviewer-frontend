import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "react-bootstrap/Spinner";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Link from "next/link";
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function AddInterview() {
  const router = useRouter();

  const [interviewState, setInterviewState] = useState({
    title: {
      id: ""
    },
    dateTime: "",
    isInPerson: true,
    linkAddress: "",
    endDateTime: "",
    candidate: {},
    employees: [],
  });

  const [titles, setTitles] = useState([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTitles();
    fetchCandidates();
    fetchEmployees();
  }, []);

  async function fetchCandidates(query = "", page = 0, size = 10) {
    setIsLoading(true);

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
      var candidateOptions = data.content.map((candidate) => ({
        value: candidate.id,
        label: `${candidate.firstName} ${candidate.lastName}`,
      }));
      setCandidates(candidateOptions);
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

    setIsLoading(false);
  }

  async function fetchEmployees(query = "", page = 0, size = 10) {
    setIsLoading(true);

    const endpoint = `http://localhost:8080/api/v1/users/search/abbreviated?query=${query}&page=${page}&size=${size}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      var employeeOptions = data.content.map((employee) => ({
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`,
      }));
      setEmployees(employeeOptions);
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
          setError("Error fetching employees.");
        }
      }
    }

    setIsLoading(false);
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
      }));
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
  }

  function handleDateTimeChange(dateTime) {
    setInterviewState({ ...interviewState, dateTime: dateTime, endDateTime: dateTime });
  }

  function handleEndDateTimeChange(dateTime) {
    setInterviewState({ ...interviewState, endDateTime: dateTime });
  }

  function handleTitleChange(selectedTitle) {
    const newTitle = { id: selectedTitle.value };
    setInterviewState({ ...interviewState, title: newTitle });
  }

  function handleCandidateChange(selectedCandidate) {
    const newCandidate = { id: selectedCandidate.value };
    setInterviewState({ ...interviewState, candidate: newCandidate });
  }

  function handleEmployeeChange(selectedEmployees) {
    const newEmployees = selectedEmployees.map(employee => ({ id: employee.value }));
    setInterviewState({ ...interviewState, employees: newEmployees });
  }

  function handleLinkAddressChange(event) {
    setInterviewState({ ...interviewState, linkAddress: event.target.value });
    console.log(event.target.value);
  }


  function handleRadioChange(event) {
    setInterviewState({
      ...interviewState,
      isInPerson: event.target.value === 'inPerson',
    });
  }

  function handleSearchInputChangeCandidate(event) {
    fetchCandidates(event);
  }

  function handleSearchInputChangeEmployee(event) {
    fetchEmployees(event);
  }

  function handleRadioChange(event) {
    setIsInPerson(event.target.value === 'inPerson');
  }

  async function handleSubmit() {
    setIsLoading(true);
    setIsSubmitClicked(true);

    if (
      interviewState.dateTime === "" ||
      interviewState.title.id === "" ||
      interviewState.candidate.id === "" ||
      interviewState.employees.length === 0 ||
      interviewState.endDateTime === "" ||
      interviewState.linkAddress === ""
    ) {
      setIsError(true);
      setError("Please enter required fields.");
      setIsLoading(false);
      return;
    }

    if (new Date(interviewState.endDateTime) <= new Date(interviewState.dateTime)) {
      setIsError(true);
      setError("Make sure the end time is after the start time.");
      setIsLoading(false);
      return;
    }

    if (new Date(interviewState.dateTime) < new Date()) {
      setIsError(true);
      setError("Interview date cant be in the past.");
      setIsLoading(false);
      return;
    }

    const requestBody = JSON.stringify({
      "dateTime": interviewState.dateTime,
      "endDateTime": interviewState.endDateTime,
      "title": {
        "id": interviewState.title.id
      },
      "candidate": {
        "id": interviewState.candidate.id
      },
      "users": interviewState.employees.map((employee) => ({ id: employee.id })),
      "isInPerson": interviewState.isInPerson,
      "linkAddress": interviewState.linkAddress
    });

    const response = await fetch(`http://localhost:8080/api/v1/interviews`, {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      setIsSuccess(true);
      setIsError(false);
      setIsSubmitClicked(false);
      setTimeout(() => {
        setIsSuccess(false);
        router.push('/interviews/interviews');
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
          setError("Error adding Interview.");
        }
      }
    }

    setIsLoading(false);
  }

  return (
    <div className="p-5" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
      <div>
        <Link href="/interviews/interviews">
          <button className="btn btn-outline-secondary mx-4">
            <AiOutlineArrowLeft />
            Back
          </button>
        </Link>
      </div>

      <div className="m-auto col-md-4">
        <div className="p-4 bg-light rounded border border-secondary">
          <div className="col text-center mt-1 text-secondary">
            <h3>Add Interview</h3>
          </div>

          <br />
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" /> Loading...
            </div>
          )}
          <br />

          <label>Candidate</label>
          <div className={`form-group ${isSubmitClicked && (!interviewState.candidate.id || interviewState.candidate.id === "") ? 'border border-danger rounded' : ''}`}>
            <Select
              placeholder="Candidate"
              selected={interviewState.candidate}
              options={candidates}
              onChange={handleCandidateChange}
              isSearchable={true}
              components={makeAnimated()}
              onInputChange={handleSearchInputChangeCandidate}
            />
          </div>

          <label className="mt-1">Employees</label>
          <div className={`form-group ${isSubmitClicked && (!interviewState.employees || interviewState.employees.length === 0) ? 'border border-danger rounded' : ''}`}>
            <Select
              placeholder="Employees"
              selected={interviewState.employees}
              options={employees}
              onChange={handleEmployeeChange}
              isClearable={true}
              isSearchable={true}
              isMulti={true}
              components={makeAnimated()}
              onInputChange={handleSearchInputChangeEmployee}
            />
          </div>

          <label className="mt-1">Position</label>
          <div className={`form-group ${isSubmitClicked && interviewState.title.id < 1 ? 'border border-danger rounded' : ''}`}>
            <Select
              placeholder="Position"
              value={interviewState.title ? titles.find(title => title.value === interviewState.title.id) : null}
              options={titles}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mt-1">
            <label htmlFor="searchQuery">Date</label>
            <div>
              <DatePicker
                selected={interviewState.dateTime ? new Date(interviewState.dateTime) : null}
                placeholderText="Select a date"
                onChange={handleDateTimeChange}
                placeholder="Date"
                dateFormat="P"
                name="interviewDate"
                className={`form-control ${isSubmitClicked && !interviewState.dateTime ? 'border-danger' : ''}`}
                style={{ borderColor: isSubmitClicked && !interviewState.dateTime ? "red" : "" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="mt-1" htmlFor="searchQuery">Start Time</label>
            <div>
              <DatePicker
                selected={interviewState.dateTime ? new Date(interviewState.dateTime) : null}
                placeholderText="Select a date"
                onChange={handleDateTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                name="time"
                className={`form-control ${isSubmitClicked && !interviewState.dateTime ? 'border-danger' : ''}`}
                style={{ borderColor: isSubmitClicked && !interviewState.dateTime ? "red" : "" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="mt-1" htmlFor="endDateTime">End Time</label>
            <div>
              <DatePicker
                selected={interviewState.endDateTime ? new Date(interviewState.endDateTime) : null}
                placeholderText="Select end time"
                onChange={handleEndDateTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                name="endTime"
                className={`form-control ${isSubmitClicked && (!interviewState.endDateTime || new Date(interviewState.endDateTime) <= new Date(interviewState.dateTime)) ? 'border-danger' : ''}`}
                style={{ borderColor: isSubmitClicked && (!interviewState.endDateTime || new Date(interviewState.endDateTime) <= new Date(interviewState.dateTime)) ? "red" : "" }}
              />
            </div>
          </div>

          <div className="form-group mt-1">
            <label>Interview Type</label>
            <div>
              <label className="mr-2">
                <input
                  type="radio"
                  value="inPerson"
                  checked={interviewState.isInPerson}
                  onChange={handleRadioChange}
                /> In Person
              </label>
              <label>
                <input
                  type="radio"
                  value="virtual"
                  checked={!interviewState.isInPerson}
                  onChange={handleRadioChange}
                /> Virtual
              </label>
            </div>
          </div>

          {interviewState.isInPerson ? (
            <div>
              <label>Address</label>
              <div className={`form-group mt-1 ${isSubmitClicked && interviewState.isInPerson && !interviewState.linkAddress ? 'border border-danger rounded' : ''}`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter address"
                  value={interviewState.linkAddress}
                  onChange={handleLinkAddressChange}
                />
              </div>
            </div>
          ) : (
            <div>
              <label>Meeting URL</label>
              <div className={`form-group mt-1 ${isSubmitClicked && !interviewState.isInPerson && !interviewState.linkAddress ? 'border border-danger rounded' : ''}`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter meeting URL"
                  value={interviewState.linkAddress}
                  onChange={handleLinkAddressChange}
                />
              </div>
            </div>
          )}

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Add
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
