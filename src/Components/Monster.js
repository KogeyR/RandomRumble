import React from 'react';
import ProgressBar from './ProgressBar';
import { useSelector } from 'react-redux';
import Broly from '../assets/sprite/stance/Broly.png';

const Monster = () => {
  const monster = useSelector((state) => state.fight.monster);

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="card-monstre col-sm-12">
            <div id="monsterCard">
              <div className="text-center">
                <div className="row align-items-center">
                  <div className="col-sm-2 offset-sm-3">
                    <span className="badge badge-danger ml-2 " id="degatSpanMonster"></span>
                    <img className="img-fluid" src={Broly} alt="monster" />
                  </div>
                  <div className="col-sm-4">
                    <div>{monster.name}</div>
                    <div id="comboOnMonster"></div>
                  </div>
                </div>
              </div>
              <ProgressBar pv={monster.pv} pvMax={monster.pvMax} bgType="bg-danger" faType="fa-heart" barName=" : pv" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Monster;
