




    





"use client"

import { useRouter } from 'next/navigation'
import React, { Suspense } from 'react'
import AsyncAuthComponent from './AsyncAuthComponent'
import { useSession } from 'next-auth/react'

const PageWrapper = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncAuthComponent router={router} session={session} status={status} />
    </Suspense>
  )
}

export default PageWrapper
