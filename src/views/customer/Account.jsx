import {useState, useEffect} from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'

function Account() {
    const [profile, setProfile] = useState({});

    const userData = UserData(); // to return user id

    useEffect(() => {
        if (userData?.user_id) {
            apiInstance.get(`user/profile/${userData.user_id}/`).then((res) => {
                setProfile(res.data);
            }).catch(err => console.error(err));
        }
    }, [userData?.user_id]);
    return (
        
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                        <main className="mb-5" style={{}}>
                            <div className="container px-4">
                            <section className=""></section>
                            <section className="">
                                <div className="row rounded shadow p-3">
                                <h2>Hi {profile.full_name}, </h2>
                                <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                                    From your account dashboard. you can easily check &amp;
                                    view your <a href="">orders</a>, manage your{" "}
                                    <a href="">
                                    shipping
                                    </a>
                                    <a href="">Edit Account</a>
                                </div>
                                </div>
                            </section>
                            </div>
                        </main>
                        </div>
                    </div>
                </section>
            </div>
        </main>

    )
}

export default Account
