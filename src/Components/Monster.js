import React, { useEffect, useState, useRef } from 'react';
import ProgressBar from './ProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import Broly from '../assets/sprite/stance/Broly.gif';
import Scream from '../assets/sprite/BossAttack/BrolyScream.mp4';
import { GiganticRoar } from '../features/fight/fightSlice';

const Monster = () => {
  const dispatch = useDispatch();
  const monster = useSelector((state) => state.fight.monster);
  const [showVideo, setShowVideo] = useState(false);
  const health = useRef(0);
  const [blinkClass, setBlinkClass] = useState('');

  useEffect(() => {
    if (monster.pv <= monster.pvMax / 2 && !showVideo) {
      setShowVideo(true);
      dispatch(GiganticRoar());
    }

    if (health.current > monster.pv) {
      setBlinkClass('blink');
      const timeoutId = setTimeout(() => {
        setBlinkClass('');
      }, 500);
    }

    health.current = monster.pv;
  }, [monster, showVideo, dispatch]);

  const handleVideoEnd = () => {
    const videoElement = document.querySelector('.hidden-video');
    if (videoElement) {
      videoElement.classList.add('hidden');
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="card-monstre col-sm-12" style={{ padding: '20px' }}>
            <div id="monsterCard">
              <div className="text-center">
                <div className="row align-items-center">
                  <div className="col-sm-6 offset-sm-3">
                    <span className="badge badge-danger ml-2 " id="degatSpanMonster"></span>
                    <img className={`img-fluid ${blinkClass}`} src={Broly} alt="monster" />
                  </div>
                </div>
              </div>
              <ProgressBar pv={monster.pv} pvMax={monster.pvMax} bgType="bg-danger" faType="fa-heart" barName=" : pv" />
              <video
                className={`hidden-video ${showVideo ? 'visible' : 'hidden'}`}
                onEnded={handleVideoEnd}
                src={Scream}
                autoPlay
                type="video/mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Monster;
