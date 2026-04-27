import React from 'react'
import {Outlet} from 'react-router-dom'
import TeacherDashboard from './TeacherDashboard'

function TeacherLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TeacherDashboard />
      <main className="relative lg:ml-52">
        <Outlet />
      </main>
    </div>
  )
}

export default TeacherLayout
