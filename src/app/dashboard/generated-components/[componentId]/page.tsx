import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'

const ComponentIdPage = async() => {
  const user = await getCurrent();
  if(!user){
    redirect('/sign-in')
  }
  return (
    <div>ComponentIdPage</div>
  )
}

export default ComponentIdPage