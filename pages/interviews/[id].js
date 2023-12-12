import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Dropdown from "react-dropdown-select";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Interview() {

    const router = useRouter();

    const { id } = router.query;

    const [interview, setInterview] = useState({});
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleteError, setIsDeleteError] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (id) {
            fetchInterview();
        }
    }, [id]);

    async function fetchInterview() {

        setLoading(true);

        const response = await fetch(`http://localhost:8080/api/v1/interviews/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        });

        if (response.ok) {
            const data = await response.json();
            setInterview(data);
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

        setLoading(false);

    }

    const handleDelete = async () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {

        setLoading(true);

        setShowDeleteConfirmation(false);

        const response = await fetch(
            `http://localhost:8080/api/v1/interviews/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );

        if (response.ok) {
            setIsError(false);
            router.push('/interviews/interviews');
        } else {

            if (response.status === 403) {
                router.push('/login');
            } else {
                setIsDeleteError(true);
                try {
                    const responseBody = await response.json();
                    setError(responseBody.error);
                } catch (error) {
                    setError("Error deleting interview.");
                }
            }
        }

        setLoading(false);

    };


    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setIsDeleteError(false);
    };

    return (
        <section style={{ backgroundColor: '#eee', minHeight: '100vh' }}>

            <div>
                <Link href="/interviews/interviews">
                    <button className="btn btn-outline-secondary mt-4 mx-4">
                        <AiOutlineArrowLeft />
                        Back
                    </button>
                </Link>
            </div>

            <div class="container">

                {isError && (
                    <Alert key={'error'} variant={'danger'}>
                        <h6 className="text-center">{error}</h6>
                    </Alert>
                )}

                <br />
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" /> Loading Interview...
                    </div>
                )}

                {!isError && !loading && (

                    <div class="row">
                        <div class="col-lg-4">
                            <div class="card mb-4">
                                <div class="card-body text-center">
                                    <h4 class="my-3">Candidate</h4>
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                                        class="rounded-circle img-fluid" style={{ width: '150px' }}></img>
                                    <h5 class="my-3">{interview.candidate.firstName} {interview.candidate.lastName}</h5>
                                    <p class="text-muted mb-2">{interview.candidate.title.titleName}</p>
                                    <p class="text-muted mb-2">{interview.candidate.address}</p>
                                    <p class="text-muted mb-2">{interview.candidate.email}</p>
                                    <p class="text-muted mb-4">{interview.candidate.cellphoneNumber}</p>

                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-2">
                                <Link href={`/interviews/edit/${interview.id}`} className="btn btn-success btn-sm me-2">
                                    <AiOutlineEdit size={16} /> Edit
                                </Link>
                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(interview.id)}><AiOutlineDelete size={16} />Delete</button>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="card mb-4">
                                <h4 class="my-3 text-center">Interview Info</h4>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Date</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{new Date(interview.dateTime).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Time</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{new Date(interview.dateTime).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Title</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="text-muted mb-0">{interview.title.titleName}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Interviewers :</p>
                                            <br />
                                        </div>
                                        <ul ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>

                                            {interview.users.map((user) => (

                                                <li key={user.id} className="list-group-item">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <p className="m-0"><b>{user.firstName} {user.lastName}</b></p>
                                                            <p className="m-0">{user.title.titleName}</p>
                                                            <p className="m-0">{user.email}</p>
                                                            <p className="m-0">{user.cellphoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </li>

                                            ))}

                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="">

                                    {/* <div class="card mb-4 mb-md-0">
                      <div class="card-body">
                        <h5 class="mb-4">Top Skills</h5>
                        <p class="mb-1" style={{ width: '150px' }}>SpringBoot</p>
                        <div class="progress rounded" style={{ height: '5px' }}>
                          <div class="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow="80"
                            aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="mt-4 mb-1" style={{ width: '150px' }}>React.js</p>
                        <div class="progress rounded" style={{ height: '5px' }}>
                          <div class="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow="72"
                            aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="mt-4 mb-1" style={{ width: '150px' }}>Java</p>
                        <div class="progress rounded" style={{ height: '5px' }}>
                          <div class="progress-bar" role="progressbar" style={{ width: '89%' }} aria-valuenow="89"
                            aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="mt-4 mb-1" style={{ width: '150px' }}>Docker</p>
                        <div class="progress rounded" style={{ height: '5px' }}>
                          <div class="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow="55"
                            aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="mt-4 mb-1" style={{ width: '150px' }}>Backend API</p>
                        <div class="progress rounded mb-2" style={{ height: '5px' }}>
                          <div class="progress-bar" role="progressbar" style={{ width: '66%' }} aria-valuenow="66"
                            aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div> */}

                                </div>

                            </div>

                        </div>

                        <Modal show={showDeleteConfirmation} onHide={cancelDelete}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to delete this candidate?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={cancelDelete}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={isDeleteError} onHide={cancelDelete}>
                            <Modal.Header closeButton>
                                <Modal.Title>Error Deleting</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{error}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={cancelDelete}>
                                    OK
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                )}

            </div>
        </section>
    );
}
