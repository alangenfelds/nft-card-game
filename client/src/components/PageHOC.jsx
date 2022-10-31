import React from 'react'
import { useNavigate } from 'react-router-dom'

import { logo, heroImg } from '../assets'
import styles from '../styles'
import styled from '../styles'

const PageHOC = (Component, title, description) => () => {
  const navigate = useNavigate();


  return (
    <div className={`text-white ${styles.hocContainer}`}>
      <div className={styles.hocContentBox}>
        <img src={logo} alt="logo" className={styles.hocLogo} onClick={() => navigate('/')} />

        <div className={styles.hocBodyWrapper}>
          <div className='flex w-full'>
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          </div>

          <p className={`${styles.normalText} my-10`}>{description}</p>

          <Component />
        </div>
        <p className="text-xl p-3">Made with 💜 by JSM</p>
      </div>

      <div className='flex flex-1'>
        <img src={heroImg} alt="hero-image" className='w-full xl:h-full object-cover' />
      </div>
    </div>
  )
}

export default PageHOC