import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function ReviewDetail() {
    const [review, setReview] = useState({});
    const [updateReview, setUpdateReview] = useState({ reply: '' });
    const param = useParams();

    const fetchReview = useCallback(async () => {
        try {
            const res = await apiInstance.get(`vendor-reviews/${UserData()?.vendor_id}/${param.review_id}`);
            setReview(res.data);
        } catch (error) {
            console.error('Error fetching review:', error);
        }
    }, [param.review_id]);

    useEffect(() => {
        fetchReview();
    }, [fetchReview]);

    const handleReplyChange = (event) => {
        setUpdateReview({
            ...updateReview,
            [event.target.name]: event.target.value
        });
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('reply', updateReview.reply);

        try {
            await apiInstance.patch(`vendor-reviews/${UserData()?.vendor_id}/${param.review_id}/`, formdata);
            Swal.fire({
                title: 'Success',
                text: 'Reply submitted successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            fetchReview();
        } catch (error) {
            console.error('Error submitting reply:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error submitting your reply. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <h4 className='mb-4'><i className="fas fa-star" /> Reviews and Rating</h4>
                    <section className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded" style={{ backgroundImage: "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)" }}>
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-md-10">
                                <div className="card mt-3 mb-3">
                                    <div className="card-body m-3">
                                        <div className="row">
                                            <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                                                <img src={review?.profile?.image} className="rounded-circle img-fluid shadow-1" alt="woman avatar" style={{ width: 200, height: 200, objectFit: "cover" }} />
                                            </div>
                                            <div className="col-lg-8">
                                                <p className="text-dark mb-2">
                                                    <b>Review: </b>
                                                    {review?.review}
                                                </p>
                                                <p className="text-dark mb-2 d-flex">
                                                    <b>Reply: {""} </b>
                                                    {review.reply === null
                                                        ? <span className='ms-2'> No Reply Yet</span>
                                                        : <span className='ms-2'> {review.reply}</span>
                                                    }
                                                </p>
                                                <p className="text-dark mb-2">
                                                    <strong>Name</strong>: {review?.profile?.full_name}
                                                </p>
                                                <p className="mb-2">
                                                    <b>Product</b>: {review?.product?.title}
                                                </p>
                                                <p className="mb-0">
                                                    Rating:
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <i key={i} className="fas fa-star me-2 ms-2"></i>
                                                    ))}
                                                </p>
                                                <div className="mt-3">
                                                    <form onSubmit={handleReplySubmit} className='d-flex'>
                                                        <input value={updateReview.reply} name='reply' onChange={handleReplyChange} type='text' placeholder="Write your reply..." className='form-control' />
                                                        <button className='btn btn-success ms-2' type='submit'><i className='fas fa-paper-plane'></i></button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ReviewDetail;
