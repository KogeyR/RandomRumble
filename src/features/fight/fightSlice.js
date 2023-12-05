import { createSlice } from '@reduxjs/toolkit'
const initialState = {
// TODO : Compléter 'players' et 'monster'
players: [
    {
      name: 'John',
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 1,
    },
    { name: "Jack"
    , pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 2 },
    { name: "Jessy",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 3 },
    { name: "Jenny",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
       id: 4 }
  ],
monster: {
    name: 'Monster',
    pv:'10',
     pvMax:'800',
     status: 'alive'
},
playersWhoPlayed:[

],
DeadPlayers: [
],

}

export const fightSlice = createSlice({
name: 'fight',
initialState,
reducers: {
    hitMonster: (state, action) => {
       const hit = action.payload.dmg;
    
         state.monster.pv -= hit;
         
         if (state.monster.pv < 0) {
           state.monster.pv = 0;
          }
        
        console.log(state);
     },
    hitBack: (state, action) => {
      const hitBackPlayerId = action.payload.id;

      const hitBackPlayer = state.players.find(player => player.id === hitBackPlayerId);

      if (hitBackPlayer) {
        hitBackPlayer.pv -= 5;

        if (hitBackPlayer.pv < 0) {
          hitBackPlayer.pv = 0;
        }


      }
    },
    updatePlayerStatus: (state, action) => {
      const player = action.payload.player;
      const status = action.payload.status;
    
      const updatedPlayers = state.players.map((p) =>
        p.id === player.id ? { ...p, status: status } : p
      );
    
      state.players = updatedPlayers;
    },

     updateMonsterStatus: (state, action) => {
      const monster = action.payload.monster;
      const status = action.payload.status;

      const updatedMonster = { ...monster, status: status };
      state.monster = updatedMonster;
    },

    checkDefeat: (state) => {
      const allPlayersDead = state.players.every(player => player.status === 'dead');

      if (allPlayersDead) {
        console.log("Tous les joueurs sont morts. Défaite !");
        state.defeatMessage = "Vous avez perdu !";
        
      }
    },
    checkVictory: (state) => {

      const monsterDead = state.monster.status === 'dead';

      if (monsterDead) {
        state.victoryMessage = "Vous avez gagné !";
        console.log('vous avez gagné !');
      }
    },
  },
   
  });
  
 
export default fightSlice.reducer
export const { hitMonster, hitBack, updatePlayerStatus, checkDefeat, checkVictory, updateMonsterStatus } = fightSlice.actions

