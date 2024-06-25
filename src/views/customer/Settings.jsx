import { useState,  useEffect } from "react";
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'


function Setting() {

  const [profile, setProfile] = useState({
    full_name: '',
    user: {
      email: '',
      phone: ''
    },
    address: '',
    city: '',
    state: '',
    country: ''
  });

  useEffect(() => {
    fetchProfileData()
  },[])

  const fetchProfileData = () =>{
    apiInstance.get(`user/profile/${UserData()?.user_id}/`).then((res) =>{
      setProfile(res.data)
    })
  }

  

  const handleInputChange = (event) =>{
    setProfile({
      ...profile,
      [event.target.name]: event.target.value

    })
   
  }

  const handleImageChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name] : event.target.files[0]
    })
    
  }

  const handleFormSubmit = async(e) =>{
    e.preventDefault()

    const formdata = new FormData()
    
    
    const res = await apiInstance.get(`user/profile/${UserData()?.user_id}/`)
    if (profile.image && profile.image !== res.data.image){
      formdata.append('image', profile.image)
    }
    formdata.append("full_name", profile.full_name)
    formdata.append("country", profile.country)
    formdata.append("state", profile.state)
    formdata.append("city", profile.city)
    formdata.append("address", profile.address)

    try {
      await apiInstance.patch(`user/profile/${UserData()?.user_id}/`, formdata, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      window.location.reload()
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* <Sidebar /> */}
            <Sidebar/>
            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container px-4">
                    <section className="">
                      <h3 className="mb-3">
                        {" "}
                        <i className="fas fa-gear fa-spin" /> Settings{" "}
                      </h3>
                      <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
                        <div className="row">
                          <div className="col-lg-12 mb-3">
                            <label htmlFor="profileImage" className="form-label">
                              Profile Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              aria-describedby="emailHelp"
                              onChange={handleImageChange}
                              name="image"
                              id="profileImage"
                              autocomplete="off"
                            />
                          </div>
                          <div className="col-lg-12">
                            <label htmlFor="fullName" className="form-label">
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.full_name}
                              onChange={handleInputChange}
                              name="full_name"
                              id="fullName"
                              autocomplete="name"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="emailAddress" className="form-label">
                              Email address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.user?.email}
                              readOnly
                              id="emailAddress"
                              autocomplete="email"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="mobile" className="form-label">
                              Mobile
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.user?.phone}
                              readOnly
                              id="mobile"
                              autocomplete="tel"
                            />
                          </div>
                          <div className="col-lg-6">
                            <label htmlFor="address" className="form-label">
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.address}
                              onChange={handleInputChange}
                              name="address"
                              id="address"
                              autocomplete="street-address"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.city}
                              onChange={handleInputChange}
                              name="city"
                              id="city"
                              autocomplete="address-level2"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="state" className="form-label">
                              State
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.state}
                              onChange={handleInputChange}
                              name="state"
                              id="state"
                              autocomplete="address-level1"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="country" className="form-label">
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.country}
                              onChange={handleInputChange}
                              name="country"
                              id="country"
                              autocomplete="country"
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-5">
                          Save Changes
                        </button>
                      </form>
                    </section>
                  </div>
                </main>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Setting
