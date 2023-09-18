import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();

  const [state, setState] = useState({
    email: "",
    password: ""
  });

  const [isError, setIsError] = useState(false);

  function handleChange(e) {
    const copy = { ...state };
    copy[e.target.name] = e.target.value;
    setState(copy);
  }

  async function authenticate() {
    const res = await fetch(`http://localhost:8080/api/v1/auth/authenticate`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.access_token);
      setIsError(false); // Clear any previous errors
      // Redirect directly to the overview page on successful login
      router.push("/overview");
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
          <br />
          <div className="form-group">
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={state.password}
              onChange={handleChange}
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

          {/* Error Alert */}
          {isError && (
            <div className="alert alert-danger mt-3">
              <h6 className="text-center">Bad credentials</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
