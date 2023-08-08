import { useEffect, useState } from "react"

export default function Overview() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetchContent()
  }, [])


  async function fetchContent() {
    const res = await fetch(`http://localhost:8080/api/v1/demo-controller`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    if (res.ok) {
      const text = await res.text()
      setContent(text)
    }
  }

  return (
      <div>
        <h1>Welcome</h1>
        <p>{content}</p>
      </div>
  )
}