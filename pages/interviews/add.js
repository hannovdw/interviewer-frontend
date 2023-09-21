import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddCandidate() {
  const router = useRouter();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
    interviewDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    fetchTitles();
  }, []);

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

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
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

  function handleTitleChange(e) {
    setState({ ...state, selectedTitle: e.target.value });
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:8080/api/v1/interviews`, {
      method: "POST",
      body: JSON.stringify(state),
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
            <label htmlFor="selectedTitle">Position</label>
            <select
              name="selectedTitle"
              id="selectedTitle"
              className="form-control"
              onChange={handleTitleChange}
              value={state.selectedTitle}
            >
              {titles.map((title) => (
                <option key={title.id}>
                  {title.title}
                </option>
              ))}
            </select>
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
