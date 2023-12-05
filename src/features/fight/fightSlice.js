import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [
    {
      name: 'John',
      pv: 10,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 1,
    },
    {
      name: "Jack",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 2
    },
    {
      name: "Jessy",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 3
    },
    {
      name: "Jenny",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 30,
      manaMax: 30,
      id: 4
    }
  ],
  monster: {
    name: 'Monster',
    pv: '800',
    pvMax: '800',
    status: 'alive'
  },
  playersWhoPlayed: [],
  DeadPlayers: [],
  lastAttackingPlayer: null,
  currentTurnPlayerId: 1,
};

export const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      const hit = action.payload.dmg;

      if (action.payload.attackingPlayerId === state.currentTurnPlayerId) {
        state.monster.pv -= hit;

        if (state.monster.pv < 0) {
          state.monster.pv = 0;
        }

        state.lastAttackingPlayer = state.players.find(player => player.id === action.payload.attackingPlayerId);
      }
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
        console.log('Vous avez gagné !');
      }
    },
    updateLastAttackingPlayer: (state, action) => {
      const playerId = action.payload.playerId;
      state.lastAttackingPlayer = state.players.find(player => player.id === playerId);
      console.log(action.payload.playerId);
    },
    nextTurn: (state) => {
      const alivePlayers = state.players.filter(player => player.status === 'alive');

  if (alivePlayers.length > 0) {
    const currentIndex = alivePlayers.findIndex(player => player.id === state.currentTurnPlayerId);
    const nextIndex = (currentIndex + 1) % alivePlayers.length;
    state.currentTurnPlayerId = alivePlayers[nextIndex].id;
  }
},
  },
});

export default fightSlice.reducer;
export const {
  hitMonster,
  hitBack,
  updatePlayerStatus,
  checkDefeat,
  checkVictory,
  updateMonsterStatus,
  nextTurn,
  updateLastAttackingPlayer
} = fightSlice.actions;
