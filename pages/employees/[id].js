import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';

export default function Employee() {

  const router = useRouter();

  const { id } = router.query;

  const [employee, setEmployee] = useState({});
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  async function fetchEmployee() {

    setLoading(true);

    const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      setEmployee(data);
    } else {
      if (response.status === 403) {
        router.push('/login');
      } else {
        setIsError(true);
        try {
          const responseBody = await response.json();
          setError(responseBody.error);
        } catch (error) {
          setError("Error fetching employee.");
        }
      }
    }

    setLoading(false);

  }

  return (
    <section style={{ backgroundColor: '#eee', minHeight: '100vh' }}>

      <div>
        <Link href="/employees/employees">
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
            <Spinner animation="border" variant="primary" /> Loading User...
          </div>
        )}

        {!isError && employee.title && !loading && (

          <div class="row">
            <div class="col-lg-4">
              <div class="card mb-4">
                <div class="card-body text-center">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                    class="rounded-circle img-fluid" style={{ width: '150px' }}></img>
                  <h4 class="my-3">{employee.firstName} {employee.lastName}</h4>
                  <p class="text-muted mb-1">{employee.title.titleName}</p>
                  <p class="text-muted mb-4">{employee.address}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="card mb-4">
                <div class="card-body">
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">First Name</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.firstName}</p>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">Last Name</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.lastName}</p>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">Email</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">Phone</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.cellphoneNumber}</p>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">Address</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.address}</p>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-sm-3">
                      <p class="mb-0">Title</p>
                    </div>
                    <div class="col-sm-9">
                      <p class="text-muted mb-0">{employee.title.titleName}</p>
                    </div>
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

          </div>
        )}

      </div>
    </section>
  );
}
