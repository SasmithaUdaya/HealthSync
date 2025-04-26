import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const AddPost = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        postId: '',
        postCategory: '',
        description: '',
        status: '',
        duration: '',
        postImage: ''

    });
    const { postId, postCategory, description, status, duration, postImage } = post;

    const onInputChange = (e) => {
        if(e.target.name === "postImage") {
            setPost({ ...post, postImage: e.target.files[0] });
        }
        else{
            setPost({ ...post, [e.target.name]: e.target.value });
        }
    }

    const onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", post.postImage); // sending image

        let imageName = "";

        try {
            const res = await axios.post("http://localhost:8081/post/postimage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            imageName = res.data;
        } catch (error) {
            alert("Error uploading image");
            return;
        }

        const updatePost = {
            ...post,
            postImage: imageName};

        try {
            await axios.post("http://localhost:8081/post/create", updatePost);
            alert("Post added Successfully!");
            window.location.reload();
        } catch (err) {
            alert("Error adding post");
        }
    };

    return (
        <div>

                <h1>Add a New Post</h1>
                <form id="addPostForm" method="post" encType="multipart/form-data" onSubmit={(e)=>onsubmit(e)}>
                    <div>
                        <label htmlFor="postCategory">Category:</label>
                        <input type="text" id="postCategory" name="postCategory" onChange={(e)=> onInputChange(e)} value={postCategory} required/>
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea id="description" name="description" onChange={(e)=> onInputChange(e)} value={description} required></textarea>
                    </div>
                    <div>
                        <label htmlFor="status">Status:</label>
                        <input type="text" id="status" name="status" onChange={(e)=> onInputChange(e)} value={status} required/>
                    </div>
                    <div>
                        <label htmlFor="duration">Duration:</label>
                        <input type="text" id="duration" name="duration" onChange={(e)=> onInputChange(e)} value={duration} required/>
                    </div>
                    <div>
                        <label htmlFor="postImage">Image:</label>
                        <input type="file" id="postImage" name="postImage" accept="image/*" onChange={(e) => onInputChange(e)}  required/>
                    </div>
                    <button type="submit">Submit</button>
                </form>
        </div>
    );
};

export default AddPost;