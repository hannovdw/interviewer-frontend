import { useRouter } from "next/router"
import { useState } from "react"

export default function AddCandidate() {
  const router = useRouter()

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphoneNumber: "",
  })

  function handleChange(e) {
    const copy = { ...state }
    copy[e.target.name] = e.target.value
    setState(copy)
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:8080/api/v1/candidate`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    if (res.ok) {
    //   Do something when successfully added candidate
    }
  }

  return (

    <div>

      <br />
      <br />

      <div className="col-md-3 m-auto Auth-form-container border">

        <div className="Auth-form-content p-5 bg-light">

          <div className="form-group mt-3">
            <h2 className="text-center">Add Candidate</h2>
            <br/>
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
              name="firstName"
              className="form-control mt-1"
              placeholder="Enter First Name"
              value={state.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              name="lastName"
              className="form-control mt-1"
              placeholder="Enter Last Name"
              value={state.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mt-3">
            <label>Cellphone Number</label>
            <input
              name="cellphoneNumber"
              className="form-control mt-1"
              placeholder="Enter Cellphone Number"
              value={state.cellphoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <br/>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>
          
        </div>

      </div>

    </div>

  )
}