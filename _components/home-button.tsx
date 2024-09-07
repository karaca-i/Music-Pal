

export default function HomeButton() {


    return (
      <div className='home-div'>
          <a href='/'>
              <div>
                  <img src='/home-icon.png' className='home-icon'></img>
              </div>
              <span className='home-text'>Home</span>
          </a>
      </div>
    )
  }