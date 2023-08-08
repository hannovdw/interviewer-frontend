import { useRouter } from "next/router"
import { useState } from "react"
import Image from "next/image"

export default function Register() {
  const router = useRouter()

  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "ADMIN"
  })

  function handleChange(e) {
    const copy = { ...state }
    copy[e.target.name] = e.target.value
    setState(copy)
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:8080/api/v1/auth/register`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.ok) {
      router.push("/login")
    }
  }

  return (

    <div>

      <br />
      <br />

      <div className="col-md-3 m-auto Auth-form-container border">

        <div className="Auth-form-content p-5 bg-light">

          <div class="container">
            <div class="row">
              <Image
                src="/../public/logolong.png"
                width={300}
                height={100}
                alt="Logo"
                class="img-fluid center-block"
                className="center"
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={state.username}
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

          <div class="text-center">
            <p>Already a member? <a href="/login">Sign In</a></p>
          </div>
          
        </div>

      </div>

    </div>

  )
}