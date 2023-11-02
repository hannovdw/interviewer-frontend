import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export default function EditInterview() {

    const router = useRouter();
    const { id } = router.query;

    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [titlesLoading, setTitlesLoading] = useState(true);
    const [titleOptions, setTitleOptions] = useState([]);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [candidatesOptions, setCandidatesOptions] = useState([]);
    const [employeesOptions, setEmployeesOptions] = useState([]);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);

    const [state, setState] = useState({
        title: {},
        dateTime: "",
        candidate: {},
        users: []
    });

    async function fetchInterview() {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/interviews/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch Interview");
            }

            const data = await response.json();
            setState({ ...state, ...data });
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchTitles();
        fetchCandidatesByQuery(searchQuery);
        fetchEmployeesByQuery(searchQuery);
        fetchInterview();
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
                var candidateOptions = data.content.map((candidate) => ({
                    value: candidate.id,
                    label: `${candidate.firstName} ${candidate.lastName}`
                }))
                setCandidatesOptions(candidateOptions)
                setIsError(false);
                setCandidatesLoading(false);

            } else {
                console.error("Error fetching candidates");
            }
        } catch (error) {
            console.error("Error fetching candidates", error);
        }
    }

    async function fetchEmployeesByQuery(query) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/search?query=${query}&page=0&size=10`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                var employeesOptions = data.content.map((employee) => ({
                    value: employee.id,
                    label: `${employee.firstname} ${employee.lastname}`
                }))
                setEmployeesOptions(employeesOptions)
                setIsError(false);
                setEmployeesLoading(false);
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

    function handleSearchInputChangeEmployee(event) {
        setSearchQuery(event);
        fetchEmployeesByQuery(event);
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
            var titleOptions = data.map((title) => ({
                value: title.id,
                label: title.titleName
            }))
            setTitleOptions(titleOptions)
            setIsError(false);
            setTitlesLoading(false);
        } else {
            setIsError(true);
        }
    }


    function handleDateTimeChange(dateTime) {
        setState({ ...state, dateTime: dateTime });
    }

    function handleTitleChange(selectedTitle) {
        const newTitle = { id: selectedTitle.value }
        setState({ ...state, title: newTitle });

    }
    function handleCandidateChange(selectedCandidate) {
        const newCandidate = { id: selectedCandidate.value }
        setState({ ...state, candidate: newCandidate });
    }

    function handleEmployeeChange(selectedEmployees) {
        const users = selectedEmployees.map(emp => ({ id: emp.value }));
        console.log(users);
        setState({ ...state, users: users });
    }

    async function handleSubmit() {

        console.log(state);

        setIsSubmitClicked(true);

        // if (
        //     state.dateTime.trim() === ""
        // ) {
        //     setIsError(true);
        //     setError("Please enter required fields.");
        //     return;
        // }

        const requestBody = JSON.stringify({
            "id": state.id,
            "dateTime": state.dateTime,
            "title": {
                "id": state.title.id
            },
            "candidate": {
                "id": state.candidate.id
            },
            "users": state.users.map(user => ({ "id": user.id }))
        });

        console.log(requestBody);

        const res = await fetch(`http://localhost:8080/api/v1/interviews`, {
            method: "PUT",
            body: requestBody,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });

        if (res.ok) {
            setIsSuccess(true);
            setIsError(false);
            setIsSubmitClicked(false);
            setTimeout(() => {
                setIsSuccess(false);
                router.push('/interviews/interviews');
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
                        <h2 className="text-center">Update Interview</h2>
                        <br />
                    </div>

                    {!titlesLoading && state.title.id ? (
                        <div className="form-group">
                            <label htmlFor="searchQuery">Title</label>
                            <Select
                                value={titleOptions.value}
                                defaultValue={titleOptions.find(titleOption => titleOption.value === state.title.id)}
                                options={titleOptions}
                                onChange={handleTitleChange}
                                name="searchTitle"
                                id="searchTitle"
                            />
                        </div>
                    ) : (
                        <div>Loading titles...</div>
                    )}


                    {!candidatesLoading && state.candidate.id ? (
                        <div className="form-group">
                            <label htmlFor="searchQuery">Candidate</label>
                            <Select
                                value={candidatesOptions.value}
                                defaultValue={{
                                    value: state.candidate.id,
                                    label: `${state.candidate.firstName} ${state.candidate.lastName}`
                                }}
                                options={candidatesOptions}
                                isSearchable
                                onInputChange={handleSearchInputChangeCandidate}
                                onChange={handleCandidateChange}
                                name="searchCandidate"
                                id="searchTitle"
                            />
                        </div>
                    ) : (
                        <div>Loading Candidates...</div>
                    )}

                    {!employeesLoading && state.users.map(item => item).length > 0 ? (
                        <div className="form-group">
                            <label htmlFor="searchQuery">Employees</label>
                            <Select
                                value={employeesOptions.value}
                                defaultValue={state.users.map(item => ({
                                    value: item.id,
                                    label: `${item.firstname} ${item.lastname}`
                                }))}
                                options={employeesOptions}
                                onChange={handleEmployeeChange}
                                onInputChange={handleSearchInputChangeEmployee}
                                isSearchable={true}
                                isMulti={true}
                                name="searchEmployee"
                                id="searchEmployee"
                                components={makeAnimated()}
                            />
                        </div>
                    ) : (
                        <div>Loading Employees...</div>
                    )}
                    <div className="form-group">
                        <label htmlFor="interviewDate">Interview Date</label>
                        <div>
                            <DatePicker
                                selected={state.dateTime ? new Date(state.dateTime) : null}
                                onChange={handleDateTimeChange}
                                dateFormat="yyyy-MM-dd"
                                name="interviewDate"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startTime">Time</label>
                        <div>
                            <DatePicker
                                selected={state.dateTime ? new Date(state.dateTime) : null}
                                onChange={handleDateTimeChange}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                name="startTime"
                                className="form-control"
                            />
                        </div>
                    </div>


                    {/* Add other input fields for firstName, lastName, email, and cellphoneNumber here */}

                    <div className="d-grid gap-2 mt-3">
                        <br />
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                            Update
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
