import React from "react"
import NavBar from "../../components/NavBar"

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <div className="h-screen"></div>
      <div className="h-screen bg-red-300"></div>
      <div className="h-screen bg-red-50"></div>
    </div>
  )
}

export default LandingPage
