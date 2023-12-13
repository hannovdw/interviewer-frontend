import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Spinner from "react-bootstrap/Spinner";

export default function SignIn() {

  const router = useRouter();

  const [loginState, setLoginState] = useState({
    email: "",
    password: ""
  });

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  function handleChange(e) {
    const copy = { ...loginState };
    copy[e.target.name] = e.target.value;
    setLoginState(copy);
  }

  async function authenticate() {

    setIsLoading(true);

    setIsSubmitClicked(true);

    if (
      loginState.email.trim() === "" ||
      loginState.password.trim() === ""
    ) {
      setIsLoading(false);
      setIsError(true);
      setError("Please enter required fields.");
      return;

    }

    const response = await fetch(`http://localhost:8080/api/v1/auth/authenticate`, {
      method: "POST",
      body: JSON.stringify(loginState),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.userId);
      router.push("/calendar");

    } else {
      setIsError(true);
      if (response.status === 403) {
        setError("Incorrect Username or Password.");
      } else {
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

  return (
    <div className="p-5" style={{ minHeight: '100vh' }}>
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
            <h3>Log In</h3>
          </div>

          <div className="form-group mt-3">
            <input
              name="email"
              className="form-control mt-1"
              placeholder="Email"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && loginState.email.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="form-group mt-3">
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={handleChange}
              style={{ borderColor: isSubmitClicked && loginState.password.trim() === "" ? "red" : "" }}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={authenticate}>
              Log In
            </button>
          </div>

          <br />

          <div className="text-center">
            <p>Not a member? <a href="/register">Register</a></p>
          </div>

          {isError && (
            <div className="alert alert-danger mt-3">
              <h6 className="text-center">{error}</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
