import Navbar from '@/shared/Navbar'
import React from 'react'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import PostFeed from './PostFeed'

const Home = () => {
  return (
    <div className='bg-gray-950'>
      <Navbar />
      <CreatePost/>
      <PostFeed />
    </div>
  )
}

export default Home
