import { useRouter } from "next/router";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Spinner from "react-bootstrap/Spinner";

export default function Register() {

  const router = useRouter();

  const [userState, setUserState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellNumber: "",
    address: "",
    password: "",
    titleId: "",
    role: "ADMIN"
  });

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [titles, setTitles] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTitles();
  }, []);

  function handleChange(e) {
    const copy = { ...userState };
    copy[e.target.name] = e.target.value;
    setUserState(copy);
  }

  function handleTitleChange(selectedTitle) {
    setUserState({ ...userState, titleId: selectedTitle.value });
  }


  function handleConfirmPasswordChange(e) {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
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

    setIsLoading(false);

  }

  async function handleSubmit() {

    setIsLoading(true);

    setIsSubmitClicked(true);

    if (
      userState.firstName.trim() === "" ||
      userState.lastName.trim() === "" ||
      userState.email.trim() === "" ||
      userState.password.trim() === "" ||
      userState.cellNumber.trim() === "" ||
      userState.titleId < 1 ||
      userState.address.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setIsError(true);
      setIsLoading(false);
      setError("Please enter required fields.");
      return;
    }

    if (userState.password !== confirmPassword) {

      setIsError(true);
      setError("Passwords do not match");

    } else {

      console.log(JSON.stringify(userState))

      const response = await fetch(`http://localhost:8080/api/v1/auth/register`, {
        method: "POST",
        body: JSON.stringify(userState),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {

        setIsError(false);
        setIsSuccess(true);
        setIsSubmitClicked(false);
        setTimeout(() => {
          setIsSuccess(false);
          router.push("/login");
        }, 1500);

      } else {

        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error registering.");
        }

      }

    }

    setIsLoading(false);

  }

  return (
    <div className="p-5 bg-light " style={{ minHeight: '100vh' }}>
      <div className=" p-5 m-auto col-md-4">
        <div className="p-4 bg-light rounded border border-secondary">

          <div className="col text-center">
            <Image
              src="/../public/logo1.png"
              width={300}
              height={100}
              alt="Logo"
              className="img-fluid center-block"
            />
          </div>

          <br />
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" /> Loading...
            </div>
          )}
          <br />

          <div className="col text-center mt-1 text-secondary">
            <h3>Sign Up</h3>
          </div>

          <div className="form-group mt-3">
            <input
              name="email"
              className="form-control mt-1"
              placeholder="Email"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.email.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="firstName"
              className="form-control mt-1"
              placeholder="First Name"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.firstName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="lastName"
              className="form-control mt-1"
              placeholder="Last Name"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.lastName.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="cellNumber"
              className="form-control mt-1"
              placeholder="Cell Number"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.cellNumber.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              name="address"
              className="form-control mt-1"
              placeholder="Address"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.address.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className={`form-group mt-3 ${isSubmitClicked && userState.titleId < 1 ? 'border border-danger rounded' : ''}`}>
            <Select
              value={userState.title}
              options={titles}
              placeholder="Title"
              onChange={handleTitleChange}
            />
          </div>

          <div className="form-group mt-3">
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && userState.password.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control mt-1"
              placeholder="Confirm Password"
              onChange={handleConfirmPasswordChange}
              style={{ borderColor: isSubmitClicked && confirmPassword.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>

          <br />

          <div className="text-center">
            <p>Already a member? <a href="/login">Sign In</a></p>
          </div>

          {isSuccess && (
            <Alert key={'success'} variant={'success'}>
              <h6 className="text-center">Registration successful</h6>
            </Alert>
          )}

          {isError && (
            <Alert key={'error'} variant={'danger'}>
              <h6 className="text-center">{error}</h6>
            </Alert>
          )}

        </div>
      </div>
    </div>
  );
}
