import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdatePost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formdata, setFormData] = useState({
        postId: '',
        postCategory: '',
        description: '',
        status: '',
        duration: '',
        postImage: null,
    });
    const [oldImage, setOldImage] = useState('');

    useEffect(() => {
        // Fetch existing post details
        axios.get(`http://localhost:8081/post/getpost/${id}`)
            .then(response => {
                setFormData({
                    postId: response.data.postId,
                    postCategory: response.data.postCategory,
                    description: response.data.description,
                    status: response.data.status,
                    duration: response.data.duration,
                });
                setOldImage(response.data.postImage); // save old image separately
            })
            .catch(error => {
                console.error("Error fetching post details", error);
            });
    }, [id]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            postImage: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("postDetails", JSON.stringify({
            postId: formdata.postId,
            postCategory: formdata.postCategory,
            description: formdata.description,
            status: formdata.status,
            duration: formdata.duration,
        }));

        if (formdata.postImage) {
            data.append("file", formdata.postImage);
        }

        try {
            await axios.put(`http://localhost:8081/post/posts/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Post Updated Successfully");
            navigate("/allposts");
        } catch (error) {
            console.error("Error updating post", error);
            alert("Error updating post");
        }
    };

    return (
        <div>
            <h1>Update Post</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Post Category:</label>
                    <input
                        type="text"
                        name="postCategory"
                        value={formdata.postCategory}
                        onChange={onInputChange}
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formdata.description}
                        onChange={onInputChange}
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={formdata.status}
                        onChange={onInputChange}
                    />
                </div>

                <div>
                    <label>Duration:</label>
                    <input
                        type="text"
                        name="duration"
                        value={formdata.duration}
                        onChange={onInputChange}
                    />
                </div>

                <div>
                    <label>Old Image:</label><br />
                    {oldImage && (
                        <img
                            src={`http://localhost:8081/post/uploads/${oldImage}`}
                            alt="Post"
                            width="100"
                            height="100"
                        />
                    )}
                </div>

                <div>
                    <label>Upload New Image (optional):</label>
                    <input
                        type="file"
                        onChange={onFileChange}
                    />
                </div>

                <button type="submit">Update Post</button>
            </form>
        </div>
    );
}

export default UpdatePost;
