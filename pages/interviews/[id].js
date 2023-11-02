import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Interview() {
    const router = useRouter();
    const { id } = router.query;

    const [interview, setInterview] = useState({});
    const [error, setError] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedInterviewId, setSelectedInterviewId] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
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
                setInterview(data);
            } catch (error) {
                console.error(error.message)
                setError(error.message);
            }
        }

        if (id) {
            fetchInterview();
        }
    }, [id]);

    const handleDelete = async (id) => {
        console.log(id);
        setSelectedInterviewId(id);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirmation(false);
        if (selectedInterviewId) {
            console.log(selectedInterviewId);
            const res = await fetch(
                `http://localhost:8080/api/v1/interviews/${selectedInterviewId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );

            if (res.ok) {
                setIsSuccess(true);
                setIsError(false);
                setTimeout(() => {
                    setIsSuccess(false);
                    router.push('/interviews/interviews');
                }, 1000);
            } else {
                const responseBody = await res.json();
                setIsError(true);
                setError(responseBody.error);
                setTimeout(() => {
                    setIsError(false);
                }, 3000);
            }
        }
    };

    const cancelDelete = () => {
        setSelectedInterviewId(null);
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="container mt-5" >
            <div className="d-flex justify-content-between align-items-center">
                <Link href="/interviews/interviews" passHref>
                    <button className="btn btn-outline-primary">
                        <AiOutlineArrowLeft className="mr-2" />
                        Back to Interviews
                    </button>
                </Link>
            </div>

            <h1 className="text-center mt-4">Interview Information</h1>

            {isSuccess && (
                <Alert key={'success'} variant={'success'}>
                    <h6 className="text-center">Success</h6>
                </Alert>
            )}

            {isError && (
                <Alert key={'error'} variant={'danger'}>
                    <h6 className="text-center">{error}</h6>
                </Alert>
            )}

            <div className="card mx-auto" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
                <div className="card-body text-center">
                    <h3 className="card-title">{interview.title?.titleName || "Not Available"}</h3>
                    <h4 className="card-title">{new Date(interview.dateTime).toLocaleDateString()} - {new Date(interview.dateTime).toLocaleTimeString()}</h4>
                    <hr />
                    <ul className="list-group">
                        <h5 className="card-title">Candidate Information</h5>
                        <li className="list-group-item">
                            <p className="card-text">{interview.candidate?.firstName || "Not Available"} {interview.candidate?.lastName || "Not Available"}</p>
                            <p className="card-text">Email: {interview.candidate?.email || "Not Available"}</p>
                            <p className="card-text">Cell No: {interview.candidate?.cellphoneNumber || "Not Available"}</p>
                        </li>
                    </ul>

                    <br />
                    <hr />
                    <h5 className="card-title">Employee Information</h5>

                    <ul className="list-group">
                        {interview.users && interview.users.length > 0 ? (
                            interview.users.map((user) => (
                                <div className="card-body text-center">
                                    <li key={user.id} className="list-group-item">
                                        <div className="align-items-center">
                                            <div>
                                                <h5>{user.firstname} {user.lastname}</h5>
                                                <p>{user.title}</p>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            ))
                        ) : (
                            <p>No users available.</p>
                        )}
                    </ul>

                    <div className="mt-3">
                        <Link href={`/interviews/edit/${interview.id}`} className="btn btn-success btn-sm me-2">
                            <AiOutlineEdit size={16} /> Edit
                        </Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(interview.id)}>
                            <AiOutlineDelete size={16} /> Delete
                        </button>
                        <span className="ml-2"></span> { }
                    </div>
                </div>
            </div>
            <br />
            <Modal show={showDeleteConfirmation} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this interview?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
