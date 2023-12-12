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
    candidate: {},
    employees: [
    ]
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
      }))
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
      }))
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

  function handleSearchInputChangeCandidate(event) {
    fetchCandidates(event);
  }

  function handleSearchInputChangeEmployee(event) {
    fetchEmployees(event);
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
  }


  function handleDateTimeChange(dateTime) {
    setInterviewState({ ...interviewState, dateTime: dateTime });
  }

  function handleTitleChange(selectedTitle) {
    const newTitle = { id: selectedTitle.value }
    setInterviewState({ ...interviewState, title: newTitle });
  }

  function handleCandidateChange(selectedCandidate) {
    const newCandidate = { id: selectedCandidate.value }
    setInterviewState({ ...interviewState, candidate: newCandidate });
  }

  function handleEmployeeChange(selectedEmployees) {
    const newEmployees = selectedEmployees.map(employee => ({ id: employee.value }));
    setInterviewState({ ...interviewState, employees: newEmployees });
  }

  function handleSearchInputChangeCandidate(event) {
    fetchCandidates(event);
  }

  function handleSearchInputChangeEmployee(event) {
    fetchEmployees(event);
  }

  async function handleSubmit() {

    setIsLoading(true);

    setIsSubmitClicked(true);

    if (
      interviewState.dateTime === "" ||
      interviewState.title.id === "" ||
      interviewState.candidate.id === "" ||
      interviewState.employees.length === 0
    ) {
      setIsError(true);
      setError("Please enter required fields.");
      setIsLoading(false);
      return;
    }

    const requestBody = JSON.stringify({
      "dateTime": interviewState.dateTime,
      "title": {
        "id": interviewState.title.id
      },
      "candidate": {
        "id": interviewState.candidate.id
      },
      "users": interviewState.employees.map((employee) => ({ id: employee.id }))
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

    <div className="p-5 " style={{ backgroundColor: '#eee', minHeight: '100vh' }}>

      <div>
        <Link href="/interviews/interviews">
          <button className="btn btn-outline-secondary mx-4">
            <AiOutlineArrowLeft />
            Back
          </button>
        </Link>
      </div>

      <div className=" p-5 m-auto col-md-4">
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

          <label className="mt-3">Employees</label>
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

          <label className="mt-3">Position</label>
          <div className={`form-group ${isSubmitClicked && interviewState.title.id < 1 ? 'border border-danger rounded' : ''}`}>
            <Select
              placeholder="Position"
              value={interviewState.title ? titles.find(title => title.value === interviewState.title.id) : null}
              options={titles}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mt-3">
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
            <label className="mt-3" htmlFor="searchQuery">Time</label>
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
