import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect } from "react";
import { Form, Dropdown } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


export default function AddInterview() {
  const router = useRouter();

  const [state, setState] = useState({
    title: {},
    interviewDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    candidateId: {},
    employees: []
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [titles, setTitles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTitles();
    fetchCandidatesByQuery(searchQuery);
    fetchEmployeesByQuery(searchQuery);
  }, [searchQuery]);

  async function fetchCandidatesByQuery(query) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/candidates/search?query=${query}&page=0&size=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.content); // Assuming the response contains an array of candidates
      } else {
        console.error("Error fetching candidates");
      }
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  }

  async function fetchEmployeesByQuery(query) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users?page=0&size=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.content);
      } else {
        console.error("Error fetching employees");
      }
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  }

  function handleSearchInputChangeCandidate(event) {
    setSearchQuery(event);
    fetchCandidatesByQuery(event);
  }

  async function fetchTitles() {
    const res = await fetch(`http://localhost:8080/api/v1/titles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      const data = await res.json();
      setTitles(data);
      setIsError(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } else {
      setIsError(true);
    }
  }


  function handleDateChange(date) {
    setState({ ...state, interviewDate: date });
  }

  function handleStartTimeChange(date) {
    setState({ ...state, startTime: date });
  }

  function handleEndTimeChange(date) {
    setState({ ...state, endTime: date });
  }

  function handleTitleChange(selectedTitle) {
    console.log(selectedTitle)
    setState({ ...state, title: selectedTitle });
  }

  function handleCandidateChange(selectedCandidate) {
    setState({ ...state, candidate: selectedCandidate });
  }

  function handleEmployeeChange(selectedEmployees) {
    setState({ ...state, employees: selectedEmployees });
  }

  async function handleSubmit() {
    const { interviewDate, startTime, title, candidate, employees } = state;

    // Format date and time
    const date = interviewDate.toISOString().split('T')[0];
    const time = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create the JSON body
    const requestBody = {
      date,
      time,
      title: { id: title.value }, // Assuming title is an object with a "value" property
      candidate: { id: candidate.value }, // Assuming candidate is an object with a "value" property
      users: employees.map((employee) => ({ id: employee.value })), // Map selected employees to an array of objects
    };

    console.log(requestBody)

    const res = await fetch(`http://localhost:8080/api/v1/interviews`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
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

  return (
    <div>
      <br />
      <br />

      <div className="col-md-3 m-auto Auth-form-container border">
        <div className="Auth-form-content p-5 bg-light">
          <div className="form-group mt-3">
            <h2 className="text-center">Add Interview</h2>
            <br />
          </div>

          <div className="form-group">
            <label htmlFor="searchQuery">Position</label>
            <Select
              value={state.title}
              options={titles.map((title) => ({
                value: title.id, // Assuming title.id is the ID of the title
                label: title.titleName,
              }))}
              onChange={handleTitleChange}
              isClearable={true}
              name="searchTitle"
              id="searchTitle"
            />
          </div>

          <div className="form-group">
            <label htmlFor="searchQuery">Candidate</label>
            <Select
              selected={state.candidate}
              options={candidates.map((candidate) => ({
                value: candidate.id,
                label: `${candidate.firstName} ${candidate.lastName}`,
              }))}
              onChange={handleCandidateChange}
              isClearable={true} // Allow clearing the selection
              isSearchable={true} // Enable search functionality
              name="searchCandidate"
              id="searchCandidate"
              components={makeAnimated()} // Enable multi-select and other animations
              onInputChange={handleSearchInputChangeCandidate}// Add this line for live search
            />
          </div>

          <div className="form-group">
            <label htmlFor="searchQuery">Employees</label>
            <Select
              selected={state.employees}
              options={employees.map((employee) => ({
                value: employee.id,
                label: `${employee.firstname} ${employee.lastname}`,
              }))}
              onChange={handleEmployeeChange}
              isClearable={true} // Allow clearing the selection
              isSearchable={true} // Enable search functionality
              isMulti={true} // Allow multiple selections
              name="searchEmployee"
              id="searchEmployee"
              components={makeAnimated()} // Enable multi-select and other animations
            />
          </div>

          <div className="form-group">
            <label htmlFor="interviewDate">Interview Date</label>
            <div>
              <DatePicker
                selected={state.interviewDate}
                onChange={handleDateChange}
                dateFormat="P"
                name="interviewDate"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <div>
              <DatePicker
                selected={state.startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                name="startTime"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <div>
              <DatePicker
                selected={state.endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                name="endTime"
                className="form-control"
              />
            </div>
          </div>

          {/* Add other input fields for firstName, lastName, email, and cellphoneNumber here */}

          <div className="d-grid gap-2 mt-3">
            <br />
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Add
            </button>
          </div>

          <div className="d-grid gap-2 mt-3">
            <br />
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/interviews/interviews")}
            >
              Back to Interviews
            </button>
          </div>

          {isSuccess && (
            <Alert key={"success"} variant={"success"}>
              <h6 className="text-center">Success</h6>
            </Alert>
          )}

          {isError && (
            <Alert key={"error"} variant={"danger"}>
              <h6 className="text-center">Error</h6>
            </Alert>
          )}
        </div>
      </div>
      <style jsx>{`
        .form-group {
          margin-bottom: 15px;
        }
        .date-time-group {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
