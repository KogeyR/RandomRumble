import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [
    {
      name: 'John',
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 1,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    
    {
      name: "Jack",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 2,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Jessy",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 3,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
    },
    {
      name: "Jenny",
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 4,
      abilities: [
        { name: 'Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soin', type: 'heal', healAmount: 20, manaCost: 20 },
        { name: 'Mana Drain', type: 'manaDrain', damage: 10, manaGain: 10, manaCost: 0 },
        { name: 'Ultimate', type: 'ultimate', damage: 20, manaCost: 30 },
      ],
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
      const attackingPlayerId = action.payload.attackingPlayerId;

      if (attackingPlayerId === state.currentTurnPlayerId) {
        if (state.players[attackingPlayerId - 1].abilities.find(ability => ability.type === 'manaDrain')) {
          // If the player has Mana Drain ability, drain mana and deal damage
          state.players[attackingPlayerId - 1].mana += state.players[attackingPlayerId - 1].abilities.find(ability => ability.type === 'manaDrain').manaGain;
          state.players[attackingPlayerId - 1].pv -= hit;
        } else {
          // If not Mana Drain ability, only deal damage
          state.players[attackingPlayerId - 1].pv -= hit;
        }

        if (state.players[attackingPlayerId - 1].pv < 0) {
          state.players[attackingPlayerId - 1].pv = 0;
        }

        state.lastAttackingPlayer = state.players.find(player => player.id === attackingPlayerId);
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
healPlayer: (state, action) => {
  const { healAmount, playerId } = action.payload;
  const healedPlayer = state.players.find(player => player.id === playerId);

  if (healedPlayer) {
    healedPlayer.pv += healAmount;

    if (healedPlayer.pv > healedPlayer.pvMax) {
      healedPlayer.pv = healedPlayer.pvMax;
    }
  }
},
reduceMana: (state, action) => {
  const { manaCost, playerId } = action.payload;
  const player = state.players.find((p) => p.id === playerId);

  if (player) {
    player.mana -= manaCost;

    if (player.mana < 0) {
      player.mana = 0;
    }
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
  updateLastAttackingPlayer,
  healPlayer,
  reduceMana,
} = fightSlice.actions;
