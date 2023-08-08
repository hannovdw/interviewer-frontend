export default function Home(props) {
  return (
    <div>
      <h2>Welcome to Interviewer homepage</h2>
      <p>NEXT.JS    https://www.youtube.com/watch?v=qwhMyVVnmKM</p>
      <p>Bootstrap   https://blog.logrocket.com/handling-bootstrap-integration-next-js/</p>
      <p>The weather: {props.forecast}</p>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch("https://api.weather.gov/gridpoints/MFL/109,49/forecast")
  const data = await response.json()

  return {
    props: {
      forecast: data.properties.periods[0].detailedForecast
    }
  }
}