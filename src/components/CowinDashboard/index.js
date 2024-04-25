import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiStatusConstant = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        last7daysVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        })),

        vaccinationByAge: data.vaccination_by_age.map(vaccine => ({
          age: vaccine.age,
          count: vaccine.count,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(vaccine => ({
          count: vaccine.count,
          gender: vaccine.gender,
        })),
      }
      this.setState({
        apiStatus: apiStatusConstant.success,
        vaccinationData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-conatiner">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  vaccinationCharts = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageData={vaccinationData.last7daysVaccination}
        />
        <VaccinationByAge
          vaccinationByAgeData={vaccinationData.vaccinationByAge}
        />
        <VaccinationByGender
          vaccinationByGenderData={vaccinationData.vaccinationByGender}
        />
      </>
    )
  }

  renderingApiStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.vaccinationCharts()
      case apiStatusConstant.inprogress:
        return this.loadingView()
      case apiStatusConstant.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="dashboard-bg">
        <div className="top-container">
          <div className="website-bg">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="website-logo"
              alt="website logo"
            />
            <p className="website-name">Co-WIN</p>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
        </div>
        <div className="recharts-container">
          {this.renderingApiStatusView()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
