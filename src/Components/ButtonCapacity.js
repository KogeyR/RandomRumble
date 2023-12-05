import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hitMonster,
  hitBack,
  updatePlayerStatus,
  updateMonsterStatus,
  checkDefeat,
  checkVictory,
  nextTurn,
  updateLastAttackingPlayer,
  healPlayer,
  reduceMana,
} from '../features/fight/fightSlice';

const ButtonCapacity = ({ player, ability }) => {
  const dispatch = useDispatch();
  const monster = useSelector((state) => state.fight.monster);
  const currentTurnPlayerId = useSelector((state) => state.fight.currentTurnPlayerId);

  const combat = () => {
    if (player.status === 'alive' && player.id === currentTurnPlayerId) {
      if (player.status === 'dead') {
        console.log("Le joueur est mort.");
        return;
      }

      const attackingPlayerId = player.id;

      if (ability.type === 'heal') {
       
        dispatch(healPlayer({ healAmount: ability.healAmount, playerId: attackingPlayerId }));
      } else {
        
        dispatch(hitMonster({ dmg: ability.damage, attackingPlayerId }));
      }

      dispatch(reduceMana({ manaCost: ability.manaCost, playerId: attackingPlayerId }));

      dispatch(hitBack({ id: player.id }));
      dispatch(updateLastAttackingPlayer({ playerId: attackingPlayerId }));
      const newStatus = player.pv <= 0 ? 'dead' : 'alive';

      if (newStatus === 'dead') {
        dispatch(updatePlayerStatus({ player: player, status: newStatus }));
        dispatch(checkDefeat());
        console.log('joueur mort');
      } else {
        console.log("attaque.");
      }

      const monsterStatus = monster.pv <= 0 ? 'dead' : 'alive';

      if (monsterStatus === 'dead') {
        dispatch(updateMonsterStatus({ monster: monster, status: monsterStatus }));
        dispatch(checkVictory());
      }

      dispatch(nextTurn());
    } else {
      console.log("Le joueur ne peut pas attaquer actuellement.");
    }
  };

  return (
    <div>
      <button type="button" onClick={combat} className="btn btn-success material-tooltip-main">
        {ability.name}
        <i className="fas fa-bomb"></i> {ability.damage}
        <i className="fas fa-fire-alt"></i> - {ability.manaCost}
      </button>
    </div>
  );
};

export default ButtonCapacity;
