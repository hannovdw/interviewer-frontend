import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Alert from 'react-bootstrap/Alert';

export default function Register() {
  const router = useRouter();

  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    titleId: "53",
    role: "ADMIN"
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:8080/api/v1/auth/register`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      setIsError(false); // Clear any previous errors
      setIsSuccess(true); // Display a success message
      setTimeout(() => {
        setIsSuccess(false); // Hide the success message after 2 seconds
        router.push("/login");
      }, 2000);
    } else {
      setIsError(true); // Set an error flag
    }
  }

  return (
    <div>
      <br />
      <br />
      <div className="col-md-3 m-auto Auth-form-container border">
        <div className="Auth-form-content p-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <Image
                  src="/../public/logolong.png"
                  width={300}
                  height={100}
                  alt="Logo"
                  className="img-fluid center-block"
                />
              </div>
            </div>
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              name="firstname"
              className="form-control mt-1"
              placeholder="Enter First Name"
              value={state.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              name="lastname"
              className="form-control mt-1"
              placeholder="Enter Last Name"
              value={state.lastname}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Enter Password"
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>
          <div className="text-center">
            <p>Already a member? <a href="/login">Sign In</a></p>
          </div>
          {/* Success Alert */}
          {isSuccess && (
            <Alert key={'success'} variant={'success'}>
              <h6 className="text-center">Registration successful</h6>
            </Alert>
          )}
          {/* Error Alert */}
          {isError && (
            <Alert key={'error'} variant={'danger'}>
              <h6 className="text-center">Registration failed</h6>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
