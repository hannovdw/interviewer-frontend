import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Spinner from "react-bootstrap/Spinner";
import Link from "next/link";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { intervalToDuration } from "date-fns/fp";

export default function EditInterview() {

    const router = useRouter();
    const { id } = router.query;

    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [titles, setTitles] = useState([]);
    const [titlesLoading, setTitlesLoading] = useState(true);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [interviewLoading, setInterviewLoading] = useState(true);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);

    const [interviewState, setInterviewState] = useState({
        title: {},
        dateTime: "",
        candidate: {},
        users: []
    });

    useEffect(() => {
        fetchTitles();
        fetchCandidates();
        fetchEmployees();
        fetchInterview();
    }, []);

    async function fetchInterview() {

        setIsLoading(true);

        const response = await fetch(`http://localhost:8080/api/v1/interviews/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        });

        if (response.ok) {
            const data = await response.json();
            setInterviewState({ ...interviewState, ...data });
            setInterviewLoading(false);
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
                    setError("Error fetching interview.");
                }
            }
        }

        setIsLoading(false);

    }

    async function fetchCandidates(query = "") {

        setIsLoading(true);

        const response = await fetch(`http://localhost:8080/api/v1/candidates/search/abbreviated?query=${query}&page=0&size=10`, {
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
            setCandidates(candidateOptions);
            setCandidatesLoading(false);
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

    async function fetchEmployees(query = "") {

        setIsLoading(false);

        const response = await fetch(`http://localhost:8080/api/v1/users/search/abbreviated?query=${query}&page=0&size=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        });

        if (response.ok) {
            const data = await response.json();
            var employees = data.content.map((employee) => ({
                value: employee.id,
                label: `${employee.firstName} ${employee.lastName}`
            }))
            setEmployees(employees)
            setEmployeesLoading(false);
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
                    setError("Error fetching emloyees.");
                }
            }
        }

        setIsLoading(false);
    }

    async function fetchTitles() {

        const response = await fetch(`http://localhost:8080/api/v1/titles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });


        if (response.ok) {
            const data = await response.json();
            var titles = data.map((title) => ({
                value: title.id,
                label: title.titleName
            }))
            setTitles(titles)
            setIsError(false);
            setTitlesLoading(false);
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

    async function handleSubmit() {

        setIsLoading(true);

        setIsSubmitClicked(true);

        if (
            !interviewState.users.map(item => item).length > 0
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
            "users": interviewState.users.map(user => ({ "id": user.id }))
        });

        const response = await fetch(`http://localhost:8080/api/v1/interviews/${id}`, {
            method: "PUT",
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
                router.push(`/interviews/${id}`);
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


    function handleDateTimeChange(dateTime) {
        setInterviewState({ ...interviewState, dateTime: dateTime });
    }

    function handleTitleChange(selectedTitle) {
        const newTitle = { id: selectedTitle.value }
        setInterviewState({ ...interviewState, title: newTitle });

    }
    function handleCandidateChange(selectedCandidate) {
        const newCandidate = { id: selectedCandidate.value };
        setInterviewState({ ...interviewState, candidate: newCandidate });
    }

    function handleEmployeeChange(selectedEmployees) {
        const users = selectedEmployees.map(emp => ({ id: emp.value }));
        console.log(users);
        setInterviewState({ ...interviewState, users: users });
    }

    function handleSearchInputChangeCandidate(event) {
        fetchCandidates(event);
    }

    function handleSearchInputChangeEmployee(event) {
        fetchEmployees(event);
    }

    return (
        <div className="p-5 " style={{ backgroundColor: '#eee', minHeight: '100vh' }}>

            <div>
                <Link href="/interviews/[id]" as={`/interviews/${id}`}>
                    <button className="btn btn-outline-secondary mx-4">
                        <AiOutlineArrowLeft />
                        Back
                    </button>
                </Link>
            </div>

            {isLoading && !isError && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> Loading Interview...
                </div>
            )}
            <br />

            {!interviewLoading &&

                <div className=" p-5 m-auto col-md-4">
                    <div className="p-4 bg-light rounded border border-secondary">

                        <div className="col text-center mt-1 text-secondary">
                            <h3>Edit Interview</h3>
                        </div>

                        <br />

                        {!titlesLoading && interviewState.title.id ? (
                            <div className="form-group">
                                <label htmlFor="searchQuery">Title</label>
                                <Select
                                    value={titles.value}
                                    defaultValue={titles.find(titleOption => titleOption.value === interviewState.title.id)}
                                    options={titles}
                                    onChange={handleTitleChange}
                                    name="searchTitle"
                                    id="searchTitle"
                                />
                            </div>
                        ) : (
                            <div>Loading titles...</div>
                        )}


                        {!candidatesLoading && interviewState.candidate.id ? (
                            <div className="form-group">
                                <label htmlFor="searchQuery">Candidate</label>
                                <Select
                                    value={candidates.value}
                                    defaultValue={{
                                        value: interviewState.candidate.id,
                                        label: `${interviewState.candidate.firstName} ${interviewState.candidate.lastName}`
                                    }}
                                    options={candidates}
                                    isSearchable={true}
                                    onInputChange={handleSearchInputChangeCandidate}
                                    onChange={handleCandidateChange}
                                    name="searchCandidate"
                                    id="searchTitle"
                                />
                            </div>
                        ) : (
                            <div>Loading Candidates...</div>
                        )}

                        <label htmlFor="searchQuery">Employees</label>
                        {!employeesLoading && !interviewLoading ? (
                            <div className={`form-group ${isSubmitClicked && (!interviewState.users.map(item => item).length > 0) ? 'border border-danger rounded' : ''}`}>

                                <Select
                                    value={employees.value}
                                    defaultValue={interviewState.users.map(user => ({
                                        value: user.id,
                                        label: `${user.firstName} ${user.lastName}`
                                    }))}
                                    options={employees}
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
                                    selected={interviewState.dateTime ? new Date(interviewState.dateTime) : null}
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
                                    selected={interviewState.dateTime ? new Date(interviewState.dateTime) : null}
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



                        <div className="d-grid mt-3">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                Update
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

                    </div>

                </div>

            }

            {isError && (
                <div>
                    <br />
                    <Alert key={'error'} variant={'danger'}>
                        <h6 className="text-center">{error}</h6>
                    </Alert>
                </div>
            )}

        </div>
    );
}
