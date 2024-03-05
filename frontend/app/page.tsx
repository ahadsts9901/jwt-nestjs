"use client"

import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {

  const currentUser = useSelector((state: any) => state.user)
  const dispatch = useDispatch()

  // console.log(currentUser);

  return (
    <div>Page</div>
  )
}

export default Page