import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DisplayPosts() {
    const [posts, setPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const result = await axios.get("http://localhost:8081/post/getposts");
            setPosts(result.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const updateNavigate = (id) => {
        window.location.href = `updatepost/${id}`;
    }

    //delete function
    const deletePost = async (id) => {
        //display confirmation message
        const confirmationMessage = window.confirm("Are you sure you want to delete this post?");
        if(confirmationMessage) {
            try {
                //send delete request to backend
                await axios.delete(`http://localhost:8081/post/delete/${id}`);
                loadPosts(); // Reload posts after deletion
                //display success message
                alert("Post deleted successfully");
            } catch (error) {
                console.error("Error deleting post", error);
            }
        };
    }

    //search function
    const searchPost = async (e) => {
        const searchTerm = e.target.value;
        try {
            const result = await axios.get(`http://localhost:8081/post/search/${searchTerm}`);
            setPosts(result.data);
        } catch (error) {
            console.error("Error searching posts", error);
        }
    };


    return (
        <div>
            <h1>Display Posts</h1>
            <table border="1" cellPadding="10">
                <thead>
                <tr>
                    <th>Post ID</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post, index) => (
                    <tr key={index}>
                        <td>{post.postId}</td>
                        <td>
                            {post.postImage && (
                                <img
                                    src={`http://localhost:8081/uploads/${post.postImage}`}
                                    alt="Post"
                                    width="50"
                                    height="50"
                                />
                            )}
                        </td>
                        <td>{post.postCategory}</td>
                        <td>{post.description}</td>
                        <td>{post.status}</td>
                        <td>{post.duration}</td>
                        <td>
                            <button onClick={() => updateNavigate(post.postId)}>Update</button>
                            <button onClick={() => deletePost(post.postId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DisplayPosts;
