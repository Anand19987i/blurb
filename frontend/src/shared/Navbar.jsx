import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Home } from 'lucide-react'
import React, { useState } from 'react'

const Navbar = () => {
  const [user, setUser] = useState("");
  

  return (
    <div className='flex flex-row bg-slate-950 h-16 items-center justify-between'>
        <div className='text-white text-2xl font-bold mx-auto'>
          <h1>Blurb</h1>
        </div>
        <div className="cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png"/>
          </Avatar>
        </div>
    </div>
  )
}

export default Navbar
