import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Select from 'react-select';
import Link from "next/link";

export default function User() {

    const router = useRouter();

    const { id } = router.query;

    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTitlesLoading, setisTitlesLoading] = useState(true);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [titles, setTitles] = useState([]);
    const [userState, setUserState] = useState({});

    useEffect(() => {
        if (id) {
            fetchUser();
            fetchTitles();
        }
    }, [id]);

    function handleChange(e) {
        const copy = { ...userState };
        copy[e.target.name] = e.target.value;
        setUserState(copy);
    }

    function handleTitleChange(selectedTitle) {
        const newTitle = { id: selectedTitle.value }
        setUserState({ ...userState, title: newTitle });

    }

    async function fetchUser() {

        setIsLoading(true);

        const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUserState(data);
        } else {
            if (response.status === 403) {
                router.push('/login');
            } else {
                setIsError(true);
                try {
                    const responseBody = await response.json();
                    setError(responseBody.error);
                } catch (error) {
                    setError("Error fetching user.");
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
            userState.firstName.trim() === "" ||
            userState.lastName.trim() === "" ||
            userState.email.trim() === "" ||
            userState.cellphoneNumber.trim() === "" ||
            userState.titleId === "" ||
            userState.address.trim() === ""
        ) {
            setIsError(true);
            setIsLoading(false);
            setError("Please enter required fields.");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(userState),
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
                router.push('/profile');
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
                    setError("Error updating users.");
                }
            }
        }

        setIsLoading(false);

    }

    return (
        <div className="p-4" style={{ minHeight: '100vh' }}>

            <div>
                <Link href="/users/users">
                    <button className="btn btn-outline-secondary">
                        <AiOutlineArrowLeft />
                        Back
                    </button>
                </Link>
            </div>

            <div className=" p-5 m-auto col-md-4 ">

                <div className="p-4 bg-light rounded border border-secondary">

                    <div className="col text-center mt-1 text-secondary">
                        <h3>Edit Profile</h3>
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
                            value={userState.firstName}
                            onChange={handleChange}
                            style={{ borderColor: isSubmitClicked && userState.firstName.trim() === "" ? "red" : "" }}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <input
                            name="lastName"
                            className="form-control mt-1"
                            value={userState.lastName}
                            onChange={handleChange}
                            style={{ borderColor: isSubmitClicked && userState.lastName.trim() === "" ? "red" : "" }}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <input
                            name="email"
                            className="form-control mt-1"
                            value={userState.email}
                            onChange={handleChange}
                            style={{ borderColor: isSubmitClicked && userState.email.trim() === "" ? "red" : "" }}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <input
                            name="cellphoneNumber"
                            className="form-control mt-1"
                            value={userState.cellphoneNumber}
                            onChange={handleChange}
                            style={{ borderColor: isSubmitClicked && userState.cellphoneNumber.trim() === "" ? "red" : "" }}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <input
                            name="address"
                            className="form-control mt-1"
                            value={userState.address}
                            onChange={handleChange}
                            style={{ borderColor: isSubmitClicked && userState.address.trim() === "" ? "red" : "" }}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <Select
                            value={userState.title ? titles.find(title => title.value === userState.title.id) : null}
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
                            onClick={() => router.push('/users/users')}
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
