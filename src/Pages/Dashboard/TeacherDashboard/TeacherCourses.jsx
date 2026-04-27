import React, { useState } from 'react'
import Popup from './Popup';

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState('');

  const crreateCourse = (sub)=>{
    setShowPopup(true);
    setSubject(sub);
  }

  return (
    <>
      <div className='min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-[#0b3142] via-[#11495a] to-[#7fa8a8] px-4 py-8 md:px-8 md:py-10'>
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] bg-gradient-to-r from-[#0b6a6c] via-[#0a505f] to-[#082c3f] px-6 py-8 shadow-2xl md:px-8">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Teacher Courses</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Choose a subject to create a course</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Pick one of the available subjects below to open the course creation form.
            </p>
          </div>

          <div className='mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
          <div className="group cursor-pointer rounded-3xl bg-white/10 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
            onClick={()=>crreateCourse("Physics")}
          >
            <img className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-md" src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
            <p className="mt-4 text-lg font-semibold">Physics</p>
          </div>
          <div className="group cursor-pointer rounded-3xl bg-white/10 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
            onClick={()=>crreateCourse("Chemistry")}
          >
            <img className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-md" src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95" alt="Chemistry" />
            <p className="mt-4 text-lg font-semibold">Chemistry</p>
          </div>
          <div className="group cursor-pointer rounded-3xl bg-white/10 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
            onClick={()=>crreateCourse("Biology")}
          >
            <img className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-md" src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555" alt="Biology" />
            <p className="mt-4 text-lg font-semibold">Biology</p>
          </div>
          <div className="group cursor-pointer rounded-3xl bg-white/10 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
            onClick={()=>crreateCourse("Math")}
          >
            <img className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-md" src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
            <p className="mt-4 text-lg font-semibold">Math</p>
          </div>
          <div className="group cursor-pointer rounded-3xl bg-white/10 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
            onClick={()=>crreateCourse("Computer")}
          >
            <img className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-md" src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
            <p className="mt-4 text-lg font-semibold">Computer</p>
          </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup onClose={()=> setShowPopup(false)} subject={subject}/>
      )}
  </>

)}

export default TeacherCourses
