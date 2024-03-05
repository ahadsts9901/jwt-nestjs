"use client";

import { useRef, RefObject, useEffect, useState } from "react";
import { SiNestjs } from "react-icons/si";
import axios from "axios"
import { Toast, baseUrl } from "./core";
import Swal from "sweetalert2"
import Post from "./components/Post";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const currentUser = useSelector((state: any) => state.user)

  const [posts, setPosts]: any = useState([])

  const titleRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const textRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getPosts()
  }, [])

  const createPost = async (e: any) => {
    e.preventDefault();

    const title = titleRef?.current?.value
    const text = textRef?.current?.value

    if (!title || !text || title.trim() === "" || text.trim() === "") {
      return
    }

    try {

      const resp = await axios.post(`${baseUrl}/api/posts`, {
        title: title,
        text: text
      }, { withCredentials: true })

      console.log(resp);

      Toast.fire({
        icon: "success",
        title: "Post done"
      })

      getPosts()
      e.target.reset()

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Error in posting"
      })
      console.log(error)
    }


  };

  const getPosts = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/api/posts`, { withCredentials: true })
      setPosts([...resp.data])
    } catch (error) {
      console.log(error);
    }
  }

  const delPost = async (postId: string) => {

    if (!postId) {
      return
    }

    Swal.fire({
      title: 'Delete post ?',
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Delete',
      confirmButtonColor: "#24232c",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const resp = await axios.delete(`${baseUrl}/api/posts/${postId}`, { withCredentials: true })
          console.log(resp);
          Toast.fire({
            icon: "success",
            title: "Post deleted",
          });
          getPosts()
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "You are not authorized to delete this post",
          });
        }
      }
    });

  }

  const editPost = async (e: any, postId: string) => {

    let toEditTitle = e.target.parentNode.parentNode.querySelector(".title").innerText
    let toEditText = e.target.parentNode.parentNode.querySelector(".text").innerText

    Swal.fire({
      title: 'Edit Post',
      html: `
        <input type="text" minLength="${2}" maxLength="${20}" id="editTitle" class="swal2-input" placeholder="Post Title" value="${toEditTitle}" required>
        <textarea id="editText" minLength="${2}" maxLength="${1000}" class="swal2-input text" placeholder="Post Text" required>${toEditText}</textarea>
      `,
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Update',
      confirmButtonColor: "#24232c",
      preConfirm: async () => {

        const editedTitleElement = document.getElementById('editTitle')! as HTMLInputElement;
        const editedTextElement = document.getElementById('editText')! as HTMLInputElement;

        const editedTitle = editedTitleElement.value
        const editedText = editedTextElement.value

        if (!editedTitle.trim() || !editedText.trim()) {
          Swal.showValidationMessage('Title and text are required');
          setTimeout(() => {
            Swal.resetValidationMessage();
          }, 1500)
          return false;
        }

        try {
          const resp = await axios.put(`${baseUrl}/api/posts/${postId}`, {
            title: editedTitle,
            text: editedText
          }, { withCredentials: true })
          console.log(resp);
          Toast.fire({
            icon: "success",
            title: "Post updated",
          });
          getPosts()
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "You are not authorized to edit this post",
          });
        }
      }
    });
  }

  const logout = async () => {

    try {
      const resp = await axios.post(`${baseUrl}/api/auth/logout`, {}, { withCredentials: true })
      router.push("/login")
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Can't logout"
      })
    }

  }

  return (
    <div className="w-full min-h-[100vh] max-h-fit p-4 flex flex-col items-center gap-4 pt-8">
      <div className="w-full flex justify-end items-center gap-8">
        <p className="w-fit font-bold text-md">{
          currentUser.firstName ? `${currentUser.firstName} ` : ""
        }{
            currentUser.lastName ? currentUser.lastName : ""
          }</p>
        <button className="w-fit h-fit text-white bg-blue-500 rounded-md font-bold p-2 px-4"
          onClick={logout}
        >Logout</button>
      </div>
      <h1 className="text-blue-500 text-3xl w-full flex justify-center items-center flex-wrap gap-4 font-extrabold py-4">
        <SiNestjs /><span className="text-zinc-800">Nestjs + </span><span>JWT</span>
      </h1>
      <form className="w-[90%] flex flex-col items-center gap-4 font-bold" onSubmit={createPost}>
        <input minLength={2} maxLength={20} ref={titleRef} type="text" placeholder="Enter title ..." className="w-full p-3 rounded-md border" />
        <textarea minLength={2} maxLength={1000} ref={textRef} placeholder="Enter text ..." className="w-full p-3 rounded-md h-[12em] resize-none border"></textarea>
        <button type="submit" className="bg-blue-500 text-gray-200 p-2 px-6 rounded-md text-lg self-end">Post</button>
      </form>
      <div className="w-full flex justify-center flex-wrap gap-4 p-4">
        {
          posts ?
            posts.map((post: {
              time: string,
              title: string,
              text: string,
              _id: string,
              author: {
                firstName: string,
                lastName: string,
              }
            }, i: number) => (
              <Post key={i} name={`${post?.author?.firstName} ${post?.author?.lastName}`} time={post?.time} id={post?._id} title={post?.title} text={post?.text} edit={editPost} del={delPost} />
            ))
            : null
        }
      </div>
    </div>
  );
}