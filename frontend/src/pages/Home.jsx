import Navbar from '@/shared/Navbar'
import React from 'react'
import CreatePost from './CreatePost'
import PostCard from './PostCard'

const Home = () => {
  return (
    <div>
      <Navbar />
      <CreatePost/>
      <PostCard />
    </div>
  )
}

export default Home
