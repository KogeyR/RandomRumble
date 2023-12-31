import { createSlice } from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';
import Goku from '../../assets/sprite/stance/Goku.gif';
import Gohan from '../../assets/sprite/stance/Gohan.gif';
import Piccolo from '../../assets/sprite/stance/Piccolo.gif';
import Vegeta from '../../assets/sprite/stance/Vegeta.gif';



const initialState = {
  players: [
    {
      name: 'Goku',
      sprite: Goku,
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 1,
      abilities: [
        { name: 'Quick Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Soaring Fist', type: 'strike', damage: 25, manaCost : 20},
        { name: 'Ki Busrt', type: 'manaDrain', manaGain: 30, },
        { name: 'Instant Kamehameha', type: 'ultimate', damage: 40, manaCost: 30 },
      ],
    },
    
    {
      name: "Gohan",
      sprite: Gohan,
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 2,
      abilities: [
        { name: 'Quick Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Dragon Strike', type: 'strike', damage: 20, manaCost: 20 },
        { name: 'Ki Busrt', type: 'manaDrain', manaGain: 30,  },
        { name: 'True Kamehameha', type: 'ultimate', damage: 40, manaCost: 30 },
      ],
    },
    {
      name: "Piccolo",
      sprite: Piccolo,
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 3,
      abilities: [
        { name: 'Quick Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Senzu Bean', type: 'heal', healAmount: 30,  },
        { name: 'Ki Busrt', type: 'manaDrain', manaGain: 30, },
        { name: 'makankosappo', type: 'ultimate', damage: 45, manaCost: 30 },
      ],
    },
    {
      name: "Vegeta",
      sprite: Vegeta,
      pv: 100,
      pvMax: 100,
      status: 'alive',
      mana: 100,
      manaMax: 100,
      id: 4,
      abilities: [
        { name: 'Quick Attaque', type: 'damage', damage: 5, manaCost: 0 },
        { name: 'Genocide Breaker', type: 'strike', damage: 20, manaCost: 20 },
        { name: 'Ki Burst ', type: 'manaDrain', manaGain: 30, },
        { name: 'Final Flash', type: 'ultimate', damage: 40, manaCost: 30 },
      ],
    }
  ],
  monster: {
    name: 'Broly',
    pv: '800',
    pvMax: '800',
    status: 'alive',
    specialAttack: [
      {name: 'Special Attack', type: 'damage', damage: 15},
      {name: 'Gigantic Roar', type: 'damage', damage: 25}  
    ],
  },
  playersWhoPlayed: [],
  DeadPlayers: [],
  lastAttackingPlayer: null,
  currentTurnPlayerId: 1,
  actionMessage: '',
  damageTaken: null,
};

