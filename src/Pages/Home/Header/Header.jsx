import './Header.css'
import { NavLink } from 'react-router-dom'
import Logo from '../../Images/Logo.jpg'
import LanguageSelector from '../../Components/LanguageSelector'

function Header() {
  return (
    <>
    <header className="flex items-center justify-between bg-[#042439] w-full fixed z-10 px-6 py-4">
      <NavLink to='/'>
      <div className="logo flex items-center gap-3">
        <img src={Logo} alt="logo" className="h-10 w-10" />
        <h1 className='text-2xl text-[#4E84C1] font-bold'>Digipatashala</h1>
      </div>
      </NavLink>
      <div className="link-nav">
        <ul className="flex gap-8">
          <li><NavLink to='/' className={({isActive}) => isActive ? "active" : "deactive" }> Home </NavLink></li>
          <li><NavLink to='/courses' className={({isActive}) => isActive ? "active" : "deactive"}> Courses </NavLink></li>
          <li><NavLink to='/offline-lessons' className={({isActive}) => isActive ? "active" : "deactive"}> Offline </NavLink></li>
          <li><NavLink to='/digital-literacy' className={({isActive}) => isActive ? "active" : "deactive"}> Digital Literacy </NavLink></li>
          <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : "deactive"}> About </NavLink></li>
          <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : "deactive"}> Contact </NavLink></li>
        </ul>
      </div>
      <div className='flex items-center gap-4'>
        <LanguageSelector />
        <NavLink to='/login' className={({isActive}) => isActive ? "deactive" : "deactive"}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Login
          </button>
        </NavLink>
        <NavLink to='/signup' className={({isActive}) => isActive ? "deactive" : "deactive"}>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
            Signup
          </button>
        </NavLink>
      </div>
    </header>
    <div className="gapError"></div>
    </>
  )
}

export default Header
