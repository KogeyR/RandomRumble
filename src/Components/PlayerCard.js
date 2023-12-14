import React, { useState, useEffect, useRef } from 'react';
import ButtonCapacity from './ButtonCapacity';
import ProgressBar from './ProgressBar';
import { useDispatch, useSelector } from 'react-redux';

const PlayerCard = (props) => {
  const { player } = props;
  const dispatch = useDispatch();
  const hasPlayed = useSelector((state) => state.fight.playersWhoPlayed.includes(player.id));
  const AfterPv = useSelector((state) => state.fight.players);
  const health = useRef(player.pvMax)
  let isTakingDamage = false;
  const [shakeClass, setShakeClass] = useState('');

  useEffect(() => {
    let currentPlayer = AfterPv.find(el => el.id === player.id);
    if (health.current > currentPlayer.pv) {
      isTakingDamage = true;
      setShakeClass('shake');
  
      const timeoutId = setTimeout(() => {
        setShakeClass('');
      }, 500);
    }
  
   
    health.current = currentPlayer.pv;
  }, [AfterPv]);
  

  const cardClasses = `col-sm-3 card center ${hasPlayed ? 'played-card' : ''} ${isTakingDamage ? 'damage-animation' : ''}`;
  const bodyClasses = `card-body text-center ${shakeClass}`;

  return (
    <div key={player.id} className={cardClasses} id={`joueur${player.id}`}>
      <div className={bodyClasses}>
        <h5 className="card-title">
          {player.sprite && <img src={player.sprite} alt="Player Image" className="player-image" />}
          {player.name}
        </h5>

        <ProgressBar pv={player.pv} pvMax={player.pvMax} faType="fa-heart" barName=" : pv " bgType="bg-danger" />
        <ProgressBar pv={player.mana} pvMax={player.manaMax} faType="fa-fire-alt" barName=" : Ki " bgType="bg-info" />
        <span className="badge badge-danger ml-2 " id="degatSpanJ1"></span>


        <div className="row">
          <div className="col-6">
            <div className="ButtonCapacity1">
              {player.abilities.slice(0, 2).map((ability, index) => (
                <ButtonCapacity key={index} player={player} ability={ability} />
              ))}
            </div>
          </div>
          <div className="col-6"> 
            <div className="ButtonCapacity2">
              {player.abilities.slice(2).map((ability, index) => (
                <ButtonCapacity key={index + 2} player={player} ability={ability} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