export const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {

    hitMonster: (state, action) => {
      const attackingPlayerId = action.payload.attackingPlayerId;
      const attackingPlayer = state.players.find((player) => player.id === attackingPlayerId);

      if (attackingPlayer && attackingPlayer.mana >= attackingPlayer.abilities[0].manaCost) {
        const hit = attackingPlayer.abilities[0].damage;
        state.monster.pv -= hit;
        attackingPlayer.mana -= attackingPlayer.abilities[0].manaCost;

        if (state.monster.pv < 0) {
          state.monster.pv = 0;
        }
        state.lastAttackingPlayer = attackingPlayer;

        state.damageTaken = hit;
      } else {
        console.log("Pas assez de mana pour attaquer ou joueur non trouvé.");
      }
    },

    HealAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      if (!state.healAbilityUsed && player) {
        state.healAbilityUsed = true;

        state.players.forEach((p) => {
          p.pv += player.abilities[1].healAmount;
          p.pv = Math.min(p.pv, p.pvMax);
        });
      } else {
        console.log("Capacité de soin déjà utilisée ou joueur non trouvé.");
      }
    },

    KiChargeAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);

      if (player) {
        player.mana += player.abilities[2].manaGain;
      } else {
        console.log("Joueur non trouvé.");
      }
    },

    getSecondAbility: (state, action) => {
    
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
    
      if (player && player.mana >= player.abilities[1].manaCost) {
        
        state.monster.pv -= player.abilities[1].damage;
        player.mana -= player.abilities[1].manaCost;
               
        state.monster.pv = Math.max(state.monster.pv, 0);
      }
    },
    
   

    UltimateAbility: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
    
      if (player && player.mana >= player.abilities[3].manaCost) {
        console.log(`Avant - Mana du joueur (${player.name}): ${player.mana}`);
        
        state.monster.pv -= player.abilities[3].damage;
        player.mana -= player.abilities[3].manaCost;
        
        console.log(`Après - Mana du joueur (${player.name}): ${player.mana}`);
        
        state.monster.pv = Math.max(state.monster.pv, 0);
      } else {
        console.log("Pas assez de mana pour utiliser la capacité ultime ou joueur non trouvé.");
      }
    },
    

    hitBack: (state, action) => {
      const hitBackPlayerId = action.payload.id;
      const hitBackPlayer = state.players.find(player => player.id === hitBackPlayerId);
    
      if (hitBackPlayer && hitBackPlayer.status === 'alive') {
        const alivePlayers = state.players.filter(player => player.status === 'alive' && player.id !== hitBackPlayerId);
    
        if (alivePlayers.length > 0) {
          const randomIndex = Math.floor(Math.random() * alivePlayers.length);
          const targetPlayer = alivePlayers[randomIndex];
    
          targetPlayer.pv -= 5;
    
          if (targetPlayer.pv < 0) {
            targetPlayer.pv = 0;
          }
        }
      }
    },

    MonsterSpecials: (state) => {
      const monster = state.monster;

      if (monster.status === 'alive' && monster.specialAttack) {
        const randomPlayerIndex = Math.floor(Math.random() * state.players.length);
        const targetPlayer = state.players[randomPlayerIndex];

        const specialAttackDamage = monster.specialAttack[0].damage;
        targetPlayer.pv -= specialAttackDamage;

        if (targetPlayer.pv < 0) {
          targetPlayer.pv = 0;
        }

        console.log(`Monster used special attack on ${targetPlayer.name}! Damage: ${specialAttackDamage}`);
      }
    },

    GiganticRoar: (state) => {
      const monster = state.monster;

      if (monster.status === 'alive' && monster.specialAttack) {
        state.players = state.players.map((targetPlayer) => {
          const specialAttackDamage = monster.specialAttack[1].damage;
          const updatedPlayer = {
            ...targetPlayer,
            pv: Math.max(targetPlayer.pv - specialAttackDamage, 0),
          };
    
          console.log(`Monster used Gigantic Roar on ${updatedPlayer.name}! Damage: ${specialAttackDamage}`);
    
          return updatedPlayer;
        });
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
      const monsterDead = state.monster.pv <= 0;

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

     
        state.currentTurn += 1;
      }
    },

    playerPlayed: (state, action) => {
      const playerId = action.payload.playerId;

      if (!state.playersWhoPlayed.includes(playerId)) {
        state.playersWhoPlayed.push(playerId);
       
      }
    },

    resetPlayersWhoPlayed: (state) => {
      state.playersWhoPlayed = [];

    },

    setActionMessage: (state, action) => {
      state.actionMessage = action.payload;
    },

    clearActionMessage: (state) => {
      state.actionMessage = '';
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
  endTurn,
  specialAttackMonster, 
  HealAbility,
  getSecondAbility,
  KiChargeAbility,
  UltimateAbility,
  playerPlayed,
  MonsterSpecials,
  resetPlayersWhoPlayed,
  toggleCheckbox,
  GiganticRoar,
  setActionMessage,
  clearActionMessage

} = fightSlice.actions;


