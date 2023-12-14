import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hitMonster, hitBack,
  updatePlayerStatus, updateMonsterStatus,
  checkDefeat, checkVictory,
  nextTurn, updateLastAttackingPlayer,
  HealAbility,KiChargeAbility, UltimateAbility,
  playerPlayed,MonsterSpecials,resetPlayersWhoPlayed,
  getSecondAbility,setActionMessage,clearActionMessage
} from '../features/fight/fightSlice';

const ButtonCapacity = ({ player, ability }) => {
  const dispatch = useDispatch();
  const monster = useSelector((state) => state.fight.monster);
  const whoPlayed = useSelector((state) => state.fight.playersWhoPlayed)
  const currentTurnPlayerId = useSelector((state) => state.fight.currentTurnPlayerId);

  const combat = () => {
    if (player.status !== 'alive' || player.id !== currentTurnPlayerId) {
      console.log("Le joueur ne peut pas attaquer actuellement.");
      return;
    }

    if (player.status === 'dead') {
      console.log("Le joueur est mort.");
      return;
    }

    const attackingPlayerId = player.id;

    switch (ability.type) {
      case 'heal':
        dispatch(HealAbility({ healAmount: ability.healAmount, playerId: attackingPlayerId }));
        
        break;
    
      case 'manaDrain':
        dispatch(KiChargeAbility({ playerId: attackingPlayerId }));
        break;

        case 'strike':
          dispatch(getSecondAbility({ playerId: attackingPlayerId }));
          break;
    
      case 'ultimate':
        dispatch(UltimateAbility({ playerId: attackingPlayerId }));
        break;
    
    
      default:
        dispatch(hitMonster({ dmg: ability.damage, attackingPlayerId }));
        break;
    }
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

    dispatch(playerPlayed({ playerId: attackingPlayerId }));
    dispatch(nextTurn());
    console.log('Tour suivant');

    if (whoPlayed.length === 4) {
      
      dispatch(MonsterSpecials());
      dispatch(resetPlayersWhoPlayed());
    }


  };

  return (
    <div className="row">
    <div className="col-12">
      <div className="btn-container">
        <button type="button" onClick={combat} className="btn btn-warning material-tooltip-main">
          <span className="ability-name">{ability.name}</span>
          <i className="fa-solid fa-hand-fist"></i> <br></br>dmg: {ability.damage}
          <i className="fas fa-fire-alt"></i> manaCost: {ability.manaCost}
        </button>
      </div>
    </div>
  </div>
     
  );
};

export default ButtonCapacity;
